import { OrganizationMembership } from "@clerk/backend"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Circle, ExternalLink } from "lucide-react"
import * as React from "react"

export function MemberShipCard({
  organization: {
    id,
    name,
    maxAllowedMemberships,
    slug,
    createdAt,
    imageUrl,
    publicMetadata,
  },
  role,
}: OrganizationMembership) {
  return (
    <Card className={"relative"}>
      <Link href={`/${id}`} className={"absolute h-full w-full"} />
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className={"flex gap-4"}>
          <Avatar>
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{name}</CardTitle>
            <CardDescription className={"flex flex-row items-center gap-2"}>
              {slug}
              <span className={"h-3 w-[1px] shrink-0 bg-border"} />
              <span className={"flex items-center"}>
                <Icons.user className="mr-1 h-4 w-4" />
                {role}
              </span>
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
          <Button variant="outline" className={"w-fit"}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            {publicMetadata?.stripeSubscriptionId ? (
              <>
                <Circle className="mr-1 h-3 w-3 fill-white text-white" />
                Paid
              </>
            ) : (
              <>
                <Circle className="mr-1 h-3 w-3 fill-red-400 text-red-400" />
                Unpaid
              </>
            )}
          </div>
          <div className="flex items-center">
            <Icons.team className="mr-1 h-4 w-4" />
            Max: {maxAllowedMemberships || "Unlimited"}
          </div>
          <div>Created {new Date(createdAt).toLocaleDateString()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
