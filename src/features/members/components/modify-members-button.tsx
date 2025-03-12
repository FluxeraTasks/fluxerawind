import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { membersSchema } from "../schema";
import { ModifyMemberForm } from "./modify-member-form";

interface ModifyRoleButtonProps {
  member: membersSchema;
}

export const ModifyMemberButton = ({ member }: ModifyRoleButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button variant="warning" onClick={() => setIsOpen(true)}>
            <Pencil />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">
              Modificar Membro
            </DialogTitle>
          </DialogHeader>
          <ModifyMemberForm onCancel={() => setIsOpen(false)} member={member} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
