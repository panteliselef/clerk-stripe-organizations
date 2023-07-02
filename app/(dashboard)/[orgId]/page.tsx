import { redirect } from "next/navigation"

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"
import { clerkClient, currentUser } from "@clerk/nextjs"
import { CreateOrg } from "@/app/(dashboard)/createOrg"
import { Badge } from "@/components/ui/badge"
import RefreshButton from "./refresh-button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import * as React from "react"
export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage({
  params: { orgId },
}: {
  params: { orgId: string }
}) {
  const user = await currentUser()

  if (!user) {
    redirect("/login")
  }

  const memberships = await clerkClient.users.getOrganizationMembershipList({
    userId: user.id,
    offset: 0,
    limit: 10,
  })

  const organization = await clerkClient.organizations.getOrganization({
    organizationId: orgId,
  })

  const isNotPaid = !organization.publicMetadata?.stripeSubscriptionId

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
    <>
      {isNotPaid ? (
        <div
          className={
            "absolute flex h-full w-full items-center justify-center bg-background/80"
          }
        >
          <div className={"flex items-center gap-2"}>
            <RefreshButton />
            <Badge variant={"destructive"}>Pending payment</Badge>
          </div>
        </div>
      ) : (
        <div className={"grid grid-cols-2 gap-4"}>
          <div className={"flex flex-col gap-2"}>
            <Label htmlFor="stripeSubscriptionId">SubscriptionId</Label>
            <Input
              id="stripeSubscriptionId"
              name="stripeSubscriptionId"
              defaultValue={
                organization.publicMetadata?.stripeSubscriptionId as string
              }
              disabled={true}
            />
          </div>
          <div className={"flex flex-col gap-2"}>
            <Label htmlFor="stripePriceId">PriceId</Label>
            <Input
              id="stripePriceId"
              name="stripePriceId"
              defaultValue={
                organization.publicMetadata?.stripePriceId as string
              }
              disabled={true}
            />
          </div>
          <div className={"flex flex-col gap-2"}>
            <Label htmlFor="paidUntil">Paid until</Label>
            <Input
              id="paidUntil"
              name="paidUntil"
              defaultValue={new Date(
                organization.publicMetadata?.paidUntil as string
              ).toLocaleString()}
              disabled={true}
            />
          </div>
        </div>
      )}

      <DashboardShell className={"flex flex-col gap-4"}>
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
    </>
  )
}
