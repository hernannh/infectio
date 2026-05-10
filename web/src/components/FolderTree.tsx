import { formatFileSize } from "@/utils/display";
import React, { useState } from "react";
import {
  FaFolder,
  FaFolderOpen,
  FaFileAlt,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaExternalLinkAlt,
  FaChartBar,
  FaLock,
} from "react-icons/fa";

interface Item {
  name: string;
  item_type: "file" | "directory";
  size: number;
  data: Uint8Array;
  encrypted: boolean;
}

interface TreeNode {
  name: string;
  children: TreeNode[];
  isDirectory: boolean;
  size: number;
  data?: Uint8Array;
  encrypted: boolean;
}

interface FolderTreeProps {
  items: Item[];
  onScanFile?: (file: File) => void;
  onShowEntropy?: (file: File) => void;
}

const buildTree = (items: Item[]): TreeNode[] => {
  const root: TreeNode[] = [];

  const addToTree = (node: TreeNode[], pathParts: string[], item: Item) => {
    const part = pathParts.shift();
    if (!part) return;

    let childNode = node.find((child) => child.name === part);

    if (!childNode) {
      childNode = {
        encrypted: item.encrypted,
        name: part,
        children: [],
        isDirectory: pathParts.length > 0 || item.item_type === "directory",
        size: item.size,
      };
      node.push(childNode);
    }

    if (pathParts.length > 0) {
      addToTree(childNode.children, pathParts, item);
    } else if (item.item_type === "file") {
      childNode.data = item.data;
    }
  };

  items.forEach((item) => {
    const parts = item.name.split("/").filter(Boolean);
    addToTree(root, parts, item);
  });

  return root;
};

const iconButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const FolderTree: React.FC<FolderTreeProps> = ({
  items,
  onScanFile,
  onShowEntropy,
}) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleNode = (path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const downloadFile = (fileName: string, data: Uint8Array) => {
    data = new Uint8Array(data);
    const blob = new Blob([data as BlobPart], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderTree = (nodes: TreeNode[], parentPath = "") => {
    return nodes.map((node) => {
      const currentPath = `${parentPath}/${node.name}`;

      return (
        <div
          key={currentPath}
          className={`w-full ${parentPath != "" ? "pl-4" : ""}`}
        >
          {node.isDirectory ? (
            <div className="w-full">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={() => toggleNode(currentPath)}
              >
                <span className="flex items-center gap-2">
                  {expanded[currentPath] ? (
                    <FaFolderOpen className="text-muted-foreground" />
                  ) : (
                    <FaFolder className="text-muted-foreground" />
                  )}
                  <span className="font-medium">{node.name}/</span>
                </span>
                {expanded[currentPath] ? (
                  <FaChevronUp className="text-muted-foreground" size={12} />
                ) : (
                  <FaChevronDown className="text-muted-foreground" size={12} />
                )}
              </button>
              {expanded[currentPath] && (
                <div className="mt-1 space-y-1 pl-4">
                  {renderTree(node.children, currentPath)}
                </div>
              )}
            </div>
          ) : (
            <div className="flex w-full items-center rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent/40">
              <FaFileAlt className="mr-2 text-muted-foreground" />
              <span className="text-foreground">{node.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                ({formatFileSize(node.size)})
              </span>
              {node.data && !node.encrypted && (
                <div className="ml-auto flex items-center gap-1">
                  {onShowEntropy && (
                    <button
                      type="button"
                      className={iconButtonClass}
                      onClick={() => {
                        let file = new File(
                          [new Uint8Array(node.data!)],
                          node.name
                        );
                        onShowEntropy(file);
                      }}
                      title="Show entropy"
                      aria-label="Show entropy"
                    >
                      <FaChartBar />
                    </button>
                  )}
                  {onScanFile && (
                    <button
                      type="button"
                      className={iconButtonClass}
                      onClick={() => {
                        let file = new File(
                          [new Uint8Array(node.data!)],
                          node.name
                        );
                        onScanFile(file);
                      }}
                      title="Scan file"
                      aria-label="Scan file"
                    >
                      <FaExternalLinkAlt />
                    </button>
                  )}
                  <button
                    type="button"
                    title="Download file"
                    aria-label="Download file"
                    className={iconButtonClass}
                    onClick={() => downloadFile(node.name, node.data!)}
                  >
                    <FaDownload />
                  </button>
                </div>
              )}
              {node.encrypted && (
                <div className="ml-auto flex items-center gap-1 text-destructive">
                  <span className="text-xs font-medium">Encrypted</span>
                  <FaLock />
                </div>
              )}
            </div>
          )}
        </div>
      );
    });
  };

  if (items.length === 0) {
    return null;
  }

  const tree = buildTree(items);

  return (
    <div className="w-full space-y-1 rounded-lg border border-border bg-card p-3 shadow-sm">
      {renderTree(tree)}
    </div>
  );
};

export default FolderTree;
