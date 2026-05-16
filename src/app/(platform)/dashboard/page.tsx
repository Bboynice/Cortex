import Card from "@/src/components/ui/Card";
import LanguageMetrics from "@/src/components/platform/dashboard/LanguageMetrics";
import DailyChallenges from "@/src/components/platform/dashboard/DailyChallenges";


export default function DashboardPage() {

  return (
   <main className="flex h-full min-h-0 w-full flex-col overflow-hidden dark:bg-background items-center">
    <div className="pt-20 px-4 pb-4 flex flex-col gap-4 w-full flex-1 min-h-0">
      <div className="flex flex-row gap-4 w-full shrink-0">
        <Card title="23" description="Current Streak">Keep it up!</Card>
        <Card title="1,200" description="Total Points">+50 today</Card>
        <Card title="#350" description="Global Points">Top 23%</Card>
      </div>
      <div className="flex flex-row gap-4 w-full flex-1 min-h-0">
        <DailyChallenges />
        <LanguageMetrics language="Python" score={100} maxScore={100} />
      </div>
    </div>
   </main>
  );
}
