import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { encodeCampaignImage, MAX_CAMPAIGN_IMAGE_BYTES } from "@/lib/security/campaign-image";

// Node.js is the default runtime; an explicit `runtime` export conflicts with cacheComponents.

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin)
    return NextResponse.json({ ok: false }, { status: 403 });
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      return NextResponse.json({ ok: false }, { status: 403 });
    const client = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error || !user) return NextResponse.json({ ok: false }, { status: 403 });
    const role = await client.rpc("is_admin");
    if (role.error || role.data !== true) return NextResponse.json({ ok: false }, { status: 403 });
    const limit = MAX_CAMPAIGN_IMAGE_BYTES + 65536;
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ ok: false }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) {
        await reader.cancel();
        return NextResponse.json({ ok: false }, { status: 413 });
      }
      chunks.push(value);
    }
    const form = await new Response(Buffer.concat(chunks), {
      headers: { "content-type": request.headers.get("content-type") ?? "" },
    }).formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ ok: false }, { status: 400 });
    const image = await encodeCampaignImage(new Uint8Array(await file.arrayBuffer()), file.type);
    const storagePath = `${user.id}/${crypto.randomUUID()}.webp`;
    const bucket = client.storage.from("campaign-images");
    const upload = await bucket.upload(storagePath, image.bytes, {
      contentType: "image/webp",
      upsert: false,
      cacheControl: "31536000",
    });
    if (upload.error) return NextResponse.json({ ok: false }, { status: 500 });
    const record = await client.from("campaign_media").insert({
      storage_path: storagePath,
      width: image.width,
      height: image.height,
      bytes: image.bytes.byteLength,
    });
    if (record.error) {
      await bucket.remove([storagePath]);
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json(
      { ok: true, url: `/api/campaign-media/${storagePath}` },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
