"use client";

import { useEffect, useCallback, useRef } from "react";

// ============================================================================
// CONFIGURATION — Miranda AC Replacement LP
// ============================================================================
const CONFIG = {
  CUSTOMER_ID: "2ada2261-a19a-4a75-a3d3-e1fd0f75a901",
  SITE_ID: "529f83af-a4e3-47ca-9cfc-c68f0388db1e",
  SOURCE_PROVIDER: "customer-landing-miranda-ac-replacement",
  ENDPOINT: "https://analytics.gomega.ai/submission/submit",
};

const STORAGE_KEYS = {
  VISITOR_ID: "_mega_vid",
  SESSION_ID: "_mega_sid",
  ATTRIBUTION: "_mega_attr",
};

// ============================================================================
// TYPES
// ============================================================================
declare global {
  interface Window {
    MegaTag?: {
      trackEvent: (eventType: string, eventData: Record<string, unknown>) => void;
      getVisitorId: () => string;
      getSessionId: () => string;
      getAttribution: () => Record<string, unknown>;
      version: string;
    };
  }
}
interface Attribution {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  fbclid: string | null;
  fbp: string | null;
  fbc: string | null;
}

interface SubmissionPayload {
  customer_id: string;
  site_id: string;
  source_provider: string;
  form_data: Record<string, unknown>;
  url: string;
  referrer_url: string | null;
  session_id: string;
  visitor_id: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  fbclid: string | null;
  fbp: string | null;
  fbc: string | null;
}

interface SubmissionResponse {
  success: boolean;
  [key: string]: unknown;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const generateId = (prefix: string): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  )}`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

const getVisitorId = (): string => {
  if (typeof localStorage === "undefined") return generateId("vis");
  let visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  if (!visitorId) {
    visitorId = generateId("vis");
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
  }
  return visitorId;
};

const getSessionId = (): string => {
  if (typeof sessionStorage === "undefined") return generateId("sess");
  let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
  if (!sessionId) {
    sessionId = generateId("sess");
    sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  }
  return sessionId;
};

// ============================================================================
// ATTRIBUTION CAPTURE
// ============================================================================
const captureAttribution = (): Attribution => {
  if (typeof window === "undefined") {
    return {
      utm_source: null, utm_medium: null, utm_campaign: null,
      utm_term: null, utm_content: null, gclid: null,
      gbraid: null, wbraid: null, fbclid: null, fbp: null, fbc: null,
    };
  }

  const url = new URL(window.location.href);
  const params = url.searchParams;

  const attribution: Attribution = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
    gclid: params.get("gclid"),
    gbraid: params.get("gbraid"),
    wbraid: params.get("wbraid"),
    fbclid: params.get("fbclid"),
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
  };

  return attribution;
};

const initAttribution = (): Attribution => {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return captureAttribution();
  }

  const trackingParams = ["utm_source", "gclid", "fbclid", "gbraid", "wbraid"];
  const url = new URL(window.location.href);
  const hasTrackingParams = trackingParams.some((param) => url.searchParams.has(param));

  if (hasTrackingParams) {
    const attribution = captureAttribution();
    localStorage.setItem(STORAGE_KEYS.ATTRIBUTION, JSON.stringify(attribution));
    return attribution;
  }

  const stored = localStorage.getItem(STORAGE_KEYS.ATTRIBUTION);
  if (stored) {
    try { return JSON.parse(stored) as Attribution; }
    catch { console.warn("Failed to parse stored attribution"); }
  }

  const attribution = captureAttribution();
  localStorage.setItem(STORAGE_KEYS.ATTRIBUTION, JSON.stringify(attribution));
  return attribution;
};

// ============================================================================
// THE HOOK
// ============================================================================
interface UseMegaLeadFormReturn {
  submit: (formData: Record<string, unknown>) => Promise<SubmissionResponse>;
  isReady: boolean;
}

export const useMegaLeadForm = (): UseMegaLeadFormReturn => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      initAttribution();
      isInitialized.current = true;
    }
  }, []);

  const submit = useCallback(
    async (formData: Record<string, unknown>): Promise<SubmissionResponse> => {
      const attribution = initAttribution();

      const payload: SubmissionPayload = {
        customer_id: CONFIG.CUSTOMER_ID,
        site_id: CONFIG.SITE_ID,
        source_provider: CONFIG.SOURCE_PROVIDER,
        form_data: formData,
        url: window.location.href,
        referrer_url: document.referrer || null,
        session_id: getSessionId(),
        visitor_id: getVisitorId(),
        utm_source: attribution.utm_source,
        utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign,
        utm_term: attribution.utm_term,
        utm_content: attribution.utm_content,
        gclid: attribution.gclid,
        gbraid: attribution.gbraid,
        wbraid: attribution.wbraid,
        fbclid: attribution.fbclid,
        fbp: attribution.fbp,
        fbc: attribution.fbc,
      };

      // Track form submission with MegaTag for conversion events
      // EVERY submission tracked — qualified AND disqualified.
      if (typeof window !== "undefined" && window.MegaTag?.trackEvent) {
        window.MegaTag.trackEvent("form_submit", {
          form_data: formData,
          source_provider: CONFIG.SOURCE_PROVIDER,
          url: window.location.href,
          referrer: document.referrer || null,
          element: "lead-form",
        });
      }

      const response = await fetch(CONFIG.ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    []
  );

  return { submit, isReady: typeof window !== "undefined" };
};

export default useMegaLeadForm;
