"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Target, Wallet, TrendingUp, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoalWithProgress } from "../types";

interface GoalCardProps {
  goal: GoalWithProgress;
  onDelete?: (id: string) => void;
}

export function GoalCard({ goal, onDelete }: GoalCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-gray-300";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold">{goal.name}</CardTitle>
            {goal.description && (
              <p className="text-sm text-muted-foreground">
                {goal.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={goal.percentage >= 100 ? "default" : "secondary"}>
              {goal.category.replace(/_/g, " ")}
            </Badge>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(goal.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="font-bold">{goal.percentage.toFixed(1)}%</span>
          </div>
          <Progress value={goal.percentage} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(goal.currentAmount)}</span>
            <span>{formatCurrency(goal.targetAmount)}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Remaining</p>
              <p className="font-semibold">{formatCurrency(goal.remaining)}</p>
            </div>
          </div>

          {goal.daysLeft !== undefined && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Time</p>
                <p className="font-semibold">{goal.daysLeft} days</p>
              </div>
            </div>
          )}
        </div>

        {/* Account Info */}
        {goal.account && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Konto: <span className="font-medium">{goal.account.name}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              ({formatCurrency(goal.account.balance)})
            </span>
          </div>
        )}

        {/* Status Badge */}
        {goal.percentage >= 100 && (
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Goal achieved! 🎉</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
