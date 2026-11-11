export function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/30 px-4 py-3">
      <div className="text-[11px] font-medium tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 truncate text-xs text-muted-foreground">{hint ?? '\u00a0'}</div>
    </div>
  )
}
