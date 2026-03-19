import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function MarketingPage() {
  const supabase = await createClient()

  const { data: campaigns, error } = await supabase
    .from('marketing_campaigns')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  const sampleCampaigns = [
    {
      id: 1,
      name: 'Spring Sale Campaign',
      channel: 'email',
      status: 'active',
      recipients: 5234,
      opens: 1847,
      clicks: 342,
      conversions: 67,
      revenue: 8934.50,
      created_at: '2024-03-10',
    },
    {
      id: 2,
      name: 'New Product Launch',
      channel: 'email',
      status: 'active',
      recipients: 3456,
      opens: 1203,
      clicks: 189,
      conversions: 28,
      revenue: 4521.75,
      created_at: '2024-03-08',
    },
    {
      id: 3,
      name: 'Abandoned Cart Recovery',
      channel: 'email',
      status: 'scheduled',
      recipients: 1234,
      opens: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      created_at: '2024-03-06',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Marketing</h1>
          <p className="text-slate-400 mt-2">Manage campaigns and customer engagement</p>
        </div>
        <Button>Create Campaign</Button>
      </div>

      {/* Campaign Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Campaigns', value: '8', change: 'Running now' },
          { label: 'Total Recipients', value: '12,340', change: 'Unique contacts' },
          { label: 'Avg Open Rate', value: '34.2%', change: 'Industry avg 22%' },
          { label: 'Campaign Revenue', value: '$45,230', change: 'This month' },
        ].map((stat, idx) => (
          <Card key={idx} className="bg-slate-800 border-slate-700 p-4">
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            <p className="text-slate-500 text-xs mt-1">{stat.change}</p>
          </Card>
        ))}
      </div>

      {/* Campaigns Table */}
      <Card className="bg-slate-800 border-slate-700 mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Marketing Campaigns</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Campaign</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Channel</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-semibold">Recipients</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-semibold">Open Rate</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-semibold">CTR</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-semibold">Conv Rate</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-semibold">Revenue</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleCampaigns.map((campaign) => {
                  const openRate = ((campaign.opens / campaign.recipients) * 100).toFixed(1)
                  const ctr = ((campaign.clicks / campaign.opens) * 100).toFixed(1)
                  const convRate = ((campaign.conversions / campaign.clicks) * 100).toFixed(1)

                  return (
                    <tr key={campaign.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-white font-medium">{campaign.name}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {campaign.channel.charAt(0).toUpperCase() + campaign.channel.slice(1)}
                      </td>
                      <td className="py-3 px-4 text-center text-white">{campaign.recipients}</td>
                      <td className="py-3 px-4 text-center text-white">{openRate}%</td>
                      <td className="py-3 px-4 text-center text-white">{isNaN(parseFloat(ctr)) ? '0%' : ctr + '%'}</td>
                      <td className="py-3 px-4 text-center text-white">{isNaN(parseFloat(convRate)) ? '0%' : convRate + '%'}</td>
                      <td className="py-3 px-4 text-right text-white font-medium">${campaign.revenue.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            campaign.status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : campaign.status === 'scheduled'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Campaign Performance & Email Templates */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Top Performing Campaigns</h2>
          <div className="space-y-4">
            {[
              { name: 'Spring Sale Campaign', revenue: '$8,934.50', roi: '342%' },
              { name: 'New Product Launch', revenue: '$4,521.75', roi: '218%' },
              { name: 'Flash Sale', revenue: '$3,245.00', roi: '198%' },
            ].map((campaign, idx) => (
              <div key={idx} className="p-3 bg-slate-700/50 rounded border border-slate-600">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-white">{campaign.name}</p>
                  <span className="text-green-400 font-semibold">{campaign.roi}</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">{campaign.revenue}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Email Templates</h2>
          <div className="space-y-2">
            {[
              'Welcome Series (3 emails)',
              'Abandoned Cart Recovery',
              'Product Recommendation',
              'Birthday/Anniversary',
              'Post-Purchase Follow-up',
              'VIP Exclusive Offers',
            ].map((template, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                <span className="text-slate-300">{template}</span>
                <Button variant="outline" size="sm">
                  Use
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI Agent Status */}
      <Card className="mt-6 bg-slate-800 border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Marketing AI Agent Status</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              task: 'Campaign Generation',
              status: 'active',
              progress: 85,
              description: 'Creating personalized campaigns',
            },
            {
              task: 'Audience Segmentation',
              status: 'active',
              progress: 100,
              description: 'Analyzing customer behaviors',
            },
            {
              task: 'A/B Testing',
              status: 'scheduled',
              progress: 45,
              description: 'Running 12 concurrent tests',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-700/50 rounded border border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">{item.task}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-400">{item.status}</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-3">{item.description}</p>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">{item.progress}% complete</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
