import Papa from "papaparse";
import JSZip from "jszip";
import { Report } from "../../types/types";
import { downloadBlob, sanitizeFileName } from "../download";

function toCsv<T>(rows: T[], fields: string[]): string {
  return Papa.unparse(
    { fields, data: rows },
    { quotes: true, newline: "\n" }
  );
}

function stringsCsv(strings: string[]): string {
  return toCsv(
    strings.map((value) => ({ value })),
    ["value"]
  );
}

function ipsCsv(ips: string[]): string {
  return toCsv(
    ips.map((value) => ({ value })),
    ["value"]
  );
}

function urlsCsv(urls: string[]): string {
  return toCsv(
    urls.map((value) => ({ value })),
    ["value"]
  );
}

function importsCsv(imports: Map<string, string[]> | undefined): string {
  if (!imports) return toCsv([], ["dll", "function"]);
  const rows: { dll: string; function: string }[] = [];
  imports.forEach((funcs, dll) => {
    funcs.forEach((fn) => rows.push({ dll, function: fn }));
  });
  return toCsv(rows, ["dll", "function"]);
}

function heuristicsCsv(
  heuristics: { name: string; severity: string }[]
): string {
  return toCsv(heuristics, ["name", "severity"]);
}

function metadataCsv(
  metadata: { title: string; value: string }[]
): string {
  return toCsv(metadata, ["title", "value"]);
}

export async function exportReportAsCsvZip(
  report: Report,
  sourceFileName: string
): Promise<void> {
  const zip = new JSZip();

  zip.file("strings.csv", stringsCsv(report.strings));
  zip.file("ips.csv", ipsCsv(report.ips));
  zip.file("urls.csv", urlsCsv(report.urls));
  zip.file("imports.csv", importsCsv(report.report?.imports));
  zip.file("heuristics.csv", heuristicsCsv(report.heuristics));
  zip.file("metadata.csv", metadataCsv(report.metadata));

  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, `${sanitizeFileName(sourceFileName)}.tables.zip`);
}
