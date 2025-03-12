import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.roles)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.roles)["$post"]>;

export const useCreateRole = () => {
  const queryCLient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.roles.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Role Criada");
      queryCLient.invalidateQueries({ queryKey: ["workspace-roles"] });
    },
    onError: () => {
      toast.error("Falha ao criar Role");
    },
  });

  return mutation;
};
