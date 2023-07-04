"use client"

import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
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
import { Button } from "@/components/ui/button"
import { InviteOrgMember, MEMBERSHIP } from "@/lib/validations"
import { useOrganization } from "@clerk/nextjs"

export const InviteMemberForm = () => {
  const toaster = useToast()

  const { organization } = useOrganization()
  const form = useForm()

  // TODO:
  //  create stripe session for "per-member"
  //  attach orgId as metadata
  //  listen in webhooks
  //  if this successfully resolves update the org's max allowed numbers by the number of unit for each invitation

  // IS there an afterOrganizationDeletedUrl ?

  async function onSubmit(data: InviteOrgMember) {
    try {
      const updatedSubscription = await fetch("/api/stripe/members", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          planId: "price_1NQ1JKCxmbhrzbGQnJsWqnRy",
          orgId: organization?.id,
          units: 1,
        }),
      }).then((res) => res.json())

      console.log("updatedSubscription", updatedSubscription)

      toaster.toast({
        title: "Member invited",
        description: `An invitation to ${data.email} has been sent.`,
      })
    } catch (error) {
      toaster.toast({
        title: "Invitation failed",
        variant: "destructive",
        description: `An issue occurred while inviting ${data.email}. Make sure they have an account, and try again.`,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. john@doe.com" />
              </FormControl>
              <FormDescription>
                The email address of the person you want to invite. They must
                have an account on this app.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(MEMBERSHIP).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Invite</Button>
      </form>
    </Form>
  )
}
