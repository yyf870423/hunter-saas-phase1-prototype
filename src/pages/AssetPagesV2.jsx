import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import {
  Button,
  DataTable,
  DateRange,
  EmptyState,
  FilterBar,
  Input,
  Modal,
  MultiSelect,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Status,
  Tabs,
  Textarea,
  useToast,
} from "../components/ui";
import {
  candidateRows,
  companyRows,
  contactRows,
  matchResults,
  paperRows,
  patentRows,
  pipelineCards,
  positionRows,
} from "../data/assetsV2";

const kindMeta = {
  candidates: {
    title: "候选人管理",
    description: "管理候选人资料、跟进记录、岗位推进和补全任务。",
    singular: "候选人",
    route: "candidates",
  },
  positions: {
    title: "岗位管理",
    description: "管理岗位信息、岗位解析、招聘流程和人岗匹配。",
    singular: "岗位",
    route: "positions",
  },
  companies: {
    title: "公司管理",
    description: "沉淀目标公司资料，并查看联系人、岗位和候选人推进。",
    singular: "公司",
    route: "companies",
  },
  contacts: {
    title: "联系人",
    description: "管理客户联系人、联系方式、核验状态和沟通记录。",
    singular: "联系人",
    route: "contacts",
  },
  papers: {
    title: "论文管理",
    description: "管理论文、作者机构、候选人关联和联网补全结果。",
    singular: "论文",
    route: "papers",
  },
  patents: {
    title: "专利管理",
    description: "管理专利、发明人、权利人和候选人关联。",
    singular: "专利",
    route: "patents",
  },
};

const rowsByKind = {
  candidates: candidateRows,
  positions: positionRows,
  companies: companyRows,
  contacts: contactRows,
  papers: paperRows,
  patents: patentRows,
};

const text = (values) => values.filter(Boolean).join(" ").toLowerCase();

function TagList({ items = [], limit }) {
  const visible = limit ? items.slice(0, limit) : items;
  return (
    <span className="asset-tag-list">
      {visible.map((item) => (
        <span key={item}>{item}</span>
      ))}
      {limit && items.length > limit && <em>+{items.length - limit}</em>}
    </span>
  );
}

const columnsByKind = {
  candidates: [
    {
      key: "name",
      label: "候选人",
      width: "168px",
      render: (value, row) => (
        <span className="primary-cell">
          <b>{value}</b>
          <small>{row.phone}</small>
        </span>
      ),
    },
    {
      key: "company",
      label: "当前公司 / 职位",
      width: "240px",
      render: (value, row) => (
        <span className="primary-cell">
          <b>{value}</b>
          <small>{row.title}</small>
        </span>
      ),
    },
    { key: "location", label: "地点", width: "84px" },
    { key: "education", label: "学历", width: "84px" },
    {
      key: "years",
      label: "年限",
      width: "76px",
      render: (value) => `${value} 年`,
    },
    {
      key: "skills",
      label: "关键技能",
      render: (value) => <TagList items={value || []} limit={3} />,
    },
    {
      key: "stage",
      label: "流程",
      width: "96px",
      render: (value) => <Status tone="info">{value}</Status>,
    },
    { key: "updated", label: "更新时间", width: "112px" },
  ],
  positions: [
    {
      key: "title",
      label: "岗位",
      width: "240px",
      render: (value) => <b>{value}</b>,
    },
    { key: "company", label: "公司", width: "150px" },
    {
      key: "state",
      label: "状态",
      width: "88px",
      render: (value) => <Status tone="success">{value}</Status>,
    },
    { key: "location", label: "地点", width: "80px" },
    { key: "salary", label: "薪资", width: "170px" },
    {
      key: "skills",
      label: "关键技能",
      render: (value) => <TagList items={value || []} limit={3} />,
    },
    {
      key: "matchCount",
      label: "匹配",
      width: "76px",
      render: (value) => `${value} 人`,
    },
    { key: "sourcing", label: "寻访", width: "90px" },
  ],
  companies: [
    {
      key: "name",
      label: "公司",
      width: "230px",
      render: (value, row) => (
        <span className="primary-cell">
          <b>{value}</b>
          <small>{row.matchTerms?.join("、")}</small>
        </span>
      ),
    },
    {
      key: "industries",
      label: "行业",
      render: (value) => <TagList items={value || []} />,
    },
    {
      key: "candidateCount",
      label: "候选人",
      width: "88px",
      render: (value) => `${value} 人`,
    },
    {
      key: "positionCount",
      label: "岗位",
      width: "76px",
      render: (value) => `${value} 个`,
    },
    {
      key: "activeCount",
      label: "推进中",
      width: "82px",
      render: (value) => <b>{value} 人</b>,
    },
    {
      key: "contactCount",
      label: "联系人",
      width: "82px",
      render: (value) => `${value} 人`,
    },
    { key: "updated", label: "更新时间", width: "112px" },
  ],
  contacts: [
    {
      key: "name",
      label: "联系人",
      width: "160px",
      render: (value, row) => (
        <span className="primary-cell">
          <b>{value}</b>
          <small>{row.role}</small>
        </span>
      ),
    },
    { key: "company", label: "公司", width: "160px" },
    { key: "phone", label: "电话", width: "130px" },
    { key: "email", label: "邮箱", width: "230px" },
    {
      key: "channels",
      label: "渠道",
      render: (value) => <TagList items={value || []} />,
    },
    {
      key: "contactStatus",
      label: "联系状态",
      width: "100px",
      render: (value) => (
        <Status tone={value === "已回复" ? "success" : "warning"}>
          {value}
        </Status>
      ),
    },
    { key: "recent", label: "最近沟通", width: "110px" },
  ],
  papers: [
    {
      key: "title",
      label: "论文",
      render: (value, row) => (
        <span className="primary-cell">
          <b>{value}</b>
          <small>{row.titleZh}</small>
        </span>
      ),
    },
    {
      key: "authors",
      label: "作者",
      width: "220px",
      render: (value) => value.join("、"),
    },
    {
      key: "institutions",
      label: "机构",
      width: "180px",
      render: (value) => value.join("、"),
    },
    { key: "year", label: "年份", width: "70px" },
    { key: "citations", label: "被引", width: "70px" },
    {
      key: "relatedCandidates",
      label: "关联候选人",
      width: "120px",
      render: (value) => `${value.length} 人`,
    },
  ],
  patents: [
    {
      key: "title",
      label: "专利",
      render: (value, row) => (
        <span className="primary-cell">
          <b>{value}</b>
          <small>{row.publicationNo}</small>
        </span>
      ),
    },
    {
      key: "inventors",
      label: "发明人",
      width: "190px",
      render: (value) => value.join("、"),
    },
    { key: "assignee", label: "权利人", width: "220px" },
    { key: "filingDate", label: "申请日", width: "105px" },
    {
      key: "status",
      label: "状态",
      width: "90px",
      render: (value) => <Status tone="info">{value}</Status>,
    },
    {
      key: "relatedCandidates",
      label: "关联候选人",
      width: "120px",
      render: (value) => `${value.length} 人`,
    },
  ],
};

export function AssetListPageV2({ kind }) {
  const meta = kindMeta[kind];
  const navigate = useNavigate();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [single, setSingle] = useState("");
  const [multi, setMulti] = useState([]);
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);
  const [records, setRecords] = useState(() => rowsByKind[kind] || []);
  const [draft, setDraft] = useState({ name: "", company: "", note: "" });
  const [createError, setCreateError] = useState("");
  const rows = records;
  const filtered = useMemo(() => {
    const words = query
      .trim()
      .toLowerCase()
      .split(/[\s,，]+/)
      .filter(Boolean);
    return rows.filter((row) => {
      const haystack = text(
        Object.values(row).flatMap((value) =>
          Array.isArray(value) ? value : [String(value ?? "")],
        ),
      );
      const keywordMatch = words.every((word) => haystack.includes(word));
      const singleMatch = !single || haystack.includes(single.toLowerCase());
      const multiMatch =
        !multi.length ||
        multi.some((item) => haystack.includes(item.toLowerCase()));
      return keywordMatch && singleMatch && multiMatch;
    });
  }, [multi, query, records, single]);
  return (
    <div className="page-content asset-page-v2">
      <PageHeader
        title={meta.title}
        description={meta.description}
        actions={
          <Button
            tone="primary"
            icon="plus"
            onClick={() => {
              setDraft({ name: "", company: "", note: "" });
              setCreateError("");
              setCreateOpen(true);
            }}
          >
            新建{meta.singular}
          </Button>
        }
      />
      <FilterBar
        resultText={`共 ${filtered.length} 条结果`}
        onClear={
          query || single || multi.length || date
            ? () => {
                setQuery("");
                setSingle("");
                setMulti([]);
                setDate("");
              }
            : undefined
        }
      >
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={`搜索${meta.singular}名称、公司、技能或正文`}
        />
        <Select
          width="150px"
          value={single}
          onChange={setSingle}
          placeholder="状态"
          options={[
            { value: "", label: "全部状态" },
            { value: "招聘中", label: "招聘中" },
            { value: "看机会", label: "看机会" },
            { value: "已回复", label: "已回复" },
            { value: "授权", label: "已授权" },
          ]}
        />
        <MultiSelect
          width="172px"
          values={multi}
          onChange={setMulti}
          placeholder="行业 / 方向"
          options={[
            "具身智能",
            "机器人",
            "人工智能",
            "自动驾驶",
            "半导体",
            "VLA",
          ].map((value) => ({ value, label: value }))}
        />
        <DateRange width="184px" value={date} onChange={setDate} />
      </FilterBar>
      <section className="surface asset-table-surface">
        <DataTable
          columns={columnsByKind[kind]}
          rows={filtered}
          onRowClick={(row) => navigate(`/${meta.route}/${row.id}`)}
          actions={(row) => (
            <span className="table-row-actions">
              <Button
                size="sm"
                tone="ghost"
                onClick={() => navigate(`/${meta.route}/${row.id}`)}
              >
                查看
              </Button>
              <Button
                size="sm"
                tone="dangerGhost"
                onClick={() => setDeleteRow(row)}
              >
                删除
              </Button>
            </span>
          )}
        />
        <Pagination
          page={page}
          pages={3}
          total={filtered.length || rows.length}
          onChange={setPage}
        />
      </section>
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={`新建${meta.singular}`}
        description="先填写最少必要信息，创建后可以继续补充完整资料。"
        footer={
          <>
            <Button onClick={() => setCreateOpen(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                if (!draft.name.trim()) {
                  setCreateError(`${meta.singular}名称不能为空`);
                  return;
                }
                const template = rowsByKind[kind]?.[0] || {};
                const isNamed = [
                  "candidates",
                  "companies",
                  "contacts",
                ].includes(kind);
                const created = {
                  ...template,
                  id: `prototype-${kind}-${Date.now()}`,
                  ...(isNamed
                    ? { name: draft.name.trim() }
                    : { title: draft.name.trim(), titleZh: draft.name.trim() }),
                  ...(draft.company.trim()
                    ? kind === "patents"
                      ? { assignee: draft.company.trim() }
                      : { company: draft.company.trim() }
                    : {}),
                  note: draft.note.trim(),
                  updated: "刚刚",
                };
                setRecords((current) => [created, ...current]);
                setCreateOpen(false);
                toast(`${meta.singular}已创建`);
              }}
            >
              创建
            </Button>
          </>
        }
      >
        <div className="form-grid">
          <Input
            label={`${meta.singular}名称 *`}
            placeholder={`输入${meta.singular}名称`}
            value={draft.name}
            onChange={(event) => {
              setDraft((current) => ({
                ...current,
                name: event.target.value,
              }));
              setCreateError("");
            }}
            error={createError}
          />
          <Input
            label="所属公司"
            placeholder="输入公司名称"
            value={draft.company}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                company: event.target.value,
              }))
            }
          />
          <Textarea
            label="补充信息"
            placeholder="输入已知信息、备注或来源"
            value={draft.note}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                note: event.target.value,
              }))
            }
          />
        </div>
      </Modal>
      <Modal
        open={Boolean(deleteRow)}
        onClose={() => setDeleteRow(null)}
        title={`删除${meta.singular}`}
        description={`确认删除“${deleteRow?.name || deleteRow?.title || ""}”？关联数据不会被自动删除。`}
        danger
        footer={
          <>
            <Button onClick={() => setDeleteRow(null)}>取消</Button>
            <Button
              tone="danger"
              onClick={() => {
                setRecords((current) =>
                  current.filter((item) => item.id !== deleteRow?.id),
                );
                setDeleteRow(null);
                toast(`${meta.singular}已删除`);
              }}
            >
              删除
            </Button>
          </>
        }
      >
        <p className="modal-warning-copy">
          删除后该记录将不再出现在列表中。这个原型会保留其他资产和历史记录，便于检查删除边界。
        </p>
      </Modal>
    </div>
  );
}

function DetailHeader({ title, subtitle, status, back, actions }) {
  return (
    <PageHeader
      title={title}
      description={subtitle}
      back={back}
      status={status && <Status tone="info">{status}</Status>}
      actions={actions}
    />
  );
}

function InfoGrid({ items }) {
  return (
    <dl className="info-grid-v2">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

function InfoSection({ title, children, actions }) {
  return (
    <section className="detail-section-v2">
      <header>
        <h2>{title}</h2>
        {actions}
      </header>
      <div>{children}</div>
    </section>
  );
}

function EditDeleteActions({ onEdit, onDelete, primary }) {
  return (
    <>
      <Button icon="edit" onClick={onEdit}>
        编辑
      </Button>
      {primary}
      <Button tone="dangerGhost" icon="trash" onClick={onDelete}>
        删除
      </Button>
    </>
  );
}

function StandardEditModal({ open, close, title, children }) {
  const toast = useToast();
  return (
    <Modal
      open={open}
      onClose={close}
      title={title}
      size="lg"
      footer={
        <>
          <Button onClick={close}>取消</Button>
          <Button
            tone="primary"
            onClick={() => {
              close();
              toast("修改已保存");
            }}
          >
            保存
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}

function CandidateDetailV2({ candidate }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState("profile");
  const [edit, setEdit] = useState(false);
  const [remove, setRemove] = useState(false);
  const [enrich, setEnrich] = useState(false);
  const tabs = [
    { value: "profile", label: "基本资料" },
    { value: "experience", label: "履历与项目" },
    { value: "followups", label: "跟进记录" },
    { value: "academic", label: "论文与专利" },
    { value: "matches", label: "匹配记录" },
  ];
  return (
    <div className="page-content asset-detail-v2">
      <DetailHeader
        title={candidate.name}
        subtitle={`${candidate.company} · ${candidate.title} · ${candidate.location}`}
        status={candidate.jobStatus}
        back={() => navigate("/candidates")}
        actions={
          <EditDeleteActions
            onEdit={() => setEdit(true)}
            onDelete={() => setRemove(true)}
            primary={
              <Button
                tone="primary"
                icon="sparkles"
                onClick={() => setEnrich(true)}
              >
                信息补全
              </Button>
            }
          />
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        items={tabs}
        counts={{
          followups: candidate.followups?.length || 0,
          academic:
            (candidate.papers?.length || 0) + (candidate.patents?.length || 0),
          matches: candidate.matches?.length || 0,
        }}
      />
      {tab === "profile" && (
        <div className="detail-columns-v2">
          <div>
            <InfoSection title="基本信息">
              <InfoGrid
                items={[
                  ["电话", candidate.phone],
                  ["邮箱", candidate.email],
                  ["当前职级", candidate.level],
                  ["工作年限", `${candidate.years} 年`],
                  ["学历", candidate.education],
                  ["出生年份", candidate.birthYear],
                  ["期望薪资", candidate.expectedSalary],
                  ["数据来源", candidate.source],
                ]}
              />
            </InfoSection>
            <InfoSection title="AI 摘要">
              <p className="rich-copy">{candidate.summary}</p>
            </InfoSection>
            <InfoSection title="关键技能与行业">
              <TagList
                items={[
                  ...(candidate.skills || []),
                  ...(candidate.industries || []),
                ]}
              />
            </InfoSection>
          </div>
          <div>
            <InfoSection title="公开资料链接">
              <div className="link-list-v2">
                {candidate.publicLinks?.map(([label, url]) => (
                  <a href={url} target="_blank" rel="noreferrer" key={label}>
                    <Icon name="link" />
                    <span>
                      <b>{label}</b>
                      <small>{url}</small>
                    </span>
                  </a>
                )) || <p>暂无公开资料链接</p>}
              </div>
            </InfoSection>
            <InfoSection title="当前岗位推进">
              <div className="mini-record">
                <Status tone="info">{candidate.stage}</Status>
                <b>具身智能 VLA 算法负责人</b>
                <small>星澜机器人 · 最近更新 {candidate.updated}</small>
              </div>
            </InfoSection>
          </div>
        </div>
      )}
      {tab === "experience" && (
        <div className="detail-stack-v2">
          <InfoSection title="工作经历">
            <div className="timeline-v2">
              {candidate.workHistory?.map((item) => (
                <article key={`${item.company}-${item.period}`}>
                  <span>{item.period}</span>
                  <div>
                    <h3>
                      {item.company} · {item.title}
                    </h3>
                    <small>
                      汇报对象：{item.reportTo} · 团队规模：{item.teamSize}
                    </small>
                    <p>{item.description}</p>
                  </div>
                </article>
              )) || <p>暂无结构化工作经历。</p>}
            </div>
          </InfoSection>
          <InfoSection title="项目经历">
            <div className="project-grid-v2">
              {candidate.projects?.map((item) => (
                <article key={item.name}>
                  <header>
                    <h3>{item.name}</h3>
                    <Status>{item.role}</Status>
                  </header>
                  <small>
                    {item.period} · {item.scale}
                  </small>
                  <p>{item.description}</p>
                  <ul>
                    {item.achievements?.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                  <TagList items={item.tech} />
                </article>
              )) || <p>暂无结构化项目经历。</p>}
            </div>
          </InfoSection>
          <InfoSection title="教育经历">
            <DataTable
              columns={[
                { key: "school", label: "学校" },
                { key: "degree", label: "学历" },
                { key: "major", label: "专业" },
                { key: "period", label: "时间" },
              ]}
              rows={(candidate.educationHistory || []).map((item, index) => ({
                ...item,
                id: `${index}`,
              }))}
            />
          </InfoSection>
        </div>
      )}
      {tab === "followups" && (
        <InfoSection
          title="跟进记录"
          actions={
            <Button icon="plus" onClick={() => toast("已打开新增跟进记录")}>
              新增记录
            </Button>
          }
        >
          <div className="timeline-v2 followup-timeline">
            {candidate.followups?.map(([time, content, owner]) => (
              <article key={time}>
                <span>{time}</span>
                <div>
                  <p>{content}</p>
                  <small>记录人：{owner}</small>
                </div>
              </article>
            ))}
          </div>
        </InfoSection>
      )}
      {tab === "academic" && (
        <div className="detail-columns-v2">
          <InfoSection title="相关论文">
            <RelationRows
              rows={candidate.papers}
              columns={["论文", "年份", "刊物", "作者身份"]}
            />
          </InfoSection>
          <InfoSection title="相关专利">
            <RelationRows
              rows={candidate.patents}
              columns={["专利", "公开号", "申请日", "发明人身份"]}
            />
          </InfoSection>
        </div>
      )}
      {tab === "matches" && (
        <InfoSection title="人岗匹配记录">
          <RelationRows
            rows={candidate.matches}
            columns={["岗位", "公司", "匹配分", "流程", "更新时间"]}
            onRow={() => navigate("/matching/vla-lead")}
          />
        </InfoSection>
      )}
      <StandardEditModal
        open={edit}
        close={() => setEdit(false)}
        title={`编辑候选人 · ${candidate.name}`}
      >
        <div className="form-grid">
          <Input label="姓名" defaultValue={candidate.name} />
          <Input label="当前公司" defaultValue={candidate.company} />
          <Input label="当前职位" defaultValue={candidate.title} />
          <Input label="地点" defaultValue={candidate.location} />
          <Textarea label="AI 摘要" defaultValue={candidate.summary} />
        </div>
      </StandardEditModal>
      <Modal
        open={enrich}
        onClose={() => setEnrich(false)}
        title="启动候选人信息补全"
        description="Hunter 将使用已有资料和公开网络生成待审核建议，不会直接覆盖候选人。"
        footer={
          <>
            <Button onClick={() => setEnrich(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setEnrich(false);
                navigate(
                  "/workstreams/career-linhao/career?scene=profile-diff",
                );
              }}
            >
              创建任务
            </Button>
          </>
        }
      >
        <InfoGrid
          items={[
            ["候选人", candidate.name],
            ["已有识别信息", `${candidate.company}、${candidate.email}`],
            ["结果去向", "当前候选人资料审核"],
          ]}
        />
      </Modal>
      <DeleteModal
        open={remove}
        close={() => setRemove(false)}
        name={candidate.name}
        kind="候选人"
        onConfirm={() => navigate("/candidates")}
      />
    </div>
  );
}

function RelationRows({ rows = [], columns, onRow }) {
  if (!rows?.length) return <p className="empty-copy">暂无关联数据</p>;
  return (
    <div className="relation-rows-v2">
      {rows.map((row, index) => (
        <button type="button" key={`${row[0]}-${index}`} onClick={onRow}>
          <span>
            {columns.map((column, itemIndex) => (
              <span key={column}>
                <small>{column}</small>
                <b>{row[itemIndex]}</b>
              </span>
            ))}
          </span>
          <Icon name="chevronRight" />
        </button>
      ))}
    </div>
  );
}

function DeleteModal({ open, close, name, kind, onConfirm }) {
  const toast = useToast();
  return (
    <Modal
      open={open}
      onClose={close}
      danger
      title={`删除${kind}`}
      description={`确认删除“${name}”？`}
      footer={
        <>
          <Button onClick={close}>取消</Button>
          <Button
            tone="danger"
            onClick={() => {
              close();
              toast(`${kind}已删除`);
              onConfirm?.();
            }}
          >
            删除
          </Button>
        </>
      }
    >
      <p className="modal-warning-copy">
        删除前请确认关联数据和历史记录已经处理。这个操作不会删除其他业务资产。
      </p>
    </Modal>
  );
}

function PipelineBoardV2({ position }) {
  const toast = useToast();
  const [cards, setCards] = useState(pipelineCards);
  const [move, setMove] = useState(null);
  const stages = position.stages || [];
  const moveCard = () => {
    setCards((current) =>
      current.map((item) =>
        item.candidateId === move.card.candidateId
          ? { ...item, stage: move.stage }
          : item,
      ),
    );
    setMove(null);
    toast("候选人流程已更新");
  };
  return (
    <>
      <div className="pipeline-board-v2">
        {stages.slice(0, 7).map(([stage, type]) => (
          <section className={`pipeline-column is-${type}`} key={stage}>
            <header>
              <b>{stage}</b>
              <span>{cards.filter((card) => card.stage === stage).length}</span>
            </header>
            <div>
              {cards
                .filter((card) => card.stage === stage)
                .map((card) => {
                  const person = candidateRows.find(
                    (item) => item.id === card.candidateId,
                  );
                  return (
                    <article
                      draggable
                      onDragStart={(event) =>
                        event.dataTransfer.setData(
                          "candidate",
                          card.candidateId,
                        )
                      }
                      key={card.candidateId}
                    >
                      <b>{person?.name}</b>
                      <small>
                        {person?.company} · {person?.title}
                      </small>
                      <p>{card.note}</p>
                      <Button
                        size="sm"
                        tone="ghost"
                        onClick={() => setMove({ card, stage })}
                      >
                        推进
                      </Button>
                    </article>
                  );
                })}
              <button
                className="pipeline-drop"
                type="button"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  const id = event.dataTransfer.getData("candidate");
                  const card = cards.find((item) => item.candidateId === id);
                  if (card) setMove({ card, stage });
                }}
              >
                拖到这里进入该阶段
              </button>
            </div>
          </section>
        ))}
      </div>
      <Modal
        open={Boolean(move)}
        onClose={() => setMove(null)}
        title="推进候选人"
        description={`${candidateRows.find((item) => item.id === move?.card.candidateId)?.name || "候选人"} → ${move?.stage || ""}`}
        footer={
          <>
            <Button onClick={() => setMove(null)}>取消</Button>
            <Button tone="primary" onClick={moveCard}>
              确认推进
            </Button>
          </>
        }
      >
        <Textarea label="推进备注 *" defaultValue={move?.card.note || ""} />
      </Modal>
    </>
  );
}

function PositionDetailV2({ position }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState("overview");
  const [edit, setEdit] = useState(false);
  const [analyse, setAnalyse] = useState(false);
  const [remove, setRemove] = useState(false);
  const [stageEdit, setStageEdit] = useState(false);
  const [updateJd, setUpdateJd] = useState("no");
  return (
    <div className="page-content asset-detail-v2">
      <DetailHeader
        title={position.title}
        subtitle={`${position.company} · ${position.location} · ${position.salary}`}
        status={position.state}
        back={() => navigate("/positions")}
        actions={
          <EditDeleteActions
            onEdit={() => setEdit(true)}
            onDelete={() => setRemove(true)}
            primary={
              <Button
                tone="primary"
                icon="sparkles"
                onClick={() => setAnalyse(true)}
              >
                AI 解析岗位
              </Button>
            }
          />
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "overview", label: "岗位信息" },
          { value: "analysis", label: "岗位解析" },
          { value: "pipeline", label: "推进流程" },
          { value: "sourcing", label: "自动寻访" },
          { value: "matching", label: "人岗匹配" },
        ]}
        counts={{ pipeline: position.active, matching: position.matchCount }}
      />
      {tab === "overview" && (
        <div className="detail-columns-v2">
          <InfoSection title="基本信息">
            <InfoGrid
              items={[
                ["公司", position.company],
                ["工作地点", position.location],
                ["薪资", position.salary],
                ["招聘人数", `${position.headcount} 人`],
                ["最低年限", `${position.minYears} 年`],
                ["学历", position.education],
                ["学历放宽", position.degreePolicy],
                ["寻访状态", position.sourcing],
              ]}
            />
            <h3 className="subsection-title">关键技能</h3>
            <TagList items={position.skills} />
          </InfoSection>
          <InfoSection title="岗位 JD">
            <pre className="jd-copy">{position.jd || "暂无完整岗位 JD"}</pre>
          </InfoSection>
        </div>
      )}
      {tab === "analysis" && (
        <div className="analysis-sections-v2">
          {Object.entries({
            positioning: "岗位定位",
            upstream: "上下游关系",
            transferable: "可迁移方向",
            targetCompanies: "对标企业",
            targetLevels: "目标职级",
            culture: "文化偏好",
            extra: "补充条件",
            hidden: "软性和隐性要求",
            keywords: "自动寻访关键词",
          }).map(([key, label]) => (
            <InfoSection
              key={key}
              title={label}
              actions={
                key === "keywords" ? (
                  <Button size="sm" onClick={() => setEdit(true)}>
                    编辑
                  </Button>
                ) : null
              }
            >
              {Array.isArray(position.analysis?.[key]) ? (
                <TagList items={position.analysis[key]} />
              ) : (
                <p className="rich-copy">
                  {position.analysis?.[key] || "暂无解析结果"}
                </p>
              )}
            </InfoSection>
          ))}
        </div>
      )}
      {tab === "pipeline" && (
        <>
          <div className="section-toolbar-v2">
            <div>
              <h2>候选人推进</h2>
              <p>
                拖拽或点击推进候选人；每次变更都需要填写备注并进入跟进记录。
              </p>
            </div>
            <Button icon="edit" onClick={() => setStageEdit(true)}>
              编辑流程
            </Button>
          </div>
          <PipelineBoardV2 position={position} />
        </>
      )}
      {tab === "sourcing" && (
        <div className="detail-columns-v2">
          <InfoSection title="自动寻访配置">
            <InfoGrid
              items={[
                ["平台", "猎聘、脉脉"],
                ["关键词组", `${position.analysis?.keywords?.length || 0} 组`],
                ["匹配分数线", "70 分"],
                ["工作时间", "全天运行"],
              ]}
            />
            <Button
              onClick={() =>
                navigate(
                  "/workstreams/position-vla/position?scene=platform-permission",
                )
              }
            >
              在业务主线中查看
            </Button>
          </InfoSection>
          <InfoSection title="寻访关键词">
            <RelationRows
              rows={(position.analysis?.keywords || []).map((item, index) => [
                `第 ${index + 1} 组`,
                item,
                "任一关键词",
              ])}
              columns={["条件", "关键词", "关系"]}
            />
          </InfoSection>
        </div>
      )}
      {tab === "matching" && (
        <div className="matching-summary-v2">
          <article>
            <strong>{position.matchCount}</strong>
            <span>已完成匹配</span>
          </article>
          <article>
            <strong>{position.reserve}</strong>
            <span>岗位储备</span>
          </article>
          <article>
            <strong>{position.active}</strong>
            <span>推进中</span>
          </article>
          <article>
            <strong>{position.failed}</strong>
            <span>失败</span>
          </article>
          <div>
            <Button
              tone="primary"
              icon="sparkles"
              onClick={() => navigate(`/matching/${position.id}`)}
            >
              查看匹配结果
            </Button>
            <Button onClick={() => toast("全量人岗匹配任务已开始", "info")}>
              重新全量匹配
            </Button>
          </div>
        </div>
      )}
      <StandardEditModal
        open={edit}
        close={() => setEdit(false)}
        title={`编辑岗位 · ${position.title}`}
      >
        <div className="form-grid">
          <Input label="岗位名称" defaultValue={position.title} />
          <Input label="公司" defaultValue={position.company} />
          <Input label="地点" defaultValue={position.location} />
          <Input label="薪资" defaultValue={position.salary} />
          <Textarea label="岗位 JD" defaultValue={position.jd} />
          <Textarea
            label="自动寻访关键词"
            defaultValue={position.analysis?.keywords?.join("\n")}
          />
        </div>
      </StandardEditModal>
      <Modal
        open={analyse}
        onClose={() => setAnalyse(false)}
        title="AI 解析岗位"
        description="Agent 会联网调研并给出岗位信息建议，确认后才更新岗位。"
        footer={
          <>
            <Button onClick={() => setAnalyse(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setAnalyse(false);
                navigate(
                  "/workstreams/position-vla/position?scene=position-analysis",
                );
              }}
            >
              创建任务
            </Button>
          </>
        }
      >
        <div className="form-grid">
          <Textarea
            label="岗位补充说明 *"
            placeholder="例如：汇报对象、业务阶段、客户特别关注的背景和不希望触达的公司"
          />
          <Select
            label="是否更新岗位 JD"
            value={updateJd}
            onChange={setUpdateJd}
            options={[
              { value: "no", label: "保持当前 JD" },
              { value: "yes", label: "同时更新 JD" },
            ]}
          />
          {updateJd === "yes" && (
            <Textarea
              label="新版 JD 的说明 *"
              placeholder="说明需要补充或改写的岗位职责、要求和背景信息"
            />
          )}
        </div>
      </Modal>
      <Modal
        open={stageEdit}
        onClose={() => setStageEdit(false)}
        title="编辑岗位推进流程"
        size="lg"
        footer={
          <>
            <Button onClick={() => setStageEdit(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setStageEdit(false);
                toast("推进流程已保存");
              }}
            >
              保存流程
            </Button>
          </>
        }
      >
        <div className="stage-editor-v2">
          {position.stages?.map(([name, type], index) => (
            <div key={name}>
              <span>{index + 1}</span>
              <Input defaultValue={name} />
              <Status
                tone={
                  type === "failed"
                    ? "danger"
                    : type === "joined"
                      ? "success"
                      : "info"
                }
              >
                {type}
              </Status>
              <Button size="sm" tone="ghost">
                调整顺序
              </Button>
            </div>
          ))}
        </div>
      </Modal>
      <DeleteModal
        open={remove}
        close={() => setRemove(false)}
        name={position.title}
        kind="岗位"
        onConfirm={() => navigate("/positions")}
      />
    </div>
  );
}

function CompanyDetailV2({ company }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState("profile");
  const [edit, setEdit] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [remove, setRemove] = useState(false);
  const [tablePages, setTablePages] = useState({
    progress: 1,
    contacts: 1,
    positions: 1,
    candidates: 1,
  });
  const companyContacts = contactRows.filter(
    (item) => item.company === company.name,
  );
  const companyPositions = positionRows.filter(
    (item) => item.company === company.name,
  );
  const relatedCandidates = candidateRows.filter(
    (item) =>
      item.company.includes(company.name.slice(0, 2)) ||
      ["lin-hao", "han-siyu", "zhao-xingyu"].includes(item.id),
  );
  return (
    <div className="page-content asset-detail-v2">
      <DetailHeader
        title={company.name}
        subtitle={company.industries?.join(" · ")}
        back={() => navigate("/companies")}
        actions={
          <EditDeleteActions
            onEdit={() => setEdit(true)}
            onDelete={() => setRemove(true)}
            primary={
              <Button
                tone="primary"
                icon="route"
                onClick={() => navigate("/workstreams/client-xinglan/client")}
              >
                客户开发
              </Button>
            }
          />
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "profile", label: "公司资料" },
          { value: "progress", label: "推进情况" },
          { value: "contacts", label: "联系人" },
          { value: "positions", label: "关联岗位" },
          { value: "candidates", label: "关联候选人" },
        ]}
        counts={{
          contacts: company.contactCount,
          positions: company.positionCount,
          candidates: company.candidateCount,
        }}
      />
      {tab === "profile" && (
        <div className="analysis-sections-v2">
          {[
            ["公司简介", company.intro],
            ["融资情况", company.funding],
            ["人才吸引力", company.talentAttraction],
            ["薪资结构和福利", company.compensation],
            ["一般面试流程", company.interview],
            ["Base 地点与业务", company.locations],
            ["其他要求", company.requirements],
            ["备注", company.remarks],
          ].map(([title, value]) => (
            <InfoSection title={title} key={title}>
              <p className="rich-copy preserve-lines">{value || "暂无信息"}</p>
            </InfoSection>
          ))}
          <InfoSection title="公司匹配规则">
            <TagList items={[company.name, ...(company.matchTerms || [])]} />
          </InfoSection>
        </div>
      )}
      {tab === "progress" && (
        <>
          <div className="progress-cards-v2">
            {[
              ["储备", 12, "neutral"],
              ["推进中", company.activeCount, "info"],
              ["已入职", 2, "success"],
              ["失败", 5, "danger"],
            ].map(([label, value, tone]) => (
              <article key={label}>
                <Status tone={tone}>{label}</Status>
                <strong>{value}</strong>
                <small>位候选人</small>
              </article>
            ))}
          </div>
          <InfoSection title="候选人推进">
            <DataTable
              columns={[
                { key: "name", label: "候选人" },
                { key: "title", label: "当前职位" },
                { key: "position", label: "申请岗位" },
                {
                  key: "stage",
                  label: "流程",
                  render: (value) => <Status tone="info">{value}</Status>,
                },
                { key: "updated", label: "更新时间" },
              ]}
              rows={relatedCandidates.map((item) => ({
                ...item,
                position: positionRows[0].title,
              }))}
              onRowClick={(row) => navigate(`/candidates/${row.id}`)}
            />
            <Pagination
              page={tablePages.progress}
              pages={3}
              total={31}
              onChange={(value) =>
                setTablePages((current) => ({ ...current, progress: value }))
              }
            />
          </InfoSection>
        </>
      )}
      {tab === "contacts" && (
        <InfoSection
          title="联系人"
          actions={
            <Button icon="plus" onClick={() => setContactOpen(true)}>
              添加联系人
            </Button>
          }
        >
          <DataTable
            columns={columnsByKind.contacts.slice(0, 6)}
            rows={companyContacts}
            onRowClick={(row) => navigate(`/contacts/${row.id}`)}
          />
          <Pagination
            page={tablePages.contacts}
            pages={2}
            total={company.contactCount}
            onChange={(value) =>
              setTablePages((current) => ({ ...current, contacts: value }))
            }
          />
        </InfoSection>
      )}
      {tab === "positions" && (
        <InfoSection title="关联岗位">
          <DataTable
            columns={columnsByKind.positions.slice(0, 6)}
            rows={companyPositions}
            onRowClick={(row) => navigate(`/positions/${row.id}`)}
          />
          <Pagination
            page={tablePages.positions}
            pages={2}
            total={company.positionCount}
            onChange={(value) =>
              setTablePages((current) => ({ ...current, positions: value }))
            }
          />
        </InfoSection>
      )}
      {tab === "candidates" && (
        <InfoSection
          title="关联候选人"
          actions={
            <Button icon="plus" onClick={() => toast("已打开手动关联候选人")}>
              手动关联
            </Button>
          }
        >
          <DataTable
            columns={columnsByKind.candidates.slice(0, 7)}
            rows={relatedCandidates}
            onRowClick={(row) => navigate(`/candidates/${row.id}`)}
          />
          <Pagination
            page={tablePages.candidates}
            pages={4}
            total={company.candidateCount}
            onChange={(value) =>
              setTablePages((current) => ({ ...current, candidates: value }))
            }
          />
        </InfoSection>
      )}
      <StandardEditModal
        open={edit}
        close={() => setEdit(false)}
        title={`编辑公司资料 · ${company.name}`}
      >
        <div className="form-grid">
          <Input label="公司名称" defaultValue={company.name} />
          <Input
            label="行业标签"
            defaultValue={company.industries?.join("、")}
          />
          <Textarea label="公司简介" defaultValue={company.intro} />
          <Textarea label="融资情况" defaultValue={company.funding} />
          <Textarea
            label="人才吸引力"
            defaultValue={company.talentAttraction}
          />
          <Textarea
            label="匹配字符串"
            defaultValue={company.matchTerms?.join("\n")}
          />
        </div>
      </StandardEditModal>
      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="添加联系人"
        footer={
          <>
            <Button onClick={() => setContactOpen(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setContactOpen(false);
                toast("联系人已添加");
              }}
            >
              添加
            </Button>
          </>
        }
      >
        <div className="form-grid">
          <Input label="姓名 *" placeholder="输入联系人姓名" />
          <Input label="角色" placeholder="例如：研发招聘负责人" />
          <Input label="电话" />
          <Input label="邮箱" />
          <Textarea label="备注" />
        </div>
      </Modal>
      <DeleteModal
        open={remove}
        close={() => setRemove(false)}
        name={company.name}
        kind="公司"
        onConfirm={() => navigate("/companies")}
      />
    </div>
  );
}

function ContactDetailV2({ contact }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [edit, setEdit] = useState(false);
  return (
    <div className="page-content asset-detail-v2">
      <DetailHeader
        title={contact.name}
        subtitle={`${contact.company} · ${contact.role}`}
        status={contact.contactStatus}
        back={() => navigate("/contacts")}
        actions={
          <>
            <Button onClick={() => setEdit(true)}>编辑</Button>
            <Button
              tone="primary"
              icon="message"
              onClick={() => toast("沟通草稿已创建", "info")}
            >
              开始沟通
            </Button>
          </>
        }
      />
      <div className="detail-columns-v2">
        <InfoSection title="联系方式">
          <InfoGrid
            items={[
              ["电话", contact.phone],
              ["邮箱", contact.email],
              ["沟通渠道", contact.channels.join("、")],
              ["核验状态", contact.verified],
              ["关联候选人", contact.linkedCandidate],
              ["最近沟通", contact.recent],
            ]}
          />
        </InfoSection>
        <InfoSection title="备注">
          <p className="rich-copy">{contact.note}</p>
        </InfoSection>
        <InfoSection title="沟通记录">
          <div className="timeline-v2">
            <article>
              <span>{contact.recent}</span>
              <div>
                <p>
                  确认当前负责研发和产品招聘，后续通过工作邮箱发送岗位概要。
                </p>
                <small>沈岚</small>
              </div>
            </article>
            <article>
              <span>8 月 12 日</span>
              <div>
                <p>首次核验公开联系方式和公司角色。</p>
                <small>Hunter</small>
              </div>
            </article>
          </div>
        </InfoSection>
      </div>
      <StandardEditModal
        open={edit}
        close={() => setEdit(false)}
        title={`编辑联系人 · ${contact.name}`}
      >
        <div className="form-grid">
          <Input label="姓名" defaultValue={contact.name} />
          <Input label="角色" defaultValue={contact.role} />
          <Input label="电话" defaultValue={contact.phone} />
          <Input label="邮箱" defaultValue={contact.email} />
          <Textarea label="备注" defaultValue={contact.note} />
        </div>
      </StandardEditModal>
    </div>
  );
}

function AcademicDetailV2({ item, kind }) {
  const navigate = useNavigate();
  const toast = useToast();
  const isPaper = kind === "paper";
  const [linkOpen, setLinkOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [linkedCandidates, setLinkedCandidates] = useState(
    item.relatedCandidates,
  );
  return (
    <div className="page-content asset-detail-v2">
      <DetailHeader
        title={item.titleZh || item.title}
        subtitle={isPaper ? item.title : item.publicationNo}
        status={isPaper ? item.venue : item.status}
        back={() => navigate(isPaper ? "/papers" : "/patents")}
        actions={
          <>
            <Button onClick={() => setEdit(true)}>编辑</Button>
            <Button
              tone="primary"
              icon="users"
              onClick={() => setLinkOpen(true)}
            >
              关联候选人
            </Button>
          </>
        }
      />
      <div className="detail-columns-v2">
        <InfoSection title={isPaper ? "论文信息" : "专利信息"}>
          <InfoGrid
            items={
              isPaper
                ? [
                    ["年份", item.year],
                    ["刊物", item.venue],
                    ["被引次数", item.citations],
                    ["DOI", item.doi],
                    ["来源", item.sources.join("、")],
                    ["作者机构", item.institutions.join("、")],
                  ]
                : [
                    ["公开号", item.publicationNo],
                    ["申请日", item.filingDate],
                    ["授权日", item.grantDate],
                    ["类型", item.patentType],
                    ["权利人", item.assignee],
                    ["状态", item.status],
                  ]
            }
          />
          <h3 className="subsection-title">标签</h3>
          <TagList items={item.tags} />
        </InfoSection>
        <InfoSection title={isPaper ? "作者" : "发明人"}>
          <div className="person-list-v2">
            {(isPaper ? item.authors : item.inventors).map((name) => (
              <article key={name}>
                <span>{name.slice(0, 1)}</span>
                <div>
                  <b>{name}</b>
                  <small>
                    {isPaper ? item.institutions[0] : item.assignee}
                  </small>
                </div>
                <Status
                  tone={linkedCandidates.includes(name) ? "success" : "neutral"}
                >
                  {linkedCandidates.includes(name) ? "已关联" : "待确认"}
                </Status>
              </article>
            ))}
          </div>
        </InfoSection>
      </div>
      <InfoSection title={isPaper ? "摘要" : "专利摘要"}>
        <p className="rich-copy">{item.abstractZh || item.abstract}</p>
        {isPaper && <p className="rich-copy secondary-copy">{item.abstract}</p>}
      </InfoSection>
      <InfoSection title="关联候选人">
        <div className="linked-people-v2">
          {linkedCandidates.map((name) => {
            const candidate = candidateRows.find(
              (entry) => entry.name === name,
            );
            return (
              <button
                key={name}
                onClick={() =>
                  candidate && navigate(`/candidates/${candidate.id}`)
                }
              >
                <Icon name="user" />
                <span>
                  <b>{name}</b>
                  <small>打开候选人详情</small>
                </span>
                <Icon name="chevronRight" />
              </button>
            );
          })}
        </div>
      </InfoSection>
      <Modal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        title="关联候选人"
        footer={
          <>
            <Button onClick={() => setLinkOpen(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setLinkOpen(false);
                toast("候选人关联已更新");
              }}
            >
              确认关联
            </Button>
          </>
        }
      >
        <MultiSelect
          label="选择候选人"
          values={linkedCandidates}
          onChange={setLinkedCandidates}
          options={candidateRows.map((candidate) => ({
            value: candidate.name,
            label: `${candidate.name} · ${candidate.company}`,
          }))}
        />
      </Modal>
      <StandardEditModal
        open={edit}
        close={() => setEdit(false)}
        title={`编辑${isPaper ? "论文" : "专利"}`}
      >
        <div className="form-grid">
          <Input label="标题" defaultValue={item.title} />
          <Input
            label={isPaper ? "DOI" : "公开号"}
            defaultValue={isPaper ? item.doi : item.publicationNo}
          />
          <Textarea
            label="摘要"
            defaultValue={item.abstractZh || item.abstract}
          />
        </div>
      </StandardEditModal>
    </div>
  );
}

export function MatchReviewPageV2() {
  const navigate = useNavigate();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [decision, setDecision] = useState({});
  const [recommendation, setRecommendation] = useState("all");
  const [roleGates, setRoleGates] = useState([]);
  const [page, setPage] = useState(1);
  const position = positionRows[0];
  const recommendationValues = {
    strong: "强烈建议",
    conditional: "有条件推荐",
    reject: "不建议",
  };
  const roleGateValues = {
    pass: "通过",
    conditional: "有条件通过",
    reject: "拒绝",
  };
  const rows = matchResults.filter((item) => {
    const candidate = candidateRows.find(
      (entry) => entry.id === item.candidateId,
    );
    const queryMatch = candidate?.name.includes(query);
    const recommendationMatch =
      recommendation === "all" ||
      item.recommendation === recommendationValues[recommendation];
    const roleGateMatch =
      !roleGates.length ||
      roleGates.some((value) => item.roleGate === roleGateValues[value]);
    return queryMatch && recommendationMatch && roleGateMatch;
  });
  return (
    <div className="page-content match-review-page-v2">
      <DetailHeader
        title={`人岗匹配 · ${position.title}`}
        subtitle={`${position.company} · 本次共 48 位候选人，按综合匹配分排序`}
        back={() => navigate(`/positions/${position.id}`)}
        actions={
          <>
            <Button onClick={() => toast("完整匹配结果已导出")}>
              导出结果
            </Button>
            <Button tone="primary" onClick={() => toast("已应用当前页决定")}>
              应用当前决定
            </Button>
          </>
        }
      />
      <FilterBar resultText={`当前显示 ${rows.length} 位重点候选人`}>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="搜索候选人"
        />
        <Select
          width="156px"
          value={recommendation}
          onChange={setRecommendation}
          options={[
            { value: "all", label: "全部建议" },
            { value: "strong", label: "强烈建议" },
            { value: "conditional", label: "有条件推荐" },
            { value: "reject", label: "不建议" },
          ]}
        />
        <MultiSelect
          width="168px"
          values={roleGates}
          onChange={setRoleGates}
          placeholder="角色门禁"
          options={[
            { value: "pass", label: "通过" },
            { value: "conditional", label: "有条件通过" },
            { value: "reject", label: "拒绝" },
          ]}
        />
      </FilterBar>
      <div className="match-grid-v2">
        {rows.map((result) => {
          const candidate = candidateRows.find(
            (item) => item.id === result.candidateId,
          );
          return (
            <article
              className={`match-card-v2 is-${result.recommendation}`}
              key={result.candidateId}
            >
              <header>
                <button onClick={() => navigate(`/candidates/${candidate.id}`)}>
                  <span>{candidate.name.slice(0, 1)}</span>
                  <span>
                    <b>{candidate.name}</b>
                    <small>
                      {candidate.company} · {candidate.title}
                    </small>
                  </span>
                </button>
                <div>
                  <strong>{result.score}</strong>
                  <small>综合匹配分</small>
                </div>
              </header>
              <div className="match-status-row">
                <Status
                  tone={
                    result.recommendation === "不建议"
                      ? "danger"
                      : result.recommendation === "强烈建议"
                        ? "success"
                        : "warning"
                  }
                >
                  {result.recommendation}
                </Status>
                <Status tone={result.roleGate === "拒绝" ? "danger" : "info"}>
                  角色门禁：{result.roleGate}
                </Status>
              </div>
              <div className="score-bars-v2">
                {result.scoreParts.map(([label, score]) => (
                  <span key={label}>
                    <span>
                      <b>{label}</b>
                      <em>{score}</em>
                    </span>
                    <i>
                      <i style={{ width: `${score}%` }} />
                    </i>
                  </span>
                ))}
              </div>
              <section>
                <h3>推荐理由</h3>
                <ul>
                  {result.reasons.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section className="risk-section">
                <h3>风险提示</h3>
                <ul>
                  {result.risks.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <p className="match-suggestion">
                <b>建议动作：</b>
                {result.suggestion}
              </p>
              <footer>
                <Select
                  width="170px"
                  value={decision[result.candidateId] || ""}
                  onChange={(value) =>
                    setDecision((current) => ({
                      ...current,
                      [result.candidateId]: value,
                    }))
                  }
                  placeholder="选择处理结果"
                  options={[
                    { value: "contact", label: "进入联系名单" },
                    { value: "reserve", label: "加入岗位储备" },
                    { value: "observe", label: "保留观察" },
                    { value: "reject", label: "标记不合适" },
                  ]}
                />
                <Button onClick={() => navigate(`/candidates/${candidate.id}`)}>
                  查看完整资料
                </Button>
              </footer>
            </article>
          );
        })}
      </div>
      {!rows.length && (
        <EmptyState
          title="没有符合条件的候选人"
          description="调整搜索、推荐建议或角色门禁后再查看。"
        />
      )}
      <Pagination page={page} pages={12} total={48} onChange={setPage} />
    </div>
  );
}

export function AssetDetailPageV2({ kind }) {
  const { id } = useParams();
  const collectionKey = {
    candidate: "candidates",
    position: "positions",
    company: "companies",
    contact: "contacts",
    paper: "papers",
    patent: "patents",
  }[kind];
  const data =
    rowsByKind[collectionKey]?.find((item) => item.id === id) ||
    rowsByKind[collectionKey]?.[0];
  if (!data) return null;
  if (kind === "candidate") return <CandidateDetailV2 candidate={data} />;
  if (kind === "position") return <PositionDetailV2 position={data} />;
  if (kind === "company") return <CompanyDetailV2 company={data} />;
  if (kind === "contact") return <ContactDetailV2 contact={data} />;
  return <AcademicDetailV2 item={data} kind={kind} />;
}
