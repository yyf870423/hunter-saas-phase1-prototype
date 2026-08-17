import { test } from "@playwright/test";

const pages = [
  ["review", "/review", 1440, 900],
  ["dashboard", "/home", 1440, 900],
  ["independent-tasks", "/tasks", 1440, 900],
  ["new-position-workstream", "/workstreams/new?type=position", 1440, 900],
  ["position-workstream", "/workstreams/position-vla/position", 1440, 900],
  ["task-detail", "/tasks/task-sourcing", 1440, 900],
  ["task-company-detail", "/tasks/task-company", 1440, 900],
  ["task-mapping-detail", "/tasks/task-mapping", 1440, 900],
  ["task-enrich-detail", "/tasks/task-enrich", 1440, 900],
  ["candidate-mobile", "/candidates/lin-hao", 390, 844],
  [
    "new-position-workstream-mobile",
    "/workstreams/new?type=position",
    390,
    844,
  ],
  ["communication-tablet", "/communications/comm-linhao", 820, 1180],
  ["ops-dashboard", "/ops", 1440, 900],
  ["ops-task", "/ops/tasks/RUN-2B43", 1180, 820],
];

for (const [name, route, width, height] of pages) {
  test(`截图 ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto(`./#${route}`);
    await page.screenshot({
      path: `artifacts/${name}-${width}x${height}.png`,
      fullPage: true,
    });
  });
}

test("截图 position-workstream-detail", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./#/workstreams/position-vla/position");
  await page
    .getByRole("button", { name: /查看大结果：首批候选人已完成匹配/ })
    .click();
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "artifacts/position-workstream-detail-1440x900.png",
    fullPage: true,
  });
});

test("截图 client-contact-complete-review", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./#/workstreams/client-xinglan/client");
  await page
    .getByRole("button", { name: /打开审核：已形成公司与联系人草稿/ })
    .click();
  await page.screenshot({
    path: "artifacts/client-contact-complete-review-1440x900.png",
    fullPage: true,
  });
});

test("截图 position-workstream-natural-language-command", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./#/workstreams/position-vla/position");
  await page.getByText("首批候选人已完成匹配").waitFor();
  await page
    .getByLabel("发送给 Hunter")
    .fill(
      "联系 85 分以上的候选人，赵星羽虽然分高但不适合这个岗位，其余筛选出来的候选人加入岗位储备",
    );
  await page.getByRole("button", { name: "发送", exact: true }).click();
  await page.getByText(/我已按你的指令处理本批候选人/).waitFor();
  await page.screenshot({
    path: "artifacts/position-workstream-natural-language-command-1440x900.png",
    fullPage: true,
  });
});

test("截图 position-workstream-navigation-collapsed", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./#/workstreams/position-vla/position");
  await page.getByRole("button", { name: "收起业务主线" }).click();
  await page.screenshot({
    path: "artifacts/position-workstream-navigation-collapsed-1440x900.png",
    fullPage: true,
  });
});

test("截图 position-workstream-user-time-hover", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./#/workstreams/position-vla/position");
  await page
    .locator(".conversation-entry-user .conversation-bubble")
    .first()
    .hover();
  await page.screenshot({
    path: "artifacts/position-workstream-user-time-hover-1440x900.png",
    fullPage: true,
  });
});

test("截图 position-workstream-task-inline-detail", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./#/workstreams/position-vla/position");
  await page.getByRole("button", { name: /相关任务 1 运行中/ }).click();
  await page.getByRole("button", { name: "查看任务：猎聘候选人读取" }).click();
  await page.screenshot({
    path: "artifacts/position-workstream-task-inline-detail-1440x900.png",
    fullPage: true,
  });
});

test("截图 position-workstream-plan-panel", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./#/workstreams/position-vla/position");
  await page.getByRole("button", { name: /执行计划 3\/5/ }).click();
  await page.screenshot({
    path: "artifacts/position-workstream-plan-panel-1440x900.png",
    fullPage: true,
  });
});

test("截图 position-workstream-tasks-panel", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./#/workstreams/position-vla/position");
  await page.getByRole("button", { name: /相关任务 1 运行中/ }).click();
  await page.screenshot({
    path: "artifacts/position-workstream-tasks-panel-1440x900.png",
    fullPage: true,
  });
});

test("截图 client-workstream-inline-review", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./#/workstreams/client-xinglan/client");
  await page.screenshot({
    path: "artifacts/client-workstream-inline-review-1440x900.png",
    fullPage: true,
  });
});

test("截图 new-position-workstream-generated-plan", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./#/workstreams/new?type=position");
  await page
    .getByRole("button", { name: /为星澜机器人招聘具身智能 VLA/ })
    .click();
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "artifacts/new-position-workstream-generated-plan-1440x900.png",
    fullPage: true,
  });
});

test("截图 new-position-workstream-generated-plan-mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./#/workstreams/new?type=position");
  await page
    .getByRole("button", { name: /为星澜机器人招聘具身智能 VLA/ })
    .click();
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "artifacts/new-position-workstream-generated-plan-mobile-390x844.png",
    fullPage: true,
  });
});

test("截图 position-workstream-detail-mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./#/workstreams/position-vla/position");
  await page
    .getByRole("button", { name: /查看大结果：首批候选人已完成匹配/ })
    .click();
  await page.waitForTimeout(250);
  await page.screenshot({
    path: "artifacts/position-workstream-candidate-review-mobile-390x844.png",
    fullPage: true,
  });
});
