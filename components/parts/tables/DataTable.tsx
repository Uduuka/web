"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";
import { ReactNode, useState } from "react";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import Popup from "@/components/ui/Popup";
import { Check } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  errorMessage?: ReactNode;
  emptyMessage?: ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  errorMessage,
  emptyMessage = "No results.",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="flex flex-col gap-5 min-h-[80vh]">
      <div className="flex items-center justify-between gap-5">
        <FormInput
          placeholder="Filter by ad name..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="bg-white text-base"
          wrapperStyle="w-full max-w-80"
        />
        <Popup
          className="w-full max-w-60"
          contentStyle="w-full mt-2"
          trigger={
            <Button className="w-full bg-white text-base">Columns</Button>
          }
        >
          <div className="">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const checked = column.getIsVisible();

                return (
                  <Button
                    key={column.id}
                    className="capitalize w-full justify-start bg-transparent text-accent hover:bg-gray-100"
                    onClick={() => column.toggleVisibility(!checked)}
                  >
                    <span className="w-5">
                      {checked && <Check size={15} />}
                    </span>
                    {column.id}
                  </Button>
                );
              })}
          </div>
        </Popup>
      </div>
      <div className="flex-1 flex flex-col ">
        <div className="overflow-hidden flex-1 flex flex-col rounded-lg">
          <Table>
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center p-0"
                  >
                    {errorMessage ? errorMessage : emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-end px-5 rounded-lg space-x-2 py-4 bg-white">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-40"
        >
          Previous
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-40"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
