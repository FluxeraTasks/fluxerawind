import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { Project } from "@prisma/client";

interface useGetWorkspaceProjectsProps {
  workspaceId: string;
}

export const useGetWorkspaceProjects = ({
  workspaceId,
}: useGetWorkspaceProjectsProps) => {
  const query = useQuery({
    queryKey: ["workspace-projects"],
    queryFn: async () => {
      const response = await client.api.projects["workspace-projects"][
        ":workspaceId"
      ].$get({ param: { workspaceId } });
      if (!response.ok) return null;

      const projects = await response.json();

      return projects.map((project) => {
        return {
          ...project,
          createdAt: project?.createdAt ? new Date(project.createdAt) : null,
          updatedAt: project?.updatedAt ? new Date(project.updatedAt) : null,
        };
      }) as Project[];
    },
  });

  return query;
};
