# 洛谷保存站域名测速

在浏览器里测量洛谷保存站各域名的连接延迟。所有请求由前端直接发出，没有后端。

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 站点清单

站点配置在 `src/data/targets.ts`，按分组组织，界面按分组渲染卡片。追加一个条目就会多一张卡片：

```ts
{
  id: 'www-luogu-example',        // 唯一标识，测速状态按它索引
  name: 'www.luogu.example',      // 卡片标题
  url: 'https://www.luogu.example/',
  note: '主域名',                 // 可选，显示在延迟右侧
  mode: 'cors',                   // 可选，默认 no-cors
  icon: 'https://example.com/favicon.svg', // 可选，缺省取同源 /favicon.ico
}
```

`icon` 加载失败时卡片会退回显示域名首字母。主站的 `/favicon.ico` 被前端路由兜底成 HTML，所以清单里显式指向了 CDN 上的图标。

`mode` 决定测速能拿到什么：

- `cors`：对方返回 `Access-Control-Allow-Origin`，能读到真实 HTTP 状态码，卡片上会显示；
- `no-cors`：只能确认连接是否建立，响应内容不可读，适合没有开放跨域的主站。

## 测速方式

每个地址连续发三条带随机参数的 GET 请求，记录从发起到收到响应头的时间，取最快的一次作为延迟。这测的是网络往返加服务端首字节，不含页面资源加载。

判定阈值：低于 200 ms 记为畅通，200–400 ms 正常，400–800 ms 偏慢，超过 800 ms 很慢；请求失败或 8 秒无响应记为不通。

## 目录

```
src/
├── data/targets.ts          # 站点分组与清单
├── lib/probe.ts             # 请求探测与延迟分档
├── hooks/use-speed-test.ts  # 测速状态、并发调度、汇总统计
├── components/
│   ├── target-card.tsx      # 单个站点卡片
│   ├── target-group-section.tsx
│   └── stat.tsx
└── components/ui/           # shadcn/ui 组件
```
