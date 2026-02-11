"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
  name: string;
  amount: number;
  spent: number;
  percentage: number;
  icon?: string;
  categoryName?: string;
}

export function BudgetCard({
  name,
  amount,
  spent,
  percentage,
  icon,
  categoryName,
}: BudgetCardProps) {
  // Formatowanie kwot jako waluty
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Logika kolorów dla progress bar
  const getProgressColor = (percentage: number) => {
    if (percentage < 80) return "bg-green-500";
    if (percentage >= 80 && percentage < 100) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Logika kolorów dla tekstu procentu
  const getPercentageColor = (percentage: number) => {
    if (percentage < 80) return "text-green-600";
    if (percentage >= 80 && percentage < 100) return "text-yellow-600";
    return "text-red-600";
  };

  const progressColor = getProgressColor(percentage);
  const percentageColor = getPercentageColor(percentage);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            {icon && <span className="text-xl">{icon}</span>}
            <div>
              <div className="font-semibold">{name}</div>
              {categoryName && (
                <div className="text-sm text-muted-foreground font-normal">
                  {categoryName}
                </div>
              )}
            </div>
          </div>
          <div className={cn("text-sm font-medium", percentageColor)}>
            {percentage.toFixed(1)}%
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={percentage} className="h-2" />
        </div>

        {/* Kwoty */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            Wydano:{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(spent)}
            </span>
          </span>
          <span className="text-muted-foreground">
            Limit:{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(amount)}
            </span>
          </span>
        </div>

        {/* Status */}
        {percentage >= 100 ? (
          <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
            <span>⚠️</span>
            <span>Budżet przekroczony!</span>
          </div>
        ) : percentage >= 80 ? (
          <div className="flex items-center gap-2 text-yellow-600 text-sm font-medium">
            <span>⚡</span>
            <span>Blisko przekroczenia budżetu</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <span>✅</span>
            <span>Wszystko w porządku</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
