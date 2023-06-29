import { redirect } from "next/navigation"

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"
import { clerkClient, CreateOrganization, currentUser } from "@clerk/nextjs"
import { CreateOrg } from "@/app/(dashboard)/dashboard/createOrg"

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
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <PostCreateButton />
      </DashboardHeader>
      <div>
        {posts?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any posts yet. Start creating content.
            </EmptyPlaceholder.Description>
            <PostCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
