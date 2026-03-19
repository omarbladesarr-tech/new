'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
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
import { Switch } from '@/components/ui/switch'
import {
  Bot,
  Settings,
  Activity,
  Pause,
  Play,
  FileText,
  Zap,
  MessageSquare,
  Package,
  Megaphone,
  Search,
  Wrench,
} from 'lucide-react'

type AgentStatus = 'active' | 'idle' | 'paused'

type Agent = {
  id: string
  name: string
  role: string
  status: AgentStatus
  description: string
  capabilities: string[]
  icon: React.ReactNode
  tasksCompleted: number
  avgResponseTime: string
}

const initialAgents: Agent[] = [
  {
    id: 'master-orchestrator',
    name: 'Master Orchestrator',
    role: 'System Coordinator',
    status: 'active',
    description: 'Central hub coordinating all specialized agents and operations',
    capabilities: ['Task Distribution', 'Performance Monitoring', 'Resource Allocation', 'Human Oversight'],
    icon: <Bot className="h-8 w-8 text-blue-400" />,
    tasksCompleted: 1247,
    avgResponseTime: '0.8s',
  },
  {
    id: 'order-fulfillment',
    name: 'Order Fulfillment Agent',
    role: 'Operations',
    status: 'active',
    description: 'Manages order processing and supplier coordination',
    capabilities: ['Order Processing', 'Supplier Management', 'Inventory Sync', 'Fulfillment Tracking'],
    icon: <Zap className="h-8 w-8 text-yellow-400" />,
    tasksCompleted: 856,
    avgResponseTime: '1.2s',
  },
  {
    id: 'customer-service',
    name: 'Customer Service Agent',
    role: 'Commerce',
    status: 'active',
    description: 'Handles customer inquiries and support tickets',
    capabilities: ['Ticket Management', 'Email Responses', 'Issue Resolution', 'Knowledge Base'],
    icon: <MessageSquare className="h-8 w-8 text-green-400" />,
    tasksCompleted: 2341,
    avgResponseTime: '0.5s',
  },
  {
    id: 'product-listing',
    name: 'Product Listing Agent',
    role: 'Commerce',
    status: 'active',
    description: 'Manages product creation and catalog optimization',
    capabilities: ['Product Creation', 'SEO Optimization', 'Description Writing', 'Image Management'],
    icon: <Package className="h-8 w-8 text-purple-400" />,
    tasksCompleted: 523,
    avgResponseTime: '2.1s',
  },
  {
    id: 'marketing',
    name: 'Marketing Agent',
    role: 'Commerce',
    status: 'idle',
    description: 'Creates and executes marketing campaigns',
    capabilities: ['Campaign Creation', 'Email Marketing', 'Social Media', 'Analytics'],
    icon: <Megaphone className="h-8 w-8 text-orange-400" />,
    tasksCompleted: 178,
    avgResponseTime: '3.5s',
  },
  {
    id: 'research',
    name: 'Research Agent',
    role: 'Intelligence',
    status: 'active',
    description: 'Performs market research and trend analysis',
    capabilities: ['Market Analysis', 'Competitor Research', 'Trend Detection', 'Report Generation'],
    icon: <Search className="h-8 w-8 text-cyan-400" />,
    tasksCompleted: 89,
    avgResponseTime: '5.2s',
  },
]

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [showLogsDialog, setShowLogsDialog] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const toggleAgentStatus = async (agentId: string) => {
    setActionLoading(agentId)
    await new Promise((resolve) => setTimeout(resolve, 800))

    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === agentId) {
          const newStatus: AgentStatus = agent.status === 'paused' ? 'active' : 'paused'
          return { ...agent, status: newStatus }
        }
        return agent
      })
    )
    setActionLoading(null)
  }

  const openConfig = (agent: Agent) => {
    setSelectedAgent(agent)
    setShowConfigDialog(true)
  }

  const openLogs = (agent: Agent) => {
    setSelectedAgent(agent)
    setShowLogsDialog(true)
  }

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'idle':
        return 'bg-yellow-500'
      case 'paused':
        return 'bg-red-500'
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="h-8 w-32 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-64 bg-slate-700/50 rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-36 bg-slate-700 rounded animate-pulse" />
        </div>
        <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
          <div className="h-6 w-48 bg-slate-700 rounded animate-pulse mb-4" />
          <div className="h-24 bg-slate-700/50 rounded animate-pulse" />
        </Card>
        <div className="grid lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 bg-slate-700 rounded animate-pulse" />
                <div className="flex-1">
                  <div className="h-5 w-40 bg-slate-700 rounded animate-pulse mb-2" />
                  <div className="h-4 w-24 bg-slate-700/50 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-16 bg-slate-700/50 rounded animate-pulse" />
            </Card>
          ))}
        </div>
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-3 shadow-lg">
          <LoadingSpinner size="sm" />
          <span className="text-slate-300 text-sm">Loading agents...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Agents</h1>
          <p className="text-slate-400 mt-2">Manage and monitor your specialized AI agents</p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Configure All
        </Button>
      </div>

      {/* Agent Overview */}
      <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Hierarchical Structure</h2>
        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded p-4 border border-slate-600">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-blue-400" />
              <div>
                <p className="font-medium text-white">Master Orchestrator</p>
                <p className="text-slate-400 text-sm">Central coordinator overseeing all operations</p>
              </div>
              <div className={`ml-auto w-3 h-3 rounded-full ${getStatusColor(agents[0].status)}`} />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 ml-6 border-l border-slate-600 pl-4">
            <div className="bg-slate-700/30 rounded p-3">
              <p className="font-medium text-white text-sm mb-2">Operations Division</p>
              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agents[1].status)}`} />
                  Order Fulfillment
                </div>
              </div>
            </div>
            <div className="bg-slate-700/30 rounded p-3">
              <p className="font-medium text-white text-sm mb-2">Commerce Division</p>
              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agents[2].status)}`} />
                  Customer Service
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agents[3].status)}`} />
                  Product Listing
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agents[4].status)}`} />
                  Marketing
                </div>
              </div>
            </div>
            <div className="bg-slate-700/30 rounded p-3">
              <p className="font-medium text-white text-sm mb-2">Intelligence Division</p>
              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agents[5].status)}`} />
                  Research
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-500" />
                  Tool Creation
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Agents Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="bg-slate-800 border-slate-700 p-6 hover:border-slate-600 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-700/50 rounded-lg">{agent.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                  <p className="text-sm text-slate-400">{agent.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                  <span className="text-sm text-slate-400 capitalize">{agent.status}</span>
                </div>
                {actionLoading === agent.id ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleAgentStatus(agent.id)}
                    title={agent.status === 'paused' ? 'Resume agent' : 'Pause agent'}
                  >
                    {agent.status === 'paused' ? (
                      <Play className="h-4 w-4 text-green-400" />
                    ) : (
                      <Pause className="h-4 w-4 text-yellow-400" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-4">{agent.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-700/30 rounded">
              <div>
                <p className="text-xs text-slate-500">Tasks Completed</p>
                <p className="text-white font-semibold">{agent.tasksCompleted.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Avg Response</p>
                <p className="text-white font-semibold">{agent.avgResponseTime}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-400 mb-2">CAPABILITIES</p>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((cap, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded">
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => openConfig(agent)}>
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </Button>
              <Button variant="outline" size="sm" onClick={() => openLogs(agent)}>
                <FileText className="h-4 w-4 mr-1" />
                Logs
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Configure Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configure {selectedAgent?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Adjust agent settings and behavior
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Agent Status</p>
                  <p className="text-sm text-slate-400">Enable or disable this agent</p>
                </div>
                <Switch
                  checked={selectedAgent.status !== 'paused'}
                  onCheckedChange={() => toggleAgentStatus(selectedAgent.id)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Auto-scaling</p>
                  <p className="text-sm text-slate-400">Automatically adjust resources</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Notifications</p>
                  <p className="text-sm text-slate-400">Alert on critical events</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Debug Mode</p>
                  <p className="text-sm text-slate-400">Enable verbose logging</p>
                </div>
                <Switch />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowConfigDialog(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logs Dialog */}
      <Dialog open={showLogsDialog} onOpenChange={setShowLogsDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {selectedAgent?.name} Logs
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Recent activity and events
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-96 overflow-y-auto">
            <div className="space-y-2 font-mono text-sm">
              {[
                { time: '10:45:23', level: 'INFO', message: 'Task completed successfully' },
                { time: '10:44:18', level: 'INFO', message: 'Processing new request' },
                { time: '10:43:05', level: 'WARN', message: 'High latency detected (2.3s)' },
                { time: '10:42:12', level: 'INFO', message: 'Task completed successfully' },
                { time: '10:41:45', level: 'INFO', message: 'Connected to external API' },
                { time: '10:40:33', level: 'INFO', message: 'Agent initialized' },
                { time: '10:39:28', level: 'DEBUG', message: 'Memory usage: 128MB' },
                { time: '10:38:15', level: 'INFO', message: 'Configuration loaded' },
              ].map((log, idx) => (
                <div key={idx} className="flex gap-4 p-2 bg-slate-700/30 rounded">
                  <span className="text-slate-500">{log.time}</span>
                  <span
                    className={`w-12 ${
                      log.level === 'WARN'
                        ? 'text-yellow-400'
                        : log.level === 'ERROR'
                        ? 'text-red-400'
                        : log.level === 'DEBUG'
                        ? 'text-blue-400'
                        : 'text-green-400'
                    }`}
                  >
                    [{log.level}]
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogsDialog(false)}>
              Close
            </Button>
            <Button>Download Logs</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
