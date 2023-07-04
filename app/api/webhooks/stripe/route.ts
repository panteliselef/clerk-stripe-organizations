import { headers } from "next/headers"
import Stripe from "stripe"

import { env } from "@/env.mjs"
import { stripe } from "@/lib/stripe"
import { clerkClient } from "@clerk/nextjs"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }

  console.log("[STRIPE EVENT]", event.type)

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id
    const { userId, organizationId } = subscription.metadata

    // setTimeout(async () => {
    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        paidUntil: new Date(subscription.current_period_end * 1000),
      },
    })

    await clerkClient.organizations.updateOrganization(organizationId, {
      maxAllowedMemberships:
        parseInt(subscription.items.data[0].price.metadata?.max_members, 10) ||
        1,
    })

    await clerkClient.organizations.updateOrganizationMetadata(organizationId, {
      publicMetadata: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        paidUntil: new Date(subscription.current_period_end * 1000),
      },
    })
    // }, 3000)
  }

  // if (event.type === "invoice.payment_succeeded") {
  //   // Retrieve the subscription details from Stripe.
  //   const subscription = await stripe.subscriptions.retrieve(
  //     session.subscription as string
  //   )
  //
  //   // Update the price id and set the new period end.
  //   await db.user.update({
  //     where: {
  //       stripeSubscriptionId: subscription.id,
  //     },
  //     data: {
  //       stripePriceId: subscription.items.data[0].price.id,
  //       stripeCurrentPeriodEnd: new Date(
  //         subscription.current_period_end * 1000
  //       ),
  //     },
  //   })
  // }

  return new Response(null, { status: 200 })
}
