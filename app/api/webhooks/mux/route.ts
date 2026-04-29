import { NextRequest, NextResponse } from "next/server";

// Stub — wired up fully in Phase 10
export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log("[mux webhook] event received:", body?.type);
  return NextResponse.json({ received: true }, { status: 200 });
}
