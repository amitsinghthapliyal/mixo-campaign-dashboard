import { Campaign, CampaignResponse } from "@/types/campaign";
import { CampaignInsightsResponse } from "@/types/campaignInsights";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchCampaigns(): Promise<CampaignResponse> {
  const res = await fetch(`${BASE_URL}/campaigns`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch campaigns");
  }

  const data: CampaignResponse = await res.json();
  return data;
}

export async function fetchCampaignInsights() {
  const res = await fetch(`${BASE_URL}/campaigns/insights`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch campaign insights");
  }

  const data: CampaignInsightsResponse = await res.json();
  return data.insights;
}

export async function fetchCampaignById(id: string): Promise<Campaign> {
  const res = await fetch(`${BASE_URL}/campaigns/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Response text:", text);
    throw new Error(`Failed to fetch campaign by id ${id}`);
  }

  const data = await res.json();
  return data.campaign;
}
