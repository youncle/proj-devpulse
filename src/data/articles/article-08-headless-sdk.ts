import type { Article } from '@/types/article';

export const article: Article =   {
    title: 'Claude Code 通关手册（八）：你还在跟 AI 聊天？高手早就用代码驱动了',
    excerpt:
      '详解 Headless 模式和 Agent SDK 使用，教你通过命令行和编程接口实现 AI 自动化。包含批量代码审查、自动生成 Changelog 等实战案例，从对话驱动升级为代码驱动 AI 开发。',
    date: '2026-03-12',
    category: '人工智能',
    tags: ['Claude Code', 'AI', '开发工具'],
    slug: 'claude-code-headless-sdk',
    content: `
<blockquote><p>这是「Claude Code 通关手册」系列的第 8 篇，共 10 篇。从这篇开始进入 Level 4（高级篇），解锁 Claude Code 的编程接口。</p></blockquote>

<p><a href="/blog/claude-code-cursor-guide">Claude Code 通关手册（一）：Cursor 用户转 Claude Code，第一天我就后悔了——后悔没早点用</a></p>
<p><a href="/blog/claude-code-permission-system">Claude Code 通关手册（二）：权限系统搞明白，效率直接翻倍</a></p>
<p><a href="/blog/claude-code-claude-md-guide">Claude Code 通关手册（三）：99%的人不知道的效率秘诀，CLAUDE.md 深度实战</a></p>
<p><a href="/blog/claude-code-slash-commands-guide">Claude Code 通关手册（四）：3 个自定义命令，让你的 Claude Code 快到飞起</a></p>
<p><a href="/blog/claude-code-sub-agent-system">Claude Code 通关手册（五）：子代理系统——给你的 AI 配一个"专家团队"</a></p>
<p><a href="/blog/claude-code-mcp-guide">Claude Code 通关手册（六）：MCP 协议完全指南，Claude Code 最被低估的能力</a></p>
<p><a href="/blog/claude-code-hooks-skills-plugins">Claude Code 通关手册（七）：打造 AI 自动化流水线，Hooks、Skills、Plugins 实战</a></p>

<p>到今天为止，你跟 Claude Code 的交互方式一直是"对话"——你在终端里打字，它回答。你说"审查这个文件"，它审查。你说"写个组件"，它写。</p>
<p>这种方式很直觉，但它有一个本质限制：<strong>你得在场。</strong></p>
<p>你不在键盘前，它就不工作。它不能凌晨 2 点自动扫描代码仓库然后把质量报告发到钉钉群。它不能在每次有人提 PR 的时候自动做一轮审查。它不能批量处理 100 个文件的文档生成。</p>
<p>今天要讲的两个东西，把这个限制彻底打破：</p>
<ul>
  <li><strong>Headless 模式</strong>：用命令行参数驱动 Claude Code，不需要交互界面，可以嵌入任何 Shell 脚本和 CI/CD 流水线</li>
  <li><strong>Agent SDK</strong>：用 TypeScript / Python 代码调用 Claude Code 的全部能力，构建你自己的 AI 驱动工具</li>
</ul>
<p>从"人驱动 AI"到"代码驱动 AI"——这是认知上的跨越。</p>

<h2>一、Headless 模式——一行命令，Claude 自动干活</h2>

<h3>最简形式</h3>
<p>Headless 模式的核心是 <code>-p</code> 参数（prompt 的缩写）：</p>
<pre><code>claude -p "分析 src/app/page.tsx 的性能问题"
</code></pre>
<p>就这么简单。Claude Code 收到指令，执行分析，把结果输出到 stdout，然后退出。没有交互界面，没有等待输入——执行完就走。</p>

<h3>三种输出格式</h3>
<pre><code># 默认：纯文本输出（适合人类阅读）
claude -p "列出项目中的 TODO 注释" --output-format text

# JSON：结构化输出（适合程序解析）
claude -p "列出项目中的 TODO 注释" --output-format json

# Stream JSON：逐条消息流式输出（适合实时处理）
claude -p "重构 ArticleList 组件" --output-format stream-json
</code></pre>
<p><strong>JSON 格式</strong>是自动化场景的首选——你可以用 <code>jq</code> 提取字段、用脚本解析结果、存入数据库、发到通知渠道。</p>
<pre><code># 提取 JSON 中的文本内容
claude -p "检查 package.json 中有没有过期的依赖" \
  --output-format json | jq -r '.result'
</code></pre>

<h3>关键参数</h3>
<pre><code>claude -p "你的指令" \
  --output-format json \        # 输出格式：text / json / stream-json
  --max-turns 3 \               # 最大执行轮次（控制成本）
  --allowedTools Read,Grep \    # 限制可用工具（安全）
  --model sonnet                # 指定模型
</code></pre>
<p><code>--max-turns</code> 在自动化场景中特别重要——它限制 Claude 的"思考轮次"。一个简单的代码审查通常 1-2 轮就够了，设成 3 是安全上限。没有这个限制，Claude 可能在复杂任务上无限循环，Token 费用飙升。</p>

<h3>实操：批量代码审查脚本</h3>
<p>这是一个实际可用的脚本——审查最近 5 次提交中修改过的所有文件：</p>
<pre><code>#!/bin/bash
# review-recent.sh — 批量审查最近修改的文件

OUTPUT_FILE="review-report.json"
echo "[]" > "$OUTPUT_FILE"

for file in $(git diff --name-only HEAD~5 -- '*.ts' '*.tsx'); do
  echo "🔍 审查: $file"

  result=$(claude -p "审查 $file 的代码质量。关注：
    1. TypeScript 类型安全
    2. React 最佳实践
    3. 性能隐患
    输出 JSON：{\\"file\\": \\"文件名\\", \\"issues\\": [{\\"severity\\": \\"high/medium/low\\", \\"line\\": 行号, \\"message\\": \\"描述\\"}]}" \
    --output-format json \
    --max-turns 2 \
    --allowedTools Read,Grep,Glob 2>/dev/null)

  echo "$result" >> "$OUTPUT_FILE"
done

echo "✅ 审查完成，报告: $OUTPUT_FILE"
</code></pre>
<p>注意 <code>--allowedTools Read,Grep,Glob</code>——只给了只读权限。批量脚本里绝对不要给写权限，万一 Claude 理解错了意图自动改了你的代码，100 个文件全改错，你哭都来不及。</p>

<h3>另一个实用场景：自动生成 Changelog</h3>
<pre><code>#!/bin/bash
# 从 Git 提交记录自动生成 Changelog

git log --oneline origin/main...HEAD | \
claude -p "基于这些 Git 提交记录，生成一份结构化的 Changelog。
分类为：✨ 新功能、🐛 Bug修复、🔧 优化、📝 文档。
用 Markdown 格式输出。" \
--output-format text \
--max-turns 1 > CHANGELOG.md

echo "✅ Changelog 已生成"
</code></pre>
<p>这个脚本可以直接放到 release 流程里——每次发版前自动跑一次，Changelog 就有了。</p>

<h2>二、Agent SDK——用代码获得 Claude Code 的全部能力</h2>
<p>Headless 模式适合简单的"一问一答"场景。但如果你需要更复杂的控制——多轮对话、自定义工具、流式处理、会话恢复——就需要 Agent SDK。</p>

<h3>重要说明：名称变更</h3>
<p>Claude Code SDK 已正式更名为 <strong>Claude Agent SDK</strong>。包名从 <code>@anthropic-ai/claude-code</code> 改为 <code>@anthropic-ai/claude-agent-sdk</code>。如果你看到网上的旧教程用的还是老包名，知道是同一个东西就行。</p>

<h3>安装</h3>
<pre><code># TypeScript / JavaScript
npm install @anthropic-ai/claude-agent-sdk

# Python
pip install claude-agent-sdk
</code></pre>
<p>环境变量：</p>
<pre><code>export ANTHROPIC_API_KEY="your-api-key"
</code></pre>

<h3>核心概念：query() 函数</h3>
<p>Agent SDK 的核心就一个函数——<code>query()</code>。它接收一个 prompt，返回一个<strong>异步迭代器</strong>，你可以逐条消息处理 Claude 的输出。</p>
<pre><code>import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({ prompt: "分析当前目录的项目结构" })) {
  if (message.type === "assistant") {
    for (const block of message.message.content) {
      if (block.type === "text") {
        console.log(block.text);
      }
    }
  }

  if (message.type === "result") {
    console.log("完成:", message.result);
  }
}
</code></pre>
<p><code>query()</code> 不是简单的"发请求→收回复"。它内部运行着一个完整的 Agent 循环——Claude 会自动调用工具（读文件、执行命令、搜索代码），观察结果，决定下一步，直到任务完成。你只需要消费这个流就行了。</p>

<h3>配置项</h3>
<pre><code>const result = query({
  prompt: "审查 src/app/api/ 下的所有 API 路由",
  options: {
    model: "sonnet",
    permissionMode: "bypassPermissions",
    allowedTools: ["Read", "Grep", "Glob"],
    maxTurns: 5,
    systemPrompt: "你是一个严格的代码审查专家...",
    settingSources: ["project"],
  }
});
</code></pre>
<p>几个关键配置解读：</p>
<p><strong><code>permissionMode</code></strong> 决定了 Claude 执行操作时的权限策略。在 CI/CD 里用 <code>"bypassPermissions"</code> 跳过所有权限确认。在本地开发工具里用 <code>"acceptEdits"</code> 自动同意文件编辑。</p>
<p><strong><code>settingSources</code></strong> 控制是否加载 <code>.claude/settings.json</code> 等配置文件。默认值是空数组——SDK 模式下一切由代码控制，不依赖文件系统。</p>
<p><strong><code>allowedTools</code></strong> 限制 Claude 可以使用的工具。审查任务只给 Read，生成任务可以给 Read + Write。</p>

<h2>三、实操项目：DevPulse 文档自动生成器</h2>
<p>现在用 Agent SDK 构建一个实际的工具——自动为 DevPulse 项目中的每个组件生成文档。</p>

<h3>项目结构</h3>
<pre><code>devpulse-doc-gen/
├── package.json
├── tsconfig.json
└── src/
    └── index.ts
</code></pre>

<h3>完整代码</h3>
<pre><code>// src/index.ts
import { query } from "@anthropic-ai/claude-agent-sdk";
import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

const COMPONENTS_DIR = "../devpulse/src/components";
const OUTPUT_DIR = "../devpulse/docs/components";
const MODEL = "sonnet";

async function generateDoc(filePath: string): Promise&lt;string&gt; {
  let docContent = "";

  for await (const message of query({
    prompt: \`阅读组件文件 \${filePath}，生成 Markdown 文档。
要求：
1. 组件概述
2. Props 表格（名称、类型、必填、默认值、说明）
3. 使用示例（基础用法 + 高级用法）
4. 注意事项
5. 相关组件\`,
    options: {
      model: MODEL,
      allowedTools: ["Read"],
      maxTurns: 3,
      permissionMode: "bypassPermissions",
    },
  })) {
    if (message.type === "result") {
      docContent = message.result;
    }
  }
  return docContent;
}

async function main() {
  const componentFiles = await glob(\`\${COMPONENTS_DIR}/**/*.tsx\`, {
    ignore: ["**/*.test.tsx", "**/__tests__/**"],
  });

  console.log(\`📦 找到 \${componentFiles.length} 个组件\`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const file of componentFiles) {
    const name = path.basename(file, ".tsx");
    console.log(\`📝 生成: \${name}\`);
    try {
      const doc = await generateDoc(file);
      fs.writeFileSync(path.join(OUTPUT_DIR, \`\${name}.md\`), doc, "utf-8");
      console.log(\`  ✅ \${name}.md\`);
    } catch (err) {
      console.error(\`  ❌ \${name}\`, err);
    }
  }
  console.log(\`\\n🎉 完成，共 \${componentFiles.length} 个组件\`);
}

main().catch(console.error);
</code></pre>

<h3>运行方式</h3>
<pre><code>npm install @anthropic-ai/claude-agent-sdk glob
export ANTHROPIC_API_KEY="your-api-key"
npx ts-node src/index.ts

# 输出示例：
# 📦 找到 12 个组件
# 📝 生成: ArticleCard
#   ✅ ArticleCard.md
# 📝 生成: ArticleList
#   ✅ ArticleList.md
# ...
# 🎉 完成，共 12 个组件
</code></pre>
<p>这个工具展示了 Agent SDK 的核心能力：<strong>在代码中编排 AI 工作流</strong>。每个组件文件的文档生成都是一个独立的 Agent 会话，互不干扰，错误隔离。</p>

<h2>本篇小结</h2>
<p>三个核心收获：</p>
<p><strong>第一</strong>，Headless 模式用 <code>-p</code> 参数驱动，适合嵌入脚本和 CI/CD。配合 <code>--output-format json</code> 和 <code>--max-turns</code> 控制成本和输出。批量脚本务必用 <code>--allowedTools</code> 限制只读权限。</p>
<p><strong>第二</strong>，Agent SDK（已更名为 Claude Agent SDK）的核心是 <code>query()</code> 函数——返回异步迭代器，内部运行完整 Agent 循环。权限模式、工具限制、轮次控制全部由代码决定。</p>
<p><strong>第三</strong>，从"人驱动 AI"到"代码驱动 AI"是认知跨越。Headless 模式适合简单脚本，Agent SDK 适合复杂编排。两者结合，Claude Code 就能 7×24 小时自动化运转。</p>

<p><strong>Level 4 通关检查清单</strong></p>
<ul>
  <li>[ ] 用 <code>claude -p</code> 执行过一次无交互任务</li>
  <li>[ ] 尝试过 <code>--output-format json</code> 并用 jq 解析结果</li>
  <li>[ ] 写过一个批量代码审查脚本</li>
  <li>[ ] 安装 <code>@anthropic-ai/claude-agent-sdk</code></li>
  <li>[ ] 用 <code>query()</code> 写过一段自定义工具代码</li>
  <li>[ ] 理解 permissionMode 和 allowedTools 的配置策略</li>
</ul>
<p>全部打勾？恭喜进入自动化篇。</p>

<h2>下篇预告</h2>
<p><strong>第 9 篇：Claude Code 通关手册（九）—— 检查点 + 沙箱 + GitHub Actions，自动化三部曲</strong></p>
<p>下一篇继续 Level 4（高级篇）。Headless + SDK 让你能用代码驱动 AI，但生产环境里还需要安全保障。检查点系统（秒级回退）、沙箱隔离（OS 级安全）、GitHub Actions（云端自动化）——三套系统结合起来，Claude Code 才能真正自主运行。</p>
    `.trim(),
  };
