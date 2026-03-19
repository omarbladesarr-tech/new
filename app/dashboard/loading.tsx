import { Card } from '@/components/ui/card'

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-9 w-48 bg-slate-700 rounded animate-pulse" />
        <div className="h-5 w-64 bg-slate-700/50 rounded animate-pulse mt-2" />
      </div>

      {/* Stats Grid Skeleton */}
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

      {/* Main Content Skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700 p-6">
          <div className="h-6 w-32 bg-slate-700 rounded animate-pulse mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded border border-slate-600"
              >
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-slate-600 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-slate-600/50 rounded animate-pulse" />
                </div>
                <div className="h-4 w-16 bg-slate-600 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="h-6 w-28 bg-slate-700 rounded animate-pulse mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-10 bg-slate-700/50 rounded animate-pulse" />
            ))}
          </div>
        </Card>
      </div>

      {/* Loading Indicator */}
      <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-3 shadow-lg">
        <div className="h-4 w-4 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-slate-300 text-sm">Loading dashboard...</span>
      </div>
    </div>
  )
}
