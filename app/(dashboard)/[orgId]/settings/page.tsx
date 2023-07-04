import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { auth, clerkClient } from "@clerk/nextjs"

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
import { OrganizationInvitedMembers } from "@/app/(dashboard)/[orgId]/settings/_components/organization-invited-members"
import { DashboardHeader } from "@/components/header"
import { Separator } from "@/components/ui/separator"

export default async function OrganizationSettingsPage() {
  const { orgId, getToken } = auth()
  if (!orgId) notFound()

  const org = await clerkClient.organizations.getOrganization({
    organizationId: orgId,
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Organization" text="Manage your organization" />
      {/* TODO: Use URL instead of clientside tabs */}
      <Tabs defaultValue="general" className={"mt-6"}>
        <TabsList className="mb-6 w-full justify-start">
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
          <h1 className="text-xl font-semibold leading-none tracking-tight">
            Active members
          </h1>

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

          <Separator />

          <div className={"flex w-full items-center justify-between"}>
            <h1 className="text-xl font-semibold leading-none tracking-tight">
              Invited members
            </h1>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="self-end">Invite member</Button>
              </DialogTrigger>
              <DialogContent>
                <InviteMemberForm />
              </DialogContent>
            </Dialog>
          </div>

          <OrganizationInvitedMembers />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
