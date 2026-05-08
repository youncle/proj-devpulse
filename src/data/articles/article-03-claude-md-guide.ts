import type { Article } from '@/types/article';

export const article: Article =   {
    title: 'Claude Code 通关手册（三）：99%的人不知道的效率秘诀，CLAUDE.md 深度实战',
    excerpt:
      '深入解析 Claude Code 的五层记忆系统——从全局 CLAUDE.md 到子目录规范，从内容取舍原则到渐进式披露策略。一次编写，每次会话自动生效。',
    date: '2026-03-12',
    category: '人工智能',
    tags: ['Claude Code', 'AI', '开发工具', 'CLAUDE.md'],
    slug: 'claude-code-claude-md-guide',
    content: `
<blockquote><p>这是「Claude Code 通关手册」系列的第 3 篇，共 10 篇。从这篇开始进入 Level 2（配置篇）。如果你还没配好权限系统，建议先看第 2 篇。</p></blockquote>
<p><a href="/blog/claude-code-cursor-guide">Claude Code 通关手册（一）：Cursor 用户转 Claude Code，第一天我就后悔了——后悔没早点用</a></p>
<p><a href="/blog/claude-code-permission-system">Claude Code 通关手册（二）：权限系统搞明白，效率直接翻倍</a></p>

<p>我来描述一个场景，你看有没有中过招——</p>
<p>周一早上，你打开终端，启动 Claude Code，准备让它帮你做一个代码重构。</p>
<p>你输入："帮我重构 ArticleCard 组件。"</p>
<p>Claude 问："这个项目用的是什么框架？"</p>
<p>你答："Next.js 14，App Router。"</p>
<p>Claude 问："用 TypeScript 还是 JavaScript？"</p>
<p>你答："TypeScript，严格模式。"</p>
<p>Claude 问："样式方案呢？Tailwind 还是 CSS Modules？"</p>
<p>你答："Tailwind CSS。"</p>
<p>Claude 问："组件导出方式有什么偏好吗？"</p>
<p>你答：……</p>
<p><strong>你已经花了两分钟在重复上周说过的话。</strong></p>
<p>周二，同样的事情再来一遍。周三，又来一遍。到了周五，你的耐心已经被这些重复对话消磨殆尽。</p>
<p>问题的根源是什么？<strong>Claude Code 每次启动都是一张白纸。</strong> 它不记得你昨天跟它说的任何事情。每次打开都是一个全新的 AI，对你的项目一无所知。</p>
<p>但有一个文件，写好它之后，Claude 每次启动都会自动读取——从此它打开项目就知道技术栈是什么、编码规范是什么、常用命令怎么跑。</p>
<p>这个文件叫 <strong>CLAUDE.md</strong>。</p>
<p>今天这篇文章，我把它讲透。</p>

<h2>CLAUDE.md 是什么？一句话说清楚</h2>
<p><strong>CLAUDE.md 是你写给 Claude Code 的"项目交接文档"。</strong></p>
<p>打个比方：你们团队来了一个新同事，能力极强但对项目完全陌生。你会怎么做？</p>
<p>大概率会写一份入职文档，告诉他：项目是干嘛的、技术栈是什么、代码结构长什么样、日常开发要跑哪些命令、编码规范是什么、有什么坑要注意。</p>
<p>CLAUDE.md 就是这份文档——只不过你的"新同事"是 Claude Code，而且它每天早上都会"失忆"，所以它每天上班第一件事就是把这份文档读一遍。</p>
<p>技术上说：</p>
<ul>
  <li><strong>位置</strong>：项目根目录（或其他几个位置，后面详细讲）</li>
  <li><strong>格式</strong>：Markdown 文件</li>
  <li><strong>加载时机</strong>：每次会话开始时自动加载，不需要你手动指定</li>
  <li><strong>文件名区分大小写</strong>：必须是 <code>CLAUDE.md</code>，全大写，不能是 <code>claude.md</code></li>
  <li><strong>优先级极高</strong>：CLAUDE.md 里的指令优先级高于你在对话中说的话，如果有冲突，CLAUDE.md 赢</li>
</ul>

<h2>记忆系统全景图：不只是一个文件</h2>
<p>很多人以为 CLAUDE.md 就是一个文件的事。其实 Claude Code 有一整套分层记忆系统，CLAUDE.md 只是其中最核心的一层。</p>
<pre><code>┌──────────────────────────────────────────────────────────┐
│           Claude Code 记忆系统全景图                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────┐                  │
│  │  第 1 层：全局 CLAUDE.md            │                  │
│  │  ~/.claude/CLAUDE.md               │                  │
│  │  → 所有项目通用的个人偏好           │                  │
│  │  → "我喜欢 2 空格缩进"             │                  │
│  └──────────┬─────────────────────────┘                  │
│             ↓ 叠加                                        │
│  ┌────────────────────────────────────┐                  │
│  │  第 2 层：项目 CLAUDE.md            │                  │
│  │  项目根目录/CLAUDE.md              │                  │
│  │  → 项目专属信息，提交到 Git         │                  │
│  │  → "本项目用 Next.js 14 + TS"      │                  │
│  └──────────┬─────────────────────────┘                  │
│             ↓ 叠加                                        │
│  ┌────────────────────────────────────┐                  │
│  │  第 3 层：个人本地 CLAUDE.local.md  │                  │
│  │  项目根目录/CLAUDE.local.md        │                  │
│  │  → 个人偏好，不提交到 Git           │                  │
│  │  → "用中文回答我"                  │                  │
│  └──────────┬─────────────────────────┘                  │
│             ↓ 叠加                                        │
│  ┌────────────────────────────────────┐                  │
│  │  第 4 层：子目录 CLAUDE.md          │                  │
│  │  src/components/CLAUDE.md          │                  │
│  │  → 按需加载，操作该目录时才读取     │                  │
│  │  → "组件必须用函数式声明"          │                  │
│  └──────────┬─────────────────────────┘                  │
│             ↓ 叠加                                        │
│  ┌────────────────────────────────────┐                  │
│  │  第 5 层：Auto Memory（自动记忆）   │                  │
│  │  ~/.claude/projects/&lt;项目&gt;/memory/ │                  │
│  │  → Claude 自己记的笔记             │                  │
│  │  → 自动记录，无需你维护             │                  │
│  └────────────────────────────────────┘                  │
│                                                          │
│  叠加规则：所有层级同时生效，不是覆盖关系                   │
│  冲突时：越具体的层级优先级越高                             │
│                                                          │
└──────────────────────────────────────────────────────────┘</code></pre>
<p><strong>关键概念：叠加，不是覆盖。</strong></p>
<p>这跟 CSS 的层叠逻辑很像——全局样式 + 项目样式 + 局部样式同时生效，发生冲突时以更具体的为准。</p>
<p>日常使用中，你最需要关心的是前两层：<strong>全局 CLAUDE.md</strong>（你的个人偏好）和<strong>项目 CLAUDE.md</strong>（项目专属上下文）。其他三层按需使用。</p>

<h2>该写什么、不该写什么</h2>
<p>这个问题至关重要。写多了浪费 Token、Claude 可能忽略关键指令；写少了等于没写。</p>
<p>业内共识是这样的：</p>
<pre><code>┌──────────────────────────────────────────────────────────┐
│            CLAUDE.md 内容取舍原则                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ✅ 该写的（每次会话都需要知道的信息）                      │
│  ├── 项目是什么、用了什么技术栈                            │
│  ├── 项目目录结构的关键说明                                │
│  ├── 编码规范和命名约定                                   │
│  ├── 日常开发要跑的命令（dev/build/test/lint）             │
│  ├── 重要的架构决策和约束                                  │
│  └── 常踩的坑和特殊注意事项                                │
│                                                          │
│  ❌ 不该写的                                              │
│  ├── "写出高质量代码" — 太模糊，等于没说                   │
│  ├── "遵循最佳实践" — Claude 自己知道，不用你教             │
│  ├── 完整的 API 文档 — 太长，用 @docs/ 引用               │
│  ├── 频繁变动的信息 — 放到对话里说就行                     │
│  ├── 所有可能用到的命令 — 只写高频的                       │
│  └── SOLID 原则的定义 — Claude 比你还熟                   │
│                                                          │
│  核心思路：                                                │
│  想象你给一个高级工程师写交接文档                           │
│  他什么都会，只是不了解"你这个项目的特殊情况"               │
│  你只需要写特殊情况，不需要教他基础知识                     │
│                                                          │
└──────────────────────────────────────────────────────────┘</code></pre>
<p><strong>经验法则：控制在 100-150 行以内。</strong> 研究表明，前沿 AI 模型能稳定遵循大约 150-200 条指令。超过这个范围，遵循率会下降。与其写一篇面面俱到的万字长文，不如写一份精炼的、每条都有分量的指南。</p>
<p>记住一个核心原则——<strong>渐进式披露（Progressive Disclosure）</strong>。不要把所有信息都塞进 CLAUDE.md。只在里面写"每次会话都需要的信息"，其他的放到文档目录里用 <code>@docs/xxx.md</code> 按需引用。这样既节省 Token，又能在需要时提供深度上下文。</p>

<h2>完整实操：为 DevPulse 编写 CLAUDE.md</h2>
<p>说再多不如做一遍。我们来给 DevPulse 项目写一份完整的 CLAUDE.md。</p>

<h3>第一步：让 Claude 先分析项目</h3>
<p>在 DevPulse 项目目录下启动 Claude Code，输入：</p>
<pre><code>分析这个项目的完整结构，帮我生成一份 CLAUDE.md 初稿，
包括项目概述、技术栈、目录结构、编码规范和常用命令</code></pre>
<p>或者更简单——Claude Code 内置了一个初始化命令：</p>
<pre><code>/init</code></pre>
<p>这个命令会让 Claude 自动扫描你的项目，生成一份 CLAUDE.md 初稿。</p>
<p>但注意：<strong>/init 生成的只是起点，不是终点。</strong> 它能识别出技术栈和基本命令，但你的编码规范、架构约束、团队约定这些"隐性知识"需要你手动补充。</p>

<h3>第二步：手动补充，形成最终版</h3>
<p>下面是 DevPulse 项目的完整 CLAUDE.md，你可以直接参考：</p>
<pre><code># DevPulse 项目说明

## 项目概述
DevPulse 是一个基于 Next.js 14 的技术博客平台，支持 Markdown 文章发布、
用户认证、评论互动和全文搜索。面向技术社区，部署在 Vercel 上。

## 技术栈
- 框架：Next.js 14.x（App Router，不使用 Pages Router）
- 语言：TypeScript 5.x（strict 模式，tsconfig 中 strict: true）
- 样式：Tailwind CSS 3.x（不使用 CSS Modules）
- ORM：Prisma 5.x + PostgreSQL 16
- 认证：NextAuth.js v5
- 部署：Vercel（自动部署 main 分支）

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
  错误：export const ArticleCard = () =&gt; {}
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
- Prisma schema 修改后必须运行 migrate dev 和 generate</code></pre>

<h3>第三步：测试效果</h3>
<p>写好 CLAUDE.md 后，<strong>开一个全新的会话</strong>来测试：</p>
<pre><code># 退出当前会话
Ctrl+D

# 重新启动（不要用 -c 继续，要全新启动）
claude</code></pre>
<p>然后输入：</p>
<pre><code>帮我重构 ArticleCard 组件，拆分成更小的子组件</code></pre>
<p>注意看——这次你什么背景信息都没说，但 Claude 已经知道：</p>
<ul>
  <li>项目用 Next.js 14 + TypeScript strict</li>
  <li>组件要用 function 声明</li>
  <li>样式用 Tailwind CSS</li>
  <li>Props 类型要命名为 <code>ArticleCardProps</code></li>
  <li>需要考虑 Server/Client 组件划分</li>
</ul>
<p><strong>这就是 CLAUDE.md 的魔力——一次编写，每次会话自动生效。</strong></p>

<h2>好的 vs 差的 CLAUDE.md：一组对比看明白</h2>
<p>同样一个项目，CLAUDE.md 写成什么样，Claude 的表现天差地别。</p>

<h3>差的 CLAUDE.md</h3>
<pre><code># My Project

This is a web project. Use React.
Write clean code and follow best practices.</code></pre>
<p>问题在哪？</p>
<ul>
  <li>"web project"——什么框架？Next.js？Remix？Vite？</li>
  <li>"Use React"——哪个版本？用 Hooks 还是 Class？</li>
  <li>"clean code"——你的 clean 和我的 clean 可能完全不同</li>
  <li>"best practices"——Claude 自己就知道最佳实践，不需要你说这句废话</li>
</ul>
<p>结果就是：Claude 只能靠猜，猜错了你再纠正，一来一回浪费大量时间。</p>

<h3>好的 CLAUDE.md</h3>
<p>就是上面 DevPulse 的那份——每条信息都具体、可执行、没有歧义。</p>
<p>对比总结：</p>
<pre><code>┌────────────┬──────────────────────┬──────────────────────┐
│ 维度        │ ❌ 差的               │ ✅ 好的               │
├────────────┼──────────────────────┼──────────────────────┤
│ 项目描述    │ "一个网站"            │ "基于 Next.js 14 的   │
│            │                      │  技术博客平台"         │
├────────────┼──────────────────────┼──────────────────────┤
│ 技术栈     │ "用了 React"          │ "Next.js 14 + TS     │
│            │                      │  strict + Tailwind"   │
├────────────┼──────────────────────┼──────────────────────┤
│ 编码规范    │ "写干净的代码"        │ "function 声明组件，   │
│            │                      │  Props 命名 XxxProps"  │
├────────────┼──────────────────────┼──────────────────────┤
│ 常用命令    │ 没有                  │ 完整的 dev/build/     │
│            │                      │  test/lint/migrate     │
├────────────┼──────────────────────┼──────────────────────┤
│ 信息密度    │ 3 行                  │ 80-100 行             │
├────────────┼──────────────────────┼──────────────────────┤
│ 效果       │ Claude 不断追问       │ Claude 上手就能干活    │
└────────────┴──────────────────────┴──────────────────────┘</code></pre>

<h2>进阶一：子目录 CLAUDE.md——分层上下文</h2>
<p>你的项目有不同类型的代码——组件、API、测试——它们各自有不同的规范。全部塞进根目录的 CLAUDE.md？太臃肿了。</p>
<p>更好的做法是在子目录里放独立的 CLAUDE.md：</p>
<pre><code>DevPulse/
├── CLAUDE.md                     ← 项目全局上下文
├── src/
│   ├── components/
│   │   └── CLAUDE.md             ← 组件开发规范
│   ├── app/api/
│   │   └── CLAUDE.md             ← API 开发规范
│   └── lib/
│       └── CLAUDE.md             ← 工具函数规范
└── tests/
    └── CLAUDE.md                 ← 测试编写规范</code></pre>
<p><strong>加载时机</strong>：子目录的 CLAUDE.md 不是启动时就加载的，而是<strong>按需加载</strong>——当 Claude 读取或操作该目录下的文件时，才会自动读取对应的 CLAUDE.md。</p>
<p>这就是"渐进式披露"的具体应用：Claude 写组件的时候加载组件规范，写 API 的时候加载 API 规范，不用的时候不加载，节省宝贵的上下文窗口空间。</p>
<p>举个例子，<code>src/components/CLAUDE.md</code> 可以这么写：</p>
<pre><code># 组件开发规范

## 文件组织
- 每个组件一个文件，文件名与组件名一致（PascalCase）
- 复杂组件可以建子目录：ComponentName/index.tsx + 子组件
- 基础 UI 组件放 ui/，业务组件放 features/

## 组件结构
- 组件声明用 function 关键字，不要用箭头函数
- Props 类型定义放在文件顶部，使用 ComponentNameProps 命名
- 每个组件文件只导出一个主要组件
- 辅助函数和子组件放在单独的文件中

## 样式规范
- 使用 Tailwind CSS，不使用 CSS Modules
- 遵循项目中已有的颜色变量和间距规范
- 暗色模式通过 dark: 前缀实现

## 服务端/客户端组件
- 默认是服务端组件
- 只有需要交互（事件监听、状态、Effect）时才加 'use client'
- 客户端组件尽量薄，只处理交互逻辑，数据获取留在服务端</code></pre>

<h2>进阶二：.claude/rules/——结构化指令目录</h2>
<p>除了用 CLAUDE.md 文件，你还可以在 <code>.claude/rules/</code> 目录下存放结构化的规则文件。Claude Code 在启动时也会自动读取这个目录下的所有 Markdown 文件。</p>
<p>与 CLAUDE.md 的区别：</p>
<pre><code>┌──────────────────────┬──────────────────────┬──────────────────────┐
│                      │  CLAUDE.md           │  .claude/rules/      │
├──────────────────────┼──────────────────────┼──────────────────────┤
│  位置                │ 根目录或子目录         │  .claude/rules/ 目录   │
│  加载方式             │ 自动加载（或按需）     │  自动全部加载          │
│  适合放什么           │ 项目概览、架构         │  API 规范、编码规则    │
│  文件数量             │ 通常 1-2 个           │  多个文件，按主题分     │
│  关注层级             │ 宏观上下文            │  具体规则说明           │
└──────────────────────┴──────────────────────┴──────────────────────┘</code></pre>
<p>两者是互补关系：<strong>CLAUDE.md 回答"项目是什么"，.claude/rules/ 回答"具体怎么做"。</strong></p>
<p>你可以把 CLAUDE.md 中的一些具体规则拆出来放到 <code>.claude/rules/</code> 里，让 CLAUDE.md 更精炼：</p>
<pre><code>.claude/
├── rules/
│   ├── api-design.md       ← API 设计规范
│   ├── testing.md          ← 测试编写规范
│   ├── typescript.md       ← TypeScript 编码规则
│   └── git-workflow.md     ← Git 工作流规范</code></pre>
<p>这样可以保持根目录 CLAUDE.md 在 100 行以内，同时仍然提供深度上下文。</p>

<h2>针对 DevPulse 项目的优化建议</h2>
<p>结合上面讲的所有知识，这里给 DevPulse 当前配置提几项优化建议：</p>
<p><strong>建议一：精简 CLAUDE.local.md</strong></p>
<p>当前 <code>CLAUDE.local.md</code> 的内容和全局 <code>~/.claude/CLAUDE.md</code> 高度重复。CLAUDE.local.md 应该只放真正属于"本项目特有的个人偏好"，比如本地开发路径、专用脚本等。去掉重复内容后，它应该精简到 5-10 行。</p>
<p><strong>建议二：填充 .claude/rules/ 目录</strong></p>
<p>目前 <code>.claude/rules/</code> 下的四个文件只有标题没有内容。应该把具体的 API 设计规范、TypeScript 规则、测试规范、Git 工作流写进去。</p>
<p><strong>建议三：创建子目录 CLAUDE.md</strong></p>
<p>根目录 CLAUDE.md 负责项目全局上下文。在 <code>src/components/</code> 和 <code>src/lib/</code> 下放置子目录 CLAUDE.md，按需加载具体规范。</p>

<h2>本篇小结</h2>
<p>三个核心收获：</p>
<p><strong>第一</strong>，CLAUDE.md 是 Claude Code 的"项目交接文档"，<strong>叠加生效</strong>：全局（个人偏好）+ 项目（技术栈/规范）+ 本地（个人本地配置）+ 子目录（按需加载）+ Auto Memory（自动记录），五层各司其职。</p>
<p><strong>第二</strong>，内容取舍遵循<strong>渐进式披露</strong>原则：根目录只放每次会话都需要的信息（100-150 行），细节放子目录或 .claude/rules/。只写"这个项目的特殊情况"，不教 Claude 基础知识。</p>
<p><strong>第三</strong>，子目录 CLAUDE.md 和 .claude/rules/ 目录是进阶用法——前者按需加载节省 Token，后者分主题管理具体规范。两者和 CLAUDE.md 互补，不是替代。</p>

<h2>下篇预告</h2>
<p><strong>第 4 篇：Claude Code 通关手册（四）—— 自定义命令与模型选择策略</strong></p>
<p>下一篇我们继续 Level 2 配置篇，聊聊怎么配置自定义命令、在不同模型间切换的策略、以及如何通过 settings.json 精细控制 Claude 的行为。让你的 Claude Code 更加得心应手。</p>
    `.trim(),
  };
