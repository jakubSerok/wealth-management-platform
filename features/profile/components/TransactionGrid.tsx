"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

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

export function TransactionGrid({ transactions, title, showAccountInfo = true }: TransactionGridProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "INCOME":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "EXPENSE":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "DIVIDEND":
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
      case "TRANSFER_IN":
        return <ArrowDownRight className="h-4 w-4 text-purple-600" />;
      case "TRANSFER_OUT":
        return <ArrowUpRight className="h-4 w-4 text-orange-600" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "INCOME":
        return "Przychód";
      case "EXPENSE":
        return "Wydatek";
      case "DIVIDEND":
        return "Dywidenda";
      case "TRANSFER_IN":
        return "Przelew przychodzący";
      case "TRANSFER_OUT":
        return "Przelew wychodzący";
      case "INVESTMENT":
        return "Inwestycja";
      default:
        return type;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "INCOME":
        return "text-green-700 bg-green-50";
      case "EXPENSE":
        return "text-red-700 bg-red-50";
      case "DIVIDEND":
        return "text-blue-700 bg-blue-50";
      case "TRANSFER_IN":
        return "text-purple-700 bg-purple-50";
      case "TRANSFER_OUT":
        return "text-orange-700 bg-orange-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <Badge variant="secondary">{transactions.length}</Badge>
        </CardTitle>
        <CardDescription>
          Najnowsze transakcje wpływające na wartość netto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Opis</TableHead>
                {showAccountInfo && <TableHead>Konto</TableHead>}
                <TableHead>Typ</TableHead>
                <TableHead className="text-right">Kwota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.slice(0, 10).map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-sm">
                    {format(new Date(transaction.date), "dd.MM.yyyy")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>
                  {showAccountInfo && (
                    <TableCell className="text-sm">
                      <div>
                        <div className="font-medium">{transaction.accountName}</div>
                        <div className="text-muted-foreground text-xs">
                          {transaction.accountType}
                        </div>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={getTransactionTypeColor(transaction.type)}
                    >
                      {getTransactionIcon(transaction.type)}
                      <span className="ml-2">
                        {getTransactionTypeLabel(transaction.type)}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <span className={transaction.amount >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {transactions.length > 10 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Pokazano {transactions.length > 10 ? "10" : transactions.length} z {transactions.length} transakcji
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
