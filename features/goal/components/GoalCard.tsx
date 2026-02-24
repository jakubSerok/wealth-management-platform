"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Target,
  Wallet,
  TrendingUp,
  Trash2,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GoalWithProgress } from "../types";
import { motion } from "framer-motion";

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
    if (percentage >= 100)
      return "bg-gradient-to-r from-green-500 to-emerald-600";
    if (percentage >= 75) return "bg-gradient-to-r from-blue-500 to-indigo-600";
    if (percentage >= 50)
      return "bg-gradient-to-r from-yellow-400 to-amber-500";
    return "bg-gradient-to-r from-gray-300 to-gray-400";
  };

  const getStatusInfo = (percentage: number) => {
    if (percentage >= 100) {
      return {
        text: "Osiągnięty!",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        icon: Trophy,
      };
    }
    if (percentage >= 75) {
      return {
        text: "Prawie gotowe",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        icon: Target,
      };
    }
    return {
      text: "W toku",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      icon: Calendar,
    };
  };

  const statusInfo = getStatusInfo(goal.percentage);
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {goal.name}
                </CardTitle>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                >
                  {statusInfo.text}
                </div>
              </div>
              {goal.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {goal.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={goal.percentage >= 100 ? "default" : "secondary"}
                className="text-xs"
              >
                {goal.category.replace(/_/g, " ")}
              </Badge>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(goal.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Postęp
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {goal.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="relative">
              <Progress
                value={goal.percentage}
                className="h-4"
                style={{
                  background:
                    "linear-gradient(to right, #e5e7eb 0%, #e5e7eb 100%)",
                }}
              />
              <div
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${getProgressColor(goal.percentage)}`}
                style={{ width: `${Math.min(goal.percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">
                {formatCurrency(goal.currentAmount)}
              </span>
              <span className="font-medium">
                {formatCurrency(goal.targetAmount)}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusInfo.bgColor}`}
              >
                <Target className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pozostało
                </p>
                <p className="font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(goal.remaining)}
                </p>
              </div>
            </div>

            {goal.daysLeft !== undefined && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Czas
                  </p>
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    {goal.daysLeft} dni
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Account Info */}
          {goal.account && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-t border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
                <Wallet className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Konto
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {goal.account.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({formatCurrency(goal.account.balance)})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Achievement Status */}
          {goal.percentage >= 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-green-700 dark:text-green-400">
                  Cel osiągnięty! 🎉
                </p>
                <p className="text-sm text-green-600 dark:text-green-500">
                  Świetna robota!
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
