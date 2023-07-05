"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useOrganizationList, useOrganizations } from "@clerk/nextjs"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { PurchaseOrgSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const fetchPlans = fetch("/api/stripe/plans").then((res) => res.json())

export const formOrgSchema = z.object({
  orgName: z.string().min(5, "Name must be at least 5 characters"),
  planId: z.string(),
})

export type FormOrgSchema = z.infer<typeof formOrgSchema>

const createOrg = (org: PurchaseOrgSchema) =>
  fetch("/api/stripe/subscription", {
    method: "POST",
    body: JSON.stringify(org),
  }).then((res) => res.json())

export function NewOrganizationDialog(props: { closeDialog: () => void }) {
  // @ts-ignore
  const plans = React.use(fetchPlans)
  const form = useForm()
  const { createOrganization, isLoaded } = useOrganizations()
  const { setActive } = useOrganizationList()
  const [isCreatingOrg, setCreatingOrg] = useState(false)
  const [isCreatingStripeSession, setCreatingStripeSession] = useState(false)

  const toaster = useToast()

  async function handleCreateOrg(data: FormOrgSchema) {
    if (!isLoaded || !setActive) return

    setCreatingOrg(true)
    const org = await createOrganization({
      name: data.orgName,
    })

    await setActive({
      organization: org,
    })

    setCreatingStripeSession(true)

    const response = await createOrg({
      planId: data.planId,
      orgId: org.id,
    })

    if (response.success) window.location.href = response.url
    else
      toaster.toast({
        title: "Error",
        description:
          "There was an error setting up your organization. Please try again.",
        variant: "destructive",
      })
  }

  return (
    <DialogContent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateOrg)}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Create organization</DialogTitle>
            <DialogDescription>
              Add a new organization to manage products and customers.
            </DialogDescription>
          </DialogHeader>

          <FormField
            control={form.control}
            name="orgName"
            rules={{
              required: "Organization name is required",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Acme Inc." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="planId"
            rules={{
              required: "Plan is required",
            }}
            render={({ field }) => (
              <>
                <div className="flex justify-between">
                  <FormLabel>Subscription plan *</FormLabel>
                  <Link
                    href="/pricing"
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    What&apos;s included in each plan?
                  </Link>
                </div>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        <span className="font-medium">{plan.product.name}</span>{" "}
                        -{" "}
                        <span className="text-muted-foreground">
                          ${plan.unit_amount / 100} per month
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          />

          <DialogFooter className={"items-center"}>
            <p className={"text-sm text-gray-600"}>
              {isCreatingStripeSession
                ? "Redirecting you to checkout"
                : isCreatingOrg
                ? "Creating organization ..."
                : ""}
            </p>
            <Button
              disabled={isCreatingOrg || isCreatingStripeSession}
              variant="outline"
              onClick={() => props.closeDialog()}
            >
              Cancel
            </Button>
            <Button
              disabled={isCreatingOrg || isCreatingStripeSession}
              type="submit"
            >
              Continue
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
