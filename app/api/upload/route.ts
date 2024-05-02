import axios from "axios";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

export async function POST(req: Request) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(1, "3 s"),
    });
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(
      ip
    );
    if (!success) {
      return new Response(
        "You've reached your request limit. Please try again in 5 minutes.",
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }
  } else {
    console.log("env vars not found, not rate limiting...");
  }

  const data = await req.formData();
  let config = {
    method: "post",
    url: "https://api.openai.com/v1/audio/transcriptions",
    data: data,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const response = await axios.request(config);
    if (response.status >= 200 && response.status < 300) {
      return NextResponse.json(response.data);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred" },
      {
        status: error.response?.status || 500,
        statusText: error.response?.statusText || "Internal Server Error",
      }
    );
  }
}
