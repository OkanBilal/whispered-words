import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST endpoint to store a transcription file in Supabase Storage
export async function POST(
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

    // Get the transcription record to verify ownership
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

    // Parse the request body
    const { content, format } = await request.json();
    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Determine file extension based on format
    const fileExtension = format === 'json' ? 'json' : 'txt';
    const fileName = `${transcription.title.replace(/\s+/g, '_')}_${params.id}.${fileExtension}`;
    const filePath = `transcriptions/${session.user.id}/${fileName}`;
    
    // Convert content to a blob
    const contentBlob = new Blob([content], { 
      type: format === 'json' ? 'application/json' : 'text/plain' 
    });
    
    // Array buffer from blob
    const arrayBuffer = await contentBlob.arrayBuffer();
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('transcription-files')
      .upload(filePath, arrayBuffer, {
        contentType: format === 'json' ? 'application/json' : 'text/plain',
        upsert: true
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    // Generate a download URL (signed URL that expires after a period)
    const { data: urlData } = await supabase
      .storage
      .from('transcription-files')
      .createSignedUrl(filePath, 60 * 60 * 24 * 7); // URL valid for 7 days

    // Update the transcription record with the file path and download URL
    const { error: updateError } = await supabase
      .from("transcriptions")
      .update({
        transcript_file_path: filePath,
        download_url: urlData?.signedUrl
      })
      .eq("id", params.id);

    if (updateError) {
      console.error("Error updating transcription:", updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      file_path: filePath,
      download_url: urlData?.signedUrl
    });

  } catch (error) {
    console.error("Error storing transcription file:", error);
    return NextResponse.json(
      { error: "Failed to store transcription file" },
      { status: 500 }
    );
  }
}
