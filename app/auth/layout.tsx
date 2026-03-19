import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">AI Business Hub</h1>
            <p className="text-slate-400 text-sm mt-2">Automated E-Commerce Management System</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
