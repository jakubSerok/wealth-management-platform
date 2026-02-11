"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getBudgetQuery() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const budgets = await db.budget.findMany({
      where: { userId: session.user.id },
      include: {
        account: { select: { name: true } },
        category: { select: { name: true, icon: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        // Pobierz ID kont użytkownika dla tego budżetu
        const userAccounts = await db.account.findMany({
          where: { userId: session.user.id },
          select: { id: true },
        });

        const accountIds = userAccounts.map((acc) => acc.id);

        // Filtrowanie transakcji - tylko dla kont użytkownika i w zakresie dat
        const whereClause: any = {
          accountId: { in: accountIds },
          type: "EXPENSE",
          date: {
            gte: budget.startDate,
            lte: budget.endDate,
          },
        };

        // Dodaj filtrowanie po kategorii i koncie jeśli są określone w budżecie
        if (budget.categoryId) {
          whereClause.categoryId = budget.categoryId;
        }
        if (budget.accountId) {
          whereClause.accountId = budget.accountId;
        }

        const aggregation = await db.transaction.aggregate({
          _sum: {
            amount: true,
          },
          where: whereClause,
        });

        const spent = aggregation._sum?.amount?.toNumber() || 0;
        const limit = budget.amount.toNumber();
        const percentage =
          limit === 0 ? 0 : Math.min((spent / limit) * 100, 100);

        return {
          ...budget,
          spent,
          percentage,
          amount: budget.amount.toNumber(), // Konwertuj Decimal na number
        };
      }),
    );

    return budgetsWithProgress;
  } catch (error) {
    console.error("Query Error:", error);
    return [];
  }
}
