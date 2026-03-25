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

  const match = await prisma.match.findUnique({ 
    where: { id: matchId },
    select: {
      id: true, lostItemId: true, foundItemId: true,
      lostItem: { select: { userId: true, name: true, contactEmail: true, phone: true } },
      foundItem: { select: { userId: true, name: true, contactEmail: true, phone: true } }
    }
  });
  if (!match) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const m = match as any;

  if (action === "approve") {
    await prisma.match.update({ where: { id: matchId }, data: { status: "APPROVED" } });
    await prisma.item.updateMany({
      where: { id: { in: [m.lostItemId, m.foundItemId] } },
      data: { status: "MATCHED" },
    });
    await prisma.notification.createMany({
      data: [
        { userId: m.lostItem.userId, title: "Match Found!", message: `A match has been found and verified for your item: "${m.lostItem.name}". Visit your dashboard for details.` },
        { userId: m.foundItem.userId, title: "Match Found!", message: `A match has been found and verified for your item: "${m.foundItem.name}". Visit your dashboard for details.` }
      ]
    });
  } else if (action === "resolve") {
    await prisma.match.update({ where: { id: matchId }, data: { status: "RESOLVED" } });
    await prisma.item.updateMany({
      where: { id: { in: [m.lostItemId, m.foundItemId] } },
      data: { status: "RESOLVED" },
    });
    // share contact info privately via notification
    await prisma.notification.createMany({
      data: [
        { userId: m.lostItem.userId, title: "Case Resolved!", message: `Contact reported user: ${m.foundItem.contactEmail} / ${m.foundItem.phone}` },
        { userId: m.foundItem.userId, title: "Case Resolved!", message: `Contact reporter user: ${m.lostItem.contactEmail} / ${m.lostItem.phone}` }
      ]
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
