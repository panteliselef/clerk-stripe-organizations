"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { formatRelative } from "date-fns"

import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table"
import { OrganizationMembership } from "@clerk/backend"

export function OrganizationMembers(props: {
  membersPromise: Promise<OrganizationMembership[]>
}) {
  const members = use(props.membersPromise) as OrganizationMembership[]
  const toaster = useToast()
  const router = useRouter()

  const { orgRole } = useAuth()

  // TODO: DataTable with actions
  return (
    <Table>
      <TableHeader>
        <TableRow className="pointer-events-none bg-muted">
          <TableHead>Name</TableHead>
          <TableHead>Joined at</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="w-16"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={member.publicUserData?.imageUrl}
                  alt={member.publicUserData?.firstName || ""}
                />
                <AvatarFallback>
                  {member.publicUserData?.firstName || ""}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{member.publicUserData?.firstName || ""}</span>
                <span className="text-sm text-muted-foreground">
                  {member.publicUserData?.identifier}
                </span>
              </div>
            </TableCell>
            <TableCell>
              {formatRelative(member.createdAt, new Date())}
            </TableCell>
            <TableCell>{member.role}</TableCell>
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
