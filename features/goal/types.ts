import { GoalCategory } from "@prisma/client";

export interface CreateGoalData {
  name: string;
  description: string;
  targetAmount: number;
  targetDate?: Date;
  category: GoalCategory;
  accountId?: string;
}

export interface GoalWithProgress {
  id: string;
  name: string;
  description?: string | null;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date | null;
  category: GoalCategory;
  accountId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Computed fields
  percentage: number;
  remaining: number;
  daysLeft?: number;
  // Account data
  account?: {
    id: string;
    name: string;
    balance: number;
    currency: string;
  } | null;
}
