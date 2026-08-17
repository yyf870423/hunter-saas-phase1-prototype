import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Cascader,
  Checkbox,
  DateRange,
  Drawer,
  EmptyState,
  IconButton,
  Input,
  Modal,
  MultiSelect,
  PageHeader,
  Radio,
  SearchInput,
  Select,
  Status,
  Switch,
  Tabs,
  Textarea,
  Tooltip,
  useToast,
} from "../components/ui";
import { Icon } from "../components/Icon";
import {
  AgentModeSelect,
  BusinessEventCard,
  ConfigurationCard,
  ConversationEntry,
  PermissionRequestCard,
  WorkstreamNavigator,
} from "../components/conversation";

export function ComponentsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [theme, setTheme] = useState("light");
  const [tab, setTab] = useState("commands");
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [single, setSingle] = useState("progress");
  const [multi, setMulti] = useState(["shanghai"]);
  const [cascade, setCascade] = useState("具身智能");
  const [date, setDate] = useState("");
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);
  const [agentMode, setAgentMode] = useState("edit");
  return (
    <div className="page-content component-page" data-theme={theme}>
      <PageHeader
        eyebrow="产品级组件库"
        title="Token、SVG、组件和状态"
        description="所有业务页面只复用这里的组件与变体；用户可见图形均由本地 SVG 输出。"
        back={() => navigate("/review")}
        actions={
          <Button
            onClick={() =>
              setTheme((current) => (current === "light" ? "dark" : "light"))
            }
          >
            切换主题
          </Button>
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "commands", label: "命令与状态" },
          { value: "inputs", label: "输入与选择" },
          { value: "overlays", label: "浮层与反馈" },
          { value: "conversation", label: "对话与过程" },
          { value: "states", label: "页面状态" },
        ]}
      />
      {tab === "commands" && (
        <section className="page-section component-grid">
          <div className="surface">
            <header className="surface-header">
              <h2>按钮</h2>
            </header>
            <div className="surface-body component-row">
              <Button
                tone="primary"
                icon="plus"
                onClick={() => toast("主操作已执行")}
              >
                主操作
              </Button>
              <Button icon="edit" onClick={() => toast("次操作已执行", "info")}>
                次操作
              </Button>
              <Button tone="ghost">文字操作</Button>
              <Button tone="danger">危险确认</Button>
              <Button tone="dangerGhost">轻量危险</Button>
              <Button loading>处理中</Button>
              <Button disabled>不可操作</Button>
              <IconButton icon="more" label="更多操作" />
            </div>
          </div>
          <div className="surface">
            <header className="surface-header">
              <h2>状态</h2>
            </header>
            <div className="surface-body component-row">
              <Status>普通</Status>
              <Status tone="info">运行中</Status>
              <Status tone="success">已完成</Status>
              <Status tone="warning">等待确认</Status>
              <Status tone="danger">失败</Status>
              <Status tone="violet">系统推断</Status>
            </div>
          </div>
        </section>
      )}
      {tab === "inputs" && (
        <section className="page-section surface">
          <div className="surface-body form-grid">
            <SearchInput
              value=""
              onChange={() => {}}
              placeholder="搜索候选人、公司或岗位"
            />
            <Input label="文本输入" placeholder="输入内容" />
            <Textarea
              className="span-2"
              label="多行输入"
              placeholder="输入补充说明"
            />
            <Select
              label="单选"
              value={single}
              onChange={setSingle}
              options={[
                { value: "reserve", label: "储备" },
                { value: "progress", label: "推进中" },
                { value: "success", label: "已入职" },
              ]}
            />
            <MultiSelect
              label="多选"
              values={multi}
              onChange={setMulti}
              options={[
                { value: "shanghai", label: "上海" },
                { value: "beijing", label: "北京" },
                { value: "shenzhen", label: "深圳" },
              ]}
            />
            <Cascader value={cascade} onChange={setCascade} />
            <DateRange label="时间范围" value={date} onChange={setDate} />
            <div className="field span-2">
              <span className="field-label">选择控件</span>
              <div className="component-row">
                <Checkbox checked={checked} onChange={setChecked}>
                  已选择
                </Checkbox>
                <Radio checked={true} onChange={() => {}}>
                  单选项
                </Radio>
                <div style={{ width: 280 }}>
                  <Switch
                    checked={switchOn}
                    onChange={setSwitchOn}
                    label="自动确认"
                    description="按授权范围生效"
                  />
                </div>
              </div>
            </div>
            <Input label="错误状态" value="" error="这是标准字段错误说明" />
            <Input label="禁用状态" value="不可编辑" disabled />
          </div>
        </section>
      )}
      {tab === "overlays" && (
        <section className="page-section component-grid">
          <div className="surface">
            <header className="surface-header">
              <h2>浮层</h2>
            </header>
            <div className="surface-body component-row">
              <Button onClick={() => setModal(true)}>打开 Modal</Button>
              <Button onClick={() => setDrawer(true)}>打开 Drawer</Button>
              <Tooltip text="Tooltip 支持鼠标移入并保持可读">
                <Button>查看 Tooltip</Button>
              </Tooltip>
            </div>
          </div>
          <div className="surface">
            <header className="surface-header">
              <h2>反馈</h2>
            </header>
            <div className="surface-body component-row">
              <Button onClick={() => toast("操作成功")}>成功 Toast</Button>
              <Button onClick={() => toast("操作未完成，输入已保留", "error")}>
                错误 Toast
              </Button>
              <Button onClick={() => toast("后台任务仍在运行", "info")}>
                信息 Toast
              </Button>
            </div>
          </div>
        </section>
      )}
      {tab === "conversation" && (
        <section className="page-section component-grid conversation-component-demo">
          <div className="surface">
            <header className="surface-header">
              <h2>自然语言输入</h2>
            </header>
            <div className="surface-body stack">
              <ConversationEntry time="刚刚">
                <p>我会先核验招聘信号和负责人，再给出需要你确认的联系建议。</p>
              </ConversationEntry>
              <ConversationEntry role="user" time="刚刚">
                <p>先确认是否真的扩招，没有明确需求前不要联系。</p>
              </ConversationEntry>
              <div className="component-agent-mode">
                <span>输入框底部操作模式</span>
                <AgentModeSelect value={agentMode} onChange={setAgentMode} />
              </div>
            </div>
          </div>
          <div className="surface">
            <header className="surface-header">
              <h2>计划、结果与审批</h2>
            </header>
            <div className="surface-body stack">
              <BusinessEventCard
                event={{
                  type: "result",
                  title: "招聘信号已完成核验",
                  detail: "官网招聘与融资公告相互印证，结果保留 5 条证据。",
                  time: "10:06",
                  status: "已确认",
                  tone: "success",
                  action: "查看证据",
                }}
                onAction={() => toast("已打开结果证据", "info")}
              />
              <BusinessEventCard
                event={{
                  type: "approval",
                  title: "是否联系招聘负责人？",
                  detail: "邮件草稿已生成，不会自动发送。",
                  time: "10:12",
                  primary: "审核联系内容",
                  secondary: "暂不联系",
                }}
                onAction={() => toast("处理结果已记录")}
              />
              <PermissionRequestCard
                event={{
                  title: "允许使用已登录的人才平台？",
                  detail: "只执行搜索、翻页和详情读取，不会发送消息。",
                  time: "10:14",
                  status: "等待授权",
                  tone: "warning",
                  scope: [
                    ["平台", "猎聘、脉脉"],
                    ["范围", "当前岗位，最多 40 个详情"],
                  ],
                  options: [
                    { value: "deny", label: "拒绝" },
                    { value: "once", label: "仅允许本次" },
                    {
                      value: "mainline",
                      label: "当前业务主线持续允许",
                      tone: "primary",
                    },
                  ],
                }}
                onAction={(_, value) =>
                  toast(
                    value === "deny" ? "已拒绝操作" : "授权已记录",
                    value === "deny" ? "info" : "success",
                  )
                }
              />
            </div>
          </div>
          <div className="surface span-2">
            <header className="surface-header">
              <h2>结构化配置</h2>
            </header>
            <div className="surface-body">
              <ConfigurationCard
                title="客户开发主线"
                config={{
                  scope: "星澜机器人及其机器人算法团队",
                  trigger: "手动启动；每周复查",
                  approval: "写入前人工确认",
                  contact: "联系前人工确认",
                  stop: "确认招聘机会或连续三次无新增",
                }}
                onEdit={() => toast("已进入配置编辑", "info")}
              />
            </div>
          </div>
          <div className="surface span-2">
            <header className="surface-header">
              <h2>业务主线导航</h2>
            </header>
            <div className="surface-body component-workstream-navigator">
              <WorkstreamNavigator
                config={{
                  status: "推进中",
                  tone: "info",
                  next: "审核首批 18 位候选人，并决定是否扩大寻访范围。",
                }}
                phases={[
                  ["理解岗位", "已完成"],
                  ["寻找候选人", "进行中"],
                  ["审核并联系", "等待处理"],
                ]}
                filters={[
                  {
                    value: "all",
                    label: "全部过程",
                    description: "交互、任务和结果",
                    icon: "route",
                    count: 28,
                  },
                  {
                    value: "decisions",
                    label: "等待处理",
                    description: "授权、审核和支线",
                    icon: "user",
                    count: 4,
                  },
                ]}
                filter="all"
                tasks={[
                  {
                    id: "sourcing",
                    title: "多渠道候选人寻访",
                    meta: "猎聘第 2 页 · 脉脉等待回复",
                    status: "运行中",
                    tone: "info",
                  },
                  {
                    id: "review",
                    title: "首批候选人审核",
                    meta: "18 位候选人等待审核",
                    status: "待处理",
                    tone: "warning",
                  },
                ]}
                onFilter={(value) => toast(`已切换过程筛选：${value}`, "info")}
                onPhase={(value) => toast(`已定位业务阶段：${value}`, "info")}
                onTask={(task) => toast(`已打开任务：${task.title}`, "info")}
                onOpenContext={() => toast("已打开业务主线信息", "info")}
                onOpenTasks={() => toast("已打开任务中心", "info")}
              />
            </div>
          </div>
        </section>
      )}
      {tab === "states" && (
        <section className="page-section state-grid">
          <div className="surface skeleton-card">
            <i />
            <i />
            <i />
            <i />
          </div>
          <EmptyState
            title="当前没有任务"
            description="创建业务主线，或调整当前筛选条件。"
            action={<Button tone="primary">新建业务主线</Button>}
          />
          <div className="surface error-state">
            <Icon name="warning" />
            <h3>暂时无法加载</h3>
            <p>网络连接中断，当前筛选和输入已经保留。</p>
            <Button icon="refresh">重新加载</Button>
          </div>
          <div className="surface permission-state">
            <Icon name="warning" />
            <h3>当前角色没有权限</h3>
            <p>敏感业务内容不会以打码或占位方式展示。</p>
            <Button>返回可访问页面</Button>
          </div>
        </section>
      )}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="标准操作 Modal"
        description="标题、说明、内容和操作区保持稳定层级"
        footer={
          <>
            <Button onClick={() => setModal(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setModal(false);
                toast("Modal 操作已确认");
              }}
            >
              确认操作
            </Button>
          </>
        }
      >
        <Input label="名称" placeholder="输入名称" />
      </Modal>
      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="标准详情 Drawer"
      >
        <div className="stack">
          <p>Drawer 用于保留当前页面上下文的轻量查看和编辑。</p>
          <Input label="备注" placeholder="输入备注" />
          <Button tone="primary" onClick={() => setDrawer(false)}>
            保存
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

const stories = [
  {
    id: "story-client",
    title: "从招聘信号到客户与岗位",
    description:
      "发现融资与招聘信号，核验公司和负责人，人工确认联系，形成招聘机会并拆分岗位。",
    route: "/signals/sig-funding",
    pages: "U15 → U16 → U09 → U19/U21/U23 → U25",
    status: "已覆盖",
  },
  {
    id: "story-position",
    title: "从岗位到候选人入职推进",
    description:
      "理解岗位、跨渠道召回、匹配门禁、人工审核、联系和推荐，并在推进详情中记录面试、薪资、Offer 与入职。",
    route: "/workstreams/position-vla/position",
    pages: "U10 → U14 → U27/U34 → U45",
    status: "已覆盖",
  },
  {
    id: "story-mapping",
    title: "从人才摸排到关键人物与关系",
    description:
      "配置目标领域，完善公司、方向、角色、人物和证据，把成果用于岗位找人或候选人求职。",
    route: "/workstreams/mapping-embodied/mapping",
    pages: "U11 → U29 → U27/U31/U33 → U14",
    status: "已覆盖",
  },
  {
    id: "story-candidate",
    title: "候选人新资料回流与局部重做",
    description:
      "收到候选人回复和简历后更新资料、查重，识别受影响岗位并局部重新匹配。",
    route: "/communications/comm-linhao",
    pages: "U34 → U27 → U14 → U12/U45",
    status: "已覆盖",
  },
  {
    id: "story-wait",
    title: "异步外部等待与继续",
    description:
      "联系或好友申请不会即时回复，主线进入等待外部；收到回复后继续同一个任务上下文。",
    route: "/tasks/task-enrich",
    pages: "U14 ↔ U34 → U09/U12",
    status: "已覆盖",
  },
  {
    id: "story-recovery",
    title: "平台失效、任务中断和权益到期",
    description:
      "保留结果池和检查点，处理登录后继续；到期只限制消耗型能力，不限制数据查看与导出。",
    route: "/account/platforms",
    pages: "U41 → U14 → U42/U43/U44",
    status: "已覆盖",
  },
];

export function StoriesReviewPage() {
  const navigate = useNavigate();
  return (
    <div className="page-content stories-page" data-theme="light">
      <PageHeader
        eyebrow="原型审核"
        title="六条端到端用户故事"
        description="每条故事包含入口、人工动作、Agent 动作、外部等待、异常恢复和业务结果。"
        back={() => navigate("/review")}
      />
      <div className="story-list">
        {stories.map((story, index) => (
          <article className="surface" key={story.id}>
            <i>{String(index + 1).padStart(2, "0")}</i>
            <span>
              <h2>{story.title}</h2>
              <p>{story.description}</p>
              <small>{story.pages}</small>
            </span>
            <Status tone="success">{story.status}</Status>
            <Button tone="primary" onClick={() => navigate(story.route)}>
              开始验收
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
