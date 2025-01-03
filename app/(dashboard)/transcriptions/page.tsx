import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function TranscriptionPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: transcriptions } = await supabase
    .from("transcriptions")
    .select("*");

  if (!session) {
    redirect("/");
  }

  return (
    <div className="space-y-6 h-screen">
      <h3 className="text-lg font-medium text-white">Transcriptions</h3>
      {transcriptions?.map((transcription) => (
        <div key={transcription.id} className="flex items-center space-x-4">
          <p className="text-white">{transcription.title}</p>
        </div>
      ))}
    </div>
  );
}
