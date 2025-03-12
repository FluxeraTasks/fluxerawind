import { motion } from "framer-motion";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useGetWorkspaceMembers } from "../api/use-get-workspace-members";
import { SkeletonCard } from "@/components/skeleton-card";
import { MemberDataTable } from "./members-data-table";
import { MembersColumns } from "./members-columns";

interface MemberListProps {
  workspaceId: string;
}

export const MemberList = ({ workspaceId }: MemberListProps) => {
  const { data: members, isPending } = useGetWorkspaceMembers({ workspaceId });

  const onInviteHandle = () => {
    const invite = `${Date.now()}/${workspaceId}`;
    navigator.clipboard.writeText(
      `http://localhost:3000/accept-invite?invite=${btoa(invite)}`
    );
    toast.success("Link do convite copiado!");
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex flex-row justify-between items-center">
        <h1 className="text-xl">Membros do Workspace</h1>
        <Button onClick={onInviteHandle}>
          <Copy />
          Gerar Convite
        </Button>
      </CardHeader>
      {isPending || !members ? (
        <SkeletonCard />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="p-2"
        >
          <div className="p-7">
            <MemberDataTable columns={MembersColumns} data={members} />
          </div>
        </motion.div>
      )}
    </Card>
  );
};
