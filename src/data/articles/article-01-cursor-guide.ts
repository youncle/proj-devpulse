import type { Article } from '@/types/article';

export const article: Article =   {
    title: 'Claude Code 通关手册（一）：Cursor 用户转 Claude Code，后悔没早点用',
    excerpt:
      'Claude Code 不是另一个 Cursor！它是一款革命性的 AI 编程平台，提供终端界面实现全流程自动化开发。本文带你 5 分钟装好跑起来，理解它凭什么让开发者"回不去了"。',
    date: '2026-03-12',
    category: '人工智能',
    tags: ['Claude Code', 'AI', '开发工具'],
    slug: 'claude-code-cursor-guide',
    content: `
<p>这是「Claude Code 通关手册」系列的第 1 篇，共 10 篇。本系列将带你从零开始，系统掌握 Claude Code 的完整知识体系——从 CLI 命令到自动化工作流，从个人使用到团队协作。</p>

<p>你可能已经在用 Cursor 写代码了。</p>
<p>每天打开编辑器，Tab 一下自动补全，Cmd+K 唤出 AI 对话框，写写改改，效率还不错。</p>
<p>然后某天你听说了 Claude Code，装上一看——一个光秃秃的终端界面，没有花哨的 UI，没有智能补全的小弹窗，甚至没有一个像样的"开始"按钮。</p>
<p><strong>你的第一反应大概率是：就这？</strong></p>
<p>别急着关掉它。这个看起来"简陋"的终端工具，藏着一套完全不同的 AI 编程哲学。</p>
<p>今天这篇文章，我不会铺天盖地地讲功能列表，而是带你搞清楚三件事：Claude Code 到底是什么定位、怎么 5 分钟装好跑起来、以及它凭什么让越来越多的开发者"回不去了"。</p>

<h2>先搞清一件事：Claude Code 不是"另一个 Cursor"</h2>
<p>很多人踩的第一个坑，就是拿 Cursor 的思维去理解 Claude Code。</p>
<p>打个比方你就明白了——</p>
<p>你去餐厅吃饭。<strong>Copilot 是那个帮你递菜单、推荐菜品的服务员</strong>，你点什么它建议什么，效率确实高。<strong>Cursor 是一个坐在你旁边的美食顾问</strong>，你边吃边聊，它能帮你分析菜品搭配、调整口味，甚至帮你跟厨房沟通。</p>
<p><strong>那 Claude Code 呢？它是后厨的总调度。</strong></p>
<p>它不坐在你面前陪你聊天，而是直接进厨房——调配原料、指挥厨师、控制出菜节奏、管理整条流水线。你说"我要一桌川菜宴席"，它就去把整桌菜给你安排出来。</p>
<p>翻译成技术语言：</p>

<pre><code>┌──────────────────────────────────────────────────────┐
│               AI 编程工具的三个层次                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────┐                                  │
│  │   Copilot       │  代码补全层                      │
│  │   "服务员"      │  → 你写一行，它补下一行           │
│  └───────┬────────┘                                  │
│          ↓                                           │
│  ┌────────────────┐                                  │
│  │   Cursor        │  IDE 集成层                      │
│  │   "美食顾问"    │  → 你改一个文件，它帮你优化       │
│  └───────┬────────┘                                  │
│          ↓                                           │
│  ┌────────────────┐                                  │
│  │  Claude Code    │  平台层                          │
│  │   "后厨总调度"  │  → 你描述需求，它跑完整个流程     │
│  └────────────────┘                                  │
│                                                      │
│  关键区别：                                            │
│  Copilot 帮你写一行代码                                │
│  Cursor 帮你改一个文件                                 │
│  Claude Code 帮你跑完一个流程                          │
└──────────────────────────────────────────────────────┘</code></pre>

<p>这不是谁好谁差的问题——而是它们根本就不在同一个维度上竞争。</p>
<p><strong>Cursor 的核心价值是"编辑器里的 AI 助手"，Claude Code 的核心价值是"可编程的 AI 开发平台"。</strong></p>
<p>为什么终端界面反而是优势？因为终端意味着：</p>
<ul>
  <li><strong>可脚本化</strong>——你能用 bash 脚本调用它，定时执行任务</li>
  <li><strong>可编程</strong>——官方提供 TypeScript 和 Python SDK，你能像调用函数一样调用它</li>
  <li><strong>可集成</strong>——塞进 GitHub Actions、CI/CD 流水线，7×24 小时自动运转</li>
  <li><strong>可扩展</strong>——子代理、MCP 协议、Hooks、Plugins，一整套扩展生态</li>
</ul>
<p>一句话总结：<strong>Cursor 是你的 AI 副驾驶，Claude Code 是你的 AI 自动驾驶系统。</strong> 副驾驶再好，也得你握方向盘。自动驾驶系统——你可以告诉它目的地，然后去喝杯咖啡。</p>

<h2>系列路线图：10 篇带你从入门到自动化</h2>
<p>在正式动手之前，先给你看一下全局地图，这样你心里有数——我们要走多远，现在在哪里。</p>

<pre><code>┌─────────────────────────────────────────────────────┐
│            Claude Code 通关手册 · 10 篇路线图          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ★ 入门篇（你在这里）                                 │
│  ┌─────────────────────────────────────────┐        │
│  │ ① 安装 &amp; CLI 核心命令     ← 本篇 ★       │        │
│  │ ② 权限系统 &amp; @mentions 工作流            │        │
│  └─────────────────────────────────────────┘        │
│                    ↓                                 │
│  配置篇                                              │
│  ┌─────────────────────────────────────────┐        │
│  │ ③ CLAUDE.md — 给 AI 一份项目说明书       │        │
│  │ ④ 自定义命令 &amp; 模型选择策略               │        │
│  └─────────────────────────────────────────┘        │
│                    ↓                                 │
│  扩展篇                                              │
│  ┌─────────────────────────────────────────┐        │
│  │ ⑤ 子代理 — 从单兵作战到 AI 团队          │        │
│  │ ⑥ MCP 协议 — 连接整个开发生态            │        │
│  │ ⑦ Hooks + Skills + Plugins              │        │
│  └─────────────────────────────────────────┘        │
│                    ↓                                 │
│  自动化篇                                            │
│  ┌─────────────────────────────────────────┐        │
│  │ ⑧ Headless + SDK — 用代码指挥 AI         │        │
│  │ ⑨ GitHub Actions + 沙箱安全              │        │
│  └─────────────────────────────────────────┘        │
│                    ↓                                 │
│  协作篇                                              │
│  ┌─────────────────────────────────────────┐        │
│  │ ⑩ 从个人利器到团队基建                    │        │
│  └─────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘</code></pre>

<p>每一篇都会围绕一个真实的 <strong>Next.js 技术博客项目（DevPulse）</strong> 来做实操演示。不是干巴巴讲概念，而是每篇都有你能跟着做出来的东西。</p>

<h2>安装 Claude Code：三条路线，选适合你的</h2>
<p><strong>2026 年 2 月的重要更新</strong>：Anthropic 官方已经将 npm 安装标记为<strong>废弃（deprecated）</strong>，推荐使用原生安装器。原生安装器不依赖 Node.js，启动更快，自动更新。</p>

<h3>路线一：原生安装器（官方推荐）</h3>
<p><strong>macOS / Linux：</strong></p>
<pre><code>curl -fsSL https://claude.ai/install.sh | bash</code></pre>
<p>安装完成后，重新加载你的 shell 配置：</p>
<pre><code># 如果你用 zsh（macOS 默认）
source ~/.zshrc

# 如果你用 bash
source ~/.bashrc</code></pre>
<p><strong>Windows（PowerShell）：</strong></p>
<pre><code>irm https://claude.ai/install.ps1 | iex</code></pre>
<p>验证安装：</p>
<pre><code>claude --version</code></pre>
<p>如果遇到问题，Claude Code 内置了一个"医生"命令：</p>
<pre><code>claude doctor</code></pre>

<h3>路线二：Homebrew（macOS 用户的备选）</h3>
<pre><code>brew install claude-code</code></pre>
<p>注意：Homebrew 安装<strong>不会</strong>自动更新，需要你手动执行 <code>brew upgrade claude-code</code>。</p>

<h3>路线三：npm（仍然可用，但已废弃）</h3>
<pre><code>npm install -g @anthropic-ai/claude-code</code></pre>

<h3>认证：两种付费方式</h3>

<pre><code>┌──────────────────────────────────────────────────────┐
│              Claude Code 认证方式对比                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  方式一：Claude Pro / Max 订阅                         │
│  ├── 固定月费，适合高频使用者                           │
│  ├── 首次启动时浏览器弹窗登录                          │
│  └── 推荐给日常开发使用的同学                          │
│                                                      │
│  方式二：API Key（按量付费）                            │
│  ├── 用多少付多少，适合偶尔使用或自动化场景              │
│  ├── 在 Anthropic Console 获取 Key                    │
│  └── 设置环境变量：                                    │
│      export ANTHROPIC_API_KEY="your-key-here"         │
│      （加到 ~/.zshrc 或 ~/.bashrc 中持久生效）          │
│                                                      │
└──────────────────────────────────────────────────────┘</code></pre>

<p>第一次启动 <code>claude</code> 命令时，它会引导你完成认证流程，跟着提示走就行。</p>

<h2>四个命令打天下：90% 的日常工作就靠它们</h2>
<p>Claude Code 的命令其实非常多，但你刚开始只需要记住四个。就像学开车——你不需要一上来就研究发动机原理，先学会启动、刹车、转向、倒车，就能上路了。</p>

<h3>命令一：<code>claude</code> —— 启动交互模式</h3>
<pre><code># 进入你的项目目录
cd your-project

# 启动 Claude Code
claude</code></pre>
<p>这是你最常用的命令，没有之一。输入 <code>claude</code> 后回车，你就进入了一个交互式对话界面。在这里，你可以用自然语言跟 Claude 交流，让它帮你分析代码、写功能、修 Bug、做重构。</p>
<p><strong>重要细节</strong>：一定要先 <code>cd</code> 到你的项目目录再启动。Claude Code 会自动读取当前目录下的文件，作为它理解你项目的上下文。</p>

<h3>命令二：<code>claude -p "提示词"</code> —— 单次执行</h3>
<pre><code># 问一个问题，得到回答后自动退出
claude -p "这个项目的目录结构是怎样的？给我一个概览"</code></pre>
<p><code>-p</code> 是 <code>--print</code> 的缩写。它执行一次提示，输出结果，然后自动退出。不会进入交互模式。</p>
<p>什么时候用它？</p>
<ul>
  <li>写 shell 脚本串联自动化任务时</li>
  <li>快速问一个不需要多轮对话的问题时</li>
  <li>需要把 Claude 的输出 pipe 给其他命令时</li>
</ul>
<pre><code># 高级用法：输出 JSON 格式，方便程序解析
claude -p "列出 src/ 下所有组件文件" --output-format json</code></pre>
<p>打个比方：如果 <code>claude</code> 是开一场会，那 <code>claude -p</code> 就是发一条微信消息——问完就走，不用寒暄。</p>

<h3>命令三：<code>claude -c</code> —— 继续上次对话</h3>
<pre><code># 继续你最近的那次对话
claude -c</code></pre>
<p>你昨天跟 Claude 讨论了一个复杂的重构方案，今天想接着聊。不用重新解释背景，<code>-c</code>（<code>--continue</code>）帮你无缝衔接。</p>

<h3>命令四：<code>claude -r</code> —— 从检查点恢复</h3>
<pre><code># 回到上一个安全点
claude -r</code></pre>
<p>Claude Code 有一个叫"检查点（Checkpoint）"的机制——每次它做修改之前，会自动保存当前状态。如果它改出了问题，<code>-r</code>（<code>--resume</code>）让你一秒回到之前的安全点。</p>

<pre><code>┌──────────────────────────────────────────────────────┐
│              Claude Code 四大核心命令                    │
├──────────┬───────────────────┬────────────────────────┤
│ 命令      │ 用途               │ 比喻                   │
├──────────┼───────────────────┼────────────────────────┤
│ claude   │ 启动交互模式        │ 开一场面对面会议        │
│ claude -p│ 单次执行            │ 发一条微信消息          │
│ claude -c│ 继续上次对话        │ 昨天的会议今天接着开    │
│ claude -r│ 从检查点恢复        │ 游戏读档               │
└──────────┴───────────────────┴────────────────────────┘</code></pre>

<h2>实战演练：用 Claude Code 初始化 DevPulse 项目</h2>
<p>概念讲完了，动手做一次你就全明白了。我们来创建一个 Next.js 技术博客项目——<strong>DevPulse</strong>。这个项目会贯穿整个系列，每篇文章都会在它基础上添加新功能。</p>

<h3>第一步：创建项目目录并启动 Claude Code</h3>
<pre><code>mkdir devpulse && cd devpulse
claude</code></pre>

<h3>第二步：用自然语言描述你的需求</h3>
<p>进入交互模式后，输入以下内容：</p>
<pre><code>帮我初始化一个 Next.js 14 项目，要求如下：
1. 使用 App Router（不用 Pages Router）
2. TypeScript 严格模式
3. Tailwind CSS 做样式
4. 项目名叫 DevPulse，是一个技术博客平台
5. 创建基础的首页布局，包含导航栏、文章列表区域、侧边栏
6. 组件放在 src/components/ 目录下
7. 页面放在 src/app/ 目录下</code></pre>
<p>然后你会看到 Claude Code 开始工作：它先分析你的需求，拟定执行计划，然后开始执行命令——<code>npx create-next-app@latest</code>，接着创建组件文件、编写页面代码，最后给你一个总结，告诉你它都做了什么。</p>

<h3>第三步：验证项目</h3>
<pre><code>cd devpulse
npm run dev</code></pre>
<p>打开浏览器访问 <code>http://localhost:3000</code>，你应该能看到 DevPulse 的初始页面了。</p>

<h3>第四步：用 Claude Code 做一次代码审查</h3>
<p>回到 Claude Code 的交互模式，输入：</p>
<pre><code>审查一下刚才生成的首页组件 @src/app/page.tsx，
看看有没有 TypeScript 类型问题、性能隐患、或者不符合 Next.js 14 最佳实践的地方</code></pre>
<p>注意这里的 <code>@src/app/page.tsx</code>——这是 Claude Code 的<strong>文件引用</strong>语法。用 <code>@</code> 符号加文件路径，Claude 会自动读取这个文件的完整内容作为上下文。</p>
<p>你还可以引用整个目录：</p>
<pre><code>审查 @src/components/ 目录下所有组件的代码质量</code></pre>

<h2>Claude Code 凭什么让人"回不去"？</h2>

<h3>特质一：它直接操作你的项目，而不是给你看代码片段</h3>
<p>你告诉它"给这个项目加上暗色模式"，它会自动找到需要修改的文件、创建新的组件、修改配置、甚至跑一下看看有没有报错。<strong>它不是给你一段代码让你自己贴，而是直接帮你把活干了。</strong></p>

<h3>特质二：它能"记住"你的项目</h3>
<p>通过 CLAUDE.md 文件，你可以把项目的架构、编码规范、技术栈信息写进去。Claude Code 每次启动都会自动读取这个文件。你不需要每次都解释"我们用 TypeScript 严格模式""组件要用函数式声明"这些废话。</p>

<h3>特质三：可编程，可自动化</h3>
<p>这是 Claude Code 最深层的杀手锏，也是它与所有 IDE 内置 AI 的根本区别。</p>
<pre><code>┌──────────────────────────────────────────────────────┐
│          Claude Code 能做但 Cursor 做不到的事           │
├──────────────────────────────────────────────────────┤
│                                                      │
│  场景一：每天凌晨自动扫描代码仓库，生成质量报告          │
│  场景二：每个 PR 提交后自动做 AI 代码审查              │
│  场景三：用 TypeScript SDK 构建自定义开发工具          │
│  场景四：多个 AI 子代理并行工作，各司其职              │
│  场景五：连接 GitHub、数据库、文档系统，跨平台协作      │
│                                                      │
│  关键词：脚本化、SDK、子代理、MCP、Hooks、Plugins      │
│                                                      │
└──────────────────────────────────────────────────────┘</code></pre>

<h2>几个新手常踩的坑，提前帮你避开</h2>
<p><strong>坑 1：在 HOME 目录启动 Claude Code</strong></p>
<p>永远先 <code>cd</code> 到项目目录再启动。</p>
<p><strong>坑 2：看到权限询问就烦了，直接关掉</strong></p>
<p>下一篇会教你怎么配置权限系统。</p>
<p><strong>坑 3：把 Claude Code 当聊天机器人</strong></p>
<p>你越具体、越技术化地描述需求，它的表现越好。</p>
<p><strong>坑 4：不知道 claude doctor 这个命令</strong></p>
<p>遇到任何安装或运行问题，先跑一次 <code>claude doctor</code>。</p>

<h2>本篇小结</h2>
<p>三个核心收获：</p>
<p><strong>第一</strong>，Claude Code 不是"终端版 Cursor"。它是一个可编程的 AI 开发平台。</p>
<p><strong>第二</strong>，四个命令就能开始干活：<code>claude</code>、<code>claude -p</code>、<code>claude -c</code>、<code>claude -r</code>。</p>
<p><strong>第三</strong>，<code>@</code> 文件引用是你最强的提效武器。</p>

<p><strong>通关检查清单</strong></p>
<ul>
  <li>[ ] Claude Code 安装成功，<code>claude --version</code> 有输出</li>
  <li>[ ] 认证完成，能正常启动交互模式</li>
  <li>[ ] 用 Claude Code 创建了 DevPulse 项目（或你自己的项目）</li>
  <li>[ ] 试过 <code>@</code> 文件引用做代码审查</li>
  <li>[ ] 试过 <code>claude -c</code> 继续上次对话</li>
  <li>[ ] 知道 <code>claude doctor</code> 这个排障命令</li>
</ul>
<p>全部打勾？恭喜通关第一关。</p>

<h2>下篇预告</h2>
<p><strong>第 2 篇：Claude Code 通关手册（二）—— 权限系统搞明白，效率直接翻倍</strong></p>
<p>下一篇我们要解决 Claude Code 最让新手抓狂的问题——"每一步都要问我同意不同意，烦死了！"</p>
<p>其实权限系统不是锁链，而是油门和刹车。学会调节，Claude Code 的速度感完全不一样。</p>
    `.trim(),
  };
