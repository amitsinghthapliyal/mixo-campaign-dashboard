import { PageHeader } from "@/components/PageHeader";
import { CampaignStats } from "@/components/campaigns/CampaignStats";
import { CampaignTable } from "@/components/campaigns/CampaignTable";
import { fetchCampaigns } from "@/services/api";
export const dynamic = "force-dynamic";

export default async function CampaignPage() {
  // const data = await fetchCampaigns();
  const { campaigns, total } = await fetchCampaigns();

  return (
    <>
      <PageHeader title="Campaigns" />

      <div className="space-y-6 p-6">
        <CampaignStats campaigns={campaigns} />
        <CampaignTable campaigns={campaigns} total={total} pageSize={5} />
      </div>
    </>
  );
}
