import { Report } from "../../types/types";
import { downloadBlob, sanitizeFileName } from "../download";

function mapAwareReplacer(_key: string, value: unknown): unknown {
  if (value instanceof Map) {
    return Object.fromEntries(value);
  }
  return value;
}

export function reportToJsonString(report: Report): string {
  return JSON.stringify(report, mapAwareReplacer, 2);
}

export function exportReportAsJson(report: Report, sourceFileName: string): void {
  const json = reportToJsonString(report);
  const blob = new Blob([json], { type: "application/json" });
  downloadBlob(blob, `${sanitizeFileName(sourceFileName)}.report.json`);
}
