import { AppOrganizationMetadata } from "@/types"
import { auth, clerkClient } from "@clerk/nextjs"
import { SECRET_KEY } from "@clerk/nextjs/server"
import Stripe from "stripe"

import { stripe } from "@/lib/stripe"
import { InviteOrgMember, inviteOrgMemberSchema } from "@/lib/validations"

function mapSubscriptionItems(
  items: Stripe.SubscriptionItem[]
): Stripe.SubscriptionUpdateParams.Item[] {
  return items.map((item) => ({
    id: item.id,
    price: item.price.id,
    quantity: item.quantity,
  }))
}

const getOrCreatePerSeatPlan = (
  items: Stripe.SubscriptionUpdateParams.Item[],
  opts: Pick<InviteOrgMember, "planId" | "units">
) => {
  const { planId, units } = opts
  const perSeat = items.find((d) => d.price === planId)

  if (!perSeat) {
    return {
      price: planId,
      quantity: units,
    }
  }

  return {
    ...perSeat,
    quantity: (perSeat?.quantity || 1) + units,
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = inviteOrgMemberSchema.parse(json)
    const { orgId, units, planId, role, email } = body

    // Build headers
    const headers = {
      Authorization: `Bearer ${SECRET_KEY}`,
      "Content-Type": "application/json",
      "Clerk-Backend-SDK": "@clerk/backend",
    }

    const memberships = await fetch(
      `https://api.clerk.com/v1/organizations/${orgId}/memberships`,
      {
        method: "GET",
        headers,
      }
    ).then((res) => res.json())

    const organization = await clerkClient.organizations.getOrganization({
      organizationId: orgId,
    })

    // TODO: Clerk supports maxAllowed - 1
    if (memberships.total_count + 1 < organization.maxAllowedMemberships) {
      await clerkClient.organizations.createOrganizationInvitation({
        organizationId: orgId,
        role: role,
        emailAddress: email,
        inviterUserId: userId,
      })

      return new Response(
        JSON.stringify({
          success: true as const,
        })
      )
    }

    const organizationMetadata =
      organization.publicMetadata as AppOrganizationMetadata

    // const { publicMetadata } = await clerkClient.users.getUser(userId)

    // const client_reference_id = (publicMetadata?.stripeCustomerId ||
    //   userId) as string

    const subscription = await stripe.subscriptions.retrieve(
      organizationMetadata.stripeSubscriptionId
    )

    const perSeat = getOrCreatePerSeatPlan(
      mapSubscriptionItems(subscription.items.data),
      {
        planId,
        units,
      }
    )

    const restItems = mapSubscriptionItems(subscription.items.data).filter(
      (d) => d.price !== planId
    )

    const updatedSubscription = await stripe.subscriptions.update(
      organizationMetadata.stripeSubscriptionId,
      {
        description: "hehe",
        items: [...restItems, { ...perSeat }],
      }
    )

    await clerkClient.organizations.updateOrganization(orgId, {
      maxAllowedMemberships: organization.maxAllowedMemberships + units,
    })

    await clerkClient.organizations.createOrganizationInvitation({
      organizationId: orgId,
      role: role,
      emailAddress: email,
      inviterUserId: userId,
    })

    return new Response(
      JSON.stringify({
        success: true as const,
        subscription: updatedSubscription,
      })
    )
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}
