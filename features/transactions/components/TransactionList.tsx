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

  const getTransactionTypeColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME:
        return "bg-green-100 text-green-800";
      case TransactionType.EXPENSE:
        return "bg-red-100 text-red-800";
      case TransactionType.TRANSFER:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTransactionTypeLabel = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME:
        return "Przychód";
      case TransactionType.EXPENSE:
        return "Wydatek";
      case TransactionType.TRANSFER:
        return "Przelew";
      default:
        return type;
    }
  };

  if (isLoading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="space-y-6">
      <TransactionFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
      />
      <Card>
        <CardHeader>
          <CardTitle>Transakcje</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Brak transakcji</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        className={getTransactionTypeColor(transaction.type)}
                      >
                        {getTransactionTypeLabel(transaction.type)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {transaction.account.name}
                      </span>
                    </div>
                    <p className="font-medium">{transaction.description}</p>
                    {transaction.category && (
                      <p className="text-sm text-gray-500">
                        {transaction.category.name}
                      </p>
                    )}
                    {transaction.tags && transaction.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {transaction.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400">
                      {format(new Date(transaction.date), "PPP", {
                        locale: pl,
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold ${
                        transaction.type === TransactionType.INCOME
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === TransactionType.INCOME ? "+" : "-"}
                      {new Intl.NumberFormat("pl-PL", {
                        style: "currency",
                        currency: transaction.account.currency,
                      }).format(transaction.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
