import { useParams, usePathname } from "next/navigation";

export const useWorkspaceId = () => {
  const params = useParams();
  return params.workspaceId as string;
};

export const useGetParams = () => {
  const path = usePathname();
  return path;
};
