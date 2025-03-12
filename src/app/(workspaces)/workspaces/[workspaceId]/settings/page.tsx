"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleList } from "@/features/roles/components/roles-list";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { ModifyWorkspaceForm } from "@/features/workspaces/components/modify-workspace-form";

interface Params {
  params: {
    workspaceId: string;
  };
}
const WorkspacePage = (paramsPage: Params) => {
  const { params } = paramsPage;
  const { data: workspace } = useGetWorkspace({
    workspaceId: params.workspaceId,
  });

  return (
    <div className="w-full h-full justify-center items-center">
      <Tabs defaultValue="information">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="information">Informações</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="information">
          {workspace && <ModifyWorkspaceForm workspace={workspace} />}
          {!workspace && <Skeleton className="h-12 w-12 rounded-full" />}
        </TabsContent>
        <TabsContent value="roles">
          <RoleList workspaceId={params.workspaceId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkspacePage;
