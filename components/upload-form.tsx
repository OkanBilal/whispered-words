"use client";

import { useState } from "react";
import ShootingStarButton from "./ui/shooting-star-button";
import axios from "axios";
import SelectLangugage from "./select-language";
import SelectFormat from "./select-format";
import { supported_languages } from "@/data/supported-languages";
import { response_format } from "../data/response-format";
import { Row } from "./ui/row";
import { toast } from "sonner";
import * as mm from "music-metadata-browser";

function Upload() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [language, setLanguage] = useState(supported_languages[7].iso);
  const [format, setFormat] = useState(response_format[0]);
  const [duration, setDuration] = useState(null);
  const [prompt, setPrompt] = useState();

  const model = "whisper-1";

  async function getAudioDuration(file) {
    try {
      const metadata = await mm.parseBlob(file);
      return metadata.format.duration;
    } catch (error) {
      console.error("Error parsing metadata:", error);
      return null;
    }
  }

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };

  const handleFileChange = async (event) => {
    setFile(event.target.files[0]);
    const duration = await getAudioDuration(event.target.files[0]);
    setDuration(duration);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file first!");
      return;
    }
    const formData = new FormData();
    formData.append("model", model);
    formData.append("file", file);
    formData.append("language", language);
    formData.append("response_format", format);
    {
      prompt ? formData.append("prompt", prompt) : null;
    }

    try {
      const res = await axios.post("/api/upload", formData);
      const transcription = res.data;
      setResponse(transcription);
      let mimeType;
      let fileName;
      let content;
      switch (format) {
        case "text":
          mimeType = "text/plain";
          fileName = `${file.name}.txt`;
          content = transcription;
          break;
        case "json":
        case "verbose_json":
          mimeType = "application/json";
          fileName = `${file.name}.json`;
          content = JSON.stringify(transcription, null, 2);
          break;
        case "srt":
          mimeType = "text/plain";
          fileName = `${file.name}.srt`;
          content = transcription;
          break;
        case "vtt":
          mimeType = "text/plain";
          fileName = `${file.name}.vtt`;
          content = transcription;
          break;
        default:
          console.error("Unsupported format");
          return;
      }
      downloadFile(content, fileName, mimeType);
    } catch (e) {
      toast.warning(
        "You have reached your request limit. Please try again in 5 minutes."
      );
    }
  };

  function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.href = window.URL.createObjectURL(blob);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  return (
    <Row className="justify-center items-center ">
      <form onSubmit={handleSubmit} className=" ">
        <div className="mb-2 flex items-end ">
          <div className="mr-4">
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-500"
            >
              Choose and upload a file
            </label>
            <input
              accept="audio/*"
              id="file-upload"
              name="file-upload"
              type="file"
              onChange={handleFileChange}
              className=" mt-2 block w-full text-sm text-gray-500
              file:me-4 file:py-2 file:px-5
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
            file:text-white
              file:disabled:opacity-50 
            file:bg-[#0141ff]
            hover:file:bg-[#002aa6] hover:file:cursor-pointer "
            />
          </div>
          <div>
            <ShootingStarButton
              disabled={duration && duration >= 900 ? true : false}
            >
              Upload
            </ShootingStarButton>
          </div>
        </div>
        {duration && duration >= 900 ? (
          <p className="text-[#99a3c3] text-xs ">
            *You can upload less than 15 minutes
          </p>
        ) : null}
        <SelectLangugage
          options={supported_languages}
          onChange={handleLanguageChange}
          defaultValue={supported_languages[13].iso}
        />
        <SelectFormat
          options={response_format}
          onChange={handleFormatChange}
          defaultValue={response_format[0]}
        />
        <div className="mt-4">
          <p className="block mb-2 text-sm font-medium text-gray-500">Prompt</p>
          <textarea
            className="w-full text-sm rounded outline-none p-2 placeholder:text-sm"
            rows={4}
            placeholder="Enter prompt to improve the quality of the transcripts..."
            value={prompt}
            onChange={handlePromptChange}
          />
          <p className="text-gray-500 text-xs ">
            *The prompt should match the audio language. Max 244 characters.
          </p>
        </div>
      </form>
    </Row>
  );
}

export default Upload;
