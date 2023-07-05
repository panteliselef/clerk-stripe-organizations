import { auth } from "@clerk/nextjs"

import { stripe } from "@/lib/stripe"

export async function GET() {
  try {
    const { userId } = auth()

    if (!userId) {
      return new Response("Unauthorized", { status: 403 })
    }

    const prices = await stripe.prices.list()

    const products = prices.data
      // @ts-ignore
      .sort((a, b) => a.unit_amount - b.unit_amount)
      .map((p) => p.product as string)

    const allProducts = await Promise.all(
      products.map((p) => stripe.products.retrieve(p))
    )

    for (let i = 0; i < products.length; i++) {
      prices.data[i].product = allProducts[i]
    }

    return new Response(JSON.stringify(prices.data))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}
