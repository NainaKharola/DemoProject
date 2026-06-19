import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">404</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-950">Page not found</h1>
      <p className="mt-4 max-w-xl text-slate-600">
        The page you are looking for does not exist or has moved.
      </p>
      <Button as={Link} to="/" className="mt-8">
        Go home
      </Button>
    </section>
  )
}

export default NotFound
