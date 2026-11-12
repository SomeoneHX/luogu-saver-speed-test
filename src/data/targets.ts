import type { Localized } from '@/lib/localized'
import type { SpeedTarget } from '@/lib/probe'

export type TargetGroup = {
  id: string
  name: Localized
  description?: Localized
  targets: SpeedTarget[]
}

const SAVER_ICON = 'https://lgs-cdn.cn-nb1.rains3.com/luogu-saver/favicon.svg'
const ARCHIVE_ICON = 'https://luogu.ac.cn/favicon.png'

export const targetGroups: TargetGroup[] = [
  {
    id: 'luogu-saver',
    name: { zh: '洛谷保存站', en: 'Luogu Saver' },
    description: {
      zh: '六个域名指向同一套前端，api.luogu.me 是它调用的接口，允许跨域。',
      en: 'Six domains serve the same frontend; api.luogu.me is the JSON API behind it, with CORS enabled.',
    },
    targets: [
      {
        id: 'www-luogu-me',
        name: 'www.luogu.me',
        url: 'https://www.luogu.me/',
        note: { zh: '主域名', en: 'Primary' },
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
        note: { zh: '接口', en: 'API' },
        mode: 'cors',
        icon: SAVER_ICON,
      },
    ],
  },
  {
    id: 'luogu-archive',
    name: { zh: '洛谷档案馆', en: 'Luogu Archive' },
    description: {
      zh: '第三方存档站，收录文章、剪贴板、犇犇、陶片放逐与题解。主站为 luogu.ac.cn，preview 为新前端，shadcn 与 fluent 为社区界面方案。',
      en: 'Third-party archive of articles, pastes, feeds, banishments and solutions. luogu.ac.cn is the main site, preview the rewritten frontend, shadcn and fluent the community UI proposals.',
    },
    targets: [
      {
        id: 'luogu-ac-cn',
        name: 'luogu.ac.cn',
        url: 'https://luogu.ac.cn/',
        icon: ARCHIVE_ICON,
      },
      {
        id: 'preview-luogu-ac-cn',
        name: 'preview.luogu.ac.cn',
        url: 'https://preview.luogu.ac.cn/',
        note: { zh: '新前端公测', en: 'New frontend beta' },
        icon: ARCHIVE_ICON,
      },
      {
        id: 'shadcn-luogu-ac-cn',
        name: 'shadcn.luogu.ac.cn',
        url: 'https://shadcn.luogu.ac.cn/',
        note: { zh: '社区方案 · SomeoneHX', en: 'Community · SomeoneHX' },
        icon: ARCHIVE_ICON,
      },
      {
        id: 'fluent-luogu-ac-cn',
        name: 'fluent.luogu.ac.cn',
        url: 'https://fluent.luogu.ac.cn/',
        note: { zh: '社区方案 · liyifan202201', en: 'Community · liyifan202201' },
        icon: ARCHIVE_ICON,
      },
    ],
  },
]

export const allTargets = targetGroups.flatMap((group) => group.targets)
