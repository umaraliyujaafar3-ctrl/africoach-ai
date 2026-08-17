import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  Mic2,
  Settings,
  User,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import Logo from '@/components/Logo'
import ToastViewport from '@/components/ToastViewport'
import { Avatar } from '@/components/ui'
import { cn } from '@/lib/cn'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/interview/setup', label: 'Practice Interview', icon: Mic2 },
  { to: '/career-assistant', label: 'Career Assistant', icon: MessagesSquare },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/interview/setup': 'Practice Interview',
  '/career-assistant': 'Career Assistant',
  '/history': 'History',
  '/settings': 'Settings',
}

export function AppLayout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const title = titles[location.pathname] ?? 'AfriCoach AI'

  const closeMobile = () => setMobileOpen(false)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="flex min-h-screen bg-ink-50/50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lift"
      >
        Skip to main content
      </a>
      <aside
        className={cn(
          'sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-ink-100 bg-white transition-all duration-300 lg:flex',
          collapsed ? 'w-16' : 'w-60',
        )}
      >
        <div className={cn('flex h-16 items-center border-b border-ink-100', collapsed ? 'justify-center px-2' : 'px-5')}>
          <NavLink to="/dashboard" aria-label="AfriCoach AI">
            <SidebarLogo collapsed={collapsed} />
          </NavLink>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <SidebarNav collapsed={collapsed} onNavigate={closeMobile} />
        </nav>
        <SidebarToggle collapsed={collapsed} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar key={location.pathname} title={title} onOpenMobile={() => setMobileOpen(true)} />

        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>

      <ToastViewport />

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink-950/50 backdrop-blur-sm lg:hidden"
              onClick={closeMobile}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 400, damping: 36 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lift lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-ink-100 px-5">
                <Logo />
                <button
                  type="button"
                  onClick={closeMobile}
                  aria-label="Close menu"
                  className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-50"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                <SidebarNav collapsed={false} onNavigate={closeMobile} />
              </nav>
              <MobileLogout />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function SidebarLogo({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sunrise-400 to-sunrise-600 text-white">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 3C7.03 3 3 6.58 3 11c0 2.4 1.16 4.56 3 6.06V19a1 1 0 0 0 1.63.78L10 18h4l2.37 1.78A1 1 0 0 0 18 19v-1.94c1.84-1.5 3-3.66 3-6.06 0-4.42-4.03-8-9-8Z"
            fill="currentColor"
          />
        </svg>
      </span>
    )
  }
  return <Logo />
}

function SidebarNav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          aria-label={item.label}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              collapsed && 'justify-center px-2',
              isActive
                ? 'bg-sunrise-50 text-sunrise-700'
                : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900',
            )
          }
        >
          <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </NavLink>
      ))}
    </>
  )
}

function SidebarToggle({ collapsed }: { collapsed: boolean }) {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  return (
    <div className="border-t border-ink-100 p-3">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="flex w-full items-center justify-center rounded-lg py-2 text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrise-500/50"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </div>
  )
}

function TopBar({ title, onOpenMobile }: { title: string; onOpenMobile: () => void }) {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-ink-100 bg-white/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenMobile}
        aria-label="Open navigation menu"
        className="rounded-lg p-2 text-ink-600 hover:bg-ink-50 lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      <h1 className="flex-1 truncate font-display text-lg font-bold text-ink-900">{title}</h1>

      <button
        type="button"
        aria-label="Notifications"
        className="relative rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-sunrise-500" />
      </button>

      <div
        ref={profileRef}
        onMouseDown={(e) => {
          if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
            setProfileOpen(false)
          }
        }}
        className="relative"
      >
        <button
          type="button"
          onClick={() => setProfileOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={profileOpen}
          aria-label="Account menu"
          className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-ink-50"
        >
          <Avatar name={user?.name ?? 'Guest'} src={user?.avatar} size="sm" />
        </button>
        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              role="menu"
              className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-lift"
            >
              <div className="border-b border-ink-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-ink-900">{user?.name ?? 'Guest'}</p>
                <p className="truncate text-xs text-ink-500">{user?.email}</p>
              </div>
              <div className="p-1.5">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => navigate('/settings')}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-ink-50"
                >
                  <User className="h-4 w-4" aria-hidden="true" /> Profile
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => navigate('/settings')}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-ink-50"
                >
                  <Settings className="h-4 w-4" aria-hidden="true" /> Settings
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

function MobileLogout() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  return (
    <div className="border-t border-ink-100 p-4">
      <button
        type="button"
        onClick={() => {
          logout()
          navigate('/login', { replace: true })
        }}
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
      </button>
    </div>
  )
}

export default AppLayout
