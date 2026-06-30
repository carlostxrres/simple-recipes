import { NextRequest, NextResponse } from "next/server";
import { getIngredients } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const pantryParam = request.nextUrl.searchParams.get("pantry");
    const pantry =
      pantryParam === "true" ? true :
      pantryParam === "false" ? false :
      undefined;
    return NextResponse.json(await getIngredients(pantry));
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch ingredients" }, { status: 500 });
  }
}
