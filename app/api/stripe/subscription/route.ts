import * as z from "zod"

import { auth, clerkClient } from "@clerk/nextjs"
import { stripe } from "@/lib/stripe"
import { env } from "@/env.mjs"

export const purchaseOrgSchema = z.object({
  orgId: z.string().min(5, "Id must be at least 5 characters"),
  planId: z.string(),
})

export type PurchaseOrgSchema = z.infer<typeof purchaseOrgSchema>

export async function POST(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = purchaseOrgSchema.parse(json)
    const { orgId, planId } = body

    const { publicMetadata } = await clerkClient.users.getUser(userId)

    const client_reference_id = (publicMetadata?.stripeCustomerId ||
      userId) as string

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      client_reference_id,
      subscription_data: {
        metadata: { userId, organizationId: orgId },
      },
      success_url: `${env.NEXT_PUBLIC_APP_URL}/${orgId}`,
      line_items: [{ price: planId, quantity: 1 }],
    })

    if (!session.url) {
      return new Response(JSON.stringify({ success: false }), { status: 400 })
    }

    return new Response(
      JSON.stringify({ success: true as const, url: session.url })
    )
  } catch (error) {
    console.log(error)
    return new Response(null, { status: 500 })
  }
}
