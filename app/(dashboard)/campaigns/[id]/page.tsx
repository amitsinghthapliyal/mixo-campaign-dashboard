import { Badge } from "@/components/ui/badge";
import { CampaignStatusBadge } from "@/components/campaigns/CampaignStatusBadge";
import { fetchCampaignById } from "@/services/api";

export const dynamic = "force-dynamic";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const campaign = await fetchCampaignById(id);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{campaign.name}</h1>

      <div className="flex items-center gap-4">
        <CampaignStatusBadge status={campaign.status} />
        <span className="text-sm text-muted-foreground">
          Starts:{" "}
          {new Date(campaign.created_at).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Budget</h3>
          <p>${campaign.budget.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Daily Budget
          </h3>
          <p>${campaign.daily_budget.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Platforms
          </h3>
          <div className="flex gap-1">
            {campaign.platforms.map((p) => (
              <Badge key={p} variant="secondary" className="capitalize">
                {p}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Brand ID
          </h3>
          <p>{campaign.brand_id}</p>
        </div>
      </div>
    </div>
  );
}
