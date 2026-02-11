"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { createBudgetAction } from "../actions";
import { BudgetPeriod } from "@prisma/client";
import { getUserCategories } from "@/features/categories/queries";
import { getUserAccounts } from "@/features/accounts/queries";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BudgetModal({
  isOpen,
  onClose,
  onSuccess,
}: BudgetModalProps) {
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
          period: "MONTHLY",
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
  const mainCategories = categories.filter(category => !category.parentId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nowy Budżet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nazwa budżetu</Label>
            <Input
              id="name"
              placeholder="np. Zakupy spożywcze"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Kwota limitu</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="2000"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Okres</Label>
            <Select
              value={formData.period}
              onValueChange={(value) => setFormData(prev => ({ ...prev, period: value as BudgetPeriod }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WEEKLY">Tygodniowy</SelectItem>
                <SelectItem value="MONTHLY">Miesięczny</SelectItem>
                <SelectItem value="QUARTERLY">Kwartalny</SelectItem>
                <SelectItem value="YEARLY">Roczny</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Kategoria (opcjonalnie)</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger>
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
            <Label htmlFor="accountId">Konto (opcjonalnie)</Label>
            <Select
              value={formData.accountId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wybierz konto" />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data początkowa</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP", { locale: pl }) : <span>Wybierz datę</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data końcowa</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP", { locale: pl }) : <span>Wybierz datę</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, endDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="emailAlert"
              checked={formData.emailAlert}
              onChange={(e) => setFormData(prev => ({ ...prev, emailAlert: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="emailAlert" className="text-sm">
              Wyślij email, gdy przekroczę 80% budżetu
            </Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Anuluj
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Zapisywanie..." : "Utwórz budżet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
