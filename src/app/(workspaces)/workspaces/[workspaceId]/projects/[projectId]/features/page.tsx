"use client";

import { SkeletonCard } from "@/components/skeleton-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FeatureList } from "@/features/features/components/features-list";
import { useGetWorkspaceProject } from "@/features/projects/api/use-get-project";
import { motion } from "framer-motion";

interface Params {
  params: {
    workspaceId: string;
    projectId: string;
  };
}
const ProjectFeaturesPage = (paramsPage: Params) => {
  const { params } = paramsPage;
  const { data: project, isPending } = useGetWorkspaceProject({
    workspaceId: params.workspaceId,
    projectId: params.projectId,
  });

  return (
    <div className="w-full h-full justify-center items-center">
      <div className="h-full w-full">
        {isPending || !project ? (
          <SkeletonCard />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-2"
          >
            <Card className="w-full h-full border-none shadow-none">
              <CardHeader>
                <h1 className="text-xl">{project?.title} - Features</h1>
              </CardHeader>
              <CardContent>
                <FeatureList
                  features={project.Features}
                  projectId={params.projectId}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectFeaturesPage;
