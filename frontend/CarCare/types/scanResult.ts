/**
 * Scan results screen 
 *  - OCR / vision output: what appears in the photo (region, indicators, text).
 * - LLM diagnostic suggestions (uses vehicle + OCR + optional history).
 *  - YouTube videos: relevant DIY / diagnostics videos.
 */

/** Vehicle context from garage / VIN decode — send with the scan image. */
export type ScanVehicleContext = {
  vehicleId: string;
  vin: string;
  /** e.g. "2013 BMW 335i" */
  subtitle: string;
  /** User-facing label, e.g. "My BMW" */
  displayName: string;
};

/**
 * OCR / vision output: what appears in the photo (region, indicators, text).
 */
export type ScanOcrSection = {
  headline: string;
  observations: string[];
};

/**
 * LLM diagnostic suggestions (uses vehicle + OCR + optional history).
 */
export type ScanLlmSection = {
  summary: string;
  suggestions: string[];
  cautionNotes?: string[];
};

export type ScanYoutubeVideo = {
  title: string;
  url: string;
  channelTitle?: string;
};

/** Combined payload for `scanResults` — match this in `POST` JSON response body. */
export type ScanResultPayload = {
  ocr: ScanOcrSection;
  llm: ScanLlmSection;
  youtube: ScanYoutubeVideo[];
};
