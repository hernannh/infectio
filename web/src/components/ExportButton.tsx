import React, { useEffect, useRef, useState } from "react";
import { FaDownload, FaChevronDown } from "react-icons/fa";
import { Report } from "../types/types";
import { exportReportAsJson } from "../utils/exporters/json";
import { exportReportAsCsvZip } from "../utils/exporters/csv";

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
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleJson = () => {
    setOpen(false);
    exportReportAsJson(report, fileName);
  };

  const handleCsv = async () => {
    setOpen(false);
    await exportReportAsCsvZip(report, fileName);
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center space-x-2 px-3 py-1 rounded border border-gray-300 bg-white text-blue-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaDownload size={14} />
        <span>Export</span>
        <FaChevronDown size={10} />
      </button>

      {open && !disabled && (
        <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-300 rounded shadow-md z-20">
          <button
            type="button"
            onClick={handleJson}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Full report (JSON)
          </button>
          <button
            type="button"
            onClick={handleCsv}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Tables (CSV ZIP)
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
