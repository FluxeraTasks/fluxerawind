import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.members.$post>;
type RequestType = InferRequestType<typeof client.api.members.$post>;

export const useCreateMember = () => {
  const queryCLient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.members.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Membro Criado");
      queryCLient.invalidateQueries({ queryKey: ["workspace-members"] });
    },
    onError: () => {
      toast.error("Falha ao aceitar convite");
    },
  });

  return mutation;
};
