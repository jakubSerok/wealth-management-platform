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
    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Filtry
            </CardTitle>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-3 text-xs border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <X className="h-3 w-3 mr-1" />
              Wyczyść
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Account filter */}
          <div className="space-y-2">
            <Label
              htmlFor="account"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Konto
            </Label>
            <Select
              value={filters.accountId || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "accountId",
                  value === "all" ? undefined : value,
                )
              }
            >
              <SelectTrigger className="h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Wszystkie konta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie konta</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center gap-2">
                      <span>💳</span>
                      <span>
                        {account.name} ({account.currency})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category filter */}
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Kategoria
            </Label>
            <Select
              value={filters.categoryId || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "categoryId",
                  value === "all" ? undefined : value,
                )
              }
            >
              <SelectTrigger className="h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Wszystkie kategorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie kategorie</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {category.icon && <span>{category.icon}</span>}
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search by description */}
          <div className="space-y-2">
            <Label
              htmlFor="search"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Szukaj
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Opis transakcji..."
                value={filters.description || ""}
                onChange={(e) =>
                  handleFilterChange("description", e.target.value)
                }
                className="pl-10 h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Transaction type */}
          <div className="space-y-2">
            <Label
              htmlFor="type"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Typ
            </Label>
            <Select
              value={filters.type || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "type",
                  value === "all" ? undefined : (value as TransactionType),
                )
              }
            >
              <SelectTrigger className="h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Wszystkie typy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie typy</SelectItem>
                <SelectItem value="INCOME">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Przychód</span>
                  </div>
                </SelectItem>
                <SelectItem value="EXPENSE">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>Wydatek</span>
                  </div>
                </SelectItem>
                <SelectItem value="TRANSFER_IN">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Przelew przychodzący</span>
                  </div>
                </SelectItem>
                <SelectItem value="TRANSFER_OUT">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Przelew wychodzący</span>
                  </div>
                </SelectItem>
                <SelectItem value="INVESTMENT">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span>Inwestycja</span>
                  </div>
                </SelectItem>
                <SelectItem value="DIVIDEND">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span>Dywidenda</span>
                  </div>
                </SelectItem>
                <SelectItem value="INTEREST">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span>Odsetki</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date from */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Data od
            </Label>
            <Popover open={isDateFromOpen} onOpenChange={setIsDateFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500",
                    !filters.dateFrom && "text-gray-500",
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
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Data do
            </Label>
            <Popover open={isDateToOpen} onOpenChange={setIsDateToOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500",
                    !filters.dateTo && "text-gray-500",
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
          <Label
            htmlFor="tags"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tagi (oddzielone przecinkami)
          </Label>
          <Input
            id="tags"
            placeholder="np. jedzenie, praca, zakupy"
            value={filters.tags?.join(", ") || ""}
            onChange={(e) => {
              const tags = e.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);
              handleFilterChange("tags", tags.length > 0 ? tags : undefined);
            }}
            className="h-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </CardContent>
    </Card>
  );
}
