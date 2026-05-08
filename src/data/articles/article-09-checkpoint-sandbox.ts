import type { Article } from '@/types/article';

export const article: Article =   {
    title:
      'Claude Code 通关手册（九）：检查点 + 沙箱 + GitHub Actions，自动化',
    excerpt:
      'GitHub Actions 自动 PR 审查、检查点系统秒级回退、沙箱 OS 级安全隔离——三套系统结合让 Claude Code 既自主又可控。5 分钟完成配置，你的每个 PR 都会收到 AI 审查报告。',
    date: '2026-03-12',
    category: '人工智能',
    tags: ['Claude Code', 'AI', '开发工具'],
    slug: 'claude-code-checkpoint-sandbox-github-actions',
    content: `
<blockquote><p>这是「Claude Code 通关手册」系列的第 9 篇，共 10 篇。Level 4（高级篇）收官。这篇讲完，你的 Claude Code 自动化体系就完整了。</p></blockquote>
<p><a href="/blog/claude-code-cursor-guide">Claude Code 通关手册（一）：Cursor 用户转 Claude Code，第一天我就后悔了——后悔没早点用</a></p>
<p><a href="/blog/claude-code-permission-system">Claude Code 通关手册（二）：权限系统搞明白，效率直接翻倍</a></p>
<p><a href="/blog/claude-code-claude-md-guide">Claude Code 通关手册（三）：99%的人不知道的效率秘诀，CLAUDE.md 深度实战</a></p>
<p><a href="/blog/claude-code-slash-commands-guide">Claude Code 通关手册（四）：3 个自定义命令，让你的 Claude Code 快到飞起</a></p>
<p><a href="/blog/claude-code-sub-agent-system">Claude Code 通关手册（五）：子代理系统——给你的 AI 配一个"专家团队"</a></p>
<p><a href="/blog/claude-code-hooks-skills-plugins">Claude Code 通关手册（七）：打造 AI 自动化流水线，Hooks、Skills、Plugins 实战</a></p>

<p>从今天起，你的每个 PR 提交后就会收到一份 AI 代码审查报告——类型安全、性能隐患、安全风险、Next.js 最佳实践，全部自动检查。不用人盯着，不会遗漏，永不请假。</p>
<p>这不是概念演示，这是你读完本文就能配好的东西。</p>
<p>但光有云端自动化还不够。本地开发时，Claude 大刀阔斧改了 20 个文件结果改错了怎么办？Claude 执行了一个不该跑的命令怎么办？</p>
<p>所以这篇把三个东西放在一起讲——<strong>GitHub Actions</strong>（云端自动化）、<strong>检查点</strong>（本地后悔药）、<strong>沙箱</strong>（安全围栏）。三块拼图补齐，你的 Claude Code 就既能自主工作，又不会失控。</p>

<h2 id="github-actions">一、GitHub Actions 集成——让 AI 住进你的 CI/CD</h2>

<h3 id="quick-install">快速安装（推荐方式）</h3>
<p>最简单的方式是在 Claude Code 终端里直接跑：</p>
<pre><code>/install-github-app</code></pre>
<p>这个命令会引导你完成 GitHub App 安装和 Secret 配置。跟着提示走就行，大概 5 分钟搞定。</p>
<p>如果你更喜欢手动配置，往下看。</p>

<h3 id="manual-setup">手动配置：三步搞定</h3>
<p><strong>第一步：安装 Claude GitHub App</strong></p>
<p>访问 https://github.com/apps/claude ，把 App 安装到你的仓库。需要的权限：Contents（读写）、Issues（读写）、Pull requests（读写）。</p>
<p><strong>第二步：添加 API Key</strong></p>
<p>进入仓库的 Settings → Secrets and variables → Actions → New repository secret，添加 <code>ANTHROPIC_API_KEY</code>。</p>
<p><strong>第三步：创建 Workflow 文件</strong></p>
<p>把下面的文件放到 <code>.github/workflows/claude.yml</code>：</p>
<pre><code>name: ClaudeCode
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  claude:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'issues' && contains(github.event.issue.body, '@claude')) ||
      github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${ secrets.ANTHROPIC_API_KEY }}</code></pre>
<p>这个配置覆盖了两种触发方式：<strong>自动触发</strong>（每次 PR 创建或更新时）和 <strong>@claude 触发</strong>（在 issue 或 PR 评论中 @claude）。</p>

<h3 id="devpulse-review">DevPulse 专属：PR 审查定制</h3>
<p>上面是通用配置。对于 DevPulse 这样的 Next.js 项目，我们加一个专门的审查 Workflow：</p>
<pre><code># .github/workflows/claude-review.yml
name: Claude PR Review

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            审查这个 PR 的代码变更。你是一个 Next.js 14 + TypeScript 项目的资深审查员。

            逐文件检查以下维度：
            1. TypeScript 类型安全：有没有 any、类型断言是否合理
            2. Next.js 最佳实践：Server/Client Component 划分是否正确、数据获取方式是否合适
            3. 性能问题：有没有不必要的 re-render、大列表是否有优化
            4. 安全风险：有没有 XSS 隐患、敏感信息泄露

            对每个问题标注严重程度（🔴必须修复/🟡建议改进/🟢可选优化），
            并给出具体的修改建议和代码示例。

            最后给一个整体评分（1-10）和一句话总结。
          claude_args: "--max-turns 5 --model sonnet"</code></pre>
<p>合并到 main 分支后，每次有人提 PR，Claude 就会自动审查并把结果作为 PR 评论发出来。</p>

<h3 id="at-claude">@claude 交互模式</h3>
<p>除了自动审查，你还可以在任何 PR 或 Issue 的评论里 @claude 跟它对话：</p>
<pre><code>@claude 这个 API 路由有没有 SQL 注入风险？</code></pre>
<pre><code>@claude 帮我把这个 issue 描述的功能实现一下，完了提个 PR</code></pre>
<p>没错——Claude 不只能审查，还能<strong>直接写代码并创建 PR</strong>。不过自动创建 PR 需要把权限改为 <code>contents: write</code>，建议先从只读审查开始，熟悉之后再开放写权限。</p>

<h3 id="cost-control">成本控制</h3>
<p>GitHub Actions 里跑 Claude 有两个成本：Actions 运行时间 + API Token 消耗。几个建议：</p>
<ul>
  <li><strong>用 Sonnet 不用 Opus</strong>——审查任务 Sonnet 完全够用，Token 费便宜很多</li>
  <li>设 <code>--max-turns</code>——限制 Agent 循环次数，防止跑飞</li>
  <li><strong>加 concurrency 控制</strong>——同一个 PR 的多次 push 不要并行跑审查</li>
</ul>
<pre><code># 加在 jobs 同级
concurrency:
  group: claude-\${ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true</code></pre>
<p>这样同一个 PR 短时间内多次 push 只会跑最新那次，取消之前的。</p>

<h2 id="checkpoint">二、检查点系统——你的"后悔药"</h2>
<p>云端自动化解决了。回到本地开发——当你让 Claude 大刀阔斧改代码时，如果改错了怎么办？</p>

<h3 id="auto-save">自动存档</h3>
<p>Claude Code 会在<strong>每次文件编辑前自动创建检查点</strong>。你不用做任何配置，它默认就在工作。</p>
<p>就像一个极度勤快的助理，每次动手前都先拍一张快照——"改之前是这样的，您看看，改错了随时回来"。</p>

<h3 id="three-ways">三种回退方式</h3>
<p><strong>方式 1：Esc × 2（最快）</strong></p>
<p>连按两次 Esc 键，立即弹出回退菜单。这是日常最常用的方式——Claude 刚改完你觉得不对，两下 Esc 就回去了。</p>
<p><strong>方式 2：/rewind 命令</strong></p>
<pre><code>/rewind</code></pre>
<p>弹出一个可滚动的列表，显示本次会话中你的每一条提示词。选择要回退到的那条，然后选择回退策略。</p>
<p><strong>方式 3：/checkpoints 命令</strong></p>
<pre><code>/checkpoints</code></pre>
<p>列出所有检查点和 ID，可以精确跳转到某个检查点：</p>
<pre><code>/rewind checkpoint_a3f8d2</code></pre>

<h3 id="three-strategies">三种回退策略</h3>
<p>选中一个检查点后，你有三个选择：</p>
<pre><code>┌──────────────────────────────────────────────────────────┐
│                    三种回退策略                              │
├──────────────────┬───────────────────────────────────────┤
│ 策略              │ 效果                                   │
├──────────────────┼───────────────────────────────────────┤
│ 恢复代码和对话    │ 代码回退 + 对话回退                     │
│ (Restore code    │ = 彻底回到那个时间点                     │
│  and conversation)│ 适合：改错了，整个方向不对               │
├──────────────────┼───────────────────────────────────────┤
│ 恢复对话          │ 只回退对话，保留当前代码                 │
│ (Restore         │ = 清理上下文但保留代码成果               │
│  conversation)   │ 适合：代码改对了，但对话太长想精简        │
├──────────────────┼───────────────────────────────────────┤
│ 从此处总结        │ 从这个点开始压缩后续对话                 │
│ (Summarize       │ = 保留早期上下文，压缩后面的             │
│  from here)      │ 适合：调试跑偏了很久想回正轨             │
└──────────────────┴───────────────────────────────────────┘</code></pre>

<h3 id="vs-git">检查点 vs Git：互补关系</h3>
<p>检查点<strong>不是</strong>版本控制的替代品。它们的关系是互补的：</p>
<pre><code>检查点 = "本地撤销"
  → 秒级回退，会话级别
  → 适合快速试错和回退
  → 会话结束后逐渐消失

Git = "永久历史"
  → commit 级别的版本管理
  → 适合长期历史和协作
  → 永久保存

最佳实践：
1. 让 Claude 大胆改 → 检查点保底
2. 改好了确认没问题 → git commit 存档
3. 改错了 → Esc×2 回退，重新来</code></pre>

<h3 id="limitations">重要限制</h3>
<p>检查点<strong>只追踪 Claude 编辑工具的文件操作</strong>。以下操作不在追踪范围内：</p>
<ul>
  <li>❌ Bash 命令（<code>rm</code>、<code>mv</code>、<code>cp</code>）——这些是永久操作</li>
  <li>❌ 你在 Claude 之外手动做的修改</li>
  <li>❌ 其他并发会话的修改</li>
</ul>
<p>所以如果 Claude 通过 bash 删了文件，检查点救不了你。这也是为什么第 7 篇的 PreToolUse Hook（拦截危险命令）很重要——它在检查点之前就防住了问题。</p>

<h2 id="sandbox">三、沙箱系统——AI 的"安全围栏"</h2>

<h3 id="why-sandbox">为什么需要沙箱？</h3>
<p>你有没有过这种经历——Claude 要执行一个 npm 命令，弹出权限确认，你看了一眼点"允许"。又弹一个，又点。再弹一个，继续点。到第十个的时候你已经不看内容直接点了。</p>
<p><strong>这就是"权限疲劳"——确认太多等于没有确认。</strong></p>
<p>沙箱解决的就是这个问题：用 OS 级别的隔离代替频繁的权限弹窗。在安全边界内的操作自动放行，超出边界的操作直接拦截。</p>

<h3 id="enable-sandbox">启用沙箱</h3>
<p>在 Claude Code 交互模式中：</p>
<pre><code>/sandbox</code></pre>
<p>一个命令启用。启用后，Claude 在沙箱边界内的 bash 命令不再弹出权限确认——既更安全，又更顺畅。</p>

<h3 id="two-layers">两层隔离</h3>
<p>沙箱提供文件系统和网络两层隔离：</p>
<pre><code>┌──────────────────────────────────────────────────────────┐
│                    沙箱两层隔离                              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  📁 文件系统隔离                                           │
│  ├── Claude 只能访问沙箱目录内的文件                        │
│  ├── 系统目录（/etc、/usr 等）完全不可见                    │
│  ├── 其他项目目录不可访问                                  │
│  └── 沙箱外写操作直接拒绝                                  │
│                                                          │
│  🌐 网络隔离                                              │
│  ├── 默认禁止所有对外连接                                  │
│  ├── 可配置允许连接特定服务（如 npm registry）              │
│  ├── 阻止恶意下载和数据外泄                                │
│  └── 本地回环地址（localhost）通常可用                      │
│                                                          │
└──────────────────────────────────────────────────────────┘</code></pre>

<h2 id="summary">本篇小结</h2>
<p>三个核心收获：</p>
<p><strong>第一</strong>，GitHub Actions 集成让 Claude 自动审查每个 PR，覆盖类型安全、性能、安全等维度。用 Sonnet 模型加 concurrency 控制控制成本。</p>
<p><strong>第二</strong>，检查点系统是本地开发的"后悔药"——Esc×2 秒级回退，/rewind 精确跳转，三种策略应对不同场景。与 Git 互补使用。</p>
<p><strong>第三</strong>，沙箱系统用 OS 级别隔离解决权限疲劳问题，文件系统和网络两层保护。一个 /sandbox 命令启用。</p>
<p>三套系统结合起来，Claude Code 就能<strong>既自主工作，又不会失控</strong>——云端自动审查、本地安全回退、沙箱隔离防护。</p>

<h2 id="next-preview">下篇预告</h2>
<p><strong>第 10 篇：Claude Code 通关手册（十）—— 从个人利器到团队基建</strong></p>
<p>下一篇是系列收官之作。我们要把 Claude Code 从个人工具升级为团队基础设施——统一配置管理、分享 CLAUDE.md 模板、构建团队共享的 MCP 服务、建立 AI 辅助开发的最佳实践规范。</p>
    `.trim(),
  };
