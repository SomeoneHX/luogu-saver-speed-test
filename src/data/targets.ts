import type { SpeedTarget } from '@/lib/probe'

export type TargetGroup = {
  id: string
  name: string
  description?: string
  targets: SpeedTarget[]
}

const SAVER_ICON = 'https://lgs-cdn.cn-nb1.rains3.com/luogu-saver/favicon.svg'
const ARCHIVE_ICON = 'https://luogu.ac.cn/favicon.png'

export const targetGroups: TargetGroup[] = [
  {
    id: 'luogu-saver',
    name: '洛谷保存站',
    description: '六个域名指向同一套前端，api.luogu.me 是它调用的接口，允许跨域。',
    targets: [
      {
        id: 'www-luogu-me',
        name: 'www.luogu.me',
        url: 'https://www.luogu.me/',
        note: '主域名',
        icon: SAVER_ICON,
      },
      { id: 'www-luogu-men', name: 'www.luogu.men', url: 'https://www.luogu.men/', icon: SAVER_ICON },
      {
        id: 'www-luogu-me-uk',
        name: 'www.luogu.me.uk',
        url: 'https://www.luogu.me.uk/',
        icon: SAVER_ICON,
      },
      {
        id: 'www-luogu-date',
        name: 'www.luogu.date',
        url: 'https://www.luogu.date/',
        icon: SAVER_ICON,
      },
      {
        id: 'www-luogu-com-im',
        name: 'www.luogu.com.im',
        url: 'https://www.luogu.com.im/',
        icon: SAVER_ICON,
      },
      { id: 'www-luogu-us', name: 'www.luogu.us', url: 'https://www.luogu.us/', icon: SAVER_ICON },
      {
        id: 'api-luogu-me',
        name: 'api.luogu.me',
        url: 'https://api.luogu.me/',
        note: '接口',
        mode: 'cors',
        icon: SAVER_ICON,
      },
    ],
  },
  {
    id: 'luogu-archive',
    name: '洛谷档案馆',
    description: '第三方存档站，收录文章、剪贴板、犇犇、陶片放逐与题解。',
    targets: [
      {
        id: 'luogu-ac-cn',
        name: 'luogu.ac.cn',
        url: 'https://luogu.ac.cn/',
        icon: ARCHIVE_ICON,
      },
    ],
  },
  {
    id: 'gengen',
    name: 'GenGen 洛谷国际',
    targets: [
      {
        id: 'gen-luogu-qzz-io',
        name: 'gen.luogu.qzz.io',
        url: 'https://gen.luogu.qzz.io/',
      },
    ],
  },
]

export const allTargets = targetGroups.flatMap((group) => group.targets)
