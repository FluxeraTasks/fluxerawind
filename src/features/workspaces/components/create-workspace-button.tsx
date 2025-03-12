import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { BadgePlus } from "lucide-react";

export const CreateWorkspaceButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <BadgePlus className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Criar Workspace</DialogTitle>
        </DialogHeader>
        <CreateWorkspaceForm onCancel={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
