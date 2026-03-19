'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner, TableSkeleton } from '@/components/ui/loading'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle, XCircle, Clock, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react'

type ApprovalItem = {
  id: string
  type: string
  itemId: string
  amount: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  createdAt: string
}

const initialApprovals: ApprovalItem[] = [
  {
    id: '1',
    type: 'High-Value Order',
    itemId: 'ORD-2024-156',
    amount: '$750',
    reason: 'Exceeds $500 threshold',
    priority: 'high',
    createdAt: '2024-03-15 09:30',
  },
  {
    id: '2',
    type: 'International Order',
    itemId: 'ORD-2024-157',
    amount: '$450',
    reason: 'Shipping to Japan',
    priority: 'high',
    createdAt: '2024-03-15 08:45',
  },
  {
    id: '3',
    type: 'Refund Request',
    itemId: 'REF-2024-042',
    amount: '$350',
    reason: 'Exceeds $200 threshold',
    priority: 'high',
    createdAt: '2024-03-14 16:20',
  },
  {
    id: '4',
    type: 'Campaign Spend',
    itemId: 'CAMP-2024-023',
    amount: '$250/day',
    reason: 'Daily spend exceeds $100',
    priority: 'medium',
    createdAt: '2024-03-14 14:15',
  },
  {
    id: '5',
    type: 'Pricing Adjustment',
    itemId: 'PRICE-2024-008',
    amount: '-15%',
    reason: 'Price reduction > 10%',
    priority: 'medium',
    createdAt: '2024-03-14 11:30',
  },
]

const approvalHistory = [
  {
    type: 'Order',
    id: 'ORD-2024-150',
    amount: '$625',
    decision: 'approved',
    approver: 'System Admin',
    date: '2024-03-15 10:30',
  },
  {
    type: 'Campaign',
    id: 'CAMP-2024-021',
    amount: '$300',
    decision: 'approved',
    approver: 'Marketing Lead',
    date: '2024-03-14 15:45',
  },
  {
    type: 'Refund',
    id: 'REF-2024-040',
    amount: '$275',
    decision: 'rejected',
    approver: 'System Admin',
    date: '2024-03-14 12:20',
  },
]

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals)
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    action: 'approve' | 'reject'
    item: ApprovalItem | null
  }>({ open: false, action: 'approve', item: null })

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!confirmDialog.item) return
    
    setActionLoading(confirmDialog.item.id)
    setConfirmDialog({ open: false, action: 'approve', item: null })
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200))
    
    setApprovals((prev) => prev.filter((a) => a.id !== confirmDialog.item?.id))
    setActionLoading(null)
  }

  const openConfirmDialog = (item: ApprovalItem, action: 'approve' | 'reject') => {
    setConfirmDialog({ open: true, action, item })
  }

  const urgentApprovals = approvals.filter((a) => a.priority === 'high')
  const standardApprovals = approvals.filter((a) => a.priority !== 'high')

  const stats = [
    { label: 'Pending Approvals', value: approvals.length.toString(), change: 'Require action', icon: Clock },
    { label: 'High Priority', value: urgentApprovals.length.toString(), change: 'Orders > $500', icon: AlertTriangle },
    { label: 'Awaiting Review', value: standardApprovals.length.toString(), change: 'Marketing spend', icon: ShieldCheck },
    { label: 'Auto-Approved', value: '234', change: 'This month', icon: CheckCircle },
  ]

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 w-40 bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-72 bg-slate-700/50 rounded animate-pulse mt-2" />
        </div>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700 p-4">
              <div className="h-4 w-28 bg-slate-700 rounded animate-pulse mb-2" />
              <div className="h-8 w-12 bg-slate-700 rounded animate-pulse" />
            </Card>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="h-6 w-36 bg-slate-700 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-slate-700/50 rounded animate-pulse" />
              ))}
            </div>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="h-6 w-40 bg-slate-700 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-slate-700/50 rounded animate-pulse" />
              ))}
            </div>
          </Card>
        </div>
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-3 shadow-lg">
          <LoadingSpinner size="sm" />
          <span className="text-slate-300 text-sm">Loading approvals...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Approval Queue</h1>
        <p className="text-slate-400 mt-2">Review and manage pending AI agent actions</p>
      </div>

      {/* Approval Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="bg-slate-800 border-slate-700 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                  <p className="text-slate-500 text-xs mt-1">{stat.change}</p>
                </div>
                <Icon className="h-5 w-5 text-slate-500" />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Approval Rules */}
      <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Approval Rules Configuration</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-white mb-4">Order Management</h3>
            <div className="space-y-3">
              {[
                { rule: 'Orders > $500', approval: 'Required', threshold: '$500' },
                { rule: 'International Shipping', approval: 'Required', threshold: 'All' },
                { rule: 'Refunds > $200', approval: 'Required', threshold: '$200' },
                { rule: 'Bulk Orders', approval: 'Required', threshold: '>10 items' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-700/50 rounded border border-slate-600 hover:border-slate-500 transition cursor-pointer">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-white text-sm">{item.rule}</p>
                    <span className="text-xs text-slate-400">{item.threshold}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{item.approval}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Marketing & Spending</h3>
            <div className="space-y-3">
              {[
                { rule: 'Campaign Spend > $100/day', approval: 'Required', threshold: '$100' },
                { rule: 'Email Campaigns', approval: 'Auto-Approved', threshold: 'Standard' },
                { rule: 'New Product Listings', approval: 'Auto-Approved', threshold: 'Standard' },
                { rule: 'Manual Pricing Changes', approval: 'Required', threshold: '>10%' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-700/50 rounded border border-slate-600 hover:border-slate-500 transition cursor-pointer">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-white text-sm">{item.rule}</p>
                    <span className="text-xs text-slate-400">{item.threshold}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{item.approval}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Pending Approvals */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Urgent Approvals
          </h2>
          <div className="space-y-3">
            {urgentApprovals.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500/50" />
                <p>No urgent approvals pending</p>
              </div>
            ) : (
              urgentApprovals.map((approval) => (
                <div key={approval.id} className="p-4 bg-red-500/10 border border-red-500/30 rounded">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-white">{approval.type}</p>
                      <p className="text-sm text-slate-400">{approval.itemId}</p>
                    </div>
                    <p className="font-semibold text-red-400">{approval.amount}</p>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{approval.reason}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => openConfirmDialog(approval, 'approve')}
                      disabled={actionLoading === approval.id}
                    >
                      {actionLoading === approval.id ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openConfirmDialog(approval, 'reject')}
                      disabled={actionLoading === approval.id}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-400" />
            Standard Approvals
          </h2>
          <div className="space-y-3">
            {standardApprovals.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500/50" />
                <p>No standard approvals pending</p>
              </div>
            ) : (
              standardApprovals.map((approval) => (
                <div key={approval.id} className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-white">{approval.type}</p>
                      <p className="text-sm text-slate-400">{approval.itemId}</p>
                    </div>
                    <p className="font-semibold text-yellow-400">{approval.amount}</p>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{approval.reason}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => openConfirmDialog(approval, 'approve')}
                      disabled={actionLoading === approval.id}
                    >
                      {actionLoading === approval.id ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openConfirmDialog(approval, 'reject')}
                      disabled={actionLoading === approval.id}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Approval History */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Approval History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Type</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">ID</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Amount</th>
                <th className="text-center py-3 px-4 text-slate-400 font-semibold">Decision</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Approved By</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {approvalHistory.map((record, idx) => (
                <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                  <td className="py-3 px-4 text-white font-medium">{record.type}</td>
                  <td className="py-3 px-4 text-slate-400">{record.id}</td>
                  <td className="py-3 px-4 text-white">{record.amount}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded ${
                        record.decision === 'approved'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {record.decision === 'approved' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {record.decision.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{record.approver}</td>
                  <td className="py-3 px-4 text-slate-400 text-sm">{record.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {confirmDialog.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {confirmDialog.action === 'approve'
                ? `Are you sure you want to approve this ${confirmDialog.item?.type.toLowerCase()}?`
                : `Are you sure you want to reject this ${confirmDialog.item?.type.toLowerCase()}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          {confirmDialog.item && (
            <div className="py-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">ID:</span>
                <span className="text-white">{confirmDialog.item.itemId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="text-white font-medium">{confirmDialog.item.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reason:</span>
                <span className="text-white">{confirmDialog.item.reason}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, action: 'approve', item: null })}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === 'approve' ? 'default' : 'destructive'}
              onClick={() => handleAction(confirmDialog.action)}
            >
              {confirmDialog.action === 'approve' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
