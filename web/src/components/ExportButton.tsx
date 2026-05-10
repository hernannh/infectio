import React from "react";
import { FaDownload, FaChevronDown } from "react-icons/fa";
import { Report } from "../types/types";
import { exportReportAsJson } from "../utils/exporters/json";
import { exportReportAsCsvZip } from "../utils/exporters/csv";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportButtonProps {
  report: Report;
  fileName: string;
  disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  report,
  fileName,
  disabled = false,
}) => {
  const handleJson = () => exportReportAsJson(report, fileName);
  const handleCsv = () => exportReportAsCsvZip(report, fileName);

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
        <DropdownMenuItem onSelect={handleJson}>
          Full report (JSON)
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleCsv}>
          Tables (CSV ZIP)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
