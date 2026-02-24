import { auth } from "@/auth";
import { db } from "@/lib/db";
import { GoalCategory } from "./types";

export async function getGoals() {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const goals = await db.financialGoal.findMany({
      where: { userId: session.user.id },
      include: {
        account: {
          select: { id: true, name: true, balance: true, currency: true },
        },
      },
    });

    const goalsWithProgress = goals.map((goal) => {
      const currentAmount = goal.account?.balance?.toNumber() || 0;
      const targetAmount = goal.targetAmount.toNumber();

      const percentage =
        targetAmount === 0
          ? 0
          : Math.min((currentAmount / targetAmount) * 100, 100);
      const remaining = Math.max(targetAmount - currentAmount, 0);

      let daysLeft: number | undefined;
      if (goal.targetDate) {
        const now = new Date();
        const target = new Date(goal.targetDate);
        daysLeft = Math.ceil(
          (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (daysLeft < 0) daysLeft = 0;
      }

      return {
        ...goal,
        category: goal.category as GoalCategory, // Convert Prisma enum to local enum
        account: goal.account
          ? {
              ...goal.account,
              balance: goal.account.balance.toNumber(),
            }
          : null,
        currentAmount,
        targetAmount: goal.targetAmount.toNumber(), // Convert Decimal to number
        percentage,
        remaining,
        daysLeft,
      };
    });

    return goalsWithProgress;
  } catch (error) {
    console.error("Query Error:", error);
    return [];
  }
}
