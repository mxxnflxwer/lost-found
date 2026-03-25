import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const item = await prisma.item.findUnique({
    where: { id: params.id },
  });

  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Security Rule: Only the owner or an admin can see the item's contact info unless it's RESOLVED 
  // Wait, the detail page needs to know if it can show contact info.
  // Actually, any user can browse items, but the contact info should be hidden unless certain conditions are met.
  
  const isOwner = item.userId === session.id;
  const isAdmin = session.role === "ADMIN";
  const isResolved = item.status === "RESOLVED";

  // Hide contact info if not allowed
  if (!isOwner && !isAdmin && !isResolved) {
    (item as any).contactEmail = "HIDDEN (Pending Verification)";
    (item as any).phone = "HIDDEN (Pending Verification)";
  }

  return NextResponse.json(item);
}
