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
import { createBudgetAction } from "../actions";
import { getUserCategories } from "@/features/categories/queries";
import { getUserAccounts } from "@/features/accounts/queries";

enum BudgetPeriod {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
  WEEKLY = "WEEKLY",
}

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BudgetModal({ isOpen, onClose, onSuccess }: BudgetModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    period: "MONTHLY" as BudgetPeriod,
    categoryId: "",
    accountId: "",
    startDate: new Date(),
    endDate: new Date(),
    emailAlert: false,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, accountsData] = await Promise.all([
          getUserCategories(),
          getUserAccounts(),
        ]);

        if (categoriesData && Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }

        if (accountsData && Array.isArray(accountsData.accounts)) {
          setAccounts(accountsData.accounts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createBudgetAction({
        name: formData.name,
        amount: parseFloat(formData.amount),
        period: formData.period,
        startDate: formData.startDate,
        endDate: formData.endDate,
        categoryId: formData.categoryId || undefined,
        accountId: formData.accountId || undefined,
      });

      if (result.success) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: "",
          amount: "",
          period: "MONTHLY" as BudgetPeriod,
          categoryId: "",
          accountId: "",
          startDate: new Date(),
          endDate: new Date(),
          emailAlert: false,
        });
      } else {
        alert(result.error || "Wystąpił błąd");
      }
    } catch (error) {
      alert("Wystąpił błąd podczas tworzenia budżetu");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter only main categories (without parentId)
  const mainCategories = categories.filter((category) => !category.parentId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">💰</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Nowy Budżet
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Stwórz nowy budżet, aby lepiej zarządzać swoimi finansami
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Basic Information --- */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nazwa budżetu
                </Label>
                <Input
                  id="name"
                  placeholder="np. Zakupy spożywcze"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="amount"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Kwota limitu
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="2000"
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
                htmlFor="period"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Okres
              </Label>
              <Select
                value={formData.period}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    period: value as BudgetPeriod,
                  }))
                }
              >
                <SelectTrigger className="h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>Tygodniowy</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MONTHLY">
                    <div className="flex items-center gap-2">
                      <span>📆</span>
                      <span>Miesięczny</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="QUARTERLY">
                    <div className="flex items-center gap-2">
                      <span>📊</span>
                      <span>Kwartalny</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="YEARLY">
                    <div className="flex items-center gap-2">
                      <span>📈</span>
                      <span>Roczny</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* --- Optional Settings --- */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Ustawienia dodatkowe
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
                <Label
                  htmlFor="accountId"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Konto (opcjonalnie)
                </Label>
                <Select
                  value={formData.accountId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, accountId: value }))
                  }
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
            </div>

            {/* --- Date Range --- */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Zakres dat
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data początkowa
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500",
                          !formData.startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? (
                          format(formData.startDate, "PPP", { locale: pl })
                        ) : (
                          <span>Wybierz datę</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) =>
                          date &&
                          setFormData((prev) => ({ ...prev, startDate: date }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data końcowa
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500",
                          !formData.endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? (
                          format(formData.endDate, "PPP", { locale: pl })
                        ) : (
                          <span>Wybierz datę</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) =>
                          date &&
                          setFormData((prev) => ({ ...prev, endDate: date }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* --- Email Alert --- */}
            <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <input
                type="checkbox"
                id="emailAlert"
                checked={formData.emailAlert}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emailAlert: e.target.checked,
                  }))
                }
                className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <Label
                  htmlFor="emailAlert"
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                >
                  Powiadomienia email
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Wyślij powiadomienie, gdy przekroczysz 80% budżetu
                </p>
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
                  Utwórz budżet
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
