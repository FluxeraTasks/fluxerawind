import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRole } from "../api/use-create-role";
import { createRoleSchema } from "../schema";
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

interface CreateRoleFormProps {
  onCancel?: () => void;
  workspaceId: string;
}

export const CreateRoleForm = ({
  onCancel,
  workspaceId,
}: CreateRoleFormProps) => {
  const { mutate, isPending } = useCreateRole();

  const form = useForm<z.infer<typeof createRoleSchema>>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      workspaceId,
      canManage: false,
      getArtifact: true,
      getProject: true,
      getTask: true,
      postArtifact: false,
      postProject: false,
      postTask: false,
      putArtifact: false,
      putProject: false,
      putTask: false,
      delArtifact: false,
      delProject: false,
      delTask: false,
    },
  });

  const onSubmit = (values: z.infer<typeof createRoleSchema>) => {
    console.log(values);
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
                name="name"
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
              <FormField
                control={form.control}
                name="canManage"
                render={({ field }) => (
                  <FormItem className="flex gap-2 flex-col">
                    <FormLabel>Pode Gerenciar?</FormLabel>
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
            <div className="flex flex-col gap-y-5 max-h-[40vh] overflow-auto">
              <div className="p-4 rounded-lg">
                <h1 className="font-bold text-xl mb-2">Projetos</h1>
                <div className="flex justify-between">
                  <FormField
                    control={form.control}
                    name="getProject"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 flex-col">
                        <FormLabel>Visualizar Projetos?</FormLabel>
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
                    name="postProject"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 flex-col">
                        <FormLabel>Criar Projetos?</FormLabel>
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
                    name="putProject"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 flex-col">
                        <FormLabel>Modificar Projetos?</FormLabel>
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
                    name="delProject"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 flex-col">
                        <FormLabel>Deletar Projetos?</FormLabel>
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
              <div className="p-4 rounded-lg">
                <h1 className="font-bold text-xl mb-2">Atividades</h1>
                <div className="flex justify-between">
                  <FormField
                    control={form.control}
                    name="getTask"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 flex-col">
                        <FormLabel>Visualizar Atividades?</FormLabel>
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
                    name="postTask"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 flex-col">
                        <FormLabel>Criar Atividades?</FormLabel>
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
                    name="putTask"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 flex-col">
                        <FormLabel>Modificar Atividades?</FormLabel>
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
                    name="delTask"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 flex-col">
                        <FormLabel>Deletar Atividades?</FormLabel>
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
              <div className="p-4 rounded-lg">
                <h1 className="font-bold text-xl mb-2">Artefatos</h1>
                <div className="flex justify-between">
                  <FormField
                    control={form.control}
                    name="getArtifact"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 flex-col">
                        <FormLabel>Visualizar Artefatos?</FormLabel>
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
                    name="postArtifact"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 flex-col">
                        <FormLabel>Criar Artefatos?</FormLabel>
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
                    name="putArtifact"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 flex-col">
                        <FormLabel>Modificar Artefatos?</FormLabel>
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
                    name="delArtifact"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 flex-col">
                        <FormLabel>Deletar Artefatos?</FormLabel>
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
