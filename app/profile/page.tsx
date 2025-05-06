import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { AvatarUpload } from "@/components/avatar-upload";
import { Card } from "@/components/ui/card";
import Header from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";

export default async function Profile() {
  const supabase = await createClient();

  const sidebarNavItems = [
    {
      title: "Profile",
      href: "/profile",
    },
    {
      title: "Billing",
      href: "/billing",
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <SidebarNav items={sidebarNavItems} />
          </aside>

          <main className="md:col-span-3 space-y-6">
            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

            <Card className="p-6 shadow-lg rounded-lg border border-gray-700">
              <div className="flex flex-col mb-6">
                <AvatarUpload 
                  userId={session.user.name} 
                  url={profile?.avatar_url ? profile.avatar_url.replace(/^"|"$/g, '') : undefined} 
                />
              </div>
              <div className="w-full max-w-xl">
                <ProfileForm 
                  initialData={profile} 
                  userId={session.user.id} 
                  userEmail={session.user.email}
                  userName={profile?.name ? profile.name.replace(/^"|"$/g, '') : ''}
                />
              </div>
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
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="text-2xl font-bold text-white">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : new Date().toLocaleDateString()}
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
