"use client"

import * as React from "react"
import { NewOrganizationDialog } from "@/components/new-org-dialog"
import { Dialog } from "@/components/ui/dialog"
import { Button, ButtonProps } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface CreateOrgButtonProps extends ButtonProps {}

export function CreateOrgButton({ variant, ...props }: CreateOrgButtonProps) {
  const [newOrgDialogOpen, setNewOrgDialogOpen] = React.useState(false)
  return (
    <Dialog open={newOrgDialogOpen} onOpenChange={setNewOrgDialogOpen}>
      <React.Suspense
        fallback={
          <Button variant={variant} disabled={true}>
            <Icons.spinner className="mr-2 h-4 w-4  animate-spin" />
            New organization
          </Button>
        }
      >
        <Button
          variant={variant}
          onClick={() => setNewOrgDialogOpen(true)}
          {...props}
        >
          <Icons.add className="mr-2 h-4 w-4" />
          New organization
        </Button>

        {newOrgDialogOpen && (
          <NewOrganizationDialog
            closeDialog={() => setNewOrgDialogOpen(false)}
          />
        )}
      </React.Suspense>
    </Dialog>
  )
}
