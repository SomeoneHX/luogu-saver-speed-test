import { Languages } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/i18n/i18n-provider'
import type { Locale } from '@/i18n/messages'
import { cn } from '@/lib/utils'

export function LocaleMenu() {
  const { locale, setLocale, t } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('menu.locale')}
        className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}
      >
        <Languages />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => setLocale(value as Locale)}
        >
          <DropdownMenuRadioItem value="zh">{t('menu.locale.zh')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">{t('menu.locale.en')}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
