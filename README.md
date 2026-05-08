# DevPulse

DevPulse 是一个基于 Next.js 14 的技术博客平台，支持 Markdown 文章发布、用户认证、评论互动和全文搜索。

## 技术栈

- **框架**: Next.js 14（App Router）
- **语言**: TypeScript 5（strict 模式）
- **样式**: Tailwind CSS 3
- **数据库**: PostgreSQL 16 + Prisma 6
- **认证**: NextAuth.js v5
- **部署**: Vercel

## 开始使用

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 常用命令

| 命令 | 用途 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run lint` | 代码检查 |
| `npm run test` | 运行测试 |
| `npx tsc --noEmit` | 类型检查 |
| `npx prisma studio` | 数据库管理界面 |

## 项目结构

```
src/
├── app/              # 页面和布局（App Router）
│   ├── (auth)/       # 认证相关页面
│   ├── (blog)/       # 博客相关页面
│   ├── api/          # API 路由
│   └── layout.tsx    # 根布局
├── components/       # 可复用组件
│   ├── ui/           # 基础 UI 组件
│   └── features/     # 业务组件
├── lib/              # 工具函数和配置
├── types/            # 全局类型定义
└── prisma/           # 数据库 schema
```
