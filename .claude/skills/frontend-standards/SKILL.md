---
name: frontend-standards
description: DevPulse 前端代码规范和最佳实践。在编写 React 组件、样式、状态管理和数据获取时自动加载。
---

# DevPulse 前端开发规范

## 组件规范
- 使用 function 关键字声明组件，不用箭头函数导出
- Props 接口命名：ComponentNameProps
- 默认是 Server Component，需要交互时才加 'use client'
- 组件超过 150 行必须拆分

## 样式规范
- 使用 Tailwind CSS 工具类
- 超过 5 个类名用 cn() 函数合并
- 响应式优先：mobile-first 设计
- 暗色模式使用 dark: 前缀

## 数据获取
- Server Component 中直接 async/await 获取数据
- Client Component 中使用 SWR 或 React Query
- API 调用统一走 /api/ 路由

## 性能清单
- 图片必须使用 next/image
- 列表必须有稳定 key（不用 index）
- 大列表使用虚拟滚动
- 路由切换使用 next/link 预加载

## 错误处理
- 每个页面必须有 error.tsx 边界
- 加载状态使用 loading.tsx 或 Suspense
- API 错误统一格式：{ error: string, code: string }
