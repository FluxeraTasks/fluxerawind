"use client";

import { SkeletonCard } from "@/components/skeleton-card";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { ModifyWorkspaceForm } from "@/features/workspaces/components/modify-workspace-form";
import { motion } from "framer-motion";

interface Params {
  params: {
    workspaceId: string;
  };
}
const InformationWorkspacePage = (paramsPage: Params) => {
  const { params } = paramsPage;
  const { data: workspace } = useGetWorkspace({
    workspaceId: params.workspaceId,
  });

  return (
    <div className="w-full h-full justify-center items-center">
      {workspace && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="p-2"
        >
          <ModifyWorkspaceForm workspace={workspace} />
        </motion.div>
      )}
      {!workspace && <SkeletonCard />}
    </div>
  );
};

export default InformationWorkspacePage;
