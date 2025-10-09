import { type NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Cancelar a subscrição
    const subscription = await stripe.subscriptions.cancel(id);

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("[v0] Erro ao cancelar subscrição:", error);
    return NextResponse.json(
      { error: "Erro ao cancelar subscrição" },
      { status: 500 }
    );
  }
}
