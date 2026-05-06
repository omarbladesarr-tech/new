// Superteam Earn API Client
// 0% platform fee - highest profit margin

import {
  Bounty,
  PlatformApiResponse,
  PLATFORM_CONFIGS,
} from './types'

const config = PLATFORM_CONFIGS['superteam-earn']

interface SuperteamListing {
  id: string
  slug: string
  title: string
  description: string
  requirements?: string
  skills: string[]
  type: 'bounty' | 'project' | 'grant'
  status: 'open' | 'in_progress' | 'review' | 'completed'
  rewardAmount: number
  token: string
  deadline?: string
  sponsor: {
    name: string
    logo?: string
    url?: string
  }
  applicants?: number
  winnersAnnounced?: boolean
  createdAt: string
  url: string
}

interface SuperteamSubmission {
  listingId: string
  walletAddress: string
  content: string
  links?: string[]
  additionalInfo?: string
}

export class SuperteamEarnClient {
  private baseUrl: string
  private walletAddress?: string

  constructor(walletAddress?: string) {
    this.baseUrl = config.apiBaseUrl
    this.walletAddress = walletAddress
  }

  /**
   * Fetch all open bounties/listings
   */
  async getOpenListings(params?: {
    type?: 'bounty' | 'project' | 'grant'
    skills?: string[]
    minReward?: number
    page?: number
    pageSize?: number
  }): Promise<PlatformApiResponse<Bounty[]>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.type) queryParams.set('type', params.type)
      if (params?.skills?.length) queryParams.set('skills', params.skills.join(','))
      if (params?.minReward) queryParams.set('minReward', params.minReward.toString())
      if (params?.page) queryParams.set('page', params.page.toString())
      if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString())

      const response = await fetch(
        `${this.baseUrl}/listings?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const listings: SuperteamListing[] = data.listings || data.data || []

      // Transform to our Bounty format
      const bounties: Bounty[] = listings.map((listing) => ({
        id: listing.id,
        platformBountyId: listing.slug || listing.id,
        platform: 'superteam-earn',
        title: listing.title,
        description: listing.description,
        requirements: listing.requirements,
        rewardAmount: listing.rewardAmount,
        rewardToken: listing.token || 'USDC',
        skills: listing.skills || [],
        deadline: listing.deadline ? new Date(listing.deadline) : undefined,
        sponsorName: listing.sponsor?.name,
        sponsorLogo: listing.sponsor?.logo,
        type: listing.type,
        status: listing.status,
        applicants: listing.applicants,
        createdAt: new Date(listing.createdAt),
        url: listing.url || `https://earn.superteam.fun/listings/${listing.slug}`,
      }))

      return {
        success: true,
        data: bounties,
        pagination: data.pagination,
      }
    } catch (error) {
      console.error('Error fetching Superteam listings:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch listings',
      }
    }
  }

  /**
   * Get a specific listing by ID or slug
   */
  async getListing(idOrSlug: string): Promise<PlatformApiResponse<Bounty>> {
    try {
      const response = await fetch(`${this.baseUrl}/listings/${idOrSlug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const listing: SuperteamListing = await response.json()

      return {
        success: true,
        data: {
          id: listing.id,
          platformBountyId: listing.slug || listing.id,
          platform: 'superteam-earn',
          title: listing.title,
          description: listing.description,
          requirements: listing.requirements,
          rewardAmount: listing.rewardAmount,
          rewardToken: listing.token || 'USDC',
          skills: listing.skills || [],
          deadline: listing.deadline ? new Date(listing.deadline) : undefined,
          sponsorName: listing.sponsor?.name,
          sponsorLogo: listing.sponsor?.logo,
          type: listing.type,
          status: listing.status,
          applicants: listing.applicants,
          createdAt: new Date(listing.createdAt),
          url: listing.url,
        },
      }
    } catch (error) {
      console.error('Error fetching Superteam listing:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch listing',
      }
    }
  }

  /**
   * Submit work for a bounty
   */
  async submitWork(
    submission: SuperteamSubmission
  ): Promise<PlatformApiResponse<{ submissionId: string }>> {
    try {
      if (!this.walletAddress) {
        throw new Error('Wallet address required for submissions')
      }

      const response = await fetch(`${this.baseUrl}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...submission,
          walletAddress: this.walletAddress,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        success: true,
        data: { submissionId: data.id || data.submissionId },
      }
    } catch (error) {
      console.error('Error submitting to Superteam:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit work',
      }
    }
  }

  /**
   * Get user's submissions
   */
  async getMySubmissions(): Promise<PlatformApiResponse<any[]>> {
    try {
      if (!this.walletAddress) {
        throw new Error('Wallet address required')
      }

      const response = await fetch(
        `${this.baseUrl}/submissions?wallet=${this.walletAddress}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        success: true,
        data: data.submissions || data.data || [],
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch submissions',
      }
    }
  }

  /**
   * Calculate earnings (0% platform fee for Superteam)
   */
  calculateEarnings(grossAmount: number, serviceSharePercent: number = 20): {
    gross: number
    platformFee: number
    serviceShare: number
    net: number
  } {
    const platformFee = 0 // Superteam has 0% fee
    const serviceShare = grossAmount * (serviceSharePercent / 100)
    const net = grossAmount - platformFee - serviceShare

    return {
      gross: grossAmount,
      platformFee,
      serviceShare,
      net,
    }
  }
}

// Singleton instance for server-side usage
let clientInstance: SuperteamEarnClient | null = null

export function getSuperteamClient(walletAddress?: string): SuperteamEarnClient {
  if (!clientInstance || walletAddress) {
    clientInstance = new SuperteamEarnClient(walletAddress)
  }
  return clientInstance
}
