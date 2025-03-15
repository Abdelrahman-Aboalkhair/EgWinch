import { Loader2 } from "lucide-react";
import React from "react";

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface TableProps {
  data: any[];
  columns: Column[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  isLoading,
  emptyMessage = "No data available",
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-none">
        <thead className="bg-green-300/20">
          <tr className="border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-2 text-left text-gray-700 font-semibold"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-500"
              >
                <Loader2 className="animate-spin mr-2 text-primary" />
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || row._id || rowIndex}
                className="hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-2">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
