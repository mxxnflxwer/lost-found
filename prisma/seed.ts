import { prisma } from "../src/lib/db";
import * as crypto from "crypto";

function hash(p: string) { return crypto.createHash("sha256").update(p).digest("hex"); }

async function main() {
  // Admin user
  await prisma.user.upsert({
    where: { email: "admin@lostfound.app" },
    update: {},
    create: { email: "admin@lostfound.app", password: hash("admin123"), name: "Admin", role: "ADMIN" },
  });

  // Demo user
  const demo = await prisma.user.upsert({
    where: { email: "demo@lostfound.app" },
    update: {},
    create: { email: "demo@lostfound.app", password: hash("demo123"), name: "Demo User" },
  });

  // Sample items
  await prisma.item.createMany({
    data: [
      { type: "LOST", name: "Blue Backpack", category: "Bags / Backpacks", description: "Navy blue Nike backpack with a laptop compartment", location: "Central Library", date: new Date("2026-03-20"), contactEmail: "demo@lostfound.app", userId: demo.id, phone: "1234567890" },
      { type: "FOUND", name: "Nike Backpack", category: "Bags / Backpacks", description: "Found a dark blue Nike backpack near the library entrance", location: "Central Library entrance", date: new Date("2026-03-21"), contactEmail: "finder@example.com", userId: demo.id, phone: "0987654321" },
      { type: "LOST", name: "AirPods Pro", category: "Electronics", description: "White AirPods Pro with charging case, lightning port", location: "Cafeteria", date: new Date("2026-03-22"), contactEmail: "demo@lostfound.app", userId: demo.id, phone: "5551234444" },
    ],
  });

  console.log("✅ Database seeded!");
  console.log("Admin: admin@lostfound.app / admin123");
  console.log("User:  demo@lostfound.app  / demo123");
}
main().catch(console.error).finally(() => prisma.$disconnect());
