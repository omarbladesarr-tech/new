'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading'
import {
  Bot,
  ShoppingCart,
  Package,
  MessageSquare,
  ArrowRight,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  Settings,
  Megaphone,
  Search,
  Shield,
} from 'lucide-react'

type AgentStatus = {
  name: string
  status: 'active' | 'idle'
  tasks: number
  icon: React.ReactNode
}

const agentStatuses: AgentStatus[] = [
  { name: 'Master Orchestrator', status: 'active', tasks: 12, icon: <Bot className="h-4 w-4" /> },
  { name: 'Order Fulfillment', status: 'active', tasks: 8, icon: <ShoppingCart className="h-4 w-4" /> },
  { name: 'Customer Service', status: 'active', tasks: 5, icon: <MessageSquare className="h-4 w-4" /> },
  { name: 'Product Listing', status: 'active', tasks: 3, icon: <Package className="h-4 w-4" /> },
  { name: 'Marketing', status: 'idle', tasks: 0, icon: <Megaphone className="h-4 w-4" /> },
  { name: 'Research', status: 'active', tasks: 2, icon: <Search className="h-4 w-4" /> },
]

const quickActions = [
  { label: 'New Product', href: '/dashboard/products', icon: Package },
  { label: 'Create Campaign', href: '/dashboard/marketing', icon: Megaphone },
  { label: 'View Agents', href: '/dashboard/agents', icon: Bot },
  { label: 'Pending Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { label: 'Support Tickets', href: '/dashboard/support', icon: MessageSquare },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    agents: 6,
    orders: 342,
    products: 156,
    tickets: 12,
  })

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const statCards = [
    {
      title: 'Active Agents',
      value: stats.agents,
      icon: <Bot className="h-6 w-6 text-blue-400" />,
      change: '+2 this week',
      changeColor: 'text-green-400',
    },
    {
      title: 'Total Orders',
      value: stats.orders,
      icon: <ShoppingCart className="h-6 w-6 text-yellow-400" />,
      change: '+12 today',
      changeColor: 'text-green-400',
    },
    {
      title: 'Products Listed',
      value: stats.products,
      icon: <Package className="h-6 w-6 text-purple-400" />,
      change: '+5 today',
      changeColor: 'text-green-400',
    },
    {
      title: 'Support Tickets',
      value: stats.tickets,
      icon: <MessageSquare className="h-6 w-6 text-green-400" />,
      change: '2 pending',
      changeColor: 'text-yellow-400',
    },
  ]

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-9 w-48 bg-slate-700 rounded animate-pulse" />
          <div className="h-5 w-64 bg-slate-700/50 rounded animate-pulse mt-2" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
                  <div className="h-8 w-16 bg-slate-700 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-slate-700/50 rounded animate-pulse" />
                </div>
                <div className="h-8 w-8 bg-slate-700 rounded animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-3 shadow-lg">
          <LoadingSpinner size="sm" />
          <span className="text-slate-300 text-sm">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-2">Welcome back! Here's an overview of your AI-powered business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="bg-slate-800 border-slate-700 p-6 hover:border-slate-600 transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.changeColor}`}>{stat.change}</p>
              </div>
              {stat.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Agent Status */}
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              AI Agent Status
            </h2>
            <Link href="/dashboard/agents">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {agentStatuses.map((agent, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded border border-slate-600 hover:border-slate-500 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-600/50 rounded">{agent.icon}</div>
                  <div>
                    <p className="font-medium text-white">{agent.name}</p>
                    <p className="text-sm text-slate-400">{agent.tasks} active tasks</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      agent.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  />
                  <span className="text-sm text-slate-400 capitalize">{agent.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Quick Actions
          </h2>
          <div className="space-y-2">
            {quickActions.map((action, idx) => {
              const Icon = action.icon
              return (
                <Link key={idx} href={action.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {action.label}
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
              )
            })}
          </div>
        </Card>
      </div>

      {/* System Health */}
      <Card className="mt-6 bg-slate-800 border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />
          System Health
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { metric: 'API Status', value: 'Operational', icon: CheckCircle, color: 'text-green-400' },
            { metric: 'Database', value: '99.9% uptime', icon: Activity, color: 'text-green-400' },
            { metric: 'Agent Performance', value: '97.2% success', icon: TrendingUp, color: 'text-green-400' },
            { metric: 'Last Sync', value: '2 minutes ago', icon: Clock, color: 'text-blue-400' },
          ].map((health, idx) => {
            const Icon = health.icon
            return (
              <div key={idx} className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${health.color}`} />
                <div>
                  <p className="text-slate-400 text-sm">{health.metric}</p>
                  <p className={`font-semibold ${health.color}`}>{health.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="mt-6 bg-slate-800 border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-400" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            { action: 'Order #ORD-2024-001 shipped', agent: 'Order Fulfillment', time: '2 min ago' },
            { action: 'New product listed: Premium Headphones', agent: 'Product Listing', time: '15 min ago' },
            { action: 'Support ticket #TIK-042 resolved', agent: 'Customer Service', time: '32 min ago' },
            { action: 'Market analysis report generated', agent: 'Research', time: '1 hour ago' },
            { action: 'Email campaign sent to 1,240 subscribers', agent: 'Marketing', time: '2 hours ago' },
          ].map((activity, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-700"
            >
              <div>
                <p className="text-white text-sm">{activity.action}</p>
                <p className="text-xs text-slate-500">by {activity.agent}</p>
              </div>
              <span className="text-xs text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
