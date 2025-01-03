import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";

export default async function Profile() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: transcriptions } = await supabase
    .from("transcriptions")
    .select("*, profiles(*)");

  if (!session) {
    redirect("/");
  }

  return (
    <div className="text-white">
      {JSON.stringify(transcriptions, null, 2)}
      <ProfileForm />
    </div>
  );
}
