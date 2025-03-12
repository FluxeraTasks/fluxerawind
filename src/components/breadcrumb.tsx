"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";

// Função para verificar se um segmento é um UUID
const isUUID = (segment: string) => /^[0-9a-fA-F-]{36}$/.test(segment);

interface BreadCrumbSchema {
  title: string;
  url: string;
  isActive: boolean;
}

export function AppBreadcrumb() {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadCrumbSchema[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const segments = pathname.split("/").filter(Boolean);

    // Função para formatar texto com a primeira letra maiúscula
    const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);

    let breadcrumbPath = "";
    let previousSegment = "";
    //   const breadcrumbs: { title: string; url: string; isActive: boolean }[] = [];

    const newBreadcrumbs: BreadCrumbSchema[] = [];

    segments.map((segment, index) => {
      breadcrumbPath += `/${segment}`;
      const title = previousSegment;

      if (isUUID(segment)) {
        newBreadcrumbs.push({
          title: capitalize(title),
          url: breadcrumbPath,
          isActive: index === segments.length - 1 ? true : false,
        });
      } else if (index === segments.length - 1) {
        newBreadcrumbs.push({
          title: capitalize(segment),
          url: breadcrumbPath,
          isActive: true,
        });
      }

      previousSegment = segment;
    });

    setBreadcrumbs(newBreadcrumbs);
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb) => (
          <BreadcrumbItem key={breadcrumb.url}>
            <BreadcrumbSeparator>
              <ChevronRight size={14} />
            </BreadcrumbSeparator>
            {breadcrumb.isActive ? (
              <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={breadcrumb.url}>
                {breadcrumb.title}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
