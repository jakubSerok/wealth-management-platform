import { db } from "./db";

// Exchange rates - in real app these would come from an API
const EXCHANGE_RATES = {
  EUR: 4.35, // 1 EUR = 4.35 PLN
  USD: 4.1, // 1 USD = 4.10 PLN
  GBP: 5.2, // 1 GBP = 5.20 PLN
};

// Convert amount to PLN
export function convertToPLN(amount: number, currency: string): number {
  const rate = EXCHANGE_RATES[currency as keyof typeof EXCHANGE_RATES];
  return rate ? amount * rate : amount; // if no rate, assume PLN
}

// Get currency from account type or name
export function getAccountCurrency(
  accountType: string,
  accountName?: string,
): string {
  // Simple logic - in real app this would be stored in account data
  if (
    accountName?.toLowerCase().includes("eur") ||
    accountType.toLowerCase().includes("eur")
  ) {
    return "EUR";
  }
  if (
    accountName?.toLowerCase().includes("usd") ||
    accountType.toLowerCase().includes("usd")
  ) {
    return "USD";
  }
  if (
    accountName?.toLowerCase().includes("gbp") ||
    accountType.toLowerCase().includes("gbp")
  ) {
    return "GBP";
  }
  return "PLN"; // default
}

// Calculate account balance at specific date by working backwards from current balance
export async function getAccountBalanceAtDate(
  accountId: string,
  targetDate: Date,
): Promise<number> {
  // Get current balance
  const account = await db.account.findUnique({
    where: { id: accountId },
    select: { balance: true, currency: true, type: true, name: true },
  });

  if (!account) return 0;

  const currentBalance = Number(account.balance || 0);

  // Get all transactions after the target date that affected this account
  const transactionsAfter = await db.transaction.findMany({
    where: {
      accountId,
      date: {
        gt: targetDate,
      },
    },
    select: { type: true, amount: true },
  });

  // Calculate balance at target date
  // For expenses and transfers out, we add back the amount (they reduced the balance)
  // For income and transfers in, we subtract the amount (they increased the balance)
  let adjustment = 0;
  transactionsAfter.forEach((tx) => {
    const amount = Number(tx.amount);
    switch (tx.type) {
      case "EXPENSE":
      case "TRANSFER_OUT":
      case "INVESTMENT":
        adjustment += amount; // These reduced balance, so add back
        break;
      case "INCOME":
      case "TRANSFER_IN":
      case "DIVIDEND":
      case "INTEREST":
        adjustment -= amount; // These increased balance, so subtract
        break;
    }
  });

  const balanceAtDate = currentBalance + adjustment;
  const currency =
    account.currency || getAccountCurrency(account.type, account.name);

  return convertToPLN(balanceAtDate, currency);
}

// Calculate total net worth at specific date for a user
export async function getNetWorthAtDate(
  userId: string,
  targetDate: Date,
): Promise<number> {
  // Get all user accounts
  const userAccounts = await db.account.findMany({
    where: { userId },
    select: { id: true },
  });

  let totalBalance = 0;

  // Calculate balance for each account at the target date
  for (const account of userAccounts) {
    const balanceAtDate = await getAccountBalanceAtDate(account.id, targetDate);
    totalBalance += balanceAtDate;
  }

  return totalBalance;
}

// Get net worth breakdown by account type at specific date
export async function getNetWorthByTypeAtDate(
  userId: string,
  targetDate: Date,
): Promise<Array<{ type: string; _sum: { balance: number } }>> {
  // Get all user accounts with their details
  const userAccounts = await db.account.findMany({
    where: { userId },
    select: { id: true, type: true, name: true, balance: true, currency: true },
  });

  const accountsMap = new Map<string, { balance: number; count: number }>();

  // Calculate balance for each account at the target date
  for (const account of userAccounts) {
    const balanceAtDate = await getAccountBalanceAtDate(account.id, targetDate);

    const existing = accountsMap.get(account.type);
    if (existing) {
      existing.balance += balanceAtDate;
      existing.count += 1;
    } else {
      accountsMap.set(account.type, { balance: balanceAtDate, count: 1 });
    }
  }

  // Convert to expected format
  return Array.from(accountsMap.entries()).map(
    ([type, data]: [string, { balance: number; count: number }]) => ({
      type,
      _sum: { balance: data.balance },
    }),
  );
}

// Get recent transactions for a user
export async function getRecentTransactions(userId: string) {
  const userAccounts = await db.account.findMany({
    where: { userId },
    select: { id: true, name: true, type: true },
  });

  const accountIds = userAccounts.map((acc) => acc.id);
  const accountMap = new Map(userAccounts.map((acc) => [acc.id, acc]));

  const transactions = await db.transaction.findMany({
    where: {
      accountId: { in: accountIds },
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // last 30 days
      },
    },
    orderBy: { date: "desc" },
    take: 50,
    select: {
      id: true,
      amount: true,
      type: true,
      description: true,
      date: true,
      accountId: true,
    },
  });

  return transactions.map((tx) => ({
    id: tx.id,
    amount: Number(tx.amount), // Convert Decimal to number
    type: tx.type,
    description: tx.description,
    date: tx.date,
    accountId: tx.accountId,
    accountName: accountMap.get(tx.accountId)?.name,
    accountType: accountMap.get(tx.accountId)?.type,
  }));
}

// Get monthly dividends data for a user
export async function getMonthlyDividends(userId: string) {
  const currentMonth = new Date();
  const months: { month: string; amount: number }[] = [];

  // Get user's account IDs first
  const userAccounts = await db.account.findMany({
    where: { userId },
    select: { id: true },
  });

  const accountIds = userAccounts.map((acc) => acc.id);

  for (let i = 5; i >= 0; i--) {
    const month = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - i,
      1,
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - i + 1,
      0,
    );

    const monthlyDividends = await db.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        accountId: {
          in: accountIds,
        },
        type: "DIVIDEND",
        date: {
          gte: month,
          lte: endOfMonth,
        },
      },
    });

    months.push({
      month: month.toLocaleString("default", { month: "short" }),
      amount: Number(monthlyDividends._sum?.amount || 0), // Convert Decimal to number
    });
  }

  return months;
}

// Get monthly net worth data for a user
export async function getMonthlyNetWorth(userId: string) {
  const currentMonth = new Date();
  const months: { month: string; value: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const month = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - i,
      1,
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - i + 1,
      0,
    );

    // Calculate net worth at the end of each month
    const totalBalance = await getNetWorthAtDate(userId, endOfMonth);

    months.push({
      month: month.toLocaleString("default", { month: "short" }),
      value: totalBalance,
    });
  }

  return months;
}
