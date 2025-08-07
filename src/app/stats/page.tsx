import { StatisticsDisplay } from "@/components/StatisticsDisplay";

export default function StatsPage() {
  return (
    <div className="w-full space-y-8 mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Access Statistics</h1>
        <p className="text-muted-foreground">
          An overview of your website access habits.
        </p>
      </div>
      <StatisticsDisplay />
    </div>
  );
}
