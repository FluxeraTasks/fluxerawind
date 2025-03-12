"use client";

import { SkeletonCard } from "@/components/skeleton-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetWorkspaceProject } from "@/features/projects/api/use-get-project";
import { motion } from "framer-motion";
import { Boxes, Users, Workflow } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Params {
  params: {
    workspaceId: string;
    projectId: string;
  };
}
const ProjectPage = (paramsPage: Params) => {
  const { params } = paramsPage;
  const { data: project, isPending } = useGetWorkspaceProject({
    workspaceId: params.workspaceId,
    projectId: params.projectId,
  });
  const [totalArtifacts, setTotalArtifacts] = useState(0);

  const path = usePathname();

  useEffect(() => {
    if (!project) return;

    setTotalArtifacts(
      project.Features.reduce(
        (acc, item) => acc + (item.Artifacts?.length || 0),
        0
      )
    );
  }, [project]);

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
                <h1 className="text-xl">{project?.title}</h1>
              </CardHeader>
              <CardContent>
                <div className="flex flex-1 flex-col gap-4 pt-0">
                  <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Link
                      href={`${path}/features`}
                      className="aspect-video rounded-xl bg-muted/50 flex flex-col p-10 justify-between hover:scale-105 transition"
                    >
                      <div className="flex gap-1 justify-between items-center">
                        <span className="text-lg">Features</span>
                        <Workflow color="hsl(var(--primary))" />
                      </div>
                      <div>
                        <span className="font-bold text-2xl">
                          {project.Features.length}
                        </span>
                      </div>
                    </Link>
                    <Link
                      href={`${path}/artifacts`}
                      className="aspect-video rounded-xl bg-muted/50 flex flex-col p-10 justify-between hover:scale-105 transition"
                    >
                      <div className="flex gap-1 justify-between items-center">
                        <span className="text-lg">Artefatos</span>
                        <Boxes color="hsl(var(--primary))" />
                      </div>
                      <div>
                        <span className="font-bold text-2xl">
                          {totalArtifacts}
                        </span>
                      </div>
                    </Link>
                    <Link
                      href={`${path}/members`}
                      className="aspect-video rounded-xl bg-muted/50 flex flex-col p-10 justify-between hover:scale-105 transition"
                    >
                      <div className="flex gap-1 justify-between items-center">
                        <span className="text-lg">Membros</span>
                        <Users color="hsl(var(--primary))" />
                      </div>
                      <div>
                        <span className="font-bold text-2xl">
                          {project.Members.length}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
