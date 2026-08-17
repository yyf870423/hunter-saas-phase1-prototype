import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  DateRange,
  Drawer,
  Input,
  Modal,
  MultiSelect,
  PageHeader,
  Radio,
  Select,
  Status,
  Switch,
  Tabs,
  Textarea,
  useToast,
} from "../components/ui";
import { Icon } from "../components/Icon";
import {
  ActivityTimeline,
  CandidateMatchCard,
  EvidenceList,
  InfoGrid,
  StatStrip,
  SummaryList,
  toneForStatus,
  WorkstreamBoard,
} from "../components/business";
import {
  candidates,
  companies,
  contacts,
  positions,
  signals,
  tasks,
  timeline,
  workstreams,
} from "../data/demo";

const streamKinds = [
  {
    value: "client",
    label: "客户开发",
    icon: "building",
    description: "发现有招聘需求的企业，找到负责人并形成招聘机会。",
  },
  {
    value: "position",
    label: "岗位招聘",
    icon: "briefcase",
    description: "理解岗位、找人、匹配、联系并推进到入职。",
  },
  {
    value: "mapping",
    label: "人才摸排",
    icon: "users",
    description: "摸清目标领域的公司、团队、关键角色、人物和关系。",
  },
  {
    value: "career",
    label: "候选人求职",
    icon: "user",
    description: "围绕候选人的意向持续找岗位、沟通和推进。",
  },
];

export function NewWorkstreamPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const initial = searchParams.get("type") || "position";
  const [kind, setKind] = useState(initial);
  const [trigger, setTrigger] = useState("manual");
  const [goal, setGoal] = useState(
    kind === "position"
      ? "为星澜机器人招聘具身智能 VLA 算法负责人，优先上海，目标两个月内完成 2 人入职。"
      : "",
  );
  const [assets, setAssets] = useState([]);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [contact, setContact] = useState(false);
  const [preview, setPreview] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [error, setError] = useState("");
  const kindConfig = streamKinds.find((item) => item.value === kind);
  const create = () => {
    if (!goal.trim()) {
      setError("请描述这条业务主线需要完成的目标");
      return;
    }
    if (goal.includes("星澜") && kind === "position") {
      setDuplicate(true);
      return;
    }
    toast("业务主线已创建");
    navigate(
      `/workstreams/${kind === "client" ? "client-new" : kind === "position" ? "position-new" : kind === "mapping" ? "mapping-new" : "career-new"}/${kind}`,
    );
  };
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="新建业务主线"
        title="从一个可持续推进的业务目标开始"
        description="主线长期存在；只有实际执行搜索、计算、浏览器或外部联系的任务才消耗用量。"
        actions={<Button onClick={() => navigate("/workstreams")}>取消</Button>}
      />
      <section className="new-stream-layout">
        <div className="stack">
          <div className="surface">
            <header className="surface-header">
              <h2>1. 选择业务主线类型</h2>
            </header>
            <div className="surface-body choice-grid">
              {streamKinds.map((item) => (
                <button
                  className={`choice-card ${kind === item.value ? "is-selected" : ""}`}
                  key={item.value}
                  onClick={() => {
                    setKind(item.value);
                    setGoal("");
                  }}
                >
                  <i>
                    <Icon name={item.icon} />
                  </i>
                  <span>
                    <b>{item.label}</b>
                    <small>{item.description}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="surface">
            <header className="surface-header">
              <h2>2. 描述目标和已知信息</h2>
            </header>
            <div className="surface-body form-grid">
              <Textarea
                className="span-2"
                label="业务目标"
                value={goal}
                onChange={(event) => {
                  setGoal(event.target.value);
                  setError("");
                }}
                error={error}
                placeholder={`用自然语言描述${kindConfig.label}要完成什么`}
                help="建议写清楚对象、范围、完成标准、时间和不应做什么。"
              />
              <Input label="创建来源" value="用户手动创建" readOnly />
              <MultiSelect
                label="关联业务资产"
                values={assets}
                onChange={setAssets}
                options={[
                  ...companies.map((item) => ({
                    value: `company-${item.id}`,
                    label: `公司 · ${item.name}`,
                  })),
                  ...positions.map((item) => ({
                    value: `position-${item.id}`,
                    label: `岗位 · ${item.name}`,
                  })),
                  ...candidates.map((item) => ({
                    value: `candidate-${item.id}`,
                    label: `候选人 · ${item.name}`,
                  })),
                ]}
                placeholder="选择公司、岗位或候选人"
              />
              <Input
                className="span-2"
                label="链接"
                placeholder="粘贴公司主页、岗位链接或候选人公开资料链接"
                prefix="link"
              />
              <div className="span-2 mini-upload">
                <Icon name="upload" />
                <span>
                  <b>添加文件</b>
                  <small>
                    支持 PDF、DOCX、XLSX；文件会先经过格式和内容门禁。
                  </small>
                </span>
                <Button size="sm">选择文件</Button>
              </div>
            </div>
          </div>
          <div className="surface">
            <header className="surface-header">
              <h2>3. 触发、授权和停止条件</h2>
            </header>
            <div className="surface-body stack">
              <div className="field">
                <span className="field-label">触发方式</span>
                <div className="inline wrap">
                  <Radio
                    checked={trigger === "manual"}
                    onChange={() => setTrigger("manual")}
                  >
                    手动触发
                  </Radio>
                  {kind !== "client" && (
                    <Radio
                      checked={trigger === "condition"}
                      onChange={() => setTrigger("condition")}
                    >
                      条件触发
                    </Radio>
                  )}
                  {kind === "client" && (
                    <Radio
                      checked={trigger === "schedule"}
                      onChange={() => setTrigger("schedule")}
                    >
                      周期触发
                    </Radio>
                  )}
                </div>
              </div>
              {trigger === "schedule" && (
                <DateRange
                  label="首次执行日期"
                  value="2026-08-18"
                  onChange={() => {}}
                  width="220px"
                />
              )}
              <Switch
                checked={autoConfirm}
                onChange={setAutoConfirm}
                label="在授权范围内自动确认"
                description="默认关闭。即使开启，Hunter 安全和质量门禁仍不可关闭。"
              />
              <Switch
                checked={contact}
                onChange={setContact}
                label="允许执行外部联系"
                description="发送前必须明确身份、渠道、数量、时间和停止条件。"
              />
              <div className="form-grid">
                <Input label="单次预算上限" value="50" />
                <Input label="最多运行任务" value="8" />
                <Textarea
                  className="span-2"
                  label="停止条件"
                  value={
                    kind === "position"
                      ? "找到 30 位符合基本条件的候选人，或确认 8 位有沟通意愿的候选人后停止。"
                      : "达到完成标准，或连续两次执行没有新增有效结果时停止。"
                  }
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        <aside className="stack">
          <div className="surface preview-panel">
            <header className="surface-header">
              <h2>创建预览</h2>
            </header>
            <div className="surface-body stack">
              <InfoGrid
                columns={1}
                items={[
                  ["主线类型", kindConfig.label],
                  [
                    "触发方式",
                    trigger === "manual"
                      ? "手动触发"
                      : trigger === "condition"
                        ? "条件触发"
                        : "周期触发",
                  ],
                  ["确认方式", autoConfirm ? "授权范围内自动确认" : "人工确认"],
                  ["外部联系", contact ? "按规则允许" : "不允许"],
                ]}
              />
              <div className="privacy-note">
                <Icon name="info" />
                <span>
                  创建后立即生成可访问的主线；选择立即执行时才会生成首个任务。
                </span>
              </div>
              <Button onClick={() => setPreview(true)}>预览完整配置</Button>
              <Button tone="primary" onClick={create}>
                创建并进入主线
              </Button>
            </div>
          </div>
        </aside>
      </section>
      <Modal
        open={preview}
        onClose={() => setPreview(false)}
        title="业务主线配置预览"
        description={`${kindConfig.label} · 创建前检查`}
        size="lg"
        footer={
          <>
            <Button onClick={() => setPreview(false)}>返回修改</Button>
            <Button
              tone="primary"
              onClick={() => {
                setPreview(false);
                create();
              }}
            >
              确认创建
            </Button>
          </>
        }
      >
        <InfoGrid
          items={[
            ["业务目标", goal, true],
            ["关联资产", assets.length ? `${assets.length} 项` : "暂未关联"],
            ["触发方式", trigger],
            ["人工或自动确认", autoConfirm ? "授权范围内自动确认" : "人工确认"],
            ["外部联系", contact ? "允许" : "不允许"],
            [
              "停止条件",
              kind === "position"
                ? "找到 30 位基本符合或 8 位愿意沟通后停止"
                : "达到完成标准或连续两次无新增结果",
              true,
            ],
          ]}
        />
      </Modal>
      <Modal
        open={duplicate}
        onClose={() => setDuplicate(false)}
        title="发现相同目标的业务主线"
        description="“具身智能 VLA 算法负责人”正在推进中"
        footer={
          <>
            <Button onClick={() => setDuplicate(false)}>返回修改</Button>
            <Button
              onClick={() => {
                toast("补充信息已加入原主线");
                navigate("/workstreams/position-vla/position");
              }}
            >
              补充到原主线
            </Button>
            <Button
              tone="primary"
              onClick={() => navigate("/workstreams/position-vla/position")}
            >
              进入原主线
            </Button>
          </>
        }
      >
        <div className="banner banner-warning">
          <Icon name="warning" />
          <span>
            <b>避免重复执行和重复联系</b>
            <small>原主线已有 2 个任务运行、18 位候选人等待审核。</small>
          </span>
        </div>
      </Modal>
    </div>
  );
}

const overviewByKind = {
  client: {
    title: "星澜机器人招聘机会",
    eyebrow: "客户开发主线",
    status: "等待用户",
    description: "确认招聘信号、找到负责人并形成可推进的招聘机会。",
    stats: [
      ["重点公司", "1", "progress"],
      ["已确认联系人", "4", "success"],
      ["招聘机会", "2", "progress"],
      ["等待回复", "1", "failure"],
    ],
    stages: [
      {
        id: "reserve",
        title: "发现与核验",
        description: "公司和招聘信号",
        kind: "reserve",
        items: [
          {
            id: "sig",
            title: "B+ 轮融资后扩充团队",
            detail: "公司公众号和投资机构公告相互印证。",
            meta: "2 个来源",
            status: "已确认",
          },
        ],
      },
      {
        id: "progress",
        title: "联系与澄清",
        description: "负责人和需求",
        kind: "progress",
        items: [
          {
            id: "contact",
            title: "联系 HRD 周雅雯",
            detail: "联系邮件已生成，等待你确认发送。",
            meta: "今天 11:20 前",
            status: "等待用户",
          },
        ],
      },
      {
        id: "success",
        title: "形成招聘机会",
        description: "已确认需求",
        kind: "success",
        items: [
          {
            id: "opp",
            title: "VLA 团队补充负责人",
            detail: "预计 2 个 HC，上海，职级待澄清。",
            meta: "有效至 9 月 30 日",
            status: "已确认",
          },
        ],
      },
      {
        id: "failure",
        title: "暂缓与失效",
        description: "无效或过期",
        kind: "failure",
        items: [],
      },
    ],
  },
  position: {
    title: "具身智能 VLA 算法负责人",
    eyebrow: "岗位招聘主线",
    status: "推进中",
    description: "理解岗位、召回候选人、匹配、沟通并人工推进到入职。",
    stats: [
      ["候选池", "46", "reserve"],
      ["推荐", "12", "progress"],
      ["推进中", "5", "progress"],
      ["已入职", "0", "success"],
    ],
    stages: [
      {
        id: "reserve",
        title: "储备",
        description: "尚未正式推荐",
        kind: "reserve",
        items: [
          {
            id: "zhao",
            title: "赵星羽 · 86 分",
            detail: "高级感知算法工程师，端到端和多模态经验可迁移。",
            meta: "待首次沟通",
            status: "待推荐",
          },
          {
            id: "han",
            title: "韩思雨 · 77 分",
            detail: "机器人学习研究员，管理经验待确认。",
            meta: "暂不考虑",
            status: "储备",
          },
        ],
      },
      {
        id: "progress",
        title: "推进中",
        description: "推荐、面试与谈薪",
        kind: "progress",
        items: [
          {
            id: "lin",
            title: "林昊 · 89 分",
            detail: "二轮技术面试完成，待补充团队管理规模。",
            meta: "下一步：三轮面试",
            status: "二轮面试",
          },
          {
            id: "chen",
            title: "陈松 · 83 分",
            detail: "技术可迁移，当前沟通薪酬和地点。",
            meta: "昨天更新",
            status: "薪资沟通",
          },
        ],
      },
      {
        id: "success",
        title: "已入职",
        description: "完成招聘结果",
        kind: "success",
        items: [],
      },
      {
        id: "failure",
        title: "失败",
        description: "放弃、落选或不合适",
        kind: "failure",
        items: [
          {
            id: "scope",
            title: "匿名候选人 · 68 分",
            detail: "职级明显高于岗位且管理范围无法接受。",
            meta: "保留判断依据",
            status: "不合适",
          },
        ],
      },
    ],
  },
  mapping: {
    title: "具身智能核心人才摸排",
    eyebrow: "人才摸排主线",
    status: "维护中",
    description: "摸清目标领域的公司、团队方向、关键角色、人物和可利用关系。",
    stats: [
      ["目标公司", "12", "reserve"],
      ["关键角色", "8", "progress"],
      ["已确认人物", "93", "success"],
      ["覆盖度", "72%", "progress"],
    ],
    stages: [],
  },
  career: {
    title: "林昊下一份工作",
    eyebrow: "候选人求职主线",
    status: "等待外部",
    description: "围绕候选人意向持续找岗位、沟通、补充信息并重新匹配。",
    stats: [
      ["岗位池", "18", "reserve"],
      ["推荐岗位", "6", "progress"],
      ["推进中", "2", "progress"],
      ["收到回复", "1", "success"],
    ],
    stages: [
      {
        id: "reserve",
        title: "岗位池",
        description: "尚未与候选人确认",
        kind: "reserve",
        items: [
          {
            id: "p1",
            title: "机器人平台架构师",
            detail: "云脉芯能 · 深圳 · 匹配 84 分",
            meta: "到岗地点待确认",
            status: "待审核",
          },
        ],
      },
      {
        id: "progress",
        title: "推进中",
        description: "已确认并沟通",
        kind: "progress",
        items: [
          {
            id: "p2",
            title: "VLA 算法负责人",
            detail: "星澜机器人 · 上海 · 匹配 89 分",
            meta: "二轮技术面试",
            status: "推进中",
          },
        ],
      },
      {
        id: "success",
        title: "已入职",
        description: "完成求职结果",
        kind: "success",
        items: [],
      },
      {
        id: "failure",
        title: "失败",
        description: "候选人放弃或客户拒绝",
        kind: "failure",
        items: [
          {
            id: "p3",
            title: "机器人算法总监",
            detail: "工作地点不符合候选人家庭安排。",
            meta: "候选人放弃",
            status: "失败",
          },
        ],
      },
    ],
  },
};

function MappingOverview({ navigate, toast }) {
  return (
    <div className="mapping-workspace">
      <section className="mapping-scope">
        <header>
          <span>具身智能核心人才范围</span>
          <Status tone="info">覆盖 72%</Status>
        </header>
        <div className="mapping-tree">
          <article>
            <b>具身智能</b>
            <small>12 家目标公司</small>
          </article>
          <div>
            <article>
              <b>VLA 与机器人学习</b>
              <small>38 位已确认</small>
            </article>
            <article>
              <b>灵巧手与结构</b>
              <small>27 位已确认</small>
            </article>
            <article>
              <b>机器人平台与芯片</b>
              <small>28 位已确认</small>
            </article>
          </div>
        </div>
      </section>
      <section className="surface">
        <header className="surface-header">
          <h2>关键角色覆盖</h2>
          <button
            className="link"
            onClick={() => navigate("/mappings/embodied")}
          >
            打开完整摸排
          </button>
        </header>
        <div className="surface-body stack">
          {[
            ["VLA 算法负责人", 86],
            ["机器人学习研究员", 78],
            ["灵巧手结构专家", 69],
            ["机器人平台架构师", 56],
          ].map(([label, value]) => (
            <div className="coverage-row" key={label}>
              <span>{label}</span>
              <i>
                <i style={{ width: `${value}%` }} />
              </i>
              <b>{value}%</b>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function WorkstreamDetailPage({ kind }) {
  const config = overviewByKind[kind];
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState("overview");
  const [supplement, setSupplement] = useState(false);
  const [terminate, setTerminate] = useState(false);
  const [impact, setImpact] = useState(false);
  const [evidence, setEvidence] = useState(false);
  const [stages, setStages] = useState(config.stages);
  const move = (itemId, from, to) => {
    if (from === to) return;
    setStages((current) => {
      const item = current
        .find((stage) => stage.id === from)
        ?.items.find((entry) => entry.id === itemId);
      return current.map((stage) =>
        stage.id === from
          ? {
              ...stage,
              items: stage.items.filter((entry) => entry.id !== itemId),
            }
          : stage.id === to
            ? {
                ...stage,
                items: [...stage.items, { ...item, status: stage.title }],
              }
            : stage,
      );
    });
    toast("阶段已更新，可以撤销本次操作");
  };
  const currentTasks = tasks.filter((task) =>
    task.mainline.includes(
      kind === "client"
        ? "客户开发"
        : kind === "position"
          ? "岗位招聘"
          : kind === "mapping"
            ? "人才摸排"
            : "候选人求职",
    ),
  );
  return (
    <div className="page-content">
      <PageHeader
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        status={
          <Status tone={toneForStatus(config.status)}>{config.status}</Status>
        }
        back={() => navigate("/workstreams")}
        actions={
          <>
            <Button icon="plus" onClick={() => setSupplement(true)}>
              补充信息
            </Button>
            <Button
              tone="primary"
              icon="play"
              onClick={() => toast("已创建局部执行任务")}
            >
              {config.status === "等待外部" ? "手动继续" : "启动下一步"}
            </Button>
            <Button
              tone="dangerGhost"
              icon="pause"
              onClick={() => setTerminate(true)}
            >
              终止主线
            </Button>
          </>
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "overview", label: "概览" },
          { value: "work", label: "当前工作" },
          { value: "results", label: "成果与对象" },
          { value: "history", label: "历史" },
        ]}
      />
      {tab === "overview" && (
        <>
          <section className="page-section">
            <StatStrip items={config.stats} />
          </section>
          <section className="page-section">
            {kind === "mapping" ? (
              <MappingOverview navigate={navigate} toast={toast} />
            ) : (
              <WorkstreamBoard stages={stages} onMove={move} />
            )}
          </section>
          {kind === "position" && (
            <section className="page-section">
              <div className="section-header">
                <div>
                  <h2>首批候选人匹配</h2>
                  <p>12 位推荐，4 位有条件匹配，2 位触发硬性拒绝门槛。</p>
                </div>
                <Button onClick={() => navigate("/positions/vla-lead")}>
                  查看岗位详情
                </Button>
              </div>
              <div className="match-grid">
                {candidates.slice(0, 3).map((candidate) => (
                  <CandidateMatchCard
                    candidate={candidate}
                    key={candidate.id}
                    onOpen={() => navigate(`/candidates/${candidate.id}`)}
                    onProgress={() => navigate(`/progress/${candidate.id}-vla`)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
      {tab === "work" && (
        <section className="page-section split-layout">
          <div className="surface">
            <header className="surface-header">
              <h2>任务与支线</h2>
              <Button
                size="sm"
                tone="primary"
                icon="plus"
                onClick={() => toast("支线任务草稿已创建")}
              >
                创建支线
              </Button>
            </header>
            <SummaryList
              items={(currentTasks.length
                ? currentTasks
                : tasks.slice(0, 2)
              ).map((task) => ({
                title: task.title,
                meta: task.action,
                status: task.status,
                icon: "task",
                route: `/tasks/${task.id}`,
              }))}
              onOpen={(item) => navigate(item.route)}
            />
          </div>
          <aside className="surface">
            <header className="surface-header">
              <h2>外部等待</h2>
            </header>
            <div className="surface-body stack">
              <div className="banner banner-warning">
                <Icon name="clock" />
                <span>
                  <b>
                    {kind === "career" ? "等待林昊确认新简历" : "等待外部回复"}
                  </b>
                  <small>等待状态不会持续消耗 Agent 用量。</small>
                </span>
              </div>
              <Button
                onClick={() =>
                  navigate(
                    kind === "career"
                      ? "/communications/comm-linhao"
                      : "/communications/contact-zhou",
                  )
                }
              >
                查看沟通
              </Button>
            </div>
          </aside>
        </section>
      )}
      {tab === "results" && (
        <section className="page-section detail-layout">
          <div className="surface">
            <header className="surface-header">
              <h2>已确认成果</h2>
            </header>
            <SummaryList
              items={
                kind === "client"
                  ? [
                      {
                        title: "星澜机器人公司资料",
                        meta: "融资、团队和招聘信息已确认",
                        status: "已确认",
                        icon: "building",
                        route: "/companies/xinglan",
                      },
                      {
                        title: "VLA 团队招聘机会",
                        meta: "2 个 HC · 上海",
                        status: "待澄清",
                        icon: "signal",
                        route: "/opportunities/opp-vla",
                      },
                    ]
                  : kind === "position"
                    ? candidates.slice(0, 3).map((item) => ({
                        title: item.name,
                        meta: `${item.company} · ${item.title}`,
                        status: item.stage,
                        icon: "user",
                        route: `/candidates/${item.id}`,
                      }))
                    : kind === "mapping"
                      ? [
                          {
                            title: "具身智能核心人才摸排",
                            meta: "12 家公司 · 8 类角色 · 93 位确认人物",
                            status: "维护中",
                            icon: "users",
                            route: "/mappings/embodied",
                          },
                        ]
                      : [
                          {
                            title: "林昊候选人资料",
                            meta: "最新简历待确认",
                            status: "存在更新",
                            icon: "user",
                            route: "/candidates/lin-hao",
                          },
                          {
                            title: "VLA 算法负责人",
                            meta: "匹配 89 分 · 二轮面试",
                            status: "推进中",
                            icon: "briefcase",
                            route: "/positions/vla-lead",
                          },
                        ]
              }
              onOpen={(item) => navigate(item.route)}
            />
          </div>
          <aside className="surface">
            <header className="surface-header">
              <h2>证据与来源</h2>
              <button className="link" onClick={() => setEvidence(true)}>
                全部证据
              </button>
            </header>
            <EvidenceList
              items={[
                {
                  title: "公司官方招聘页面",
                  source: "今天 08:31 获取",
                  verified: true,
                },
                {
                  title: "候选人最新简历",
                  source: "昨天 17:42 收到",
                  verified: kind !== "career",
                },
                {
                  title: "人才平台公开资料",
                  source: "猎聘与脉脉",
                  verified: true,
                },
              ]}
            />
          </aside>
        </section>
      )}
      {tab === "history" && (
        <section className="page-section surface">
          <header className="surface-header">
            <h2>主线历史和版本</h2>
          </header>
          <div className="surface-body">
            <ActivityTimeline items={timeline} />
          </div>
        </section>
      )}
      <Modal
        open={supplement}
        onClose={() => setSupplement(false)}
        title="补充业务信息"
        description="提交后先分析受影响对象和需要局部重做的范围"
        footer={
          <>
            <Button onClick={() => setSupplement(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setSupplement(false);
                setImpact(true);
              }}
            >
              分析影响
            </Button>
          </>
        }
      >
        <div className="stack">
          <Textarea
            label="补充说明"
            placeholder="输入新得到的业务信息、候选人反馈或客户要求"
          />
          <Input
            label="链接"
            placeholder="粘贴公开资料或平台页面"
            prefix="link"
          />
          <div className="mini-upload">
            <Icon name="upload" />
            <span>
              <b>添加文件</b>
              <small>支持简历、岗位说明、邮件附件等业务资料。</small>
            </span>
            <Button size="sm">选择文件</Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={impact}
        onClose={() => setImpact(false)}
        title="补充信息影响分析"
        description="不会重跑整条主线，只处理受影响的局部内容"
        footer={
          <>
            <Button onClick={() => setImpact(false)}>返回修改</Button>
            <Button
              tone="primary"
              onClick={() => {
                setImpact(false);
                toast("局部任务已创建");
                navigate("/tasks/task-enrich");
              }}
            >
              创建局部任务
            </Button>
          </>
        }
      >
        <div className="impact-list">
          <article>
            <Icon name="user" />
            <span>
              <b>候选人资料</b>
              <small>新增项目经历，需要查重并更新可信字段。</small>
            </span>
            <Status tone="warning">需确认</Status>
          </article>
          <article>
            <Icon name="briefcase" />
            <span>
              <b>人岗匹配</b>
              <small>仅重新计算与林昊相关的 6 个岗位。</small>
            </span>
            <Status tone="info">局部重做</Status>
          </article>
          <article>
            <Icon name="message" />
            <span>
              <b>外部沟通</b>
              <small>已有草稿不自动发送，需要重新确认。</small>
            </span>
            <Status tone="neutral">保留</Status>
          </article>
        </div>
      </Modal>
      <Modal
        danger
        open={terminate}
        onClose={() => setTerminate(false)}
        title="终止这条业务主线"
        description="已确认成果和追溯历史会保留"
        footer={
          <>
            <Button onClick={() => setTerminate(false)}>取消</Button>
            <Button
              tone="danger"
              onClick={() => {
                setTerminate(false);
                toast("业务主线已终止");
                navigate("/workstreams");
              }}
            >
              确认终止
            </Button>
          </>
        }
      >
        <p>
          未执行任务和自动联动将停止；已经发送的外部联系无法撤回，等待中的回复仍会记录。
        </p>
      </Modal>
      <Drawer
        open={evidence}
        onClose={() => setEvidence(false)}
        title="证据与来源"
      >
        <EvidenceList
          items={[
            {
              title: "星澜机器人官方招聘页面",
              source: "https://careers.xinglan.example · 今天 08:31",
              verified: true,
            },
            {
              title: "B+ 轮融资公告",
              source: "投资机构公告 · 今天 08:28",
              verified: true,
            },
            {
              title: "周雅雯公开职业资料",
              source: "人才平台公开资料 · 今天 08:46",
              verified: true,
            },
            {
              title: "VLA 团队组织关系",
              source: "公开访谈推断 · 需要人工核验",
              verified: false,
            },
          ]}
        />
      </Drawer>
    </div>
  );
}
