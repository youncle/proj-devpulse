import type { Article } from '@/types/article';

export const article: Article =   {
    title: 'Claude Code 通关手册（六）：MCP 协议完全指南，Claude Code 最被低估的能力',
    excerpt:
      '深入解析 MCP 协议——从零配置 GitHub 和 Context7 MCP Server，多 MCP 串联工作流实战。掌握管理命令和安全注意事项，让 AI 助手真正融入开发流程。',
    date: '2026-03-12',
    category: '人工智能',
    tags: ['Claude Code', 'AI', '开发工具', 'MCP'],
    slug: 'claude-code-mcp-guide',
    content: `
<figure><img src="https://developer.qcloudimg.com/http-save/yehe-1036137/4a2604afd9d5db27043ba30e593a3f76.jpg" alt=""/></figure>

<blockquote><p>这是「Claude Code 通关手册」系列的第 6 篇，共 10 篇。Level 3（扩展篇）第二关。上一篇我们给 Claude 配了"专家团队"，这一篇给它接上"外部世界"。</p></blockquote>

<p><a href="/blog/claude-code-cursor-guide">Claude Code 通关手册（一）：Cursor 用户转 Claude Code，第一天我就后悔了——后悔没早点用</a></p>
<p><a href="/blog/claude-code-permission-system">Claude Code 通关手册（二）：权限系统搞明白，效率直接翻倍</a></p>
<p><a href="/blog/claude-code-claude-md-guide">Claude Code 通关手册（三）：99%的人不知道的效率秘诀，CLAUDE.md 深度实战</a></p>
<p><a href="/blog/claude-code-slash-commands-guide">Claude Code 通关手册（四）：3 个自定义命令，让你的 Claude Code 快到飞起</a></p>
<p><a href="/blog/claude-code-sub-agent-system">Claude Code 通关手册（五）：子代理系统——给你的 AI 配一个"专家团队"</a></p>

<p>没有 MCP 的 Claude Code，就像一个被关在房间里的天才。</p>
<p>脑子很好使，代码写得漂亮，但它只能看到你本地的文件。你说"帮我看看 GitHub 上那个 issue"，它做不到。你说"查一下 Next.js 15 的最新 API"，它只能靠训练数据里学过的来猜（可能已经过时了）。你说"帮我连一下数据库查个数"，它更做不到。</p>
<p><strong>装上 MCP 之后，这扇门打开了。</strong></p>
<p>它能直接搜 GitHub issues、创建 PR、查看 CI 状态。它能实时查询任何库的最新文档，不用你手动去翻。它能连上你的数据库、你的项目管理工具、你的 Slack。</p>
<p>这就是从"本地 AI 助手"到"联网 AI 开发平台"的跨越。</p>
<p>今天这篇文章，我带你从零开始配置两个最实用的 MCP Server——GitHub 和 Context7——然后演示一个串联多个 MCP 的完整工作流。</p>

<h2><strong>MCP 是什么？——30 秒用"USB 接口"讲明白</strong></h2>
<p>MCP 全称 Model Context Protocol（模型上下文协议），是 Anthropic 在 2024 年底推出的开源标准。</p>
<p>这个名字听着挺吓人，但核心概念极简。用一个类比：</p>
<p><strong>USB 是电脑连接外设的标准接口。</strong> 键盘、鼠标、U 盘、摄像头——只要遵守 USB 协议，插上就能用。你不需要为每个品牌的鼠标安装不同的驱动。</p>
<p><strong>MCP 是 AI 连接外部工具的标准接口。</strong> GitHub、数据库、浏览器、文档查询——只要遵守 MCP 协议，接上就能用。AI 不需要为每个工具写一套集成代码。</p>

<pre><code>┌──────────────────────────────────────────────────────────┐
│          MCP 之前 vs MCP 之后                              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  MCP 之前（各自为政）：                                    │
│                                                          │
│  AI工具 ─── 自定义接口 ──→ GitHub                        │
│  AI工具 ─── 另一套接口 ──→ 数据库                        │
│  AI工具 ─── 又一套接口 ──→ Slack                         │
│  AI工具 ─── 再一套接口 ──→ Jira                          │
│  （每个集成都要单独开发，维护噩梦）                        │
│                                                          │
│  MCP 之后（统一标准）：                                    │
│                                                          │
│             ┌── GitHub MCP Server                        │
│             ├── 数据库 MCP Server                        │
│  AI工具 ────┼── Slack MCP Server                         │
│  (MCP客户端) ├── Jira MCP Server                          │
│             └── 任何遵守协议的 Server                     │
│  （一个协议，接所有工具）                                  │
│                                                          │
└──────────────────────────────────────────────────────────┘</code></pre>

<p><strong>Claude Code 就是一个 MCP 客户端。</strong> 你给它装上不同的 MCP Server，它就获得了不同的能力。就像你的电脑插上不同的 USB 设备就能做不同的事情。</p>
<p>目前社区里已经有数百个 MCP Server，覆盖了从 GitHub、Slack、Linear、Sentry、PostgreSQL 到浏览器自动化、文档查询等几乎所有开发场景。</p>

<h2><strong>MCP 的三种传输模式</strong></h2>
<p>在配置之前，简单了解一下 MCP 的连接方式——这会影响你后面的安装命令：</p>

<pre><code>┌──────────────────────────────────────────────────────────┐
│          三种传输模式                                      │
├──────────┬──────────────────┬────────────────────────────┤
│ 模式      │ 工作方式          │ 适用场景                   │
├──────────┼──────────────────┼────────────────────────────┤
│ stdio    │ MCP Server 作为   │ 绝大多数场景（80%）        │
│ （本地）  │ 本地子进程运行    │ 安装简单，无需网络          │
├──────────┼──────────────────┼────────────────────────────┤
│ http     │ 连接远程 HTTP     │ 云端 MCP Server            │
│ （远程）  │ 服务器           │ 支持 OAuth 认证             │
├──────────┼──────────────────┼────────────────────────────┤
│ sse      │ Server-Sent      │ 历史模式，正在被            │
│ （历史）  │ Events 长连接    │ http 模式替代               │
└──────────┴──────────────────┴────────────────────────────┘

日常开发：stdio 就够了，本地运行，最简单
远程/云端服务：用 http 模式</code></pre>

<h2><strong>MCP 管理命令速查</strong></h2>
<p>在开始安装之前，先记住这几个管理命令：</p>

<pre><code># 添加 MCP Server（stdio 模式）
claude mcp add &lt;名称&gt; -- &lt;启动命令&gt;

# 添加 MCP Server（http 远程模式）
claude mcp add --transport http &lt;名称&gt; &lt;URL&gt;

# 查看已安装的 MCP Server
claude mcp list

# 测试 MCP Server 连接
claude mcp get &lt;名称&gt;

# 删除 MCP Server
claude mcp remove &lt;名称&gt;

# 在交互模式中管理（推荐）
/mcp</code></pre>

<p><code>/mcp</code> 是最友好的方式——在 Claude Code 交互模式中输入，会弹出一个交互式菜单，引导你完成安装、认证和管理。</p>

<h2><strong>实战一：安装 GitHub MCP Server</strong></h2>
<p>GitHub MCP 是使用频率最高的 MCP Server，也是 GitHub 官方维护的。装上之后，Claude Code 就能直接操作你的 GitHub 仓库。</p>

<h3><strong>安装步骤</strong></h3>
<p><strong>第一步：生成 GitHub Personal Access Token</strong></p>
<p>去 GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens，创建一个新 Token：</p>
<ul>
  <li>仓库权限：选你需要的仓库（或 All repositories）</li>
  <li>权限范围：Issues（Read/Write）、Pull Requests（Read/Write）、Contents（Read）</li>
</ul>
<p>生成后复制 Token，保存好。</p>

<p><strong>第二步：安装 MCP Server</strong></p>
<p>有两种方式，选一种：</p>
<p>方式 A——远程模式（推荐，更简单）：</p>

<pre><code>claude mcp add --transport http github \
  https://api.githubcopilot.com/mcp \
  -H "Authorization: Bearer YOUR_GITHUB_PAT"</code></pre>

<p>方式 B——本地 Docker 模式：</p>

<pre><code>claude mcp add github \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_GITHUB_PAT \
  -- docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN \
  ghcr.io/github/github-mcp-server</code></pre>

<p><strong>第三步：验证安装</strong></p>

<pre><code>claude mcp list
# 应该能看到 github 在列表中

claude mcp get github
# 应该显示连接状态正常</code></pre>

<h3><strong>GitHub MCP 能做什么？</strong></h3>

<pre><code>┌──────────────────────────────────────────────────────────┐
│          GitHub MCP 能力清单                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Issues 管理                                              │
│  ├── "列出 DevPulse 仓库最近的 5 个 open issue"           │
│  ├── "创建一个 issue：文章列表页需要分页功能"              │
│  └── "把 #47 issue 标记为 closed"                        │
│                                                          │
│  Pull Request                                             │
│  ├── "为当前分支的改动创建一个 PR 到 main"                │
│  ├── "查看 PR #12 的审查评论"                             │
│  └── "合并 PR #12"                                       │
│                                                          │
│  仓库信息                                                 │
│  ├── "查看 DevPulse 最近的提交记录"                       │
│  ├── "搜索仓库里包含 'TODO' 的文件"                      │
│  └── "读取 README.md 的内容"                             │
│                                                          │
│  协作工作流                                               │
│  ├── "查看 CI 状态，最近的构建有没有失败"                  │
│  └── "把 @user 添加为 PR 的 reviewer"                    │
│                                                          │
└──────────────────────────────────────────────────────────┘</code></pre>

<h3><strong>DevPulse 实操演示</strong></h3>

<pre><code># 启动 Claude Code，进入 DevPulse 项目

你: 查看 DevPulse 仓库最近的 5 个 open issue

Claude: [调用 GitHub MCP → list_issues]
找到 5 个 open issue：
1. #52: "移动端文章页排版问题" — 2天前
2. #49: "暗色模式切换后闪屏" — 5天前
3. #47: "文章列表页加载慢" — 1周前
4. #45: "评论区需要支持 Markdown" — 2周前
5. #43: "搜索功能偶尔返回空结果" — 3周前

你: 帮我修复 #49 暗色模式闪屏问题，修好后自动提 PR

Claude:
[调用 GitHub MCP → 读取 #49 详情]
[分析本地代码 → 定位到 ThemeProvider 组件]
[修改代码 → 添加 suppressHydrationWarning 和 script 预加载主题]
[执行 git checkout -b fix/dark-mode-flash]
[执行 git commit -m "fix(theme): prevent dark mode flash on page load"]
[调用 GitHub MCP → 创建 PR]

✅ 已创建 PR #53: "Fix dark mode flash on page load"
   分支: fix/dark-mode-flash → main
   关联 issue: closes #49</code></pre>

<p><strong>注意这个工作流</strong>——Claude 在一次对话中完成了：读 GitHub issue → 分析本地代码 → 修改代码 → Git 提交 → 创建 PR → 关联 issue。这在没有 MCP 之前是不可能的。</p>

<h2><strong>实战二：安装 Context7 MCP Server</strong></h2>
<p>Context7 解决的是另一个痛点——<strong>Claude 的训练数据有截止日期</strong>。</p>
<p>比如你问它"Next.js 15 的 Server Actions 怎么写"，如果 Next.js 15 是在训练数据截止之后才发布的，Claude 只能靠猜——很可能给你一个旧版本的语法。</p>
<p>Context7 能实时查询任何库的最新官方文档，把最新的 API 用法直接注入到 Claude 的上下文中。</p>

<h3><strong>安装步骤</strong></h3>
<p>方式 A——远程模式（推荐）：</p>

<pre><code>claude mcp add --transport http context7 https://mcp.context7.com/mcp</code></pre>

<p>方式 B——本地模式：</p>

<pre><code>claude mcp add context7 -- npx -y @upstash/context7-mcp@latest</code></pre>

<p>如果需要更高频率限制，可以去 context7.com/dashboard 免费注册一个 API Key，然后：</p>

<pre><code>claude mcp add context7 -- npx -y @upstash/context7-mcp@latest --api-key YOUR_API_KEY</code></pre>

<h3><strong>Context7 实操演示</strong></h3>

<pre><code>你: 我要在 DevPulse 里实现 Server Actions 来处理表单提交，
   用 context7 查一下 Next.js 最新的 Server Actions 语法

Claude: [调用 Context7 MCP → resolve-library-id → query-docs]
根据 Next.js 最新文档，Server Actions 的当前语法是...
[给出最新的、准确的代码示例]</code></pre>

<p>关键词 <code>use context7</code> 是触发 Context7 查询的信号。你也可以在 CLAUDE.md 中加一条规则让它自动触发：</p>

<pre><code>你可以在 CLAUDE.md 中告诉 Claude：
"当涉及 API 用法、框架语法、库的配置方式时，
用 context7 查询最新官方文档，不要依赖训练数据。"</code></pre>

<h2><strong>实战三：远程 MCP（Remote MCP）——零安装体验</strong></h2>
<p>2025 年中，Claude Code 加入了对远程 MCP 的原生支持。远程 MCP 提供<strong>零安装</strong>体验——只需连 URL，无需本地装依赖。服务端自动更新，通过浏览器 OAuth 认证，适合 SaaS 类工具。</p>

<pre><code># Linear（项目管理）
claude mcp add --transport http linear https://mcp.linear.app/mcp

# Sentry（错误监控）
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp</code></pre>

<p>安装后，在交互模式中运行 <code>/mcp</code>，选择对应的 MCP Server，浏览器会自动弹出 OAuth 认证页面，授权完成后即可使用。</p>

<p>远程 MCP 的核心优势：</p>
<ul>
  <li><strong>零安装</strong>——不需要装 Node.js 包、不需要跑 Docker 容器，一个 URL 搞定</li>
  <li><strong>自动更新</strong>——服务端更新后你不需要做任何操作</li>
  <li><strong>OAuth 认证</strong>——标准化的认证流程，不用手动管理 Token</li>
  <li><strong>适合 SaaS</strong>——Linear、Sentry、GitHub 这类云服务天然适合远程 MCP</li>
</ul>

<h2><strong>多 MCP 串联工作流</strong></h2>
<p>单个 MCP Server 有用，但多个 MCP Server 串联起来才是真正的杀手锏。</p>
<p>想象这样一个场景：</p>

<pre><code>┌──────────────────────────────────────────────────────────┐
│             多 MCP 串联工作流                                 │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  你: "看到 GitHub issue #52 说移动端文章页排版有问题，       │
│      用 Playwright 截图看看现在的效果，                     │
│      然后检查一下 postcss 配置是否兼容移动端。"              │
│                                                          │
│  Claude 的工作流：                                         │
│                                                          │
│  ① GitHub MCP → 读取 issue #52 的详细描述                 │
│  ② 本地代码分析 → 检查文章页的 CSS 和布局代码              │
│  ③ Playwright MCP → 启动移动端视口截图                    │
│  ④ Context7 MCP → 查最新的 Tailwind 响应式方案             │
│  ⑤ 综合判断 → 给出修复方案并直接修改代码                   │
│                                                          │
└──────────────────────────────────────────────────────────┘</code></pre>

<p>多个 MCP Server 不是各自独立的工具——它们在 Claude 的调度下协同工作，像一支配合默契的团队。</p>

<h2><strong>推荐安装清单：5 个最实用的 MCP Server</strong></h2>
<p>装太多 MCP Server 会占用上下文窗口空间，影响 Claude 的性能。建议日常保持在 <strong>5-8 个</strong>以内。以下是我精选的 5 个高价值 MCP Server：</p>

<pre><code>┌──────────────────────────────────────────────────────────┐
│              推荐安装清单                                     │
├──────────────────┬──────────────────┬─────────────────────┤
│ MCP Server       │ 能力              │ 安装方式            │
├──────────────────┼──────────────────┼─────────────────────┤
│ GitHub（官方）    │ Issue/PR/仓库管理  │ --transport http   │
│                  │                   │ 远程模式            │
├──────────────────┼──────────────────┼─────────────────────┤
│ Context7         │ 实时库文档查询     │ http 远程 或        │
│ (Upstash)        │                   │ npx 本地模式        │
├──────────────────┼──────────────────┼─────────────────────┤
│ Playwright       │ 浏览器自动化       │ npx 本地模式        │
│ （微软）          │ 截图/测试          │                    │
├──────────────────┼──────────────────┼─────────────────────┤
│ PostgreSQL       │ 数据库查询和分析   │ npx 本地模式        │
│ (DBHub)          │                   │                    │
├──────────────────┼──────────────────┼─────────────────────┤
│ Sentry（官方）    │ 错误监控和日志分析  │ 远程 OAuth 模式    │
└──────────────────┴──────────────────┴─────────────────────┘

建议优先级：
第一梯队（必装）：GitHub + Context7
第二梯队（按需）：Playwright、PostgreSQL、Sentry</code></pre>

<h2><strong>安全注意事项：四条红线</strong></h2>
<p>MCP 很强大，但强大也意味着责任。以下四条红线请务必遵守：</p>

<p><strong>红线一：只安装信任的 MCP Server</strong></p>
<p>只安装官方维护的、开源可审计的、社区广泛使用的 MCP Server。一个恶意的 MCP Server 可以读取你的文件、执行命令、甚至泄露数据。</p>

<p><strong>红线二：了解每个 MCP Server 的数据访问范围</strong></p>
<p>授权前想清楚——它能看到什么数据？Token 的权限范围尽可能收窄。比如 GitHub Token 只给需要的仓库，不给全部。</p>

<p><strong>红线三：生产数据库只给只读权限</strong></p>
<p>务必使用只读账号连接生产数据库，永远不要把写权限给到 AI 能触及的地方。一条 "帮我删掉重复数据" 的请求，没有写权限就只是想想而已。</p>

<p><strong>红线四：用 --scope 控制生效范围</strong></p>

<pre><code># 项目级（推荐用于特定项目的数据库等）
claude mcp add mysql ... --scope local

# 用户级（通用型如 Context7 文档查询）
claude mcp add context7 ... --scope user</code></pre>

<p>不要无脑全局安装所有东西。<code>--scope local</code> 让 MCP Server 只对当前项目生效，<code>--scope user</code> 对所有项目生效。</p>

<h2><strong>本篇小结</strong></h2>
<p>三个核心收获：</p>
<p><strong>第一</strong>，MCP 是 AI 的"USB 接口"——一个统一标准连接所有外部工具。Claude Code 是 MCP 客户端，装不同的 Server 获得不同能力。</p>
<p><strong>第二</strong>，三种传输模式（stdio 本地、http 远程、sse 历史），日常用 stdio 就够了，SaaS 工具用 http 远程模式更方便。</p>
<p><strong>第三</strong>，GitHub MCP（操作仓库）+ Context7（实时文档查询）是必装组合。多 MCP 串联能实现从 issue 到 PR 的全自动工作流。</p>

<p><strong>推荐安装清单</strong></p>
<ul>
  <li>[ ] GitHub MCP（官方远程模式）</li>
  <li>[ ] Context7 MCP（文档查询）</li>
  <li>[ ] Playwright MCP（浏览器自动化，按需）</li>
  <li>[ ] PostgreSQL MCP（数据库查询，按需）</li>
  <li>[ ] Sentry MCP（错误监控，按需）</li>
</ul>

<p><strong>安全红线确认</strong></p>
<ul>
  <li>[ ] 只安装受信任的 MCP Server</li>
  <li>[ ] Token 权限按最小原则配置</li>
  <li>[ ] 生产数据库只读</li>
  <li>[ ] 合理使用 --scope 控制生效范围</li>
</ul>

<p><strong>多 MCP 串联能力</strong></p>
<ul>
  <li>[ ] 体验过 GitHub MCP 操作 issue/PR</li>
  <li>[ ] 体验过 Context7 实时文档查询</li>
  <li>[ ] 尝试过多个 MCP 串联的完整工作流</li>
</ul>

<p>全部打勾？恭喜通关 Level 3（扩展篇）第二关。</p>

<h2><strong>下篇预告</strong></h2>
<p><strong>第 7 篇：Claude Code 通关手册（七）—— Hooks + Skills + Plugins，Claude Code 的"乐高系统"</strong></p>
<p>下一篇继续 Level 3 扩展篇。MCP 让 Claude 连接了外部世界，Hooks 和 Skills 则让它能在你本地的开发环境中执行自动化操作。这三样东西加起来，你的 Claude Code 就是一个完整的开发平台了。</p>
    `.trim(),
  };
