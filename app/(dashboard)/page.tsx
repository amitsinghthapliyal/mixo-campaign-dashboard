import { InsightCard } from "@/components/InsightCard";
import { fetchCampaignInsights } from "@/services/api";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const insights = await fetchCampaignInsights();

  return (
    <>
      <PageHeader title="Dashboard" />
      {insights && (
        <div className="p-6 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <InsightCard
            label="Total Campaigns"
            value={insights.total_campaigns}
          />
          <InsightCard
            label="Active Campaigns"
            value={insights.active_campaigns}
          />
          <InsightCard
            label="Impressions"
            value={formatNumber(insights.total_impressions)}
          />
          <InsightCard
            label="Clicks"
            value={formatNumber(insights.total_clicks)}
          />
          <InsightCard
            label="Spend"
            value={formatCurrency(insights.total_spend)}
          />
          <InsightCard
            label="Avg CTR"
            value={formatPercent(insights.avg_ctr)}
          />
          <InsightCard
            label="Avg CPC"
            value={formatCurrency(insights.avg_cpc)}
          />
          <InsightCard
            label="Conversion Rate"
            value={formatPercent(insights.avg_conversion_rate)}
          />
        </div>
      )}
    </>
  );
}
