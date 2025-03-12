import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.projects)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>;

export const useCreateProject = () => {
  const queryCLient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.projects.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Projeto Criado");
      queryCLient.invalidateQueries({ queryKey: ["workspace-projects"] });
    },
    onError: () => {
      toast.error("Falha ao criar Projeto");
    },
  });

  return mutation;
};
