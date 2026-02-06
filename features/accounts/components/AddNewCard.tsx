"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountType } from "@prisma/client";
import { addAccount } from "../action";

interface AddNewCardProps {
  children: React.ReactNode;
  onAccountCreated?: () => void;
}

export function AddNewCard({ children, onAccountCreated }: AddNewCardProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "" as AccountType,
    currency: "PLN",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addAccount(formData);
      setFormData({ name: "", type: "" as AccountType, currency: "PLN" });
      setOpen(false);
      onAccountCreated?.();
    } catch (error) {
      console.error("Failed to create account:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const accountTypes = [
    { value: "CHECKING", label: "CHECKING" },
    { value: "SAVINGS", label: "SAVINGS" },
    { value: "CREDIT_CARD", label: "CREDIT_CARD" },
    { value: "INVESTMENT", label: "INVESTMENT" },
    { value: "CRYPTO", label: "CRYPTO" },
    { value: "RETIREMENT", label: "RETIREMENT" },
    { value: "WALLET", label: "WALLET" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new account</DialogTitle>
          <DialogDescription>
            Fill in the following data to add a new account to your portfolio.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nazwa konta</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="np. Moje konto osobiste"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Typ konta</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as AccountType })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz typ konta" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currency">Waluta</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz walutę" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLN">PLN - Polski złoty</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="USD">USD - Dolar amerykański</SelectItem>
                  <SelectItem value="GBP">GBP - Funt szterling</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name || !formData.type}>
              {isSubmitting ? "Creating..." : "Add account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}