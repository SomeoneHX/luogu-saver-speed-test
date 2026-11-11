import { useState } from 'react'
import { ArrowUpRight, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { TargetState } from '@/hooks/use-speed-test'
import { latencyTier, type LatencyTier, type SpeedTarget } from '@/lib/probe'
import { cn } from '@/lib/utils'

type StatusMeta = {
  label: string
  badgeClass: string
  dotClass: string
  barClass: string
}

const STATUS: Record<'idle' | 'running' | 'error' | LatencyTier, StatusMeta> = {
  idle: {
    label: '待测',
    badgeClass: 'border-border text-muted-foreground',
    dotClass: 'bg-muted-foreground/40',
    barClass: 'bg-muted-foreground/30',
  },
  running: {
    label: '测速中',
    badgeClass: 'border-border bg-muted text-foreground',
    dotClass: 'animate-pulse bg-foreground/60',
    barClass: 'bg-foreground/20',
  },
  error: {
    label: '不通',
    badgeClass: 'border-rose-200 bg-rose-50 text-rose-700',
    dotClass: 'bg-rose-500',
    barClass: 'bg-rose-400',
  },
  fast: {
    label: '畅通',
    badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dotClass: 'bg-emerald-500',
    barClass: 'bg-emerald-500',
  },
  fair: {
    label: '正常',
    badgeClass: 'border-sky-200 bg-sky-50 text-sky-700',
    dotClass: 'bg-sky-500',
    barClass: 'bg-sky-500',
  },
  slow: {
    label: '偏慢',
    badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
    dotClass: 'bg-amber-500',
    barClass: 'bg-amber-500',
  },
  poor: {
    label: '很慢',
    badgeClass: 'border-orange-200 bg-orange-50 text-orange-700',
    dotClass: 'bg-orange-500',
    barClass: 'bg-orange-500',
  },
}

function resolveStatus(state: TargetState): StatusMeta {
  if (state.phase === 'running') return STATUS.running
  if (!state.result) return STATUS.idle
  if (!state.result.ok) return STATUS.error
  return STATUS[latencyTier(state.result.latencyMs)]
}

function TargetIcon({ target }: { target: SpeedTarget }) {
  const [failed, setFailed] = useState(false)
  const src = target.icon ?? `${new URL(target.url).origin}/favicon.ico`
  const initial = target.name.replace(/^www\./, '').charAt(0).toUpperCase()

  if (failed) {
    return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted text-xs font-semibold text-muted-foreground">
        {initial}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      width={36}
      height={36}
      className="size-9 shrink-0 rounded-lg border border-border/70 bg-background object-contain p-1"
      onError={() => setFailed(true)}
    />
  )
}

function describeSamples(state: TargetState): string {
  if (state.phase === 'running') return '正在请求…'
  if (!state.result) return '尚未测速'
  if (!state.result.ok) return state.result.error
  const samples = state.result.samples.map((value) => Math.round(value)).join(' / ')
  return `三次采样 ${samples} ms`
}

export function TargetCard({
  target,
  state,
  onTest,
}: {
  target: SpeedTarget
  state: TargetState
  onTest: () => void
}) {
  const status = resolveStatus(state)
  const running = state.phase === 'running'
  const latency = state.result?.ok ? Math.round(state.result.latencyMs) : null
  const width = state.result?.ok
    ? Math.min(100, Math.max(6, (state.result.latencyMs / 600) * 100))
    : 0

  return (
    <Card className="h-full justify-between gap-3 shadow-none">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <TargetIcon target={target} />
            <div className="min-w-0">
              <div className="truncate font-mono text-sm font-medium">{target.name}</div>
              <a
                href={target.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-0.5 inline-flex max-w-full items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                <span className="truncate">{target.url}</span>
                <ArrowUpRight className="size-3 shrink-0" />
              </a>
            </div>
          </div>
          <Badge variant="outline" className={cn('gap-1.5', status.badgeClass)}>
            <span className={cn('size-1.5 rounded-full', status.dotClass)} />
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl leading-none font-semibold tracking-tight tabular-nums">
              {latency ?? '—'}
            </span>
            <span className="text-sm text-muted-foreground">ms</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            {target.note ? (
              <span className="text-[11px] text-muted-foreground">{target.note}</span>
            ) : null}
            {state.result?.ok && state.result.httpStatus !== undefined ? (
              <span className="text-[11px] text-muted-foreground">
                HTTP {state.result.httpStatus}
              </span>
            ) : null}
            {state.result?.ok && state.result.corsBlocked ? (
              <span className="text-[11px] text-muted-foreground">无跨域头</span>
            ) : null}
          </div>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              'h-full rounded-full transition-[width] duration-500 ease-out',
              status.barClass,
            )}
            style={{ width: `${width}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <span
            className="truncate text-[11px] text-muted-foreground"
            title={describeSamples(state)}
          >
            {describeSamples(state)}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="重新测速"
              disabled={running}
              onClick={onTest}
            >
              <RefreshCw className={running ? 'animate-spin' : undefined} />
            </Button>
            <a
              href={target.url}
              target="_blank"
              rel="noreferrer noopener"
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              访问
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
