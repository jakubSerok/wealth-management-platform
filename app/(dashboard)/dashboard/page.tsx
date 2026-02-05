"use server";
import { getUserAccounts } from "@/features/accounts/queries";
import { AccountCard } from "@/features/accounts/components/AccountCard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const userData = await getUserAccounts(session.user.id);

  if (!userData) {
    throw new Error("User data not found");
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Hello, {session.user.firstName}!</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your accounts</h2>

        {userData.accounts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              You don't have any accounts
            </h3>
            <p className="text-gray-600 mb-4">
              Add your first account to start managing your finances
            </p>
            <Button asChild>
              <Link href="/dashboard/accounts/new">Add first account</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
