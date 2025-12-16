import { NextRequest, NextResponse } from "next/server"
import ky from "ky"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: proposalId } = await params

    if (!proposalId) {
      return NextResponse.json({ error: "Proposal ID is required" }, { status: 400 })
    }

    const response = await ky
      .get("https://panel.citysresidences.com/teklifApi/proposalApi.php", {
        searchParams: {
          proposal_id: proposalId,
        },
        timeout: 10000,
        headers: {
          Accept: "application/json",
        },
      })
      .json()

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Error fetching proposal:", error)

    if (error instanceof Error) {
      return NextResponse.json({ error: "Failed to fetch proposal data", message: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Failed to fetch proposal data" }, { status: 500 })
  }
}
