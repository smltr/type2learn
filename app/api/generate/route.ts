import { NextResponse } from 'next/server';

const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODEL = 'gemini-3-flash-preview';

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set.' }, { status: 500 });
  }

  const model = GEMINI_MODEL;
  const modelEndpoint = `${GEMINI_API_BASE_URL}/${model}:generateContent`;

  if (process.env.NODE_ENV !== 'production') {
    console.info('[api/generate] using model:', model);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { language, topic } = (body || {}) as { language?: string; topic?: string };
  if (!language || !topic) {
    return NextResponse.json({ error: 'Language and topic are required.' }, { status: 400 });
  }

  const prompt = `You are a concise code tutor. Produce one ${language} code snippet that helps practice ${topic}. Keep it under 10 lines if possible, max 15 lines. No surrounding commentary or markdown fences, and avoid placeholders like ...`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  const response = await fetch(`${modelEndpoint}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const retryAfter = response.headers.get('retry-after') || undefined;
    const raw = await response.text();

    let upstreamMessage: string | undefined;
    let detail: string | undefined;
    try {
      const parsed = JSON.parse(raw) as { error?: { message?: string } };
      upstreamMessage = parsed?.error?.message;
      detail = raw;
    } catch {
      detail = raw;
    }

    return NextResponse.json(
      {
        error: upstreamMessage || 'Gemini request failed.',
        detail: detail?.slice(0, 2000),
        retryAfter,
        model,
        modelEndpoint,
      },
      {
        status: response.status,
        headers: retryAfter ? { 'Retry-After': retryAfter } : undefined,
      }
    );
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const text = data?.candidates?.[0]?.content?.parts
    ?.map(part => part.text || '')
    .join('')
    .trim();

  if (!text) {
    return NextResponse.json({ error: 'Gemini returned no code.' }, { status: 502 });
  }

  return NextResponse.json({ code: text, model, modelEndpoint });
}
