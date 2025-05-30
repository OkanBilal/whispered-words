import React from "react";
import { createClient } from "@/lib/supabase/server";
import { SidebarNav } from "@/components/sidebar-nav";
import Header from "@/components/header";
import { redirect } from "next/navigation";
import { BillingClient } from "@/components/billing-client";

export default async function Billing() {
  const supabase = await createClient();

  const sidebarNavItems = [
    {
      title: "Profile",
      href: "/profile",
    },
    {
      title: "Plan",
      href: "/plan",
    },
  ];

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <main className="md:col-span-3 space-y-6">
            <BillingClient />
          </main>
        </div>
      </div>
    </>
  );
}


