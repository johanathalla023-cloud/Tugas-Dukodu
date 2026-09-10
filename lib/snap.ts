"use client";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

let snapPromise: Promise<boolean> | null = null;

export function midtransIsConfiguredClient(): boolean {
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
  return (
    (clientKey.startsWith("SB-") || clientKey.startsWith("Mid-")) &&
    !clientKey.includes("PLACEHOLDER")
  );
}

export function loadSnap(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.snap) return Promise.resolve(true);
  if (snapPromise) return snapPromise;

  snapPromise = new Promise((resolve) => {
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
    const env = (process.env.NEXT_PUBLIC_MIDTRANS_ENV || "").toLowerCase();
    const isSandbox =
      env === "sandbox" || env === "staging" || env === "test" ||
      (env !== "production" && env !== "prod" && clientKey.startsWith("SB-"));
    const base = isSandbox
      ? "https://app.sandbox.midtrans.com/snap/snap.js"
      : "https://app.midtrans.com/snap/snap.js";

    const existing = document.querySelector('script[data-snap-loaded="true"]');
    if (existing) {
      resolve(!!window.snap);
      return;
    }

    const script = document.createElement("script");
    script.src = base;
    script.setAttribute("data-client-key", clientKey);
    script.setAttribute("data-snap-loaded", "true");
    script.async = true;
    script.onload = () => {
      setTimeout(() => resolve(!!window.snap), 300);
    };
    script.onerror = () => {
      snapPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return snapPromise;
}

export async function openSnapPayment(
  token: string,
  callbacks: {
    onSuccess?: (result: any) => void;
    onPending?: (result: any) => void;
    onError?: (result: any) => void;
    onClose?: () => void;
  }
): Promise<boolean> {
  const loaded = await loadSnap();
  if (!loaded || !window.snap) return false;
  window.snap.pay(token, callbacks);
  return true;
}