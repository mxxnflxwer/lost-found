import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { computeMatchScore, MATCH_THRESHOLD } from "@/lib/matching";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const mine = searchParams.get("mine");
  const query = searchParams.get("q")?.toLowerCase();

  const where: any = {};
  if (type) where.type = type;
  if (mine && session) where.userId = session.id;
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { category: { contains: query } },
      { description: { contains: query } },
      { location: { contains: query } },
    ];
  }

  const items = await prisma.item.findMany({
    where,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Security: redact contact details based on role and status
  const redacted = items.map(item => {
    const isAdmin = session?.role === "ADMIN";
    const isOwner = session?.id === item.userId;
    const isResolved = item.status === "RESOLVED";

    if (isAdmin || isOwner || isResolved) {
      return item;
    }
    
    // Hide contact details for others unless resolved
    return {
      ...item,
      contactEmail: "HIDDEN",
      phone: "HIDDEN",
    };
  });

  return NextResponse.json(redacted);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type, name, category, description, location, date, imageUrl, contactEmail, phone } = body;

  if (!type || !name || !category || !description || !location || !date || !contactEmail || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const item = await prisma.item.create({
    data: { 
      type, name, category, description, location, 
      date: new Date(date), imageUrl, contactEmail, phone, userId: session.id 
    },
  });

  // Auto-match logic
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
        data: { lostItemId: lostItem.id, foundItemId: foundItem.id, score, status: "UNDER_REVIEW" },
      });
      
      await (prisma as any).notification.createMany({
        data: [
          { userId: item.userId, title: "Potential Match", message: `Match found for "${item.name}"!` },
          { userId: candidate.userId, title: "Potential Match", message: `Match found for "${candidate.name}"!` }
        ]
      });
    }
  }

  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (item.userId !== session.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const updatedItem = await prisma.item.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updatedItem);
}
