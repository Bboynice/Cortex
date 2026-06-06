import Card from "@/src/components/ui/Card";
import DailyChallenges from "@/src/components/platform/dashboard/DailyChallenges";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import PieChart from "@/src/components/ui/PieChart";
import { ChartRadarDefault as RadarChart } from "@/src/components/ui/RadarChart";
import BarChart from "@/src/components/ui/BarChart";

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
    <div className="theme-sync min-h-0 flex-1 overflow-y-auto px-4 pb-10 pt-20">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full flex-row gap-4">
        <div className="flex w-[70%] flex-col gap-4 py-4">
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
          <BarChart
            chartData={[
              { date: "12-06-2026", points: "+186" },
              { date: "13-06-2026", points: "+305" },
              { date: "14-06-2026", points: "+237" },
              { date: "15-06-2026", points: "+730" },
              { date: "16-06-2026", points: "+209" },
              { date: "17-06-2026", points: "+214" },
              { date: "18-06-2026", points: "+214" },
              { date: "19-06-2026", points: "+214" },
              { date: "20-06-2026", points: "+214" },
              { date: "21-06-2026", points: "+214" },
              { date: "22-06-2026", points: "+214" },
              { date: "23-06-2026", points: "+214" },
              { date: "24-06-2026", points: "+214" },
              { date: "25-06-2026", points: "+214" },
            ]}
          />
          <DailyChallenges />
        </div>

        <div className="flex w-[30%] flex-col gap-4 py-4">
          <div className="h-[220px] w-full shrink-0">
            <PieChart
              chartData={[
                { language: "Python", points: 45 },
                { language: "JavaScript", points: 30 },
                { language: "Rust", points: 15 },
              ]}
            />
          </div>
          <div className="min-h-[280px] flex-1 w-full">
            <RadarChart
              chartData={[
                { topic: "If/Else", value: 186 },
                { topic: "Loops", value: 305 },
                { topic: "Math", value: 237 },
                { topic: "Bitwise", value: 273 },
                { topic: "Strings", value: 209 },
                { topic: "Parsing", value: 214 },
                { topic: "Arrays", value: 214 },
                { topic: "Hash Maps", value: 214 },
                { topic: "Sorting", value: 214 },
                { topic: "Bin Search", value: 214 },
                { topic: "2 Ptr", value: 214 },
                { topic: "Sliding", value: 214 },
                { topic: "Recursion", value: 214 },
                { topic: "DP", value: 214 },
                { topic: "States", value: 214 },
                { topic: "Date/Time", value: 214 },
                { topic: "OOP", value: 214 },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
