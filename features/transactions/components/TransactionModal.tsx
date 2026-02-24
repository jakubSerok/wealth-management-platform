"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { createTransactionAction } from "../actions";
import { auth } from "@/auth";
import { getUserAccounts } from "@/features/accounts/queries";
import { getUserCategories } from "@/features/categories/queries";

enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultAccountId?: string;
  defaultType?: TransactionType;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  defaultAccountId,
  defaultType,
}: TransactionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountId: defaultAccountId || "",
    amount: "",
    type: defaultType || "INCOME",
    description: "",
    categoryId: "",
    date: new Date(),
  });

  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Filter only main categories (without parentId)
  const mainCategories = categories.filter((category) => !category.parentId);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accountsData = await getUserAccounts();
        if (accountsData && Array.isArray(accountsData.accounts)) {
          setAccounts(accountsData.accounts);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesData = await getUserCategories();
        if (categoriesData && Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchAccounts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createTransactionAction({
        accountId: formData.accountId,
        amount: parseFloat(formData.amount),
        type: formData.type as any, // Convert to Prisma enum
        description: formData.description,
        categoryId: formData.categoryId || undefined,
        date: formData.date,
      });

      if (result.success) {
        onSuccess();
        setFormData({
          accountId: defaultAccountId || "",
          amount: "",
          type: defaultType || "INCOME",
          description: "",
          categoryId: "",
          date: new Date(),
        });
      } else {
        alert(result.error || "Wystąpił błąd");
      }
    } catch (error) {
      alert("Wystąpił błąd podczas tworzenia transakcji");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">
              {defaultType === "INCOME" ? "💰" : "💸"}
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {defaultType === "INCOME" ? "Nowy przychód" : "Nowy wydatek"}
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Dodaj nową transakcję do swojego konta
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Basic Information --- */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="accountId"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Konto
                </Label>
                <Select
                  value={formData.accountId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, accountId: value }))
                  }
                  required
                >
                  <SelectTrigger className="h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Wybierz konto" />
                  </SelectTrigger>
                  <SelectContent>
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

              <div className="space-y-2">
                <Label
                  htmlFor="amount"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Kwota
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  className="h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Opis
              </Label>
              <Textarea
                id="description"
                placeholder="Opisz transakcję..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 resize-none"
                rows={3}
                required
              />
            </div>
          </div>

          {/* --- Optional Information --- */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Informacje dodatkowe
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="categoryId"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Kategoria (opcjonalnie)
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, categoryId: value }))
                  }
                >
                  <SelectTrigger className="h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainCategories.map((category) => (
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

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data transakcji
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500",
                        !formData.date && "text-gray-500",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? (
                        format(formData.date, "PPP", { locale: pl })
                      ) : (
                        <span>Wybierz datę</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) =>
                        date && setFormData((prev) => ({ ...prev, date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* --- Actions --- */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 h-11 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Zapisywanie...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>✨</span>
                  {defaultType === "INCOME"
                    ? "Dodaj przychód"
                    : "Dodaj wydatek"}
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
