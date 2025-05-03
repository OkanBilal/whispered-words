import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { SidebarNav } from "@/components/sidebar-nav";
import Header from "@/components/header";

const inter = Mulish({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Whispered Words",
  description:
    "A web application, an automatic speech recognition (ASR) system, for efficient and accurate voice transcription.",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Transcriptions",
    href: "/transcriptions",
  },
  {
    title: "Pro✨",
    href: "/pro",
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div
      className={`"absolute inset-0 h-full  w-full bg-black bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px] " ${inter.className} `}
    >
      <div className="space-y-6 p-16 pb-16">
        <div className="space-y-0.5">
          <Header />
          <h2 className="text-2xl font-medium text-white tracking-tight mb-12">
            Dashboard
          </h2>
        </div>
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
          <Toaster richColors />
        </div>
      </div>
    </div>
  );
}
