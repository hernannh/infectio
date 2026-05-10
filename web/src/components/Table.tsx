import React from "react";
import {
  Table as RVTable,
  Column,
  AutoSizer,
  TableCellRenderer,
} from "react-virtualized";
import { FaSearch } from "react-icons/fa";

export interface ColumnConfig<T> {
  label: string;
  dataKey: keyof T;
  width?: number;
  cellRenderer?: TableCellRenderer;
}

interface TableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  searchKeys?: (keyof T)[];
  search?: boolean;
  onRowClick?: (row: T) => void;
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  searchKeys,
  search = true,
  onRowClick,
}: TableProps<T>) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredData =
    search && searchKeys
      ? data.filter((item) =>
          searchKeys.some((key) =>
            String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      : data;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      {search && (
        <div className="relative w-full border-b border-border">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search in ${data.length} records...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      )}
      <div
        className="w-full"
        style={{
          height: Math.min(filteredData.length, 5) * 40 + 50,
        }}
      >
        <AutoSizer>
          {({ width, height }) => (
            <RVTable
              width={width}
              height={height}
              headerHeight={50}
              rowHeight={40}
              rowCount={filteredData.length}
              rowGetter={({ index }) => filteredData[index]}
              headerClassName="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              rowClassName={({ index }) =>
                `border-b border-border/60 text-sm text-foreground transition-colors hover:bg-accent/50 ${
                  index % 2 === 0 ? "bg-card" : "bg-muted/30"
                }`
              }
              onRowClick={({ rowData }) => onRowClick && onRowClick(rowData)}
            >
              {columns.map((column) => (
                <Column
                  key={column.dataKey as string}
                  width={column.width || width}
                  label={column.label}
                  dataKey={column.dataKey as string}
                  cellRenderer={column.cellRenderer}
                />
              ))}
            </RVTable>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default Table;
