"use client";

import { InsightCard } from "@/components/InsightCard";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { Insights } from "@/types/insights";
import { useCampaignInsightsStream } from "@/hooks/useCampaignInsightsStream";

export function CampaignInsightsSection({
  campaignId,
  initialInsights,
}: {
  campaignId: string;
  initialInsights: Insights;
}) {
  const { insights, status } = useCampaignInsightsStream({
    campaignId,
    initialInsights,
  });

  return (
    <section aria-busy={status === "connecting"}>
      <header className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold">Performance Insights</h2>

        {status === "live" && (
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        )}

        {status === "reconnecting" && (
          <span className="text-xs text-muted-foreground">Reconnecting…</span>
        )}

        {status === "error" && (
          <span className="text-xs text-destructive">
            Live updates unavailable
          </span>
        )}
      </header>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <InsightCard label="Clicks" value={formatNumber(insights.clicks)} />
        <InsightCard
          label="Conversions"
          value={formatNumber(insights.conversions)}
        />
        <InsightCard label="Spend" value={formatCurrency(insights.spend)} />
        <InsightCard label="CTR" value={formatPercent(insights.ctr)} />
        <InsightCard label="CPC" value={formatCurrency(insights.cpc)} />
        <InsightCard
          label="Conversion Rate"
          value={formatPercent(insights.conversion_rate)}
        />
      </div>
    </section>
  );
}
