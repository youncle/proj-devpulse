import type { Article } from '@/types/article';

export const article: Article =   {
    title: 'Claude Code 通关手册（二）：权限系统搞明白，效率直接翻倍',
    excerpt:
      '深入解析 Claude Code 权限系统的三层模型和五种权限模式，掌握 @mentions 文件引用和四大核心工作流，让你的开发效率翻倍。',
    date: '2026-05-05',
    category: '人工智能',
    tags: ['Claude Code', 'AI', '开发工具'],
    slug: 'claude-code-permission-system',
    content: `
<blockquote><p>这是「Claude Code 通关手册」系列的第 2 篇，共 10 篇。上一篇我们完成了安装并跑通了第一个项目，这一篇要解决新手最头疼的问题——权限系统，以及让你效率飙升的 @mentions ��作流。</p></blockquote><p><a href="/blog/claude-code-cursor-guide">Claude Code 通关手册（一）：Cursor 用户转 Claude Code，第一天我就后悔了——后悔没早点用</a></p><p>用 Claude Code 超过三天的人，一定经历过这种崩溃：
</p><p>"我要读一下 package.json，可以吗？"——同意。</p><p>"我要读一下 tsconfig.json，可以吗？"——同意。</p><p>"我要读一下 src/app/page.tsx，可以吗？"——同意。</p><p>"我要读一下 src/app/layout.tsx，可以吗？"——……</p><p>点到第 15 次"同意"的时候，你的内心已经在咆哮了：<strong>能不能别问了！全部同意行不行！</strong></p><p>然后你可能真的去搜了"Claude Code 怎么跳过权限"，找到一个叫 <code>--dangerously-skip-permissions</code> 的参数，从名字就能看出来——<strong>这玩意儿名字里就写着"危险"</strong>。</p><p>其实你不需要走极端。权限系统不是 Claude Code 的缺陷，而是它最精妙的设计之一。只是你还没学会怎么调它。</p><p>今天这篇文章，我要帮你把权限系统从"烦人的拦路虎"变成"得心应手的遥控器"。同时教你 <code>@mentions</code> 文件引用和四大核心工作流——这两样东西加起来，你的 Claude Code 使用效率至少翻一倍。</p><h2 id="90a5d"><strong>权限系统到底在干嘛？</strong></h2><p>先打个比方。</p><p>你在公司有一张门禁卡。<strong>刷卡进大门</strong>——自动通过，不用跟保安打招呼。<strong>进机房</strong>——需要保安确认一下身份。<strong>进财务室的保险柜</strong>——不行，权限不够，直接拒绝。</p><p>Claude Code 的权限系统跟这个逻辑一模一样：</p><pre><code>┌──────────────────────────────────────────────────────────┐
│              Claude Code 权限三层模型                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐   Claude 想做某个操作                       │
│  │  请求发出  │                                           │
│  └────┬─────┘                                            │
│       ↓                                                  │
│  ┌──────────┐   在 deny 名单里？                          │
│  │  deny 层  │── 是 → 🚫 直接拒绝，连问都不问              │
│  └────┬─────┘                                            │
│       ↓ 不在                                              │
│  ┌──────────┐   在 ask 名单里？                           │
│  │  ask 层   │── 是 → 🤔 弹窗问你"可以吗？"               │
│  └────┬─────┘                                            │
│       ↓ 不在                                              │
│  ┌──────────┐   在 allow 名单里？                         │
│  │ allow 层  │── 是 → ✅ 自动通过，丝滑执行                │
│  └────┬─────┘                                            │
│       ↓ 都不在                                            │
│  ┌──────────┐                                            │
│  │ 默认行为  │── 根据当前模式决定（后面详细讲）              │
│  └──────────┘                                            │
│                                                          │
│  优先级：deny &gt; ask &gt; allow &gt; 默认行为                     │
│  记住这个顺序，永远是 deny 优先                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
</code></pre><p>关键来了——<strong>deny 永远优先级最高</strong>。就算你在 allow 里写了允许读 <code>.env</code> 文件，只要 deny 里也有这条规则，Claude 就死也读不了。这是安全底线，不可妥协。</p><p>理解了这个模型，后面所有的配置就都是在这三层里做文章。</p><h2 id="f1m4h"><strong>五种权限模式：从"保姆模式"到"全自动"</strong></h2><p>Claude Code 内置了五种预设的权限模式，覆盖从最保守到最激进的所有场景。你可以在会话中按 <strong>Shift+Tab</strong> 快速切换，也可以在 <code>settings.json</code> 里设置默认模式。</p><pre><code>┌──────────────────────────────────────────────────────────┐
│            五种权限模式对比                                  │
├────────────┬���─────────────────┬──────────────────────────┤
│ 模式        │ 行为              │ 适用场景                 │
├────────────┼──────────────────┼──────────────────────────┤
│            │ 读文件自动通过     │                          │
│ default    │ 写文件需要确认     │ 新手期，建立信任          │
│ (默认)     │ 命令需要确认       │                          │
├────────────┼──────────────────┼──────────────────────────┤
│            │ 读文件自动通过     │                          │
│ acceptEdits│ 写文件自动通过 ✨  │ 日常开发主力模式 ⭐      │
│            │ 命令需要确认       │                          │
├────────────┼──────────────────┼──────────────────────────┤
│            │ 只能读和分析       │                          │
│ plan       │ 不能写、不能执行   │ 探索不熟悉的代码库        │
│            │ 只出方案不动手     │                          │
├────────────┼──────────────────┼──────────────────────────┤
│            │ 读写命令全自动     │                          │
│ dontAsk    │ 不再询问你        │ 熟练后的高信任场景        │
│            │ 但不跳过安全检查   │                          │
├────────────┼──────────────────┼──────────────────────────┤
│ bypass     │                  │                          │
│ Permissions│ 完全跳过所有检查   │ 仅限 Docker 容器内       │
│ ⚠️ 危险    │ 相当于 sudo       │ 绝不建议本地使用          │
└────────────┴──────────────────┴──────────────────────────┘
</code></pre><p><strong>我的推荐</strong>：日常开发用 <code>acceptEdits</code>，它是效率和安全的最佳平衡点。</p><p>为什么？因为在写代码这件事上，你大概率是希望 Claude 直接改的——毕竟你都让它重构代码了，肯定是希望它直接写入文件。但执行 shell 命令（比如 <code>npm install</code>、<code>git push</code>）的时候，你还是想看一眼再确认。</p><p><code>acceptEdits</code> 正好就是这个逻辑：<strong>改代码随便改，跑命令先问我</strong>。</p><p>切换方式——在交互模式中按 <strong>Shift+Tab</strong>，你会看到状态栏在三种模式间循环：</p><pre><code>normal-mode → ⏵⏵ accept edits on → ⏸ plan mode on → normal-mode
</code></pre><p>或者直接在配置文件里写死默认模式（后面会讲怎么配）。</p><h2 id="8s9m0"><strong>权限规则实战：打造你的"黄金配置"</strong></h2><p>理解了模型和模式之后，我们来动手配置。这是本篇的核心实操。</p><h3 id="167jp"><strong>配置文件在哪？</strong></h3><pre><code>┌──────────────────────────────────────────────────────────┐
│            权限配置文件位置                                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ~/.claude/settings.json                                 │
│  ├── 全局配置，所有项目通用                                │
│  └── 你对 Claude Code 的"底线要求"                        │
│                                                          │
│  项目根目录/.claude/settings.json                          │
│  ├── 项目级配置，提交到 Git 跟团队共享                      │
│  └── 这个项目专属的权限规则                                │
│                                                          │
│  项目根目录/.claude/settings.local.json                    │
│  ├── 个人本地配置，不提交到 Git                             │
│  └── 你自己的偏好，不影响队友                               │
│                                                          │
│  优先级：local &gt; project &gt; global                          │
│  → 越具体的配置，优先级越高                                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
</code></pre><h3 id="cbdg7"><strong>DevPulse 项目的权限配置实操</strong></h3><p>还记得上一篇我们创建的 DevPulse 项目吗？现在给它配一套权限。</p><p>在 DevPulse 项目根目录下创建 <code>.claude/settings.json</code>：</p><pre><code>{
  "permissions": {
    "defaultMode": "acceptEdits",

    "allow": [
      "Read",
      "Edit(./src/**)",
      "Write(./src/**)",
      "MultiEdit(./src/**)",
      "Bash(npm run dev)",
      "Bash(npm run build)",
      "Bash(npm run lint)",
      "Bash(npm run test *)",
      "Bash(npx tsc --noEmit)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git log *)",
      "Bash(ls *)",
      "Bash(cat *)",
      "Bash(mkdir *)"
    ],

    "ask": [
      "Bash(git push *)",
      "Bash(npm install *)",
      "Bash(npx prisma migrate *)"
    ],

    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(curl *)",
      "Read(./.env*)",
      "Read(./secrets/**)",
      "Edit(./.env*)",
      "WebFetch"
    ]
  }
}
</code></pre><p>这份配置翻译成人话就是：</p><p><strong>allow（自动通过）</strong>：读任何文件、编辑 src 目录下的代码、跑开发/构建/测试命令、常规 Git 操作——这些都是日常高频操作，不用每次都问我。</p><p><strong>ask（问我一声）</strong>：推代码到远程、安装新依赖、执行数据库迁移——这几个操作有一定风险，让我确认一下。</p><p><strong>deny（绝对禁止）</strong>：删除操作、sudo 提权、curl 外部请求、读取环境变量文件——不管什么情况，这些操作一律拦截。</p><h3 id="d8l4c"><strong>规则语法速查</strong></h3><pre><code>┌───────────────────────────────────────────────────────┐
│           权限规则语法参考                                │
├────────────────────���──────────────────────────────────┤
│                                                       │
│  工具类规则：                                           │
│  Read              → 允许读取所有文件                   │
│  Read(./src/**)    → 只允许读 src 目录及子目录           │
│  Edit(./src/**)    → 只允许编辑 src 目录及子目录         │
│  Write(./src/**)   → 只允许在 src 目录创建新文件         │
│                                                       │
│  命令类规则：                                           │
│  Bash(npm run *)   → 允许所有 npm run 开头的命令         │
│  Bash(git status)  → 只允许 git status 这一个命令       │
│  Bash(git diff *)  → 允许 git diff 加任意参数           │
│                                                       │
│  通配符：                                               │
│  *    → 匹配任意字符                                    │
│  **   → 匹配任意层级的目录                              │
│                                                       │
│  特殊注意：                                             │
│  deny 里的 Read 和 Edit 是独立的！                      │
│  deny Read(.env) 不会阻止 Edit(.env)                   │
│  如果要完全封锁，两个都要写                               │
│                                                       │
└───────────────────────────────────────────────────────┘
</code></pre><h3 id="3lvm5"><strong>/permissions 命令：不用手写 JSON</strong></h3><p>如果你不想手动编辑 JSON 文件，Claude Code 提供了交互式配置界面。在会话中输入：</p><pre><code>/permissions
</code></pre><p>它会弹出一个交互式菜单，让你添加或移除权限规则。另外，当 Claude 询问你是否允许某个操作时，你选择"Always allow"会自动把这条规则加到你的 allowlist 里。</p><p>这种"用着用着就配好了"的方式其实很符合人的习惯——第一次问你，你同意并勾选"以后都允许"，下次就不问了。</p><h2 id="11i5j"><strong>配置前 vs 配置后：感受一下差距</strong></h2><p>为了让你直观体感权限配置的威力，我来做一组对比。</p><p><strong>场景</strong>：让 Claude 审查 DevPulse 项目 src/ 目录下的 5 个组件文件。</p><h3 id="dr4re"><strong>配置前��默认 default 模式，什么都没配）</strong></h3><pre><code>你: 审查 @src/components/ 下所有组件的代码质量

Claude: 我需要读取 src/components/Header.tsx，可以吗？
你: 同意 ✅
Claude: 我需要读取 src/components/Footer.tsx，可以吗？
你: 同意 ✅
Claude: 我需要读取 src/components/ArticleCard.tsx，可以吗？
你: 同意 ✅
Claude: 我需要读取 src/components/Sidebar.tsx，可以吗？
你: 同意 ✅
Claude: 我需要读取 src/components/NavMenu.tsx，可以吗？
你: 同意 ✅ （已经开始不耐烦了）
Claude: 我发现 Header.tsx 有个性能问题，需要修改，可以吗？
你: 同意 ✅
Claude: Footer.tsx 的类型定义不够严格，需要修改，可以吗？
你: 同意 ✅ （彻底失去耐心）
...

总共弹出确认框：10+ 次
实际干活时间：5 分钟
等你点"同意"的时间：2 分钟
</code></pre><h3 id="m5p7"><strong>配置后（acceptEdits + 上面那份 settings.json）</strong></h3><pre><code>你: 审查 @src/components/ 下所有组件的代码质量

Claude: [自动读取 5 个文件... 自动分析... 自动修改 2 个文件...]

审查完成，以下是发现的问题和已应用的修复：

🔴 Header.tsx：存在不必要的重渲染
   → 已用 React.memo 包裹，并提取常量到组件外部

🟡 Footer.tsx：Props 类型使用了 any
   → 已替换为明确的 FooterProps 接口

🟢 其余 3 个组件代码质量良好，无需修改

总共弹出确认框：0 次
实际干活时间：3 分钟
等你点"同意"的时间：0 分钟
</code></pre><p><strong>同样的任务，体感完全不一样。</strong> 从"Claude 在干活，但每一步都要你盯着点头"，变成了"你说一句话，Claude 跑完了把结果汇报给你"。</p><p>这就是本篇的"顿悟时刻"：<strong>权限不是枷锁，是遥控器。</strong> 你调好了频道，电视就��己播了。</p><h2 id="bvm2l"><strong>@mentions 文件引用：最被低估的提效武器</strong></h2><p>权限配好之后，你需要学会另一个让效率翻倍的技巧——<code>@mentions</code> 文件引用。</p><p>上一篇简单提到过这个功能，现在深入讲讲。</p><h3 id="2tl77"><strong>基本用法</strong></h3><p>在交互模式中，输入 <code>@</code> 然后开始打文件名，Claude Code 会弹出匹配列表供你选择：</p><pre><code>┌──────────────────────────────────────────────────────────┐
│           @mentions 四种引用方式                            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ① 单文件引用                                             │
│     @src/app/page.tsx                                    │
│     → Claude 获得这个文件的完整内容                        │
│                                                          │
│  ② 多文件引用                                             │
│     @src/app/page.tsx @src/app/layout.tsx                │
│     → Claude 同时获得两个文件的上下文                      │
│                                                          │
│  ③ 目录引用                                               │
│     @src/components/                                     │
│     → Claude 获得该目录下所有文件的上下文                  │
│                                                          │
│  ④ 图片引用                                               │
│     直接拖拽图片或粘贴截图                                 │
│     → Claude 分析图片内容（设计稿、报错截图等）             │
│                                                          │
└──────────────────────────────────────────────────────────┘
</code></pre><h3 id="4fe3h"><strong>为什么 @mentions 比复制粘贴好？</strong></h3><p>你可能会想：我直接把代码贴进去不也一样吗？</p><p>不一样。差别很大。</p><p><strong>复制粘贴的问题</strong>：你只能贴你看到的片段。可能漏掉了 import 语句、类型定义、相关的工具函数。Claude 拿到的是残缺的上下文，给出的建议自然也不够准确。</p><p><strong>@mentions 的好处</strong>：Claude 读��的是完整文件。它能看到所有的 import、所有的类型、所有的注释、文件开头的 <code>'use client'</code> 标记。完整的上下文 = 更精准的分析。</p><p>打个比方：复制粘贴就像给医生看了一张局部 X 光片，@mentions 是做了一个全身 CT。你觉得哪个诊断更准？</p><h3 id="decmp"><strong>@mentions 实战技巧</strong></h3><p><strong>技巧 1：审查时引用组件和它的类型定义</strong></p><pre><code>审查 @src/components/ArticleCard.tsx，
同时参考 @src/types/article.ts 中的类型定义，
看看组件的 Props 设计是否合理
</code></pre><p>这样 Claude 既看到了组件实现，又看到了类型定义，能给出更全面的建议。</p><p><strong>技巧 2：跨文件问题定位</strong></p><pre><code>@src/app/page.tsx 首页有 hydration 报错，
请结合 @src/app/layout.tsx 和 @src/components/Header.tsx 分析，
可能是哪个组件的服务端/客户端组件划分不对
</code></pre><p>Next.js 里的 hydration 问题经常跨多个文件，把相关文件全部 @ 进去，Claude 排查起来快得多。</p><p><strong>技巧 3：用目录引用做全局分析</strong></p><pre><code>分析 @src/app/api/ 目录下所有 API 路由，
检查是否有统一的错误处理、是否有缺失的参数校验
</code></pre><p>一次 @ 一个目录，Claude 自动遍历所有文件，帮你做"全面体检"。</p><p><strong>技巧 4：图片引用做 UI 还原</strong></p><p>拿到设计师的设计稿？直接拖拽到 Claude Code 里：</p><pre><code>[拖拽设计稿图片]
根据这张设计稿，帮我实现 DevPulse 的文章详情页，
使用 Tailwind CSS，要做到像素级还原
</code></pre><h2 id="6sqlo"><strong>四大核心工作流</strong></h2><p>安装会了、权限配了、@mentions 学了——现在把它们组合起来，形成你每天都会用的四个核心工作流。</p><h3 id="f0u2m"><strong>工作流一：代码审查</strong></h3><p>这是使用频率最高的工作流。</p><pre><code>你: 审查 @src/components/ArticleCard.tsx，关注以下方面：
    1. TypeScript 类型安全
    2. 组件是否符合 Next.js 14 最佳实践
    3. 性能隐患（不必要的重渲染、缺少 memo 等）
    4. 可读性和命名规范
</code></pre><p>Claude 会逐项分析，给出具体的问题位置和修复建议。如果你配了 <code>acceptEdits</code> 模式，它还会直接帮你修改。</p><p><strong>小贴士</strong>：审查的时候给 Claude 列一个具体的检查清单，而不是说"帮我看看代码"。越具体，结果越好。</p><h3 id="483na"><strong>工作流二：功能实现</strong></h3><p>当你需要开发新功能时：</p><pre><code>你: 给 DevPulse 添加暗色模式切换功能：
    - 在 @src/components/Header.tsx 的导航栏右侧添加切换按钮
    - 使用 next-themes 库实现主题切换
    - 参考 @src/app/layout.tsx 的现有布局
    - 暗色模式下的配色方案：背景 #1a1a2e，文字 #e0e0e0
    - 用户选择要持久化到 localStorage
</code></pre><p>关键点：<strong>描述越具体，Claude 生成的代码越贴合你的需求。</strong> 把技术方案、UI 细节、参考文件都写进去。</p><h3 id="crmlj"><strong>工作流三：Bug 修复</strong></h3><p>遇到 Bug 时，给 Claude 三样东西：现象描述 + 错误信息 + 相关文件。</p><pre><code>你: DevPulse 首页文章列表出现了报错：
    错误信息："Hydration failed because the initial UI 
    does not match what was rendered on the server"
    
    相关文件：
    @src/app/page.tsx
    @src/components/ArticleList.tsx
    @src/components/ArticleCard.tsx
    
    请帮我定位问题原因并修复
</code></pre><p>Claude 会分析代码，找到服务端渲染和客户端渲染不一致的地方，然后修复它。这种 Next.js 的 hydration 问题对人来说排查起来很头疼，但对 Claude 来说是强项。</p><h3 id="9f45j"><strong>工作流四：Git 操作</strong></h3><p>Claude Code 内置了完整的 Git 能力。你不用切窗口去敲 Git 命令：</p><pre><code>你: 看看我现在改了哪些文件，帮我做一次提交，
    commit message 用英文，格式是 type(scope): description
</code></pre><p>Claude 会执行 <code>git status</code> 查看变更，<code>git diff</code> 检查差异，然后自动生成一个规范的 commit message 并提交。</p><p>更进阶的用法：</p><pre><code>你: 帮我把最近 5 次提交整理成一份 changelog，
    按 Features / Bug Fixes / Refactoring 分类
</code></pre><p>这四个工作流覆盖了日常开�� 90% 的场景。先练熟这四个，后面的子代理、MCP、Hooks 都是在这四个基础工作流上"加装涡轮"。</p><h2 id="61lkp"><strong>五个快捷键，练到肌肉记忆</strong></h2><p>日常交互中最高频的五个快捷键，建议你花十分钟练一下，形成肌肉记忆：</p><pre><code>┌──────────────────────────────────────────────────────────┐
│          五大高频快捷键                                     │
├────────────┬────────────────────┬────────────────────────┤
│ 快捷键      │ 作用               │ 使用场景               │
├────────────┼────────────────────┼────────────────────────┤
│ Ctrl+C     │ 中断当前操作        │ Claude 跑偏了，紧急刹车  │
│ Ctrl+D     │ 退出会话            │ 干完活了，下班           │
│ Esc Esc    │ 撤销最近的修改      │ Claude 改出 Bug 了       │
│ Shift+Tab  │ 切换权限模式        │ 临时调整自动/手动        │
│ Ctrl+R     │ 搜索历史提示词      │ 复用之前输过的 prompt    │
└────────────┴────────────────────┴────────────────────────┘
</code></pre><p>重点说两个：</p><p><strong>Esc Esc（连按两次）</strong>——这是你的"后悔药"。Claude 改了代码你觉得不对？连按两次 Esc，它会回退到修改前的状态。跟上一篇讲的 <code>claude -r</code> 检查点恢复是配合使用的，但 Esc Esc 更快，适合小范围回退。</p><p><strong>Ctrl+R</strong>——搜索历史提示词。你上周写过一段很好的代码审查 prompt，这周想再用？Ctrl+R 搜一下关键词就能找到，不用重新打一遍。<strong>这个功能太多人不知道了，每天能省好几分钟。</strong></p><h2 id="8kugv"><strong>安全最佳实践：三条红线</strong></h2><p>权限配得再宽松，这三条红线不能碰：</p><p><strong>红线一：永远不要 approve 你看不懂的 Bash 命令</strong></p><p>Claude 有时候会生成一段复杂的 shell 命令。如果你不理解它要做什么，不要直接同意。让 Claude 先解释这段命令的作用，确认安全后再执行。</p><p><strong>红线二：.env 文件必须在 deny 名单里</strong></p><p>你的 <code>.env</code> 文件里存着数据库密码、API Key、各种机密信息。把 <code>Read(./.env*)</code> 和 <code>Edit(./.env*)</code> 都放到 deny 里，堵死这个口子。</p><p><strong>红线三：生产环境操作用 plan 模式</strong></p><p>如果你在生产代码库里工作，先切到 <code>plan</code> 模式。让 Claude 只分析、只出方案、不动手。确认方案没问题后再切回 <code>acceptEdits</code> 执行。这就像做手术前先拍片子看清楚——别上来就动刀。</p><h2 id="afj99"><strong>一份你能直接复制的全局配置</strong></h2><p>最后，送你一份经过实战验证的全局配置模板。把它放到 <code>~/.claude/settings.json</code>，作为你所有项目的基础配置。</p><pre><code>{
  "permissions": {
    "defaultMode": "acceptEdits",

    "allow": [
      "Read",
      "Bash(ls *)",
      "Bash(cat *)",
      "Bash(head *)",
      "Bash(tail *)",
      "Bash(wc *)",
      "Bash(find *)",
      "Bash(grep *)",
      "Bash(echo *)",
      "Bash(mkdir *)",
      "Bash(git status)",
      "Bash(git log *)",
      "Bash(git diff *)",
      "Bash(git branch *)",
      "Bash(git show *)",
      "Bash(node --version)",
      "Bash(npm --version)",
      "Bash(npx tsc --noEmit)"
    ],

    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(curl *)",
      "Bash(wget *)",
      "Read(./.env*)",
      "Read(./secrets/**)",
      "Read(./**/credentials*)",
      "Edit(./.env*)",
      "Edit(./secrets/**)",
      "WebFetch"
    ]
  }
}
</code></pre><p>这是全局的"安全底线"。在具体项目中，你再通过项目级的 <code>.claude/settings.json</code> 添加项目特有的 allow 规则（比如 <code>npm run dev</code>、<code>npx prisma</code> 之类的命令）。</p><p>两层配置叠加起来的效果：</p><pre><code>┌──────────────────────────────────────────────────────────┐
│          全局 + 项目 两层配置协作                            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  全局 (~/.claude/settings.json)                           │
│  ├── deny: rm -rf、sudo、.env、secrets     ← 安全底线    │
│  ├── allow: 读文件、ls、cat、git查询类      ← 通用便利    │
│  └── 所有项目自动继承                                     │
│                                                          │
│  项目 (.claude/settings.json)                              │
│  ├── allow: npm run dev/build/test         ← 项目专属    │
│  ├── allow: Edit(./src/**)                 ← 项目专属    │
│  ├── ask: git push、npm install            ← 项目专属    │
│  └── 只对当前项目生效                                     │
│                                                          │
│  最终效果：                                                │
│  ✅ 读任何文件 → 自动通过                                 │
│  ✅ 改 src 下的代码 → 自动通过                             │
│  ✅ 跑开发/测试命令 → 自动通过                             │
│  🤔 推代码/装依赖 → 问你一声                               │
│  🚫 删除/提权/.env → 直接拦截                              │
│                                                          │
└──────────────────────────────────────────────────────────┘
</code></pre><p>这套配置用下来，你的权限提示会减少 80% 以上，但安全底线一丝不动。</p><h2 id="adoju"><strong>本篇小结</strong></h2><p>三个核心收获：</p><p><strong>第一</strong>，权限系统的本质是三层过滤器——deny（拒绝）&gt; ask（询问）&gt; allow（通过），优先级从高到低。理解这个模型，所有配置都水到渠成。</p><p><strong>第二</strong>，五种权限模式中，<code>acceptEdits</code> 是日常开发的最佳选择——代码编辑自动通过，命令执行需要确认。按 Shift+Tab 随时切换。</p><p><strong>第三</strong>，<code>@mentions</code> 文件引用 + 四大工作流（审查、实现、修复、Git）是你每天的主力操作。把 @mentions 用熟，效率立竿见影。</p><h3 id="4l94v"><strong>Level 1 通关检查清单</strong></h3><ul><li>[ ] 理解权限的三层模型（deny &gt; ask &gt; allow）</li><li>[ ] 知道五种权限模式的区别，日常使用 acceptEdits</li><li>[ ] 为你的项目配置了 <code>.claude/settings.json</code></li><li>[ ] 配好了全局的 <code>~/.claude/settings.json</code> 安全底线</li><li>[ ] 熟练使用 @mentions 引用文件和目录</li><li>[ ] 完成过一次完整的代码审查工作流</li><li>[ ] 完成过一次完整的功能实现工作流</li><li>[ ] 练熟了五个核心快捷键</li></ul><p>全部打勾？Level 1（入门篇）通关。</p><h2 id="dp403"><strong>下篇预告</strong></h2><p><strong>第 3 篇：Claude Code 通关手册（三）—— CLAUDE.md 完全指南：一个文件让 AI 秒懂你的项目</strong></p><p>下一篇进入 Level 2（配置篇），我们要解决一个更深层的效率问题——<strong>为什么每次开新会话，Claude 都像失忆了一样，对你的项目一无所知？</strong></p><p>答案是一个叫 CLAUDE.md 的文件。写好它，Claude 每次打开项目就自动带上完整上下文，不用你重复解释"我们用 TypeScript 严格模式""组件要函数式声明"这些废话。</p><p>我会提供完整的 Next.js 项目 CLAUDE.md 模板，以及好的 CLAUDE.md 和差的 CLAUDE.md 的对比分析。</p><hr><p><strong>今日话题</strong></p><p>你配完权限后，Claude Code 的体验有没有变化？你的 allow / deny 里都放了什么规则？评论区晒出你的配置，互相抄作业。</p><p>如果这篇文章帮你解决了"权限烦恼"，欢迎<strong>点赞、在看、转发</strong>三连——让更多被权限折磨的同学看到解决方案。</p><p><strong>关注「前端达人」</strong>，这个系列还有 8 篇硬核内容等你解锁，我们下篇见。</p>
    `.trim(),
  };
