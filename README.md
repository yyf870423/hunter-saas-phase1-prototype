# Hunter SaaS 阶段一交互原型

本仓库承载 Hunter SaaS 产品的分阶段高保真交互原型。当前只开放**阶段一：全局框架与工作台**，已废弃的旧原型页面不再进入路由、测试或本轮验收范围。

在线原型：<https://yyf870423.github.io/hunter-saas-phase1-prototype/#/review>

## 当前入口

- 阶段审核入口：`#/review`
- 工作台：`#/home`
- 工作台加载态：`#/home?state=loading`
- 工作台空状态：`#/home?state=empty`
- 工作台局部错误态：`#/home?state=error`
- 工作台权限受限态：`#/home?state=limited`
- 阶段一公共组件：`#/components`

业务主线工作区、支线任务、信号中心、业务资产、设置与运营端将在对应阶段获得人类审批后逐步开放。

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

E2E 覆盖桌面、iPad、iPhone、亮暗主题、导航、搜索、通知、浮层、工作台主要交互、必要状态、控制台错误和页面级横向溢出。

## 工程结构

阶段一使用薄路由、共享数据、共享 SVG 图标、公共 UI 组件与统一设计 Token 组装：

- `src/stage1/data.js`：跨入口一致的 Mock 数据。
- `src/stage1/ui.jsx`：产品级基础组件。
- `src/stage1/Stage1Shell.jsx`：全局框架与导航。
- `src/stage1/Dashboard.jsx`：工作台及必要状态。
- `src/stage1/stage1.css`：WorkBuddy × Vercel 设计 Token、组件和响应式规则。
- `docs/stage-1-plan.md`：阶段一实施与审批边界。
- `docs/stage-1-interaction-coverage.md`：交互覆盖清单。
- `docs/stage-1-design-system.md`：阶段一公共设计系统。
