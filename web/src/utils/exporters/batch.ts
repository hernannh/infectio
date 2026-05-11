import JSZip from "jszip";
import { Report } from "../../types/types";
import { downloadBlob, sanitizeFileName } from "../download";
import { ChartImages, generateHtmlReport } from "./html";

function dedupeName(base: string, used: Set<string>): string {
  let candidate = base;
  let n = 1;
  while (used.has(candidate)) {
    candidate = `${base}-${n++}`;
  }
  used.add(candidate);
  return candidate;
}

export async function exportAllAsHtmlZip(
  files: File[],
  reports: Report[],
  selectedIndex: number,
  selectedCharts: ChartImages,
  zipFileName = "infectio-findings"
): Promise<void> {
  const zip = new JSZip();
  const used = new Set<string>();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const report = reports[i];
    if (!file || !report) continue;
    const charts = i === selectedIndex ? selectedCharts : undefined;
    const html = generateHtmlReport(report, file.name, charts);
    const base = dedupeName(sanitizeFileName(file.name), used);
    zip.file(`${base}.report.html`, html);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, `${sanitizeFileName(zipFileName)}.zip`);
}
