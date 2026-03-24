import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
  const matches = await prisma.match.findMany({
    include: {
      lostItem: { include: { user: { select: { name: true, email: true } } } },
      foundItem: { include: { user: { select: { name: true, email: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(matches);
}

export async function PATCH(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
  const { matchId, action } = await req.json(); // action: "approve" | "reject"
  if (!matchId || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "approve") {
    await prisma.match.update({ where: { id: matchId }, data: { status: "APPROVED" } });
    await prisma.item.updateMany({
      where: { id: { in: [match.lostItemId, match.foundItemId] } },
      data: { status: "RESOLVED" },
    });
  } else if (action === "reject") {
    await prisma.match.update({ where: { id: matchId }, data: { status: "REJECTED" } });
    await prisma.item.updateMany({
      where: { id: { in: [match.lostItemId, match.foundItemId] } },
      data: { status: "PENDING" },
    });
  }

  return NextResponse.json({ success: true });
}
