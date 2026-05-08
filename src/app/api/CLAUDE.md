# API Routes 开发规范

## 文件结构
- 每个路由放在对应目录下：src/app/api/posts/route.ts
- 使用 Route Handler 语法（export async function GET/POST/PUT/DELETE）

## 错误处理
- 所有路由必须有 try-catch 包裹
- 统一错误格式：{ error: string, code: string }
- 使用 NextResponse.json() 返回响应
- 4xx 错误返回用户友好的提示，5xx 记录日志但返回通用提示

## 数据校验
- 请求体用 zod schema 校验
- 校验失败返回 400 + 具体的字段错误信息

## 认证
- 需要认证的路由使用 getServerSession() 检查
- 未认证返回 401，无权限返回 403
