import { notFound } from "next/navigation"

import { DashboardNav } from "@/components/nav"
import { clerkClient } from "@clerk/nextjs"
import * as React from "react"
import { SyncActiveOrgFromUrl } from "./sync-active-org-from-url"
import { Organization } from "@clerk/backend"

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

  return (
    <>
      <SyncActiveOrgFromUrl />
      <aside className="hidden w-[200px] flex-col md:flex">
        <DashboardNav
          items={[
            {
              title: "Posts",
              href: `/dashboard/${orgId}`,
              icon: "post",
            },
            {
              title: "Settings",
              href: `/dashboard/${orgId}/settings`,
              icon: "settings",
            },
          ]}
        />
      </aside>
      <main className="relative flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </>
  )
}
