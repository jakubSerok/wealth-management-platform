"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  convertToPLN,
  getAccountCurrency,
  getNetWorthAtDate,
  getNetWorthByTypeAtDate,
  getRecentTransactions,
  getMonthlyDividends,
  getMonthlyNetWorth,
} from "@/lib/net-worth-calculations";

export async function getProfileStats() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31);
  const lastYearStart = new Date(currentYear - 1, 0, 1);
  const lastYearEnd = new Date(currentYear - 1, 11, 31);

  // Get current account balances (actual net worth) with currency conversion
  const userAccounts = await db.account.findMany({
    where: {
      userId: session.user.id,
      isActive: true,
    },
    select: { id: true, type: true, name: true, balance: true, currency: true },
  });

  // Group by type and convert to PLN
  const currentAccountsMap = new Map<
    string,
    { balance: number; count: number }
  >();

  userAccounts.forEach((account) => {
    const currency =
      account.currency || getAccountCurrency(account.type, account.name);
    const balanceInPLN = convertToPLN(Number(account.balance), currency);

    const existing = currentAccountsMap.get(account.type);
    if (existing) {
      existing.balance += balanceInPLN;
      existing.count += 1;
    } else {
      currentAccountsMap.set(account.type, { balance: balanceInPLN, count: 1 });
    }
  });

  const currentAccounts = Array.from(currentAccountsMap.entries()).map(
    ([type, data]) => ({
      type,
      _sum: { balance: data.balance }, // Already converted to PLN
    }),
  );

  // Get last year net worth at the end of last year for comparison
  const lastYearNetWorth = await getNetWorthByTypeAtDate(
    session.user.id,
    lastYearEnd,
  );

  // Get dividends from transactions (dividends should be from transactions)
  const dividends = await db.$transaction(async (tx) => {
    const userAccounts = await db.account.findMany({
      where: { userId: session.user.id },
      select: { id: true },
    });

    const accountIds = userAccounts.map((acc) => acc.id);

    const transaction = await db.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        accountId: {
          in: accountIds,
        },
        type: "DIVIDEND",
        date: {
          gte: startOfYear,
        },
      },
    });

    return transaction._sum?.amount ? Number(transaction._sum.amount) : 0; // Convert Decimal to number
  });

  // Get monthly net worth data for the last 6 months
  const monthlyData = await getMonthlyNetWorth(session.user.id);

  // Get monthly dividends data for last 6 months
  const monthlyDividends = await getMonthlyDividends(session.user.id);

  // Get recent transactions for net worth calculation
  const recentTransactions = await getRecentTransactions(session.user.id);

  return {
    netWorth: currentAccounts,
    lastYearNetWorth,
    totalDividends: dividends,
    monthlyData,
    monthlyDividends,
    recentTransactions,
  };
}
