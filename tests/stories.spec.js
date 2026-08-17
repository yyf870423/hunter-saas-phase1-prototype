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
  await page.getByPlaceholder("输入姓名、公司、岗位或支线任务").fill("林昊");
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
  await page.getByRole("button", { name: /相关任务 1 运行中/ }).click();
  await expect(page.getByText("猎聘候选人读取", { exact: true })).toBeVisible();
  await expect(page.getByText("脉脉候选人读取", { exact: true })).toBeVisible();
  await expect(page.getByText("首批候选人已完成匹配")).toBeVisible();
  await page
    .getByLabel("发送给 Hunter")
    .fill(
      "联系 85 分以上的候选人，赵星羽虽然分高但不适合这个岗位，其余筛选出来的候选人加入岗位储备",
    );
  await page.getByRole("button", { name: "发送", exact: true }).click();
  await expect(page.getByText(/我已按你的指令处理本批候选人/)).toBeVisible();
  await expect(
    page.getByText("允许联系已进入联系名单的候选人？"),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /查看大结果：首批候选人已完成匹配/ })
    .click();
  await expect(page.getByLabel("候选人完整审核")).toContainText(
    "18 / 18 已处理",
  );
  await expect(page.getByRole("button", { name: "提交本批审核" })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "返回业务主线" }).click();
});

test("业务主线首次只显示用户第一句话并逐条推进", async ({ page }) => {
  await page.goto("./#/workstreams/position-vla/position");
  await expect(
    page.getByText(
      "管理经验可以适当放宽，但必须有 VLA 或端到端机器人学习落地经验。今天给我首批候选人。",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(/我会把 VLA 或端到端机器人学习的真实落地经验作为核心门槛/),
  ).toHaveCount(0);
  await expect(page.getByText("Hunter 正在理解当前信息")).toBeVisible();
  await expect(
    page.getByText(/我会把 VLA 或端到端机器人学习的真实落地经验作为核心门槛/),
  ).toBeVisible();
  await expect(page.getByText("Hunter 正在更新执行计划")).toBeVisible();
});

test("业务主线所有可见文字不小于 12 CSS px", async ({ page }) => {
  await page.goto("./#/workstreams/position-vla/position");
  const undersized = await page.locator("body").evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0 &&
          element.children.length === 0 &&
          element.textContent.trim()
        );
      })
      .map((element) => ({
        text: element.textContent.trim().slice(0, 40),
        size: Number.parseFloat(window.getComputedStyle(element).fontSize),
      }))
      .filter((item) => item.size < 12),
  );
  expect(undersized).toEqual([]);
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
  await expect(
    page
      .getByRole("navigation", { name: "业务主线" })
      .getByText("具身智能 VLA 算法负责人"),
  ).toHaveCount(0);
  const after = await page.locator(".mainline-conversation-main").boundingBox();
  expect(after.width).toBeGreaterThan(before.width + 120);
  await page.getByRole("button", { name: "展开业务主线" }).click();
  await expect(workspace).not.toHaveClass(/navigation-collapsed/);
});

test("应用导航展开后恢复完整品牌、分组和用量卡样式", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./#/home");
  await page.getByRole("button", { name: "展开导航" }).click();

  const sidebar = page.locator(".sidebar");
  await expect(sidebar.getByText("智能猎头工作空间")).toBeVisible();
  await expect(sidebar.getByText("业务工作区")).toBeVisible();
  await expect(sidebar.getByRole("link", { name: "支线任务" })).toBeVisible();
  await expect(sidebar.getByText("本月 Agent 用量")).toBeVisible();
  expect((await sidebar.boundingBox()).width).toBe(224);

  await page.getByRole("button", { name: "收起导航" }).click();
  await expect(sidebar.getByText("智能猎头工作空间")).toHaveCount(0);
  expect((await sidebar.boundingBox()).width).toBe(64);
});

test("工作台按业务主线、支线任务、信号与机会、行动队列分层", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./#/home");

  const orderedSections = await page
    .locator(".page-section")
    .evaluateAll((sections) =>
      sections
        .slice(0, 4)
        .map((section) =>
          [
            "dashboard-mainline-focus",
            "dashboard-task-panel-v2",
            "dashboard-discoveries",
            "dashboard-action-queue",
          ].find((className) => section.classList.contains(className)),
        ),
    );
  expect(orderedSections).toEqual([
    "dashboard-mainline-focus",
    "dashboard-task-panel-v2",
    "dashboard-discoveries",
    "dashboard-action-queue",
  ]);

  await expect(page.getByText("星澜机器人招聘机会").first()).toBeVisible();
  await expect(page.locator(".dashboard-task-cards > button")).toHaveCount(3);
  await expect(
    page.locator(".dashboard-discoveries > div > button"),
  ).toHaveCount(3);
  await expect(page.locator(".action-queue-list > article")).toHaveCount(0);

  await page.getByRole("button", { name: /展开行动队列/ }).click();
  await expect(page.locator(".action-queue-list > article")).toHaveCount(5);
  await page.getByRole("button", { name: /收起行动队列/ }).click();
  await expect(page.locator(".action-queue-list > article")).toHaveCount(0);
});

test("执行计划与相关任务默认收起并共享右侧检查区", async ({ page }) => {
  await page.goto("./#/workstreams/position-vla/position");
  await expect(page.getByLabel("计划与相关任务")).toHaveCount(0);
  await expect(page.getByText("猎聘候选人读取", { exact: true })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: /执行计划 3\/5/ }).click();
  await expect(page.getByLabel("执行计划详情")).toBeVisible();
  await expect(page.getByLabel("相关任务详情")).toHaveCount(0);
  await page.getByRole("button", { name: /相关任务 1 运行中/ }).click();
  await expect(page.getByLabel("相关任务详情")).toBeVisible();
  await expect(page.getByLabel("执行计划详情")).toHaveCount(0);
});

test("相关任务在当前页检查并可选择新标签页", async ({ page }) => {
  await page.goto("./#/workstreams/position-vla/position");
  const currentUrl = page.url();
  await page.getByRole("button", { name: /相关任务 1 运行中/ }).click();
  await page.getByRole("button", { name: "查看任务：猎聘候选人读取" }).click();
  await expect(page).toHaveURL(currentUrl);
  await expect(
    page.getByRole("complementary", { name: "业务主线详情" }),
  ).toContainText("68%");
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "新标签页打开" }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  await expect(popup).toHaveURL(/tasks\/task-sourcing/);
  await popup.close();
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
      open: /打开审核：已形成公司与联系人草稿/,
      submit: "提交联系人审核",
      next: "是否联系 HRD 周雅雯？",
      large: false,
    },
    {
      route: "position-vla/position",
      current: "首批候选人已完成匹配",
      hidden: "地点变化需要重新评估 6 位候选人",
      open: /查看大结果：首批候选人已完成匹配/,
      submit: "提交本批审核",
      next: "允许联系已进入联系名单的候选人？",
      large: true,
    },
  ];
  for (const item of cases) {
    await page.goto(`./#/workstreams/${item.route}`);
    await expect(page.getByText(item.current)).toBeVisible();
    await expect(page.getByText(item.hidden)).toHaveCount(0);
    await page.getByRole("button", { name: item.open }).click();
    await page.getByRole("button", { name: "按建议处理未审核" }).click();
    await page.getByRole("button", { name: item.submit }).click();
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

test("客户开发主线从信号核验渐进到客户回复和岗位机会", async ({ page }) => {
  await page.goto("./#/workstreams/client-xinglan/client");
  await page
    .getByRole("button", { name: /打开审核：已形成公司与联系人草稿/ })
    .click();
  await page.getByRole("button", { name: "按建议处理未审核" }).click();
  await page.getByRole("button", { name: "提交联系人审核" }).click();
  await page
    .getByRole("button", { name: /打开审核：是否联系 HRD 周雅雯/ })
    .click();
  const revisedMail =
    "周女士，您好。关注到星澜机器人正在扩充 VLA 团队，想先确认相关岗位的 HC、目标职级和合作方式。如方便，我可以根据贵司要求整理目标人才画像。";
  await page.getByLabel("邮件正文").fill(revisedMail);
  await page.getByRole("button", { name: "按建议处理未审核" }).click();
  await page.getByRole("button", { name: "保存联系内容" }).click();
  const resolvedContactEvent = page
    .getByText("是否联系 HRD 周雅雯？", { exact: true })
    .locator("..");
  await resolvedContactEvent.locator("button.large-result-link").click();
  await expect(page.getByLabel("邮件正文")).toHaveValue(revisedMail);
  await expect(page.getByLabel("邮件正文")).toBeDisabled();
  await page.getByRole("button", { name: "返回业务主线" }).click();
  await page.getByRole("button", { name: "仅允许本次" }).click();
  await expect(page.getByText("等待客户联系人回复")).toBeVisible();
  await expect(page.getByText("客户回复确认 2 个在招岗位")).toBeVisible();
  await expect(page.getByText("发现潜在支线：灵巧手团队也在扩招")).toHaveCount(
    0,
  );
  await page
    .getByRole("button", { name: /打开审核：客户回复确认 2 个在招岗位/ })
    .click();
  await page.getByRole("button", { name: "按建议处理未审核" }).click();
  await page.getByRole("button", { name: "提交机会审核" }).click();
  await expect(
    page.getByText("发现潜在支线：灵巧手团队也在扩招"),
  ).toBeVisible();
});

test("人才摸排支持自然语言核验关系并继续发现支线", async ({ page }) => {
  await page.goto("./#/workstreams/mapping-embodied/mapping");
  await page.getByRole("button", { name: "当前业务主线持续允许" }).click();
  await expect(page.getByText("7 条人物关系需要人工核验")).toBeVisible();
  await page
    .getByLabel("发送给 Hunter")
    .fill("有两项独立证据的关系确认写入，只有单一来源的继续保留为待核验");
  await page.getByRole("button", { name: "发送", exact: true }).click();
  await expect(
    page.getByText(/我已按你的回复处理当前人才摸排结果/),
  ).toBeVisible();
  await expect(
    page.getByText("发现潜在支线：云脉芯能成立机器人芯片团队"),
  ).toBeVisible();
});

test("候选人求职支持自然语言控制资料更新和局部重匹配", async ({ page }) => {
  await page.goto("./#/workstreams/career-linhao/career");
  await expect(page.getByText("允许解析候选人刚发送的新简历？")).toBeVisible();
  await page
    .getByLabel("发送给 Hunter")
    .fill("解析新简历，但不要覆盖原资料；先给我字段差异，再只重算受影响岗位");
  await page.getByRole("button", { name: "发送", exact: true }).click();
  await expect(
    page.getByText(/我已按你的回复处理候选人资料或岗位匹配结果/),
  ).toBeVisible();
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
  await expect(
    page.getByRole("region", { name: "公司与联系人草稿" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "确认公司与联系人" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: /打开审核：已形成公司与联系人草稿/ })
    .click();
  await expect(page.getByLabel("审核星澜机器人及 4 位联系人")).toBeVisible();
  await expect(page.getByText("yawen.zhou@xinglan-robotics.com")).toBeVisible();
  await expect(
    page.getByText("可直接联系", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText("联系方式状态", { exact: true })).toBeVisible();
  await expect(page.getByText("证据与来源", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "返回业务主线" }).click();
  await expect(page.getByLabel("业务主线详情")).toHaveCount(0);

  await page.goto("./#/workstreams/position-vla/position");
  const workstreamUrl = page.url();
  await expect(page.getByLabel("业务主线详情")).toHaveCount(0);
  await page.getByRole("button", { name: /相关任务 1 运行中/ }).click();
  await page.getByRole("button", { name: "查看任务：猎聘候选人读取" }).click();
  await expect(page).toHaveURL(workstreamUrl);
  await expect(
    page
      .getByRole("complementary", { name: "业务主线详情" })
      .getByText("猎聘候选人读取"),
  ).toBeVisible();
  await page.getByRole("button", { name: "关闭业务主线详情" }).click();

  await page
    .getByRole("button", { name: /查看大结果：首批候选人已完成匹配/ })
    .click();
  await expect(page.getByLabel("候选人完整审核")).toBeVisible();
  await expect(page.getByText("匹配得分", { exact: true })).toBeVisible();
  await expect(page.getByText("推荐理由", { exact: true })).toBeVisible();
  await expect(page.getByText("风险提示", { exact: true })).toBeVisible();
  await expect(page.getByText("建议动作", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "提交本批审核" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "按建议处理未审核" }).click();
  await expect(
    page.getByRole("button", { name: "提交本批审核" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "提交本批审核" }).click();
  await expect(page).toHaveURL(workstreamUrl);
  await expect(
    page.getByText("提交首批候选人审核结果", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(/审核结果已保存：12 位候选人进入联系名单/),
  ).toBeVisible();
  await expect(
    page.getByText("允许联系已进入联系名单的候选人？"),
  ).toBeVisible();
  await page.getByRole("button", { name: "仅准备本批联系" }).click();
  await expect(
    page.getByText(
      "客户刚补充：工作地点除了上海，也可以考虑杭州。请更新候选人结果。",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText("地点变化需要重新评估 6 位候选人", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("候选人赵星羽已加入结果")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "确认局部重匹配" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "主线信息" }).click();
  await page.getByRole("button", { name: "终止业务主线" }).click();
  await page.getByRole("button", { name: "确认终止" }).click();
  await expect(page).toHaveURL(workstreamUrl);
  await expect(
    page.locator(".conversation-waiting-note b").getByText("业务主线已终止"),
  ).toBeVisible();
  await expect(page.getByLabel("发送给 Hunter")).toBeDisabled();
});

test("四类主线的完整审核复用当前 Hunter 业务资产结构", async ({ page }) => {
  await page.goto("./#/workstreams/mapping-embodied/mapping");
  await page.getByRole("button", { name: "当前业务主线持续允许" }).click();
  await page
    .getByRole("button", { name: /打开审核：7 条人物关系需要人工核验/ })
    .click();
  await expect(page.getByLabel("核验 7 条人物关系")).toBeVisible();
  await expect(page.getByText("是否仍有效", { exact: true })).toBeVisible();
  await expect(page.getByText("联系路径", { exact: true })).toBeVisible();
  await expect(page.getByText("证据强度", { exact: true })).toBeVisible();

  await page.goto("./#/workstreams/career-linhao/career");
  await page
    .getByRole("button", { name: /打开审核：已筛出 6 个建议岗位/ })
    .click();
  await expect(page.getByLabel("林昊的 6 个建议岗位")).toBeVisible();
  await expect(page.getByText("方向经验", { exact: true })).toBeVisible();
  await expect(page.getByText("角色职级", { exact: true })).toBeVisible();
  await expect(page.getByText("匹配优势", { exact: true })).toBeVisible();
  await expect(page.getByText("风险提示", { exact: true })).toBeVisible();
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
  await expect(page.getByLabel("候选人完整审核")).toBeVisible();
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

test("对话输入接收文件和截图并允许直接粘贴链接", async ({ page }) => {
  await page.goto("./#/workstreams/new?type=position");
  await page.getByRole("button", { name: "添加文件" }).click();
  await page.getByRole("button", { name: "添加截图" }).click();
  await expect(page.getByLabel("待发送附件")).toContainText(
    "星澜机器人岗位补充.docx",
  );
  await expect(page.getByLabel("待发送附件")).toContainText("客户聊天截图.png");
  await expect(page.getByRole("button", { name: "添加链接" })).toHaveCount(0);
  await page
    .getByLabel("发送给 Hunter")
    .fill("https://www.xinglan-robotics.cn/careers/vla-lead");
  await expect(page.getByLabel("发送给 Hunter")).toHaveValue(
    /xinglan-robotics\.cn/,
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
  await expect(
    page.getByRole("button", { name: /执行计划 3\/5/ }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /查看大结果：首批候选人已完成匹配/ })
    .click();
  await page.getByRole("button", { name: "按建议处理未审核" }).click();
  await page.getByRole("button", { name: "提交本批审核" }).click();
  await page.getByRole("button", { name: "仅准备本批联系" }).click();
  await expect(page.getByText("地点变化需要重新评估 6 位候选人")).toBeVisible();
  await page
    .getByRole("button", { name: /打开审核：地点变化需要重新评估 6 位候选人/ })
    .click();
  await page.getByRole("button", { name: "按建议处理未审核" }).click();
  await page.getByRole("button", { name: "提交影响处理" }).click();
  await page.getByRole("button", { name: /执行计划 3\/6/ }).click();
  await expect(
    page.getByText("重算 6 位候选人的地点适配", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("执行计划详情").getByText("v5")).toBeVisible();
  await expect(page.getByText(/地点范围已更新为上海或杭州/)).toBeVisible();
});

test("移动端业务主线点击大结果后仍在当前页完成审核", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./#/workstreams/position-vla/position");

  await page
    .getByRole("button", { name: /查看大结果：首批候选人已完成匹配/ })
    .click();
  await expect(page.getByLabel("候选人完整审核")).toBeVisible();
  await expect(page.locator(".drawer")).toHaveCount(0);
  await page.getByRole("button", { name: "返回业务主线" }).click();
  await expect(page.getByLabel("候选人完整审核")).toHaveCount(0);
});

test("全局支线任务列表只显示独立支线任务", async ({ page }) => {
  await page.goto("./#/tasks");
  await expect(page.getByRole("heading", { name: "支线任务" })).toBeVisible();
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
  await expect(
    page.locator(".toast").getByText("任务已暂停，检查点已保留"),
  ).toBeVisible();
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

test("不同支线任务展示各自业务过程而非复用寻访日志", async ({ page }) => {
  const cases = [
    ["task-company", "核验融资与招聘信号", "交付客户机会草稿"],
    ["task-sourcing", "从人才平台召回候选人", "岗位角色门禁与匹配"],
    ["task-mapping", "确认团队和研究方向", "发现客户开发支线"],
    ["task-enrich", "记录候选人异步回复", "生成字段级更新建议"],
  ];
  for (const [taskId, first, last] of cases) {
    await page.goto(`./#/tasks/${taskId}`);
    await expect(page.getByText(first, { exact: true })).toBeVisible();
    await expect(page.getByText(last, { exact: true })).toBeVisible();
  }
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
