import { notFound } from "next/navigation"

import { DashboardNav } from "@/components/nav"
import { clerkClient } from "@clerk/nextjs"
import * as React from "react"

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
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </>
  )
}
