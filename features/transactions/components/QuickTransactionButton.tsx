"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { TransactionModal } from "./TransactionModal";
import { Account } from "@prisma/client";

interface QuickTransactionButtonProps {
  account: Account;
  type: "deposit" | "withdraw";
  onSuccess?: () => void;
}

export function QuickTransactionButton({ 
  account, 
  type, 
  onSuccess 
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
        className="h-8 px-2"
      >
        {type === "deposit" ? (
          <Plus className="h-3 w-3 mr-1" />
        ) : (
          <Minus className="h-3 w-3 mr-1" />
        )}
        {type === "deposit" ? "Wpłać" : "Wypłać"}
      </Button>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        defaultAccountId={account.id}
        defaultType={type === "deposit" ? "INCOME" : "EXPENSE"}
      />
    </>
  );
}