import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import Header from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";

export default async function TranscriptionPage() {
  const supabase = await createClient();

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

  const { data: transcriptions } = await supabase
    .from("transcriptions")
    .select("*")
    .eq("user_id", session.user.id);

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <SidebarNav items={sidebarNavItems} />
          </aside>

          <main className="md:col-span-3 space-y-6">
            <h1 className="text-2xl font-bold text-white mb-6">
              Transcriptions
            </h1>

            <Card className="p-6 shadow-lg rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                My Transcriptions
              </h2>

              {transcriptions && transcriptions.length > 0 ? (
                <div className="space-y-4">
                  {transcriptions.map((transcription) => (
                    <div
                      key={transcription.id}
                      className="bg-gray-900/50 p-4 rounded-lg"
                    >
                      <p className="text-lg font-medium text-white">
                        {transcription.title}
                      </p>
                      <p className="text-sm text-gray-400">
                        {transcription.created_at
                          ? new Date(
                              transcription.created_at
                            ).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-white">
                    No transcriptions found. Create your first one!
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-6 shadow-lg rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Total Transcriptions</p>
                  <p className="text-2xl font-bold text-white">
                    {transcriptions?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Last Transcription</p>
                  <p className="text-2xl font-bold text-white">
                    {transcriptions && transcriptions.length > 0
                      ? new Date(
                          transcriptions[0].created_at
                        ).toLocaleDateString()
                      : "No transcriptions yet"}
                  </p>
                </div>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
}
