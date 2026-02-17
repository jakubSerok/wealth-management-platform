export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
}

export enum AccountType {
  CHECKING = "CHECKING",
  SAVINGS = "SAVINGS",
  CREDIT_CARD = "CREDIT_CARD",
  INVESTMENT = "INVESTMENT",
  CASH = "CASH",
}

export interface CreateTransactionData {
  accountId: string;
  amount: number;
  type: TransactionType;
  description: string;
  categoryId?: string;
  date?: Date;
  tags?: string[];
  isRecurring?: boolean;
}

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
  description?: string;
  limit?: number;
  offset?: number;
}

export interface UpdateAccountBalanceData {
  accountId: string;
  amount: number;
  type: TransactionType;
}

export interface TransactionWithRelations {
  id: string;
  accountId: string;
  categoryId: string | null;
  amount: number;
  type: TransactionType;
  description: string;
  date: Date;
  isRecurring: boolean;
  tags: string[];
  transferId: string | null;
  createdAt: Date;
  updatedAt: Date;
  account: {
    id: string;
    name: string;
    type: AccountType;
    currency: string;
  };
  category: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  } | null;
}

export interface QuickTransactionData {
  accountId: string;
  amount: number;
  type: "deposit" | "withdraw";
  description?: string;
}

export interface TransferData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  date?: Date;
}

export type TransactionFormData = Omit<CreateTransactionData, "accountId"> & {
  accountId?: string;
};
