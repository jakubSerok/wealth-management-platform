"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { TransactionModal } from "./TransactionModal";

interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: string;
  isActive: boolean;
}

enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
}

interface QuickTransactionButtonProps {
  account: Account;
  type: "deposit" | "withdraw";
  onSuccess?: () => void;
}

export function QuickTransactionButton({
  account,
  type,
  onSuccess,
}: QuickTransactionButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
    onSuccess?.();
  };

  return (
    <>
      <Button
        size="sm"
        variant={type === "deposit" ? "default" : "destructive"}
        onClick={() => setIsModalOpen(true)}
        className={`h-9 px-3 font-medium shadow-md hover:shadow-lg transition-all duration-200 ${
          type === "deposit"
            ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0"
            : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-0"
        }`}
      >
        {type === "deposit" ? (
          <Plus className="h-3 w-3 mr-1.5" />
        ) : (
          <Minus className="h-3 w-3 mr-1.5" />
        )}
        <span className="text-xs font-semibold">
          {type === "deposit" ? "Wpłać" : "Wypłać"}
        </span>
      </Button>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        defaultAccountId={account.id}
        defaultType={
          type === "deposit"
            ? ("INCOME" as TransactionType)
            : ("EXPENSE" as TransactionType)
        }
      />
    </>
  );
}
