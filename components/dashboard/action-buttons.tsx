'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ApprovalButtonsProps {
  itemId: string
  itemType: 'order' | 'refund' | 'campaign' | 'pricing'
  amount?: string
  onApprove?: () => void
  onReject?: () => void
}

export function ApprovalButtons({
  itemId,
  itemType,
  amount,
  onApprove,
  onReject,
}: ApprovalButtonsProps) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [showDialog, setShowDialog] = useState<'approve' | 'reject' | null>(null)

  const handleApprove = async () => {
    setLoading('approve')
    try {
      const res = await fetch(`/api/approvals/${itemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      })
      if (res.ok) {
        onApprove?.()
      }
    } catch (error) {
      console.error('Approval failed:', error)
    } finally {
      setLoading(null)
      setShowDialog(null)
    }
  }

  const handleReject = async () => {
    setLoading('reject')
    try {
      const res = await fetch(`/api/approvals/${itemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      })
      if (res.ok) {
        onReject?.()
      }
    } catch (error) {
      console.error('Rejection failed:', error)
    } finally {
      setLoading(null)
      setShowDialog(null)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowDialog('approve')}
          disabled={loading !== null}
        >
          {loading === 'approve' ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : null}
          Approve
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDialog('reject')}
          disabled={loading !== null}
        >
          {loading === 'reject' ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : null}
          Reject
        </Button>
      </div>

      <Dialog open={showDialog !== null} onOpenChange={() => setShowDialog(null)}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {showDialog === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {showDialog === 'approve'
                ? `Are you sure you want to approve this ${itemType}${amount ? ` for ${amount}` : ''}?`
                : `Are you sure you want to reject this ${itemType}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(null)}>
              Cancel
            </Button>
            <Button
              variant={showDialog === 'approve' ? 'default' : 'destructive'}
              onClick={showDialog === 'approve' ? handleApprove : handleReject}
            >
              {showDialog === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface ViewEditButtonsProps {
  onView?: () => void
  onEdit?: () => void
  viewLabel?: string
  editLabel?: string
}

export function ViewEditButtons({
  onView,
  onEdit,
  viewLabel = 'View',
  editLabel = 'Edit',
}: ViewEditButtonsProps) {
  return (
    <div className="flex gap-2">
      {onView && (
        <button
          onClick={onView}
          className="text-slate-400 hover:text-white transition text-sm"
        >
          {viewLabel}
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-slate-400 hover:text-white transition text-sm"
        >
          {editLabel}
        </button>
      )}
    </div>
  )
}

interface ConfigureButtonProps {
  agentId: string
  agentName: string
}

export function ConfigureAgentButton({ agentId, agentName }: ConfigureButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'active' | 'paused'>('active')

  const handleStatusChange = async (newStatus: 'active' | 'paused') => {
    setLoading(true)
    try {
      const res = await fetch(`/api/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setStatus(newStatus)
      }
    } catch (error) {
      console.error('Status change failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setShowDialog(true)}>
        Configure
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Configure {agentName}</DialogTitle>
            <DialogDescription className="text-slate-400">
              Adjust agent settings and behavior
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Agent Status</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={status === 'active' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('active')}
                  disabled={loading}
                >
                  Active
                </Button>
                <Button
                  size="sm"
                  variant={status === 'paused' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('paused')}
                  disabled={loading}
                >
                  Paused
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
