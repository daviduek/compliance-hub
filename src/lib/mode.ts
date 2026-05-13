export type HubMode = "demo" | "real";

export function getMode(): HubMode {
  const v = process.env.HUB_MODE || process.env.NEXT_PUBLIC_HUB_MODE;
  return v === "real" ? "real" : "demo";
}

export function isReal(): boolean {
  return getMode() === "real";
}
