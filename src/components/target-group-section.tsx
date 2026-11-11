import { RefreshCw } from 'lucide-react'
import { TargetCard } from '@/components/target-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { TargetGroup } from '@/data/targets'
import type { TargetState } from '@/hooks/use-speed-test'
import { useI18n } from '@/i18n/i18n-provider'
import type { SpeedTarget } from '@/lib/probe'

export function TargetGroupSection({
  group,
  states,
  onTest,
}: {
  group: TargetGroup
  states: Record<string, TargetState>
  onTest: (targets: SpeedTarget[]) => Promise<void>
}) {
  const { t, locale } = useI18n()
  const running = group.targets.some((target) => states[target.id]?.phase === 'running')

  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-base font-semibold">
          {group.name[locale]}
          <Badge variant="secondary" className="tabular-nums">
            {group.targets.length}
          </Badge>
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          disabled={running}
          onClick={() => void onTest(group.targets)}
        >
          <RefreshCw className={running ? 'animate-spin' : undefined} />
          {running ? t('action.testing') : t('action.recheckGroup')}
        </Button>
      </div>
      {group.description ? (
        <p className="mt-1 text-sm text-muted-foreground">{group.description[locale]}</p>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {group.targets.map((target) => (
          <TargetCard
            key={target.id}
            target={target}
            state={states[target.id] ?? { phase: 'idle' }}
            onTest={() => void onTest([target])}
          />
        ))}
      </div>
    </section>
  )
}
