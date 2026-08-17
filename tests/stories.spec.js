import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test("登录、通知和全局搜索形成连续入口", async ({ page }) => {
  await page.goto("./#/login");
  await page.getByRole("button", { name: "登录", exact: true }).click();
  await expect(page).toHaveURL(/#\/home/);
  await page.getByRole("button", { name: "打开通知" }).click();
  await expect(page.getByRole("heading", { name: "通知中心" })).toBeVisible();
  await page
    .locator(".drawer")
    .getByRole("button", { name: "关闭", exact: true })
    .click();
  await page.getByRole("button", { name: /搜索主线/ }).click();
  await page.getByPlaceholder("输入姓名、公司、岗位或任务").fill("林昊");
  await page
    .locator(".global-search .search-results > button")
    .filter({ hasText: "林昊" })
    .first()
    .click();
  await expect(page.getByRole("heading", { name: "林昊" })).toBeVisible();
});

test("新建岗位招聘主线会识别重复并进入原主线", async ({ page }) => {
  await page.goto("./#/workstreams/new");
  await page
    .locator(".workstream-type-grid")
    .getByRole("button", { name: /^岗位招聘/ })
    .click();
  await page
    .getByRole("button", { name: /为星澜机器人招聘具身智能 VLA 算法负责人/ })
    .click();
  await page.getByRole("button", { name: "确认并创建主线" }).click();
  await expect(
    page.getByRole("heading", { name: /具身智能 VLA 算法负责人.*正在推进/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "补充并恢复原主线" }).click();
  await expect(page).toHaveURL(/position-vla\/position/);
  await expect(
    page.getByRole("heading", { name: /具身智能 VLA 算法负责人/ }),
  ).toBeVisible();
});

test("四类业务主线使用不同问题和配置", async ({ page }) => {
  const cases = [
    ["客户开发", "目标公司、关注的招聘方向"],
    ["岗位招聘", "岗位资料不完整"],
    ["人才摸排", "公司、组织、方向、关键人物"],
    ["候选人求职", "请选择候选人"],
  ];
  for (const [type, expected] of cases) {
    await page.goto("./#/workstreams/new");
    await page
      .locator(".workstream-type-grid")
      .getByRole("button", { name: new RegExp(`^${type}`) })
      .click();
    await expect(page.getByText(new RegExp(expected)).first()).toBeVisible();
  }
});

test("业务主线用文字对话和卡片共同推进补充信息", async ({ page }) => {
  await page.goto("./#/workstreams/position-vla/position");
  await expect(
    page
      .locator(".mainline-conversation-main")
      .getByText(/我会把 VLA 或端到端机器人学习的真实落地经验作为核心门槛/),
  ).toBeVisible();
  await expect(page.getByText("5 个找人任务正在并行")).toBeVisible();
  await page
    .getByLabel("发送给 Hunter")
    .fill("杭州也可以接受，但每周至少三天到岗");
  await page.getByRole("button", { name: "发送", exact: true }).click();
  await expect(
    page.getByText(/先判断它会影响哪些正在运行的工作和已有结果/),
  ).toBeVisible();
  await expect(
    page
      .locator(".mainline-conversation-main")
      .getByText("补充信息已完成影响分析"),
  ).toBeVisible();
});

test("Agent 操作权限可以在主线对话中按范围授权", async ({ page }) => {
  await page.goto("./#/workstreams/position-vla/position");
  await expect(
    page.getByText("允许使用已登录的人才平台查找候选人？"),
  ).toBeVisible();
  await page.getByRole("button", { name: "当前业务主线持续允许" }).click();
  await expect(
    page.getByText("当前业务主线已授权", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(/授权只在当前业务主线有效/).first(),
  ).toBeVisible();
});

test("业务主线默认只显示对话，点击卡片后按需显示详情", async ({ page }) => {
  await page.goto("./#/workstreams/position-vla/position");
  await expect(page.getByLabel("卡片详情")).toHaveCount(0);
  await page
    .getByRole("button", { name: /查看详情：首批候选人已完成匹配/ })
    .click();
  await expect(
    page.getByLabel("卡片详情").getByText("首批候选人已完成匹配"),
  ).toBeVisible();
  await page.getByRole("button", { name: "关闭卡片详情" }).click();
  await expect(page.getByLabel("卡片详情")).toHaveCount(0);

  await page.getByRole("button", { name: "查看任务运行" }).click();
  await expect(page).toHaveURL(/tasks\/task-sourcing/);
});

test("Agent 操作模式在当前业务主线中切换并保留记录", async ({ page }) => {
  await page.goto("./#/workstreams/position-vla/position");
  await page.getByRole("button", { name: "Agent 操作模式" }).click();
  await page.getByRole("button", { name: /自动执行/ }).click();
  await expect(
    page.getByRole("button", { name: "Agent 操作模式" }),
  ).toContainText("自动执行");
  await expect(page.getByText(/操作模式已切换为自动执行/)).toBeVisible();
  await expect(
    page.getByText("当前业务主线已授权", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /查看详情：首批候选人已完成匹配/ })
    .click();
  await expect(
    page.getByRole("button", { name: "Agent 操作模式" }),
  ).toContainText("自动执行");
});

test("移动端新建主线可以访问创建进度和结果预览", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./#/workstreams/new?type=position");

  await page.getByRole("button", { name: "进度", exact: true }).click();
  await expect(page.getByRole("heading", { name: "创建进度" })).toBeVisible();
  await expect(page.locator(".drawer").getByLabel("创建进度")).toBeVisible();
  await page
    .locator(".drawer")
    .getByRole("button", { name: "关闭", exact: true })
    .click();

  await page.getByRole("button", { name: "结果", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "主线启动摘要" }),
  ).toBeVisible();
  await expect(
    page.locator(".drawer").getByLabel("主线启动摘要"),
  ).toBeVisible();
  await page
    .locator(".drawer")
    .getByRole("button", { name: "关闭", exact: true })
    .click();

  await page.getByRole("button", { name: "Agent 操作模式" }).click();
  await page.getByRole("button", { name: /规划模式/ }).click();
  await expect(
    page.getByRole("button", { name: "Agent 操作模式" }),
  ).toContainText("规划模式");
});

test("移动端业务主线点击卡片后用 Drawer 查看详情", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./#/workstreams/position-vla/position");

  await page
    .getByRole("button", { name: /查看详情：首批候选人已完成匹配/ })
    .click();
  const drawer = page.locator(".drawer");
  await expect(
    drawer.getByRole("complementary", { name: "卡片详情" }),
  ).toBeVisible();
  await drawer.getByRole("button", { name: "关闭", exact: true }).click();
  await expect(drawer).toHaveCount(0);
});

test("全局任务列表只显示独立支线任务", async ({ page }) => {
  await page.goto("./#/tasks");
  await expect(page.getByRole("heading", { name: "独立任务" })).toBeVisible();
  await expect(page.getByText("核验灵巧手团队招聘机会")).toBeVisible();
  await expect(page.getByText("核验云脉芯能机器人芯片团队")).toBeVisible();
  await expect(page.getByText("召回 VLA 岗位候选人")).toHaveCount(0);
});

test("任务暂停、恢复和技术详情均可操作", async ({ page }) => {
  await page.goto("./#/tasks/task-sourcing");
  await expect(page.getByText("输入版本", { exact: true })).toHaveCount(0);
  await expect(page.getByText("用量与预算", { exact: true })).toHaveCount(0);
  await expect(page.getByText("任务结果", { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "返回业务主线" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "暂停", exact: true }).click();
  await expect(page.getByText("任务已暂停，检查点已保留")).toBeVisible();
  await page.getByRole("button", { name: "继续任务" }).click();
  await expect(page.getByText("任务已从检查点继续")).toBeVisible();
  const processEntry = page.locator(".task-process button").first();
  await processEntry.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .locator(".drawer")
    .getByRole("button", { name: "关闭", exact: true })
    .click();
});

test("候选人新资料可以生成局部更新和重新匹配任务", async ({ page }) => {
  await page.goto("./#/communications/comm-linhao");
  await page.getByRole("button", { name: "处理新资料" }).click();
  await expect(
    page.getByRole("heading", { name: "处理候选人新资料" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "创建处理任务" }).click();
  await expect(page).toHaveURL(/tasks\/task-enrich/);
  await expect(page.getByRole("heading").first()).toBeVisible();
});

test("导入向导包含必填错误、预检和后台任务", async ({ page }) => {
  await page.goto("./#/imports/new");
  await page.getByRole("button", { name: "下一步" }).click();
  await page.getByRole("button", { name: "下一步" }).click();
  await expect(page.getByText("请选择要导入的文件")).toBeVisible();
  await page.getByRole("button", { name: "选择文件" }).click();
  await page.getByRole("button", { name: "下一步" }).click();
  await expect(page.getByText("格式、内容与重复预检")).toBeVisible();
  await page.getByRole("button", { name: "下一步" }).click();
  await page.getByRole("button", { name: "开始解析" }).click();
  await expect(page).toHaveURL(/imports\/import-resumes/);
});

test("平台登录失效时保留任务并可重新登录恢复", async ({ page }) => {
  await page.goto("./#/account/platforms");
  const reconnect = page
    .getByRole("button", { name: /重新登录|打开平台处理/ })
    .first();
  await reconnect.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const confirm = page.getByRole("button", { name: /确认已登录|完成登录/ });
  await confirm.click();
  await expect(page.getByText(/已恢复|登录正常/).first()).toBeVisible();
});

test("岗位候选人推进由猎头手动记录", async ({ page }) => {
  await page.goto("./#/progress/linhao-vla");
  await page.getByRole("button", { name: "记录新进展" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "保存进展" }).click();
  await expect(page.locator(".toast")).toBeVisible();
});

test("运营人员审核试用申请但看不到业务正文", async ({ page }) => {
  await page.goto("./#/ops/applications?drawer=review");
  await expect(page.getByText(/不展示用户业务内容/)).toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "确认审核结果" }).click();
  await expect(page.locator(".toast")).toBeVisible();
  await expect(
    page.getByText(/候选人简历正文|岗位正文|Agent 输出正文/),
  ).toHaveCount(0);
});

test("深浅主题状态跨页面保留", async ({ page }) => {
  await page.goto("./#/home");
  await page.getByRole("button", { name: "切换深色模式" }).click();
  await expect(page.locator(".app-shell")).toHaveAttribute(
    "data-theme",
    "dark",
  );
  await page.goto("./#/tasks");
  await expect(page.locator(".app-shell")).toHaveAttribute(
    "data-theme",
    "dark",
  );
});
