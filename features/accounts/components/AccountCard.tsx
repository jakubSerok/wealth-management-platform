import { Card } from "@/components/ui/card";
import {
  CreditCard,
  Wallet,
  TrendingUp,
  PiggyBank,
  Bitcoin,
  Shield,
  Wallet2,
  Cpu,
  Wifi,
} from "lucide-react";
import { QuickTransactionButton } from "@/features/transactions/components/QuickTransactionButton";
import { motion } from "framer-motion";

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

export function AccountCard({
  account,
  index = 0,
}: AccountCardProps & { index?: number }) {
  const getAccountTypeInfo = (type: string) => {
    // Upgraded to richer, darker gradients to make the white text pop
    // and resemble premium physical cards.
    switch (type) {
      case "CHECKING":
        return {
          label: "Checking Account",
          icon: CreditCard,
          gradient: "from-blue-600 to-blue-800",
        };
      case "SAVINGS":
        return {
          label: "Savings Account",
          icon: PiggyBank,
          gradient: "from-emerald-500 to-teal-700",
        };
      case "CREDIT_CARD":
        return {
          label: "Credit Card",
          icon: CreditCard,
          gradient: "from-purple-600 to-indigo-800",
        };
      case "INVESTMENT":
        return {
          label: "Investment",
          icon: TrendingUp,
          gradient: "from-orange-500 to-red-600",
        };
      case "CRYPTO":
        return {
          label: "Crypto Wallet",
          icon: Bitcoin,
          gradient: "from-zinc-800 to-black",
        };
      case "RETIREMENT":
        return {
          label: "Retirement",
          icon: Shield,
          gradient: "from-indigo-600 to-blue-900",
        };
      case "WALLET":
        return {
          label: "Physical Wallet",
          icon: Wallet2,
          gradient: "from-slate-600 to-slate-800",
        };
      default:
        return {
          label: type,
          icon: Wallet,
          gradient: "from-gray-700 to-gray-900",
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="w-full max-w-md"
    >
      <Card
        className={`relative overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl border-0 rounded-2xl  flex flex-col justify-between p-6 bg-gradient-to-br ${
          typeInfo.gradient
        } ${!account.isActive ? "opacity-60 grayscale" : ""}`}
      >
        {/* --- Card Texture & Lighting Overlays --- */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-black/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

        {/* --- Top Row: Account Name & Actions --- */}
        <div className="relative z-10 flex items-start justify-between w-full">
          <div className="flex items-center gap-2 text-white/90">
            <Icon className="w-5 h-5" />
            <div>
              <h3 className="text-lg font-bold tracking-wide text-white leading-none">
                {account.name}
              </h3>
              <p className="text-xs font-medium text-white/70 mt-1">
                {typeInfo.label}
              </p>
            </div>
          </div>

          {account.isActive && (
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <QuickTransactionButton
                  account={account as any}
                  type="deposit"
                  onSuccess={() => console.log("Deposit successful")}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <QuickTransactionButton
                  account={account as any}
                  type="withdraw"
                  onSuccess={() => console.log("Withdraw successful")}
                />
              </motion.div>
            </div>
          )}
        </div>

        {/* --- Middle Row: Chip & Contactless --- */}
        <div className="relative z-10 flex items-center justify-between mt-4">
          <Cpu
            className="w-10 h-10 text-white/80 opacity-80"
            strokeWidth={1.5}
          />
          <Wifi className="w-6 h-6 text-white/80 rotate-90 opacity-80" />
        </div>

        {/* --- Bottom Row: Number, Balance, Expiry --- */}
        <div className="relative z-10 mt-auto">
          <p className="font-mono text-lg tracking-[0.2em] text-white/90 mb-4 drop-shadow-md">
            XXXX XXXX XXXX XXXX
          </p>

          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-white/60 mb-1">
                Total Balance
              </span>
              <span className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">
                {formatBalance(account.balance, account.currency)}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-wider text-white/60 mb-1">
                Valid Thru
              </span>
              <span className="font-mono text-sm tracking-widest text-white/90">
                XX/XX
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
