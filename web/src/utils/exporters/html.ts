import { Report, Severity } from "../../types/types";
import { downloadBlob, sanitizeFileName } from "../download";

export interface ChartImages {
  entropy?: string;
  imports?: string;
}

const REPORT_VERSION = 1;

function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function severityClass(sev: string): string {
  switch (sev) {
    case Severity.High:
      return "sev sev-high";
    case Severity.Medium:
      return "sev sev-medium";
    case Severity.Low:
      return "sev sev-low";
    case Severity.Info:
      return "sev sev-info";
    default:
      return "sev";
  }
}

function metadataSection(report: Report): string {
  if (report.metadata.length === 0) return "";
  const rows = report.metadata
    .map(
      (m) =>
        `<tr><th scope="row">${escapeHtml(m.title)}</th><td>${escapeHtml(
          m.value
        )}</td></tr>`
    )
    .join("");
  return `<section><h2>Metadata</h2><table class="kv">${rows}</table></section>`;
}

function heuristicsSection(report: Report): string {
  if (report.heuristics.length === 0) return "";
  const rows = report.heuristics
    .map(
      (h) =>
        `<tr><td>${escapeHtml(h.name)}</td><td><span class="${severityClass(
          h.severity
        )}">${escapeHtml(h.severity)}</span></td></tr>`
    )
    .join("");
  return `<section><h2>Heuristics <span class="count">${report.heuristics.length}</span></h2><table><thead><tr><th>Name</th><th>Severity</th></tr></thead><tbody>${rows}</tbody></table></section>`;
}

function listSection(title: string, items: string[]): string {
  if (items.length === 0) return "";
  const rows = items
    .map((v) => `<tr><td>${escapeHtml(v)}</td></tr>`)
    .join("");
  return `<section><h2>${escapeHtml(title)} <span class="count">${
    items.length
  }</span></h2><table><tbody>${rows}</tbody></table></section>`;
}

function importsSection(report: Report): string {
  const imports = report.report?.imports as
    | Map<string, string[]>
    | undefined;
  if (!imports || imports.size === 0) return "";
  const rows: string[] = [];
  imports.forEach((funcs, dll) => {
    funcs.forEach((fn) => {
      rows.push(
        `<tr><td>${escapeHtml(dll)}</td><td>${escapeHtml(fn)}</td></tr>`
      );
    });
  });
  return `<section><h2>Imports <span class="count">${rows.length}</span></h2><table><thead><tr><th>DLL</th><th>Function</th></tr></thead><tbody>${rows.join(
    ""
  )}</tbody></table></section>`;
}

function chartsSection(charts?: ChartImages): string {
  if (!charts) return "";
  const parts: string[] = [];
  if (charts.entropy) {
    parts.push(
      `<figure><figcaption>Entropy by chunks</figcaption><img alt="Entropy chart" src="${escapeHtml(
        charts.entropy
      )}" /></figure>`
    );
  }
  if (charts.imports) {
    parts.push(
      `<figure><figcaption>Imports graph</figcaption><img alt="Imports graph" src="${escapeHtml(
        charts.imports
      )}" /></figure>`
    );
  }
  if (parts.length === 0) return "";
  return `<section><h2>Visualizations</h2><div class="figures">${parts.join(
    ""
  )}</div></section>`;
}

const STYLES = `
  *,*::before,*::after{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,sans-serif;color:#0f172a;background:#f8fafc;line-height:1.5}
  .wrap{max-width:1100px;margin:0 auto;padding:32px 24px 64px}
  header.top{border-bottom:1px solid #e2e8f0;padding-bottom:16px;margin-bottom:24px}
  header.top h1{margin:0 0 4px;font-size:22px;color:#0f172a;word-break:break-all}
  header.top .sub{color:#64748b;font-size:13px}
  .badges{margin-top:10px;display:flex;flex-wrap:wrap;gap:6px}
  .badge{display:inline-block;padding:2px 8px;border-radius:9999px;background:#e2e8f0;color:#334155;font-size:11px;font-weight:500}
  h2{font-size:16px;margin:0 0 12px;color:#0f172a;display:flex;align-items:center;gap:8px}
  .count{background:#e2e8f0;color:#475569;border-radius:9999px;padding:1px 8px;font-size:11px;font-weight:500}
  section{margin-bottom:28px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  thead th{text-align:left;background:#f1f5f9;color:#475569;font-weight:600;padding:8px 10px;border-bottom:1px solid #e2e8f0;position:sticky;top:0}
  tbody td,tbody th{padding:6px 10px;border-bottom:1px solid #f1f5f9;vertical-align:top;word-break:break-word}
  tbody tr:last-child td,tbody tr:last-child th{border-bottom:0}
  table.kv th{width:30%;text-align:left;color:#475569;font-weight:500;background:#f8fafc}
  .sev{display:inline-block;padding:1px 8px;border-radius:9999px;font-size:11px;font-weight:600}
  .sev-high{background:#fee2e2;color:#991b1b}
  .sev-medium{background:#ffedd5;color:#9a3412}
  .sev-low{background:#fef3c7;color:#854d0e}
  .sev-info{background:#dbeafe;color:#1e40af}
  .figures{display:grid;gap:16px}
  figure{margin:0;border:1px solid #e2e8f0;border-radius:6px;padding:12px;background:#f8fafc}
  figcaption{font-size:12px;color:#475569;margin-bottom:8px;font-weight:500}
  figure img{max-width:100%;height:auto;display:block;border-radius:4px;background:#fff}
  footer{margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;text-align:center}
  @media print{body{background:#fff}section{break-inside:avoid;border-color:#cbd5e1}}
`;

export function generateHtmlReport(
  report: Report,
  fileName: string,
  charts?: ChartImages
): string {
  const generatedAt = new Date().toISOString();
  const sizeEntry = report.metadata.find((m) => m.title === "Size");
  const sizeBytes = sizeEntry ? Number(sizeEntry.value) : NaN;
  const sizeLabel = Number.isFinite(sizeBytes) ? formatBytes(sizeBytes) : "";
  const contentTypeLabel =
    report.contentType?.description ||
    report.contentType?.mime_type ||
    report.contentType?.group ||
    "";

  const badges: string[] = [];
  if (sizeLabel) badges.push(sizeLabel);
  if (contentTypeLabel) badges.push(contentTypeLabel);
  badges.push(`${report.strings.length} strings`);
  if (report.ips.length) badges.push(`${report.ips.length} IPs`);
  if (report.urls.length) badges.push(`${report.urls.length} URLs`);
  if (report.heuristics.length)
    badges.push(`${report.heuristics.length} heuristics`);

  const badgesHtml = badges
    .map((b) => `<span class="badge">${escapeHtml(b)}</span>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="generator" content="Infectio export v${REPORT_VERSION}" />
<title>Infectio report — ${escapeHtml(fileName)}</title>
<style>${STYLES}</style>
</head>
<body>
<div class="wrap">
<header class="top">
<h1>${escapeHtml(fileName)}</h1>
<div class="sub">Generated ${escapeHtml(generatedAt)} · Infectio static analysis</div>
<div class="badges">${badgesHtml}</div>
</header>
${heuristicsSection(report)}
${metadataSection(report)}
${chartsSection(charts)}
${importsSection(report)}
${listSection("Strings", report.strings)}
${listSection("IPs", report.ips)}
${listSection("URLs", report.urls)}
<footer>Infectio — offline static malware analysis. Report v${REPORT_VERSION}.</footer>
</div>
</body>
</html>`;
}

export function exportReportAsHtml(
  report: Report,
  fileName: string,
  charts?: ChartImages
): void {
  const html = generateHtmlReport(report, fileName, charts);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  downloadBlob(blob, `${sanitizeFileName(fileName)}.report.html`);
}
