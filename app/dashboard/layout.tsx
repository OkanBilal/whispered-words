import { Metadata } from "next"
import { SidebarNav } from "@/components/sidebar-nav"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin dashboard.",
}

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/dashboard",
  },
  {
    title: "Transcriptions",
    href: "/dashboard/transcriptions",
  },
  {
    title: "Pro✨",
    href: "/dashboard/pro",
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-black h-screen">
      <div className="hidden space-y-6 p-16
       pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-12">Dashboard</h2>

        </div>
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </div>
  )
}
