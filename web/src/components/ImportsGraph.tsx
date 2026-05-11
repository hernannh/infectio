import React, { useRef } from "react";
import {
  GraphCanvas,
  GraphCanvasRef,
  GraphEdge,
  GraphNode,
} from "reagraph";
import { FaPlus, FaMinus, FaExpand, FaDownload } from "react-icons/fa";
import { useTheme } from "@/contexts/ThemeProvider";
import { downloadBlob, sanitizeFileName } from "@/utils/download";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ImportsGraphProps {
  root: string;
  imports: Map<string, string[]>;
}

const controlButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const ImportsGraph: React.FC<ImportsGraphProps> = ({ root, imports }) => {
  const graphRef = useRef<GraphCanvasRef | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const palette = isDark
    ? { root: "#93c5fd", module: "#60a5fa", imported: "#3b82f6" }
    : { root: "#155582", module: "#1e79ba", imported: "#1394f0" };

  const nodes: GraphNode[] = [];

  nodes.push({
    id: "root",
    label: root,
    fill: palette.root,
  });

  for (const [module, modImports] of imports) {
    nodes.push({
      id: module,
      label: module,
      fill: palette.module,
    });
    for (const importedModule of modImports) {
      nodes.push({
        fill: palette.imported,
        id: importedModule,
        label: importedModule,
      });
    }
  }

  const edges: GraphEdge[] = [];

  for (const [module, modImports] of imports) {
    edges.push({
      id: `root-${module}`,
      source: "root",
      target: module,
    });

    for (const importedModule of modImports) {
      edges.push({
        id: `${module}-${importedModule}`,
        source: module,
        target: importedModule,
      });
    }
  }

  const baseName = sanitizeFileName(root || "imports-graph");

  const handleExportJSON = () => {
    const payload = {
      root,
      nodes: nodes.map((n) => ({ id: n.id, label: n.label })),
      edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    downloadBlob(blob, `${baseName}-imports-graph.json`);
  };

  const handleExportPNG = async () => {
    const dataUrl = graphRef.current?.exportCanvas();
    if (!dataUrl) return;
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    downloadBlob(blob, `${baseName}-imports-graph.png`);
  };

  return (
    <div
      style={{ height: "500px", position: "relative" }}
      className="w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm"
    >
      <GraphCanvas
        ref={graphRef}
        nodes={nodes}
        edges={edges}
        labelType="nodes"
      />
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1 rounded-md border border-border bg-card/95 p-1 shadow-sm backdrop-blur">
        <button
          type="button"
          className={controlButtonClass}
          onClick={() => graphRef.current?.zoomIn()}
          title="Zoom in"
          aria-label="Zoom in"
        >
          <FaPlus size={12} />
        </button>
        <button
          type="button"
          className={controlButtonClass}
          onClick={() => graphRef.current?.zoomOut()}
          title="Zoom out"
          aria-label="Zoom out"
        >
          <FaMinus size={12} />
        </button>
        <button
          type="button"
          className={controlButtonClass}
          onClick={() => graphRef.current?.centerGraph()}
          title="Reset view"
          aria-label="Reset view"
        >
          <FaExpand size={12} />
        </button>
        <div className="my-0.5 h-px bg-border" aria-hidden />
        <DropdownMenu>
          <DropdownMenuTrigger
            className={controlButtonClass}
            title="Export graph"
            aria-label="Export graph"
          >
            <FaDownload size={12} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6}>
            <DropdownMenuItem onSelect={handleExportJSON}>
              Nodes &amp; edges (JSON)
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleExportPNG}>
              Canvas (PNG)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ImportsGraph;
