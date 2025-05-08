import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: transcriptions, error } = await supabase
      .from("transcriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(transcriptions);
  } catch (error) {
    console.error("Error fetching transcriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      const { 
        title, 
        user_id, 
        content, 
        source_language, 
        duration, 
        format, 
        model, 
        file_name, 
        transcript_file_path,
        file_size,
        audio_file_path,
        download_url
      } = await request.json();
      
      console.log("POST transcriptions request data:", { 
        title, 
        user_id, 
        hasContent: !!content,
        format,
        source_language
      });
      
      // Validate if the user_id matches the session user id
      if (user_id !== session.user.id) {
        return NextResponse.json(
          { error: "Unauthorized - User ID mismatch" },
          { status: 403 }
        );
      }

    // Insert the transcription record
    const { data, error } = await supabase
      .from("transcriptions")
      .insert([
        {
          title,
          user_id: session.user.id,
          content,
          source_language,
          duration,
          format,
          model,
          transcript_file_path,  
          file_name,
          file_size,
          audio_file_path,
          download_url,
        },
      ])
      .select();

    if (error) {
      console.error("Database error when inserting transcription:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
    } catch (jsonError) {
      console.error("Error parsing request JSON:", jsonError);
      return NextResponse.json(
        { error: "Invalid request format", details: (jsonError as Error).message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error saving transcription:", error);
    return NextResponse.json(
      { error: "Failed to save transcription", details: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
