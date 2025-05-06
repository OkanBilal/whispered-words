"use client";

import { useState } from "react";
import { useGetTranscriptionsQuery, useDeleteTranscriptionMutation } from "@/lib/transcriptionsApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import EmptyTranscriptions from "./empty-transcriptions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function TranscriptionsList() {
  const { data: transcriptions, isLoading, error, refetch } = useGetTranscriptionsQuery();
  const [deleteTranscription, { isLoading: isDeleting }] = useDeleteTranscriptionMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transcriptionToDelete, setTranscriptionToDelete] = useState<string | null>(null);

  const openDeleteDialog = (id: string) => {
    setTranscriptionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!transcriptionToDelete) return;
    
    try {
      setDeletingId(transcriptionToDelete);
      console.log("Deleting transcription with ID:", transcriptionToDelete);
      const response = await deleteTranscription(transcriptionToDelete).unwrap();
      console.log("Delete response:", response);
      // Show success toast
      toast.success("Transcription deleted successfully");
      // RTK Query will automatically invalidate the cache and refetch
    } catch (error) {
      console.error("Failed to delete transcription:", error);
      // Show error toast
      toast.error("Failed to delete transcription. Please try again.");
    } finally {
      setDeletingId(null);
      setIsDeleteDialogOpen(false);
      setTranscriptionToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6 shadow-lg rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            My Transcriptions
          </h2>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <p className="text-white">Loading transcriptions...</p>
          </div>
        </Card>

        <Card className="p-6 shadow-lg rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Total Transcriptions</p>
              <p className="text-2xl font-bold text-white">...</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Last Transcription</p>
              <p className="text-2xl font-bold text-white">...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 shadow-lg rounded-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">
          My Transcriptions
        </h2>
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <p className="text-white">Error loading transcriptions. Please try again later.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-lg rounded-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">
          My Transcriptions
        </h2>

        {transcriptions && transcriptions.length > 0 ? (
          <div className="space-y-4">
            {transcriptions.map((transcription) => (
              <div
                key={transcription.id}
                className="bg-gray-900/50 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <Link href={`/transcriptions/${transcription.id}`}>
                    <p className="text-lg font-medium text-white hover:text-blue-400 cursor-pointer">
                      {transcription.title}
                    </p>
                  </Link>
                  <p className="text-sm text-gray-400">
                    {transcription.created_at
                      ? new Date(
                          transcription.created_at
                        ).toLocaleDateString()
                      : ""}
                  </p>
                </div>
                <Button
                  onClick={() => openDeleteDialog(transcription.id)}
                  disabled={isDeleting && deletingId === transcription.id}
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm"
                  leftIcon={<Trash2 size={16} />}
                >
                  {isDeleting && deletingId === transcription.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyTranscriptions />
        )}
      </Card>

      <Card className="p-6 shadow-lg rounded-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">
          Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Total Transcriptions</p>
            <p className="text-2xl font-bold text-white">
              {transcriptions?.length || 0}
            </p>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Last Transcription</p>
            <p className="text-2xl font-bold text-white">
              {transcriptions && transcriptions.length > 0
                ? new Date(
                    transcriptions[0].created_at
                  ).toLocaleDateString()
                : "No transcriptions yet"}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this transcription? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex space-x-2">
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
