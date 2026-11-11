import { RefreshCw } from 'lucide-react'
import { TargetCard } from '@/components/target-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { TargetGroup } from '@/data/targets'
import type { TargetState } from '@/hooks/use-speed-test'
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
  const running = group.targets.some((target) => states[target.id]?.phase === 'running')

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold">
            {group.name}
            <Badge variant="secondary" className="tabular-nums">
              {group.targets.length}
            </Badge>
          </h2>
          {group.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
          ) : null}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={running}
          onClick={() => void onTest(group.targets)}
        >
          <RefreshCw className={running ? 'animate-spin' : undefined} />
          测这组
        </Button>
      </div>

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
