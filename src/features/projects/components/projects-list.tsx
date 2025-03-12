import { Project } from "@prisma/client";
import { SkeletonCard } from "@/components/skeleton-card";
import { motion } from "framer-motion";
import { Card, CardHeader } from "@/components/ui/card";
import { useGetWorkspaceProjects } from "../api/use-get-projects";
import { ProjectDataTable } from "./project-data-table";
import { ProjectColumns } from "./project-columns";

interface ProjectListProps {
  workspaceId: string;
}

export const ProjectList = ({ workspaceId }: ProjectListProps) => {
  const { data: projects, isPending } = useGetWorkspaceProjects({
    workspaceId,
  });

  return (
    <div className="h-full w-full">
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader>
          <h1 className="text-xl">Projetos do Workspace</h1>
        </CardHeader>
        {isPending || !projects ? (
          <SkeletonCard />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-2"
          >
            <div className="p-7">
              <ProjectDataTable
                columns={ProjectColumns}
                data={projects || ([] as Project[])}
                workspaceId={workspaceId}
              />
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
};
