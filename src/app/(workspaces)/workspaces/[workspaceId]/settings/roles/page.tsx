"use client";

import { RoleList } from "@/features/roles/components/roles-list";

interface Params {
  params: {
    workspaceId: string;
  };
}
const RolesWorkspacePage = (paramsPage: Params) => {
  const { params } = paramsPage;

  return (
    <div className="w-full h-full justify-center items-center">
      <RoleList workspaceId={params.workspaceId} />
    </div>
  );
};

export default RolesWorkspacePage;
