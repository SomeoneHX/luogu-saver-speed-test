import { useEffect } from 'react'
import { RefreshCw, Square, Waypoints } from 'lucide-react'
import { Stat } from '@/components/stat'
import { TargetGroupSection } from '@/components/target-group-section'
import { Button } from '@/components/ui/button'
import { allTargets, targetGroups } from '@/data/targets'
import { useSpeedTest } from '@/hooks/use-speed-test'

function formatClock(date: Date | null): string {
  if (!date) return '—'
  return date.toLocaleTimeString('zh-CN', { hour12: false })
}

function App() {
  const { states, runTargets, runAll, stop, isRunning, summary, lastRunAt } =
    useSpeedTest(allTargets)

  useEffect(() => {
    void runAll()
  }, [runAll])

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <header>
          <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-muted-foreground">
            <Waypoints className="size-3.5" />
            连通性测速
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            洛谷保存站域名测速
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-pretty text-muted-foreground">
            请求由你的浏览器直接发往各个域名，每个地址连续测三次取最快的一次。结果只代表你此刻的网络状况。
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button onClick={() => void runAll()} disabled={isRunning}>
              <RefreshCw className={isRunning ? 'animate-spin' : undefined} />
              {isRunning ? '测速中…' : '全部重测'}
            </Button>
            {isRunning ? (
              <Button variant="outline" onClick={stop}>
                <Square />
                停止
              </Button>
            ) : null}
            <span className="ml-1 text-xs text-muted-foreground">
              {lastRunAt ? `上次完成 ${formatClock(lastRunAt)}` : '正在发起首次测速'}
            </span>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            label="可达"
            value={`${summary.reachable} / ${summary.total}`}
            hint={summary.unreachable > 0 ? `${summary.unreachable} 个不通` : '全部可达'}
          />
          <Stat
            label="最快"
            value={summary.fastest ? `${Math.round(summary.fastest.latencyMs)} ms` : '—'}
            hint={summary.fastest?.name}
          />
          <Stat
            label="平均"
            value={summary.average ? `${Math.round(summary.average)} ms` : '—'}
            hint={summary.tested > 0 ? `已完成 ${summary.tested} 个` : undefined}
          />
          <Stat label="更新于" value={formatClock(lastRunAt)} hint="本地时间" />
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
          <p>
            每个地址发出的是一条带随机参数的 GET 请求，记录从发起到收到响应头的时间，所以这里测的是网络往返加服务端首字节，不含页面资源加载。
          </p>
          <p className="mt-2">
            主站没有开放跨域头，浏览器拿不到响应内容，只能确认连接已经建立；api.luogu.me 开放了跨域，卡片上会显示真实 HTTP 状态。
          </p>
          <p className="mt-2">连接复用和 CDN 缓存会让重复测试变快，个别数字波动较大时看整体趋势。</p>
        </footer>
      </div>
    </div>
  )
}

export default App
