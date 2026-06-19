import { ArrowRight, BarChart3, LockKeyhole, Workflow } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

const features = [
  {
    title: 'Operational clarity',
    description: 'Readable dashboards, predictable navigation, and clean data boundaries for growing products.',
    icon: BarChart3,
  },
  {
    title: 'Secure foundations',
    description: 'Protected route patterns and token-aware API utilities are ready for real authentication.',
    icon: LockKeyhole,
  },
  {
    title: 'Composable workflow',
    description: 'Reusable UI, layout, services, constants, hooks, and helpers keep future work modular.',
    icon: Workflow,
  },
]

function Home() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-emerald-700">React 19 frontend</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            A production-ready starter for modern application teams.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Built with Vite, React Router, Axios, Tailwind CSS, Framer Motion, toast notifications,
            form handling, icons, and a scalable folder structure.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to="/register" size="lg" rightIcon={<ArrowRight size={18} />}>
              Start now
            </Button>
            <Button as={Link} to="/dashboard" variant="outline" size="lg">
              View dashboard
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">System status</p>
              <h2 className="text-xl font-semibold text-slate-950">Launch readiness</h2>
            </div>
            <span className="rounded-md bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Live</span>
          </div>
          <div className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex gap-4 rounded-md border border-slate-200 p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-slate-950 text-white">
                    <Icon size={19} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-950">{feature.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Home
