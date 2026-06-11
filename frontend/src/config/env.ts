// VITE_API_URL is only needed when the API is NOT reachable through the
// Vite dev proxy (e.g. testing on a phone: VITE_API_URL=http://192.168.x.x:8080).
// When unset, requests go to the same origin and the dev proxy forwards them.
export const env = {
  apiBaseUrl: ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/+$/, ''),
}
