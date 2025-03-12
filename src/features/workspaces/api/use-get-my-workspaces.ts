import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetMyWorkspaces = () => {
  const query = useQuery({
    queryKey: ["my-workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces["my-workspaces"].$get();
      if (!response.ok) return null;

      const workspaces = await response.json();

      return workspaces;
    },
  });

  return query;
};
