"use client";
import { useCreateMember } from "@/features/members/api/use-create-workspace-member";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SmilePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface AcceptInvitePageProps {
  searchParams: {
    invite: string;
  };
}

export default function AcceptInvitePage({
  searchParams,
}: AcceptInvitePageProps) {
  const route = useRouter();
  const { mutate } = useCreateMember();

  const invite = searchParams.invite;

  const inviteExpire = atob(invite).split("/")[0];
  const workspaceId = atob(invite).split("/")[1];

  const createMember = () => {
    mutate(
      { json: { workspaceId } },
      {
        onSuccess: () => {
          toast.success("Convite aceito com sucesso!");
          route.push(`/workspaces/${workspaceId}`);
        },
        onError: () => {
          toast.error("Erro ao aceitar convite!");
          route.push("/sign-in");
        },
      }
    );
  };

  if (isInviteExpired(inviteExpire)) {
    route.push("/sign-in");
  }

  return (
    <div className="h-full w-full flex justify-center items-center flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="p-2 flex flex-col gap-7 justify-center items-center"
      >
        <SmilePlus size={50} />
        <Button onClick={() => createMember()}>Aceitar Convite</Button>
      </motion.div>
    </div>
  );
}

const isInviteExpired = (invite: string) => {
  const [timestampStr] = invite.split("/");
  const inviteTimestamp = parseInt(timestampStr, 10);

  if (isNaN(inviteTimestamp)) {
    return true;
  }

  const now = Date.now();
  const expirationTime = 2 * 60 * 60 * 1000; // 2 horas em milissegundos

  return now > inviteTimestamp + expirationTime;
};
