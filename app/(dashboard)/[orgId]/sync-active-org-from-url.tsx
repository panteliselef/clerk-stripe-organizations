"use client"
/**
 * From acme
 */

import * as React from "react"
import { redirect, useParams } from "next/navigation"
import { useAuth, useOrganizationList } from "@clerk/nextjs"

/**
 * I couldn't find a way to do this on the server :thinking: Clerk is adding support for this soon.
 * If I go to /[workspaceId]/**, I want to set the active organization to the workspaceId,
 * If it's a personal worksapce, set the organization to null, else find the organization by id
 * and set it to that.
 */
export function SyncActiveOrgFromUrl() {
  const { orgId } = useParams() as { orgId: string }
  const { orgId: activeOrgId } = useAuth()
  const { setActive, isLoaded } = useOrganizationList()

  React.useEffect(() => {
    if (!isLoaded) return

    if (!orgId?.startsWith("org_")) {
      // void setActive({ organization: null })
      redirect("/")
      return
    }

    if (orgId && orgId !== activeOrgId) {
      /**
       * Set active will force router to reload
       * https://github.com/clerkinc/javascript/blob/830589237e8a2c87fe41d9a159420c754dc7fba6/packages/nextjs/src/app-router/client/ClerkProvider.tsx#L26
       */
      void setActive({ organization: orgId })
    }
  }, [orgId, isLoaded, setActive, activeOrgId])

  return null
}

/**
 * Having both will not work and will trigger an infinite loop
 */
export function SyncActiveOrgToUrl() {
  const { orgId: activeOrgId } = useAuth()
  const { setActive, isLoaded } = useOrganizationList()
  const { orgId } = useParams() as { orgId: string }

  React.useEffect(() => {
    if (!isLoaded) return

    if (orgId && orgId !== activeOrgId) {
      window.history.pushState({}, "", `/${activeOrgId}`)
    }
  }, [orgId, isLoaded, setActive, activeOrgId])

  return null
}
