import { getUserAccounts } from "@/features/accounts/queries";
import { getProfileStats } from "@/features/profile/queries";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { ProfileStats } from "@/features/profile/components/ProfileStats";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const userData = await getUserAccounts();
  const profileStats = await getProfileStats();

  if (!userData) {
    throw new Error("User data not found");
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profil Użytkownika</h1>
        <p className="text-muted-foreground">
          Zarządzaj swoimi danymi osobowymi
        </p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Left column - 1/3 width */}
        <div className="w-1/3">
          <ProfileForm
            initialData={{
              firstName: (userData as any)?.firstName || "",
              lastName: (userData as any)?.lastName || "",
              email: session?.user?.email || "",
            }}
          />
        </div>

        {/* Right column - 2/3 width for stats */}
        <div className="w-2/3">
          <ProfileStats
            netWorth={profileStats.netWorth}
            lastYearNetWorth={profileStats.lastYearNetWorth}
            totalDividends={Number(profileStats.totalDividends)}
            monthlyData={profileStats.monthlyData}
            monthlyDividends={profileStats.monthlyDividends}
            recentTransactions={profileStats.recentTransactions}
          />
        </div>
      </div>
    </div>
  );
}
