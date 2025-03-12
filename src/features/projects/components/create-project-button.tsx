import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateProjectForm } from "./create-project-form";

interface CreateProjectButtonProps {
  workspaceId: string;
}

export const CreateProjectButton = ({
  workspaceId,
}: CreateProjectButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button variant="default">
          <PlusCircle />
          Criar Projeto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">Criar Projeto</DialogTitle>
        </DialogHeader>
        <CreateProjectForm
          onCancel={() => setIsOpen(false)}
          workspaceId={workspaceId}
        />
      </DialogContent>
    </Dialog>
  );
};
