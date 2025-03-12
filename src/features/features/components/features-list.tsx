import { motion } from "framer-motion";
import { Feature } from "@prisma/client";
import { FeatureDataTable } from "./features-data-table";
import { FeatureColumns } from "./features-columns";

interface FeatureListProps {
  features: Feature[];
  projectId: string;
}

export const FeatureList = ({ features, projectId }: FeatureListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <FeatureDataTable
        columns={FeatureColumns}
        data={features || ([] as Feature[])}
        projectId={projectId}
      />
    </motion.div>
  );
};
