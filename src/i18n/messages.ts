import type { Locale } from '@/lib/localized'

export type { Locale, Localized } from '@/lib/localized'

const zh = {
  'app.eyebrow': '连通性测速',
  'app.title': '洛谷第三方站点连通性测速',
  'app.description':
    '请求由你的浏览器直接发往各个域名，每个地址连续测三次取最快的一次。结果只代表你此刻的网络状况。',
  'app.firstRun': '正在发起首次测速',
  'app.lastRun': '上次完成 {time}',

  'action.recheckAll': '全部重测',
  'action.testing': '测速中…',
  'action.stop': '停止',
  'action.recheckGroup': '测这组',
  'action.recheck': '重新测速',
  'action.visit': '访问',

  'stat.reachable': '可达',
  'stat.fastest': '最快',
  'stat.average': '平均',
  'stat.updated': '更新于',
  'stat.localTime': '本地时间',
  'stat.allReachable': '全部可达',
  'stat.unreachable': '{count} 个不通',
  'stat.tested': '已完成 {count} 个',

  'status.idle': '待测',
  'status.running': '测速中',
  'status.fast': '畅通',
  'status.fair': '正常',
  'status.slow': '偏慢',
  'status.poor': '很慢',
  'status.error': '不通',

  'card.requesting': '正在请求…',
  'card.notTested': '尚未测速',
  'card.samples': '三次采样 {values} ms',
  'card.noCors': '无跨域头',

  'error.timeout': '请求超时，没有响应',
  'error.connect': '连接失败，域名解析、证书或网络可能有问题',
  'error.unknown': '未知错误',

  'footer.measure':
    '每个地址发出的是一条带随机参数的 GET 请求，记录从发起到收到响应头的时间，所以这里测的是网络往返加服务端首字节，不含页面资源加载。',
  'footer.cors':
    '保存站的域名没有开放跨域头，浏览器拿不到响应内容，只能确认连接已经建立；api.luogu.me 开放了跨域，卡片上会显示真实 HTTP 状态。',
  'footer.cache': '连接复用和 CDN 缓存会让重复测试变快，个别数字波动较大时看整体趋势。',

  'menu.theme': '主题',
  'menu.theme.system': '跟随系统',
  'menu.theme.light': '浅色',
  'menu.theme.dark': '深色',
  'menu.locale': '语言',
  'menu.locale.zh': '简体中文',
  'menu.locale.en': 'English',
}

export type MessageKey = keyof typeof zh

const en: Record<MessageKey, string> = {
  'app.eyebrow': 'Connectivity check',
  'app.title': 'Luogu third-party site latency',
  'app.description':
    'Requests go straight from this browser to each domain, three times in a row, and the fastest run counts. Results describe your network right now.',
  'app.firstRun': 'Running the first check',
  'app.lastRun': 'Last run {time}',

  'action.recheckAll': 'Recheck all',
  'action.testing': 'Testing…',
  'action.stop': 'Stop',
  'action.recheckGroup': 'Recheck group',
  'action.recheck': 'Recheck',
  'action.visit': 'Open',

  'stat.reachable': 'Reachable',
  'stat.fastest': 'Fastest',
  'stat.average': 'Average',
  'stat.updated': 'Updated',
  'stat.localTime': 'local time',
  'stat.allReachable': 'all reachable',
  'stat.unreachable': '{count} unreachable',
  'stat.tested': '{count} tested',

  'status.idle': 'Idle',
  'status.running': 'Testing',
  'status.fast': 'Fast',
  'status.fair': 'Normal',
  'status.slow': 'Slow',
  'status.poor': 'Very slow',
  'status.error': 'Down',

  'card.requesting': 'Requesting…',
  'card.notTested': 'Not tested yet',
  'card.samples': 'Three samples: {values} ms',
  'card.noCors': 'No CORS header',

  'error.timeout': 'Timed out with no response',
  'error.connect': 'Could not connect — DNS, certificate or network issue',
  'error.unknown': 'Unknown error',

  'footer.measure':
    'Each check is a GET request with a random query parameter, timed from sending to response headers. That covers the network round trip plus server time to first byte, not page assets.',
  'footer.cors':
    "The saver domains don't send CORS headers, so the browser can't read the response and only confirms the connection opened; api.luogu.me allows CORS, so its card shows the real HTTP status.",
  'footer.cache':
    'Connection reuse and CDN caching make repeat runs faster — judge the trend rather than a single number.',

  'menu.theme': 'Theme',
  'menu.theme.system': 'System',
  'menu.theme.light': 'Light',
  'menu.theme.dark': 'Dark',
  'menu.locale': 'Language',
  'menu.locale.zh': '简体中文',
  'menu.locale.en': 'English',
}

export const messages: Record<Locale, Record<MessageKey, string>> = { zh, en }
