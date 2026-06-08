# API 设计规范

> 完整版见 [docs/conventions/api-design.md](docs/conventions/api-design.md)

## 核心约束

- API Routes 统一在 `src/app/api/`，使用 Route Handlers（非旧版 API Routes）
- 响应格式统一：`{ data?: T, error?: { code: string, message: string } }`
- 状态码：200 成功 / 201 创建 / 400 参数错误 / 401 未认证 / 403 无权限 / 404 不存在 / 500 服务端错误
- 用户输入必须校验（zod）
- 写操作 API（POST/PUT/DELETE）必须鉴权
- 列表接口必须支持分页（cursor 或 offset）
