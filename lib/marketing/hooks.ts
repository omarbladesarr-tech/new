'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useCampaigns(status?: string) {
  const url = status
    ? `/api/marketing/campaigns?status=${status}`
    : '/api/marketing/campaigns'
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    campaigns: data?.campaigns || [],
    isLoading,
    error,
    mutate,
  }
}

export function useCampaign(campaignId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    campaignId ? `/api/marketing/campaigns/${campaignId}` : null,
    fetcher
  )

  return {
    campaign: data?.campaign,
    isLoading,
    error,
    mutate,
  }
}

export async function createCampaign(campaignData: {
  name: string
  channel?: 'email' | 'sms' | 'push'
  template_id?: string
  target_audience?: string
  scheduled_for?: string
  budget_limit?: number
}) {
  const response = await fetch('/api/marketing/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaignData),
  })

  if (!response.ok) {
    throw new Error('Failed to create campaign')
  }

  return response.json()
}

export async function updateCampaign(
  campaignId: string,
  campaignData: Partial<{
    name: string
    status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed'
    budget_limit: number
  }>
) {
  const response = await fetch(`/api/marketing/campaigns/${campaignId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaignData),
  })

  if (!response.ok) {
    throw new Error('Failed to update campaign')
  }

  return response.json()
}

export async function launchCampaign(campaignId: string) {
  const response = await fetch(`/api/marketing/campaigns/${campaignId}/launch`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to launch campaign')
  }

  return response.json()
}

export async function pauseCampaign(campaignId: string) {
  const response = await fetch(`/api/marketing/campaigns/${campaignId}/pause`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to pause campaign')
  }

  return response.json()
}
