import {
  Box,
  Home,
  Kanban,
  LayoutDashboard,
  PanelsTopLeft,
  Settings,
  Shield,
  UsersIcon,
} from "lucide-react";

// Menu items.
export const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    withSeparator: false,
    children: [],
  },
  {
    title: "Projetos",
    url: "/projects",
    icon: PanelsTopLeft,
    withSeparator: false,
    children: [],
  },
  {
    title: "Minhas Tasks",
    url: "/tasks",
    icon: Kanban,
    withSeparator: false,
    children: [],
  },
  {
    title: "Artefatos",
    url: "/artifacts",
    icon: Box,
    withSeparator: false,
    children: [],
  },
  {
    title: "Membros",
    url: "/members",
    icon: UsersIcon,
    withSeparator: false,
    children: [],
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
    withSeparator: true,
    children: [
      {
        title: "Informações",
        url: "/settings/information",
        icon: LayoutDashboard,
      },
      {
        title: "Roles",
        url: "/settings/roles",
        icon: Shield,
      },
    ],
  },
];
