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
