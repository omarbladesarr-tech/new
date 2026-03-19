'use client'

import { useOrder } from '@/lib/orders/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface OrderDetailsProps {
  orderId: string
  onClose?: () => void
}

export function OrderDetails({ orderId, onClose }: OrderDetailsProps) {
  const { order, isLoading, error } = useOrder(orderId)

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }

  if (error || !order) {
    return <div className="text-red-400">Failed to load order</div>
  }

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

  return (
    <div className="space-y-6">
      <div className="bg-slate-700/50 rounded p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">Order ID</p>
            <p className="text-lg font-semibold text-white">{order.id}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">Status</p>
            <span className={`inline-block px-3 py-1 text-sm rounded ${getStatusColor(order.status)}`}>
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">Customer</p>
            <p className="text-white">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">Email</p>
            <p className="text-white">{order.customer_email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-white">${order.total_amount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase mb-1">Created</p>
            <p className="text-white">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {order.items && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
          <div className="space-y-2">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-700/50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-white font-semibold">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {order.shipping_address && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Shipping Address</h3>
          <div className="p-4 bg-slate-700/50 rounded text-slate-300 whitespace-pre-line">
            {order.shipping_address}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-slate-700">
        {order.status === 'pending_approval' && (
          <>
            <Button>Approve</Button>
            <Button variant="outline">Reject</Button>
          </>
        )}
        {order.status === 'processing' && (
          <Button>Mark as Shipped</Button>
        )}
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </div>
  )
}
