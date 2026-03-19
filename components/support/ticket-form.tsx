'use client'

import { useState } from 'react'
import { createTicket } from '@/lib/support/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface TicketFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function TicketForm({ onSuccess, onCancel }: TicketFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    subject: '',
    customer_email: '',
    priority: 'medium' as const,
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await createTicket({
        subject: formData.subject,
        customer_email: formData.customer_email,
        priority: formData.priority,
        description: formData.description,
      })

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Create Support Ticket</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
            placeholder="e.g., Product not received"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Customer Email
            </label>
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
              placeholder="customer@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-slate-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
            placeholder="Describe the issue in detail..."
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-700">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Ticket'}
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
