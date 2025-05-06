import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    const { data: transcription, error } = await supabase
      .from("transcriptions")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(transcription);
  } catch (error) {
    console.error("Error fetching transcription:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcription" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    console.log("DELETE request for transcription ID:", id);

    // First, check if the transcription exists and belongs to the user
    const { data: transcription, error: fetchError } = await supabase
      .from("transcriptions")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (fetchError || !transcription) {
      console.error("Transcription not found or access denied:", fetchError);
      return NextResponse.json(
        { error: "Transcription not found or not authorized", details: fetchError },
        { status: 404 }
      );
    }

    console.log("Found transcription, proceeding with deletion:", transcription);

    // If the transcription exists and belongs to the user, delete it
    const { error } = await supabase
      .from("transcriptions")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error deleting transcription:", error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    console.log("Transcription deleted successfully:", id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Exception when deleting transcription:", error);
    return NextResponse.json(
      { error: "Failed to delete transcription", details: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
