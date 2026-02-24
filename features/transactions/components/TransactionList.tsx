"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TransactionWithRelations,
  TransactionFilters,
  TransactionType,
} from "../types";
import { fetchTransactions } from "../client-actions";
import { TransactionFiltersComponent } from "./TransactionFilters";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Search,
  Calendar,
  Tag,
} from "lucide-react";

interface TransactionListProps {
  accountId?: string;
  limit?: number;
}

export function TransactionList({ accountId, limit }: TransactionListProps) {
  const [transactions, setTransactions] = useState<TransactionWithRelations[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>({});

  useEffect(() => {
    const fetchTransactionsData = async () => {
      try {
        const transactionsData = await fetchTransactions({
          accountId,
          limit,
          ...filters,
        });
        setTransactions(transactionsData || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionsData();
  }, [accountId, limit, filters]);

  const getTransactionTypeInfo = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME:
        return {
          label: "Przychód",
          color:
            "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
          icon: TrendingUp,
          textColor: "text-emerald-600 dark:text-emerald-400",
        };
      case TransactionType.EXPENSE:
        return {
          label: "Wydatek",
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          icon: TrendingDown,
          textColor: "text-red-600 dark:text-red-400",
        };
      case TransactionType.TRANSFER:
        return {
          label: "Przelew",
          color:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
          icon: ArrowRightLeft,
          textColor: "text-blue-600 dark:text-blue-400",
        };
      default:
        return {
          label: type,
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
          icon: ArrowRightLeft,
          textColor: "text-gray-600 dark:text-gray-400",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">
            Ładowanie transakcji...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TransactionFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
      />

      <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Transakcje
              </CardTitle>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {transactions.length}{" "}
              {transactions.length === 1
                ? "transakcja"
                : transactions.length < 5
                  ? "transakcje"
                  : "transakcji"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Brak transakcji
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                Nie znaleziono transakcji pasujących do wybranych filtrów.
                Spróbuj zmienić kryteria wyszukiwania.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction, index) => {
                const typeInfo = getTransactionTypeInfo(transaction.type);
                const Icon = typeInfo.icon;

                return (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Transaction Type Icon */}
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeInfo.color}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Transaction Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={typeInfo.color}>
                              {typeInfo.label}
                            </Badge>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {transaction.account.name}
                            </span>
                          </div>

                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {transaction.description}
                          </h4>

                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            {transaction.category && (
                              <div className="flex items-center gap-1">
                                <span>{transaction.category.icon}</span>
                                <span>{transaction.category.name}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {format(
                                  new Date(transaction.date),
                                  "dd MMM yyyy",
                                  {
                                    locale: pl,
                                  },
                                )}
                              </span>
                            </div>
                          </div>

                          {transaction.tags && transaction.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {transaction.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md"
                                >
                                  <Tag className="h-3 w-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right flex flex-col items-end">
                        <div
                          className={`font-bold text-lg ${typeInfo.textColor}`}
                        >
                          {transaction.type === TransactionType.INCOME
                            ? "+"
                            : "-"}
                          {new Intl.NumberFormat("pl-PL", {
                            style: "currency",
                            currency: transaction.account.currency,
                          }).format(transaction.amount)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {format(new Date(transaction.date), "HH:mm", {
                            locale: pl,
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
