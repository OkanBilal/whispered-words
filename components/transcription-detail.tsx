"use client";

import { useGetTranscriptionByIdQuery } from "@/lib/redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";

interface TranscriptionDetailProps {
  id: string;
}

export default function TranscriptionDetail({ id }: TranscriptionDetailProps) {
  const router = useRouter();
  const { data: transcription, isLoading, error } = useGetTranscriptionByIdQuery(id);

  const handleDownload = () => {
    if (!transcription?.content) return;
    
    // Create file content
    const content = transcription.content;
    
    // Determine file extension based on the format
    let fileExtension = 'txt';
    let mimeType = 'text/plain';
    
    if (transcription.format) {
      switch (transcription.format) {
        case 'json':
        case 'verbose_json':
          fileExtension = 'json';
          mimeType = 'application/json';
          break;
        case 'srt':
          fileExtension = 'srt';
          mimeType = 'application/x-subrip';
          break;
        case 'vtt':
          fileExtension = 'vtt';
          mimeType = 'text/vtt';
          break;
        case 'text':
        default:
          fileExtension = 'txt';
          mimeType = 'text/plain';
          break;
      }
    }
    
    const filename = `${transcription.title.replace(/\s+/g, '_')}_transcription.${fileExtension}`;
    
    // Create a blob with the content
    const blob = new Blob([content], { type: mimeType });
    
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Append link to the body, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up by revoking the URL
    URL.revokeObjectURL(url);
  };

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
          <p className="text-white">Error loading transcription. It may have been deleted or you don&apos;t have permission to view it.</p>
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
          <Button 
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md"
            leftIcon={<Download size={16} />}
          >
            Download {transcription.format ? 
              (transcription.format.toUpperCase() === 'VERBOSE_JSON' ? 'JSON' : transcription.format.toUpperCase()) 
              : 'Transcription'}
          </Button>
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
