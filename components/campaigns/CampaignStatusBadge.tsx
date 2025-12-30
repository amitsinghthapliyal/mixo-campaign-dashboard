import { Badge } from "@/components/ui/badge";
import { CampaignStatus } from "@/types/campaign";

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const variant =
    status === "active"
      ? "success"
      : status === "paused"
      ? "warning"
      : "secondary";

  return <Badge variant={variant}>{status}</Badge>;
}
