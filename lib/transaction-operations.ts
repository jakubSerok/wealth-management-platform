import { CreateTransactionData, TransactionFilters } from "@/features/transactions/types";
import {db} from "@/lib/db"

export async function createTransactionWithBalance(data:CreateTransactionData) {
    return await db.$transaction(async (tx)=>{
       const transaction = await tx.transaction.create({
      data: {
        amount: data.amount,
        type: data.type,
        description: data.description,
        accountId: data.accountId,
        categoryId: data.categoryId,
        date: data.date ?? new Date(),
        isRecurring: data.isRecurring ?? false,
        tags: data.tags ?? [],
      },
    });
        const isIncome = data.type === "INCOME"
        const amountChange = isIncome ? data.amount : -data.amount;

       await tx.account.update({
      where: { id: data.accountId },
      data: {
        balance: {
          increment: amountChange,
        },
      },
    });

    return transaction;
    })
    
}
export async function getTransactionsFromDb(userId: string, filters: TransactionFilters) {
  const transactions = await db.transaction.findMany({
    where: {
      account: { userId },  
      accountId: filters.accountId,
      categoryId: filters?.categoryId,
      type: filters?.type,
      date: {
        gte: filters?.dateFrom,
        lte: filters?.dateTo,
      },
      tags: filters.tags ? { hasEvery: filters.tags } : undefined,
    },
    include: {
      account: true,
      category: true,
    },
    orderBy: { date: "desc" },
    take: filters.limit,
    skip: filters.offset,
  });

  // Konwertuj Decimal na number dla kompatybilności z frontendem
  return transactions.map(t => ({
    ...t,
    amount: Number(t.amount),
    account: {
      ...t.account,
      balance: Number(t.account.balance),
    }
  }));
}