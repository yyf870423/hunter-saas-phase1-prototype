import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test("业务资产列表的新建与删除会真实改变当前列表", async ({ page }) => {
  await page.goto("./#/candidates");

  await page.getByRole("button", { name: "新建候选人" }).click();
  const dialog = page.getByRole("dialog", { name: "新建候选人" });
  await dialog.getByRole("button", { name: "创建" }).click();
  await expect(dialog.getByText("候选人名称不能为空")).toBeVisible();

  await dialog.getByLabel("候选人名称 *").fill("周砚秋");
  await dialog.getByLabel("所属公司").fill("星澜机器人");
  await dialog.getByLabel("补充信息").fill("来自行业活动的公开资料。");
  await dialog.getByRole("button", { name: "创建" }).click();

  const row = page.getByRole("row").filter({ hasText: "周砚秋" });
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: "删除" }).click();
  const deleteDialog = page.getByRole("dialog", { name: "删除候选人" });
  await deleteDialog.getByRole("button", { name: "删除" }).click();
  await expect(row).toHaveCount(0);
});

test("岗位解析选中更新 JD 后才显示新版 JD 说明", async ({ page }) => {
  await page.goto("./#/positions/vla-lead");
  await page.getByRole("button", { name: "AI 解析岗位" }).click();
  const dialog = page.getByRole("dialog", { name: "AI 解析岗位" });
  await expect(dialog.getByLabel("新版 JD 的说明 *")).toHaveCount(0);
  await dialog.getByRole("button", { name: "是否更新岗位 JD" }).click();
  await dialog.getByRole("button", { name: "同时更新 JD" }).click();
  await expect(dialog.getByLabel("新版 JD 的说明 *")).toBeVisible();
});

test("论文候选人关联支持多选并在详情中即时更新", async ({ page }) => {
  await page.goto("./#/papers/paper-vla");
  await page.getByRole("button", { name: "关联候选人" }).click();
  const dialog = page.getByRole("dialog", { name: "关联候选人" });
  await dialog.getByRole("button", { name: "选择候选人" }).click();
  await dialog.getByRole("button", { name: /赵星羽/ }).click();
  await dialog.getByRole("button", { name: "确认关联" }).click();
  await expect(
    page.locator(".linked-people-v2").getByText("赵星羽"),
  ).toBeVisible();
});

test("人岗匹配建议和角色门禁筛选会改变结果集合", async ({ page }) => {
  await page.goto("./#/matching/vla-lead");
  await expect(page.locator(".match-card-v2")).toHaveCount(4);

  await page.getByRole("button", { name: "全部建议" }).click();
  await page.getByRole("button", { name: "强烈建议" }).click();
  await expect(page.locator(".match-card-v2")).toHaveCount(1);
  await expect(page.getByText("角色门禁：通过")).toBeVisible();

  await page.getByRole("button", { name: "角色门禁" }).click();
  await page.getByRole("button", { name: "拒绝" }).click();
  await expect(page.getByText("没有符合条件的候选人")).toBeVisible();
  await expect(page.locator(".match-card-v2")).toHaveCount(0);
});
