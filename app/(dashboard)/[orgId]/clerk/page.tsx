import React from "react"

import { OrganizationProfile } from "@clerk/nextjs"
import { DashboardShell } from "@/components/shell"

export default function OrganizationProfilePage() {
  return (
    <DashboardShell title="Organization" description="Manage your organization">
      <OrganizationProfile />
    </DashboardShell>
  )
}
