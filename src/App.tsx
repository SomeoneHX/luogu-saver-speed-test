import { useEffect } from 'react'
import { RefreshCw, Square, Waypoints } from 'lucide-react'
import { LocaleMenu } from '@/components/locale-menu'
import { Stat } from '@/components/stat'
import { TargetGroupSection } from '@/components/target-group-section'
import { ThemeMenu } from '@/components/theme-menu'
import { Button } from '@/components/ui/button'
import { allTargets, targetGroups } from '@/data/targets'
import { useSpeedTest } from '@/hooks/use-speed-test'
import { useI18n } from '@/i18n/i18n-provider'

function App() {
  const { t, locale } = useI18n()
  const { states, runTargets, runAll, stop, isRunning, summary, lastRunAt } =
    useSpeedTest(allTargets)

  useEffect(() => {
    void runAll()
  }, [runAll])

  const formatClock = (date: Date | null) => {
    if (!date) return '—'
    return date.toLocaleTimeString(locale === 'zh' ? 'zh-CN' : 'en-US', { hour12: false })
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <header>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-muted-foreground">
                <Waypoints className="size-3.5" />
                {t('app.eyebrow')}
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {t('app.title')}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <LocaleMenu />
              <ThemeMenu />
            </div>
          </div>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-pretty text-muted-foreground">
            {t('app.description')}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button onClick={() => void runAll()} disabled={isRunning}>
              <RefreshCw className={isRunning ? 'animate-spin' : undefined} />
              {isRunning ? t('action.testing') : t('action.recheckAll')}
            </Button>
            {isRunning ? (
              <Button variant="outline" onClick={stop}>
                <Square />
                {t('action.stop')}
              </Button>
            ) : null}
            <span className="ml-1 text-xs text-muted-foreground">
              {lastRunAt ? t('app.lastRun', { time: formatClock(lastRunAt) }) : t('app.firstRun')}
            </span>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            label={t('stat.reachable')}
            value={`${summary.reachable} / ${summary.total}`}
            hint={
              summary.unreachable > 0
                ? t('stat.unreachable', { count: summary.unreachable })
                : t('stat.allReachable')
            }
          />
          <Stat
            label={t('stat.fastest')}
            value={summary.fastest ? `${Math.round(summary.fastest.latencyMs)} ms` : '—'}
            hint={summary.fastest?.name}
          />
          <Stat
            label={t('stat.average')}
            value={summary.average ? `${Math.round(summary.average)} ms` : '—'}
            hint={summary.tested > 0 ? t('stat.tested', { count: summary.tested }) : undefined}
          />
          <Stat
            label={t('stat.updated')}
            value={formatClock(lastRunAt)}
            hint={t('stat.localTime')}
          />
        </div>

        <main className="mt-12 space-y-12">
          {targetGroups.map((group) => (
            <TargetGroupSection
              key={group.id}
              group={group}
              states={states}
              onTest={runTargets}
            />
          ))}
        </main>

        <footer className="mt-16 border-t border-border/70 pt-6 text-xs leading-relaxed text-muted-foreground">
          <p>{t('footer.measure')}</p>
          <p className="mt-2">{t('footer.cors')}</p>
          <p className="mt-2">{t('footer.cache')}</p>
        </footer>
      </div>
    </div>
  )
}

export default App
