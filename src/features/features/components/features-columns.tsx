"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Feature } from "@prisma/client";
// import { ModifyRoleButton } from "./modify-role-button";

export const FeatureColumns: ColumnDef<Feature>[] = [
  {
    accessorKey: "userStory",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-bold"
        >
          Título
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-bold"
        >
          Ações
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: () => {
      //   return <ModifyRoleButton key={row.original.id} role={row.original} />;
      return <div>Editar</div>;
    },
  },
];
