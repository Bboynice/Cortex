import Card from "@/src/components/ui/Card";
import LanguageMetrics from "@/src/components/platform/dashboard/LanguageMetrics";
import DailyChallenges from "@/src/components/platform/dashboard/DailyChallenges";


export default function DashboardPage() {

  return (
   <main className="flex h-full min-h-0 w-full flex-col overflow-y-auto bg-cortex-aura justify-center items-center">
    <div className="flex flex-row gap-4 w-full h-auto pl-4 pr-4">
      <Card title="Current Streak" description="Current Streak">Keep it up!</Card>
      <Card title="Total Score" description="Total Points">+50 today</Card>
      <Card title="Global Score" description="Global Points">TOP 100</Card>
    </div>
    <div className="flex flex-row gap-4 w-full h-auto p-4">
      <DailyChallenges />
      <LanguageMetrics language="Python" score={100} maxScore={100} />
    </div>
    
    
   </main>
   
  );
}
