import { useGetWorkspaceRoles } from "../api/use-get-workspace-roles";
import { RoleDataTable } from "./role-data-table";
import { RoleColumns } from "./role-columns";
import { Role } from "@prisma/client";
import { SkeletonCard } from "@/components/skeleton-card";
import { motion } from "framer-motion";
import { Card, CardHeader } from "@/components/ui/card";

interface RoleListProps {
  workspaceId: string;
}

export const RoleList = ({ workspaceId }: RoleListProps) => {
  const { data: roles, isPending } = useGetWorkspaceRoles({ workspaceId });

  return (
    <div className="h-full w-full">
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader>
          <h1 className="text-xl">Roles do Workspace</h1>
        </CardHeader>
        {isPending || !roles ? (
          <SkeletonCard />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-2"
          >
            <div className="p-7">
              <RoleDataTable
                columns={RoleColumns}
                data={roles || ([] as Role[])}
                workspaceId={workspaceId}
              />
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
};
