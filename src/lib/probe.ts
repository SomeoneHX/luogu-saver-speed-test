export type ProbeMode = 'cors' | 'no-cors'

export type SpeedTarget = {
  id: string
  /** 展示用的名称，通常是域名 */
  name: string
  /** 点击跳转与测速请求的地址 */
  url: string
  /** 卡片上的一句备注 */
  note?: string
  /**
   * cors：能读到真实 HTTP 状态码，需要对方返回跨域头
   * no-cors：只能确认网络层可达，响应内容不透明
   */
  mode?: ProbeMode
}

export type ProbeResult =
  | {
      ok: true
      latencyMs: number
      samples: number[]
      httpStatus?: number
      corsBlocked: boolean
    }
  | {
      ok: false
      latencyMs: null
      samples: number[]
      error: string
    }

export class ProbeCancelled extends Error {
  constructor() {
    super('测速已取消')
    this.name = 'ProbeCancelled'
  }
}

const ATTEMPTS = 3
const ATTEMPT_TIMEOUT_MS = 8000

function withCacheBuster(rawUrl: string): string {
  const url = new URL(rawUrl)
  url.searchParams.set('_probe', Date.now().toString(36))
  return url.toString()
}

/** 单次请求，返回从发起到收到响应头的耗时 */
async function probeOnce(
  url: string,
  mode: ProbeMode,
  signal: AbortSignal | undefined,
): Promise<{ latencyMs: number; httpStatus?: number }> {
  if (signal?.aborted) throw new ProbeCancelled()

  const controller = new AbortController()
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort)
  const timer = setTimeout(abort, ATTEMPT_TIMEOUT_MS)

  const startedAt = performance.now()
  try {
    const response = await fetch(withCacheBuster(url), {
      mode,
      cache: 'no-store',
      credentials: 'omit',
      redirect: 'follow',
      signal: controller.signal,
    })
    const latencyMs = performance.now() - startedAt
    const opaque = response.type === 'opaque' || response.type === 'opaqueredirect'
    return { latencyMs, httpStatus: opaque ? undefined : response.status }
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
  }
}

function describeFailure(error: unknown): string {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return `超过 ${ATTEMPT_TIMEOUT_MS / 1000} 秒没有响应`
  }
  if (error instanceof TypeError) {
    return '连接失败，域名解析、证书或网络可能有问题'
  }
  if (error instanceof Error && error.message) return error.message
  return '未知错误'
}

/** 串行测三次，取最快的一次作为延迟 */
export async function probeTarget(
  target: SpeedTarget,
  signal?: AbortSignal,
): Promise<ProbeResult> {
  const mode: ProbeMode = target.mode ?? 'no-cors'
  const samples: number[] = []
  let httpStatus: number | undefined
  let failure: unknown

  for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
    if (signal?.aborted) throw new ProbeCancelled()
    try {
      const sample = await probeOnce(target.url, mode, signal)
      samples.push(sample.latencyMs)
      if (sample.httpStatus !== undefined) httpStatus = sample.httpStatus
    } catch (error) {
      if (signal?.aborted) throw new ProbeCancelled()
      failure = error
    }
  }

  if (samples.length > 0) {
    return {
      ok: true,
      latencyMs: Math.min(...samples),
      samples,
      httpStatus,
      corsBlocked: false,
    }
  }

  // 跨域被拒时退回不透明请求，至少判断网络层是否通
  if (mode === 'cors') {
    try {
      if (signal?.aborted) throw new ProbeCancelled()
      const sample = await probeOnce(target.url, 'no-cors', signal)
      return {
        ok: true,
        latencyMs: sample.latencyMs,
        samples: [sample.latencyMs],
        httpStatus: undefined,
        corsBlocked: true,
      }
    } catch (error) {
      if (signal?.aborted) throw new ProbeCancelled()
      failure = error
    }
  }

  return { ok: false, latencyMs: null, samples, error: describeFailure(failure) }
}

export type LatencyTier = 'fast' | 'fair' | 'slow' | 'poor'

export function latencyTier(ms: number): LatencyTier {
  if (ms < 200) return 'fast'
  if (ms < 400) return 'fair'
  if (ms < 800) return 'slow'
  return 'poor'
}
