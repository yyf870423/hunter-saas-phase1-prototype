import { expect, test } from "@playwright/test";

const workstreamRoute = {
  client: "client-xinglan/client",
  position: "position-vla/position",
  mapping: "mapping-embodied/mapping",
  career: "career-linhao/career",
};

const scenarios = [
  ["client", "target-plan"],
  ["client", "clarification"],
  ["position", "search-strategy"],
  ["client", "source-evidence"],
  ["client", "source-conflict"],
  ["client", "company-contact-draft"],
  ["client", "recruitment-opportunity"],
  ["career", "external-reply"],
  ["mapping", "organization-draft"],
  ["position", "candidate-pool"],
  ["position", "identity-dedupe"],
  ["career", "profile-diff"],
  ["mapping", "academic-clues"],
  ["mapping", "relation-path"],
  ["position", "position-analysis"],
  ["career", "position-match"],
  ["client", "message-draft"],
  ["client", "outbound-permission"],
  ["client", "external-send-result"],
  ["position", "impact-analysis"],
  ["client", "branch-suggestion"],
  ["client", "generated-file"],
  ["client", "partial-completion"],
  ["position", "no-result"],
  ["mapping", "coverage-gap"],
  ["position", "login-blocked"],
  ["mapping", "budget-blocked"],
  ["position", "runtime-failure"],
  ["position", "gate-failure"],
  ["client", "external-wait"],
  ["career", "local-rematch"],
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test("中间结果覆盖索引完整列出 31 类结果", async ({ page }) => {
  await page.goto("./#/review/intermediate-results");
  await expect(
    page.getByRole("heading", { name: "中间结果交互覆盖索引" }),
  ).toBeVisible();
  await expect(
    page.locator(".coverage-table-v2 .coverage-row:not(.coverage-head)"),
  ).toHaveCount(31);
  await expect(page.getByText("31", { exact: true }).first()).toBeVisible();
});

for (const [kind, scene] of scenarios) {
  test(`中间结果场景可直达并保留业务上下文：${kind}/${scene}`, async ({
    page,
  }) => {
    await page.goto(`./#/workstreams/${workstreamRoute[kind]}?scene=${scene}`);
    await expect(page).toHaveURL(new RegExp(`scene=${scene}`));
    await expect(page.locator(".conversation-workspace")).toBeVisible();
    await expect(
      page
        .locator(
          ".intermediate-workspace, .business-review-workspace, .candidate-review-workspace, .conversation-thread, .conversation-detail",
        )
        .first(),
    ).toBeVisible();
  });
}

test("可编辑搜索条件支持删除、回车新增并在原处继续", async ({ page }) => {
  await page.goto(
    "./#/workstreams/position-vla/position?scene=search-strategy",
  );
  await expect(
    page.getByRole("heading", { name: "多渠道找人条件已整理" }),
  ).toBeVisible();

  const firstTag = page.locator(".editable-tags-v2 > button").first();
  const initialCount = await page.locator(".editable-tags-v2 > button").count();
  await firstTag.click();
  await expect(page.locator(".editable-tags-v2 > button")).toHaveCount(
    initialCount - 1,
  );

  const input = page.getByPlaceholder("输入后按回车").first();
  await input.fill("机器人基础模型");
  await input.press("Enter");
  await expect(
    page.getByRole("button", { name: /机器人基础模型/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "确认并继续检索" }).click();
  await expect(page.getByText(/搜索条件已确认/)).toBeVisible();
});

test("需求歧义允许选择范围或直接用自然语言回答", async ({ page }) => {
  await page.goto("./#/workstreams/client-xinglan/client?scene=clarification");
  await expect(
    page.getByRole("heading", { name: "客户开发范围需要补充确认" }),
  ).toBeVisible();
  await page.getByText("VLA 与机器人学习团队", { exact: true }).click();
  await page
    .getByPlaceholder(/直接输入范围/)
    .fill("优先上海和杭州，排除只有教育机器人业务的公司。");
  await page.getByRole("button", { name: "提交补充信息" }).click();
  await expect(page.getByText(/目标范围已补充到当前主线/)).toBeVisible();
});

test("冲突证据支持标记当前有效、过期或无效", async ({ page }) => {
  await page.goto(
    "./#/workstreams/client-xinglan/client?scene=source-conflict",
  );
  await expect(
    page.getByRole("heading", { name: "两条招聘证据存在冲突" }),
  ).toBeVisible();
  await page.getByText("标记无效", { exact: true }).nth(1).click();
  await page.getByRole("button", { name: "保存证据判断" }).click();
  await expect(page.getByText(/不把过期信息写成当前事实/)).toBeVisible();
});

test("招聘机会可分别创建岗位主线或保留待补充", async ({ page }) => {
  await page.goto(
    "./#/workstreams/client-xinglan/client?scene=recruitment-opportunity",
  );
  await expect(
    page.getByRole("heading", { name: "客户回复形成 2 个招聘机会" }),
  ).toBeVisible();
  await page.getByText("保留为招聘机会", { exact: true }).last().click();
  await page.getByRole("button", { name: "确认招聘机会" }).click();
  await expect(page.getByText(/已确认岗位会进入岗位招聘主线/)).toBeVisible();
});

test("外发结果不会自动重复发送失败项", async ({ page }) => {
  await page.goto(
    "./#/workstreams/client-xinglan/client?scene=external-send-result",
  );
  await expect(
    page.getByRole("heading", { name: "3 条外部联系已完成，1 条需要处理" }),
  ).toBeVisible();
  await expect(page.getByText("地址退信", { exact: true })).toBeVisible();
  await page.getByText("改用关系路径", { exact: true }).click();
  await page.getByRole("button", { name: "确认后续处理" }).click();
  await expect(page.getByText(/已成功项不会重复发送/)).toBeVisible();
});

test("无结果状态显示已查范围并允许修改后局部重试", async ({ page }) => {
  await page.goto("./#/workstreams/position-vla/position?scene=no-result");
  await expect(
    page.getByRole("heading", { name: "当前条件没有找到可进入审核的候选人" }),
  ).toBeVisible();
  await expect(page.getByText("猎聘 40 个详情", { exact: true })).toBeVisible();
  await page.getByText("加入杭州", { exact: true }).click();
  await page.getByRole("button", { name: "应用调整并重试" }).click();
  await expect(page.getByText(/只重跑受影响的召回与门禁步骤/)).toBeVisible();
});

test("运行失败可查看技术详情并从检查点恢复", async ({ page }) => {
  await page.goto(
    "./#/workstreams/position-vla/position?scene=runtime-failure",
  );
  await expect(
    page.getByRole("heading", { name: "候选人解析步骤连续失败" }),
  ).toBeVisible();
  await expect(page.getByText("page-2-item-9", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "查看技术详情" }).click();
  await expect(page.getByText(/VISION_PARSE_TIMEOUT/)).toBeVisible();
  await page.getByText("跳过当前附件继续", { exact: true }).click();
  await page.getByRole("button", { name: "确认恢复方式" }).click();
  await expect(page.getByText(/从保存的检查点继续/)).toBeVisible();
});

test("身份冲突支持逐人决定并回到同一业务主线", async ({ page }) => {
  await page.goto(
    "./#/workstreams/position-vla/position?scene=identity-dedupe",
  );
  await expect(
    page.getByRole("heading", { name: "发现 3 组疑似重复身份" }),
  ).toBeVisible();
  await page.getByText("保留为不同身份", { exact: true }).first().click();
  await page.getByText("继续补证据", { exact: true }).nth(1).click();
  await page.getByRole("button", { name: "确认身份处理" }).click();
  await expect(page.getByText(/身份冲突已按你的决定处理/)).toBeVisible();
});

test("候选人资料差异支持逐字段保留旧值或采用建议", async ({ page }) => {
  await page.goto("./#/workstreams/career-linhao/career?scene=profile-diff");
  await expect(
    page.getByRole("heading", { name: "新简历已生成字段级更新建议" }),
  ).toBeVisible();
  await page.getByText("保留原值", { exact: true }).first().click();
  await page.getByRole("button", { name: "应用所选更新" }).click();
  await expect(page.getByText(/字段更新已按你的选择写入候选人/)).toBeVisible();
});

test("论文专利线索支持选择后确认关联", async ({ page }) => {
  await page.goto(
    "./#/workstreams/mapping-embodied/mapping?scene=academic-clues",
  );
  await expect(
    page.getByRole("heading", { name: "论文与专利线索已归入人物证据" }),
  ).toBeVisible();
  const checkboxes = page.locator(".review-table-v2 .check-control");
  await expect(checkboxes).toHaveCount(3);
  await checkboxes.last().click();
  await page.getByRole("button", { name: "确认所选线索" }).click();
  await expect(page.getByText(/确认的论文与专利线索已关联/)).toBeVisible();
});

test("外部回复允许查看附件、补录人工信息并进入差异分析", async ({ page }) => {
  await page.goto("./#/workstreams/career-linhao/career?scene=external-reply");
  await expect(
    page.getByRole("heading", { name: "候选人回复并发送新版简历" }),
  ).toBeVisible();
  await expect(page.getByText("林昊-2026-08-16.pdf")).toBeVisible();
  await page
    .getByPlaceholder(/记录电话、微信或线下沟通/)
    .fill("电话确认：可以接受每周三天在杭州办公。");
  await page.getByRole("button", { name: "读取并比较资料" }).click();
  await expect(
    page.getByText(/新简历和人工补充信息已进入字段差异分析/),
  ).toBeVisible();
});

test("生成文件支持预览、复制和下载反馈", async ({ page }) => {
  await page.goto("./#/workstreams/client-xinglan/client?scene=generated-file");
  await expect(
    page.getByRole("heading", { name: "客户开发调研记录已生成" }),
  ).toBeVisible();
  await expect(page.locator(".markdown-file-v2 pre")).toContainText(
    "已确认结论",
  );
  await page.getByRole("button", { name: "复制" }).click();
  await expect(page.getByRole("button", { name: "已复制" })).toBeVisible();
  await page.getByRole("button", { name: "下载" }).click();
  await expect(page.getByText("文件下载已开始")).toBeVisible();
});

test("部分完成允许接受、继续或缩小范围", async ({ page }) => {
  await page.goto(
    "./#/workstreams/client-xinglan/client?scene=partial-completion",
  );
  await expect(
    page.getByRole("heading", { name: "部分结果可以先交付" }),
  ).toBeVisible();
  await page.getByText("接受部分结果并结束本轮", { exact: true }).click();
  await page.getByRole("button", { name: "确认处理方式" }).click();
  await expect(page.getByText(/已按你的选择保留可用结果/)).toBeVisible();
});

test("登录阻塞保留检查点并提供恢复选择", async ({ page }) => {
  await page.goto("./#/workstreams/position-vla/position?scene=login-blocked");
  await expect(
    page.getByRole("heading", { name: "脉脉登录状态失效" }),
  ).toBeVisible();
  await expect(page.getByText("page-3-item-4", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "打开平台处理" }).click();
  await expect(page.getByText("已请求打开人才平台浏览器")).toBeVisible();
  await page.getByText("跳过该平台继续", { exact: true }).click();
  await page.getByRole("button", { name: "确认并继续" }).click();
  await expect(page.getByText(/平台登录已恢复/)).toBeVisible();
});

test("预算阻塞允许调整范围而不是让任务直接失败", async ({ page }) => {
  await page.goto(
    "./#/workstreams/mapping-embodied/mapping?scene=budget-blocked",
  );
  await expect(
    page.getByRole("heading", { name: "本轮深度摸排接近用量上限" }),
  ).toBeVisible();
  await expect(page.getByText("82%", { exact: true })).toBeVisible();
  await page.getByText("仅补齐高优先级位置", { exact: true }).click();
  await page.getByRole("button", { name: "确认并继续" }).click();
  await expect(page.getByText(/预算与范围已更新/)).toBeVisible();
});

test("局部重算支持缩小影响范围并保留其他历史结果", async ({ page }) => {
  await page.goto("./#/workstreams/career-linhao/career?scene=local-rematch");
  await expect(
    page.getByRole("heading", { name: "只需重算 6 个岗位的匹配" }),
  ).toBeVisible();
  const checks = page.locator(".impact-review-v2 .check-control");
  await checks.last().click();
  await page.getByRole("button", { name: "确认局部重算" }).click();
  await expect(page.getByText(/局部重算/)).toBeVisible();
});
