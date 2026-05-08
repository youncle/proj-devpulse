# 组件开发规范

## 文件组织
- 每个组件一个文件，文件名与组件名一致（PascalCase）
- 复杂组件可以建子目录：ComponentName/index.tsx + 子组件
- 基础 UI 组件放 ui/，业务组件放 features/

## 组件结构顺序
1. 'use client'（如果需要）
2. import 语句
3. Props 接口定义
4. 组件函数
5. 辅助函数（组件外部）

## 样式规范
- 优先使用 Tailwind 工具类
- 超过 5 个类名时用 clsx/cn 函数合并
- 响应式断点：sm:640 md:768 lg:1024 xl:1280
- 暗色模式使用 dark: 前缀

## 性能注意事项
- 列表渲染必须有稳定的 key（不用 index）
- 大列表考虑虚拟滚动
- 图片使用 next/image 的 sizes 属性优化加载
