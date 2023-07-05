import * as React from "react"
import { notFound } from "next/navigation"
import { SidebarNavItem } from "@/types"
import { auth, clerkClient } from "@clerk/nextjs"

import { DashboardNav } from "@/components/nav"

import { SyncActiveOrgFromUrl } from "./sync-active-org-from-url"

interface OrganizationLayoutProps {
  children?: React.ReactNode
  params: { orgId: string }
}

export default async function OrganizationLayout({
  children,
  params: { orgId },
}: OrganizationLayoutProps) {
  try {
    const org = await clerkClient.organizations.getOrganization({
      organizationId: orgId,
    })
    if (!org) {
      notFound()
    }
  } catch (e) {
    notFound()
  }

  // TODO: improve typesafety here
  const { orgRole } = auth()

  const allSideBarItems: SidebarNavItem[] = [
    {
      title: "Posts",
      href: `/${orgId}`,
      icon: "post",
      id: "posts",
    },
    {
      title: "Settings (custom ui)",
      href: `/${orgId}/settings`,
      icon: "settings",
      id: "settings",
    },
    {
      title: "Settings (clerk)",
      href: `/${orgId}/clerk`,
      icon: "settings",
      id: "clerk",
    },
    {
      title: "Billing",
      href: `/${orgId}/billing`,
      icon: "coins",
      id: "billing",
    },
  ]

  return (
    <>
      <SyncActiveOrgFromUrl />
      <aside className="hidden w-[200px] flex-col md:flex">
        <DashboardNav
          items={
            orgRole === "admin"
              ? allSideBarItems
              : allSideBarItems.filter((i) => ["posts", "clerk"].includes(i.id))
          }
        />
      </aside>
      <main className="relative flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </>
  )
}
