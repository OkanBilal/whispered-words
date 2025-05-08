import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET endpoint to get a download URL for a transcription file
export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the transcription record to verify ownership and get the file path
    const { data: transcription, error: fetchError } = await supabase
      .from("transcriptions")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single();

    if (fetchError || !transcription) {
      return NextResponse.json(
        { error: "Transcription not found or access denied" },
        { status: 404 }
      );
    }

    // Check if there's a transcript file path
    if (!transcription.transcript_file_path) {
      return NextResponse.json(
        { error: "No transcript file exists for this transcription" },
        { status: 404 }
      );
    }

    // Generate a new download URL (signed URL that expires after a period)
    const { data: urlData, error: urlError } = await supabase
      .storage
      .from('transcription-files')
      .createSignedUrl(transcription.transcript_file_path, 60 * 60 * 24); // URL valid for 1 day

    if (urlError) {
      console.error("Error generating download URL:", urlError);
      return NextResponse.json(
        { error: urlError.message },
        { status: 500 }
      );
    }

    // If successful, update the transcription record with the new download URL
    if (urlData?.signedUrl) {
      await supabase
        .from("transcriptions")
        .update({
          download_url: urlData.signedUrl
        })
        .eq("id", params.id);
    }

    return NextResponse.json({
      download_url: urlData?.signedUrl
    });

  } catch (error) {
    console.error("Error getting download URL:", error);
    return NextResponse.json(
      { error: "Failed to get download URL for transcription file" },
      { status: 500 }
    );
  }
}
