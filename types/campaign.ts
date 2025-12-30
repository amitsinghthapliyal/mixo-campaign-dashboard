export type CampaignStatus = "active" | "paused" | "completed";

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  brand_id: number;
  daily_budget: number;
  platforms: string[];
  created_at: string;
}

export interface CampaignResponse {
  campaigns: Campaign[];
  total: number;
}
