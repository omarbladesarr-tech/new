import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-white">AI Business Hub</div>
            <div className="flex gap-4">
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
            Automated E-Commerce & Dropshipping Platform
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto text-balance">
            Powered by advanced AI agents. Automate product listings, order fulfillment, customer service, marketing, and market research all from one platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {[
            {
              title: 'AI Agent Orchestration',
              description: 'Master orchestrator coordinating 6 specialized agents for all business operations',
              icon: '🤖',
            },
            {
              title: 'Product Management',
              description: 'Automated product listing and inventory management across multiple suppliers',
              icon: '📦',
            },
            {
              title: 'Order Fulfillment',
              description: 'Real-time order processing and fulfillment with automatic supplier coordination',
              icon: '⚡',
            },
            {
              title: 'Customer Support',
              description: 'AI-powered customer service with human oversight and ticket management',
              icon: '💬',
            },
            {
              title: 'Smart Marketing',
              description: 'Automated campaign creation and email marketing with analytics',
              icon: '📈',
            },
            {
              title: 'Market Research',
              description: 'Real-time market insights, competitor analysis, and trend detection',
              icon: '🔍',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Architecture Overview */}
        <div className="mt-20 bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-6">System Architecture</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Master Agent</h3>
              <p className="text-slate-400 mb-4">
                Central orchestrator coordinating all operations, managing task distribution, and ensuring seamless collaboration across specialized agents.
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>✓ Task Distribution & Coordination</li>
                <li>✓ Performance Monitoring</li>
                <li>✓ Resource Allocation</li>
                <li>✓ Human Oversight Integration</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Specialized Agents</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div>📦 Order Fulfillment Agent</div>
                <div>💬 Customer Service Agent</div>
                <div>📝 Product Listing Agent</div>
                <div>📢 Marketing Agent</div>
                <div>🔍 Research Agent</div>
                <div>🛠️ Tool Creation Agent</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
