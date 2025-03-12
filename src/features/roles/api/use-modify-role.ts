import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.roles)["$put"]>;
type RequestType = InferRequestType<(typeof client.api.roles)["$put"]>;

export const useModifyRole = () => {
  const queryCLient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.roles["$put"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Role Modificada");
      queryCLient.invalidateQueries({ queryKey: ["workspace-roles"] });
    },
    onError: () => {
      toast.error("Falha ao modificar Role");
    },
  });

  return mutation;
};
