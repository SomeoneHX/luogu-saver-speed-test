import { useCallback, useMemo, useRef, useState } from 'react'
import {
  ProbeCancelled,
  probeTarget,
  type ProbeResult,
  type SpeedTarget,
} from '@/lib/probe'

export type TargetState = {
  phase: 'idle' | 'running' | 'done'
  result?: ProbeResult
}

const IDLE: TargetState = { phase: 'idle' }

export function useSpeedTest(targets: SpeedTarget[]) {
  const [states, setStates] = useState<Record<string, TargetState>>({})
  const [lastRunAt, setLastRunAt] = useState<Date | null>(null)
  const controllers = useRef(new Map<string, AbortController>())

  const runTargets = useCallback(async (list: SpeedTarget[]) => {
    const pending = list.filter((target) => !controllers.current.has(target.id))
    if (pending.length === 0) return

    setStates((prev) => {
      const next = { ...prev }
      for (const target of pending) next[target.id] = { phase: 'running' }
      return next
    })

    await Promise.all(
      pending.map(async (target) => {
        const controller = new AbortController()
        controllers.current.set(target.id, controller)
        try {
          const result = await probeTarget(target, controller.signal)
          setStates((prev) => ({
            ...prev,
            [target.id]: { phase: 'done', result },
          }))
        } catch (error) {
          if (error instanceof ProbeCancelled) {
            setStates((prev) => ({ ...prev, [target.id]: IDLE }))
          } else {
            setStates((prev) => ({
              ...prev,
              [target.id]: {
                phase: 'done',
                result: { ok: false, latencyMs: null, samples: [], error: '测速失败' },
              },
            }))
          }
        } finally {
          controllers.current.delete(target.id)
        }
      }),
    )

    setLastRunAt(new Date())
  }, [])

  const runAll = useCallback(() => runTargets(targets), [runTargets, targets])

  const stop = useCallback(() => {
    for (const controller of controllers.current.values()) controller.abort()
  }, [])

  const isRunning = useMemo(
    () => Object.values(states).some((state) => state.phase === 'running'),
    [states],
  )

  const summary = useMemo(() => {
    const reachable: { name: string; latencyMs: number }[] = []
    let tested = 0

    for (const target of targets) {
      const result = states[target.id]?.result
      if (!result) continue
      tested += 1
      if (result.ok) reachable.push({ name: target.name, latencyMs: result.latencyMs })
    }

    const fastest = reachable.reduce<{ name: string; latencyMs: number } | null>(
      (best, item) => (best === null || item.latencyMs < best.latencyMs ? item : best),
      null,
    )
    const average =
      reachable.length > 0
        ? reachable.reduce((sum, item) => sum + item.latencyMs, 0) / reachable.length
        : null

    return {
      total: targets.length,
      tested,
      reachable: reachable.length,
      unreachable: tested - reachable.length,
      fastest,
      average,
    }
  }, [states, targets])

  return { states, runTargets, runAll, stop, isRunning, summary, lastRunAt }
}
