"use client"

import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function OrganizationImage(props: {
  name: string
  image: string
  orgId: string
}) {
  const [, setImgSrc] = React.useState("")
  const [cropModalOpen, setCropModalOpen] = React.useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Image</CardTitle>
        <CardDescription>
          Change your organization&apos;s avatar image
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Avatar className="h-32 w-32">
          <AvatarImage src={props.image} />
          <AvatarFallback>{props.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
      </CardContent>

      <CardFooter>
        <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
          <Input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return

              setCropModalOpen(true)

              const reader = new FileReader()
              reader.addEventListener("load", () => {
                setImgSrc(reader.result?.toString() ?? "")
              })
              reader.readAsDataURL(file)
            }}
          />
          {/*<CropImageDialog*/}
          {/*  imgSrc={imgSrc}*/}
          {/*  close={() => setCropModalOpen(false)}*/}
          {/*/>*/}
        </Dialog>
      </CardFooter>
    </Card>
  )
}
