import { PropsWithChildren } from "react"

import { RoleGuard } from "../role-guard"

export default function OrgSettingsLayout({
  children,
  params: { orgId },
}: PropsWithChildren<{ params: { orgId: string } }>) {
  return (
    <RoleGuard allowedRoles={["admin"]} redirectTo={`/${orgId}`}>
      {children}
    </RoleGuard>
  )
}
