# 错误处理规范

## API 错误响应格式

所有 API Route Handler 统一返回：

```typescript
// 成功
{ data: T }
// 失败
{ error: { code: string, message: string } }
```

## 常见错误码

| HTTP | code | 说明 |
|------|------|------|
| 400 | `INVALID_INPUT` | 参数校验失败 |
| 401 | `UNAUTHORIZED` | 未登录 |
| 403 | `FORBIDDEN` | 无权限 |
| 404 | `NOT_FOUND` | 资源不存在 |
| 409 | `CONFLICT` | 冲突（如重复创建） |
| 429 | `RATE_LIMITED` | 请求过频繁 |
| 500 | `INTERNAL_ERROR` | 服务端异常（不暴露详情给客户端） |

## 服务端组件错误

- 使用 React 的 `error.js` 和 `error.tsx` 文件定义错误边界
- 外层 `layout.tsx` 包含全局 error boundary
- `loading.tsx` 覆盖所有加载状态

## 客户端错误处理

- API 调用用 `try/catch` 包裹，catch 中统一转换错误格式
- 表单校验使用 zod schema，错误信息映射到表单字段
- Toast 通知仅用于非关键操作（评论成功等）
