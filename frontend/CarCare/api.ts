/** Shared `fetch` wrapper — Firebase Bearer token. Used by `services/garageApi` and others. */
import { auth } from "./firebase";

const BASE_URL = "http://localhost:6902"; 


export async function apiFetch(path: string, options: RequestInit = {}) {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // helpful error text
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }

  // return json if possible
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export type ScanAnalyzeResponse = {
  summary: string;
  filename?: string;
  uid?: string;
  bytesReceived?: number;
  suggestions?: string[];
};

/**
 * Multipart scan upload — no auth for now (camera MVP). Do not set `Content-Type` (boundary is set automatically).
 * When login is ready, add `Authorization: Bearer` here to match `apiFetch`.
 */
export async function uploadScanForAnalysis(localUri: string): Promise<ScanAnalyzeResponse> {
  const form = new FormData();
  form.append("file", {
    uri: localUri,
    name: "scan.jpg",
    type: "image/jpeg",
  } as unknown as Blob);

  const res = await fetch(`${BASE_URL}/api/scan/analyze`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }

  return res.json() as Promise<ScanAnalyzeResponse>;
}