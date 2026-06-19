import { useEffect, useState } from 'react'
import { Activity, CheckCircle2, Clock, Mail, UserRound, Users } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import ErrorMessage from '../components/ui/ErrorMessage'
import Loader from '../components/ui/Loader'
import { useAuth } from '../hooks/useAuth'
import { formatDate } from '../utils/formatDate'

const stats = [
  { label: 'Active users', value: '2,418', icon: Users },
  { label: 'Completed tasks', value: '18,340', icon: CheckCircle2 },
  { label: 'Average response', value: '1.2s', icon: Clock },
  { label: 'Service uptime', value: '99.98%', icon: Activity },
]

function Dashboard() {
  const { refreshProfile, user } = useAuth()
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    let isMounted = true

    refreshProfile()
      .catch((error) => {
        if (isMounted) {
          setProfileError(error.message)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingProfile(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [refreshProfile])

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader label="Loading profile" />
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {profileError && <ErrorMessage message={profileError} />}
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome${user?.name ? `, ${user.name}` : ''}`}
        description={`Your workspace snapshot for ${formatDate(new Date())}.`}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <span className="grid size-9 place-items-center rounded-md bg-emerald-100 text-emerald-700">
                  <Icon size={18} />
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-950">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Profile</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            { label: 'Name', value: user?.name || 'Not available', icon: UserRound },
            { label: 'Email', value: user?.email || 'Not available', icon: Mail },
            {
              label: 'Email status',
              value: user?.isEmailVerified ? 'Verified' : 'Not verified',
              icon: CheckCircle2,
            },
            { label: 'Joined', value: user?.createdAt ? formatDate(user.createdAt) : 'Not available', icon: Clock },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center gap-4 rounded-md border border-slate-200 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-slate-950 text-white">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="font-semibold text-slate-950">{item.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Authentication status</h2>
        <div className="mt-5 divide-y divide-slate-200">
          {['JWT saved after OTP verification', 'Authorization header enabled', 'Protected profile route connected'].map(
            (item) => (
              <div key={item} className="flex items-center justify-between gap-4 py-4">
                <span className="font-medium text-slate-700">{item}</span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Ready</span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  )
}

export default Dashboard
