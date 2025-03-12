import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { Workspace } from "@prisma/client";

interface useGerWorkspaceProps {
  workspaceId: string;
}

export const useGetWorkspace = ({ workspaceId }: useGerWorkspaceProps) => {
  const query = useQuery({
    queryKey: ["my-workspace"],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"].$get({
        param: { workspaceId },
      });
      if (!response.ok) return null;

      const workspace = await response.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {
        ...workspace,
        createdAt: workspace?.createdAt ? new Date(workspace.createdAt) : null,
        updatedAt: workspace?.updatedAt ? new Date(workspace.updatedAt) : null,
      } as Workspace;
    },
  });

  return query;
};
