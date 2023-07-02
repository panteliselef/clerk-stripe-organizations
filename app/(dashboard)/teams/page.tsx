import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { DashboardShell } from "@/components/shell"
import { OrganizationProfile } from "@clerk/nextjs"

export const metadata = {
  title: "Dashboard",
}

export default async function TeamPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <PostCreateButton />
      </DashboardHeader>
      <OrganizationProfile />
    </DashboardShell>
  )
}
