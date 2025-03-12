import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";

interface WorkspaceAvatarProps {
  image: string | null;
  name: string;
  className?: string;
}

export const WorkspaceAvatar = ({ image, className }: WorkspaceAvatarProps) => {
  if (image) {
    return (
      <div
        className={cn("size-7 relative rounded-md overflow-hidden", className)}
      >
        <Image
          src={image || ""}
          alt="Workspace"
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-7", className)}>
      <AvatarFallback className="text-white bg-primary-500 font-semibold text-lg uppercase w-full text-center">
        F
      </AvatarFallback>
    </Avatar>
  );
};
