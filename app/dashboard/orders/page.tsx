'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingCard, LoadingSpinner, TableSkeleton } from '@/components/ui/loading'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ShoppingCart, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Sample data for demo (will be replaced with real API data)
const sampleOrders = [
  {
    id: 'ORD-2024-001',
    customer: 'John Smith',
    email: 'john@example.com',
    status: 'shipped',
    amount: 349.99,
    items: 1,
    created_at: '2024-03-15',
    tracking: 'TRK12345',
  },
  {
    id: 'ORD-2024-002',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    status: 'processing',
    amount: 189.97,
    items: 2,
    created_at: '2024-03-14',
    tracking: null,
  },
  {
    id: 'ORD-2024-003',
    customer: 'Mike Davis',
    email: 'mike@example.com',
    status: 'pending_approval',
    amount: 549.99,
    items: 3,
    created_at: '2024-03-13',
    tracking: null,
  },
  {
    id: 'ORD-2024-004',
    customer: 'Emily Chen',
    email: 'emily@example.com',
    status: 'delivered',
    amount: 89.99,
    items: 1,
    created_at: '2024-03-12',
    tracking: 'TRK12346',
  },
]

type Order = typeof sampleOrders[0]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-500/20 text-green-400'
    case 'shipped':
      return 'bg-blue-500/20 text-blue-400'
    case 'processing':
      return 'bg-purple-500/20 text-purple-400'
    case 'pending_approval':
      return 'bg-yellow-500/20 text-yellow-400'
    default:
      return 'bg-slate-500/20 text-slate-400'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered':
      return <CheckCircle className="h-4 w-4 text-green-400" />
    case 'shipped':
      return <Truck className="h-4 w-4 text-blue-400" />
    case 'processing':
      return <Package className="h-4 w-4 text-purple-400" />
    case 'pending_approval':
      return <Clock className="h-4 w-4 text-yellow-400" />
    default:
      return <AlertCircle className="h-4 w-4 text-slate-400" />
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleApprove = async (orderId: string) => {
    setActionLoading(orderId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: 'processing' } : order
      )
    )
    setActionLoading(null)
  }

  const handleReject = async (orderId: string) => {
    setActionLoading(orderId)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setOrders((prev) => prev.filter((order) => order.id !== orderId))
    setActionLoading(null)
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowViewDialog(true)
  }

  const stats = [
    { label: 'Total Orders', value: '342', change: '+28 this week', icon: ShoppingCart },
    { label: 'Pending Approval', value: orders.filter((o) => o.status === 'pending_approval').length.toString(), change: 'Require review', icon: Clock },
    { label: 'In Transit', value: orders.filter((o) => o.status === 'shipped').length.toString(), change: 'Currently shipped', icon: Truck },
    { label: 'Total Revenue', value: '$45,320', change: 'This month', icon: CheckCircle },
  ]

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="h-8 w-32 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-64 bg-slate-700/50 rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-32 bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700 p-4">
              <div className="h-4 w-24 bg-slate-700 rounded animate-pulse mb-2" />
              <div className="h-8 w-16 bg-slate-700 rounded animate-pulse" />
            </Card>
          ))}
        </div>
        <Card className="bg-slate-800 border-slate-700 p-6">
          <TableSkeleton rows={5} />
        </Card>
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-3 shadow-lg">
          <LoadingSpinner size="sm" />
          <span className="text-slate-300 text-sm">Loading orders...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-slate-400 mt-2">Manage and track customer orders</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </div>

      {/* Order Stats */}
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

      {/* Orders Table */}
      <Card className="bg-slate-800 border-slate-700 mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Order ID</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Email</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">Amount</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-semibold">Items</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Date</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                    <td className="py-3 px-4 text-white font-medium">{order.id}</td>
                    <td className="py-3 px-4 text-white">{order.customer}</td>
                    <td className="py-3 px-4 text-slate-400 text-sm">{order.email}</td>
                    <td className="py-3 px-4 text-right text-white font-medium">${order.amount}</td>
                    <td className="py-3 px-4 text-center text-slate-400">{order.items}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">{order.created_at}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-slate-400 hover:text-white transition text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-slate-400 hover:text-white transition text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Pending Approvals & Fulfillment */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Pending Approvals</h2>
          <div className="space-y-3">
            {orders
              .filter((o) => o.status === 'pending_approval')
              .map((order) => (
                <div key={order.id} className="p-3 bg-slate-700/50 rounded border border-slate-600">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-white">{order.id}</p>
                      <p className="text-sm text-slate-400">High value order</p>
                    </div>
                    <p className="font-semibold text-white">${order.amount}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleApprove(order.id)}
                      disabled={actionLoading === order.id}
                    >
                      {actionLoading === order.id ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : null}
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(order.id)}
                      disabled={actionLoading === order.id}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            {orders.filter((o) => o.status === 'pending_approval').length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500/50" />
                <p>All caught up! No pending approvals.</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Fulfillment Status</h2>
          <div className="space-y-4">
            {[
              { stage: 'Payment Confirmed', count: 342, percent: 100 },
              { stage: 'Picked & Packed', count: 298, percent: 87 },
              { stage: 'In Transit', count: 23, percent: 7 },
              { stage: 'Delivered', count: 215, percent: 63 },
            ].map((stage, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-white">{stage.stage}</p>
                  <p className="text-sm text-slate-400">{stage.count} orders</p>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stage.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* View Order Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Order Details</DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Customer</p>
                  <p className="text-white font-medium">{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-white font-medium">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Amount</p>
                  <p className="text-white font-medium">${selectedOrder.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Items</p>
                  <p className="text-white font-medium">{selectedOrder.items}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Date</p>
                  <p className="text-white font-medium">{selectedOrder.created_at}</p>
                </div>
              </div>
              {selectedOrder.tracking && (
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-sm text-slate-400">Tracking Number</p>
                  <p className="text-white font-medium">{selectedOrder.tracking}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Order</DialogTitle>
            <DialogDescription className="text-slate-400">
              Fill in the details to create a new order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center py-8 text-slate-400">
              <Package className="h-12 w-12 mx-auto mb-3 text-slate-500" />
              <p>Order creation form would go here</p>
              <p className="text-sm mt-2">Includes customer info, products, and shipping details</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowCreateDialog(false)}>
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
