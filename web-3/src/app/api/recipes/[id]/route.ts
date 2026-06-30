import { NextRequest, NextResponse } from "next/server";
import { getRecipeById } from "@/lib/queries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return NextResponse.json(await getRecipeById(id));
  } catch (error) {
    const notFound = error instanceof Error && error.message === "Recipe not found";
    if (notFound) {
      return NextResponse.json({ success: false, error: "Recipe not found" }, { status: 404 });
    }
    console.error("Error fetching recipe:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch recipe" }, { status: 500 });
  }
}
