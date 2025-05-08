import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";
import TranscriptionDetail from "@/components/transcription-detail";

interface TranscriptionDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TranscriptionDetailPage({
  params,
}: TranscriptionDetailPageProps) {
  const supabase = await createClient();
  const { id } = params;

  const sidebarNavItems = [
    {
      title: "Transcriptions",
      href: "/transcriptions",
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
            <TranscriptionDetail id={id} />
          </main>
        </div>
      </div>
    </>
  );
}
