"use client";
import { MemberList } from "@/features/members/components/members-list";

interface Params {
  params: {
    workspaceId: string;
  };
}
const MemberPage = (paramsPage: Params) => {
  const { params } = paramsPage;

  return (
    <div className="w-full h-full justify-center items-center">
      <MemberList workspaceId={params.workspaceId} />
    </div>
  );
};

export default MemberPage;
