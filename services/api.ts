import { Campaign, CampaignResponse } from "@/types/campaign";
import { CampaignInsightsResponse } from "@/types/campaignInsights";
import { InsightsResponse } from "@/types/insights";

function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not defined. Set it in Vercel Environment Variables."
    );
  }

  return baseUrl;
}

const BASE_URL = getBaseUrl();

type ApiErrorPayload = {
  message?: string;
  error?: string;
  retry_after?: number;
};

//  RESPONSE HANDLER
async function handleResponse<T>(res: Response): Promise<T> {
  const raw = await res.text();

  let parsed: unknown = {};
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { message: raw };
    }
  }

  if (!res.ok) {
    const payload = parsed as ApiErrorPayload;

    const message =
      payload.message ??
      payload.error ??
      `Request failed with status ${res.status}`;

    throw new Error(`[API ${res.status}] ${message}`);
  }

  return parsed as T;
}

//  FETCH WITH RETRY

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  let attempt = 0;

  while (attempt <= retries) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });

      if (res.status !== 429) {
        return res;
      }

      // Rate limit handling
      const raw = await res.text();
      let retryAfter = 1;

      if (raw) {
        try {
          const parsed = JSON.parse(raw) as ApiErrorPayload;
          retryAfter = parsed.retry_after ?? 1;
        } catch {
          retryAfter = 1;
        }
      }

      console.warn(
        `Rate limited (429). Retrying in ${retryAfter}s... [${
          attempt + 1
        }/${retries}]`
      );

      await new Promise((r) => setTimeout(r, retryAfter * 1000));
    } catch (error) {
      if (attempt === retries) {
        console.error(`Network error fetching ${url}`, error);
        throw new Error(`Network error while fetching ${url}`);
      }
    }

    attempt++;
  }

  throw new Error("Max retry attempts exceeded.");
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
  if (!id) {
    throw new Error("fetchCampaignById: id is required");
  }

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
  if (!id) {
    throw new Error("fetchCampaignInsightsById: id is required");
  }

  const res = await fetchWithRetry(`${BASE_URL}/campaigns/${id}/insights`, {
    cache: "no-store",
  });

  const data = await handleResponse<InsightsResponse>(res);
  return data.insights;
}
