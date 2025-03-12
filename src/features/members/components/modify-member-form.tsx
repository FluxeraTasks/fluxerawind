import { Card } from "@/components/ui/card";
import { membersSchema, modifyMemberSchema } from "../schema";
import { useModifyMembers } from "../api/use-modify-workspace-members";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGetWorkspaceRoles } from "@/features/roles/api/use-get-workspace-roles";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModifyMemberFormProps {
  onCancel?: () => void;
  member: membersSchema;
}

export const ModifyMemberForm = ({
  onCancel,
  member,
}: ModifyMemberFormProps) => {
  const { mutate, isPending } = useModifyMembers();
  const { data: roles = [] } = useGetWorkspaceRoles({
    workspaceId: member.workspaceId,
  });

  const form = useForm<z.infer<typeof modifyMemberSchema>>({
    resolver: zodResolver(modifyMemberSchema),
    defaultValues: {
      id: member.id,
      roleId: member.roleId ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof modifyMemberSchema>) => {
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
              <div>
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
                  <FormControl>
                    <Input
                      value={member.User?.name}
                      placeholder="Administrador"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles &&
                            roles.map((role) => {
                              return (
                                <SelectItem
                                  key={role.id}
                                  value={role.id}
                                  className="cursor-pointer"
                                >
                                  <span>{role.name}</span>
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
