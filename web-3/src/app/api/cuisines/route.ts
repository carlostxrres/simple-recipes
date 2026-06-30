import { NextResponse } from "next/server";
import { getCuisines } from "@/lib/queries";

export async function GET() {
  try {
    return NextResponse.json(await getCuisines());
  } catch (error) {
    console.error("Error fetching cuisines:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch cuisines" }, { status: 500 });
  }
}
