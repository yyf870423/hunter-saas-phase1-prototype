import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Button,
  DateRange,
  Drawer,
  IconButton,
  Input,
  Modal,
  MultiSelect,
  PageHeader,
  Progress,
  Select,
  Status,
  Switch,
  Tabs,
  Textarea,
  useToast,
} from "../components/ui";
import { Icon } from "../components/Icon";
import { InfoGrid, SummaryList, toneForStatus } from "../components/business";
import { usePrototype } from "../store/PrototypeStore";

const settingNav = [
  ["user", "个人与工作空间", "/account/profile"],
  ["bell", "通知设置", "/account/notifications"],
  ["task", "自动化与授权", "/account/automation"],
  ["signal", "人才平台", "/account/platforms"],
  ["briefcase", "订阅与订单", "/account/subscription"],
  ["database", "用量", "/account/usage"],
  ["download", "数据与支持", "/account/data"],
];

function SettingsShell({ title, description, children, actions }) {
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="账户与工作空间"
        title={title}
        description={description}
        actions={actions}
      />
      <div className="settings-layout">
        <aside className="settings-nav surface">
          {settingNav.map(([icon, label, route]) => (
            <NavLink
              key={route}
              to={route}
              className={({ isActive }) => (isActive ? "is-active" : "")}
            >
              <Icon name={icon} />
              <span>{label}</span>
              <Icon name="chevronRight" />
            </NavLink>
          ))}
        </aside>
        <section className="settings-content">{children}</section>
      </div>
    </div>
  );
}

export function ProfileSettingsPage() {
  const toast = useToast();
  const [danger, setDanger] = useState(false);
  return (
    <SettingsShell
      title="个人与工作空间"
      description="管理个人资料、工作空间名称、登录安全和注销。"
      actions={
        <Button tone="primary" onClick={() => toast("资料已保存")}>
          保存修改
        </Button>
      }
    >
      <div className="surface settings-section">
        <header className="surface-header">
          <h2>个人资料</h2>
        </header>
        <div className="surface-body form-grid">
          <Input label="姓名" value="沈岚" readOnly />
          <Input label="手机号" value="138 1024 6688" readOnly />
          <Input label="邮箱" value="shenlan@example.com" readOnly />
          <Select
            label="时区"
            value="shanghai"
            onChange={() => {}}
            options={[{ value: "shanghai", label: "Asia/Shanghai" }]}
          />
        </div>
      </div>
      <div className="surface settings-section">
        <header className="surface-header">
          <h2>工作空间</h2>
        </header>
        <div className="surface-body form-grid">
          <Input
            className="span-2"
            label="工作空间名称"
            defaultValue="沈岚的猎头工作空间"
          />
          <Textarea
            className="span-2"
            label="业务方向"
            defaultValue="具身智能、机器人、自动驾驶核心技术岗位"
          />
        </div>
      </div>
      <div className="surface settings-section">
        <header className="surface-header">
          <h2>登录安全</h2>
        </header>
        <div className="settings-list">
          <button onClick={() => toast("修改密码入口已打开", "info")}>
            <span>
              <b>登录密码</b>
              <small>最近更新于 2026 年 7 月 12 日</small>
            </span>
            <Icon name="chevronRight" />
          </button>
          <button onClick={() => toast("验证码设置已打开", "info")}>
            <span>
              <b>手机号验证码</b>
              <small>已启用</small>
            </span>
            <Status tone="success">正常</Status>
          </button>
        </div>
      </div>
      <div className="surface settings-section danger-zone">
        <header className="surface-header">
          <h2>注销工作空间</h2>
        </header>
        <div className="surface-body between">
          <p>注销会进入多步确认。数据导出完成前不会执行删除。</p>
          <Button tone="dangerGhost" onClick={() => setDanger(true)}>
            申请注销
          </Button>
        </div>
      </div>
      <Modal
        danger
        open={danger}
        onClose={() => setDanger(false)}
        title="申请注销工作空间"
        description="该操作不可立即撤销"
        footer={
          <>
            <Button onClick={() => setDanger(false)}>取消</Button>
            <Button tone="danger" onClick={() => setDanger(false)}>
              继续身份验证
            </Button>
          </>
        }
      >
        <div className="stack">
          <p>
            注销前会先创建完整数据导出。正式删除需要再次验证身份并确认影响范围。
          </p>
          <Input
            label="输入工作空间名称以继续"
            placeholder="沈岚的猎头工作空间"
          />
        </div>
      </Modal>
    </SettingsShell>
  );
}

export function NotificationSettingsPage() {
  const toast = useToast();
  const [values, setValues] = useState({
    tasks: true,
    replies: true,
    signals: true,
    platforms: true,
    subscription: true,
    email: true,
  });
  const [quiet, setQuiet] = useState("22:00 至 08:00");
  const toggle = (key, value) =>
    setValues((current) => ({ ...current, [key]: value }));
  return (
    <SettingsShell
      title="通知设置"
      description="设置不同事件的站内与页面外通知，以及免打扰和摘要频率。"
      actions={
        <Button tone="primary" onClick={() => toast("通知设置已保存")}>
          保存设置
        </Button>
      }
    >
      <div className="surface settings-section">
        <header className="surface-header">
          <h2>业务通知</h2>
          <Status tone="success">站内通知正常</Status>
        </header>
        <div className="settings-list">
          <Switch
            checked={values.tasks}
            onChange={(value) => toggle("tasks", value)}
            label="任务需要处理"
            description="等待确认、失败、暂停和恢复"
          />
          <Switch
            checked={values.replies}
            onChange={(value) => toggle("replies", value)}
            label="收到外部回复"
            description="候选人、联系人和人才平台回复"
          />
          <Switch
            checked={values.signals}
            onChange={(value) => toggle("signals", value)}
            label="高优先级机会与信号"
            description="融资、招聘、人才动向和支线建议"
          />
          <Switch
            checked={values.platforms}
            onChange={(value) => toggle("platforms", value)}
            label="人才平台状态"
            description="登录失效、风控和任务受影响"
          />
          <Switch
            checked={values.subscription}
            onChange={(value) => toggle("subscription", value)}
            label="权益与用量"
            description="额度、预算、续订和到期"
          />
        </div>
      </div>
      <div className="surface settings-section">
        <header className="surface-header">
          <h2>页面外通知</h2>
        </header>
        <div className="settings-list">
          <Switch
            checked={values.email}
            onChange={(value) => toggle("email", value)}
            label="邮件通知"
            description="shenlan@example.com · 已验证"
          />
          <button onClick={() => toast("测试邮件已发送")}>
            <span>
              <b>发送测试邮件</b>
              <small>验证通知是否能正常到达</small>
            </span>
            <Icon name="chevronRight" />
          </button>
        </div>
      </div>
      <div className="surface settings-section">
        <header className="surface-header">
          <h2>免打扰与摘要</h2>
        </header>
        <div className="surface-body form-grid">
          <Input
            label="免打扰时间"
            value={quiet}
            onChange={(event) => setQuiet(event.target.value)}
          />
          <Select
            label="摘要频率"
            value="daily"
            onChange={() => {}}
            options={[
              { value: "daily", label: "每天 18:00" },
              { value: "twice", label: "每天两次" },
              { value: "weekly", label: "每周一" },
            ]}
          />
        </div>
      </div>
    </SettingsShell>
  );
}

export function AutomationSettingsPage() {
  const { state, update } = usePrototype();
  const toast = useToast();
  const [tab, setTab] = useState("auto");
  const [edit, setEdit] = useState(null);
  const [test, setTest] = useState(false);
  const [remove, setRemove] = useState(null);
  const filtered = state.rules.filter((rule) =>
    tab === "auto"
      ? rule.type === "自动确认"
      : tab === "contact"
        ? rule.type === "外部联系"
        : rule.type === "任务联动",
  );
  const toggle = (rule) =>
    update((current) => ({
      ...current,
      rules: current.rules.map((item) =>
        item.id === rule.id
          ? { ...item, status: item.status === "生效" ? "暂停" : "生效" }
          : item,
      ),
    }));
  return (
    <SettingsShell
      title="自动化与授权"
      description="配置自动确认、外部联系和任务联动的范围、预算、停止条件和有效期。"
      actions={
        <Button
          tone="primary"
          icon="plus"
          onClick={() =>
            setEdit({
              type:
                tab === "auto"
                  ? "自动确认"
                  : tab === "contact"
                    ? "外部联系"
                    : "任务联动",
            })
          }
        >
          新建规则
        </Button>
      }
    >
      <div className="banner banner-info">
        <Icon name="info" />
        <span>
          <b>自动化不能关闭 Hunter 的安全与质量门禁</b>
          <small>
            输出不符合要求时会修正或重试，达到上限后停止，不会直接写入不合格数据。
          </small>
        </span>
      </div>
      <div className="surface settings-section">
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: "auto", label: "自动确认" },
            { value: "contact", label: "外部联系" },
            { value: "linkage", label: "任务联动" },
          ]}
        />
        <div className="rule-list">
          {filtered.map((rule) => (
            <article key={rule.id}>
              <span>
                <b>{rule.name}</b>
                <small>
                  {rule.type} · 最近执行昨天 16:42 · 本月用量 ￥18.60
                </small>
              </span>
              <Status tone={toneForStatus(rule.status)}>{rule.status}</Status>
              <Button size="sm" onClick={() => setTest(true)}>
                测试规则
              </Button>
              <IconButton
                icon={rule.status === "生效" ? "pause" : "play"}
                label={rule.status === "生效" ? "暂停" : "启用"}
                onClick={() => toggle(rule)}
              />
              <IconButton
                icon="edit"
                label="编辑"
                onClick={() => setEdit(rule)}
              />
              <IconButton
                icon="trash"
                label="撤销"
                tone="danger"
                onClick={() => setRemove(rule)}
              />
            </article>
          ))}
        </div>
      </div>
      <Drawer
        open={Boolean(edit)}
        onClose={() => setEdit(null)}
        title={edit?.id ? "编辑自动化规则" : "新建自动化规则"}
      >
        <div className="stack">
          <Input
            label="规则名称"
            defaultValue={edit?.name || ""}
            placeholder="说明这条规则做什么"
          />
          <Select
            label="规则类型"
            value={edit?.type || "自动确认"}
            onChange={() => {}}
            options={[
              { value: "自动确认", label: "自动确认" },
              { value: "外部联系", label: "外部联系" },
              { value: "任务联动", label: "任务联动" },
            ]}
          />
          <MultiSelect
            label="适用对象"
            values={["position"]}
            onChange={() => {}}
            options={[
              { value: "position", label: "岗位招聘" },
              { value: "client", label: "客户开发" },
              { value: "mapping", label: "人才摸排" },
              { value: "career", label: "候选人求职" },
            ]}
          />
          <Input label="单次预算上限" value="50" readOnly />
          <Input label="最多执行数量" value="20" readOnly />
          <Textarea
            label="停止条件"
            defaultValue="触发任一安全门禁、预算上限、用户暂停或连续两次没有新增有效结果时停止。"
          />
          <Switch
            checked={true}
            onChange={() => {}}
            label="立即生效"
            description="可以随时暂停或撤销；已经执行的外部联系不能撤回。"
          />
          <Button
            tone="primary"
            onClick={() => {
              setEdit(null);
              toast("自动化规则已保存");
            }}
          >
            保存规则
          </Button>
        </div>
      </Drawer>
      <Modal
        open={test}
        onClose={() => setTest(false)}
        title="规则预计影响"
        description="测试只计算影响，不执行任何业务动作"
        footer={
          <Button tone="primary" onClick={() => setTest(false)}>
            完成
          </Button>
        }
      >
        <InfoGrid
          columns={1}
          items={[
            ["符合条件的对象", "3 个岗位招聘主线"],
            ["预计自动确认", "12 位高置信候选人"],
            ["预计用量", "￥4.80-￥7.20"],
            ["不会执行", "不会发送外部联系，不会修改正式推进记录"],
          ]}
        />
      </Modal>
      <Modal
        danger
        open={Boolean(remove)}
        onClose={() => setRemove(null)}
        title="撤销自动化规则"
        description={remove?.name}
        footer={
          <>
            <Button onClick={() => setRemove(null)}>取消</Button>
            <Button
              tone="danger"
              onClick={() => {
                update((current) => ({
                  ...current,
                  rules: current.rules.filter((item) => item.id !== remove.id),
                }));
                setRemove(null);
                toast("规则已撤销");
              }}
            >
              确认撤销
            </Button>
          </>
        }
      >
        <p>未执行动作会停止；已执行动作和审计记录会保留。</p>
      </Modal>
    </SettingsShell>
  );
}

export function PlatformSettingsPage() {
  const { state, update } = usePrototype();
  const navigate = useNavigate();
  const toast = useToast();
  const [login, setLogin] = useState(null);
  const [restore, setRestore] = useState(false);
  const platforms = [
    {
      id: "liepin",
      name: "猎聘",
      color: "var(--platform-liepin)",
      account: "158****8562",
      last: "今天 10:26",
      affected: 0,
    },
    {
      id: "maimai",
      name: "脉脉",
      color: "var(--platform-maimai)",
      account: "沈岚",
      last: "昨天 22:14",
      affected: 1,
    },
  ];
  const healthy = platforms.filter(
    (item) => state.platform[item.id] === "healthy",
  ).length;
  return (
    <SettingsShell
      title="人才平台"
      description="管理人才平台账号、真实登录状态、受影响任务和恢复处理。"
    >
      <div className="platform-summary">
        <div>
          <strong>
            {healthy} / {platforms.length}
          </strong>
          <span>平台状态正常</span>
        </div>
        <p>
          平台登录和风控状态通过平台请求验证，不以当前页面是否打开作为判断依据。
        </p>
      </div>
      <div className="platform-list">
        {platforms.map((platform) => {
          const status = state.platform[platform.id];
          return (
            <article className="surface" key={platform.id}>
              <header>
                <span
                  className="platform-logo"
                  style={{
                    color: platform.color,
                    background: `${platform.color}18`,
                    borderColor: `${platform.color}45`,
                  }}
                >
                  {platform.name.slice(0, 1)}
                </span>
                <span>
                  <b>{platform.name}</b>
                  <small>{platform.account}</small>
                </span>
                <Status tone={status === "healthy" ? "success" : "danger"}>
                  {status === "healthy" ? "正常" : "登录失效"}
                </Status>
              </header>
              <div>
                <span>
                  <small>最后检查</small>
                  <b>{platform.last}</b>
                </span>
                <span>
                  <small>受影响任务</small>
                  <b>{platform.affected} 个</b>
                </span>
                <span>
                  <small>当前处理</small>
                  <b>{status === "healthy" ? "可以运行" : "队列已暂停"}</b>
                </span>
              </div>
              <footer>
                <Button
                  size="sm"
                  onClick={() =>
                    toast(
                      `${platform.name} 状态检查完成`,
                      status === "healthy" ? "success" : "error",
                    )
                  }
                >
                  检查状态
                </Button>
                {status === "healthy" ? (
                  <Button
                    size="sm"
                    onClick={() => toast(`${platform.name} 已暂停`, "info")}
                  >
                    暂停平台
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    tone="primary"
                    onClick={() => setLogin(platform)}
                  >
                    重新登录
                  </Button>
                )}
              </footer>
            </article>
          );
        })}
      </div>
      <Modal
        open={Boolean(login)}
        onClose={() => setLogin(null)}
        title={`重新登录${login?.name || "人才平台"}`}
        description="会在独立浏览器中打开登录页，不影响其他平台任务"
        preventClose
        footer={
          <>
            <Button onClick={() => setLogin(null)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                update((current) => ({
                  ...current,
                  platform: { ...current.platform, [login.id]: "healthy" },
                }));
                setLogin(null);
                setRestore(true);
              }}
            >
              我已完成登录
            </Button>
          </>
        }
      >
        <div className="stack">
          <div className="browser-preview">
            <header>
              <i />
              <i />
              <i />
              <span>{login?.name}登录窗口</span>
            </header>
            <div>
              <Icon name="signal" />
              <b>独立浏览器已打开</b>
              <small>请在浏览器窗口中完成登录，Hunter 不读取账号密码。</small>
            </div>
          </div>
          <div className="privacy-note">
            <Icon name="info" />
            <span>
              关闭本窗口不会停止已打开的浏览器；登录完成后返回这里确认。
            </span>
          </div>
        </div>
      </Modal>
      <Modal
        open={restore}
        onClose={() => setRestore(false)}
        title="登录状态已恢复"
        description="1 个暂停任务可以从检查点继续"
        footer={
          <>
            <Button onClick={() => setRestore(false)}>稍后处理</Button>
            <Button
              tone="primary"
              onClick={() => {
                setRestore(false);
                navigate("/tasks/task-platform");
              }}
            >
              继续受影响任务
            </Button>
          </>
        }
      >
        <SummaryList
          items={[
            {
              title: "继续脉脉候选人读取",
              meta: "岗位招聘 · 感知算法 · 保留 27 条结果",
              status: "可继续",
              icon: "task",
            },
          ]}
        />
      </Modal>
    </SettingsShell>
  );
}

export function SubscriptionSettingsPage() {
  const toast = useToast();
  const [pay, setPay] = useState(false);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const startPay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setSuccess(true);
    }, 900);
  };
  return (
    <SettingsShell
      title="订阅与订单"
      description="查看当前权益、有效期、续订和历史订单。"
    >
      <div className="subscription-hero surface">
        <div>
          <Status tone="warning">试用 · 15 天后到期</Status>
          <h2>Hunter 个人专业版</h2>
          <p>
            到期后
            Agent、搜索、浏览器和外部联系暂停，数据浏览、查看和导出继续可用。
          </p>
        </div>
        <div>
          <strong>￥399</strong>
          <span>/ 月</span>
          <Button tone="primary" onClick={() => setPay(true)}>
            续订专业版
          </Button>
        </div>
      </div>
      <div className="surface settings-section">
        <header className="surface-header">
          <h2>当前权益</h2>
        </header>
        <InfoGrid
          items={[
            ["Agent 任务", "每月 50 个"],
            ["并行任务", "最多 3 个"],
            ["人才平台", "猎聘、脉脉"],
            ["存储", "10 GB"],
            ["业务资产", "不限查看与导出"],
            ["有效期", "2026-09-01 00:00"],
          ]}
        />
      </div>
      <div className="surface settings-section">
        <header className="surface-header">
          <h2>订单记录</h2>
        </header>
        <div className="related-table">
          <button>
            <span>
              <b>ORD-260701-0192</b>
              <small>个人专业版 · 试用权益</small>
            </span>
            <Status tone="success">已生效</Status>
            <span>￥0.00</span>
            <Icon name="chevronRight" />
          </button>
        </div>
      </div>
      <Modal
        open={pay}
        onClose={() => !paying && setPay(false)}
        title="续订个人专业版"
        description="续订 1 个月，有效期顺延"
        preventClose={paying}
        footer={
          <>
            {!paying && !success && (
              <>
                <Button onClick={() => setPay(false)}>取消</Button>
                <Button tone="primary" onClick={startPay}>
                  确认支付 ￥399
                </Button>
              </>
            )}
            {success && (
              <Button
                tone="primary"
                onClick={() => {
                  setPay(false);
                  setSuccess(false);
                  toast("续订成功");
                }}
              >
                完成
              </Button>
            )}
          </>
        }
      >
        {paying ? (
          <div className="payment-state">
            <span className="spinner" />
            <h3>正在确认支付结果</h3>
            <p>请勿重复提交；即使关闭页面，订单状态也会继续更新。</p>
          </div>
        ) : success ? (
          <div className="payment-state">
            <i>
              <Icon name="check" />
            </i>
            <h3>续订成功</h3>
            <p>专业版权益已延长至 2026 年 10 月 1 日。</p>
          </div>
        ) : (
          <div className="stack">
            <InfoGrid
              columns={1}
              items={[
                ["方案", "Hunter 个人专业版"],
                ["期限", "1 个月"],
                ["金额", "￥399.00"],
              ]}
            />
            <Select
              label="支付方式"
              value="online"
              onChange={() => {}}
              options={[{ value: "online", label: "在线支付" }]}
            />
          </div>
        )}
      </Modal>
    </SettingsShell>
  );
}

export function UsageSettingsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [date, setDate] = useState("2026-08-01 至 2026-08-17");
  const [type, setType] = useState("all");
  const usage = [
    {
      label: "Agent 任务",
      value: 32,
      total: 50,
      cost: "￥68.40",
      color: "blue",
    },
    {
      label: "公开搜索",
      value: 842,
      total: 1500,
      cost: "￥21.18",
      color: "violet",
    },
    {
      label: "浏览器执行",
      value: 18,
      total: 40,
      cost: "￥0.00",
      color: "green",
    },
    { label: "存储", value: 3.6, total: 10, cost: "已包含", color: "blue" },
  ];
  return (
    <SettingsShell
      title="用量"
      description="查看 Agent、搜索、浏览器、存储和外部联系用量，并设置预算预警。"
      actions={
        <Button onClick={() => toast("用量报表已导出")}>导出报表</Button>
      }
    >
      <div className="filter-controls settings-filters">
        <DateRange value={date} onChange={setDate} width="220px" />
        <Select
          value={type}
          onChange={setType}
          options={[
            { value: "all", label: "全部能力" },
            { value: "agent", label: "Agent" },
            { value: "search", label: "公开搜索" },
            { value: "browser", label: "浏览器" },
          ]}
          width="160px"
        />
        <Button onClick={() => navigate("/account/automation")}>
          预算与停止条件
        </Button>
      </div>
      <div className="usage-grid">
        {usage.map((item) => (
          <article className="surface" key={item.label}>
            <header>
              <span>
                <b>{item.label}</b>
                <small>{item.cost}</small>
              </span>
              <strong>
                {item.value} <small>/ {item.total}</small>
              </strong>
            </header>
            <Progress
              value={Math.round((item.value / item.total) * 100)}
              tone={item.color}
            />
            <footer>
              <span>本周期</span>
              <button onClick={() => navigate("/tasks")}>查看关联任务</button>
            </footer>
          </article>
        ))}
      </div>
      <div className="surface settings-section">
        <header className="surface-header">
          <h2>每日用量趋势</h2>
          <Status tone="success">预算内</Status>
        </header>
        <div className="usage-chart" aria-label="每日用量趋势图">
          {[28, 42, 35, 64, 58, 76, 49, 68, 82, 60, 47, 72, 66, 90].map(
            (height, index) => (
              <i key={index} style={{ height: `${height}%` }}>
                <span>{height}</span>
              </i>
            ),
          )}
        </div>
      </div>
      <div className="surface settings-section">
        <header className="surface-header">
          <h2>用量预警</h2>
        </header>
        <div className="settings-list">
          <Switch
            checked={true}
            onChange={() => toast("预警设置已更新")}
            label="达到 80% 时提醒"
            description="站内通知和邮件"
          />
          <Switch
            checked={true}
            onChange={() => toast("停止条件已更新")}
            label="达到额度后停止新增消耗"
            description="运行中的可恢复任务会保留检查点"
          />
        </div>
      </div>
    </SettingsShell>
  );
}

export function DataSettingsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [diagnose, setDiagnose] = useState(false);
  const [remove, setRemove] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!exporting) return undefined;
    const timer = setInterval(
      () =>
        setProgress((value) => {
          if (value >= 100) {
            clearInterval(timer);
            setExporting(false);
            toast("数据导出已完成");
            return 100;
          }
          return value + 10;
        }),
      120,
    );
    return () => clearInterval(timer);
  }, [exporting, toast]);
  return (
    <SettingsShell
      title="数据与支持"
      description="创建数据导出、生成脱敏诊断包，并管理数据保留和不可逆操作。"
    >
      <div className="surface settings-section">
        <header className="surface-header">
          <h2>数据导出</h2>
          <Status tone="success">到期后仍可使用</Status>
        </header>
        <div className="surface-body stack">
          <p className="muted">
            导出公司、联系人、岗位、候选人、推进、摸排、论文、专利和附件索引。
          </p>
          {progress > 0 && (
            <Progress
              value={progress}
              label={progress === 100 ? "最近导出已完成" : "正在后台生成"}
            />
          )}
          <div className="inline">
            <Button
              tone="primary"
              icon="download"
              disabled={exporting}
              onClick={() => {
                setProgress(5);
                setExporting(true);
              }}
            >
              创建完整导出
            </Button>
            {progress === 100 && (
              <Button onClick={() => toast("下载已开始")}>下载导出文件</Button>
            )}
          </div>
        </div>
      </div>
      <div className="surface settings-section">
        <header className="surface-header">
          <h2>诊断与支持</h2>
        </header>
        <div className="settings-list">
          <button onClick={() => setDiagnose(true)}>
            <span>
              <b>创建脱敏诊断包</b>
              <small>
                包含任务状态、错误码、调用链和版本，不包含业务正文和附件。
              </small>
            </span>
            <Icon name="chevronRight" />
          </button>
          <button onClick={() => toast("系统健康检查完成")}>
            <span>
              <b>运行健康检查</b>
              <small>检查依赖、平台、存储和任务 Worker 状态。</small>
            </span>
            <Status tone="success">正常</Status>
          </button>
        </div>
      </div>
      <div className="surface settings-section danger-zone">
        <header className="surface-header">
          <h2>数据删除</h2>
        </header>
        <div className="surface-body between">
          <div>
            <b>删除工作空间数据</b>
            <p>永久删除前必须完成身份验证和影响确认。</p>
          </div>
          <Button tone="dangerGhost" onClick={() => setRemove(true)}>
            开始删除流程
          </Button>
        </div>
      </div>
      <Modal
        open={diagnose}
        onClose={() => setDiagnose(false)}
        title="创建脱敏诊断包"
        description="诊断包只在你主动提供给支持人员时可见"
        footer={
          <>
            <Button onClick={() => setDiagnose(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setDiagnose(false);
                toast("诊断包任务已创建");
                navigate("/tasks/task-diagnostic");
              }}
            >
              开始生成
            </Button>
          </>
        }
      >
        <div className="privacy-note">
          <Icon name="info" />
          <span>
            候选人、岗位、公司、消息、文件和 Agent 输出正文不会进入诊断包。
          </span>
        </div>
      </Modal>
      <Modal
        danger
        open={remove}
        onClose={() => setRemove(false)}
        title="删除工作空间数据"
        description="该操作不可恢复"
        footer={
          <>
            <Button onClick={() => setRemove(false)}>取消</Button>
            <Button tone="danger" disabled>
              完成身份验证后删除
            </Button>
          </>
        }
      >
        <div className="stack">
          <p>必须先下载数据导出，并通过手机验证码完成身份验证。</p>
          <Input label="验证码" placeholder="输入 6 位验证码" />
          <Input label="确认文字" placeholder="输入：永久删除" />
        </div>
      </Modal>
    </SettingsShell>
  );
}
