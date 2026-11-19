import { createServerSupabaseClient } from "@/lib/supabase/server";

/** Session/RLS gate draft media; public visitors can read published artwork only. */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const name = path.join("/");
  if (!/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.webp$/.test(name))
    return new Response(null, { status: 404 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return new Response(null, { status: 404 });
  try {
    const client = await createServerSupabaseClient();
    const { data, error } = await client.storage.from("campaign-images").download(name);
    if (error || !data) return new Response(null, { status: 404 });
    return new Response(data, {
      headers: {
        "Content-Type": "image/webp",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
