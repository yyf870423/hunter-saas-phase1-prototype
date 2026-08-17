import { expect, test } from "@playwright/test";

test("公共组件的选择、浮层、反馈和页面状态可交互", async ({ page }) => {
  await page.goto("./#/components");
  await page.getByRole("button", { name: "切换主题" }).click();
  await expect(page.locator(".component-page")).toHaveAttribute(
    "data-theme",
    "dark",
  );

  await page.getByRole("button", { name: "输入与选择" }).click();
  await page.locator(".select > button").click();
  await page.getByRole("button", { name: "已入职", exact: true }).click();
  await expect(page.locator(".select > button")).toContainText("已入职");
  await page.locator(".multi-select > button").click();
  await page
    .locator(".multi-options button")
    .filter({ hasText: "北京" })
    .click();
  await expect(page.locator(".multi-select > button")).toContainText(
    "已选 2 项",
  );
  await page.locator(".multi-select > button").click();
  await page.locator(".date-range > button").click();
  await page.locator(".days button").filter({ hasText: /^17$/ }).click();
  await expect(page.locator(".date-range > button")).toContainText(
    "2026-08-11 至 2026-08-17",
  );

  await page.getByRole("button", { name: "浮层与反馈" }).click();
  await page.getByRole("button", { name: "打开 Modal" }).click();
  await expect(
    page.getByRole("heading", { name: "标准操作 Modal" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "确认操作" }).click();
  await expect(page.locator(".toast")).toContainText("Modal 操作已确认");
  await page.getByRole("button", { name: "打开 Drawer" }).click();
  await expect(
    page.getByRole("heading", { name: "标准详情 Drawer" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "保存", exact: true }).click();

  await page.getByRole("button", { name: "页面状态" }).click();
  await expect(page.getByText("当前没有任务")).toBeVisible();
  await expect(page.getByText("暂时无法加载")).toBeVisible();
  await expect(page.getByText("当前角色没有权限")).toBeVisible();

  await page.getByRole("button", { name: "对话与过程" }).click();
  await expect(page.getByText("招聘信号已完成核验")).toBeVisible();
  await expect(page.getByLabel("关键证据")).toContainText("公司招聘官网");
  await page.getByRole("button", { name: "仅允许本次" }).click();
  await expect(page.getByText("授权已记录", { exact: true })).toBeVisible();
});

test("公共组件没有使用浏览器原生可见 select、checkbox 和 radio", async ({
  page,
}) => {
  await page.goto("./#/components");
  await page.getByRole("button", { name: "输入与选择" }).click();
  await expect(
    page.locator("select, input[type=checkbox], input[type=radio]"),
  ).toHaveCount(0);
});
