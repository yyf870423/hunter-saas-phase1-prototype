import { expect, test } from "@playwright/test";
import { opsPages, userPages } from "../src/data/pageRegistry.js";

const cases = [
  ["iPhone", { width: 390, height: 844 }, userPages],
  ["iPad", { width: 820, height: 1180 }, [...userPages, ...opsPages]],
];

for (const [device, viewport, pages] of cases) {
  test(`${device} 页面级响应式审计`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const [id, title, route] of pages) {
      await page.goto(`./#${route}`);
      await expect(page.locator("#root"), `${id} ${title}`).not.toBeEmpty();
      await expect(
        page.getByRole("heading", { name: "页面不存在" }),
      ).toHaveCount(0);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(
        overflow,
        `${id} ${title} 在 ${device} 存在 ${overflow}px 页面级横向溢出`,
      ).toBeLessThanOrEqual(2);
    }
  });
}

test("运营端在手机宽度仍可横向访问全部导航", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./#/ops");
  const nav = page.locator(".ops-shell .sidebar nav");
  await expect(nav.getByRole("link", { name: "运营概览" })).toBeVisible();
  await nav.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });
  await expect(nav.getByRole("link", { name: "审计日志" })).toBeVisible();
});
