"use client";
import { DarkMode } from "@/components/theme/dark.mode";
import { LightMode } from "@/components/theme/light-mode";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex flex-col gap-2 text-center p-2 h-full w-full">
      <h2 className="text-sm mt-4">Escolha um Tema</h2>
      <div className="lg:col-span-4 flex lg:flex-row flex-col items-start gap-2">
        <div
          className={cn(
            "rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent h-14",
            theme == "light" && "border-purple-800"
          )}
          onClick={() => setTheme("light")}
        >
          <LightMode />
        </div>
        <div
          className={cn(
            "rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent h-14",
            theme == "dark" && "border-purple-800"
          )}
          onClick={() => setTheme("dark")}
        >
          <DarkMode />
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitch;
