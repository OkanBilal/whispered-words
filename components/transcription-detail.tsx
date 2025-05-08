"use client";

import { useGetTranscriptionByIdQuery } from "@/lib/transcriptionsApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import DownloadTranscriptionButton from "./download-transcription-button";

interface TranscriptionDetailProps {
  id: string;
}

export default function TranscriptionDetail({ id }: TranscriptionDetailProps) {
  const router = useRouter();
  const { data: transcription, isLoading, error } = useGetTranscriptionByIdQuery(id);

  if (isLoading) {
    return (
      <Card className="p-6 shadow-lg rounded-lg border border-gray-700">
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <p className="text-white">Loading transcription...</p>
        </div>
      </Card>
    );
  }

  if (error || !transcription) {
    return (
      <Card className="p-6 shadow-lg rounded-lg border border-gray-700">
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <p className="text-white">Error loading transcription. It may have been deleted or you don't have permission to view it.</p>
          <Button 
            onClick={() => router.back()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md"
            leftIcon={<ArrowLeft size={16} />}
          >
            Go Back
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6 justify-between">
        <Button 
          onClick={() => router.back()}
          className="bg-transparent hover:bg-gray-800 text-gray-300 px-2 py-1 rounded-md"
          leftIcon={<ArrowLeft size={16} />}
        >
          Back to Transcriptions
        </Button>
        
        {transcription.content && (
          <DownloadTranscriptionButton
            transcriptionId={transcription.id}
            content={transcription.content}
            format={transcription.format || 'txt'}
            hasExistingFile={!!transcription.transcript_file_path}
          />
        )}
      </div>

      <Card className="p-6 shadow-lg rounded-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-2">
          {transcription.title}
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Created {transcription.created_at ? new Date(transcription.created_at).toLocaleString() : ""}
        </p>

        <div className="bg-gray-900/50 p-4 rounded-lg">
          {transcription.content ? (
            <pre className="text-white whitespace-pre-wrap font-sans">
              {transcription.content}
            </pre>
          ) : (
            <p className="text-gray-400">This transcription has no content.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
