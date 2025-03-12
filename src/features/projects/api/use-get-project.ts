import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { ProjectWithRelationsSchema } from "../schema";

interface useGetWorkspaceProjectsProps {
  projectId: string;
  workspaceId: string;
}

export const useGetWorkspaceProject = ({
  projectId,
  workspaceId,
}: useGetWorkspaceProjectsProps) => {
  const query = useQuery({
    queryKey: [`workspace-project-${projectId}`],
    queryFn: async () => {
      const response = await client.api.projects["workspace-projects"][
        ":workspaceId"
      ][":projectId"].$get({ param: { workspaceId, projectId } });
      if (!response.ok) return null;

      const project = await response.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {
        ...project,
      } as ProjectWithRelationsSchema;
    },
  });

  return query;
};
