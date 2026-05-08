# DevPulse 项目说明

## 项目概述
DevPulse 是一个基于 Next.js 14 的技术博客平台，支持 Markdown 文章发布、
用户认证、评论互动和全文搜索。面向技术社区，部署在 Vercel 上。

## 技术栈
- 框架：Next.js 14.x（App Router，不使用 Pages Router）
- 语言：TypeScript 5.x（strict 模式，tsconfig 中 strict: true）
- 样式：Tailwind CSS 3.x（不使用 CSS Modules）
- ORM：Prisma 6.x + PostgreSQL 16
- 认证：NextAuth.js v5
- 部署：Vercel（自动部署 master 分支）

## 项目结构
src/
├── app/              # App Router 页面和布局
│   ├── (auth)/       # 认证路由组（登录、注册）
│   ├── (blog)/       # 博客路由组（文章列表、详情）
│   ├── api/          # API Routes
│   └── layout.tsx    # 根布局
├── components/       # 可复用组件
│   ├── ui/           # 基础 UI（Button、Input、Modal 等）
│   └── features/     # 业务组件（ArticleCard、CommentBox 等）
├── lib/              # 工具函数、配置、第三方封装
├── types/            # TypeScript 类型定义（全局共享类型）
└── prisma/           # 数据库 schema 和迁移文件

## 编码规范
- 组件声明：使用 function 关键字，不用箭头函数导出
  正确：export function ArticleCard() {}
  错误：export const ArticleCard = () => {}
- Props 类型命名：ComponentNameProps（如 ArticleCardProps）
- 服务端组件是默认值，只在需要交互时添加 'use client'
- 禁止使用 any 类型，所有变量和参数必须有明确类型
- import 使用命名导入，避免 default export（组件除外）
- 提交信息格式：type(scope): description（英文）
  示例：feat(blog): add article search functionality

## 常用命令
- 开发服务器：npm run dev
- 生产构建：npm run build
- 类型检查：npx tsc --noEmit
- 代码检查：npm run lint
- 运行测试：npm run test
- 测试覆盖率：npm run test -- --coverage
- 数据库迁移：npx prisma migrate dev
- 数据库客户端：npx prisma studio
- 生成 Prisma 类型：npx prisma generate

## 重要约束
- 所有页面组件默认是 Server Component，数据获取在服务端完成
- 客户端交互组件必须显式标注 'use client'
- 图片必须使用 next/image，链接必须使用 next/link
- API Routes 统一放在 src/app/api/，使用 Route Handlers（不是旧版 API Routes）
- 环境变量在 .env.local 中，不要提交到 Git
- Prisma schema 修改后必须运行 migrate dev 和 generate
