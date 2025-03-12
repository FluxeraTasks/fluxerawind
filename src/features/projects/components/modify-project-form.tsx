import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Project } from "@prisma/client";
import { useModifyProject } from "../api/use-modify-project";
import { modifyProjectSchema } from "../schema";

interface ModifyProjectFormProps {
  onCancel?: () => void;
  project: Project;
}

export const ModifyProjectForm = ({
  onCancel,
  project,
}: ModifyProjectFormProps) => {
  const { mutate, isPending } = useModifyProject();

  const form = useForm<z.infer<typeof modifyProjectSchema>>({
    resolver: zodResolver(modifyProjectSchema),
    defaultValues: {
      id: project.id,
      title: project.title,
      obsolete: project.obsolete,
      closed: project.closed,
    },
  });

  const onSubmit = (values: z.infer<typeof modifyProjectSchema>) => {
    mutate(
      { json: values },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <div className="p-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-5 mb-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Administrador" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-start gap-4 items-center mt-2">
                <FormField
                  control={form.control}
                  name="closed"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 flex-col">
                      <FormLabel>Finalizado?</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="obsolete"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 flex-col">
                      <FormLabel>Obsoleto?</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-5">
              <Button
                size="lg"
                variant="secondary"
                onClick={onCancel}
                type="button"
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                size="lg"
                variant="default"
                onClick={onCancel}
                type="submit"
                disabled={isPending}
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};
