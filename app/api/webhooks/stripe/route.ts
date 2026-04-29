import { NextRequest, NextResponse } from "next/server";

// Stub — wired up fully in Phase 7
export async function POST(request: NextRequest) {
  const body = await request.text();
  console.log("[stripe webhook] event received, length:", body.length);
  return NextResponse.json({ received: true }, { status: 200 });
}
