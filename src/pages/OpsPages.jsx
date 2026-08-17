import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  DataTable,
  DateRange,
  Drawer,
  FilterBar,
  IconButton,
  Input,
  Modal,
  MultiSelect,
  PageHeader,
  Pagination,
  Progress,
  SearchInput,
  Select,
  Status,
  Tabs,
  Textarea,
  useToast,
} from "../components/ui";
import { Icon } from "../components/Icon";
import {
  ActivityTimeline,
  InfoGrid,
  SummaryList,
  toneForStatus,
} from "../components/business";
import { opsRows } from "../data/demo";

const errors = [
  {
    id: "ERR-260817-021",
    code: "platform_session_expired",
    area: "人才平台",
    count: 7,
    workspaces: 5,
    status: "处理中",
    first: "今天 08:42",
    latest: "今天 10:27",
  },
  {
    id: "ERR-260817-018",
    code: "academic_source_timeout",
    area: "学术搜索",
    count: 4,
    workspaces: 3,
    status: "观察中",
    first: "昨天 19:06",
    latest: "今天 09:18",
  },
  {
    id: "ERR-260816-043",
    code: "output_schema_repair_limit",
    area: "Agent",
    count: 2,
    workspaces: 2,
    status: "已恢复",
    first: "昨天 14:21",
    latest: "昨天 15:02",
  },
];

const dependencies = [
  {
    id: "DEP-OPENALEX",
    name: "OpenAlex",
    type: "学术数据",
    status: "降级",
    latency: "1.8 s",
    success: "93.4%",
    impact: "学术搜索自动切换免费接口",
  },
  {
    id: "DEP-BAIDU",
    name: "百度搜索",
    type: "公开搜索",
    status: "正常",
    latency: "620 ms",
    success: "99.2%",
    impact: "无",
  },
  {
    id: "DEP-MODEL",
    name: "Agent 模型服务",
    type: "AI",
    status: "正常",
    latency: "2.4 s",
    success: "98.8%",
    impact: "无",
  },
  {
    id: "DEP-STORAGE",
    name: "对象存储",
    type: "基础设施",
    status: "正常",
    latency: "84 ms",
    success: "99.99%",
    impact: "无",
  },
];

const diagnostics = [
  {
    id: "DIA-260817-009",
    workspace: "WS-13A7",
    reason: "用户主动创建",
    scope: "任务状态、错误码、调用链",
    status: "可下载",
    created: "今天 10:32",
    expires: "剩余 6 天",
  },
  {
    id: "DIA-260816-021",
    workspace: "WS-8F21",
    reason: "平台登录问题",
    scope: "浏览器与平台健康",
    status: "已下载",
    created: "昨天 17:14",
    expires: "剩余 5 天",
  },
];

const announcements = [
  {
    id: "ANN-006",
    title: "OpenAlex 数据源短时降级说明",
    audience: "受影响工作空间",
    status: "已发布",
    period: "今天 09:20-12:00",
    author: "于一凡",
  },
  {
    id: "ANN-005",
    title: "Hunter 计划维护通知",
    audience: "全部用户",
    status: "草稿",
    period: "8 月 20 日 02:00-03:00",
    author: "于一凡",
  },
];

const auditRows = [
  {
    id: "AUD-260817-211",
    operator: "于一凡",
    action: "重试脱敏任务",
    target: "RUN-2B43",
    result: "成功",
    time: "今天 10:44",
    scope: "任务状态",
  },
  {
    id: "AUD-260817-207",
    operator: "顾晓南",
    action: "调整试用权益",
    target: "WS-13A7",
    result: "成功",
    time: "今天 10:21",
    scope: "订阅权益",
  },
  {
    id: "AUD-260817-192",
    operator: "系统",
    action: "依赖自动降级",
    target: "DEP-OPENALEX",
    result: "成功",
    time: "今天 09:18",
    scope: "依赖路由",
  },
];

export function OpsDashboard() {
  const navigate = useNavigate();
  const metrics = [
    ["待审核申请", "9", "users", "warning"],
    ["活跃工作空间", "128", "database", "blue"],
    ["需处理任务", "4", "task", "danger"],
    ["降级依赖", "1", "signal", "warning"],
  ];
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="运营概览 · 最小权限"
        title="Hunter 运营工作台"
        description="查看账号、权益、任务健康和依赖状态；用户业务内容默认不可见。"
        actions={
          <Button onClick={() => navigate("/ops/diagnostics")}>诊断包</Button>
        }
      />
      <div className="ops-banner">
        当前角色：运营支持。页面不展示用户输入、Agent
        输出、候选人、岗位、公司、消息和附件正文。
      </div>
      <section className="metric-grid">
        {metrics.map(([label, value, icon, tone]) => (
          <article className="metric" key={label}>
            <span>
              {label}
              <Icon name={icon} />
            </span>
            <strong>{value}</strong>
            <small className={`metric-note-${tone}`}>
              {tone === "danger" ? "需要人工处理" : "更新于刚刚"}
            </small>
          </article>
        ))}
      </section>
      <section className="page-section two-column">
        <div className="surface">
          <header className="surface-header">
            <h2>需要处理</h2>
            <button className="link" onClick={() => navigate("/ops/tasks")}>
              查看全部
            </button>
          </header>
          <SummaryList
            items={[
              {
                title: "4 个任务需要运营处理",
                meta: "平台登录、依赖超时和重试上限",
                status: "需处理",
                icon: "task",
                route: "/ops/tasks",
              },
              {
                title: "9 份试用申请等待审核",
                meta: "最早等待 19 小时",
                status: "待审核",
                icon: "users",
                route: "/ops/applications",
              },
              {
                title: "OpenAlex 处于降级状态",
                meta: "已自动切换免费接口",
                status: "降级",
                icon: "signal",
                route: "/ops/dependencies",
              },
            ]}
            onOpen={(item) => navigate(item.route)}
          />
        </div>
        <div className="surface">
          <header className="surface-header">
            <h2>平台健康</h2>
          </header>
          <div className="surface-body stack">
            {dependencies.slice(0, 3).map((item) => (
              <button
                className="health-row"
                key={item.id}
                onClick={() => navigate("/ops/dependencies")}
              >
                <span>
                  <b>{item.name}</b>
                  <small>
                    {item.latency} · 成功率 {item.success}
                  </small>
                </span>
                <Status tone={toneForStatus(item.status)}>{item.status}</Status>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="page-section surface">
        <header className="surface-header">
          <h2>最近任务健康</h2>
        </header>
        <OpsDataTable kind="tasks" compact />
      </section>
    </div>
  );
}

function tableConfig(kind) {
  if (kind === "applications")
    return {
      title: "试用申请",
      description: "审核申请、识别重复账号并配置试用权益。",
      rows: opsRows.applications.map((row) => ({
        id: row[0],
        applicant: row[1],
        identity: row[2],
        direction: row[3],
        status: row[4],
        submitted: row[5],
      })),
      columns: [
        { key: "id", label: "申请编号", width: "16%" },
        { key: "applicant", label: "申请人", width: "14%" },
        { key: "identity", label: "身份", width: "16%" },
        { key: "direction", label: "业务方向", width: "18%" },
        {
          key: "status",
          label: "状态",
          width: "14%",
          render: (value) => (
            <Status tone={toneForStatus(value)}>{value}</Status>
          ),
        },
        { key: "submitted", label: "提交时间", width: "18%" },
      ],
    };
  if (kind === "workspaces")
    return {
      title: "工作空间",
      description: "管理脱敏账号状态、订阅权益、配额和任务健康。",
      rows: opsRows.workspaces.map((row) => ({
        id: row[0],
        status: row[1],
        plan: row[2],
        login: row[3],
        quota: row[4],
        health: row[5],
      })),
      columns: [
        { key: "id", label: "工作空间", width: "18%" },
        {
          key: "status",
          label: "账号状态",
          width: "13%",
          render: (value) => (
            <Status tone={toneForStatus(value)}>{value}</Status>
          ),
        },
        { key: "plan", label: "订阅", width: "14%" },
        { key: "login", label: "最近登录", width: "18%" },
        { key: "quota", label: "任务额度", width: "18%" },
        {
          key: "health",
          label: "任务健康",
          width: "18%",
          render: (value) => (
            <Status tone={toneForStatus(value)}>{value}</Status>
          ),
        },
      ],
    };
  if (kind === "tasks")
    return {
      title: "任务运行",
      description: "查看脱敏任务阶段、检查点、错误和恢复能力。",
      rows: opsRows.taskHealth.map((row) => ({
        id: row[0],
        type: row[1],
        status: row[2],
        duration: row[3],
        issue: row[4],
        recovery: row[5],
      })),
      columns: [
        { key: "id", label: "运行编号", width: "18%" },
        { key: "type", label: "任务类型", width: "17%" },
        {
          key: "status",
          label: "状态",
          width: "14%",
          render: (value) => (
            <Status tone={toneForStatus(value)}>{value}</Status>
          ),
        },
        { key: "duration", label: "耗时", width: "13%" },
        { key: "issue", label: "当前问题", width: "22%" },
        { key: "recovery", label: "恢复能力", width: "16%" },
      ],
    };
  if (kind === "errors")
    return {
      title: "错误中心",
      description: "按错误码聚合影响范围，处理根因、恢复和用户通知。",
      rows: errors,
      columns: [
        {
          key: "code",
          label: "错误码",
          width: "27%",
          render: (value) => <span className="mono">{value}</span>,
        },
        { key: "area", label: "模块", width: "13%" },
        { key: "count", label: "发生次数", width: "12%" },
        { key: "workspaces", label: "影响空间", width: "12%" },
        {
          key: "status",
          label: "状态",
          width: "14%",
          render: (value) => (
            <Status tone={toneForStatus(value)}>{value}</Status>
          ),
        },
        { key: "latest", label: "最近发生", width: "17%" },
      ],
    };
  if (kind === "dependencies")
    return {
      title: "依赖健康",
      description: "查看第三方数据、搜索、模型和基础设施状态及自动降级。",
      rows: dependencies,
      columns: [
        { key: "name", label: "依赖", width: "20%" },
        { key: "type", label: "类型", width: "15%" },
        {
          key: "status",
          label: "状态",
          width: "12%",
          render: (value) => (
            <Status tone={toneForStatus(value)}>{value}</Status>
          ),
        },
        { key: "latency", label: "延迟", width: "12%" },
        { key: "success", label: "成功率", width: "12%" },
        { key: "impact", label: "用户影响与降级", width: "29%" },
      ],
    };
  if (kind === "diagnostics")
    return {
      title: "诊断包",
      description: "管理用户主动创建的脱敏诊断包和下载有效期。",
      rows: diagnostics,
      columns: [
        { key: "id", label: "诊断包", width: "17%" },
        { key: "workspace", label: "工作空间", width: "14%" },
        { key: "reason", label: "创建原因", width: "18%" },
        { key: "scope", label: "脱敏范围", width: "25%" },
        {
          key: "status",
          label: "状态",
          width: "12%",
          render: (value) => (
            <Status tone={toneForStatus(value)}>{value}</Status>
          ),
        },
        { key: "expires", label: "有效期", width: "14%" },
      ],
    };
  if (kind === "announcements")
    return {
      title: "公告管理",
      description: "向受影响用户发布运行、维护和依赖状态说明。",
      rows: announcements,
      columns: [
        { key: "title", label: "公告", width: "34%" },
        { key: "audience", label: "范围", width: "18%" },
        {
          key: "status",
          label: "状态",
          width: "13%",
          render: (value) => (
            <Status tone={toneForStatus(value)}>{value}</Status>
          ),
        },
        { key: "period", label: "展示时间", width: "22%" },
        { key: "author", label: "创建人", width: "13%" },
      ],
    };
  return {
    title: "审计日志",
    description: "记录运营和系统对账号、权益、任务、依赖和公告的操作。",
    rows: auditRows,
    columns: [
      { key: "time", label: "时间", width: "17%" },
      { key: "operator", label: "操作者", width: "13%" },
      { key: "action", label: "操作", width: "22%" },
      { key: "target", label: "对象", width: "16%" },
      { key: "scope", label: "影响范围", width: "18%" },
      {
        key: "result",
        label: "结果",
        width: "12%",
        render: (value) => <Status tone={toneForStatus(value)}>{value}</Status>,
      },
    ],
  };
}

function OpsDataTable({ kind, compact = false, onOpen }) {
  const config = tableConfig(kind);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const route = (row) =>
    kind === "applications"
      ? "/ops/applications?drawer=review"
      : kind === "workspaces"
        ? `/ops/workspaces/${row.id}`
        : kind === "tasks"
          ? `/ops/tasks/${row.id}`
          : null;
  return (
    <>
      {
        <DataTable
          rows={compact ? config.rows.slice(0, 3) : config.rows}
          columns={config.columns}
          onRowClick={(row) =>
            onOpen ? onOpen(row) : route(row) ? navigate(route(row)) : undefined
          }
          actions={(row) => (
            <IconButton
              icon="chevronRight"
              label="查看详情"
              onClick={() =>
                onOpen ? onOpen(row) : route(row) ? navigate(route(row)) : null
              }
            />
          )}
        />
      }
      {!compact && <Pagination page={page} pages={4} onChange={setPage} />}
    </>
  );
}

export function OpsListPage({ kind }) {
  const config = tableConfig(kind);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [row, setRow] = useState(null);
  const [announcement, setAnnouncement] = useState(false);
  const [review, setReview] = useState(
    new URLSearchParams(location.search).get("drawer") === "review",
  );
  useEffect(() => {
    if (review) setRow(config.rows[0]);
  }, [review]);
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="Hunter 运营"
        title={config.title}
        description={config.description}
        actions={
          kind === "announcements" ? (
            <Button
              tone="primary"
              icon="plus"
              onClick={() => setAnnouncement(true)}
            >
              新建公告
            </Button>
          ) : kind === "usage" ? (
            <Button onClick={() => toast("运营用量报表已导出")}>
              导出报表
            </Button>
          ) : null
        }
      />
      <div className="ops-banner">
        本页面只展示账号元数据、脱敏运行状态和必要诊断信息，不展示用户业务内容。
      </div>
      <FilterBar
        resultText={`显示 ${config.rows.length} 条结果`}
        onClear={() => {
          setQuery("");
          setDate("");
        }}
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={`搜索${config.title}`}
        />
        <MultiSelect
          values={[]}
          onChange={() => {}}
          options={[
            { value: "normal", label: "正常" },
            { value: "waiting", label: "待处理" },
            { value: "failed", label: "失败" },
          ]}
          placeholder="状态"
          width="150px"
        />
        <DateRange value={date} onChange={setDate} width="200px" />
      </FilterBar>
      <OpsDataTable
        kind={kind}
        onOpen={(selected) =>
          kind === "applications" || !["workspaces", "tasks"].includes(kind)
            ? setRow(selected)
            : navigate(
                kind === "workspaces"
                  ? `/ops/workspaces/${selected.id}`
                  : `/ops/tasks/${selected.id}`,
              )
        }
      />
      <Drawer
        open={Boolean(row)}
        onClose={() => {
          setRow(null);
          setReview(false);
        }}
        title={kind === "applications" ? "审核试用申请" : `${config.title}详情`}
        width="520px"
      >
        {kind === "applications" ? (
          <ApplicationReview
            row={row}
            close={() => {
              setReview(false);
              setRow(null);
              toast("审核结果已保存");
            }}
          />
        ) : (
          <div className="stack">
            <InfoGrid
              columns={1}
              items={Object.entries(row || {}).map(([key, value]) => [
                key,
                String(value),
              ])}
            />
            <Textarea
              label="运营处理记录"
              placeholder="记录处理原因、影响范围和后续动作"
            />
            <Button
              tone="primary"
              onClick={() => {
                setRow(null);
                toast("处理记录已保存");
              }}
            >
              保存记录
            </Button>
          </div>
        )}
      </Drawer>
      <Modal
        open={announcement}
        onClose={() => setAnnouncement(false)}
        title="新建运营公告"
        size="lg"
        footer={
          <>
            <Button onClick={() => setAnnouncement(false)}>保存草稿</Button>
            <Button
              tone="primary"
              onClick={() => {
                setAnnouncement(false);
                toast("公告已发布");
              }}
            >
              发布公告
            </Button>
          </>
        }
      >
        <div className="form-grid">
          <Input
            className="span-2"
            label="公告标题"
            placeholder="说明影响和用户需要做什么"
          />
          <Select
            label="发布范围"
            value="affected"
            onChange={() => {}}
            options={[
              { value: "affected", label: "受影响工作空间" },
              { value: "all", label: "全部用户" },
            ]}
          />
          <Input label="展示时间" value="立即开始" readOnly />
          <Textarea
            className="span-2"
            label="公告正文"
            placeholder="使用业务语言说明影响、已保留内容和下一步，不暴露内部实现。"
          />
        </div>
      </Modal>
    </div>
  );
}

function ApplicationReview({ row, close }) {
  const [decision, setDecision] = useState("approve");
  return (
    <div className="stack">
      <InfoGrid
        columns={1}
        items={[
          ["申请编号", row?.id],
          ["申请人", row?.applicant],
          ["当前身份", row?.identity],
          ["业务方向", row?.direction],
          [
            "使用目标",
            "希望自动完成具身智能岗位的人才召回、初步匹配和候选人资料整理。",
          ],
          ["重复检查", "没有发现相同手机号或邮箱的已开通工作空间"],
        ]}
      />
      <div className="field">
        <span className="field-label">审核结果</span>
        <Select
          value={decision}
          onChange={setDecision}
          options={[
            { value: "approve", label: "通过并开通试用" },
            { value: "supplement", label: "要求补充信息" },
            { value: "reject", label: "拒绝申请" },
          ]}
        />
      </div>
      {decision === "approve" && (
        <div className="form-grid">
          <Input label="试用任务额度" value="50" readOnly />
          <Input label="试用有效期" value="30 天" readOnly />
        </div>
      )}
      <Textarea label="审核意见" placeholder="该内容会发送给申请人" />
      <Button tone="primary" onClick={close}>
        确认审核结果
      </Button>
    </div>
  );
}

export function OpsWorkspaceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState("overview");
  const [entitlement, setEntitlement] = useState(false);
  const [suspend, setSuspend] = useState(false);
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="工作空间 · 脱敏视图"
        title={id || "WS-13A7"}
        description="个人专业版 · 最近登录今天 09:03"
        status={<Status tone="warning">受限</Status>}
        back={() => navigate("/ops/workspaces")}
        actions={
          <>
            <Button onClick={() => setEntitlement(true)}>调整权益</Button>
            <Button tone="dangerGhost" onClick={() => setSuspend(true)}>
              限制账号
            </Button>
          </>
        }
      />
      <div className="ops-banner">
        候选人、岗位、公司、消息、附件和 Agent 输出正文不在本页面的数据结构中。
      </div>
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "overview", label: "概览" },
          { value: "subscription", label: "订阅与权益" },
          { value: "usage", label: "用量" },
          { value: "health", label: "任务健康" },
          { value: "records", label: "运营记录" },
        ]}
      />
      {tab === "overview" && (
        <section className="page-section detail-layout">
          <div className="surface">
            <InfoGrid
              items={[
                ["工作空间", id || "WS-13A7"],
                ["状态", "受限"],
                ["注册时间", "2026-07-12 14:36"],
                ["最近登录", "今天 09:03"],
                ["订阅", "个人专业版 · 2026-09-01 到期"],
                ["额度", "48 / 50 个任务"],
                ["任务健康", "2 个任务需要处理"],
                ["数据保留", "正常"],
              ]}
            />
          </div>
          <aside className="surface">
            <header className="surface-header">
              <h2>允许的运营操作</h2>
            </header>
            <div className="surface-body privacy-note">
              <Icon name="info" />
              <span>
                可以调整账号状态、权益、配额和脱敏任务恢复；不能修改用户输入、审核结果或业务资产。
              </span>
            </div>
          </aside>
        </section>
      )}
      {tab === "subscription" && (
        <section className="page-section surface">
          <InfoGrid
            items={[
              ["当前方案", "个人专业版"],
              ["状态", "正常"],
              ["有效期", "2026-09-01"],
              ["任务额度", "50 / 月"],
              ["并发", "3 个"],
              ["存储", "10 GB"],
            ]}
          />
        </section>
      )}
      {tab === "usage" && (
        <section className="page-section usage-grid">
          <article className="surface">
            <header>
              <span>
                <b>Agent 任务</b>
                <small>本周期</small>
              </span>
              <strong>
                48 <small>/ 50</small>
              </strong>
            </header>
            <Progress value={96} tone="red" />
          </article>
          <article className="surface">
            <header>
              <span>
                <b>存储</b>
                <small>当前</small>
              </span>
              <strong>
                3.6 <small>/ 10 GB</small>
              </strong>
            </header>
            <Progress value={36} />
          </article>
        </section>
      )}
      {tab === "health" && (
        <section className="page-section surface">
          <OpsDataTable kind="tasks" compact />
        </section>
      )}
      {tab === "records" && (
        <section className="page-section surface">
          <div className="surface-body">
            <ActivityTimeline
              items={[
                {
                  time: "今天 10:21",
                  title: "运营调整任务额度",
                  detail: "额度从 40 调整为 50，原因：试用验收。",
                  tone: "success",
                },
                {
                  time: "昨天 22:16",
                  title: "系统暂停受影响任务",
                  detail: "人才平台登录失效，保留检查点。",
                  tone: "info",
                },
              ]}
            />
          </div>
        </section>
      )}
      <Modal
        open={entitlement}
        onClose={() => setEntitlement(false)}
        title="调整工作空间权益"
        footer={
          <>
            <Button onClick={() => setEntitlement(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setEntitlement(false);
                toast("权益已调整并写入审计");
              }}
            >
              保存调整
            </Button>
          </>
        }
      >
        <div className="form-grid">
          <Input label="Agent 任务额度" value="50" readOnly />
          <Input label="并发上限" value="3" readOnly />
          <Textarea
            className="span-2"
            label="调整原因"
            placeholder="必填，将写入运营审计"
          />
        </div>
      </Modal>
      <Modal
        danger
        open={suspend}
        onClose={() => setSuspend(false)}
        title="限制工作空间"
        description="限制消耗型能力，但保留数据查看和导出"
        footer={
          <>
            <Button onClick={() => setSuspend(false)}>取消</Button>
            <Button
              tone="danger"
              onClick={() => {
                setSuspend(false);
                toast("工作空间已受限");
              }}
            >
              确认限制
            </Button>
          </>
        }
      >
        <Textarea
          label="限制原因"
          placeholder="填写用户可理解的原因和恢复条件"
        />
      </Modal>
    </div>
  );
}

export function OpsTaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [technical, setTechnical] = useState(false);
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="脱敏任务诊断"
        title={id || "RUN-2B43"}
        description="学术搜索 · 重试中 · 工作空间 WS-13A7"
        status={<Status tone="warning">可恢复</Status>}
        back={() => navigate("/ops/tasks")}
        actions={
          <>
            <Button onClick={() => setTechnical(true)}>查看技术详情</Button>
            <Button
              tone="primary"
              icon="refresh"
              onClick={() => toast("已从检查点安全重试")}
            >
              安全重试
            </Button>
          </>
        }
      />
      <div className="ops-banner">
        本页面仅显示运行阶段、错误码、依赖、检查点和恢复能力。用户输入、搜索条件、论文结果和附件正文不可见。
      </div>
      <section className="page-section detail-layout">
        <div className="surface">
          <header className="surface-header">
            <h2>脱敏运行链路</h2>
          </header>
          <div className="task-process">
            {[
              {
                time: "09:01:18",
                title: "任务进入队列",
                summary: "Worker 分配完成，运行目录和检查点已创建。",
                tone: "success",
              },
              {
                time: "09:02:06",
                title: "生成搜索计划",
                summary: "输出结构检查通过；业务内容已隐藏。",
                tone: "success",
              },
              {
                time: "09:05:42",
                title: "调用学术数据源",
                summary: "OpenAlex 超时，自动切换免费接口并退避重试。",
                tone: "danger",
              },
              {
                time: "09:08:14",
                title: "等待依赖恢复",
                summary: "检查点已保留，可从 source-fetch-2 继续。",
                tone: "info",
              },
            ].map((event, index) => (
              <button key={index}>
                <time>{event.time}</time>
                <i className={`event-${event.tone}`}>
                  <Icon
                    name={
                      event.tone === "success"
                        ? "check"
                        : event.tone === "danger"
                          ? "warning"
                          : "clock"
                    }
                  />
                </i>
                <span>
                  <b>{event.title}</b>
                  <p>{event.summary}</p>
                </span>
                <Icon name="chevronRight" />
              </button>
            ))}
          </div>
        </div>
        <aside className="stack">
          <div className="surface">
            <InfoGrid
              columns={1}
              items={[
                ["任务类型", "学术搜索"],
                ["版本", "v0.12.45"],
                ["当前阶段", "数据源召回"],
                ["检查点", "source-fetch-2"],
                ["重试次数", "2 / 4"],
                ["错误码", "academic_source_timeout"],
                ["依赖", "OpenAlex"],
                ["恢复能力", "可从检查点继续"],
              ]}
            />
          </div>
          <div className="privacy-note">
            <Icon name="info" />
            <span>
              运营重试只恢复技术执行，不改变用户输入、确认方式和业务结果。
            </span>
          </div>
        </aside>
      </section>
      <Modal
        open={technical}
        onClose={() => setTechnical(false)}
        title="任务技术详情"
        size="lg"
        footer={
          <>
            <Button onClick={() => setTechnical(false)}>关闭</Button>
            <Button
              tone="primary"
              icon="copy"
              onClick={() => toast("技术详情已复制")}
            >
              复制全部
            </Button>
          </>
        }
      >
        <pre className="technical-detail">
          run_id: {id || "RUN-2B43"}
          {"\n"}error_code: academic_source_timeout{"\n"}checkpoint:
          source-fetch-2{"\n"}retryable: true{"\n"}business_payload: REDACTED
        </pre>
      </Modal>
    </div>
  );
}

export function OpsSubscriptionsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const rows = [
    {
      id: "SUB-821",
      workspace: "WS-8F21",
      plan: "试用",
      status: "即将到期",
      expires: "2026-09-01",
      usage: "32 / 50",
      payment: "无",
    },
    {
      id: "SUB-770",
      workspace: "WS-13A7",
      plan: "个人专业版",
      status: "正常",
      expires: "2026-09-18",
      usage: "48 / 50",
      payment: "已支付",
    },
    {
      id: "SUB-691",
      workspace: "WS-4C90",
      plan: "试用",
      status: "正常",
      expires: "2026-09-12",
      usage: "18 / 50",
      payment: "无",
    },
  ];
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="Hunter 运营"
        title="订阅与权益"
        description="处理方案、有效期、订单、续订和权益修正。"
        actions={
          <Button onClick={() => toast("订阅报表已导出")}>导出报表</Button>
        }
      />
      <div className="ops-banner">
        订阅运营只处理工作空间权益和订单，不访问业务数据。
      </div>
      <FilterBar resultText="显示 3 条结果">
        <SearchInput
          value=""
          onChange={() => {}}
          placeholder="搜索工作空间或订单"
        />
        <MultiSelect
          values={[]}
          onChange={() => {}}
          options={[
            { value: "trial", label: "试用" },
            { value: "paid", label: "专业版" },
          ]}
          placeholder="方案"
          width="150px"
        />
      </FilterBar>
      <DataTable
        rows={rows}
        columns={[
          { key: "workspace", label: "工作空间", width: "18%" },
          { key: "plan", label: "方案", width: "17%" },
          {
            key: "status",
            label: "状态",
            width: "15%",
            render: (value) => (
              <Status tone={toneForStatus(value)}>{value}</Status>
            ),
          },
          { key: "expires", label: "有效期", width: "18%" },
          { key: "usage", label: "任务额度", width: "16%" },
          { key: "payment", label: "支付", width: "14%" },
        ]}
        onRowClick={(row) => navigate(`/ops/workspaces/${row.workspace}`)}
      />
    </div>
  );
}

export function OpsUsagePage() {
  const toast = useToast();
  const [date, setDate] = useState("2026-08-11 至 2026-08-17");
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="Hunter 运营"
        title="平台用量与成本"
        description="按能力和脱敏工作空间汇总任务、模型、搜索、浏览器和存储消耗。"
        actions={
          <Button onClick={() => toast("成本报表已导出")}>导出报表</Button>
        }
      />
      <FilterBar resultText="128 个活跃工作空间">
        <DateRange value={date} onChange={setDate} width="220px" />
        <Select
          value="all"
          onChange={() => {}}
          options={[
            { value: "all", label: "全部能力" },
            { value: "agent", label: "Agent" },
            { value: "search", label: "搜索" },
            { value: "browser", label: "浏览器" },
          ]}
          width="160px"
        />
      </FilterBar>
      <div className="metric-grid">
        <article className="metric">
          <span>
            Agent 任务
            <Icon name="task" />
          </span>
          <strong>3,842</strong>
          <small>较上周 +12%</small>
        </article>
        <article className="metric">
          <span>
            模型成本
            <Icon name="signal" />
          </span>
          <strong>￥8,420</strong>
          <small>平均 ￥2.19 / 任务</small>
        </article>
        <article className="metric">
          <span>
            公开搜索
            <Icon name="search" />
          </span>
          <strong>46,218</strong>
          <small>缓存命中率 38%</small>
        </article>
        <article className="metric">
          <span>
            对象存储
            <Icon name="database" />
          </span>
          <strong>286 GB</strong>
          <small>近 30 日 +24 GB</small>
        </article>
      </div>
      <section className="page-section surface">
        <header className="surface-header">
          <h2>成本趋势</h2>
          <Status tone="success">预算内</Status>
        </header>
        <div className="usage-chart ops-chart">
          {[42, 38, 54, 62, 58, 71, 66, 78, 64, 73, 86, 82, 76, 90].map(
            (height, index) => (
              <i key={index} style={{ height: `${height}%` }}>
                <span>{height}</span>
              </i>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
