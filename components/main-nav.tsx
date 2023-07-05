"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs"

import { MainNavItem } from "types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { MobileNav } from "@/components/mobile-nav"
import { WorkspaceSwitcher } from "@/components/workspace-switcher"

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function MainNav({ items, children }: MainNavProps) {
  const { organization } = useOrganization()
  console.log("-----ORG", organization?.id, organization?.name)
  const segment = useSelectedLayoutSegment()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  console.log("rendered", `/${organization?.id}/clerk`)

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                item.href.startsWith(`/${segment}`)
                  ? "text-foreground"
                  : "text-foreground/60",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <Icons.close /> : <Icons.logo />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && items && (
        <MobileNav items={items}>{children}</MobileNav>
      )}
      <WorkspaceSwitcher hidePersonal={true} />
      <OrganizationSwitcher
        // TODO: THIS SOLVE AN ULTRA WEIRD BUG
        key={organization?.id}
        // TODO: WHY DO WE NEED BOTH ?
        createOrganizationUrl="/create-organization"
        createOrganizationMode="navigation"
        // TODO: WHY DO WE NEED BOTH ?
        organizationProfileUrl={`/${organization?.id}/clerk`}
        organizationProfileMode="navigation"
        // -----------
        hidePersonal={true}
        afterLeaveOrganizationUrl="/"
        // afterCreateOrganizationUrl?: string;
        //
        // afterLeaveOrganizationUrl?: string;
        //
        // organizationProfileMode?: 'modal' | 'navigation';
        //
        // organizationProfileUrl?: string;
        // TODO: Can we make `afterCreateOrganizationUrl` to be (org:OrganizationResource) => `/${org.id}`. This might be solvable take another look
        // afterCreateOrganizationUrl={}
      />
    </div>
  )
}
