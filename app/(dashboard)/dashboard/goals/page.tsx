import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getGoals } from "@/features/goal/queries";
import { GoalsPage } from "@/features/goal/components/GoalsPage";

export default async function GoalPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const goalData = await getGoals();

  return <GoalsPage initialGoals={goalData} />;
}
