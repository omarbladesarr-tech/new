import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function ResearchPage() {
  const supabase = await createClient()

  const { data: insights, error } = await supabase
    .from('market_insights')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Research & Insights</h1>
          <p className="text-slate-400 mt-2">Market analysis and competitive intelligence</p>
        </div>
        <Button>Generate Report</Button>
      </div>

      {/* Research Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Markets Tracked', value: '47', change: '+5 this month' },
          { label: 'Competitors', value: '156', change: 'In database' },
          { label: 'Trends Detected', value: '23', change: 'This month' },
          { label: 'Reports Generated', value: '89', change: 'This quarter' },
        ].map((stat, idx) => (
          <Card key={idx} className="bg-slate-800 border-slate-700 p-4">
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            <p className="text-slate-500 text-xs mt-1">{stat.change}</p>
          </Card>
        ))}
      </div>

      {/* Market Insights */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Latest Market Insights</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Wireless Audio Growth',
                trend: 'uptrend',
                change: '+18.5%',
                insight: 'Demand for premium wireless headphones continues to rise',
              },
              {
                title: 'Mobile Accessories',
                trend: 'stable',
                change: '2.3%',
                insight: 'Steady demand with seasonal variations',
              },
              {
                title: 'USB-C Adoption',
                trend: 'uptrend',
                change: '+12.7%',
                insight: 'Faster than expected transition to USB-C standard',
              },
            ].map((insight, idx) => (
              <div key={idx} className="p-4 bg-slate-700/50 rounded border border-slate-600">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white">{insight.title}</h3>
                  <span className={`text-sm font-semibold ${insight.trend === 'uptrend' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {insight.change}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{insight.insight}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Competitor Analysis</h2>
          <div className="space-y-4">
            {[
              {
                competitor: 'TechPro Store',
                marketShare: 28,
                pricePosition: 'Premium',
                trend: 'Growing',
              },
              {
                competitor: 'ValueMart',
                marketShare: 22,
                pricePosition: 'Budget',
                trend: 'Stable',
              },
              {
                competitor: 'ElectroHub',
                marketShare: 18,
                pricePosition: 'Mid-range',
                trend: 'Declining',
              },
            ].map((comp, idx) => (
              <div key={idx} className="p-4 bg-slate-700/50 rounded">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white">{comp.competitor}</h3>
                  <span className="text-sm text-slate-400">{comp.trend}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>{comp.pricePosition}</span>
                  <span>{comp.marketShare}% share</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${comp.marketShare}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Trend Analysis */}
      <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Current Market Trends</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { trend: 'Premium Audio', score: 8.7, direction: '↑' },
            { trend: 'Eco-Friendly Products', score: 8.2, direction: '↑' },
            { trend: 'Wireless Charging', score: 7.9, direction: '↑' },
            { trend: 'Budget Electronics', score: 5.4, direction: '↓' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-700/50 rounded border border-slate-600">
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-white text-sm">{item.trend}</p>
                <span className={item.direction === '↑' ? 'text-green-400' : 'text-red-400'}>
                  {item.direction}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{item.score}</div>
              <div className="w-full bg-slate-600 rounded-full h-1.5 mt-3">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${item.score * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Research Reports */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Reports</h2>
        <div className="space-y-3">
          {[
            {
              title: 'Q1 2024 Market Report',
              date: '2024-03-15',
              pages: 45,
              insights: 23,
            },
            {
              title: 'Competitive Landscape Analysis',
              date: '2024-03-10',
              pages: 32,
              insights: 18,
            },
            {
              title: 'Consumer Behavior Study',
              date: '2024-03-05',
              pages: 28,
              insights: 15,
            },
            {
              title: 'Product Category Deep Dive',
              date: '2024-02-28',
              pages: 56,
              insights: 31,
            },
          ].map((report, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-slate-700/50 rounded border border-slate-600 hover:border-slate-500 transition"
            >
              <div>
                <p className="font-medium text-white">{report.title}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {report.pages} pages • {report.insights} key insights • Generated {report.date}
                </p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Research Agent Status */}
      <Card className="mt-6 bg-slate-800 border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Research AI Agent Status</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              task: 'Market Monitoring',
              status: 'active',
              metrics: '47 markets tracked in real-time',
            },
            {
              task: 'Competitor Intelligence',
              status: 'active',
              metrics: '156 competitors analyzed daily',
            },
            {
              task: 'Trend Analysis',
              status: 'active',
              metrics: '23 active trends being tracked',
            },
          ].map((agent, idx) => (
            <div key={idx} className="p-4 bg-slate-700/50 rounded border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white">{agent.task}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-400">{agent.status}</span>
                </div>
              </div>
              <p className="text-sm text-slate-400">{agent.metrics}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
