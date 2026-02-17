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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {defaultType === "INCOME" ? "Wpłata" : "Wypłata"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountId">Account</Label>
            <Select
              value={formData.accountId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, accountId: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} ({account.currency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
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
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category (optional)" />
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
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "PPP", { locale: pl })
                  ) : (
                    <span>Select date</span>
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
