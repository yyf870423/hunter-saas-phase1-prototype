import { expect, test } from "@playwright/test";

const tableRoutes = [
  "/companies",
  "/positions",
  "/candidates",
  "/papers",
  "/patents",
  "/tasks",
  "/signals",
  "/mappings",
  "/imports",
  "/ops/workspaces",
  "/ops/tasks",
];

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "compact-desktop", width: 1024, height: 820 },
  { name: "tablet", width: 820, height: 1180 },
]) {
  test(`${viewport.name} 所有列表表格不产生横向滚动条`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const route of tableRoutes) {
      await page.goto(`./#${route}`);
      const wraps = page.locator(".table-wrap");
      for (let index = 0; index < (await wraps.count()); index += 1) {
        const overflow = await wraps
          .nth(index)
          .evaluate((element) => element.scrollWidth - element.clientWidth);
        expect(
          overflow,
          `${route} 第 ${index + 1} 个表格横向溢出 ${overflow}px`,
        ).toBeLessThanOrEqual(2);
      }
    }
  });
}

test("Modal 尺寸按内容层级生效且短视口正文可滚动", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("./#/companies");
  await page.getByRole("button", { name: "新建公司" }).click();
  const assetDialog = page.getByRole("dialog", { name: "新建公司" });
  const width = await assetDialog.evaluate((element) =>
    Math.round(element.getBoundingClientRect().width),
  );
  expect(width).toBeGreaterThanOrEqual(1000);
  await expect(assetDialog.locator(".modal-body")).toHaveCSS(
    "overflow-y",
    "auto",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(assetDialog).toBeVisible();
  const mobileBox = await assetDialog.boundingBox();
  expect(mobileBox.width).toBeLessThanOrEqual(374);
  expect(mobileBox.height).toBeLessThanOrEqual(828);
});
