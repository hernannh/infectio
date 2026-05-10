import React from "react";
import Table from "./Table";
import { TableCellProps } from "react-virtualized";
import { FaExternalLinkAlt } from "react-icons/fa";

interface IpsProps {
  ips: string[];
}

interface IpsData {
  value: string;
  link: string;
}

const Ips: React.FC<IpsProps> = ({ ips }) => {
  const data = ips.map((ip) => ({
    value: ip,
    link: `https://check-host.net/ip-info?host=${ip}`,
  }));

  const columns = [
    { label: "IP", dataKey: "value" as keyof IpsData },
    {
      label: "Inspect",
      dataKey: "link" as keyof IpsData,
      cellRenderer: (value: TableCellProps) => (
        <a
          href={value.cellData}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          {value.cellData} <FaExternalLinkAlt size={12} />
        </a>
      ),
    },
  ];

  return <Table data={data} columns={columns} searchKeys={["value"]} />;
};

export default Ips;
