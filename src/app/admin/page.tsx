import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, Home, Users, Search } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [listings, activeListings, customers, prospects] = await Promise.all([
    supabase.from('listings').select('id', { count: 'exact', head: true }),
    supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_sold', false),
    supabase.from('customers').select('id', { count: 'exact', head: true }),
    supabase.from('prospects').select('id', { count: 'exact', head: true }),
  ])

  const stats = [
    {
      label: 'Toplam Ilan',
      count: listings.count ?? 0,
      icon: Home,
      color: 'bg-primary-100 text-primary-700',
    },
    {
      label: 'Aktif Ilan',
      count: activeListings.count ?? 0,
      icon: LayoutDashboard,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Musteriler',
      count: customers.count ?? 0,
      icon: Users,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Arayanlar',
      count: prospects.count ?? 0,
      icon: Search,
      color: 'bg-amber-100 text-amber-700',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.count}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
