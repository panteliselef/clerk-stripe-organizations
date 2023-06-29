import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { auth, clerkClient, UserProfile } from "@clerk/nextjs"

import { InviteMemberForm } from "./_components/invite-member-dialog"
import { OrganizationImage } from "./_components/organization-image"
import { OrganizationMembers } from "./_components/organization-members"
import { OrganizationName } from "./_components/organization-name"
import { DashboardShell } from "@/components/shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoadingCard } from "./_components/loading-card"
import { env } from "@/env.mjs"

export default function WorkspaceSettingsPage(props: {
  params: { workspaceId: string }
}) {
  const { orgId } = auth()

  if (orgId) return <OrganizationSettingsPage />

  return <UserSettingsPage />
}

async function OrganizationSettingsPage() {
  const { orgId, getToken } = auth()
  if (!orgId) notFound()

  const org = await clerkClient.organizations.getOrganization({
    organizationId: orgId,
  })

  return (
    <DashboardShell title="Organization" description="Manage your organization">
      {/* TODO: Use URL instead of clientside tabs */}
      <Tabs defaultValue="general">
        <TabsList className="mb-2 w-full justify-start">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <OrganizationName orgId={org.id} name={org.name} />
          <OrganizationImage
            orgId={org.id}
            name={org.name}
            image={org.imageUrl}
          />
        </TabsContent>
        <TabsContent value="members" className="flex flex-col space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="self-end">Invite member</Button>
            </DialogTrigger>
            <DialogContent>
              <InviteMemberForm />
            </DialogContent>
          </Dialog>

          <Suspense fallback={<LoadingCard title="Members" description="" />}>
            <OrganizationMembers
              membersPromise={fetch(
                `${env.NEXT_PUBLIC_APP_URL}/api/orgs/${orgId}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${await getToken()}`,
                  },
                }
              ).then((res) => res.json())}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

function UserSettingsPage() {
  return (
    <DashboardShell title="Account" description="Manage your account details">
      <UserProfile
        appearance={{
          variables: {
            borderRadius: "var(--radius)",
            // colorBackground: "var(--background)",
          },
          elements: {
            // Main card element
            card: "shadow-none bg-background text-foreground",
            navbar: "hidden",
            navbarMobileMenuButton: "hidden",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
          },
        }}
      />
    </DashboardShell>
  )
}
