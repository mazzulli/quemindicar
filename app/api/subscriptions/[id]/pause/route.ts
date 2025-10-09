import { type NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Pausar a subscrição
    const subscription = await stripe.subscriptions.update(id, {
      pause_collection: {
        behavior: "mark_uncollectible",
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("[v0] Erro ao pausar subscrição:", error);
    return NextResponse.json(
      { error: "Erro ao pausar subscrição" },
      { status: 500 }
    );
  }
}
