import { NextResponse } from "next/server";
import { getTags } from "@/lib/queries";

export async function GET() {
  try {
    return NextResponse.json(await getTags());
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tags" }, { status: 500 });
  }
}
