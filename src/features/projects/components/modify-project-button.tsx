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
import { Project } from "@prisma/client";
import { ModifyProjectForm } from "./modify-project-form";

interface ModifyProjectButtonProps {
  project: Project;
}

export const ModifyProjectButton = ({ project }: ModifyProjectButtonProps) => {
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
              Modificar Projeto
            </DialogTitle>
          </DialogHeader>
          <ModifyProjectForm
            onCancel={() => setIsOpen(false)}
            project={project}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
