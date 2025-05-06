"use client";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function EmptyTranscriptions() {
  const router = useRouter();

  return (
    <Card className="p-8 shadow-lg rounded-lg border border-gray-700 text-center">
      <h3 className="text-xl font-semibold text-white mb-4">No Transcriptions Yet</h3>
      <p className="text-gray-400 mb-6">
        You haven&apos;t created any transcriptions yet. Upload an audio file to get started.
      </p>
      <Button
        onClick={() => router.push("/")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        leftIcon={<Plus size={16} />}
      >
        Create Your First Transcription
      </Button>
    </Card>
  );
}
