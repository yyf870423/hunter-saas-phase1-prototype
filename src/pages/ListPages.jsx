import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Cascader,
  DataTable,
  DateRange,
  FilterBar,
  IconButton,
  Input,
  Modal,
  MultiSelect,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Status,
  Textarea,
  Tooltip,
  useToast,
} from "../components/ui";
import { Icon } from "../components/Icon";
import { toneForStatus } from "../components/business";
import {
  candidates,
  companies,
  contacts,
  opportunities,
  papers,
  patents,
  positions,
  signals,
  tasks,
  workstreams,
} from "../data/demo";
import { usePrototype } from "../store/PrototypeStore";

const mappings = [
  {
    id: "embodied",
    name: "具身智能核心人才摸排",
    scope: "12 家目标公司 · VLA / 灵巧手 / 机器人平台",
    coverage: "72%",
    status: "维护中",
    people: 93,
    updated: "今天 10:40",
  },
  {
    id: "autonomous",
    name: "自动驾驶感知人才摸排",
    scope: "8 家目标公司 · 感知 / 规控",
    coverage: "84%",
    status: "已完成",
    people: 128,
    updated: "8 月 14 日",
  },
  {
    id: "robot-chip",
    name: "机器人芯片架构人才摸排",
    scope: "6 家目标公司 · SoC / 边缘计算",
    coverage: "46%",
    status: "推进中",
    people: 42,
    updated: "8 月 12 日",
  },
];

const configs = {
  workstreams: {
    title: "业务主线",
    description: "从目标开始持续记录任务、外部等待、人工决策、成果和后续动作。",
    newLabel: "新建业务主线",
    newRoute: "/workstreams/new",
    rows: workstreams,
    filters: ["type", "status", "date"],
    columns: [
      {
        key: "target",
        label: "业务目标",
        width: "25%",
        render: (value, row) => (
          <span className="cell-main">
            <b>{value}</b>
            <small>
              {row.type} · {row.object}
            </small>
          </span>
        ),
      },
      {
        key: "status",
        label: "整体状态",
        width: "12%",
        render: (value) => <Status tone={toneForStatus(value)}>{value}</Status>,
      },
      {
        key: "running",
        label: "当前工作",
        width: "15%",
        render: (value, row) => (
          <span className="cell-main">
            <b>{value ? `${value} 个任务运行` : "暂无运行任务"}</b>
            <small>
              {row.type === "人才摸排"
                ? "组织与人物补齐"
                : row.type === "岗位招聘"
                  ? "找人与匹配"
                  : row.type === "客户开发"
                    ? "需求核验"
                    : "等待资料更新"}
            </small>
          </span>
        ),
      },
      { key: "waiting", label: "需处理 / 等待", width: "18%" },
      { key: "next", label: "下一步", width: "20%" },
      { key: "changed", label: "最近变化", width: "10%" },
    ],
    route: (row) =>
      `/workstreams/${row.id}/${row.type === "客户开发" ? "client" : row.type === "岗位招聘" ? "position" : row.type === "人才摸排" ? "mapping" : "career"}`,
  },
  tasks: {
    title: "支线任务",
    description:
      "查看具备独立目标和生命周期的支线任务；业务主线内部执行在对应主线中查看。",
    rows: tasks.filter((item) => item.independent),
    filters: ["type", "status", "date"],
    columns: [
      {
        key: "title",
        label: "任务",
        width: "27%",
        render: (value, row) => (
          <span className="cell-main">
            <b>{value}</b>
            <small>
              {row.type} · {row.mainline}
            </small>
          </span>
        ),
      },
      {
        key: "status",
        label: "状态",
        width: "12%",
        render: (value) => <Status tone={toneForStatus(value)}>{value}</Status>,
      },
      { key: "action", label: "当前动作", width: "24%" },
      { key: "duration", label: "耗时", width: "10%" },
      { key: "usage", label: "用量", width: "9%" },
      { key: "destination", label: "结果去向", width: "18%" },
    ],
    route: (row) => `/tasks/${row.id}`,
  },
  signals: {
    title: "机会与信号",
    description:
      "信号用于提示可能值得行动的变化，只有经过确认后才进入业务主线或正式资产。",
    rows: signals,
    filters: ["type", "status", "priority", "source", "date"],
    columns: [
      {
        key: "title",
        label: "信号",
        width: "34%",
        render: (value, row) => (
          <span className="cell-main">
            <b>{value}</b>
            <small>
              {row.type} · {row.object}
            </small>
          </span>
        ),
      },
      {
        key: "priority",
        label: "优先级",
        width: "10%",
        render: (value) => (
          <Status tone={value === "高" ? "warning" : "neutral"}>{value}</Status>
        ),
      },
      { key: "source", label: "来源", width: "20%" },
      {
        key: "status",
        label: "状态",
        width: "12%",
        render: (value) => <Status tone={toneForStatus(value)}>{value}</Status>,
      },
      { key: "expires", label: "有效期", width: "12%" },
      { key: "time", label: "发现时间", width: "12%" },
    ],
    route: (row) => `/signals/${row.id}`,
  },
  companies: {
    title: "公司",
    description: "管理客户公司、目标公司及其联系人、关联岗位和候选人推进。",
    newLabel: "新建公司",
    rows: companies,
    filters: ["industry", "location", "hiring"],
    columns: [
      {
        key: "name",
        label: "公司",
        width: "25%",
        render: (value, row) => (
          <span className="cell-main">
            <b>{value}</b>
            <small>{row.funding}</small>
          </span>
        ),
      },
      { key: "industry", label: "行业", width: "14%" },
      { key: "location", label: "主要地点", width: "12%" },
      {
        key: "hiring",
        label: "招聘状态",
        width: "15%",
        render: (value) => <Status tone={toneForStatus(value)}>{value}</Status>,
      },
      {
        key: "contacts",
        label: "联系人",
        width: "10%",
        render: (value) => `${value} 位`,
      },
      {
        key: "positions",
        label: "岗位",
        width: "10%",
        render: (value) => `${value} 个`,
      },
      { key: "updated", label: "更新时间", width: "14%" },
    ],
    route: (row) => `/companies/${row.id}`,
  },
  contacts: {
    title: "联系人",
    description:
      "管理客户公司负责人、招聘联系人和已有关系，并保留联系偏好与历史。",
    newLabel: "新建联系人",
    rows: contacts,
    filters: ["company", "role", "contactStatus"],
    columns: [
      { key: "name", label: "姓名", width: "18%" },
      { key: "role", label: "角色", width: "20%" },
      { key: "company", label: "公司", width: "20%" },
      { key: "channel", label: "联系方式", width: "16%" },
      {
        key: "status",
        label: "联系状态",
        width: "14%",
        render: (value) => <Status tone={toneForStatus(value)}>{value}</Status>,
      },
      { key: "recent", label: "最近沟通", width: "12%" },
    ],
    route: (row) => `/contacts/${row.id}`,
  },
  opportunities: {
    title: "招聘机会",
    description: "记录尚未拆成正式岗位的招聘需求、来源联系人和待澄清内容。",
    rows: opportunities,
    filters: ["company", "status", "source", "date"],
    columns: [
      {
        key: "summary",
        label: "招聘需求",
        width: "32%",
        render: (value, row) => (
          <span className="cell-main">
            <b>{value}</b>
            <small>{row.company}</small>
          </span>
        ),
      },
      { key: "contact", label: "来源联系人", width: "16%" },
      {
        key: "status",
        label: "状态",
        width: "13%",
        render: (value) => <Status tone={toneForStatus(value)}>{value}</Status>,
      },
      { key: "unclear", label: "待澄清", width: "25%" },
      { key: "valid", label: "有效期", width: "14%" },
    ],
    route: (row) => `/opportunities/${row.id}`,
  },
  positions: {
    title: "岗位",
    description:
      "查看岗位信息、招聘进展和候选人分布，启动岗位解析、匹配或招聘主线。",
    newLabel: "新建岗位",
    rows: positions,
    filters: ["company", "location", "status", "date"],
    columns: [
      {
        key: "name",
        label: "岗位",
        width: "25%",
        render: (value, row) => (
          <span className="cell-main">
            <b>{value}</b>
            <small>
              {row.company} · {row.location}
            </small>
          </span>
        ),
      },
      {
        key: "status",
        label: "状态",
        width: "11%",
        render: (value) => <Status tone={toneForStatus(value)}>{value}</Status>,
      },
      { key: "headcount", label: "招聘人数", width: "10%" },
      { key: "reserve", label: "储备", width: "9%" },
      { key: "progress", label: "推进中", width: "9%" },
      { key: "hired", label: "已入职", width: "9%" },
      { key: "failed", label: "失败", width: "9%" },
      { key: "updated", label: "更新时间", width: "18%" },
    ],
    route: (row) => `/positions/${row.id}`,
  },
  candidates: {
    title: "候选人",
    description: "搜索、筛选和管理候选人资料，查看匹配、沟通和岗位推进。",
    newLabel: "新建候选人",
    rows: candidates,
    filters: ["company", "location", "industry", "stage", "date"],
    selectable: true,
    columns: [
      {
        key: "name",
        label: "候选人",
        width: "18%",
        render: (value, row) => (
          <span className="cell-main">
            <b>{value}</b>
            <small>
              {row.company} · {row.title}
            </small>
          </span>
        ),
      },
      { key: "location", label: "地点", width: "9%" },
      { key: "industry", label: "行业", width: "12%" },
      {
        key: "skills",
        label: "技能",
        width: "22%",
        render: (value) => (
          <span className="tag-list">
            {value.slice(0, 3).map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </span>
        ),
      },
      {
        key: "status",
        label: "求职状态",
        width: "12%",
        render: (value) => <Status tone={toneForStatus(value)}>{value}</Status>,
      },
      { key: "stage", label: "岗位流程", width: "12%" },
      { key: "updated", label: "更新时间", width: "15%" },
    ],
    route: (row) => `/candidates/${row.id}`,
  },
  mappings: {
    title: "人才摸排",
    description:
      "围绕目标领域持续完善公司、组织方向、关键角色、人物关系和覆盖情况。",
    newLabel: "新建人才摸排",
    newRoute: "/workstreams/new?type=mapping",
    rows: mappings,
    filters: ["direction", "status", "date"],
    columns: [
      {
        key: "name",
        label: "摸排",
        width: "28%",
        render: (value, row) => (
          <span className="cell-main">
            <b>{value}</b>
            <small>{row.scope}</small>
          </span>
        ),
      },
      { key: "coverage", label: "覆盖度", width: "14%" },
      {
        key: "people",
        label: "已确认人物",
        width: "15%",
        render: (value) => `${value} 位`,
      },
      {
        key: "status",
        label: "维护状态",
        width: "16%",
        render: (value) => <Status tone={toneForStatus(value)}>{value}</Status>,
      },
      { key: "updated", label: "最近更新", width: "18%" },
    ],
    route: (row) => `/mappings/${row.id}`,
  },
  papers: {
    title: "论文",
    description:
      "管理论文、作者机构和候选人关联；论文搜索结果经过确认后进入这里。",
    newLabel: "搜索论文",
    newRoute: "/tasks/task-academic",
    rows: papers,
    filters: ["org", "direction", "year", "related"],
    selectable: true,
    columns: [
      {
        key: "title",
        label: "论文",
        width: "36%",
        render: (value, row) => (
          <span className="cell-main">
            <b>{value}</b>
            <small>{row.zh}</small>
          </span>
        ),
      },
      { key: "authors", label: "作者", width: "18%" },
      { key: "org", label: "机构", width: "17%" },
      { key: "year", label: "年份", width: "8%" },
      { key: "source", label: "来源", width: "11%" },
      { key: "related", label: "关联候选人", width: "10%" },
    ],
    route: (row) => `/papers/${row.id}`,
  },
  patents: {
    title: "专利",
    description: "管理专利、发明人、申请人和候选人关联，支持共同发明人检索。",
    newLabel: "共同发明人检索",
    newRoute: "/tasks/task-patent",
    rows: patents,
    filters: ["applicant", "direction", "year", "related"],
    columns: [
      { key: "title", label: "专利", width: "35%" },
      { key: "inventors", label: "发明人", width: "20%" },
      { key: "applicant", label: "申请人", width: "18%" },
      { key: "date", label: "公开时间", width: "12%" },
      { key: "status", label: "状态", width: "8%" },
      { key: "related", label: "关联候选人", width: "12%" },
    ],
    route: (row) => `/patents/${row.id}`,
  },
};

function filterOption(type) {
  const map = {
    type: [
      "客户开发",
      "岗位招聘",
      "人才摸排",
      "候选人求职",
      "公司调研",
      "人才寻找",
      "支线调研",
      "学术搜索",
      "共同发明人检索",
    ],
    status: [
      "推进中",
      "等待用户",
      "等待外部",
      "已暂停",
      "维护中",
      "已完成",
      "失败",
    ],
    priority: ["高", "中", "低"],
    source: ["公开网络", "候选人回复", "公司公告", "人才平台"],
    industry: ["具身智能", "机器人", "自动驾驶", "半导体"],
    location: ["上海", "北京", "深圳", "苏州"],
    hiring: ["重点招聘", "持续招聘", "机会核验中", "暂无公开岗位"],
    company: companies.map((item) => item.name),
    role: ["HRD", "招聘负责人", "创始人办公室", "人才发展"],
    contactStatus: ["已回复", "等待回复", "可联系", "关系待核验"],
    stage: ["储备", "待推荐", "二轮面试", "薪资沟通", "客户面试"],
    direction: ["具身智能", "自动驾驶", "机器人芯片"],
    org: ["Stanford University", "UC Berkeley", "Google DeepMind"],
    year: ["2026", "2025", "2024", "2023"],
    related: ["已关联", "未关联"],
    applicant: ["原力机器人", "瀚星科技"],
  };
  return (map[type] || []).map((value) => ({ value, label: value }));
}

function CreateModal({ kind, open, close }) {
  const toast = useToast();
  const config = configs[kind];
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const create = () => {
    if (!name.trim()) {
      setError("请填写名称后再创建");
      return;
    }
    close();
    toast(`${name} 已创建`);
  };
  return (
    <Modal
      open={open}
      onClose={close}
      title={config.newLabel || "新建记录"}
      description="原型会模拟创建并保留当前列表筛选"
      footer={
        <>
          <Button onClick={close}>取消</Button>
          <Button tone="primary" onClick={create}>
            确认创建
          </Button>
        </>
      }
    >
      <div className="form-grid">
        <Input
          className="span-2"
          label="名称"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
          error={error}
          placeholder={`输入${config.title}名称`}
        />
        <Textarea
          className="span-2"
          label="补充说明"
          placeholder="填写已知背景、来源或需要进一步核验的内容"
        />
      </div>
    </Modal>
  );
}

export function EntityListPage({ kind }) {
  const config = configs[kind];
  const navigate = useNavigate();
  const toast = useToast();
  const { state, update } = usePrototype();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);
  const [selected, setSelected] = useState([]);
  const rows = useMemo(
    () =>
      config.rows.filter(
        (row) =>
          !query.trim() ||
          Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [config.rows, query],
  );
  const create = () =>
    config.newRoute ? navigate(config.newRoute) : setCreateOpen(true);
  const routeFor = (row) => config.route(row);
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="业务资产与运行记录"
        title={config.title}
        description={config.description}
        actions={
          <>
            {kind === "workstreams" && (
              <Button
                icon="pause"
                onClick={() => toast("已暂停选中的业务主线")}
              >
                批量暂停
              </Button>
            )}
            {config.newLabel && (
              <Button tone="primary" icon="plus" onClick={create}>
                {config.newLabel}
              </Button>
            )}
          </>
        }
      />
      <FilterBar
        resultText={`显示 ${rows.length} 条结果${date ? ` · ${date}` : ""}`}
        onClear={() => {
          setFilters({});
          setDate("");
          setQuery("");
        }}
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={`搜索${config.title}`}
        />
        {config.filters.slice(0, 4).map((filter) =>
          filter === "direction" ? (
            <Cascader
              key={filter}
              value={filters[filter] || ""}
              onChange={(value) =>
                setFilters((current) => ({ ...current, [filter]: value }))
              }
              width="168px"
            />
          ) : (
            <MultiSelect
              key={filter}
              values={filters[filter] || []}
              onChange={(values) =>
                setFilters((current) => ({ ...current, [filter]: values }))
              }
              options={filterOption(filter)}
              placeholder={
                {
                  type: "类型",
                  status: "状态",
                  priority: "优先级",
                  source: "来源",
                  industry: "行业",
                  location: "地点",
                  hiring: "招聘状态",
                  company: "公司",
                  role: "角色",
                  contactStatus: "联系状态",
                  stage: "流程阶段",
                  org: "机构",
                  year: "年份",
                  related: "关联状态",
                  applicant: "申请人",
                }[filter] || "请选择"
              }
              width="150px"
            />
          ),
        )}
        {config.filters.includes("date") && (
          <DateRange value={date} onChange={setDate} width="190px" />
        )}
      </FilterBar>
      {selected.length > 0 && (
        <div className="bulk-bar">
          <span>已选择 {selected.length} 项</span>
          {kind === "candidates" && (
            <Button
              size="sm"
              tone="primary"
              onClick={() =>
                toast(`已为 ${selected.length} 位候选人打开岗位选择`)
              }
            >
              批量匹配
            </Button>
          )}
          {kind === "papers" && (
            <Button
              size="sm"
              tone="primary"
              onClick={() => {
                update({
                  importedPaperIds: [
                    ...new Set([...state.importedPaperIds, ...selected]),
                  ],
                });
                toast(`已导入 ${selected.length} 篇论文`);
                setSelected([]);
              }}
            >
              批量导入
            </Button>
          )}
          <Button size="sm" onClick={() => setSelected([])}>
            取消选择
          </Button>
        </div>
      )}
      <DataTable
        columns={config.columns}
        rows={rows}
        onRowClick={(row) => navigate(routeFor(row))}
        selected={selected}
        onSelect={config.selectable ? setSelected : undefined}
        actions={(row) => (
          <>
            <Tooltip text="查看详情">
              <IconButton
                icon="chevronRight"
                label="查看详情"
                onClick={() => navigate(routeFor(row))}
              />
            </Tooltip>
            {[
              "companies",
              "contacts",
              "positions",
              "candidates",
              "papers",
              "patents",
            ].includes(kind) && (
              <Tooltip text="删除">
                <IconButton
                  icon="trash"
                  label="删除"
                  tone="danger"
                  onClick={() => setDeleteRow(row)}
                />
              </Tooltip>
            )}
          </>
        )}
      />
      <Pagination
        page={page}
        pages={kind === "tasks" ? 1 : 5}
        total={kind === "tasks" ? rows.length : 46}
        onChange={setPage}
      />
      <CreateModal
        kind={kind}
        open={createOpen}
        close={() => setCreateOpen(false)}
      />
      <Modal
        danger
        open={Boolean(deleteRow)}
        onClose={() => setDeleteRow(null)}
        title={`删除${config.title}`}
        description={`将删除“${deleteRow?.name || deleteRow?.title || "当前记录"}”`}
        footer={
          <>
            <Button onClick={() => setDeleteRow(null)}>取消</Button>
            <Button
              tone="danger"
              onClick={() => {
                toast("记录已删除");
                setDeleteRow(null);
              }}
            >
              确认删除
            </Button>
          </>
        }
      >
        <p>
          删除后当前记录将不再显示。与其他业务对象的已确认历史仍会保留必要追溯信息。
        </p>
      </Modal>
    </div>
  );
}

export function AssetsPage() {
  const navigate = useNavigate();
  const assetCards = [
    ["building", "公司", companies.length, "2 家公司资料待补充", "/companies"],
    ["briefcase", "岗位", positions.length, "3 个正在招聘", "/positions"],
    ["user", "候选人", candidates.length, "4 位资料有更新", "/candidates"],
    ["route", "人才摸排", mappings.length, "7 条人物关系待核验", "/mappings"],
    ["paper", "论文", papers.length, "2 篇待关联候选人", "/papers"],
    ["patent", "专利", patents.length, "1 项可发起共同发明人检索", "/patents"],
  ];
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="业务资产"
        title="所有已确认的业务数据"
        description="任务结果只有经过人工确认或授权范围内的自动确认，并通过 Hunter 门禁后才进入这里。"
        actions={
          <Button
            tone="primary"
            icon="upload"
            onClick={() => navigate("/imports")}
          >
            导入数据
          </Button>
        }
      />
      <div className="asset-grid">
        {assetCards.map(([icon, title, count, note, route]) => (
          <button
            className="asset-card"
            key={title}
            onClick={() => navigate(route)}
          >
            <i>
              <Icon name={icon} />
            </i>
            <span>
              <small>{title}</small>
              <strong>{count}</strong>
              <em>{note}</em>
            </span>
            <Icon name="chevronRight" />
          </button>
        ))}
      </div>
      <section className="page-section two-column">
        <div className="surface">
          <header className="surface-header">
            <h2>待验证数据</h2>
            <span className="status status-warning">
              <i />
              11 项
            </span>
          </header>
          <div className="summary-list">
            <button onClick={() => navigate("/mappings/embodied")}>
              <i className="summary-tone-warning">
                <Icon name="users" />
              </i>
              <span>
                <b>具身智能摸排中的人物关系</b>
                <small>7 条推断需要核验证据</small>
              </span>
              <Status tone="warning">待核验</Status>
              <Icon name="chevronRight" />
            </button>
            <button onClick={() => navigate("/signals/sig-hiring")}>
              <i className="summary-tone-info">
                <Icon name="signal" />
              </i>
              <span>
                <b>拓界智驾公开招聘信号</b>
                <small>是否形成客户开发主线待确认</small>
              </span>
              <Status tone="warning">待澄清</Status>
              <Icon name="chevronRight" />
            </button>
          </div>
        </div>
        <div className="surface">
          <header className="surface-header">
            <h2>数据质量</h2>
          </header>
          <div className="surface-body stack">
            <div className="between">
              <span>关键信息完整</span>
              <b>86%</b>
            </div>
            <div className="progress">
              <i>
                <i style={{ width: "86%" }} />
              </i>
            </div>
            <p className="muted">
              候选人联系方式、公司融资信息和岗位入职时间是当前主要缺口。
            </p>
            <Button onClick={() => navigate("/tasks?type=enrichment")}>
              查看补全任务
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
