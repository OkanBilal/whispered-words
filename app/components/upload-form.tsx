"use client";

import { useState } from "react";
import ShootingStarButton from "./button/shooting-star-button";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const model = "whisper-1";

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

    axios
      .post("https://api.openai.com/v1/audio/transcriptions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setResponse(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className=" flex justify-center items-center ">
      <form onSubmit={handleSubmit} className=" ">
        <div className="mb-2 flex items-center ">
          <div className="mr-4">
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700"
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
      file:me-4 file:py-2 file:px-4
      file:rounded-lg file:border-0
      file:text-sm file:font-semibold
       file:text-white
      file:disabled:opacity-50 
      file:bg-[#0141ff]
      hover:file:bg-[#0141ff]
    "
            />
            <p
              className="mt-2 text-sm text-gray-500 dark:text-gray-300"
              id="file_input_help"
            >
              mp3, wav or flac (max 5MB file size).
            </p>
          </div>
          <div>
            <ShootingStarButton>Upload</ShootingStarButton>
          </div>
        </div>
      </form>
      {response ? <div>{JSON.stringify(response, null, 2)}</div> : null}
    </div>
  );
}

export default Upload;
