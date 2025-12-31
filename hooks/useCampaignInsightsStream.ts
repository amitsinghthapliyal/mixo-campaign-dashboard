import { useCallback, useEffect, useRef, useState } from "react";
import { Insights } from "@/types/insights";

type StreamStatus = "idle" | "connecting" | "live" | "reconnecting" | "error";

interface Args {
  campaignId: string;
  initialInsights: Insights;
}

const MAX_RETRIES = 5;
const BASE_DELAY = 1000;

function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not defined. Set it in Vercel Environment Variables."
    );
  }

  return baseUrl;
}

export function useCampaignInsightsStream({
  campaignId,
  initialInsights,
}: Args) {
  const BASE_URL = getBaseUrl();

  const [insights, setInsights] = useState<Insights>(initialInsights);
  const [status, setStatus] = useState<StreamStatus>("idle");

  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const connectRef = useRef<(id: string) => void>(() => {});

  const cleanup = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback(
    (id: string) => {
      if (eventSourceRef.current) return;

      setStatus(retryCountRef.current > 0 ? "reconnecting" : "connecting");

      const es = new EventSource(`${BASE_URL}/campaigns/${id}/insights/stream`);

      eventSourceRef.current = es;

      es.onopen = () => {
        retryCountRef.current = 0;
        setStatus("live");
      };

      es.onmessage = (event) => {
        const payload = JSON.parse(event.data);

        setInsights((prev) => ({
          ...prev,
          ...(payload.insights ?? payload),
        }));
      };

      es.onerror = () => {
        cleanup();

        if (retryCountRef.current >= MAX_RETRIES) {
          setStatus("error");
          return;
        }

        const delay = BASE_DELAY * Math.pow(2, retryCountRef.current);

        retryCountRef.current += 1;

        reconnectTimeoutRef.current = setTimeout(() => {
          connectRef.current(id);
        }, delay);
      };
    },
    [BASE_URL, cleanup]
  );

  // Keep latest connect in ref
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  // Defer initial connection (prevents cascading renders)
  useEffect(() => {
    queueMicrotask(() => {
      connectRef.current(campaignId);
    });

    return cleanup;
  }, [campaignId, cleanup]);

  // Pause / resume on tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cleanup();
      } else {
        queueMicrotask(() => {
          connectRef.current(campaignId);
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [campaignId, cleanup]);

  return {
    insights,
    status,
  };
}
