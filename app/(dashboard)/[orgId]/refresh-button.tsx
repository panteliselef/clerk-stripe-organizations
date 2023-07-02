"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RefreshButton() {
  const { refresh } = useRouter()
  return (
    <Button variant={"ghost"} size={"sm"} onClick={refresh} className={"gap-2"}>
      <RefreshCw className={"h-4 w-4"} />
      Refresh
    </Button>
  )
}
