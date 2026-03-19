'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useInsights(category?: string) {
  const url = category ? `/api/research/insights?category=${category}` : '/api/research/insights'
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    insights: data?.insights || [],
    isLoading,
    error,
    mutate,
  }
}

export function useCompetitors() {
  const { data, error, isLoading, mutate } = useSWR('/api/research/competitors', fetcher)

  return {
    competitors: data?.competitors || [],
    isLoading,
    error,
    mutate,
  }
}

export function useTrendAnalysis() {
  const { data, error, isLoading, mutate } = useSWR('/api/research/trends', fetcher)

  return {
    trends: data?.trends || [],
    isLoading,
    error,
    mutate,
  }
}

export async function generateReport(reportType: string, dateRange?: { start: string; end: string }) {
  const response = await fetch('/api/research/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: reportType,
      date_range: dateRange,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate report')
  }

  return response.json()
}

export async function getReports() {
  const response = await fetch('/api/research/reports')

  if (!response.ok) {
    throw new Error('Failed to fetch reports')
  }

  return response.json()
}
