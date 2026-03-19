'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useApprovals(status: string = 'pending') {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/approvals?status=${status}`,
    fetcher
  )

  return {
    approvals: data?.approvals || [],
    isLoading,
    error,
    mutate,
  }
}

export function useApproval(approvalId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    approvalId ? `/api/approvals/${approvalId}` : null,
    fetcher
  )

  return {
    approval: data?.approval,
    isLoading,
    error,
    mutate,
  }
}

export async function approveRequest(
  approvalId: string,
  notes?: string
) {
  const response = await fetch(`/api/approvals/${approvalId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'approve',
      notes,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to approve request')
  }

  return response.json()
}

export async function rejectRequest(
  approvalId: string,
  notes?: string
) {
  const response = await fetch(`/api/approvals/${approvalId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'reject',
      notes,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to reject request')
  }

  return response.json()
}
