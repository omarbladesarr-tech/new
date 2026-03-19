'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useOrders(status?: string) {
  const url = status ? `/api/orders?status=${status}` : '/api/orders'
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    orders: data?.orders || [],
    isLoading,
    error,
    mutate,
  }
}

export function useOrder(orderId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    orderId ? `/api/orders/${orderId}` : null,
    fetcher
  )

  return {
    order: data?.order,
    isLoading,
    error,
    mutate,
  }
}

export async function createOrder(orderData: {
  customer_name: string
  customer_email: string
  total_amount: number
  items: any[]
  shipping_address: string
}) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    throw new Error('Failed to create order')
  }

  return response.json()
}

export async function updateOrderStatus(orderId: string, status: string) {
  const response = await fetch(`/api/orders/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw new Error('Failed to update order')
  }

  return response.json()
}
