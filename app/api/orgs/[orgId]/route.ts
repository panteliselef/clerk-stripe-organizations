import { z } from "zod"

import { auth, clerkClient } from "@clerk/nextjs"

const routeContextSchema = z.object({
  params: z.object({
    orgId: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route context.
    const { params } = routeContextSchema.parse(context)

    // Ensure user is authentication and has access to this user.
    const { userId } = auth()
    if (!userId || !params.orgId) {
      return new Response(null, { status: 403 })
    }

    const rawMembers =
      await clerkClient.organizations.getOrganizationMembershipList({
        organizationId: params.orgId,
      })

    // const members = rawMembers.map((member) => ({
    //   id: member.id,
    //   email: member.publicUserData?.identifier ?? "",
    //   role: member.role,
    //   joinedAt: member.createdAt,
    //   avatarUrl: member.publicUserData?.imageUrl,
    //   name: [
    //     member.publicUserData?.firstName,
    //     member.publicUserData?.lastName,
    //   ].join(" "),
    // }))
    return new Response(JSON.stringify(rawMembers), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
