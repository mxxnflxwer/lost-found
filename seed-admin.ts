import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  const email = "admin@lostfound.app";
  const password = "adminpassword";
  const hashedPassword = hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: "ADMIN" },
    create: {
      email,
      password: hashedPassword,
      name: "System Admin",
      role: "ADMIN",
    },
  });

  console.log("Admin user ensured:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
