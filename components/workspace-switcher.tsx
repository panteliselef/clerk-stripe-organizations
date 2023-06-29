"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  useOrganization,
  useOrganizationList,
  useOrganizations,
  useUser,
} from "@clerk/nextjs"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import {
  purchaseOrgSchema,
  PurchaseOrgSchema,
} from "@/app/api/stripe/subscription/route"
import * as z from "zod"
import { useState } from "react"

export function WorkspaceSwitcher() {
  const router = useRouter()

  const [switcherOpen, setSwitcherOpen] = React.useState(false)
  const [newOrgDialogOpen, setNewOrgDialogOpen] = React.useState(false)

  const orgs = useOrganizationList()
  const org = useOrganization()

  console.log("nice", org)

  const { user, isSignedIn, isLoaded } = useUser()
  if (isLoaded && !isSignedIn) throw new Error("How did you get here???")

  const activeOrg = org.organization ?? user
  if (!orgs.isLoaded || !org.isLoaded || !activeOrg) {
    // Skeleton loader
    return (
      <Button
        variant="ghost"
        size="sm"
        role="combobox"
        aria-expanded={switcherOpen}
        aria-label="Select a workspace"
        className="w-52 justify-between opacity-50"
      >
        <Avatar className="mr-2 h-5 w-5">
          <AvatarFallback>Ac</AvatarFallback>
        </Avatar>
        Select a workspace
        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0" />
      </Button>
    )
  }

  const normalizedObject = {
    id: activeOrg.id,
    name: "name" in activeOrg ? activeOrg.name : activeOrg.fullName,
    image: activeOrg.imageUrl,
  }

  return (
    <Dialog open={newOrgDialogOpen} onOpenChange={setNewOrgDialogOpen}>
      <Popover open={switcherOpen} onOpenChange={setSwitcherOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            role="combobox"
            aria-expanded={switcherOpen}
            aria-label="Select a workspace"
            className="w-52 justify-between"
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage src={normalizedObject?.image ?? ""} />
              <AvatarFallback>
                {normalizedObject.name?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            {normalizedObject.name}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search workspace..." />
              <CommandGroup heading="Personal account">
                <CommandItem
                  onSelect={async () => {
                    if (!user?.id) return
                    normalizedObject.id = user.id ?? ""

                    await orgs.setActive?.({ organization: null })
                    setSwitcherOpen(false)
                    // router.push(`/${user.id}`)
                  }}
                  className="cursor-pointer text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={user?.imageUrl}
                      alt={user?.fullName ?? ""}
                    />
                    <AvatarFallback>
                      {`${user?.firstName?.[0]}${user?.lastName?.[0]}` ?? "JD"}
                    </AvatarFallback>
                  </Avatar>
                  {user?.fullName}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      org.organization === null ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Organizations">
                {orgs.organizationList?.map(({ organization: org }) => (
                  <CommandItem
                    key={org.name}
                    onSelect={async () => {
                      await orgs.setActive({ organization: org })
                      setSwitcherOpen(false)
                      router.push(`/dashboard/${org.id}`)
                    }}
                    className="cursor-pointer text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={org.imageUrl ?? "/images/placeholder.png"}
                        alt={org.name}
                      />
                      <AvatarFallback>
                        {org.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {org.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        normalizedObject?.id === org.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setSwitcherOpen(false)
                      setNewOrgDialogOpen(true)
                    }}
                    className="cursor-pointer"
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Organization
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <React.Suspense>
        <NewOrganizationDialog closeDialog={() => setNewOrgDialogOpen(false)} />
      </React.Suspense>
    </Dialog>
  )
}

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

function NewOrganizationDialog(props: { closeDialog: () => void }) {
  const plans = React.use(fetchPlans)
  const form = useForm()
  const { createOrganization, isLoaded } = useOrganizations()
  const [isCreatingOrg, setCreatingOrg] = useState(false)
  const [isCreatingStripeSession, setCreatingStripeSession] = useState(false)

  const toaster = useToast()

  async function handleCreateOrg(data: FormOrgSchema) {
    if (!isLoaded) return

    setCreatingOrg(true)
    const org = await createOrganization({
      name: data.orgName,
    })

    setCreatingStripeSession(true)

    const response = await createOrg({
      planId: data.planId,
      orgId: org.id,
    })

    console.log("response ")

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
