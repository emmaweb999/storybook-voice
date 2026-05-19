import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.DEEPL_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "DEEPL_API_KEY is missing" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api-free.deepl.com/v2/languages?type=target",
      {
        headers: {
          Authorization: `DeepL-Auth-Key ${apiKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to load DeepL languages" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      languages: data.map((lang: any) => ({
        code: lang.language.toLowerCase(),
        name: lang.name,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Server error loading languages" },
      { status: 500 }
    );
  }
}