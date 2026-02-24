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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { GoalCategory } from "../types";
import { createGoal } from "../actions";
import { CreateGoalData } from "../types";
import { getUserAccounts } from "@/features/accounts/queries";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: string;
  isActive: boolean;
}

const goalCategories = [
  { value: "EMERGENCY_FUND", label: "Fundusz awaryjny", icon: "🚨" },
  { value: "RETIREMENT", label: "Emerytura", icon: "🏖️" },
  { value: "HOUSE", label: "Dom", icon: "🏠" },
  { value: "CAR", label: "Samochód", icon: "🚗" },
  { value: "EDUCATION", label: "Edukacja", icon: "📚" },
  { value: "TRAVEL", label: "Podróże", icon: "✈️" },
  { value: "INVESTMENT", label: "Inwestycje", icon: "📈" },
  { value: "FAMILY_SAVINGS", label: "Oszczędności rodzinne", icon: "👨‍👩‍👧‍👦" },
  { value: "OTHER", label: "Inne", icon: "📌" },
];

export function GoalModal({ isOpen, onClose, onSuccess }: GoalModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [formData, setFormData] = useState<CreateGoalData>({
    name: "",
    targetAmount: 0,
    description: "",
    category: GoalCategory.OTHER,
    targetDate: undefined,
    accountId: undefined,
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userData = await getUserAccounts();
        if (userData && userData.accounts) {
          setAccounts(userData.accounts.filter((acc: Account) => acc.isActive));
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setAccountsLoading(false);
      }
    };

    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createGoal(formData);
      if (result.success) {
        onSuccess();
        onClose();
        setFormData({
          name: "",
          targetAmount: 0,
          description: "",
          category: GoalCategory.OTHER,
          targetDate: undefined,
          accountId: undefined,
        });
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error creating goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl">🎯</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Nowy cel finansowy
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Dodaj nowy cel, aby śledzić swoje postępy i osiągać sukcesy
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Basic Information --- */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nazwa celu
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="np. Nowy laptop"
                className="h-11 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Opis (opcjonalnie)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Opisz swój cel..."
                rows={3}
                className="border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500 resize-none"
              />
            </div>
          </div>

          {/* --- Goal Details --- */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Szczegóły celu
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="targetAmount"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Kwota docelowa (PLN)
                </Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.targetAmount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="5000"
                  className="h-11 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Kategoria
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      category: value as GoalCategory,
                    })
                  }
                >
                  <SelectTrigger className="h-11 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                  htmlFor="account"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Konto (opcjonalnie)
                </Label>
                <Select
                  value={formData.accountId || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      accountId: value === "none" ? undefined : value,
                    })
                  }
                  disabled={accountsLoading}
                >
                  <SelectTrigger className="h-11 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue
                      placeholder={
                        accountsLoading ? "Ładowanie kont..." : "Wybierz konto"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Brak konta</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center gap-2">
                          <span>💳</span>
                          <span>
                            {account.name} ({account.balance.toFixed(2)}{" "}
                            {account.currency})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="targetDate"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Data docelowa (opcjonalnie)
                </Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={
                    formData.targetDate
                      ? format(formData.targetDate, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetDate: e.target.value
                        ? new Date(e.target.value)
                        : undefined,
                    })
                  }
                  className="h-11 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                />
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
              className="px-6 h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Tworzenie...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>✨</span>
                  Utwórz cel
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
