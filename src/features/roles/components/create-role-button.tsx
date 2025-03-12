import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CreateRoleForm } from "./create-role-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface CreateRoleButtonProps {
  workspaceId: string;
}

export const CreateRoleButton = ({ workspaceId }: CreateRoleButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button variant="default">
          <PlusCircle />
          Criar Role
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">Criar Roles</DialogTitle>
        </DialogHeader>
        <CreateRoleForm
          onCancel={() => setIsOpen(false)}
          workspaceId={workspaceId}
        />
      </DialogContent>
    </Dialog>
  );
};
