import React, { useRef, useEffect } from "react";
import Dygraph from "dygraphs";
import "dygraphs/dist/dygraph.min.css";
import { FaPlus, FaMinus, FaExpand } from "react-icons/fa";

interface LineChartProps {
  labels: string[];
  dataPoints: number[];
  title?: string;
}

const controlButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const LineChart: React.FC<LineChartProps> = ({ labels, dataPoints, title }) => {
  const graphRef = useRef<HTMLDivElement | null>(null);
  const dygraphRef = useRef<Dygraph | null>(null);

  useEffect(() => {
    if (graphRef.current) {
      const data = labels.map((label, i) => [Number(label), dataPoints[i]]);

      dygraphRef.current = new Dygraph(graphRef.current, data, {
        labels: ["Chunk", "Entropy"],
        title: title || "",
        ylabel: "Entropy",
        xlabel: "Chunk",
        strokeWidth: 1.5,
        fillGraph: true,
        color: "rgb(59, 130, 246)",
      });
    }

    return () => {
      dygraphRef.current?.destroy();
      dygraphRef.current = null;
    };
  }, [labels, dataPoints, title]);

  const handleZoomIn = () => {
    const g = dygraphRef.current;
    if (!g) return;
    const [start, end] = g.xAxisRange();
    const mid = (start + end) / 2;
    const half = ((end - start) / 2) * 0.7;
    g.updateOptions({ dateWindow: [mid - half, mid + half] });
  };

  const handleZoomOut = () => {
    const g = dygraphRef.current;
    if (!g) return;
    const [start, end] = g.xAxisRange();
    const mid = (start + end) / 2;
    const half = ((end - start) / 2) * 1.43;
    const fullStart = 0;
    const fullEnd = labels.length > 0 ? Number(labels[labels.length - 1]) : end;
    const newStart = Math.max(mid - half, fullStart);
    const newEnd = Math.min(mid + half, fullEnd);
    g.updateOptions({ dateWindow: [newStart, newEnd] });
  };

  const handleReset = () => {
    dygraphRef.current?.resetZoom();
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="relative">
        <div ref={graphRef} style={{ width: "100%", height: "300px" }} />
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-1 rounded-md border border-border bg-card/95 p-1 shadow-sm backdrop-blur">
          <button
            type="button"
            className={controlButtonClass}
            onClick={handleZoomIn}
            title="Zoom in"
            aria-label="Zoom in"
          >
            <FaPlus size={12} />
          </button>
          <button
            type="button"
            className={controlButtonClass}
            onClick={handleZoomOut}
            title="Zoom out"
            aria-label="Zoom out"
          >
            <FaMinus size={12} />
          </button>
          <button
            type="button"
            className={controlButtonClass}
            onClick={handleReset}
            title="Reset zoom"
            aria-label="Reset zoom"
          >
            <FaExpand size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LineChart;
