import type { SpeedTarget } from '@/lib/probe'

export type TargetGroup = {
  id: string
  name: string
  description: string
  targets: SpeedTarget[]
}

export const targetGroups: TargetGroup[] = [
  {
    id: 'main',
    name: '主站入口',
    description: '洛谷保存站的多个域名，内容一致，按延迟挑一个用。',
    targets: [
      { id: 'www-luogu-me', name: 'www.luogu.me', url: 'https://www.luogu.me/', note: '主域名' },
      { id: 'www-luogu-men', name: 'www.luogu.men', url: 'https://www.luogu.men/' },
      { id: 'www-luogu-me-uk', name: 'www.luogu.me.uk', url: 'https://www.luogu.me.uk/' },
      { id: 'www-luogu-date', name: 'www.luogu.date', url: 'https://www.luogu.date/' },
      { id: 'www-luogu-com-im', name: 'www.luogu.com.im', url: 'https://www.luogu.com.im/' },
      { id: 'www-luogu-us', name: 'www.luogu.us', url: 'https://www.luogu.us/' },
    ],
  },
  {
    id: 'api',
    name: '接口服务',
    description: '保存站前端调用的后端接口，返回 JSON。',
    targets: [
      {
        id: 'api-luogu-me',
        name: 'api.luogu.me',
        url: 'https://api.luogu.me/',
        note: '开放跨域',
        mode: 'cors',
      },
    ],
  },
]

export const allTargets = targetGroups.flatMap((group) => group.targets)
