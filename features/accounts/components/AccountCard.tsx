import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "CHECKING":
        return "Checking account";
      case "SAVINGS":
        return "Savings account";
      case "CREDIT_CARD":
        return "Credit card";
      case "INVESTMENT":
        return "Investment account";
      case "CRYPTO":
        return "Crypto wallet";
      case "RETIREMENT":
        return "Retirement account";
      case "WALLET":
        return "Physical wallet";
      default:
        return type;
    }
  };

  const formatBalance = (balance: any, currency: string) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: currency,
    }).format(Number(balance));
  };

  return (
    <Card className={`${!account.isActive ? "opacity-50" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{account.name}</CardTitle>
          <Badge variant={account.isActive ? "default" : "secondary"}>
            {getAccountTypeLabel(account.type)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatBalance(account.balance, account.currency)}
        </div>
        {!account.isActive && (
          <p className="text-sm text-gray-500 mt-2">Account inactive</p>
        )}
      </CardContent>
    </Card>
  );
}
