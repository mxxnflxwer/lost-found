import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  const { id } = await params;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const item = await prisma.item.findUnique({
    where: { id: id },
  });

  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = item.userId === session.id;
  const isAdmin = session.role === "ADMIN";
  const isResolved = item.status === "RESOLVED";

  // Hide contact info if not allowed by security rules
  if (!isOwner && !isAdmin && !isResolved) {
    (item as any).contactEmail = "HIDDEN (Pending Verification)";
    (item as any).phone = "HIDDEN (Pending Verification)";
  }

  return NextResponse.json(item);
}
