import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { Role } from "@prisma/client";

interface useGetWorkspaceRolesProps {
  workspaceId: string;
}

export const useGetWorkspaceRoles = ({
  workspaceId,
}: useGetWorkspaceRolesProps) => {
  const query = useQuery({
    queryKey: ["workspace-roles"],
    queryFn: async () => {
      const response = await client.api.roles["workspace-roles"][
        ":workspaceId"
      ].$get({ param: { workspaceId } });
      if (!response.ok) return null;

      const roles = await response.json();

      return roles.map((role) => {
        return {
          ...role,
          createdAt: role?.createdAt ? new Date(role.createdAt) : null,
          updatedAt: role?.updatedAt ? new Date(role.updatedAt) : null,
        };
      }) as Role[];
    },
  });

  return query;
};
