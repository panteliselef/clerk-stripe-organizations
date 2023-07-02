import { CreateOrgButton } from "../org-button"

export default function CreateOrganizationPage() {
  return (
    <main
      className={
        "col-span-2 flex h-full w-full items-center justify-center space-y-6 pt-6"
      }
    >
      <CreateOrgButton />
    </main>
  )
}
