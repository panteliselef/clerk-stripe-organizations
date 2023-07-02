"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs"
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
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { NewOrganizationDialog } from "@/components/new-org-dialog"

export function WorkspaceSwitcher({
  hidePersonal = false,
}: {
  hidePersonal?: boolean
}) {
  const router = useRouter()

  const [switcherOpen, setSwitcherOpen] = React.useState(false)
  const [newOrgDialogOpen, setNewOrgDialogOpen] = React.useState(false)

  const orgs = useOrganizationList()
  const org = useOrganization()

  const { user, isSignedIn, isLoaded } = useUser()
  if (isLoaded && !isSignedIn) throw new Error("How did you get here???")

  const activeOrg = org.organization

  const normalizedObject = activeOrg
    ? {
        id: activeOrg?.id,
        name: activeOrg?.name,
        image: activeOrg?.imageUrl,
      }
    : undefined

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
            {normalizedObject ? (
              <>
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarImage src={normalizedObject?.image ?? ""} />
                  <AvatarFallback>
                    {normalizedObject.name?.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {normalizedObject.name}
              </>
            ) : (
              <>
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarFallback>Ac</AvatarFallback>
                </Avatar>
                Select a workspace
              </>
            )}

            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search workspace..." />
              {!hidePersonal && (
                <CommandGroup heading="Personal account">
                  <CommandItem
                    onSelect={async () => {
                      if (!user?.id) return
                      await orgs.setActive?.({ organization: null })
                      setSwitcherOpen(false)
                      router.push(`/${user.id}`)
                    }}
                    className="cursor-pointer text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={user?.imageUrl}
                        alt={user?.fullName ?? ""}
                      />
                      <AvatarFallback>
                        {`${user?.firstName?.[0]}${user?.lastName?.[0]}` ??
                          "JD"}
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
              )}

              <CommandGroup heading="Organizations">
                {orgs.organizationList?.map(({ organization: org }) => (
                  <CommandItem
                    key={org.name}
                    onSelect={async () => {
                      // await orgs.setActive({ organization: org })
                      setSwitcherOpen(false)
                      router.push(`/${org.id}`)
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
        {newOrgDialogOpen && (
          <NewOrganizationDialog
            closeDialog={() => setNewOrgDialogOpen(false)}
          />
        )}
      </React.Suspense>
    </Dialog>
  )
}
