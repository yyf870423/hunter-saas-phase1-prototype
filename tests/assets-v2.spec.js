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

  await dialog.getByLabel("姓名 *").fill("周砚秋");
  await dialog.getByLabel("当前公司").fill("星澜机器人");
  await dialog.getByLabel("候选人摘要").fill("来自行业活动的公开资料。");
  await dialog.getByRole("button", { name: "创建" }).click();

  const row = page.getByRole("row").filter({ hasText: "周砚秋" });
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: "删除" }).click();
  const deleteDialog = page.getByRole("dialog", { name: "删除候选人" });
  await deleteDialog.getByRole("button", { name: "删除" }).click();
  await expect(row).toHaveCount(0);
});

test("资产新建与编辑复用同一字段结构", async ({ page }) => {
  await page.goto("./#/companies");
  await page.getByRole("button", { name: "新建公司" }).click();
  const createDialog = page.getByRole("dialog", { name: "新建公司" });
  for (const label of [
    "公司名称 *",
    "包含匹配词",
    "行业标签",
    "公司简介",
    "融资情况",
    "Base 地点",
    "公司优势和亮点",
    "薪资结构和福利",
    "一般面试流程",
    "其他要求",
    "备注",
  ]) {
    await expect(createDialog.getByLabel(label)).toBeVisible();
  }
  await createDialog.getByRole("button", { name: "关闭" }).click();

  await page.getByRole("row").nth(1).click();
  await page.getByRole("button", { name: "编辑" }).click();
  const editDialog = page.getByRole("dialog", { name: /编辑公司资料/ });
  for (const label of [
    "公司名称 *",
    "包含匹配词",
    "行业标签",
    "公司简介",
    "融资情况",
    "Base 地点",
    "公司优势和亮点",
    "薪资结构和福利",
    "一般面试流程",
    "其他要求",
    "备注",
  ]) {
    await expect(editDialog.getByLabel(label)).toBeVisible();
  }
});

test("公司联系人只记录人工沟通历史", async ({ page }) => {
  await page.goto("./#/contacts/zhou-yawen");
  await expect(page.getByRole("button", { name: "开始沟通" })).toHaveCount(0);
  await page.getByRole("button", { name: "添加沟通记录" }).click();
  const dialog = page.getByRole("dialog", { name: "添加沟通记录" });
  await dialog
    .getByLabel("沟通内容 *")
    .fill("电话确认本季度新增两个算法岗位。");
  await dialog.getByLabel("后续计划").fill("周五前补充岗位级别和薪资范围。");
  await dialog.getByRole("button", { name: "保存记录" }).click();
  await expect(
    page.getByText("电话确认本季度新增两个算法岗位。"),
  ).toBeVisible();
  await expect(page.getByText(/周五前补充岗位级别和薪资范围/)).toBeVisible();
});

test("业务资产只展示六类独立资产", async ({ page }) => {
  await page.goto("./#/assets");
  const assets = page.locator(".asset-grid");
  for (const name of ["公司", "岗位", "候选人", "人才摸排", "论文", "专利"]) {
    await expect(assets.getByText(name, { exact: true })).toBeVisible();
  }
  await expect(assets.getByText("联系人", { exact: true })).toHaveCount(0);
  await expect(assets.getByText("招聘机会", { exact: true })).toHaveCount(0);
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
