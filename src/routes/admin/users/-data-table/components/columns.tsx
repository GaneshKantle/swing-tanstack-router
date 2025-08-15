"use client";

// ** Import 3rd Party Libs
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

// ** Import Components
import { DataTableColumnHeader } from "@/components/data-table/column-header";

// ** Import UI Components
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// ** Import Schema
import { UserCamelCase } from "../schema";

// ** Import Table Row Actions
import { DataTableRowActions } from "./row-actions";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

export const getColumns = (handleRowDeselection: ((rowId: string) => void) | null | undefined): ColumnDef<UserCamelCase>[] => {
  // Base columns without the select column
  const baseColumns: ColumnDef<UserCamelCase>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => <div className="truncate text-left">{row.getValue("id")}</div>,
      size: 70,
    },
    {
      accessorKey: "image",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Image" />,
      cell: ({ row }) => (
        <div className="font-medium truncate text-left w-10 h-10 rounded-full flex items-center justify-center">
          <Avatar className="w-10 h-10 rounded-full flex items-center justify-center">
            <AvatarImage src={row.getValue("image")} className="object-cover object-center" />
            <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      ),
      size: 50,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => <div className="font-medium truncate text-left">{row.getValue("name")}</div>,
      size: 200,
    },

    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 truncate">
            <span className="truncate font-medium">{row.getValue("email")}</span>
          </div>
        );
      },
      size: 250,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
      cell: ({ row }) => {
        return (
          <div className="flex items-center truncate">
            <span className="truncate">{row.getValue("phone")}</span>
          </div>
        );
      },
      size: 150,
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        // Format date as "MMM d, yyyy" (e.g., "Mar 16, 2025")
        const formattedDate = format(date, "MMM d, yyyy");
        return <div className="max-w-full text-left truncate">{formattedDate}</div>;
      },
      size: 120,
    },
    {
      id: "actions",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
      cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
      size: 100,
    },
  ];

  // Only include the select column if row selection is enabled
  if (handleRowDeselection !== null) {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <div className="pl-2 truncate">
            <Checkbox
              checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
              className="translate-y-0.5 cursor-pointer"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="truncate">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                if (value) {
                  row.toggleSelected(true);
                } else {
                  row.toggleSelected(false);
                  // If we have a deselection handler, use it for better cross-page tracking
                  if (handleRowDeselection) {
                    handleRowDeselection(row.id);
                  }
                }
              }}
              aria-label="Select row"
              className="translate-y-0.5 cursor-pointer"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },
      ...baseColumns,
    ];
  }

  // Return only the base columns if row selection is disabled
  return baseColumns;
};
