import { redirect } from "next/navigation"

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"
import { clerkClient, currentUser } from "@clerk/nextjs"
import { CreateOrg } from "@/app/(dashboard)/dashboard/createOrg"
import Link from "next/link"

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

  console.log(
    "-----memberships",
    memberships.map((m) => m.organization)
  )
  const posts = []
  if (memberships.length === 0) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Join a team" text="Create or join a team" />
        <CreateOrg />
      </DashboardShell>
    )
  }

  return (
    <main className={"col-span-2"}>
      <DashboardShell>
        <DashboardHeader heading="Posts" text="Create and manage posts.">
          <PostCreateButton />
        </DashboardHeader>

        <div className={"flex flex-col"}>
          {memberships.map((m) => (
            <Link href={`/dashboard/${m.organization.id}`}>
              {m.organization.name}
            </Link>
          ))}
        </div>
      </DashboardShell>
    </main>
  )
}
