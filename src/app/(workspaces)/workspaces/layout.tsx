"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { AppBreadcrumb } from "@/components/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="h-screen">
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <main className="w-full h-full">
          <div className="p-2 flex items-center gap-2 px-4 ">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <AppBreadcrumb />
          </div>
          <div className="p-2 w-full h-full">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
