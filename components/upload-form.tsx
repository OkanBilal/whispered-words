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

function Upload() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [language, setLanguage] = useState(supported_languages[0].iso);
  const [format, setFormat] = useState(response_format[0]);
  const model = "whisper-1";

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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

    try {
      const res = await axios.post("/api/upload", formData);
      const transcription = res.data;
      setResponse(transcription);
      console.log("res", transcription);

      let mimeType;
      switch (format) {
        case "txt":
          mimeType = "text/plain";
          break;
        case "json":
        case "verbose_json":
          mimeType = "application/json";
          break;
        case "srt":
        case "vtt":
          mimeType = "text/plain";
          break;
        default:
          console.error("Unsupported format");
          return;
      }
      downloadFile(transcription, `transcription.${format}`, mimeType);
    } catch (e) {
      console.error(e, "error");
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
            <ShootingStarButton>Upload</ShootingStarButton>
          </div>
        </div>
        <SelectLangugage
          options={supported_languages}
          onChange={handleLanguageChange}
          defaultValue={supported_languages[0].iso}
        />
        <SelectFormat
          options={response_format}
          onChange={handleFormatChange}
          defaultValue={response_format[0]}
        />
      </form>
    </Row>
  );
}

export default Upload;
