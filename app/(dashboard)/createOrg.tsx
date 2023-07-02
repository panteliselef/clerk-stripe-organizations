"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function CreateOrg() {
  return (
    // TODO: replace this once the fix is out
    <Button onClick={() => window.Clerk.openCreateOrganization()}>
      <Icons.add className="mr-2 h-4 w-4" />
      Create Workspace
    </Button>
  )
}
