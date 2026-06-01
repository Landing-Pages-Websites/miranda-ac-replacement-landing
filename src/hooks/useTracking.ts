"use client";

import { useEffect } from "react";

interface TrackingConfig {
  siteKey?: string;
  siteId?: string;
  gtmId?: string;
  gaId?: string;
  pixelId?: string;
}

export function useTracking(config: TrackingConfig) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("optimizer-script")) return;

    // Set MegaTag config BEFORE loading script
    if (config.siteKey) {
      (window as any).MEGA_TAG_CONFIG = {
        siteKey: config.siteKey,
        siteId: config.siteId,
        gtmId: config.gtmId,
        gaId: config.gaId,
        pixelId: config.pixelId,
      };
    }

    // Set API endpoints — REQUIRED
    (window as any).API_ENDPOINT = "https://optimizer.gomega.ai";
    (window as any).TRACKING_API_ENDPOINT = "https://events-api.gomega.ai";

    // Load optimizer script
    const script = document.createElement("script");
    script.id = "optimizer-script";
    script.src = "https://cdn.gomega.ai/scripts/optimizer.min.js";
    if (config.siteId) {
      script.setAttribute("data-site-id", config.siteId);
    }
    script.async = true;
    document.head.appendChild(script);
  }, [config]);
}
