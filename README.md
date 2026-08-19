# Hunter SaaS 阶段一完整可交互原型

本仓库承载 Hunter 阶段一 SaaS 产品的用户端与运营端完整交互原型。它独立于 Hunter 产品代码，不写入真实数据，不调用生产服务。

在线原型：<https://yyf870423.github.io/hunter-saas-phase1-prototype/#/review>

## 体验入口

- 用户端：`#/home`
- 运营端：`#/ops`
- 页面索引与审核入口：`#/review`
- 31 类对话中间结果审核：`#/review/intermediate-results`
- 六条用户故事：`#/review/stories`
- 公共组件与状态：`#/components`
- 业务主线自然语言审核示例：`#/workstreams/position-vla/position`
- 四类支线任务示例：`#/tasks/task-company`、`#/tasks/task-sourcing`、`#/tasks/task-mapping`、`#/tasks/task-enrich`

## 本地运行

```bash
npm install
npm run dev
```

## 验证

```bash
npm run build
npm run test:e2e
```

## 工程结构

原型使用公共 Token、SVG 图标、产品级 UI 组件和共享业务组件组装页面，不在页面中复制控件实现：

- [原型实施与审核计划](docs/prototype-delivery-plan.md)
- [v2 重构执行计划](docs/rebuild-plan-v2.md)
- [公共设计语言与组件体系](docs/component-system.md)
- [交互覆盖清单](docs/interaction-coverage.md)
- [Review 报告](docs/review-report.md)

## 对话中间结果

业务主线对话覆盖 31 类中间结果，包括目标与计划、需求澄清、搜索策略、来源证据、来源冲突、业务草稿、候选池、身份查重、字段差异、学术线索、关系路径、岗位解析、人岗匹配、外部操作授权、发送与回复、影响分析、支线建议、文件、部分完成、无结果、覆盖缺口、登录和预算阻塞、运行失败、门禁失败、异步等待和局部重算。

每一类都保留真实业务上下文，并提供与结果类型对应的查看、修改、确认、恢复或继续处理交互；不会把所有结果压成同一种通用卡片。
