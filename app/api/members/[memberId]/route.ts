import { NextResponse } from "next/server";
import { memberController } from "@/controllers/memberController";

export async function PATCH(req: Request, { params }: { params: Promise<{ memberId: string }> }) {
  try {
    const p = await params;
    const { amount } = await req.json();
    if (isNaN(amount) || amount < 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

    await memberController.updateContribution(p.memberId, amount);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ memberId: string }> }) {
  try {
    const p = await params;
    await memberController.deleteMember(p.memberId);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
