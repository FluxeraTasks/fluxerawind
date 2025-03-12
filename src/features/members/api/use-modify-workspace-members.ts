import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.members.$put>;
type RequestType = InferRequestType<typeof client.api.members.$put>;

export const useModifyMembers = () => {
  const queryCLient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.members.$put({ json });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Membro Modificado");
      queryCLient.invalidateQueries({ queryKey: ["workspace-members"] });
    },
    onError: () => {
      toast.error("Falha ao modificar Membro");
    },
  });

  return mutation;
};
