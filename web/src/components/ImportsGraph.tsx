import React, { useRef } from "react";
import {
  GraphCanvas,
  GraphCanvasRef,
  GraphEdge,
  GraphNode,
} from "reagraph";
import { FaPlus, FaMinus, FaExpand } from "react-icons/fa";

interface ImportsGraphProps {
  root: string;
  imports: Map<string, string[]>;
}

const controlButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const ImportsGraph: React.FC<ImportsGraphProps> = ({ root, imports }) => {
  const graphRef = useRef<GraphCanvasRef | null>(null);

  const nodes: GraphNode[] = [];

  nodes.push({
    id: "root",
    label: root,
    fill: "#155582",
  });

  for (const [module, modImports] of imports) {
    nodes.push({
      id: module,
      label: module,
      fill: "#1e79ba",
    });
    for (const importedModule of modImports) {
      nodes.push({
        fill: "#1394f0",
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

  return (
    <div
      style={{ height: "500px", position: "relative" }}
      className="w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm"
    >
      <GraphCanvas ref={graphRef} nodes={nodes} edges={edges} />
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
      </div>
    </div>
  );
};

export default ImportsGraph;
