import { NextResponse } from "next/server";
import { expenseController } from "@/controllers/expenseController";

export async function PATCH(req: Request, { params }: { params: Promise<{ expenseId: string }> }) {
  try {
    const p = await params;
    const { title, amount, category, date, paidBy } = await req.json();

    if (!title || isNaN(amount) || !category || !date || !paidBy) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await expenseController.updateExpense(p.expenseId, {
      title,
      amount: Number(amount),
      category,
      date,
      paidBy,
    });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ expenseId: string }> }) {
  try {
    const p = await params;
    await expenseController.deleteExpense(p.expenseId);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
