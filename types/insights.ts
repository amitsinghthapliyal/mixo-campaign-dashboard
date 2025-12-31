export interface Insights {
  timestamp: string;
  campaign_id: string;
  clicks: number;
  conversions: number;
  spend: number;

  ctr: number;
  cpc: number;
  conversion_rate: number;
}

export interface InsightsResponse {
  insights: Insights;
}
