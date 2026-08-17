import { expect, test } from "@playwright/test";
import { allPages } from "../src/data/pageRegistry.js";

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

for (const [id, title, route] of allPages) {
  test(`${id} ${title} 可以访问且没有运行错误`, async ({ page }) => {
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize(
      id === "U27" || id === "U34" ? viewports.mobile : viewports.desktop,
    );
    await page.goto(`./#${route}`);
    await expect(page.locator("#root")).not.toBeEmpty();
    await expect(page.locator("h1, h2").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "页面不存在" })).toHaveCount(
      0,
    );
    await page.waitForTimeout(60);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(
      overflow,
      `${id} ${title} 存在 ${overflow}px 页面级横向溢出`,
    ).toBeLessThanOrEqual(2);
    expect(errors, `${id} ${title} 控制台错误`).toEqual([]);
  });
}

test("页面审核入口列出全部用户端和运营端页面", async ({ page }) => {
  await page.goto("./#/review");
  await expect(page.getByText("61 个页面")).toBeVisible();
  await expect(
    page.locator(".review-meta article").filter({ hasText: "用户端页面" }),
  ).toContainText("46");
  await expect(
    page.locator(".review-meta article").filter({ hasText: "运营端页面" }),
  ).toContainText("15");
});
