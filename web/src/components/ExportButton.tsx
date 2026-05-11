import React from "react";
import { FaDownload, FaChevronDown } from "react-icons/fa";
import { Report } from "../types/types";
import { exportReportAsJson } from "../utils/exporters/json";
import { exportReportAsCsvZip } from "../utils/exporters/csv";
import { exportReportAsHtml } from "../utils/exporters/html";
import { exportAllAsHtmlZip } from "../utils/exporters/batch";
import { useChartExport } from "@/contexts/ChartExportProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportButtonProps {
  report: Report;
  fileName: string;
  files: File[];
  reports: Report[];
  selectedIndex: number;
  disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  report,
  fileName,
  files,
  reports,
  selectedIndex,
  disabled = false,
}) => {
  const { captureAll } = useChartExport();
  const hasBatch = files.length > 1;

  const handleJson = () => exportReportAsJson(report, fileName);
  const handleCsv = () => exportReportAsCsvZip(report, fileName);

  const handleHtml = async () => {
    const charts = await captureAll();
    exportReportAsHtml(report, fileName, charts);
  };

  const handleBatch = async () => {
    const charts = await captureAll();
    await exportAllAsHtmlZip(files, reports, selectedIndex, charts);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaDownload size={14} />
        <span>Export</span>
        <FaChevronDown size={10} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={handleHtml}>
          HTML report (this file)
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleJson}>
          Full report (JSON)
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleCsv}>
          Tables (CSV ZIP)
        </DropdownMenuItem>
        {hasBatch && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleBatch}>
              All findings ({files.length} files, ZIP)
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
