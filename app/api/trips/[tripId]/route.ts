import { NextResponse } from "next/server";
import { tripController } from "@/controllers/tripController";

export async function GET(req: Request, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const p = await params;
    const trip = await tripController.getTripById(p.tripId);
    if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(trip);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const p = await params;
    await tripController.deleteTrip(p.tripId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const p = await params;
    const body = await req.json();
    await tripController.updateTrip(p.tripId, body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
