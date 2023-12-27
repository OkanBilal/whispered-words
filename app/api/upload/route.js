import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.formData();
  let config = {
    method: "post",
    url: "https://api.openai.com/v1/audio/transcriptions",
    data: data,
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Changed environment variable name
    },
  };

  try {
    const response = await axios.request(config);
    if (response.status >= 200 && response.status < 300) {
      return NextResponse.json(response.data);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, {
      status: error.response?.status || 500,
      statusText: error.response?.statusText || "Internal Server Error",
    });
  }
}
