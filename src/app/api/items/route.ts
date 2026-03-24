import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { computeMatchScore, MATCH_THRESHOLD } from "@/lib/matching";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const mine = searchParams.get("mine");

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (mine && session) where.userId = session.id;

  const items = await prisma.item.findMany({
    where,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type, name, category, description, location, date, imageUrl, contactEmail } = body;

  if (!type || !name || !category || !description || !location || !date || !contactEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Prevent duplicate (same user, same name, same date)
  const existing = await prisma.item.findFirst({
    where: { userId: session.id, name, date: new Date(date) },
  });
  if (existing) return NextResponse.json({ error: "Duplicate item report" }, { status: 409 });

  const item = await prisma.item.create({
    data: { type, name, category, description, location, date: new Date(date), imageUrl, contactEmail, userId: session.id },
  });

  // Auto-match: find opposite type items and score them
  const oppositeType = type === "LOST" ? "FOUND" : "LOST";
  const candidates = await prisma.item.findMany({
    where: { type: oppositeType, category, status: "PENDING" },
  });

  for (const candidate of candidates) {
    const lostItem = type === "LOST" ? item : candidate;
    const foundItem = type === "FOUND" ? item : candidate;
    const score = computeMatchScore(lostItem, foundItem);
    if (score >= MATCH_THRESHOLD) {
      await prisma.match.create({
        data: { lostItemId: lostItem.id, foundItemId: foundItem.id, score },
      });
      await prisma.item.updateMany({ where: { id: { in: [lostItem.id, foundItem.id] } }, data: { status: "MATCHED" } });
    }
  }

  return NextResponse.json(item, { status: 201 });
}
