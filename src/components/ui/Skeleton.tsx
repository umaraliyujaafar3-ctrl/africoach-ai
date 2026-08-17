import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      aria-busy="true"
      className={cn('animate-pulse rounded-lg bg-ink-100', className)}
      {...props}
    />
  )
}

export default Skeleton
