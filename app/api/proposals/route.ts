import ky from "ky"
import { type NextRequest, NextResponse } from "next/server"

type UpstreamResponse = {
  proposal_id?: string
  counts?: { active: number; expired: number; total: number }
  message?: string | null
  data?: {
    active?: unknown[]
    expired?: unknown[]
  }
  error?: string
}

function isValidProposalResponse(body: unknown): body is Required<Pick<UpstreamResponse, "data">> & UpstreamResponse {
  if (!body || typeof body !== "object") return false
  const data = (body as UpstreamResponse).data
  return Boolean(data && Array.isArray(data.active) && Array.isArray(data.expired))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const proposalId = searchParams.get("id")

    if (!proposalId) {
      return NextResponse.json({ error: "Proposal ID is required" }, { status: 400 })
    }

    const upstream = await ky
      .get("https://panel.citysresidences.com/teklifApi/proposalApi.php", {
        searchParams: { proposal_id: proposalId },
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
        },
      })
      .json<UpstreamResponse>()

    if (!isValidProposalResponse(upstream)) {
      // Upstream returned a 200 with an unexpected shape (e.g. Imunify360 bot
      // block). Never cache this — the next caller should retry against origin.
      return NextResponse.json(
        {
          error: "Upstream returned an unexpected response",
          upstream,
        },
        {
          status: 502,
          headers: { "Cache-Control": "no-store" },
        }
      )
    }

    return NextResponse.json(upstream, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Error fetching proposal:", error)

    const message = error instanceof Error ? error.message : "Failed to fetch proposal data"
    return NextResponse.json(
      { error: "Failed to fetch proposal data", message },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    )
  }
}
