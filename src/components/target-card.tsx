import { useState } from 'react'
import { ArrowUpRight, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { TargetState } from '@/hooks/use-speed-test'
import { useI18n } from '@/i18n/i18n-provider'
import type { MessageKey } from '@/i18n/messages'
import { latencyTier, type LatencyTier, type ProbeFailure, type SpeedTarget } from '@/lib/probe'
import { cn } from '@/lib/utils'

type StatusMeta = {
  labelKey: MessageKey
  badgeClass: string
  dotClass: string
  barClass: string
}

const STATUS: Record<'idle' | 'running' | 'error' | LatencyTier, StatusMeta> = {
  idle: {
    labelKey: 'status.idle',
    badgeClass: 'border-border text-muted-foreground',
    dotClass: 'bg-muted-foreground/40',
    barClass: 'bg-muted-foreground/30',
  },
  running: {
    labelKey: 'status.running',
    badgeClass: 'border-border bg-muted text-foreground',
    dotClass: 'animate-pulse bg-foreground/60',
    barClass: 'bg-foreground/20',
  },
  error: {
    labelKey: 'status.error',
    badgeClass:
      'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-300',
    dotClass: 'bg-rose-500',
    barClass: 'bg-rose-400',
  },
  fast: {
    labelKey: 'status.fast',
    badgeClass:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300',
    dotClass: 'bg-emerald-500',
    barClass: 'bg-emerald-500',
  },
  fair: {
    labelKey: 'status.fair',
    badgeClass:
      'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300',
    dotClass: 'bg-sky-500',
    barClass: 'bg-sky-500',
  },
  slow: {
    labelKey: 'status.slow',
    badgeClass:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300',
    dotClass: 'bg-amber-500',
    barClass: 'bg-amber-500',
  },
  poor: {
    labelKey: 'status.poor',
    badgeClass:
      'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-400/30 dark:bg-orange-400/10 dark:text-orange-300',
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

const ERROR_KEYS = {
  timeout: 'error.timeout',
  connect: 'error.connect',
  unknown: 'error.unknown',
} as const satisfies Record<ProbeFailure, MessageKey>

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
      className="size-9 shrink-0 rounded-lg border border-border/70 bg-white object-contain p-1 dark:border-white/15 dark:bg-white/10 dark:brightness-125"
      onError={() => setFailed(true)}
    />
  )
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
  const { t, locale } = useI18n()
  const status = resolveStatus(state)
  const running = state.phase === 'running'
  const latency = state.result?.ok ? Math.round(state.result.latencyMs) : null
  const width = state.result?.ok
    ? Math.min(100, Math.max(6, (state.result.latencyMs / 600) * 100))
    : 0

  let sampleText = t('card.notTested')
  if (state.phase === 'running') {
    sampleText = t('card.requesting')
  } else if (state.result && !state.result.ok) {
    sampleText = t(ERROR_KEYS[state.result.error])
  } else if (state.result?.ok) {
    sampleText = t('card.samples', {
      values: state.result.samples.map((value) => Math.round(value)).join(' / '),
    })
  }

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
            {t(status.labelKey)}
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
              <span className="text-[11px] text-muted-foreground">{target.note[locale]}</span>
            ) : null}
            {state.result?.ok && state.result.httpStatus !== undefined ? (
              <span className="text-[11px] text-muted-foreground">
                HTTP {state.result.httpStatus}
              </span>
            ) : null}
            {state.result?.ok && state.result.corsBlocked ? (
              <span className="text-[11px] text-muted-foreground">{t('card.noCors')}</span>
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
          <span className="truncate text-[11px] text-muted-foreground" title={sampleText}>
            {sampleText}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t('action.recheck')}
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
              {t('action.visit')}
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
