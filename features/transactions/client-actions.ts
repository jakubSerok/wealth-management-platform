"use client";

import { TransactionFilters, TransactionWithRelations } from "./types";
import { getTransactionsQuery } from "./queries";
import { getUserAccounts } from "@/features/accounts/queries";
import { getUserCategories } from "@/features/categories/queries";

interface Account {
  id: string;
  name: string;
  type: string;
  currency: string;
}

interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
}

export async function fetchTransactions(filters: TransactionFilters = {}): Promise<TransactionWithRelations[]> {
  try {
    const transactions = await getTransactionsQuery(filters);
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function fetchAccounts(): Promise<Account[]> {
  try {
    const result = await getUserAccounts();
    return result.accounts || [];
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const categories = await getUserCategories();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
