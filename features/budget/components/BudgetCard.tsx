"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Trash2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";

interface BudgetCardProps {
  id: string;
  name: string;
  amount: number;
  spent: number;
  percentage: number;
  icon?: string;
  categoryName?: string;
  onDelete?: (id: string) => void;
}

export function BudgetCard({
  id,
  name,
  amount,
  spent,
  percentage,
  icon,
  categoryName,
  onDelete,
}: BudgetCardProps) {
  // Formatowanie kwot jako waluty
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Logika statusów (kolory, ikony, tła)
  const getStatusConfig = (pct: number) => {
    if (pct >= 100) {
      return {
        state: "danger",
        bar: "bg-gradient-to-r from-red-500 to-rose-600",
        text: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-950/30",
        icon: AlertCircle,
        message: "Budżet przekroczony!",
      };
    }
    if (pct >= 80) {
      return {
        state: "warning",
        bar: "bg-gradient-to-r from-yellow-400 to-amber-500",
        text: "text-amber-600 dark:text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-950/30",
        icon: AlertTriangle,
        message: "Blisko przekroczenia budżetu",
      };
    }
    return {
      state: "safe",
      bar: "bg-gradient-to-r from-emerald-400 to-green-500",
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      icon: CheckCircle2,
      message: "Wszystko w porządku",
    };
  };

  const status = getStatusConfig(percentage);
  const StatusIcon = status.icon;
  const remaining = Math.max(amount - spent, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="w-full overflow-hidden transition-all duration-200 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md bg-white dark:bg-gray-900">
        <CardContent className="p-5 sm:p-6 space-y-5">
          {/* --- Nagłówek --- */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-2xl text-2xl shadow-sm",
                  status.bg,
                )}
              >
                {icon ? (
                  <span>{icon}</span>
                ) : (
                  <Wallet className={status.text} size={24} />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg leading-tight">
                  {name}
                </h3>
                {categoryName && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                    {categoryName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-right">
                <span className={cn("text-lg font-bold", status.text)}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(id)}
                  className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-full transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* --- Progress Bar --- */}
          <div className="space-y-2">
            <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn("h-full rounded-full", status.bar)}
              />
            </div>
          </div>

          {/* --- Szczegóły finansowe & Status --- */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                  Wydano
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(spent)}
                </p>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                  Pozostało
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(remaining)}
                </p>
              </div>
            </div>

            <div
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-full",
                status.bg,
                status.text,
              )}
            >
              <StatusIcon className="w-4 h-4" />
              <span>{status.message}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
