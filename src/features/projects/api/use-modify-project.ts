import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.projects)["$put"]>;
type RequestType = InferRequestType<(typeof client.api.projects)["$put"]>;

export const useModifyProject = () => {
  const queryCLient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.projects["$put"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Projeto Modificado");
      queryCLient.invalidateQueries({ queryKey: ["workspace-projects"] });
    },
    onError: () => {
      toast.error("Falha ao modificar Projeto");
    },
  });

  return mutation;
};
