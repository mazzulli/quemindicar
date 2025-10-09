import { type NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Retomar a subscrição
    const subscription = await stripe.subscriptions.update(id, {
      pause_collection: null,
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("[v0] Erro ao retomar subscrição:", error);
    return NextResponse.json(
      { error: "Erro ao retomar subscrição" },
      { status: 500 }
    );
  }
}
