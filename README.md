# Hunter SaaS 阶段一完整可交互原型

本仓库承载 Hunter 阶段一 SaaS 产品的用户端与运营端完整交互原型。它独立于 Hunter 产品代码，不写入真实数据，不调用生产服务。

## 体验入口

- 用户端：`#/home`
- 运营端：`#/ops`
- 页面索引与审核入口：`#/review`
- 六条用户故事：`#/review/stories`
- 公共组件与状态：`#/components`

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
- [公共设计语言与组件体系](docs/component-system.md)
- [交互覆盖清单](docs/interaction-coverage.md)
- [Review 报告](docs/review-report.md)
