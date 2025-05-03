import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { AvatarUpload } from "@/components/avatar-upload";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function Profile() {
  const supabase = await createClient();

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
    <div className="space-y-8">
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Card className=" ">
            <div className="flex flex-col items-center mb-6">
              <AvatarUpload userId={session.user.id} />
            </div>
            <ProfileForm initialData={profile} userId={session.user.id} />
          </Card>
        </div>
        
        <div>
          <Card className="">
            <h2 className="text-xl font-semibold text-white mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className=" ">
                <p className="text-sm text-gray-400">Total Transcriptions</p>
                <p className="text-2xl font-bold text-white">{transcriptions?.length || 0}</p>
              </div>
              <div className="">
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="text-2xl font-bold text-white">
                  {profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString() 
                    : new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
