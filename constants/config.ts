/**
 * SMECO COOPER Mobile App Configuration
 *
 * API_BASE_URL: Points to the REST API gateway on analyticsdev2.
 * Each domain runs on its own port (4001-4010).
 * Update this if connecting via VPN or reverse proxy.
 */

// Default: direct connection to analyticsdev2
// Change this to your server's IP/hostname accessible from your phone
export const API_HOST = "http://analyticsdev2.smeco.com";

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
  return `${API_HOST}:${config.port}`;
}
