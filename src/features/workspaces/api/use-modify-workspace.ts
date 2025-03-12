import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.workspaces)["$put"]>;
type RequestType = InferRequestType<(typeof client.api.workspaces)["$put"]>;

export const useModifyWorkspace = () => {
  const queryCLient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces["$put"]({ form });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspace Modificado");
      queryCLient.invalidateQueries({ queryKey: ["my-workspaces"] });
      queryCLient.invalidateQueries({ queryKey: ["workspace"] });
    },
    onError: () => {
      toast.error("Falha ao modificar Workspace");
    },
  });

  return mutation;
};
