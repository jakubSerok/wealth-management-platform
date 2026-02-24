"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: Date;
  accountName?: string;
  accountType: string;
}

interface TransactionGridProps {
  transactions: Transaction[];
  title: string;
  showAccountInfo?: boolean;
}

export function TransactionGrid({
  transactions,
  title,
  showAccountInfo = true,
}: TransactionGridProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getTransactionTypeInfo = (type: string) => {
    switch (type) {
      case "INCOME":
        return {
          icon: TrendingUp,
          label: "Przychód",
          color:
            "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/30",
          amountColor: "text-green-600 dark:text-green-400",
        };
      case "EXPENSE":
        return {
          icon: TrendingDown,
          label: "Wydatek",
          color: "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/30",
          amountColor: "text-red-600 dark:text-red-400",
        };
      case "DIVIDEND":
        return {
          icon: ArrowUpRight,
          label: "Dywidenda",
          color:
            "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30",
          amountColor: "text-blue-600 dark:text-blue-400",
        };
      case "TRANSFER_IN":
        return {
          icon: ArrowDownRight,
          label: "Przelew przychodzący",
          color:
            "text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/30",
          amountColor: "text-purple-600 dark:text-purple-400",
        };
      case "TRANSFER_OUT":
        return {
          icon: ArrowUpRight,
          label: "Przelew wychodzący",
          color:
            "text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30",
          amountColor: "text-orange-600 dark:text-orange-400",
        };
      case "INVESTMENT":
        return {
          icon: TrendingUp,
          label: "Inwestycja",
          color:
            "text-indigo-700 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/30",
          amountColor: "text-indigo-600 dark:text-indigo-400",
        };
      default:
        return {
          icon: () => <div className="h-4 w-4 bg-gray-400 rounded-full" />,
          label: type,
          color:
            "text-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/30",
          amountColor: "text-gray-600 dark:text-gray-400",
        };
    }
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
    >
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Najnowsze transakcje wpływające na wartość netto
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="px-3 py-1 text-sm font-medium"
            >
              {transactions.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Opis
                  </TableHead>
                  {showAccountInfo && (
                    <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Konto
                    </TableHead>
                  )}
                  <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Typ
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Kwota
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.slice(0, 10).map((transaction, index) => {
                  const typeInfo = getTransactionTypeInfo(transaction.type);
                  const Icon = typeInfo.icon;

                  return (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <TableCell className="text-sm py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {format(new Date(transaction.date), "dd.MM.yyyy")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(transaction.date), "HH:mm")}
                          </p>
                        </div>
                      </TableCell>
                      {showAccountInfo && (
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                                <span className="text-xs">💳</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                  {transaction.accountName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {transaction.accountType}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className={`${typeInfo.color} px-3 py-1.5 text-xs font-medium border-0`}
                        >
                          <Icon className="h-3 w-3 mr-2" />
                          <span>{typeInfo.label}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="space-y-1">
                          <p
                            className={`font-mono font-bold text-lg ${typeInfo.amountColor}`}
                          >
                            {transaction.amount >= 0 ? "+" : ""}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </p>
                          <div className="flex items-center justify-end gap-1">
                            {transaction.amount >= 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {transaction.amount >= 0 ? "przychód" : "wydatek"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {transactions.length > 10 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center gap-2">
                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Wyświetlono 10 z {transactions.length} transakcji
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
