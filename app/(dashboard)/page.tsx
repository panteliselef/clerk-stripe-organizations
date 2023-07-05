import * as React from "react"
import { redirect } from "next/navigation"
import { clerkClient, currentUser } from "@clerk/nextjs"

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"

import { MemberShipCard } from "./membership-card"
import { CreateOrgButton } from "./org-button"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/login")
  }

  const memberships = await clerkClient.users.getOrganizationMembershipList({
    userId: user.id,
    offset: 0,
    limit: 10,
  })

  if (memberships.length === 0) {
    redirect("/create-organization")
  }

  return (
    <main className={"col-span-2 space-y-6 pt-6"}>
      <DashboardHeader heading="Organizations" text="Create and manage posts.">
        <React.Suspense>
          <CreateOrgButton />
        </React.Suspense>
      </DashboardHeader>

      {memberships.length === 0 ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="post" />
          <EmptyPlaceholder.Title>
            Create your organization
          </EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any organizations yet. Create one to continue.
          </EmptyPlaceholder.Description>
          <CreateOrgButton variant={"outline"} />
        </EmptyPlaceholder>
      ) : (
        <div
          className={"grid grid-cols-1 gap-4  md:grid-cols-2 xl:grid-cols-3"}
        >
          {memberships.map((m) => (
            <MemberShipCard {...m} />
          ))}
        </div>
      )}
    </main>
  )
}
