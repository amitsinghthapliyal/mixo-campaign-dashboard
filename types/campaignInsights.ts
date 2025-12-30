export interface CampaignInsights {
  timestamp: string;
  total_campaigns: number;
  active_campaigns: number;
  paused_campaigns: number;
  completed_campaigns: number;

  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  total_spend: number;

  avg_ctr: number;
  avg_cpc: number;
  avg_conversion_rate: number;
}

export interface CampaignInsightsResponse {
  insights: CampaignInsights;
}
