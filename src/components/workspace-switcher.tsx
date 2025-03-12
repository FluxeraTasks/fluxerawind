"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useRouter } from "next/navigation";
import { CreateWorkspaceButton } from "@/features/workspaces/components/create-workspace-button";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetMyWorkspaces } from "@/features/workspaces/api/use-get-my-workspaces";

export const WorkspaceSwitcher = () => {
  const { data: workspaces } = useGetMyWorkspaces();
  const router = useRouter();
  const workspaceid = useWorkspaceId();

  const onSelect = (id: string) => {
    const workspace = workspaces?.filter((ws) => ws.id === id);
    if (!workspace) {
      router.push(`/workspaces/${id}`);
    } else {
      router.push(`/workspaces/${workspace[0].id || ""}`);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-lg">Workspaces</p>
        <CreateWorkspaceButton />
      </div>
      <Select onValueChange={onSelect} defaultValue={workspaceid}>
        <SelectTrigger className="w-full font-medium">
          <SelectValue placeholder="Selecione um Workspace" />
        </SelectTrigger>
        <SelectContent>
          {workspaces &&
            workspaces.map((item) => (
              <SelectItem
                key={item.id}
                value={item.id}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <WorkspaceAvatar name={item.title} image={item.imageUrl} />
                  <span>{item.title}</span>
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};
