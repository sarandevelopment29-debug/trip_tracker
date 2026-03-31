import { NextResponse } from "next/server";
import { expenseController } from "@/controllers/expenseController";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get("tripId");
    if (!tripId) return NextResponse.json({ error: "Missing tripId" }, { status: 400 });

    const expenses = await expenseController.getExpensesByTrip(tripId);
    return NextResponse.json(expenses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { tripId, title, amount, category, date, paidBy } = await req.json();
    if (!tripId || !title || isNaN(amount) || !category || !date || !paidBy) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const expense = await expenseController.addExpense(tripId, { title, amount, category, date, paidBy });
    return NextResponse.json(expense);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
