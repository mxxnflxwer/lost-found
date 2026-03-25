const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up existing data...");
  await prisma.notification.deleteMany();
  await prisma.match.deleteMany();
  await prisma.item.deleteMany();
  
  const demoEmails = [
    "admin@gmail.com", "raj@gmail.com", "raj1@gmail.com", "raj2@gmail.com", 
    "raj3@gmail.com", "raj4@gmail.com", "raj5@gmail.com", "raj6@gmail.com", 
    "raj7@gmail.com", "raj8@gmail.com", "raj9@gmail.com"
  ];
  
  await prisma.user.deleteMany({ where: { email: { in: demoEmails } } });

  const password = await bcrypt.hash("123456", 10);

  console.log("Creating 11 realistic demo users...");

  const admin = await prisma.user.create({
    data: { name: "Admin User", email: "admin@gmail.com", password, role: "ADMIN" }
  });

  const usersData = [
    { name: "Rajesh Kumar", email: "raj@gmail.com" },
    { name: "Karthik Raja", email: "raj1@gmail.com" },
    { name: "Priya Lakshmi", email: "raj2@gmail.com" },
    { name: "Aravind Kumar", email: "raj3@gmail.com" },
    { name: "Divya Bharathi", email: "raj4@gmail.com" },
    { name: "Suresh Babu", email: "raj5@gmail.com" },
    { name: "Nandhini R", email: "raj6@gmail.com" },
    { name: "Vigneshwaran S", email: "raj7@gmail.com" },
    { name: "Keerthana M", email: "raj8@gmail.com" },
    { name: "Praveen Kumar", email: "raj9@gmail.com" },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: { ...u, password, role: "USER" }
    });
    createdUsers.push(user);
  }

  console.log("Generating 16 demo items and linking to users...");

  const IMG = {
    backpack: "/black_backpack_demo_1774426352483.png",
    iphone: "/iphone_demo_1774426370535.png",
    idcard: "/college_id_demo_1774426412342.png",
    keys: "/keys_keychain_demo_1774426428067.png",
    water: "/water_bottle_demo_1774426467919.png",
    watch: "/wrist_watch_demo_1774426488618.png",
    wallet: "https://images.unsplash.com/photo-1627123430985-63df52f84c01?q=80&w=600",
    notebook: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600",
    glasses: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600",
    charger: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600"
  };

  const items = [
    {
      type: "LOST", name: "Black Wildcraft Backpack", category: "Bags / Backpacks",
      description: "Slightly worn black backpack with 3 compartments. Contains a Calculus textbook.",
      location: "Library (Main Reading Hall)", date: new Date("2026-03-24"), status: "MATCHED",
      imageUrl: IMG.backpack, userId: createdUsers[0].id, contactEmail: "raj@gmail.com", phone: "9876543210"
    },
    {
      type: "FOUND", name: "Black Student Backpack", category: "Bags / Backpacks",
      description: "Found at 1st floor reading table. Contains textbooks and some stationery.",
      location: "Library", date: new Date("2026-03-24"), status: "MATCHED",
      imageUrl: IMG.backpack, userId: createdUsers[1].id, contactEmail: "raj1@gmail.com", phone: "7305157247"
    },
    {
      type: "LOST", name: "iPhone 13 (Midnight)", category: "Electronics",
      description: "Black iPhone 13 with a clear silicone case. Lock screen has a sunset wallpaper.",
      location: "Canteen (Ground Floor)", date: new Date("2026-03-25"), status: "RESOLVED",
      imageUrl: IMG.iphone, userId: createdUsers[2].id, contactEmail: "raj2@gmail.com", phone: "7305157247"
    },
    {
      type: "FOUND", name: "Apple iPhone 13", category: "Electronics",
      description: "Found an iPhone on a corner table in the canteen. Clear case, fully charged.",
      location: "Canteen", date: new Date("2026-03-25"), status: "RESOLVED",
      imageUrl: IMG.iphone, userId: createdUsers[3].id, contactEmail: "raj3@gmail.com", phone: "7305157247"
    },
    {
      type: "LOST", name: "Student ID Card (B.E CSE)", category: "Documents / ID",
      description: "ID card ending in 4502. Name: Rahul Sharma. Blue Lanyard.",
      location: "Auditorium", date: new Date("2026-03-23"), status: "MATCHED",
      imageUrl: IMG.idcard, userId: createdUsers[4].id, contactEmail: "raj4@gmail.com", phone: "9123456780"
    },
    {
      type: "FOUND", name: "Lost ID Card with Lanyard", category: "Documents / ID",
      description: "Found near the auditorum entrance row G. Blue lanyard attached.",
      location: "Auditorium Entrance", date: new Date("2026-03-23"), status: "MATCHED",
      imageUrl: IMG.idcard, userId: createdUsers[5].id, contactEmail: "raj5@gmail.com", phone: "7305157247"
    },
    {
      type: "LOST", name: "Keys with Keychain", category: "Keys",
      description: "3 silver keys with a circular metal keychain depicting a mountain peak.",
      location: "Bus Stop (South Gate)", date: new Date("2026-03-25"), status: "PENDING",
      imageUrl: IMG.keys, userId: createdUsers[6].id, contactEmail: "raj6@gmail.com", phone: "9812345678"
    },
    {
      type: "FOUND", name: "Multi-key set", category: "Keys",
      description: "Found keys on the canteen bench. Mountain logo on keychain.",
      location: "Canteen", date: new Date("2026-03-25"), status: "PENDING",
      imageUrl: IMG.keys, userId: createdUsers[7].id, contactEmail: "raj7@gmail.com", phone: "7305157247"
    },
    {
      type: "LOST", name: "Blue Metal Water Bottle", category: "Other",
      description: "Milton blue metallic bottle. Has some scratches on the bottom.",
      location: "Chemistry Lab 2", date: new Date("2026-03-22"), status: "PENDING",
      imageUrl: IMG.water, userId: createdUsers[8].id, contactEmail: "raj8@gmail.com", phone: "9000000001"
    },
    {
      type: "FOUND", name: "Silver Analog Watch", category: "Jewelry / Accessories",
      description: "Casio Edifice watch, silver chain. Found in the washroom area.",
      location: "Boy's Hostel Block A", date: new Date("2026-03-25"), status: "PENDING",
      imageUrl: IMG.watch, userId: createdUsers[9].id, contactEmail: "raj9@gmail.com", phone: "7305157248"
    },
    {
      type: "LOST", name: "Dark Brown Leather Wallet", category: "Wallet / Purse",
      description: "Contains some cash and a library card. No photos inside.",
      location: "Library (2nd Floor)", date: new Date("2026-03-21"), status: "PENDING",
      imageUrl: IMG.wallet, userId: createdUsers[0].id, contactEmail: "raj@gmail.com", phone: "9888877777"
    },
    {
      type: "FOUND", name: "Spiral Notebook (Blue)", category: "Books / Stationery",
      description: "Blue cover, has math notes inside. Found on laboratory desk.",
      location: "ECE Lab", date: new Date("2026-03-25"), status: "PENDING",
      imageUrl: IMG.notebook, userId: createdUsers[1].id, contactEmail: "raj1@gmail.com", phone: "7305157247"
    },
    {
      type: "LOST", name: "Ray-Ban Sunglasses", category: "Jewelry / Accessories",
      description: "Black aviator style. Lost near the fountain area.",
      location: "Library Garden", date: new Date("2026-03-20"), status: "PENDING",
      imageUrl: IMG.glasses, userId: createdUsers[2].id, contactEmail: "raj2@gmail.com", phone: "9111122222"
    },
    {
      type: "FOUND", name: "Fastrack Glasses Case", category: "Jewelry / Accessories",
      description: "Found a black case with sunglasses inside near the park.",
      location: "Central Park", date: new Date("2026-03-25"), status: "PENDING",
      imageUrl: IMG.glasses, userId: createdUsers[3].id, contactEmail: "raj3@gmail.com", phone: "7305157247"
    },
    {
      type: "LOST", name: "Laptop Charger (Type-C)", category: "Electronics",
      description: "65W Dell charger. Left it plugged in near the couch.",
      location: "Co-working Space", date: new Date("2026-03-24"), status: "PENDING",
      imageUrl: IMG.charger, userId: createdUsers[4].id, contactEmail: "raj4@gmail.com", phone: "9444455555"
    },
    {
      type: "FOUND", name: "USB-C Power Adapter", category: "Electronics",
      description: "Found a white charger near the auditorium lobby.",
      location: "Auditorium Lobby", date: new Date("2026-03-25"), status: "PENDING",
      imageUrl: IMG.charger, userId: createdUsers[5].id, contactEmail: "raj5@gmail.com", phone: "7305157247"
    }
  ];

  for (const item of items) {
    await prisma.item.create({ data: item });
  }

  const backpackLost = await prisma.item.findFirst({ where: { name: "Black Wildcraft Backpack" } });
  const backpackFound = await prisma.item.findFirst({ where: { name: "Black Student Backpack" } });
  
  const idLost = await prisma.item.findFirst({ where: { name: "Student ID Card (B.E CSE)" } });
  const idFound = await prisma.item.findFirst({ where: { name: "Lost ID Card with Lanyard" } });

  const phoneLost = await prisma.item.findFirst({ where: { name: "iPhone 13 (Midnight)" } });
  const phoneFound = await prisma.item.findFirst({ where: { name: "Apple iPhone 13" } });

  if (backpackLost && backpackFound) {
    await prisma.match.create({
      data: { lostItemId: backpackLost.id, foundItemId: backpackFound.id, score: 95, status: "APPROVED" }
    });
  }

  if (idLost && idFound) {
    await prisma.match.create({
      data: { lostItemId: idLost.id, foundItemId: idFound.id, score: 90, status: "PENDING" }
    });
  }

  if (phoneLost && phoneFound) {
    await prisma.match.create({
      data: { lostItemId: phoneLost.id, foundItemId: phoneFound.id, score: 100, status: "RESOLVED" }
    });
  }

  console.log("✅ 11 users and 16 items seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
