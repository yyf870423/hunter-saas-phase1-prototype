import { test } from "@playwright/test";

const pages = [
  ["review", "/review", 1440, 900],
  ["dashboard", "/home", 1440, 900],
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
