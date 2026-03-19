'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useProducts(search?: string) {
  const url = search ? `/api/products?search=${encodeURIComponent(search)}` : '/api/products'
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    products: data?.products || [],
    isLoading,
    error,
    mutate,
  }
}

export function useProduct(productId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    productId ? `/api/products/${productId}` : null,
    fetcher
  )

  return {
    product: data?.product,
    isLoading,
    error,
    mutate,
  }
}

export async function createProduct(productData: {
  name: string
  sku: string
  description: string
  price: number
  cost: number
  supplier_id?: string
  category: string
  images?: string[]
}) {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  })

  if (!response.ok) {
    throw new Error('Failed to create product')
  }

  return response.json()
}

export async function updateProduct(
  productId: string,
  productData: Partial<{
    name: string
    description: string
    price: number
    cost: number
    category: string
    status: string
  }>
) {
  const response = await fetch(`/api/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  })

  if (!response.ok) {
    throw new Error('Failed to update product')
  }

  return response.json()
}

export async function deleteProduct(productId: string) {
  const response = await fetch(`/api/products/${productId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete product')
  }

  return response.json()
}
