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
  await page.getByRole("button", { name: "创建并进入主线" }).click();
  await expect(
    page.getByRole("heading", { name: "发现相同目标的业务主线" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "进入原主线" }).click();
  await expect(page).toHaveURL(/position-vla\/position/);
  await expect(
    page.getByRole("heading", { name: /具身智能 VLA 算法负责人/ }),
  ).toBeVisible();
});

test("任务暂停、恢复和技术详情均可操作", async ({ page }) => {
  await page.goto("./#/tasks/task-sourcing");
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
