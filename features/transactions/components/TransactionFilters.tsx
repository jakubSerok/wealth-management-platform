"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { TransactionFilters } from "../types";
import { fetchAccounts, fetchCategories } from "../client-actions";

enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
}

interface Account {
  id: string;
  name: string;
  type: string;
  currency: string;
}

interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
}

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
}

export function TransactionFiltersComponent({
  filters,
  onFiltersChange,
}: TransactionFiltersProps) {
  const [isDateFromOpen, setIsDateFromOpen] = useState(false);
  const [isDateToOpen, setIsDateToOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsData, categoriesData] = await Promise.all([
          fetchAccounts(),
          fetchCategories(),
        ]);
        setAccounts(accountsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "" && value !== null,
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Account filter */}
          <div className="space-y-2">
            <Label htmlFor="account">Konto</Label>
            <Select
              value={filters.accountId || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "accountId",
                  value === "all" ? undefined : value,
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All accounts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All accounts</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} ({account.currency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category filter */}
          <div className="space-y-2">
            <Label htmlFor="category">Kategoria</Label>
            <Select
              value={filters.categoryId || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "categoryId",
                  value === "all" ? undefined : value,
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search by description */}
          <div className="space-y-2">
            <Label htmlFor="search">Szukaj</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Opis transakcji..."
                value={filters.description || ""}
                onChange={(e) =>
                  handleFilterChange("description", e.target.value)
                }
                className="pl-8"
              />
            </div>
          </div>

          {/* Transaction type */}
          <div className="space-y-2">
            <Label htmlFor="type">Typ</Label>
            <Select
              value={filters.type || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "type",
                  value === "all" ? undefined : (value as TransactionType),
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="TRANSFER_IN">Transfer incoming</SelectItem>
                <SelectItem value="TRANSFER_OUT">Transfer outgoing</SelectItem>
                <SelectItem value="INVESTMENT">Investment</SelectItem>
                <SelectItem value="DIVIDEND">Dividend</SelectItem>
                <SelectItem value="INTEREST">Interest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date from */}
          <div className="space-y-2">
            <Label>Date from</Label>
            <Popover open={isDateFromOpen} onOpenChange={setIsDateFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateFrom && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom
                    ? format(new Date(filters.dateFrom), "PPP", { locale: pl })
                    : "Wybierz datę"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    filters.dateFrom ? new Date(filters.dateFrom) : undefined
                  }
                  onSelect={(date: Date | undefined) => {
                    handleFilterChange("dateFrom", date);
                    setIsDateFromOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date to */}
          <div className="space-y-2">
            <Label>Date to</Label>
            <Popover open={isDateToOpen} onOpenChange={setIsDateToOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateTo && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo
                    ? format(new Date(filters.dateTo), "PPP", { locale: pl })
                    : "Wybierz datę"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    filters.dateTo ? new Date(filters.dateTo) : undefined
                  }
                  onSelect={(date: Date | undefined) => {
                    handleFilterChange("dateTo", date);
                    setIsDateToOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            placeholder="e.g. food, work, shopping"
            value={filters.tags?.join(", ") || ""}
            onChange={(e) => {
              const tags = e.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);
              handleFilterChange("tags", tags.length > 0 ? tags : undefined);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
