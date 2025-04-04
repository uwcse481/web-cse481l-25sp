"use client";

import * as React from "react";

import {
  PAGE_LINKS_PAPER_PRESENTATIONS,
  PAGE_LINKS_PROJECT,
  PAGE_LINKS_TECHNOLOGY_LAB,
  SITE_LINKS,
} from "@/app/sitelinks";
import { Sidebar } from "@/components/Sidebar";
import { useSelectedLayoutSegments } from "next/navigation";

interface LayoutSidebarProps {}

export function LayoutSidebar({}: LayoutSidebarProps) {
  const routeSegments = useSelectedLayoutSegments();

  const pageLinks = (() => {
    if (routeSegments.length >= 1) {
      if (routeSegments[0] === "assignments") {
        if (routeSegments.length >= 2) {
          if (routeSegments[1] === "papers") {
            return PAGE_LINKS_PAPER_PRESENTATIONS;
          } else if (routeSegments[1] === "lab") {
            return PAGE_LINKS_TECHNOLOGY_LAB;
          } else if (routeSegments[1] === "project") {
            return PAGE_LINKS_PROJECT;
          }
        }
      }
    }

    return [];
  })();

  const sidebar = (
    <Sidebar siteLinks={SITE_LINKS} pageLinks={pageLinks}></Sidebar>
  );

  return sidebar;
}
