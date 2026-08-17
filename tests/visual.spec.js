import { test } from "@playwright/test";

const pages = [
  ["review", "/review", 1440, 900],
  ["dashboard", "/home", 1440, 900],
  ["independent-tasks", "/tasks", 1440, 900],
  ["position-workstream", "/workstreams/position-vla/position", 1440, 900],
  ["task-detail", "/tasks/task-sourcing", 1440, 900],
  ["candidate-mobile", "/candidates/lin-hao", 390, 844],
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
    .getByRole("button", { name: /查看详情：首批候选人已完成匹配/ })
    .click();
  await page.waitForTimeout(250);
  await page.screenshot({
    path: "artifacts/position-workstream-detail-1440x900.png",
    fullPage: true,
  });
});

test("截图 position-workstream-detail-mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./#/workstreams/position-vla/position");
  await page
    .getByRole("button", { name: /查看详情：首批候选人已完成匹配/ })
    .click();
  await page.waitForTimeout(250);
  await page.screenshot({
    path: "artifacts/position-workstream-detail-mobile-390x844.png",
    fullPage: true,
  });
});
