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
import { ModifyRoleForm } from "./modify-role-form";
import { Role } from "@prisma/client";

interface ModifyRoleButtonProps {
  role: Role;
}

export const ModifyRoleButton = ({ role }: ModifyRoleButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button variant="ghost" onClick={() => setIsOpen(true)}>
            <Pencil />
            Modificar Role
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">
              Modificar Role
            </DialogTitle>
          </DialogHeader>
          <ModifyRoleForm onCancel={() => setIsOpen(false)} role={role} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
