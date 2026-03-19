import { Card } from '@/components/ui/card'

export default function ApprovalsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-8 w-40 bg-slate-700 rounded animate-pulse" />
        <div className="h-4 w-72 bg-slate-700/50 rounded animate-pulse mt-2" />
      </div>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-slate-800 border-slate-700 p-4">
            <div className="h-4 w-28 bg-slate-700 rounded animate-pulse mb-2" />
            <div className="h-8 w-12 bg-slate-700 rounded animate-pulse" />
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="h-6 w-36 bg-slate-700 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-slate-700/50 rounded animate-pulse" />
            ))}
          </div>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="h-6 w-40 bg-slate-700 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-slate-700/50 rounded animate-pulse" />
            ))}
          </div>
        </Card>
      </div>
      <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-3 shadow-lg">
        <div className="h-4 w-4 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-slate-300 text-sm">Loading approvals...</span>
      </div>
    </div>
  )
}
