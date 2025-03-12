import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { membersSchema } from "../schema";

interface useGetWorkspaceMembersProps {
  workspaceId: string;
}

export const useGetWorkspaceMembers = ({
  workspaceId,
}: useGetWorkspaceMembersProps) => {
  const query = useQuery({
    queryKey: ["workspace-members"],
    queryFn: async () => {
      const response = await client.api.members["workspace-members"][
        ":workspaceId"
      ].$get({ param: { workspaceId } });
      if (!response.ok) return null;

      const members = await response.json();

      return members.map((member) => {
        return {
          ...member,
          createdAt: member?.createdAt ? new Date(member.createdAt) : null,
          updatedAt: member?.updatedAt ? new Date(member.updatedAt) : null,
        };
      }) as membersSchema[];
    },
  });

  return query;
};
