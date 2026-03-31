import { NextResponse } from "next/server";
import { memberController } from "@/controllers/memberController";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get("tripId");
    if (!tripId) return NextResponse.json({ error: "Missing tripId" }, { status: 400 });

    const members = await memberController.getMembersByTrip(tripId);
    return NextResponse.json(members);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { tripId, name } = await req.json();
    if (!tripId || !name) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const member = await memberController.addMember(tripId, name);
    return NextResponse.json(member);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
