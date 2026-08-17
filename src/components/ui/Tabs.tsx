import { useState, useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface Tab {
  id: string
  label: string
  icon?: ReactNode
}

export interface TabsProps {
  tabs: Tab[]
  defaultValue?: string
  value?: string
  onChange?: (id: string) => void
  children?: ReactNode
  className?: string
  ariaLabel?: string
}

export function Tabs({ tabs, defaultValue, value, onChange, className, ariaLabel }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? tabs[0]?.id)
  const id = useId()
  const active = value ?? internal

  const select = (tabId: string) => {
    setInternal(tabId)
    onChange?.(tabId)
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={ariaLabel ?? 'Tabs'}
        className="flex gap-1 border-b border-ink-100"
      >
        {tabs.map((tab) => {
          const selected = tab.id === active
          return (
            <button
              key={tab.id}
              role="tab"
              id={`${id}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(e) => {
                const idx = tabs.findIndex((t) => t.id === tab.id)
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  e.preventDefault()
                  const next = e.key === 'ArrowRight' ? idx + 1 : idx - 1
                  const target = tabs[(next + tabs.length) % tabs.length]
                  select(target.id)
                  document.getElementById(`${id}-tab-${target.id}`)?.focus()
                }
              }}
              className={cn(
                'inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrise-500/40',
                selected
                  ? 'border-sunrise-500 text-sunrise-700'
                  : 'border-transparent text-ink-500 hover:border-ink-200 hover:text-ink-800',
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function TabPanel({
  id,
  tabId,
  activeTab,
  children,
  className,
}: {
  id: string
  tabId: string
  activeTab: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      role="tabpanel"
      id={`${id}-panel-${tabId}`}
      aria-labelledby={`${id}-tab-${tabId}`}
      hidden={activeTab !== tabId}
      className={cn('pt-5', className)}
    >
      {children}
    </div>
  )
}

export default Tabs
