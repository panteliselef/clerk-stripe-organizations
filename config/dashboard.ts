import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      id: "posts",
      title: "Posts",
      href: "/dashboard",
      icon: "post",
    },
    {
      id: "teams",
      title: "Teams",
      href: "/dashboard/teams",
      icon: "user",
    },
    {
      id: "billing",
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
    },
    {
      id: "settings",
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
}
