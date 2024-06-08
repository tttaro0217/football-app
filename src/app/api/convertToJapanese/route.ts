// src/app/api/convertToJapanese/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const apiKey = process.env.DEEPL_API_KEY; // Ensure you have this environment variable set
    const url = "https://api-free.deepl.com/v2/translate";

    const response = await axios.post(url, null, {
      params: {
        auth_key: apiKey,
        text: text,
        target_lang: "JA",
      },
    });

    const translatedText = response.data.translations[0].text;
    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Error translating text:", error);
    return NextResponse.json(
      { message: "Error translating text" },
      { status: 500 }
    );
  }
}
