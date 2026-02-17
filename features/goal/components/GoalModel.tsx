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
  { value: "EMERGENCY_FUND", label: "Emergency fund" },
  { value: "RETIREMENT", label: "Retirement" },
  { value: "HOUSE", label: "House" },
  { value: "CAR", label: "Car" },
  { value: "EDUCATION", label: "Education" },
  { value: "TRAVEL", label: "Travel" },
  { value: "INVESTMENT", label: "Investment" },
  { value: "FAMILY_SAVINGS", label: "Family savings" },
  { value: "OTHER", label: "Other" },
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New financial goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="np. New Laptop"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your goal..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Kwota docelowa (PLN)</Label>
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value as GoalCategory })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {goalCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Konto (opcjonalne)</Label>
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
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    accountsLoading ? "Loading accounts..." : "Select account"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No account</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} ({account.balance.toFixed(2)}{" "}
                    {account.currency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Data docelowa (opcjonalnie)</Label>
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
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
