"use client";

import { ReactNode } from "react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (value: any, item: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  loading?: boolean;
  error?: string;
  data: T[];
}

export default function Table<T>({
  columns,
  data,
  loading,
  error,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table
        className="w-full text-xs text-accent border-collapse"
        role="table"
        aria-labelledby="table-caption"
      >
        <thead>
          <tr className="bg-primary text-white">
            {columns.map((column) => (
              <th
                key={column.key}
                className="p-3 text-left font-bold w-fit"
                scope="col"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-3 text-center bg-uduuka-bg"
              >
                loading ...
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "" : "bg-background/50"
                } hover:bg-accent/10 transition`}
              >
                {columns.map((column, colIndex) => {
                  const value = (item as any)[column.key];
                  const content = column.render
                    ? column.render(value, item)
                    : value?.toString() || "-";
                  return (
                    <td
                      key={column.key}
                      className="p-3"
                      scope={colIndex === 0 ? "row" : undefined}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
