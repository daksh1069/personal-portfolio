import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(command: (string | number)[]): Promise<number | null> {
  if (!url || !token) return null;
  const res = await fetch(`${url}/${command.map(encodeURIComponent).join("/")}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { result: number };
  return body.result;
}

/** GET: current total visitor count. */
export async function GET() {
  if (!url || !token) return NextResponse.json({ enabled: false }, { status: 200 });
  const count = await redis(["GET", "visitors:total"]);
  return NextResponse.json({ enabled: true, count: count ?? 0 });
}

/** POST: count one visit (the client guards with sessionStorage so a
 * browsing session only increments once). */
export async function POST() {
  if (!url || !token) return NextResponse.json({ enabled: false }, { status: 200 });
  const count = await redis(["INCR", "visitors:total"]);
  return NextResponse.json({ enabled: true, count: count ?? 0 });
}
