import type { Article } from '@/types/article';

export const article: Article =   {
    title: 'Claude Code 通关手册（四）：3 个自定义命令，让你的 Claude Code 快到飞起',
    excerpt:
      '告别重复输入！学会创建 /review、/test、/doc 三个自定义 Slash 命令，配合 Sonnet/Opus/Haiku 模型选择策略，让 Claude Code 日常效率再上一个台阶。',
    date: '2026-03-12',
    category: '人工智能',
    tags: ['Claude Code', 'AI', '开发工具'],
    slug: 'claude-code-slash-commands-guide',
    content: `
<blockquote><p>这是「Claude Code 通关手册」系列的第 4 篇，共 10 篇。本篇是 Level 2（配置篇）的最后一篇。学完这篇，你的 Claude Code 配置就算"毕业"了。</p></blockquote>
<p><a href="/blog/claude-code-cursor-guide">Claude Code 通关手册（一）：Cursor 用户转 Claude Code，第一天我就后悔了——后悔没早点用</a></p>
<p><a href="/blog/claude-code-permission-system">Claude Code 通关手册（二）：权限系统搞明白，效率直接翻倍</a></p>
<p><a href="/blog/claude-code-claude-md-guide">Claude Code 通关手册（三）：99%的人不知道的效率秘诀，CLAUDE.md 深度实战</a></p>

<p>我观察了一下自己每天用 Claude Code 的操作，发现了一个尴尬的事实——</p>
<p><strong>我每天至少打三次这段话：</strong></p>
<blockquote><p>"帮我审查这个文件，重点关注 TypeScript 类型安全、Next.js 最佳实践、性能隐患和安全问题，给出具体的改进建议和修改后的代码。"</p></blockquote>
<p>一次 50 个字，一天三次就是 150 个字。一周五天 750 个字。一个月 3000 个字。</p>
<p><strong>你在用手指重复写一篇作文。</strong></p>
<p>更要命的是，每次你还可能忘了某个检查项——上周审查的时候忘了加"安全问题"，导致一个 XSS 漏洞溜过去了。</p>
<p>解决方案简单到让人想拍大腿：<strong>把这段提示词做成一个命令，以后输入 <code>/review</code> 两个字就够了。</strong></p>
<p>今天教你做三个命令——<code>/review</code>、<code>/test</code>、<code>/doc</code>——再配合正确的模型选择策略，你的 Claude Code 日常效率能再上一个台阶。</p>

<h2 id="what-is-slash">Slash 命令是什么？30 秒搞懂</h2>
<p>打个比方：你手机上有没有设置"快捷指令"？比如对 Siri 说"打开工作模式"，它自动帮你静音+打开钉钉+关闭抖音。</p>
<p>Claude Code 的 Slash 命令就是同一个概念——<strong>你预先定义一段提示词模板，取个名字，以后输入 <code>/名字</code> 就自动展开执行。</strong></p>
<p>技术上说：</p>
<ul>
  <li><strong>文件位置</strong>：<code>.claude/commands/</code>（项目级）或 <code>~/.claude/commands/</code>（全局个人级）</li>
  <li><strong>文件格式</strong>：Markdown 文件，文件名就是命令名</li>
  <li><strong>调用方式</strong>：在交互模式中输入 <code>/命令名 参数</code></li>
  <li><strong>参数传递</strong>：文件里用 <code>$ARGUMENTS</code> 接收命令后面的所有文字</li>
</ul>
<p>就这么简单。一个 Markdown 文件 = 一个命令。没有代码要写，没有配置要学。</p>

<pre><code>┌──────────────────────────────────────────────────────────┐
│          Slash 命令工作原理                                 │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  你创建的文件：                                            │
│  .claude/commands/review.md                              │
│                                                          │
│  文件内容：                                                │
│  "审查以下文件，关注类型安全和性能... $ARGUMENTS"           │
│                                                          │
│  你输入：                                                  │
│  /review @src/components/ArticleCard.tsx                 │
│                                                          │
│  Claude 实际收到的提示词：                                  │
│  "审查以下文件，关注类型安全和性能...                       │
│   @src/components/ArticleCard.tsx"                        │
│                                                          │
│  $ARGUMENTS 被替换为命令后面的所有文字                      │
│                                                          │
└──────────────────────────────────────────────────────────┘</code></pre>

<h2 id="review-command">命令一：/review —— 代码审查（使用频率最高）</h2>
<p>直接上手做。在项目根目录下创建命令文件：</p>
<pre><code>mkdir -p .claude/commands</code></pre>
<p>然后创建 <code>.claude/commands/review.md</code>：</p>
<pre><code>---
description: 审查代码质量，检查类型安全、性能、安全和规范
argument-hint: &lt;文件或目录路径&gt;
---

审查以下代码，按优先级从高到低关注这些方面：

## 审查清单

1. **TypeScript 类型安全**
   - 是否存在 any 类型
   - 类型断言（as）是否合理
   - 函数参数和返回值是否有明确类型

2. **Next.js 14 最佳实践**
   - Server/Client 组件划分是否正确
   - 数据获取方式是否恰当（Server Component 内 fetch vs useEffect）
   - 是否正确使用 next/image 和 next/link

3. **性能隐患**
   - 是否有不必要的重渲染
   - 列表渲染是否有稳定 key
   - 是否缺少 React.memo / useMemo / useCallback
   - 大型对象是否在渲染函数外部定义

4. **安全风险**
   - 是否有 XSS 风险（dangerouslySetInnerHTML）
   - 用户输入是否经过校验
   - 敏感信息是否暴露在客户端

5. **代码风格**
   - 是否符合项目 CLAUDE.md 中的编码规范
   - 命名是否清晰、一致
   - 是否有可读性问题

## 输出格式

按严重程度分类：
- &#x1F534; **必须修复**：类型错误、安全漏洞、逻辑Bug
- &#x1F7E1; **建议优化**：性能隐患、不规范的写法
- &#x1F7E2; **小贴士**：可选的改进点

每个问题给出：具体位置 &rarr; 问题描述 &rarr; 修改建议（附代码）

## 审查目标

$ARGUMENTS</code></pre>
<p><strong>使用方式</strong>：</p>
<pre><code># 审查单个文件
/review @src/components/ArticleCard.tsx

# 审查整个目录
/review @src/app/api/

# 审查多个文件
/review @src/app/page.tsx @src/app/layout.tsx</code></pre>
<p>注意这个命令头部的 YAML frontmatter 部分——<code>description</code> 和 <code>argument-hint</code> 不是必须的，但加上它们之后，你输入 <code>/help</code> 查看所有可用命令时，会显示每个命令的描述和参数提示，非常方便。</p>

<h2 id="test-command">命令二：/test —— 测试生成</h2>
<p>创建 <code>.claude/commands/test.md</code>：</p>
<pre><code>---
description: 为组件或函数生成单元测试
argument-hint: &lt;文件路径&gt;
---

为以下代码生成完整的单元测试：

## 测试要求

- 测试框架：Vitest + React Testing Library
- 测试文件位置：与源文件同级的 \`__tests__/\` 目录下
- 文件命名：\`ComponentName.test.tsx\` 或 \`functionName.test.ts\`

## 测试覆盖范围

1. **正常路径**：组件正常渲染、函数正常返回
2. **边界情况**：空值、undefined、空数组、超长字符串
3. **错误处理**：网络请求失败、无效参数
4. **用户交互**：点击、输入、表单提交（如果是交互组件）
5. **Props 变化**：不同 Props 组合下的渲染结果

## 代码规范

- 每个测试用例用中文注释说明"测试什么场景"
- describe 用组件名 / 函数名
- it / test 的描述用英文（保持与团队一致）
- 使用 screen.getByRole 优先于 getByTestId
- Mock 外部依赖，不要发真实网络请求

## 示例格式

\`\`\`typescript
import { render, screen } from '@testing-library/react';
import { ArticleCard } from '../ArticleCard';

describe('ArticleCard', () =&gt; {
  // 正常渲染：传入完整的文章数据
  it('should render article title and author', () =&gt; {
    // ...
  });

  // 边界情况：文章摘要为空
  it('should handle empty excerpt gracefully', () =&gt; {
    // ...
  });
});
\`\`\`

## 测试目标

$ARGUMENTS</code></pre>
<p><strong>使用方式</strong>：</p>
<pre><code># 为单个组件生成测试
/test @src/components/ArticleCard.tsx

# 为工具函数生成测试
/test @src/lib/formatDate.ts

# 为 API 路由生成测试
/test @src/app/api/posts/route.ts</code></pre>

<h2 id="doc-command">命令三：/doc —— 组件文档生成</h2>
<p>创建 <code>.claude/commands/doc.md</code>：</p>
<pre><code>---
description: 为组件或模块生成文档
argument-hint: &lt;文件或目录路径&gt;
---

为以下代码生成清晰的技术文档：

## 文档内容

1. **概述**：一句话说明这个组件/模块的用途
2. **Props / 参数说明**（表格格式）：
   | 属性 | 类型 | 必填 | 默认值 | 说明 |
3. **使用示例**：至少给出 2 个场景的代码示例
   - 基础用法
   - 进阶用法（带完整 Props）
4. **注意事项**：常见的坑和最佳实践
5. **相关组件/函数**：列出与之配合使用的组件

## 输出格式

- 使用 Markdown 格式
- 代码示例使用 TypeScript
- 文件保存为 \`docs/组件名.md\`

## 文档目标

$ARGUMENTS</code></pre>
<p><strong>使用方式</strong>：</p>
<pre><code># 为单个组件生成文档
/doc @src/components/ArticleCard.tsx

# 为整个组件目录生成文档
/doc @src/components/

# 为 API 模块生成文档
/doc @src/app/api/posts/</code></pre>

<h2 id="frontmatter-advanced">进阶：frontmatter 的高级用法</h2>
<p>你可能注意到了命令文件开头有一段 <code>---</code> 包裹的 YAML。除了 <code>description</code> 和 <code>argument-hint</code>，它还支持更多配置：</p>
<pre><code>---
description: 提交代码并生成规范的 commit message
argument-hint: [提交信息补充说明]
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
model: claude-3-5-haiku-20241022
---</code></pre>
<p>几个实用字段：</p>
<pre><code>┌──────────────────────────────────────────────────────────┐
│          frontmatter 常用字段                               │
├───────────────┬──────────────────────────────────────────┤
│ 字段           │ 作用                                      │
├───────────────┼──────────────────────────────────────────┤
│ description   │ 命令描述，/help 时显示                     │
│ argument-hint │ 参数提示，/help 时显示                     │
│ allowed-tools │ 这个命令可以用的工具白名单                  │
│ model         │ 强制用指定模型执行这个命令                  │
│ context: fork │ 在独立子代理中执行，不污染主对话             │
│ agent         │ 指定用哪个子代理执行                       │
└───────────────┴──────────────────────────────────────────┘</code></pre>
<p><strong>特别说一下 <code>model</code> 字段</strong>——这个非常实用。比如 <code>/commit</code> 这种简单的命令（生成 commit message），没必要用最强的 Opus，指定用 Haiku 就够了，又快又省钱：</p>
<pre><code>---
description: 自动 commit 当前改动
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*)
model: claude-3-5-haiku-20241022
---

## 上下文

- 当前 git 状态：!\`git status\`
- 当前改动详情：!\`git diff HEAD\`

## 任务

基于以上改动，生成一个规范的 commit message 并提交。

格式要求：type(scope): description
- type: feat / fix / docs / refactor / test / chore
- scope: 改动涉及的模块（如 blog、auth、api）
- description: 简短的英文描述

$ARGUMENTS</code></pre>
<p>注意那个 <code>!</code> 前缀——<code>!&#96;git status&#96;</code> 会在命令加载时<strong>先执行 bash 命令，把输出嵌入提示词</strong>。这样 Claude 在收到提示词的时候，已经看到了当前的 Git 状态和改动详情，不需要再手动去查。</p>

<h2 id="dynamic-context">另一个进阶：动态上下文注入</h2>
<p>你可以在命令模板里用 <code>!</code> 执行任意 bash 命令，把输出作为上下文传给 Claude。这是一个非常强大的技巧。</p>
<p>举个例子——一个 <code>/pr-review</code> 命令，自动拉取当前分支的改动：</p>
<pre><code>---
description: 审查当前分支相对于 main 的所有改动
allowed-tools: Bash(git diff:*), Bash(git log:*)
---

## 当前分支信息

- 分支名：!\`git branch --show-current\`
- 相对 main 的改动文件：!\`git diff --name-only main\`
- 改动详情：!\`git diff main\`

## 审查要求

审查以上所有改动，按文件逐个分析：
1. 改动是否合理、完整
2. 是否引入了新的问题
3. 测试覆盖是否充分

给出整体评分（1-10）和改进建议。</code></pre>
<p>输入 <code>/pr-review</code> 后，Claude 直接看到完整的 diff 信息，不用你手动复制。</p>

<h2 id="command-organization">命令组织：当你的命令越来越多</h2>
<p>刚开始 3 个命令就够了。但用着用着你会发现更多可以自动化的场景，命令慢慢变多。这时候需要一个清晰的组织结构。</p>
<pre><code>┌──────────────────────────────────────────────────────────┐
│          推荐的命令目录结构                                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  .claude/commands/         &larr; 项目级（提交到 Git）      │
│  ├── review.md             # 代码审查                     │
│  ├── test.md               # 生成测试                     │
│  ├── doc.md                # 生成文档                     │
│  ├── commit.md             # Git 提交                     │
│  └── pr-review.md          # PR 审查                      │
│                                                          │
│  ~/.claude/commands/       &larr; 个人级（所有项目通用）    │
│  ├── explain.md            # 解释代码逻辑                  │
│  ├── refactor.md           # 重构建议                     │
│  └── perf.md               # 性能分析                     │
│                                                          │
│  分工原则：                                                │
│  项目级 = 跟项目绑定的命令（用这个项目的规范和工具）        │
│  个人级 = 通用命令（任何项目都能用）                        │
│                                                          │
│  数量原则：                                                │
│  3 个精心设计的核心命令 &gt; 20 个随便写的命令                 │
│  只给真正高频的操作建命令                                   │
│                                                          │
└──────────────────────────────────────────────────────────┘</code></pre>
<p>有个实用技巧：输入 <code>/help</code> 查看所有可用命令，包括内置命令和你创建的自定义命令。</p>
<p>命令文件放在子目录里也可以正常工作。比如 <code>.claude/commands/git/commit.md</code>，调用的时候还是用 <code>/commit</code>（文件名做命令名，子目录只是用来组织文件的）。</p>

<h2 id="model-strategy">模型选择策略：杀鸡别用牛刀</h2>
<p>Claude Code 支持三个主力模型，合理搭配能帮你省钱又提效：</p>
<pre><code>┌──────────────────────────────────────────────────────────┐
│              模型选择策略速查表                                │
├────────────────┬──────────────────┬──────────────────────┤
│ 任务类型         │ 推荐模型          │ 说明                   │
├────────────────┼──────────────────┼──────────────────────┤
│ 日常编码/功能开发 │ Sonnet（默认）    │ 性能速度最佳平衡        │
│ 代码审查         │ Sonnet           │ 日常审查完全够用        │
│ 测试编写         │ Sonnet           │ 带示例就能写出好测试    │
│ Bug 修复        │ Sonnet / Opus    │ 复杂问题切 Opus        │
│ 架构设计/评审    │ Opus             │ 推理最强，方案质量高    │
│ 复杂多文件重构   │ Opus             │ 跨文件理解力最好        │
│ 生成 commit msg │ Haiku            │ 简单模板任务，够用      │
│ 写注释/文档      │ Haiku / Sonnet   │ 简单场景用 Haiku      │
│ 简单格式化       │ Haiku            │ 最快最省               │
│ 解释代码逻辑     │ Sonnet           │ 清晰且快速             │
│ 技术方案对比     │ Opus             │ 深度分析需要强推理      │
└────────────────┴──────────────────┴──────────────────────┘</code></pre>
<p><strong>切换模型的方法</strong>：</p>
<p><strong>方法一</strong>：交互模式中随时切换</p>
<pre><code>/model</code></pre>
<p><strong>方法二</strong>：在 <code>settings.json</code> 里设置默认模型</p>
<pre><code>{
  "model": "sonnet"
}</code></pre>
<p><strong>方法三</strong>：在命令的 frontmatter 里指定（推荐）</p>
<pre><code>---
description: 生成 commit message
model: claude-3-5-haiku-20241022
---</code></pre>
<p>还有一个隐藏技巧——<strong>opusplan 模式</strong>。在 settings.json 里设置 <code>"model": "opusplan"</code>，Claude 会用 Opus 做规划和思考，用 Sonnet 做执行。既保证了方案质量，又控制了执行成本。</p>

<h2 id="builtin-commands">实用内置命令速查</h2>
<p>常用内置命令速查：</p>
<pre><code>┌──────────────────────────────────────────────────────────┐
│              常用内置命令速查                                  │
├───────────────┬──────────────────────────────────────────┤
│ 命令           │ 作用                                      │
├───────────────┼──────────────────────────────────────────┤
│ /help         │ 查看所有可用命令（含自定义命令）              │
│ /model        │ 切换 AI 模型                               │
│ /compact      │ 压缩对话历史，释放上下文空间                  │
│ /clear        │ 清空对话，从零开始                          │
│ /init         │ 自动分析项目并生成 CLAUDE.md                │
│ /permissions  │ 交互式管理权限规则                           │
│ /memory       │ 编辑 Auto Memory                           │
│ /config       │ 打开设置面板                                │
│ /context      │ 查看当前加载的上下文                         │
└───────────────┴──────────────────────────────────────────┘</code></pre>

<h2 id="summary">本篇小结</h2>
<p>三个核心收获：</p>
<p><strong>第一</strong>，三个高频自定义命令——<code>/review</code>（代码审查）、<code>/test</code>（测试生成）、<code>/doc</code>（组件文档）。一个命令文件就是一个 Markdown 文件，放在 <code>.claude/commands/</code> 目录下，用 <code>$ARGUMENTS</code> 接收参数。</p>
<p><strong>第二</strong>，Frontmatter 进阶用法——<code>allowed-tools</code> 限制工具范围，<code>model</code> 指定执行模型，<code>context: fork</code> 隔离上下文。动态上下文注入用 <code>!&#96;bash命令&#96;</code> 在加载时自动获取最新信息。</p>
<p><strong>第三</strong>，模型选择策略——Sonnet 主力干 80% 的活，Opus 处理复杂推理，Haiku 跑简单任务。用 opusplan 模式在规划和执行间智能分配。</p>

<p><strong>Level 2 通关检查清单</strong></p>
<ul>
  <li>[ ] 创建了 <code>.claude/commands/review.md</code> 并测试过 <code>/review</code></li>
  <li>[ ] 创建了 <code>.claude/commands/test.md</code> 并测试过 <code>/test</code></li>
  <li>[ ] 创建了 <code>.claude/commands/doc.md</code> 并测试过 <code>/doc</code></li>
  <li>[ ] 在至少一个命令里用到了 <code>$ARGUMENTS</code></li>
  <li>[ ] 在至少一个命令里用到了 frontmatter 的进阶字段</li>
  <li>[ ] 试过 <code>/model</code> 命令切换模型</li>
  <li>[ ] 知道什么时候用 Opus、Sonnet、Haiku</li>
</ul>
<p>全部打勾？恭喜，Level 2（配置篇）通关！</p>

<h2 id="next-preview">下篇预告</h2>
<p><strong>第 5 篇：Claude Code 通关手册（五）—— 子代理：从单兵作战到 AI 团队</strong></p>
<p>下一篇进入 Level 3（扩展篇），我们要聊一个让 Claude Code 能力指数级增长的概念——子代理（Sub-Agents）。你不是在用一个 AI，而是在指挥一支 AI 团队。</p>
    `.trim(),
  };
