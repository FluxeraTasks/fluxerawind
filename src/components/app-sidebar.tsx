"use client";

import { ChevronRight } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

import fluxeraIcon from "@/public/FluxeraIcon.png";
import { UserButton } from "@/features/auth/components/user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import {
  useGetParams,
  useWorkspaceId,
} from "@/features/workspaces/hooks/use-workspace-id";
import { DropdownMenuSeparator } from "./ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { items } from "./menu-items";

export function AppSidebar() {
  const workspaceid = useWorkspaceId();
  const currentPath = useGetParams();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="w-full flex justify-center items-center p-4">
          <Image src={fluxeraIcon} alt="Fluxera" width={80} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <WorkspaceSwitcher />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceid &&
                items.map((item) => {
                  const fullHref = `/workspaces/${workspaceid}${item.url}`;

                  const isActive =
                    item.url === "/"
                      ? currentPath === `/workspaces/${workspaceid}`
                        ? true
                        : false
                      : currentPath.includes(item.url);
                  return (
                    <div key={item.url}>
                      {item.withSeparator && <DropdownMenuSeparator />}
                      {item.children.length === 0 ? (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <a href={fullHref}>
                              <item.icon />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ) : (
                        <Collapsible
                          key={item.title}
                          asChild
                          className="group/collapsible"
                        >
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton tooltip={item.title}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.children?.map((subItem) => {
                                  const subFullHref = `/workspaces/${workspaceid}${subItem.url}`;
                                  return (
                                    <SidebarMenuSubItem key={subItem.title}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={currentPath.includes(
                                          subItem.url
                                        )}
                                      >
                                        <a href={subFullHref}>
                                          <subItem.icon />
                                          <span>{subItem.title}</span>
                                        </a>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      )}
                    </div>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
