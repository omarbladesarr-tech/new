import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function SupportPage() {
  const supabase = await createClient()

  const { data: tickets, error } = await supabase
    .from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  const sampleTickets = [
    {
      id: 'TIK-2024-001',
      customer: 'John Smith',
      subject: 'Product not received yet',
      status: 'open',
      priority: 'high',
      created_at: '2024-03-15',
      updated_at: '2024-03-15',
    },
    {
      id: 'TIK-2024-002',
      customer: 'Sarah Johnson',
      subject: 'Refund request for damaged item',
      status: 'in_progress',
      priority: 'high',
      created_at: '2024-03-14',
      updated_at: '2024-03-15',
    },
    {
      id: 'TIK-2024-003',
      customer: 'Mike Davis',
      subject: 'Questions about bulk order',
      status: 'open',
      priority: 'medium',
      created_at: '2024-03-13',
      updated_at: '2024-03-13',
    },
    {
      id: 'TIK-2024-004',
      customer: 'Emily Chen',
      subject: 'Shipping address correction',
      status: 'resolved',
      priority: 'low',
      created_at: '2024-03-12',
      updated_at: '2024-03-13',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-500/20 text-green-400'
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400'
      case 'open':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-green-400'
      default:
        return 'text-slate-400'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Support</h1>
          <p className="text-slate-400 mt-2">Manage customer support tickets and inquiries</p>
        </div>
        <Button>New Ticket</Button>
      </div>

      {/* Support Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Open Tickets', value: '12', change: '2 new today' },
          { label: 'In Progress', value: '5', change: 'Being handled' },
          { label: 'Resolved', value: '234', change: 'This month' },
          { label: 'Avg Response', value: '2.3h', change: 'response time' },
        ].map((stat, idx) => (
          <Card key={idx} className="bg-slate-800 border-slate-700 p-4">
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            <p className="text-slate-500 text-xs mt-1">{stat.change}</p>
          </Card>
        ))}
      </div>

      {/* Tickets Table */}
      <Card className="bg-slate-800 border-slate-700 mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Support Tickets</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Ticket ID</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Subject</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-semibold">Priority</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Created</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sampleTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-white font-medium">{ticket.id}</td>
                    <td className="py-3 px-4 text-white">{ticket.customer}</td>
                    <td className="py-3 px-4 text-slate-400">{ticket.subject}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">{ticket.created_at}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-slate-400 hover:text-white transition">Reply</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Knowledge Base & Quick Responses */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Knowledge Base</h2>
          <div className="space-y-2">
            {[
              'How to track my order',
              'Return and exchange policy',
              'Shipping information',
              'Payment methods',
              'Product specifications',
              'Technical support',
            ].map((article, idx) => (
              <a
                key={idx}
                href="#"
                className="block p-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded transition"
              >
                → {article}
              </a>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">AI Agent Status</h2>
          <div className="space-y-3">
            {[
              { agent: 'Response Generation', status: 'active', handled: '156 tickets' },
              { agent: 'Issue Classification', status: 'active', handled: 'Real-time' },
              { agent: 'Solution Matching', status: 'active', handled: '89% accuracy' },
            ].map((agent, idx) => (
              <div key={idx} className="p-3 bg-slate-700/50 rounded">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-white text-sm">{agent.agent}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-slate-400">{agent.status}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">{agent.handled}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
