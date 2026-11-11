import { Monitor, Moon, Sun } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/i18n/i18n-provider'
import { cn } from '@/lib/utils'
import { useTheme, type ThemeMode } from '@/theme/theme-provider'

const ICONS = {
  system: Monitor,
  light: Sun,
  dark: Moon,
} as const

export function ThemeMenu() {
  const { mode, setMode } = useTheme()
  const { t } = useI18n()
  const Icon = ICONS[mode]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('menu.theme')}
        className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}
      >
        <Icon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuRadioGroup
          value={mode}
          onValueChange={(value) => setMode(value as ThemeMode)}
        >
          <DropdownMenuRadioItem value="system">
            <Monitor />
            {t('menu.theme.system')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <Sun />
            {t('menu.theme.light')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon />
            {t('menu.theme.dark')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
