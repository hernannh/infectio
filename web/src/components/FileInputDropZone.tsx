import React, { useCallback, useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface FileInputDropZoneProps {
  onFileDrop: (file: File) => void;
}

export default function FileInputDropZone({
  onFileDrop,
}: FileInputDropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        onFileDrop(files[0]);
      }
    },
    [onFileDrop]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileDrop(files[0]);
    }
  };

  return (
    <div
      className={cn(
        "flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card transition-all duration-300 ease-in-out",
        isDragging
          ? "border-primary bg-accent"
          : "border-border hover:border-primary hover:bg-accent/40"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className={cn(
            "rounded-full bg-primary/10 p-4 transition-transform duration-300 ease-in-out",
            isDragging ? "scale-110" : "scale-100"
          )}
        >
          <FaUpload className="text-primary" size={32} strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            {isDragging ? "Drop your file here" : "Drag & Drop your file here"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
        </div>
      </div>
    </div>
  );
}
