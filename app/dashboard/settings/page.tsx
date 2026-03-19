import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your account and system preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6">Account Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded text-white disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
            <input
              type="text"
              placeholder="Enter your company name"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button>Save Changes</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </div>
      </Card>

      {/* Approval Thresholds */}
      <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6">Approval Thresholds</h2>
        <div className="space-y-4">
          {[
            { name: 'Order Approval Threshold', current: '$500', description: 'Orders above this amount require manual approval' },
            { name: 'Refund Approval Threshold', current: '$200', description: 'Refunds above this amount require manual approval' },
            { name: 'Marketing Daily Budget Limit', current: '$100', description: 'Daily marketing spend requiring approval' },
            { name: 'Bulk Product Listing Limit', current: '20 products', description: 'Number of products requiring approval per batch' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-700/50 rounded border border-slate-600">
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-white">{item.name}</p>
                <span className="text-slate-300 font-semibold">{item.current}</span>
              </div>
              <p className="text-sm text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* API Keys & Integration */}
      <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">API Keys</h2>
          <Button>Generate New Key</Button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Production API Key', status: 'active', created: '2024-01-15' },
            { name: 'Development API Key', status: 'active', created: '2024-02-01' },
            { name: 'Sandbox API Key', status: 'inactive', created: '2024-03-01' },
          ].map((key, idx) => (
            <div key={idx} className="p-4 bg-slate-700/50 rounded border border-slate-600 flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{key.name}</p>
                <p className="text-sm text-slate-400">Created {key.created}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    key.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-500/20 text-slate-400'
                  }`}
                >
                  {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                </span>
                <Button variant="outline" size="sm">
                  Revoke
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Integrations */}
      <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6">Integrations</h2>
        <div className="space-y-3">
          {[
            { name: 'Stripe', status: 'connected', icon: '💳' },
            { name: 'Shopify', status: 'connected', icon: '🛍️' },
            { name: 'Email Provider', status: 'connected', icon: '✉️' },
            { name: 'Slack', status: 'not_connected', icon: '💬' },
            { name: 'Google Analytics', status: 'connected', icon: '📊' },
          ].map((integration, idx) => (
            <div key={idx} className="p-4 bg-slate-700/50 rounded border border-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <p className="font-medium text-white">{integration.name}</p>
                </div>
              </div>
              {integration.status === 'connected' ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-400">Connected</span>
                </div>
              ) : (
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Agent Configuration */}
      <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6">Agent Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded bg-slate-700 border-slate-600"
              />
              <span className="text-white font-medium">Enable Auto-Approval for Standard Orders</span>
            </label>
            <p className="text-sm text-slate-400 ml-7 mt-1">Automatically approve orders under $500</p>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded bg-slate-700 border-slate-600"
              />
              <span className="text-white font-medium">Enable Email Marketing Agent</span>
            </label>
            <p className="text-sm text-slate-400 ml-7 mt-1">Allow automated email campaign creation</p>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded bg-slate-700 border-slate-600"
              />
              <span className="text-white font-medium">Enable Research Agent</span>
            </label>
            <p className="text-sm text-slate-400 ml-7 mt-1">Enable market research and competitor analysis</p>
          </div>
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded bg-slate-700 border-slate-600" />
              <span className="text-white font-medium">Require Human Approval for AI Decisions</span>
            </label>
            <p className="text-sm text-slate-400 ml-7 mt-1">Add extra layer of human oversight</p>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            { name: 'Order Alerts', description: 'Notify when new orders arrive' },
            { name: 'Approval Requests', description: 'Notify when manual approval is needed' },
            { name: 'Agent Errors', description: 'Notify when agents encounter errors' },
            { name: 'Daily Summary', description: 'Send daily business summary email' },
          ].map((pref, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded bg-slate-700 border-slate-600"
              />
              <div>
                <p className="text-white font-medium">{pref.name}</p>
                <p className="text-sm text-slate-400">{pref.description}</p>
              </div>
            </label>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-500/10 border border-red-500/30 p-6">
        <h2 className="text-xl font-bold text-red-400 mb-6">Danger Zone</h2>
        <div className="space-y-3">
          <div>
            <p className="text-white font-medium mb-2">Delete Account</p>
            <p className="text-slate-400 text-sm mb-4">Permanently delete your account and all associated data</p>
            <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
