import { Campaign, CampaignResponse } from "@/types/campaign";
import { CampaignInsightsResponse } from "@/types/campaignInsights";
import { InsightsResponse } from "@/types/insights";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Centralized response handler
async function handleResponse<T extends object>(res: Response): Promise<T> {
  let data: T | { message?: string; retry_after?: number; error?: string };

  try {
    data = (await res.json()) as T;
  } catch {
    const text = await res.text();
    data = { message: text };
  }

  if (!res.ok) {
    const status = res.status;
    const message =
      "message" in data && data.message
        ? data.message
        : "An unexpected error occurred";

    switch (status) {
      case 400:
        throw new Error(`Bad Request: ${message}`);
      case 404:
        throw new Error("Resource not found");
      case 429:
        const retryAfter = "retry_after" in data ? data.retry_after : 60;
        throw new Error(
          `Rate limit exceeded. Retry after ${retryAfter} seconds.`
        );
      case 500:
      case 502:
      case 503:
      case 504:
        throw new Error(`Server error (${status}): ${message}`);
      default:
        throw new Error(`Unexpected error (${status}): ${message}`);
    }
  }

  return data as T;
}

// Retry helper for 429
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  let attempt = 0;

  while (attempt <= retries) {
    const res = await fetch(url, options);

    if (res.status !== 429) return res;

    const data = await res.json().catch(() => ({} as { retry_after?: number }));
    const retryAfter = (data.retry_after || 1) * 1000;
    console.warn(`Rate limit hit. Retrying after ${retryAfter}ms...`);
    await new Promise((r) => setTimeout(r, retryAfter));
    attempt++;
  }

  throw new Error("Max retry attempts reached due to rate limiting.");
}

// Fetch all campaigns
export async function fetchCampaigns(): Promise<CampaignResponse> {
  const res = await fetchWithRetry(`${BASE_URL}/campaigns`, {
    cache: "no-store",
  });
  return handleResponse<CampaignResponse>(res);
}

// Fetch campaign insights
export async function fetchCampaignInsights(): Promise<
  CampaignInsightsResponse["insights"]
> {
  const res = await fetchWithRetry(`${BASE_URL}/campaigns/insights`, {
    cache: "no-store",
  });
  const data = await handleResponse<CampaignInsightsResponse>(res);
  return data.insights;
}

// Fetch campaign by ID
export async function fetchCampaignById(id: string): Promise<Campaign> {
  const res = await fetchWithRetry(`${BASE_URL}/campaigns/${id}`, {
    cache: "no-store",
  });
  const data = await handleResponse<{ campaign: Campaign }>(res);
  return data.campaign;
}

// Fetch campaign insights by ID
export async function fetchCampaignInsightsById(
  id: string
): Promise<InsightsResponse["insights"]> {
  const res = await fetchWithRetry(`${BASE_URL}/campaigns/${id}/insights`, {
    cache: "no-store",
  });
  const data = await handleResponse<InsightsResponse>(res);
  return data.insights;
}
