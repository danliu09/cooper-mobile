/**
 * SMECO COOPER Mobile App Configuration
 *
 * Two modes:
 *   PROXY mode (default): All traffic goes through analytics.smeco.com/ai/api/
 *     Nginx proxies to analyticsdev2 ports. Works over VPN.
 *   DIRECT mode: Talk to analyticsdev2 ports directly (corp network only).
 *
 * Set USE_PROXY = false for direct mode (testing on corp network).
 */

export const USE_PROXY = true;

// Proxy mode: Nginx on analytics.smeco.com forwards /ai/api/{domain}/ to analyticsdev2
export const PROXY_BASE_URL = "https://analytics.smeco.com/ai/api";

// Direct mode: talk to analyticsdev2 ports directly
export const DIRECT_HOST = "http://analyticsdev2.smeco.com";

export const DOMAINS = [
  { name: "reliability", port: 4001, label: "Reliability", icon: "flash" as const, color: "#e74c3c" },
  { name: "human_resource", port: 4002, label: "HR", icon: "people" as const, color: "#3498db" },
  { name: "weather", port: 4003, label: "Weather", icon: "cloud" as const, color: "#2ecc71" },
  { name: "scada", port: 4004, label: "SCADA", icon: "hardware-chip" as const, color: "#9b59b6" },
  { name: "oms", port: 4005, label: "OMS", icon: "warning" as const, color: "#e67e22" },
  { name: "ccb", port: 4006, label: "CC&B", icon: "card" as const, color: "#1abc9c" },
  { name: "eip", port: 4007, label: "EIP", icon: "speedometer" as const, color: "#f39c12" },
  { name: "ami", port: 4008, label: "AMI", icon: "analytics" as const, color: "#8e44ad" },
  { name: "ellipse", port: 4009, label: "Ellipse", icon: "construct" as const, color: "#2c3e50" },
  { name: "wms", port: 4010, label: "WMS", icon: "cube" as const, color: "#16a085" },
] as const;

export type DomainName = typeof DOMAINS[number]["name"];

export function getDomainConfig(name: string) {
  return DOMAINS.find((d) => d.name === name);
}

export function getApiUrl(domain: string) {
  const config = getDomainConfig(domain);
  if (!config) throw new Error(`Unknown domain: ${domain}`);

  if (USE_PROXY) {
    // Proxy mode: https://analytics.smeco.com/ai/api/hr
    // Map domain name to short name used in Nginx
    const shortName = DOMAIN_SHORT_NAMES[config.name] || config.name;
    return `${PROXY_BASE_URL}/${shortName}`;
  }

  // Direct mode: http://analyticsdev2.smeco.com:4002
  return `${DIRECT_HOST}:${config.port}`;
}

// Short names for Nginx proxy paths (domain name → URL segment)
const DOMAIN_SHORT_NAMES: Record<string, string> = {
  human_resource: "hr",
  // All others use their domain name as-is
};

// Router gateway URL (auto-classification endpoint)
export function getRouterUrl() {
  if (USE_PROXY) {
    return `${PROXY_BASE_URL}/router`;
  }
  return `${DIRECT_HOST}:4000`;
}

// Domain label lookup
export function getDomainLabel(name: string): string {
  const config = getDomainConfig(name);
  return config?.label || name;
}
