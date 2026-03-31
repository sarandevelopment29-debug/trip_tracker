import { NextResponse } from "next/server";
import { tripController } from "@/controllers/tripController";

export async function GET() {
  try {
    const trips = await tripController.getTrips();
    return NextResponse.json(trips);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, totalDays, quotePerPerson } = await req.json();
    if (!name || isNaN(totalDays) || isNaN(quotePerPerson)) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const trip = await tripController.createTrip(name, totalDays, quotePerPerson);
    return NextResponse.json(trip);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
