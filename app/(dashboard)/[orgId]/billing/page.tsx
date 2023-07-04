import React from "react"
import { notFound } from "next/navigation"
import { AppOrganizationMetadata } from "@/types"
import { auth, clerkClient } from "@clerk/nextjs"
import { formatRelative } from "date-fns"
import type Stripe from "stripe"

import { stripe } from "@/lib/stripe"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"

async function InvoiceTable({ subscriptionId }: { subscriptionId: string }) {
  const invoices = await stripe.invoices.list({
    subscription: subscriptionId,
  })

  return (
    <Table>
      <TableHeader>
        <TableRow className="pointer-events-none bg-muted">
          <TableHead>Created at</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className={"w-[16em]"}>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.data.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              {formatRelative(invoice.created * 1000, new Date())}
            </TableCell>
            <TableCell>{invoice.amount_paid}</TableCell>
            <TableCell>
              <div className={"flex gap-4"}>
                <a
                  className={buttonVariants({
                    variant: "outline",
                  })}
                  target={"_blank"}
                  href={invoice.hosted_invoice_url || ""}
                  rel="noreferrer"
                >
                  Open Invoice
                </a>

                <a
                  className={buttonVariants()}
                  target={"_blank"}
                  href={invoice.invoice_pdf || ""}
                  rel="noreferrer"
                >
                  <Icons.download className={"h-5 w-5"} />
                </a>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function BillingItem(props: Stripe.SubscriptionItem) {
  const price = (props.price.unit_amount || 0) / 100

  const quantity = props.quantity || 1

  return (
    <div className="flex items-center">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">
          {(props.price.product as Stripe.Product).name}
        </p>
        <p className="text-sm text-muted-foreground">
          Price: {price} {props.price.currency}
        </p>
      </div>
      <div className="ml-auto font-medium">
        {price * quantity} {props.price.currency}
        <p className="text-sm text-muted-foreground">
          {quantity} x {price} {props.price.currency}
        </p>
      </div>
    </div>
  )
}

export default async function OrganizationSettingsPage() {
  const { orgId } = auth()
  if (!orgId) notFound()

  const org = await clerkClient.organizations.getOrganization({
    organizationId: orgId,
  })

  const { items, status } = await stripe.subscriptions.retrieve(
    (org.publicMetadata as AppOrganizationMetadata).stripeSubscriptionId,
    {
      expand: ["items.data.price.product", "latest_invoice"],
    }
  )

  // const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
  //   subscription: id,
  //   expand: ["application"],
  // })
  //
  // const upcomingInvoicePdfUrl = upcomingInvoice.invoice_pdf

  return (
    <DashboardShell>
      <DashboardHeader heading="Billing" text="Manage your billing" />
      <Card className="col-span-3 my-6">
        <CardHeader className={"flex-row justify-between space-y-0"}>
          <div className={"space-y-1.5"}>
            <CardTitle>Current billing items</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </div>
          {/*{upcomingInvoicePdfUrl && (*/}
          {/*  <a*/}
          {/*    className={buttonVariants({*/}
          {/*      variant: "default",*/}
          {/*    })}*/}
          {/*    href={upcomingInvoicePdfUrl}*/}
          {/*  >*/}
          {/*    Download Upcoming Invoice*/}
          {/*  </a>*/}
          {/*)}*/}
        </CardHeader>

        <CardContent>
          {status}
          <div className="space-y-8">
            {items.data.map((i) => (
              <BillingItem {...i} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* @ts-expect-error Server Component */}
      <InvoiceTable
        subscriptionId={
          (org.publicMetadata as AppOrganizationMetadata).stripeSubscriptionId
        }
      />
    </DashboardShell>
  )
}
