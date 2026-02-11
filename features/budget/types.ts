import { BudgetPeriod } from "@prisma/client";

export interface CreateBudgetData {
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  accountId?: string;
  categoryId?: string;
}
