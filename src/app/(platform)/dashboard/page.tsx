import Card from "@/src/components/ui/Card";
import LanguageMetrics from "@/src/components/platform/dashboard/LanguageMetrics";
import DailyChallenges from "@/src/components/platform/dashboard/DailyChallenges";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import PieChart from "@/src/components/ui/PieChart";
import BarChart from "@/src/components/ui/BarChart";
import { ChartRadarDefault as RadarChart } from "@/src/components/ui/RadarChart";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("points")
    .eq("id", user.id)
    .single();

  const points = profile?.points ?? 0;

  return (
    <div className="theme-sync w-full px-4 pb-10 pt-20">
      <div className="mx-auto flex w-full max-w-full flex-col gap-4 ">
        <div className="flex flex-row gap-4">
          <Card title="23" description="Current Streak">
            Keep it up!
          </Card>
          <Card title={points.toLocaleString()} description="Total Points">
            +50 today
          </Card>
          <Card title="#350" description="Global Points">
            Top 23%
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="min-h-[28rem] lg:min-h-[32rem]">
            <DailyChallenges />
          </div>
          <div className="min-h-[28rem] lg:min-h-[32rem]">
            <LanguageMetrics language="Python" score={100} maxScore={100} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-row gap-4 w-full h-full">
          <PieChart
            chartData={[
              { language: "Python", points: 45 },
              { language: "JavaScript", points: 30 },
              { language: "Rust", points: 15 },
            ]}
          />
          <RadarChart />
          </div>
          
          <BarChart />
          
        </div>
      </div>
    </div>
  );
}
