'use client'

import { useState } from 'react'
import { createCampaign } from '@/lib/marketing/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface CampaignFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CampaignForm({ onSuccess, onCancel }: CampaignFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    channel: 'email' as const,
    target_audience: 'all',
    budget_limit: '',
    scheduled_for: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await createCampaign({
        name: formData.name,
        channel: formData.channel,
        target_audience: formData.target_audience,
        budget_limit: formData.budget_limit ? parseFloat(formData.budget_limit) : undefined,
        scheduled_for: formData.scheduled_for || undefined,
      })

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Create Campaign</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Campaign Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
            placeholder="e.g., Spring Sale 2024"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Channel</label>
            <select
              name="channel"
              value={formData.channel}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-slate-500"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notification</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Target Audience
            </label>
            <select
              name="target_audience"
              value={formData.target_audience}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-slate-500"
            >
              <option value="all">All Customers</option>
              <option value="new">New Customers</option>
              <option value="returning">Returning Customers</option>
              <option value="vip">VIP Members</option>
              <option value="inactive">Inactive Users</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Budget Limit (Optional)
            </label>
            <input
              type="number"
              name="budget_limit"
              value={formData.budget_limit}
              onChange={handleChange}
              step="10"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
              placeholder="0.00"
            />
            <p className="text-xs text-slate-400 mt-1">Note: >$100/day requires approval</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Schedule For (Optional)
            </label>
            <input
              type="datetime-local"
              name="scheduled_for"
              value={formData.scheduled_for}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-slate-500"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-700">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Campaign'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
