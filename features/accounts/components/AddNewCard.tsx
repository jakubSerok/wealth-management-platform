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
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Wallet,
  TrendingUp,
  PiggyBank,
  Bitcoin,
  Shield,
  Wallet2,
} from "lucide-react";

enum AccountType {
  CHECKING = "CHECKING",
  SAVINGS = "SAVINGS",
  CREDIT_CARD = "CREDIT_CARD",
  INVESTMENT = "INVESTMENT",
  CASH = "CASH",
}

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
    {
      value: "CHECKING",
      label: "Checking Account",
      icon: CreditCard,
      color: "blue",
    },
    {
      value: "SAVINGS",
      label: "Savings Account",
      icon: PiggyBank,
      color: "green",
    },
    {
      value: "CREDIT_CARD",
      label: "Credit Card",
      icon: CreditCard,
      color: "purple",
    },
    {
      value: "INVESTMENT",
      label: "Investment Account",
      icon: TrendingUp,
      color: "orange",
    },
    { value: "CRYPTO", label: "Crypto Wallet", icon: Bitcoin, color: "yellow" },
    {
      value: "RETIREMENT",
      label: "Retirement Account",
      icon: Shield,
      color: "indigo",
    },
    { value: "WALLET", label: "Physical Wallet", icon: Wallet2, color: "gray" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Add New Account
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Fill in the following data to add a new account to your
                  portfolio.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Account Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., My Personal Account"
                      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="type"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Account Type
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value as AccountType })
                      }
                      required
                    >
                      <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 shadow-lg">
                        {accountTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <SelectItem
                              key={type.value}
                              value={type.value}
                              className="hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-lg bg-${type.color}-100`}
                                >
                                  <Icon
                                    className={`h-4 w-4 text-${type.color}-600`}
                                  />
                                </div>
                                <span className="font-medium">
                                  {type.label}
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="currency"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Currency
                    </Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) =>
                        setFormData({ ...formData, currency: value })
                      }
                    >
                      <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 shadow-lg">
                        <SelectItem value="PLN">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🇵🇱</span>
                            <span>PLN - Polish Złoty</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="EUR">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🇪🇺</span>
                            <span>EUR - Euro</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="USD">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🇺🇸</span>
                            <span>USD - US Dollar</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="GBP">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🇬🇧</span>
                            <span>GBP - British Pound</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter className="gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="border-gray-200 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting || !formData.name || !formData.type
                      }
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating...
                        </div>
                      ) : (
                        "Add Account"
                      )}
                    </Button>
                  </motion.div>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
