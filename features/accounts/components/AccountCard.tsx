import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, TrendingUp, PiggyBank, Bitcoin, Shield, Wallet2 } from "lucide-react";
import { QuickTransactionButton } from "@/features/transactions/components/QuickTransactionButton";

interface AccountCardProps {
  account: {
    id: string;
    name: string;
    type: string;
    balance: any;
    currency: string;
    isActive: boolean;
  };
}

export function AccountCard({ account }: AccountCardProps) {
  const getAccountTypeInfo = (type: string) => {
    switch (type) {
      case "CHECKING":
        return {
          label: "Checking account",
          icon: CreditCard,
          gradient: "from-blue-500 to-blue-600",
          bgGradient: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
          badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        };
      case "SAVINGS":
        return {
          label: "Savings account",
          icon: PiggyBank,
          gradient: "from-green-500 to-green-600",
          bgGradient: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
          badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        };
      case "CREDIT_CARD":
        return {
          label: "Credit card",
          icon: CreditCard,
          gradient: "from-purple-500 to-purple-600",
          bgGradient: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
          badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
        };
      case "INVESTMENT":
        return {
          label: "Investment account",
          icon: TrendingUp,
          gradient: "from-orange-500 to-orange-600",
          bgGradient: "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
          badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
        };
      case "CRYPTO":
        return {
          label: "Crypto wallet",
          icon: Bitcoin,
          gradient: "from-yellow-500 to-yellow-600",
          bgGradient: "from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900",
          badgeColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        };
      case "RETIREMENT":
        return {
          label: "Retirement account",
          icon: Shield,
          gradient: "from-indigo-500 to-indigo-600",
          bgGradient: "from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900",
          badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
        };
      case "WALLET":
        return {
          label: "Physical wallet",
          icon: Wallet2,
          gradient: "from-gray-500 to-gray-600",
          bgGradient: "from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900",
          badgeColor: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
        };
      default:
        return {
          label: type,
          icon: Wallet,
          gradient: "from-slate-500 to-slate-600",
          bgGradient: "from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900",
          badgeColor: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200"
        };
    }
  };

  const formatBalance = (balance: any, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(Number(balance));
  };

  const typeInfo = getAccountTypeInfo(account.type);
  const Icon = typeInfo.icon;

  return (
    <Card className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${!account.isActive ? "opacity-50" : ""}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${typeInfo.bgGradient} opacity-50`} />
      <CardHeader className="pb-3 relative">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${typeInfo.gradient}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-lg font-semibold">{account.name}</CardTitle>
        </div>
        <Badge className={`ml-10 ${typeInfo.badgeColor} border-0`}>
          {typeInfo.label}
        </Badge>
      </CardHeader>
      <CardContent className="relative pb-16">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {formatBalance(account.balance, account.currency)}
        </div>
        {!account.isActive && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Account inactive</p>
        )}
        {account.isActive && (
          <div className="absolute bottom-4 right-4 flex gap-1">
            <QuickTransactionButton 
              account={account as any} 
              type="deposit" 
              onSuccess={() => console.log('Deposit successful')}
            />
            <QuickTransactionButton 
              account={account as any} 
              type="withdraw" 
              onSuccess={() => console.log('Withdraw successful')}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
