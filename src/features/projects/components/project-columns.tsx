"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Project } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { ModifyProjectButton } from "./modify-project-button";
import Link from "next/link";
// import { ModifyRoleButton } from "./modify-role-button";

export const ProjectColumns: ColumnDef<Project>[] = [
  {
    accessorKey: "title",
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
    cell: ({ row }) => {
      return <span>{row.getValue("title")}</span>;
    },
  },
  {
    accessorKey: "closed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-bold"
        >
          Finalizado?
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const closed = row.getValue("closed") || false;

      return (
        <span>
          {closed ? <Switch checked={true} /> : <Switch checked={false} />}
        </span>
      );
    },
  },
  {
    accessorKey: "obsolete",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-bold"
        >
          Obsoleto?
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const obsolete = row.getValue("obsolete") || false;

      return (
        <span>
          {obsolete ? <Switch checked={true} /> : <Switch checked={false} />}
        </span>
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
      return (
        <ModifyProjectButton key={row.original.id} project={row.original} />
      );
    },
  },
  {
    id: "display",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-bold"
        >
          Acessar
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/workspaces/${row.original.workspaceId}/projects/${row.original.id}`}
          className="flex items-center"
        >
          <Button variant="default">
            <Search className="h-4 w-4" />
          </Button>
        </Link>
      );
    },
  },
];
