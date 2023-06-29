"use client"
/**
 * From acme
 */

import * as React from "react"
import { useParams } from "next/navigation"
import { useOrganizationList } from "@clerk/nextjs"

/**
 * I couldn't find a way to do this on the server :thinking: Clerk is adding support for this soon.
 * If I go to /[workspaceId]/**, I want to set the active organization to the workspaceId,
 * If it's a personal worksapce, set the organization to null, else find the organization by id
 * and set it to that.
 */
export function SyncActiveOrgFromUrl() {
  const { orgId } = useParams() as { orgId: string }
  const { setActive, isLoaded } = useOrganizationList()

  React.useEffect(() => {
    if (!isLoaded) return

    if (!orgId?.startsWith("org_")) {
      void setActive({ organization: null })
      return
    }

    if (orgId) {
      void setActive({ organization: orgId })
    }
  }, [orgId, isLoaded, setActive])

  return null
}
