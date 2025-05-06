"use client";

import { useState } from "react";
import ShootingStarButton from "./ui/shooting-star-button";
import SelectLangugage from "./select-language";
import SelectFormat from "./select-format";
import { supported_languages } from "@/data/supported-languages";
import { response_format } from "../data/response-format";
import { Row } from "./ui/row";
import { toast } from "sonner";
import * as mm from "music-metadata-browser";
import { createClient } from "@/lib/supabase/client";
import { Textarea } from "./ui/text-area";
import { Label } from "./ui/label";
import { useUploadTranscriptionMutation, useSaveTranscriptionMutation } from "@/lib/transcriptionsApi";
import { Loader } from "./icons";


interface DownloadFileParams {
  content: string;
  fileName: string;
  mimeType: string;
}

// Constants
const MAX_AUDIO_DURATION_SECONDS = 900; // 15 minutes
const DEFAULT_MODEL = "whisper-1";

function Upload() {
  // State management
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [language, setLanguage] = useState(supported_languages[52].iso);
  const [format, setFormat] = useState(response_format[4]);
  const [duration, setDuration] = useState<number | null>(null);
  const [prompt, setPrompt] = useState<string>("");

  // RTK Query mutations
  const [uploadTranscription, { isLoading: isUploading }] = useUploadTranscriptionMutation();
  const [saveTranscription, { isLoading: isSaving }] = useSaveTranscriptionMutation();

  const supabase = createClient();

  async function getAudioDuration(file: File): Promise<number | null> {
    try {
      const metadata = await mm.parseBlob(file);
      return metadata.format.duration || null;
    } catch (error) {
      console.error("Error parsing metadata:", error);
      return null;
    }
  }

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
  };

  const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(event.target.value);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const duration = await getAudioDuration(selectedFile);
      setDuration(duration);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!file) {
      toast.error("Please select a file first!");
      return;
    }
    
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to upload transcriptions.");
        return;
      }
      
      // Prepare the transcription request
      const transcriptionRequest = {
        file,
        language,
        format,
        prompt: prompt || undefined,
        model: DEFAULT_MODEL
      };
      
      // Upload the audio file for transcription using RTK Query
      const result = await uploadTranscription(transcriptionRequest).unwrap();
      
      // Extract the transcription from the response (handle different response formats)
      const transcriptionContent = result.text || result.transcription || JSON.stringify(result);
      const title = String(file.name);
      
      console.log("Transcription response:", transcriptionContent);
      console.log("User ID:", user.id);
      console.log("Title:", title);
      
      // Store the transcription content in the state for the user to view/download
      setResponse(transcriptionContent);
      
      // Save the transcription metadata to the database using RTK Query
      try {
        await saveTranscription({
          title,
          user_id: user.id,
          // Don't include content as it's not in the database schema
        });
        toast.success("Transcription saved successfully!");
      } catch (saveError) {
        console.error("Error saving transcription:", saveError);
        toast.error("Transcription was processed but couldn't be saved to your account.");
      }
      
      // Download the file if needed
      const downloadInfo = getDownloadInfo(format, file.name, transcriptionContent);
        
      if (downloadInfo) {
        downloadFile(downloadInfo);
      }

      toast.success("Transcription completed successfully!");
    } catch (e) {
      console.error("Error during transcription:", e);
      toast.error(
        "An error occurred during transcription. You may have reached your request limit."
      );
    }
  };

  function getDownloadInfo(format: string, filename: string, transcription: string): DownloadFileParams | null {
    switch (format) {
      case "text":
        return {
          mimeType: "text/plain",
          fileName: `${filename}.txt`,
          content: transcription
        };
      case "json":
      case "verbose_json":
        return {
          mimeType: "application/json",
          fileName: `${filename}.json`,
          content: JSON.stringify(transcription, null, 2)
        };
      case "srt":
        return {
          mimeType: "text/plain",
          fileName: `${filename}.srt`,
          content: transcription
        };
      case "vtt":
        return {
          mimeType: "text/plain",
          fileName: `${filename}.vtt`,
          content: transcription
        };
      default:
        console.error("Unsupported format");
        return null;
    }
  }

  function downloadFile({ content, fileName, mimeType }: DownloadFileParams): void {
    const blob = new Blob([content], { type: mimeType });
    const downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.href = window.URL.createObjectURL(blob);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  return (
    <Row className="justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-grow">
            <Label 
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-500 mb-2"
            >
              Choose an audio file
            </Label>
            <input
              accept="audio/*"
              id="file-upload"
              name="file-upload"
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:me-4 file:py-2 file:px-5
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:text-white
                file:disabled:opacity-50 
                file:bg-[#0141ff]
                hover:file:bg-[#002aa6] hover:file:cursor-pointer"
            />
          </div>
          <div className="self-end">
            <ShootingStarButton
              disabled={
                (duration !== null && duration > MAX_AUDIO_DURATION_SECONDS) ||
                isUploading ||
                isSaving
              }
              type="submit"
              className="w-[144px] h-[44px]"
            >
              <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                {(isUploading || isSaving) ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Processing</span>
                  </>
                ) : (
                  <span>Upload</span>
                )}
              </div>
            </ShootingStarButton>
          </div>
        </div>

        {duration !== null && duration > MAX_AUDIO_DURATION_SECONDS && (
          <p className="text-[#99a3c3] text-xs mb-4">
            *Audio files must be less than 15 minutes in length
          </p>
        )}

        <SelectLangugage
          options={supported_languages}
          onChange={handleLanguageChange}
          defaultValue={supported_languages[52].iso}
        />
        <SelectFormat
          options={response_format}
          onChange={handleFormatChange}
          defaultValue={response_format[4]}
        />
        <div className="mt-4">
          <Label htmlFor="transcript-prompt" className="block mb-2 text-sm font-medium text-gray-500">
            Prompt
          </Label>
          <Textarea
            id="transcript-prompt"
            className="w-full"
            rows={4}
            placeholder="Enter prompt to improve the quality of the transcripts..."
            value={prompt}
            onChange={handlePromptChange}
            maxLength={244}
          />
          <p className="text-gray-500 text-xs mt-1">
            *The prompt should match the audio language. Max 244 characters.
          </p>
        </div>
      </form>
    </Row>
  );
}

export default Upload;
