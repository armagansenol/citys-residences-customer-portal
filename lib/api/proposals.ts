export type ProposalStatus = "active" | "expired"

export interface ProposalItem {
  Block: string
  UnitType: string
  Floor: string
  UnitNo: string
  ProposalDate: string
  ProposalExpireDate: string
  status: ProposalStatus
  File: string
  InstallmentPeriod: string
  User: string
  UserMobilePhone: string
}

export interface ProposalResponse {
  proposal_id: string
  counts: {
    active: number
    expired: number
    total: number
  }
  message: string | null
  data: {
    active: ProposalItem[]
    expired: ProposalItem[]
  }
}

/**
 * Fetch proposal data by ID using the Next.js API route (server-side proxy)
 * This avoids CORS issues by proxying the request through our API
 */
export async function fetchProposalById(proposalId: string): Promise<ProposalResponse> {
  const response = await fetch(`/api/proposals?id=${encodeURIComponent(proposalId)}`, {
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to fetch proposal" }))
    throw new Error(error.message || error.error || "Failed to fetch proposal")
  }

  return (await response.json()) as ProposalResponse
}

/**
 * Generate a slug from proposal data for routing
 */
export function generateProposalSlug(proposal: ProposalItem): string {
  const block = proposal.Block.toLowerCase().replace(/\s+/g, "-")
  const unitType = proposal.UnitType.replace(/\+/g, "-plus").replace(/,/g, "-").toLowerCase()
  const unitNo = proposal.UnitNo.toLowerCase()
  return `${block}-no-${unitNo}-${unitType}`
}
