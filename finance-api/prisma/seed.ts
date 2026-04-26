// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { loadDefaultAccountsForCompany } from "../src/lib/default-mongolian-accounts";

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
  const defaultAccountResult = await loadDefaultAccountsForCompany(
    prisma,
    company.id,
  );
  console.log("✅ Created", defaultAccountResult.insertedCount, "accounts");

  // 4. Sample journal entry (Бараа худалдан авалт)
  const account1 = await prisma.account.findFirst({
    where: { code: "610001", companyId: company.id },
  });
  const account2 = await prisma.account.findFirst({
    where: { code: "310001", companyId: company.id },
  });

  if (account1 && account2) {
    const existingJournalEntry = await prisma.journalEntry.findFirst({
      where: {
        companyId: company.id,
        entryNumber: "SEED-0001",
      },
    });

    if (!existingJournalEntry) {
      await prisma.journalEntry.create({
        data: {
          entryNumber: "SEED-0001",
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
