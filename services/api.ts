/**
 * REST API client for SMECO COOPER backend
 *
 * Calls the FastAPI gateway (rest_api.py) on ports 4001-4010.
 * Each domain has its own server process, same as the MCP architecture.
 */

import { getApiUrl, getRouterUrl } from "../constants/config";

export interface AskResponse {
  domain: string;
  question: string;
  response: string;
  chart: ChartData | null;
  sql: string | null;
  elapsed_ms: number;
}

export interface RouterAskResponse {
  domains: string[];
  question: string;
  response: string;
  chart: ChartData | null;
  sql: string | null;
  routing_method: string;
  elapsed_ms: number;
}

export interface ClassifyResponse {
  question: string;
  classification: { domain: string; score: number; method: string }[];
  method: string;
  elapsed_ms: number;
}

export interface ChartData {
  columns: { name: string; type: string }[];
  rows: Record<string, string | number>[];
  chart_suggestion: {
    kind: string;
    x: string;
    y: string;
    title?: string;
    z?: string;
  };
}

export interface HealthResponse {
  status: string;
  server: string;
  domain: string;
  display_name: string;
  requires_oracle: boolean;
}

export interface InfoResponse {
  domain: string;
  display_name: string;
  tools: string[];
  ask_tool: string;
  requires_oracle: boolean;
  secondary_db: string | null;
}

/**
 * Ask a natural language question to a domain.
 */
export async function askDomain(
  domain: string,
  question: string,
  chartType: string = "",
  maxRows: string = "100"
): Promise<AskResponse> {
  const baseUrl = getApiUrl(domain);
  const res = await fetch(`${baseUrl}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      chart_type: chartType,
      max_rows: maxRows,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Check if a domain server is healthy.
 */
export async function checkHealth(domain: string): Promise<HealthResponse> {
  const baseUrl = getApiUrl(domain);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${baseUrl}/api/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

/**
 * Get server info (registered tools, domain config).
 */
export async function getInfo(domain: string): Promise<InfoResponse> {
  const baseUrl = getApiUrl(domain);
  const res = await fetch(`${baseUrl}/api/info`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Ask a question with auto-domain-classification via the router gateway.
 */
export async function askAuto(
  question: string,
  chartType: string = "",
  maxRows: number = 100
): Promise<RouterAskResponse> {
  const baseUrl = getRouterUrl();
  const res = await fetch(`${baseUrl}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      chart_type: chartType,
      max_rows: maxRows,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Classify a question without executing it.
 */
export async function classifyQuestion(
  question: string
): Promise<ClassifyResponse> {
  const baseUrl = getRouterUrl();
  const res = await fetch(`${baseUrl}/api/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Execute raw SQL (Oracle domains only).
 */
export async function executeQuery(
  domain: string,
  sql: string
): Promise<{ sql: string; response: string; elapsed_ms: number }> {
  const baseUrl = getApiUrl(domain);
  const res = await fetch(`${baseUrl}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sql }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error: ${res.status}`);
  }

  return res.json();
}
