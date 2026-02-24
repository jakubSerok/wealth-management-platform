import { getUserAccounts } from "@/features/accounts/queries";
import { getProfileStats } from "@/features/profile/queries";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { ProfileStats } from "@/features/profile/components/ProfileStats";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProfileContent } from "@/features/profile/components/ProfileContent";

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ProfileContent
        userData={userData}
        profileStats={profileStats}
        session={session}
      />
    </div>
  );
}
