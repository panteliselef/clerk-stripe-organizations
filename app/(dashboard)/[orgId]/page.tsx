import * as React from "react"
import { redirect } from "next/navigation"
import { clerkClient, currentUser } from "@clerk/nextjs"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"

import RefreshButton from "./refresh-button"

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

  const organization = await clerkClient.organizations.getOrganization({
    organizationId: orgId,
  })

  const isNotPaid = !organization.publicMetadata?.stripeSubscriptionId
  const posts = []

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
                // @ts-expect-error
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
