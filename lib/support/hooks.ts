'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useTickets(status?: string) {
  const url = status ? `/api/support?status=${status}` : '/api/support'
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    tickets: data?.tickets || [],
    isLoading,
    error,
    mutate,
  }
}

export function useTicket(ticketId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    ticketId ? `/api/support/${ticketId}` : null,
    fetcher
  )

  return {
    ticket: data?.ticket,
    isLoading,
    error,
    mutate,
  }
}

export async function createTicket(ticketData: {
  subject: string
  customer_email: string
  priority?: 'low' | 'medium' | 'high'
  description: string
}) {
  const response = await fetch('/api/support', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData),
  })

  if (!response.ok) {
    throw new Error('Failed to create ticket')
  }

  return response.json()
}

export async function updateTicketStatus(ticketId: string, status: string) {
  const response = await fetch(`/api/support/${ticketId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw new Error('Failed to update ticket')
  }

  return response.json()
}

export async function addTicketReply(ticketId: string, message: string) {
  const response = await fetch(`/api/support/${ticketId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    throw new Error('Failed to add reply')
  }

  return response.json()
}
