import { getUserAccounts } from "@/features/accounts/queries";
import { DashboardContent } from "./DashboardContent";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const userData = await getUserAccounts();

  if (!userData) {
    throw new Error("User data not found");
  }

  return <DashboardContent session={session} userData={userData} />;
}
