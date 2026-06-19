import { LayoutDashboard, LogOut, Menu, ShieldCheck, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Button from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { APP_NAME } from '../../constants/app'
import { cx } from '../../utils/cx'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const navLinks = isAuthenticated
    ? [
        { label: 'Home', to: '/' },
        { label: 'Dashboard', to: '/dashboard' },
      ]
    : [{ label: 'Home', to: '/' }]

  const linkClass = ({ isActive }) =>
    cx(
      'rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950',
      isActive && 'bg-white text-slate-950 shadow-sm',
    )

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-50/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-950">
          <span className="grid size-9 place-items-center rounded-lg bg-slate-950 text-white">
            <ShieldCheck size={20} />
          </span>
          <span>{APP_NAME}</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={logout} leftIcon={<LogOut size={16} />}>
              Sign out
            </Button>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Login
              </Button>
              <Button as={Link} to="/register" size="sm" leftIcon={<LayoutDashboard size={16} />}>
                Create account
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} onClick={() => setIsOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <Button variant="ghost" onClick={logout} leftIcon={<LogOut size={16} />}>
                Sign out
              </Button>
            ) : (
              <div className="grid gap-2 pt-2">
                <Button as={Link} to="/login" variant="ghost">
                  Login
                </Button>
                <Button as={Link} to="/register">
                  Create account
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
