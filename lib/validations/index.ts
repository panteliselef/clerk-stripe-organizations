import { z } from "zod"

export const MEMBERSHIP = {
  Member: "basic_member",
  Admin: "admin",
} as const

export const inviteOrgMemberSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(MEMBERSHIP),
  orgId: z.string().min(5, "Id must be at least 5 characters"),
  planId: z.string(),
  units: z.number().min(0),
})

export type InviteOrgMember = z.infer<typeof inviteOrgMemberSchema>
