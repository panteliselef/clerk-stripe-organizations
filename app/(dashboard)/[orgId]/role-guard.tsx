import type { PropsWithChildren, ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"

export function RoleGuard({
  allowedRoles,
  children,
  fallback: Fallback,
  redirectTo,
}: PropsWithChildren<
  {
    allowedRoles: string[]
  } & (
    | {
        fallback: ReactNode
        redirectTo?: never
      }
    | {
        fallback?: never
        redirectTo: string
      }
  )
>) {
  const { orgRole } = auth()

  const handleFallback = () => {
    if (!redirectTo && !Fallback)
      throw new Error("Provide <RoleGuard /> with a fallback or redirectTo")

    if (redirectTo) {
      return redirect(redirectTo)
    }

    return <>{Fallback}</>
  }

  if (!orgRole) return handleFallback()

  if (!allowedRoles.includes(orgRole)) {
    return handleFallback()
  }

  return <>{children}</>
}
