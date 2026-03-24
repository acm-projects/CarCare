/**
 * Backend integration toggle (single switch for the team).
 * - `true`: `garageApi` uses in-memory mock store + dev seed data; no server required.
 * - `false`: `garageApi` calls real `apiFetch` routes — teammate implements those handlers.
 */
export const GARAGE_API_USE_MOCK = true;
