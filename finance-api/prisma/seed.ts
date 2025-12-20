// prisma/seed.ts

import { PrismaClient, AccountType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Test user үүсгэх
  const hashedPassword = await bcrypt.hash("test123", 10);

  const user = await prisma.user.upsert({
    where: { email: "accountant@nygtlan.mn" },
    update: {},
    create: {
      email: "accountant@nygtlan.mn",
      username: "accountant",
      password: hashedPassword,
    },
  });
  console.log("✅ User created:", user.email);

  // 2. Test company үүсгэх
  const company = await prisma.company.upsert({
    where: { taxId: "1234567" },
    update: {},
    create: {
      name: "Тест ХХК",
      taxId: "1234567",
      userId: user.id,
    },
  });
  console.log("✅ Company created:", company.name);

  // 3. Chart of Accounts үүсгэх
  const accounts = [
    { code: "1101", name: "Бэлэн мөнгө", type: AccountType.ASSET },
    { code: "1001", name: "Банк", type: AccountType.ASSET },
    { code: "1330", name: "Бараа материал", type: AccountType.ASSET },
    { code: "3310", name: "Өглөг", type: AccountType.LIABILITY },
    { code: "3360", name: "Цалин төлөх", type: AccountType.LIABILITY },
    { code: "4110", name: "Үндсэн капитал", type: AccountType.EQUITY },
    { code: "6111", name: "Борлуулалтын орлого", type: AccountType.REVENUE },
    { code: "6220", name: "Цалингийн зардал", type: AccountType.EXPENSE },
    { code: "7210", name: "Бараа худалдан авалт", type: AccountType.EXPENSE },
  ];

  for (const acc of accounts) {
    await prisma.account.upsert({
      where: {
        code_companyId: {
          code: acc.code,
          companyId: company.id,
        },
      },
      update: {},
      create: { ...acc, companyId: company.id },
    });
  }
  console.log("✅ Created", accounts.length, "accounts");

  // 4. Sample journal entry (Бараа худалдан авалт)
  const account1 = await prisma.account.findFirst({
    where: { code: "7210", companyId: company.id },
  });
  const account2 = await prisma.account.findFirst({
    where: { code: "3310", companyId: company.id },
  });

  if (account1 && account2) {
    await prisma.journalEntry.create({
      data: {
        date: new Date(),
        description: "Бараа худалдан авалт",
        companyId: company.id,
        lines: {
          create: [
            {
              accountId: account1.id,
              debit: 500000,
              credit: 0,
            },
            {
              accountId: account2.id,
              debit: 0,
              credit: 500000,
            },
          ],
        },
      },
    });
    console.log("✅ Journal entry created");
  }

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
