"use client"

import { useAuth, useOrganization } from "@clerk/nextjs"
import { formatRelative } from "date-fns"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table"

export function OrganizationInvitedMembers() {
  const { invitationList, organization } = useOrganization({
    invitationList: {},
  })
  const { orgRole } = useAuth()

  console.log(invitationList, organization)

  if (!invitationList) return null

  // TODO: DataTable with actions
  return (
    <Table>
      <TableHeader>
        <TableRow className="pointer-events-none bg-muted">
          <TableHead>Email</TableHead>
          <TableHead>Joined at</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="w-16"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitationList.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell>{invitation.emailAddress}</TableCell>
            <TableCell>
              {formatRelative(invitation.createdAt, new Date())}
            </TableCell>
            <TableCell>{invitation.role}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <Icons.ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    disabled={orgRole !== "admin"}
                    onClick={async () => {
                      // try {
                      //   const res = await api.organization.deleteMember.mutate({
                      //     userId: member.id,
                      //   })
                      //   router.refresh()
                      //   toaster.toast({
                      //     title: `Deleted ${res.memberName} from the organization`,
                      //   })
                      // } catch {
                      //   toaster.toast({
                      //     title: "Failed to delete member",
                      //     variant: "destructive",
                      //   })
                      // }
                    }}
                    className="text-destructive"
                  >
                    Delete member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
