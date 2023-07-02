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

const MEMBERSHIP = {
  Member: "basic_member",
  Admin: "admin",
} as const

export const InviteMemberForm = () => {
  const toaster = useToast()

  const form = useForm()

  // async function onSubmit(data: InviteOrgMember) {
  //   try {
  //     // const member = await api.organization.inviteMember.mutate(data)
  //     toaster.toast({
  //       title: "Member invited",
  //       description: `An invitation to ${member.name} has been sent.`,
  //     })
  //   } catch (error) {
  //     toaster.toast({
  //       title: "Invitation failed",
  //       variant: "destructive",
  //       description: `An issue occured while inviting ${data.email}. Make sure they have an account, and try again.`,
  //     })
  //   }
  // }

  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="john@doe.com" />
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
                    <SelectValue placeholder="Select a plan" />
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

        <Button type="submit">Create Project</Button>
      </form>
    </Form>
  )
}
