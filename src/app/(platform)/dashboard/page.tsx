import Card from "@/src/components/ui/Card";

export default function DashboardPage() {

  return (
   <main className="flex h-full min-h-0 w-full flex-col overflow-y-auto gap-4 bg-cortex-aura justify-center items-center">
    <div className="flex flex-row gap-4 pt-16">
      <Card title="Recent Missions" description="Recent Missions">child</Card>
      <Card title="Recent Missions" description="Recent Missions">child</Card>
      <Card title="Recent Missions" description="Recent Missions">child</Card>
    </div>
   </main>
   
  );
}
