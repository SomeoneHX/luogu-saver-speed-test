import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'

type ThemeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'luogu-speed-theme'

function prefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function readStoredMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
}

function applyMode(mode: ThemeMode) {
  const dark = mode === 'dark' || (mode === 'system' && prefersDark())
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(readStoredMode)

  useEffect(() => {
    applyMode(mode)
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  useEffect(() => {
    if (mode !== 'system') return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyMode('system')
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [mode])

  const value = useMemo(() => ({ mode, setMode }), [mode])

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
