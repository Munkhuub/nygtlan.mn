import { AccountType, NormalSide } from "@prisma/client";

type DefaultAccountDefinition = {
  code: string;
  name: string;
  type: AccountType;
  normalSide: NormalSide;
  isTaxAccount?: boolean;
  description?: string;
};

type AccountLoaderDb = {
  account: {
    createMany: (args: {
      data: Array<{
        code: string;
        name: string;
        type: AccountType;
        normalSide: NormalSide;
        companyId: number;
        level: number;
        isTaxAccount?: boolean;
        description?: string;
      }>;
      skipDuplicates: boolean;
    }) => Promise<{ count: number }>;
    count: (args: { where: { companyId: number } }) => Promise<number>;
  };
};

export const defaultMongolianAccounts: DefaultAccountDefinition[] = [
  {
    code: "100001",
    name: "Кассад байгаа бэлэн мөнгө",
    type: AccountType.CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "110001",
    name: "Банкинд байгаа мөнгө",
    type: AccountType.CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "120001",
    name: "Дансны авлага",
    type: AccountType.CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "120002",
    name: "Бусад авлага",
    type: AccountType.CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "130001",
    name: "Богино хугацаат хөрөнгө оруулалт",
    type: AccountType.CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "140001",
    name: "Түүхий эд, материал",
    type: AccountType.CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "140002",
    name: "Дуусаагүй үйлдвэрлэл",
    type: AccountType.CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "150001",
    name: "Бэлэн бүтээгдэхүүн, бараа",
    type: AccountType.CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "150002",
    name: "Материал, сав баглаа, боодол",
    type: AccountType.CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "150003",
    name: "Түлш шатахуун",
    type: AccountType.CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "150004",
    name: "Сэлбэг хэрэгсэл",
    type: AccountType.CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "150005",
    name: "Мал",
    type: AccountType.CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "150006",
    name: "Ажлын хувцас, бусад",
    type: AccountType.CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "180001",
    name: "Урьдчилж төлсөн зардал/тооцоо",
    type: AccountType.CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "200001",
    name: "Барилга",
    type: AccountType.NON_CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "200101",
    name: "Барилгын хуримтлагдсан элэгдэл",
    type: AccountType.NON_CURRENT_ASSET,
    normalSide: NormalSide.CREDIT,
  },
  {
    code: "200002",
    name: "Тоног төхөөрөмж",
    type: AccountType.NON_CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "200102",
    name: "Тоног төхөөрөмжийн хуримтлагдсан элэгдэл",
    type: AccountType.NON_CURRENT_ASSET,
    normalSide: NormalSide.CREDIT,
  },
  {
    code: "200003",
    name: "Тээврийн хэрэгсэл",
    type: AccountType.NON_CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "200103",
    name: "Тээврийн хэрэгслийн хуримтлагдсан элэгдэл",
    type: AccountType.NON_CURRENT_ASSET,
    normalSide: NormalSide.CREDIT,
  },
  {
    code: "200004",
    name: "Компьютер, түүний дагалдах хэрэгсэл",
    type: AccountType.NON_CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "200104",
    name: "Компьютерийн хуримтлагдсан элэгдэл",
    type: AccountType.NON_CURRENT_ASSET,
    normalSide: NormalSide.CREDIT,
  },
  {
    code: "210001",
    name: "Биет бус хөрөнгө",
    type: AccountType.NON_CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "220001",
    name: "Хөрөнгө оруулалт",
    type: AccountType.NON_CURRENT_ASSET,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "310001",
    name: "Дансны өглөг",
    type: AccountType.CURRENT_LIABILITY,
    normalSide: NormalSide.CREDIT,
  },
  {
    code: "310002",
    name: "Бусад өглөг",
    type: AccountType.CURRENT_LIABILITY,
    normalSide: NormalSide.CREDIT,
  },
  {
    code: "310003",
    name: "НДШ-ийн өглөг",
    type: AccountType.CURRENT_LIABILITY,
    normalSide: NormalSide.CREDIT,
    isTaxAccount: true,
  },
  {
    code: "310004",
    name: "ХАОАТ-ын өр",
    type: AccountType.CURRENT_LIABILITY,
    normalSide: NormalSide.CREDIT,
    isTaxAccount: true,
  },
  {
    code: "310005",
    name: "ААНОАТ-ын өр",
    type: AccountType.CURRENT_LIABILITY,
    normalSide: NormalSide.CREDIT,
    isTaxAccount: true,
  },
  {
    code: "310006",
    name: "НӨАТ-ын өр",
    type: AccountType.CURRENT_LIABILITY,
    normalSide: NormalSide.CREDIT,
    isTaxAccount: true,
  },
  {
    code: "310007",
    name: "Бусад татварын өр",
    type: AccountType.CURRENT_LIABILITY,
    normalSide: NormalSide.CREDIT,
    isTaxAccount: true,
  },
  {
    code: "320001",
    name: "Урьдчилан төлөгдсөн орлого",
    type: AccountType.CURRENT_LIABILITY,
    normalSide: NormalSide.CREDIT,
  },
  {
    code: "410001",
    name: "Эзэмшигчдийн өмч",
    type: AccountType.EQUITY,
    normalSide: NormalSide.CREDIT,
  },
  {
    code: "510001",
    name: "Борлуулалт",
    type: AccountType.REVENUE,
    normalSide: NormalSide.CREDIT,
  },
  {
    code: "520001",
    name: "Борлуулалтын хөнгөлөлт",
    type: AccountType.REVENUE,
    normalSide: NormalSide.CREDIT,
    description: "Орлогын эсрэг данс.",
  },
  {
    code: "610001",
    name: "Борлуулсан бүтээгдэхүүний өртөг",
    type: AccountType.COST_OF_GOODS_SOLD,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "700001",
    name: "Цалингийн зардал",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "700002",
    name: "НДШ-ийн зардал",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
    isTaxAccount: true,
  },
  {
    code: "700003",
    name: "Татварын зардал",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
    isTaxAccount: true,
  },
  {
    code: "700004",
    name: "Шатахууны зардал",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "700005",
    name: "Бичиг хэргийн зардал",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "700006",
    name: "Шуудан холбооны зардал",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "710001",
    name: "Борлуулалтын зардал",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "710002",
    name: "Удирдлагын зардал",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "710003",
    name: "Цалингийн зардал (удирдлага)",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "710004",
    name: "НДШ-ийн зардал (удирдлага)",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
    isTaxAccount: true,
  },
  {
    code: "710005",
    name: "Шатахууны зардал (удирдлага)",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "710006",
    name: "Бичиг хэргийн зардал (удирдлага)",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "710007",
    name: "Шуудан холбооны зардал (удирдлага)",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "710008",
    name: "Банкны үйлчилгээний зардал",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "710009",
    name: "Элэгдлийн зардал",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "840001",
    name: "Үндсэн бус үйл ажиллагааны ашиг (олз)",
    type: AccountType.REVENUE,
    normalSide: NormalSide.CREDIT,
  },
  {
    code: "870001",
    name: "Үндсэн бус үйл ажиллагааны алдагдал (гарз)",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
  },
  {
    code: "910001",
    name: "Орлогын албан татварын зардал",
    type: AccountType.EXPENSE,
    normalSide: NormalSide.DEBIT,
    isTaxAccount: true,
  },
  {
    code: "920001",
    name: "Орлого, зарлагын нэгдсэн данс",
    type: AccountType.EQUITY,
    normalSide: NormalSide.CREDIT,
    description: "Тайлант хугацааны хаалтын бичилтэд ашиглаж болно.",
  },
];

export const loadDefaultAccountsForCompany = async (
  db: AccountLoaderDb,
  companyId: number,
) => {
  const insertResult = await db.account.createMany({
    data: defaultMongolianAccounts.map((account) => ({
      ...account,
      level: 0,
      companyId,
    })),
    skipDuplicates: true,
  });

  const totalCompanyAccounts = await db.account.count({
    where: { companyId },
  });

  return {
    insertedCount: insertResult.count,
    skippedCount: defaultMongolianAccounts.length - insertResult.count,
    totalDefaultCount: defaultMongolianAccounts.length,
    totalCompanyAccounts,
  };
};
