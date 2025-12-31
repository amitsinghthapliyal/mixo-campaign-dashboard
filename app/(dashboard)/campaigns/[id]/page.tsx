import { Badge } from "@/components/ui/badge";
import { CampaignStatusBadge } from "@/components/campaigns/CampaignStatusBadge";
import { fetchCampaignById, fetchCampaignInsightsById } from "@/services/api";
import { formatCurrency } from "@/lib/format";
import { Separator } from "@/components/ui/separator";
import { CampaignInsightsSection } from "@/components/campaigns/CampaignInsightsSection";
import { PageHeader } from "@/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const campaign = await fetchCampaignById(id);
  const insights = await fetchCampaignInsightsById(id);

  return (
    <>
      <PageHeader title="Campaign Insights" />
      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>

          <div className="flex flex-wrap items-center gap-4">
            <CampaignStatusBadge status={campaign.status} />

            <span className="text-sm text-muted-foreground">
              Started on{" "}
              {new Date(campaign.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <Separator />

        {/* ================= CAMPAIGN DETAILS ================= */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Campaign Details</h2>

          <div className="grid grid-cols-2 gap-6 max-w-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="font-medium">{formatCurrency(campaign.budget)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Daily Budget</p>
              <p className="font-medium">
                {formatCurrency(campaign.daily_budget)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Platforms</p>
              <div className="flex gap-2 flex-wrap mt-1">
                {campaign.platforms.map((p: string) => (
                  <Badge key={p} variant="secondary" className="capitalize">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Brand ID</p>
              <p className="font-medium">{campaign.brand_id}</p>
            </div>
          </div>
        </div>

        <Separator />
        {/* ================= PERFORMANCE INSIGHTS ================= */}
        <CampaignInsightsSection campaignId={id} initialInsights={insights} />
      </div>
    </>
  );
}
