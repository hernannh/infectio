import { formatFileSize, getFileIcon } from "@/utils/display";
import React from "react";
import { FaTimes } from "react-icons/fa";

interface FileInfoProps {
  file: File;
  onCancel: () => void;
}

const FileInfo: React.FC<FileInfoProps> = ({ file, onCancel }) => {
  return (
    <div className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted text-3xl text-muted-foreground">
          {getFileIcon(file)}
        </div>

        <div className="flex flex-col">
          <span className="text-lg font-semibold text-foreground">
            {file.name}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatFileSize(file.size)} ·{" "}
            {new Date(file.lastModified).toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={onCancel}
        aria-label="Close file"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <FaTimes className="text-xl" />
      </button>
    </div>
  );
};

export default FileInfo;
