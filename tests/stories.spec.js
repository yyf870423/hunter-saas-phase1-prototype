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

test("业务主线用 Markdown 对话逐段推进并在审核节点等待", async ({ page }) => {
  await page.goto("./#/workstreams/position-vla/position");
  await expect(
    page
      .locator(".mainline-conversation-main")
      .getByText(/我会把 VLA 或端到端机器人学习的真实落地经验作为核心门槛/),
  ).toBeVisible();
  await expect(page.getByText("2 个人才平台任务正在运行")).toBeVisible();
  await page
    .getByLabel("发送给 Hunter")
    .fill("杭州也可以接受，但每周至少三天到岗");
  await page.getByRole("button", { name: "发送", exact: true }).click();
  await expect(
    page.getByText("Hunter 正在应用你的决定并检查后续步骤"),
  ).toBeVisible();
  await expect(
    page.getByText(/补充信息已收到。我已把它作为当前人工节点的反馈/),
  ).toBeVisible();
  await expect(
    page
      .locator(".mainline-conversation-main")
      .getByText("新信息只影响 6 位候选人"),
  ).toBeVisible();
});

test("业务主线入口直接打开会话并通过左侧加号新建", async ({ page }) => {
  await page.goto("./#/workstreams");
  await expect(page).toHaveURL(/workstreams\/position-vla\/position/);
  const navigation = page.getByRole("navigation", { name: "业务主线" });
  await expect(navigation.getByText("星澜机器人招聘机会")).toBeVisible();
  await expect(navigation.getByText("林昊下一份工作")).toBeVisible();
  await navigation.getByRole("button", { name: "新建业务主线" }).click();
  await expect(page).toHaveURL(/workstreams\/new/);
  await expect(page.getByText("你希望持续推进哪一类业务？")).toBeVisible();
});

test("桌面业务主线导航可收起且状态标签保持单行", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./#/workstreams/position-vla/position");
  const workspace = page.locator(".conversation-workspace");
  const before = await page
    .locator(".mainline-conversation-main")
    .boundingBox();
  const status = page
    .getByRole("navigation", { name: "业务主线" })
    .locator(".status")
    .filter({ hasText: "等待用户" })
    .first();
  const statusText = status.locator(":scope > span");
  const statusDot = status.locator(":scope > i");
  const [statusBox, statusTextBox, statusDotBox] = await Promise.all([
    status.boundingBox(),
    statusText.boundingBox(),
    statusDot.boundingBox(),
  ]);
  expect(statusBox.height).toBeLessThanOrEqual(24);
  expect(
    Math.abs(
      statusTextBox.y +
        statusTextBox.height / 2 -
        (statusDotBox.y + statusDotBox.height / 2),
    ),
  ).toBeLessThanOrEqual(1);

  await page.getByRole("button", { name: "收起业务主线" }).click();
  await expect(workspace).toHaveClass(/navigation-collapsed/);
  await expect(
    page.getByRole("button", { name: "展开业务主线" }),
  ).toBeVisible();
  const after = await page.locator(".mainline-conversation-main").boundingBox();
  expect(after.width).toBeGreaterThan(before.width + 120);
  await page.getByRole("button", { name: "展开业务主线" }).click();
  await expect(workspace).not.toHaveClass(/navigation-collapsed/);
});

test("业务主线仅在用户消息悬停时显示发送时间", async ({ page }) => {
  await page.goto("./#/workstreams/position-vla/position");
  await expect(page.locator(".conversation-avatar")).toHaveCount(0);
  await expect(page.locator(".conversation-entry-agent header")).toHaveCount(0);
  await expect(page.locator(".conversation-entry-agent time")).toHaveCount(0);
  await expect(
    page.locator(".conversation-entry-user .conversation-bubble"),
  ).toBeVisible();
  await expect(
    page.locator(".conversation-entry-agent .markdown-message").first(),
  ).toBeVisible();
  const userEntry = page.locator(".conversation-entry-user").first();
  const userTime = userEntry.locator(".user-message-time");
  await expect(userTime).toBeHidden();
  await userEntry.locator(".conversation-bubble").hover();
  await expect(userTime).toBeVisible();
  await expect(userTime).toHaveText("今天 08:16");
});

test("四类业务主线都在人工节点暂停并在反馈后继续", async ({ page }) => {
  const cases = [
    {
      route: "client-xinglan/client",
      current: "已形成公司与联系人草稿",
      hidden: "是否联系 HRD 周雅雯？",
      confirm: "确认公司与联系人",
      next: "是否联系 HRD 周雅雯？",
      large: false,
    },
    {
      route: "position-vla/position",
      current: "首批候选人已完成匹配",
      hidden: "新信息只影响 6 位候选人",
      confirm: "确认首批名单",
      next: "新信息只影响 6 位候选人",
      large: true,
    },
  ];
  for (const item of cases) {
    await page.goto(`./#/workstreams/${item.route}`);
    await expect(page.getByText(item.current)).toBeVisible();
    await expect(page.getByText(item.hidden)).toHaveCount(0);
    if (item.large) {
      await page
        .getByRole("button", {
          name: /查看大结果：首批候选人已完成匹配/,
        })
        .click();
    }
    await page.getByRole("button", { name: item.confirm }).click();
    await expect(page.getByText(item.next)).toBeVisible();
  }

  await page.goto("./#/workstreams/mapping-embodied/mapping");
  await expect(
    page.getByText("允许读取平台中的一度关系用于核验联系路径？"),
  ).toBeVisible();
  await expect(page.getByText("7 条人物关系需要人工核验")).toHaveCount(0);
  await page.getByRole("button", { name: "当前业务主线持续允许" }).click();
  await expect(page.getByText("7 条人物关系需要人工核验")).toBeVisible();

  await page.goto("./#/workstreams/career-linhao/career");
  await expect(page.getByText("允许解析候选人刚发送的新简历？")).toBeVisible();
  await expect(page.getByText("新简历已生成资料更新建议")).toHaveCount(0);
  await page.getByRole("button", { name: "仅允许本次" }).click();
  await expect(page.getByText("新简历已生成资料更新建议")).toBeVisible();
});

test("Agent 操作权限在主线对话中显示当前授权范围", async ({ page }) => {
  await page.goto("./#/workstreams/position-vla/position");
  await expect(
    page.getByText("允许使用已登录的人才平台查找候选人？"),
  ).toBeVisible();
  await expect(
    page.getByText("当前业务主线已授权", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(/已获准在当前业务主线中使用猎聘和脉脉/).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "当前业务主线持续允许" }),
  ).toHaveCount(0);
});

test("业务主线查看与确认始终留在当前页面", async ({ page }) => {
  await page.goto("./#/workstreams/client-xinglan/client");
  await expect(page.getByLabel("公司与联系人草稿")).toBeVisible();
  await expect(page.getByLabel("业务主线详情")).toHaveCount(0);

  await page.goto("./#/workstreams/position-vla/position");
  const workstreamUrl = page.url();
  await expect(page.getByLabel("业务主线详情")).toHaveCount(0);
  await page.getByRole("button", { name: "查看任务运行" }).click();
  await expect(page).toHaveURL(workstreamUrl);
  await expect(
    page.getByLabel("业务主线详情").getByText("2 个人才平台任务正在运行"),
  ).toBeVisible();
  await page.getByRole("button", { name: "关闭业务主线详情" }).click();

  await page
    .getByRole("button", { name: /查看大结果：首批候选人已完成匹配/ })
    .click();
  await expect(
    page.getByLabel("业务主线详情").getByText("首批候选人已完成匹配"),
  ).toBeVisible();
  await page.getByRole("button", { name: "确认首批名单" }).click();
  await expect(page).toHaveURL(workstreamUrl);
  await expect(page.getByText("候选人赵星羽已加入结果")).toBeVisible();

  await page.getByRole("button", { name: "打开候选人" }).click();
  await expect(page).toHaveURL(workstreamUrl);
  await expect(
    page.getByLabel("业务主线详情").getByText("候选人赵星羽已加入结果"),
  ).toBeVisible();

  await page.getByRole("button", { name: "关闭业务主线详情" }).click();
  await page.getByRole("button", { name: "主线信息" }).click();
  await page.getByRole("button", { name: "终止业务主线" }).click();
  await page.getByRole("button", { name: "确认终止" }).click();
  await expect(page).toHaveURL(workstreamUrl);
  await expect(
    page.locator(".conversation-waiting-note b").getByText("业务主线已终止"),
  ).toBeVisible();
  await expect(page.getByLabel("发送给 Hunter")).toBeDisabled();
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
    .getByRole("button", { name: /查看大结果：首批候选人已完成匹配/ })
    .click();
  await expect(
    page.getByRole("button", { name: "Agent 操作模式" }),
  ).toContainText("自动执行");
});

test("移动端新建主线使用对话、计划列表和原处配置编辑", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./#/workstreams/new?type=position");
  await expect(page.getByText("主线创建计划", { exact: true })).toHaveCount(0);
  await page
    .getByRole("button", { name: /为星澜机器人招聘具身智能 VLA/ })
    .click();
  await expect(page.getByText("2 / 4 已完成")).toBeVisible();
  await page.locator(".plan-list-toggle").click();
  await expect(page.getByText("补齐找人范围与完成标准")).toBeVisible();
  await page.locator(".plan-list-toggle").click();
  await page.getByRole("button", { name: "修改配置" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "取消", exact: true }).click();

  await page.getByRole("button", { name: "Agent 操作模式" }).click();
  await page.getByRole("button", { name: /规划模式/ }).click();
  await expect(
    page.getByRole("button", { name: "Agent 操作模式" }),
  ).toContainText("规划模式");
});

test("对话输入统一接收文件、截图、链接并随消息发送", async ({ page }) => {
  await page.goto("./#/workstreams/new?type=position");
  await page.getByRole("button", { name: "添加文件" }).click();
  await page.getByRole("button", { name: "添加截图" }).click();
  await expect(page.getByLabel("待发送附件")).toContainText(
    "星澜机器人岗位补充.docx",
  );
  await expect(page.getByLabel("待发送附件")).toContainText("客户聊天截图.png");
  await page.getByRole("button", { name: "添加链接" }).click();
  await expect(page.getByLabel("发送给 Hunter")).toContainText(
    "xinglan-robotics.cn",
  );
  await page.getByRole("button", { name: "发送", exact: true }).click();
  await expect(page.getByLabel("待发送附件")).toHaveCount(0);
  await expect(
    page.getByText("星澜机器人岗位补充.docx", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("客户聊天截图.png", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("2 / 4 已完成")).toBeVisible();
  await expect(page.getByText("补充说明", { exact: true })).toHaveCount(0);
});

test("新信息会更新唯一执行计划而不是创建第二份计划", async ({ page }) => {
  await page.goto("./#/workstreams/position-vla/position");
  await expect(page.getByText("3 / 5 已完成")).toBeVisible();
  await page.locator(".plan-list-toggle").click();
  await page
    .getByRole("button", { name: /查看大结果：首批候选人已完成匹配/ })
    .click();
  await page.getByRole("button", { name: "确认首批名单" }).click();
  await expect(page.getByText("新信息只影响 6 位候选人")).toBeVisible();
  await page.getByRole("button", { name: "确认局部重匹配" }).click();
  await expect(
    page.getByText("重算 6 位候选人的地点适配", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/3 \/ 6 已完成 · v5/)).toBeVisible();
  await expect(page.getByText(/地点范围已经更新为上海或杭州/)).toBeVisible();
});

test("移动端业务主线点击大结果后用 Drawer 查看详情", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./#/workstreams/position-vla/position");

  await page
    .getByRole("button", { name: /查看大结果：首批候选人已完成匹配/ })
    .click();
  const drawer = page.locator(".drawer");
  await expect(
    drawer.getByRole("complementary", { name: "业务主线详情" }),
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
