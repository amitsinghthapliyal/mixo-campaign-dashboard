import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign } from "@/types/campaign";

export function CampaignStats({ campaigns }: { campaigns: Campaign[] }) {
  const totalBudget = campaigns.reduce((a, c) => a + c.budget, 0);
  const dailyBudget = campaigns.reduce((a, c) => a + c.daily_budget, 0);
  const activeCount = campaigns.filter((c) => c.status === "active").length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Budget"
        value={`$${totalBudget.toLocaleString()}`}
      />
      <StatCard
        title="Total Daily Budget"
        value={`$${dailyBudget.toLocaleString()}`}
      />
      <StatCard title="Active Campaigns" value={activeCount.toString()} />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
