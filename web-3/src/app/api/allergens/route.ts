import { NextResponse } from "next/server";
import { getAllergens } from "@/lib/queries";

export async function GET() {
  try {
    return NextResponse.json(await getAllergens());
  } catch (error) {
    console.error("Error fetching allergens:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch allergens" }, { status: 500 });
  }
}
