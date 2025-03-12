"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { membersSchema } from "../schema";
import { ModifyMemberButton } from "./modify-members-button";

export const MembersColumns: ColumnDef<membersSchema>[] = [
  {
    accessorKey: "User.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-bold"
        >
          Usuário
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "Role.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-bold"
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.original.roleId ? "default" : "destructive"}
          className="pl-3 pr-3 pt-1 pb-1"
        >
          {row.original.Role?.name ? row.original.Role?.name : "Visitante"}
        </Badge>
      );
    },
  },
  {
    id: "modify",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-bold"
        >
          Modificar
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <ModifyMemberButton key={row.original.id} member={row.original} />;
    },
  },
];
