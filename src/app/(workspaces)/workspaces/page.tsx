import { getCurrent } from "@/features/auth/actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import fluxeraIcon from "@/public/FluxeraIcon.png";

export default async function Home() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return (
    <div className="h-full w-full flex justify-center items-center flex-col gap-4">
      <Link href="/">
        <Image
          src={fluxeraIcon}
          width={150}
          height={150}
          alt="Descomplicando Linguagens"
        />
      </Link>
      <h1 className="text-4xl">Olá👋</h1>
      <h3 className="text-lg">Selecione seu Workspace</h3>
    </div>
  );
}
