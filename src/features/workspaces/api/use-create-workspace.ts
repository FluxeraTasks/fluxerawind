import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.workspaces)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.workspaces)["$post"]>;

export const useCreateWorkspace = () => {
  // const router = useRouter();
  const queryCLient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces["$post"]({ form });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspace Criado");
      queryCLient.invalidateQueries({ queryKey: ["my-workspaces"] });
    },
    onError: () => {
      toast.error("Falha ao criar Workspace");
    },
  });

  return mutation;
};
