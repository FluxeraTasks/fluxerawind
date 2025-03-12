"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspaceSchema } from "../schema";
import { z } from "zod";
import { Card, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";
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
import { useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Workspace } from "@prisma/client";
import { useModifyWorkspace } from "../api/use-modify-workspace";
import { supabase } from "@/lib/supabaseClient";

interface ModifyWorkspaceFormProps {
  onCancel?: () => void;
  workspace?: Workspace | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const modifyWorkspaceFrontendSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Obrigatório"),
  image: z.union([
    z.instanceof(File),
    z
      .string()
      .transform((value) => (value === "" ? undefined : value))
      .optional(),
  ]),
  oldImage: z.union([
    z.instanceof(File),
    z
      .string()
      .transform((value) => (value === "" ? undefined : value))
      .optional(),
  ]),
});

export const ModifyWorkspaceForm = ({
  onCancel,
  workspace,
}: ModifyWorkspaceFormProps) => {
  const { mutate, isPending } = useModifyWorkspace();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<File>();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof modifyWorkspaceFrontendSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      title: workspace?.title,
      image: workspace?.imageUrl || "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof modifyWorkspaceFrontendSchema>
  ) => {
    let imageUrlLocal: string = "";

    console.log("IMAGEM: ", values);

    if (imageUrl instanceof File) {
      const uploadedImageUrl = await handleImageUpload(imageUrl);
      console.log(uploadedImageUrl);
      if (uploadedImageUrl) {
        imageUrlLocal = uploadedImageUrl;
      }
    }

    const finalValues = {
      ...values,
      image: typeof imageUrlLocal === "string" ? imageUrlLocal : "",
      oldImage: workspace?.imageUrl || "",
      id: workspace?.id || "",
    };

    mutate({ form: finalValues });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(file);
      form.setValue("image", file);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);

    const fileName = `workspace_${Date.now()}.${file.name.split(".").pop()}`;
    const { data, error } = await supabase.storage
      .from("fluxeraimages")
      .upload(fileName, file);

    setUploading(false);

    if (error) {
      console.error("Erro ao enviar a imagem:", error);
      return null;
    }

    // Retorna a URL pública da imagem
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fluxeraimages/${data.path}`;
    return imageUrl;
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader>
        <h1 className="text-xl">Informações do Workspace</h1>
      </CardHeader>
      <div className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Título do Workspace" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="size-[72px] relative rounded-md overflow-hidden">
                          <Image
                            alt="Workspace"
                            fill
                            className="object-cover"
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                          />
                        </div>
                      ) : (
                        <Avatar className="size-[72px] hover:opacity-75 transition border border-neutral-300">
                          <AvatarFallback className="flex justify-center items-center">
                            <ImageIcon className="size-[45px] ml-3 text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col justify-center">
                        <p className="text-sm">Workspace</p>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, SVG ou JPEG, máx 1mb
                        </p>
                        <input
                          className="hidden"
                          type="file"
                          accept=".jpg, .png, .jpeg, .svg"
                          ref={inputRef}
                          disabled={isPending || uploading}
                          onChange={handleImageChange}
                        />
                        <Button
                          type="button"
                          disabled={isPending || uploading}
                          variant="default"
                          size="sm"
                          className="w-fit mt-2"
                          onClick={() => inputRef.current?.click()}
                        >
                          {uploading ? "Enviando..." : "Upload Image"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              />
              <div className="flex items-center justify-end mt-5">
                {/* <Button
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  type="button"
                  disabled={isPending}
                >
                  Cancelar
                </Button> */}
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
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};
