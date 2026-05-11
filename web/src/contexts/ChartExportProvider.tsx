import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";

export type ChartKey = "entropy" | "imports";

export type ChartExporter = () => Promise<string | null> | string | null;

interface ChartExportContextValue {
  register: (key: ChartKey, exporter: ChartExporter) => () => void;
  capture: (key: ChartKey) => Promise<string | null>;
  captureAll: () => Promise<Partial<Record<ChartKey, string>>>;
}

const ChartExportContext = createContext<ChartExportContextValue | undefined>(
  undefined
);

export const ChartExportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const exportersRef = useRef<Map<ChartKey, ChartExporter>>(new Map());

  const register = useCallback(
    (key: ChartKey, exporter: ChartExporter) => {
      exportersRef.current.set(key, exporter);
      return () => {
        if (exportersRef.current.get(key) === exporter) {
          exportersRef.current.delete(key);
        }
      };
    },
    []
  );

  const capture = useCallback(async (key: ChartKey) => {
    const fn = exportersRef.current.get(key);
    if (!fn) return null;
    try {
      return await fn();
    } catch {
      return null;
    }
  }, []);

  const captureAll = useCallback(async () => {
    const out: Partial<Record<ChartKey, string>> = {};
    for (const key of Array.from(exportersRef.current.keys())) {
      const url = await capture(key);
      if (url) out[key] = url;
    }
    return out;
  }, [capture]);

  const value = useMemo(
    () => ({ register, capture, captureAll }),
    [register, capture, captureAll]
  );

  return (
    <ChartExportContext.Provider value={value}>
      {children}
    </ChartExportContext.Provider>
  );
};

export function useChartExport(): ChartExportContextValue {
  const ctx = useContext(ChartExportContext);
  if (!ctx) {
    throw new Error("useChartExport must be used within ChartExportProvider");
  }
  return ctx;
}
