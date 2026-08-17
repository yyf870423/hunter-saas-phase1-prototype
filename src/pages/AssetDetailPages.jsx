import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Drawer,
  IconButton,
  Input,
  Modal,
  MultiSelect,
  PageHeader,
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
  EvidenceList,
  InfoGrid,
  StatStrip,
  SummaryList,
  toneForStatus,
} from "../components/business";
import {
  candidates,
  companies,
  contacts,
  opportunities,
  papers,
  patents,
  positions,
  timeline,
} from "../data/demo";

const sourceEvidence = [
  {
    title: "用户确认的业务资料",
    source: "沈岚 · 今天 10:12",
    verified: true,
    icon: "user",
  },
  {
    title: "公司或个人公开页面",
    source: "今天 09:48 获取",
    verified: true,
    icon: "link",
  },
  {
    title: "Agent 整理的补充结论",
    source: "已通过 Hunter 门禁",
    verified: true,
    icon: "task",
  },
];

function DetailShell({
  type,
  title,
  description,
  status,
  listRoute,
  children,
  editTitle = "编辑资料",
  onPrimary,
  primaryLabel,
  secondary,
}) {
  const navigate = useNavigate();
  const toast = useToast();
  const [edit, setEdit] = useState(false);
  const [source, setSource] = useState(false);
  return (
    <div className="page-content">
      <PageHeader
        eyebrow={type}
        title={title}
        description={description}
        status={
          status && <Status tone={toneForStatus(status)}>{status}</Status>
        }
        back={() => navigate(listRoute)}
        actions={
          <>
            {secondary}
            <Button icon="link" onClick={() => setSource(true)}>
              来源
            </Button>
            <Button icon="edit" onClick={() => setEdit(true)}>
              {editTitle}
            </Button>
            {primaryLabel && (
              <Button tone="primary" onClick={onPrimary}>
                {primaryLabel}
              </Button>
            )}
          </>
        }
      />
      {children}
      <Modal
        open={edit}
        onClose={() => setEdit(false)}
        title={editTitle}
        description={`更新“${title}”的已确认资料`}
        size="lg"
        footer={
          <>
            <Button onClick={() => setEdit(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setEdit(false);
                toast("修改已保存");
              }}
            >
              保存修改
            </Button>
          </>
        }
      >
        <div className="form-grid">
          <Input label="名称" defaultValue={title} />
          <Select
            label="可信状态"
            value="confirmed"
            onChange={() => {}}
            options={[
              { value: "confirmed", label: "用户已确认" },
              { value: "inferred", label: "系统推断" },
              { value: "conflict", label: "存在冲突" },
            ]}
          />
          <Textarea
            className="span-2"
            label="补充说明"
            defaultValue={description}
          />
          <Textarea
            className="span-2"
            label="备注"
            placeholder="仅当前工作空间可见"
          />
        </div>
      </Modal>
      <Drawer open={source} onClose={() => setSource(false)} title="来源和证据">
        <EvidenceList items={sourceEvidence} />
        <div className="privacy-note" style={{ marginTop: 16 }}>
          <Icon name="info" />
          <span>
            用户输入、平台事实、公开来源、系统推断和 Agent
            建议在正式数据中分别记录。
          </span>
        </div>
      </Drawer>
    </div>
  );
}

export function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const company = companies.find((item) => item.id === id) || companies[0];
  const [tab, setTab] = useState("profile");
  const [contactOpen, setContactOpen] = useState(false);
  const companyContacts = contacts.filter(
    (item) => item.company === company.name,
  );
  const companyPositions = positions.filter(
    (item) => item.company === company.name,
  );
  return (
    <DetailShell
      type="公司"
      title={company.name}
      description={`${company.industry} · ${company.location} · ${company.funding}`}
      status={company.hiring}
      listRoute="/companies"
      primaryLabel="创建客户开发主线"
      onPrimary={() => navigate("/workstreams/new?type=client")}
      secondary={
        <Button icon="plus" onClick={() => setContactOpen(true)}>
          添加联系人
        </Button>
      }
    >
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
      />
      {tab === "profile" && (
        <section className="page-section detail-layout">
          <div className="surface">
            <InfoGrid
              items={[
                [
                  "公司简介",
                  "星澜机器人是一家具身智能机器人公司，围绕通用操作能力研发 VLA 模型、机器人本体和规模化数据闭环。",
                  true,
                ],
                ["融资与资本状态", company.funding, true],
                [
                  "人才吸引点",
                  "具备从模型到本体的完整技术闭环；核心研发岗位可以直接影响产品路线；提供有竞争力的现金与期权组合。",
                  true,
                ],
                [
                  "薪资结构与福利",
                  "核心岗位通常为 14-16 薪，另有绩效奖金和期权；具体方案随职级与岗位稀缺度调整。",
                  true,
                ],
                [
                  "一般面试流程",
                  "简历筛选\n业务技术面 1-2 轮\n交叉面与负责人面试\nHR 沟通与 Offer",
                  true,
                ],
                [
                  "主要地点及业务",
                  "上海：算法、平台和产品研发\n苏州：工程化和机器人整机交付",
                  true,
                ],
                [
                  "其他要求",
                  "核心技术岗位重视可落地的项目经验；部分岗位会核验竞业限制。",
                  true,
                ],
                ["备注", "周雅雯为当前已确认的招聘负责人。", true],
              ]}
            />
          </div>
          <aside className="stack">
            <div className="surface">
              <header className="surface-header">
                <h2>招聘摘要</h2>
              </header>
              <div className="surface-body">
                <StatStrip
                  items={[
                    ["岗位", company.positions, "progress"],
                    ["储备", 20, "reserve"],
                    ["推进中", 8, "progress"],
                    ["已入职", 0, "success"],
                  ]}
                />
              </div>
            </div>
            <div className="surface">
              <header className="surface-header">
                <h2>相关业务</h2>
              </header>
              <SummaryList
                items={[
                  {
                    title: "星澜机器人招聘机会",
                    meta: "客户开发主线",
                    status: "等待用户",
                    icon: "route",
                    route: "/workstreams/client-xinglan/client",
                  },
                  {
                    title: "融资后扩充团队",
                    meta: "高优先级信号",
                    status: "待处理",
                    icon: "signal",
                    route: "/signals/sig-funding",
                  },
                ]}
                onOpen={(item) => navigate(item.route)}
              />
            </div>
          </aside>
        </section>
      )}
      {tab === "progress" && <CompanyProgress navigate={navigate} />}
      {tab === "contacts" && (
        <CompanyRelatedTable
          title="联系人"
          empty="该公司还没有联系人"
          rows={(companyContacts.length
            ? companyContacts
            : contacts.slice(0, 3)
          ).map((item) => ({
            id: item.id,
            title: item.name,
            meta: `${item.role} · ${item.channel}`,
            status: item.status,
          }))}
          onOpen={(item) => navigate(`/contacts/${item.id}`)}
        />
      )}
      {tab === "positions" && (
        <CompanyRelatedTable
          title="关联岗位"
          empty="该公司还没有岗位"
          rows={(companyPositions.length
            ? companyPositions
            : positions.slice(0, 2)
          ).map((item) => ({
            id: item.id,
            title: item.name,
            meta: `${item.location} · 招聘 ${item.headcount} 人 · 储备 ${item.reserve} / 推进中 ${item.progress} / 已入职 ${item.hired} / 失败 ${item.failed}`,
            status: item.status,
          }))}
          onOpen={(item) => navigate(`/positions/${item.id}`)}
        />
      )}
      {tab === "candidates" && (
        <CompanyRelatedTable
          title="关联候选人"
          empty="该公司还没有关联候选人"
          rows={candidates.map((item) => ({
            id: item.id,
            title: item.name,
            meta: `${item.company} · ${item.title} · ${item.stage}`,
            status: item.status,
          }))}
          onOpen={(item) => navigate(`/candidates/${item.id}`)}
        />
      )}
      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="添加公司联系人"
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
              添加联系人
            </Button>
          </>
        }
      >
        <div className="stack">
          <Tabs
            value="manual"
            onChange={() => {}}
            items={[
              { value: "manual", label: "手动填写" },
              { value: "candidate", label: "关联候选人" },
            ]}
          />
          <Input label="姓名" placeholder="输入联系人姓名" />
          <Input label="角色" placeholder="例如：HRD、招聘负责人" />
          <Input label="联系方式" placeholder="手机号、邮箱或平台账号" />
        </div>
      </Modal>
    </DetailShell>
  );
}

function CompanyProgress({ navigate }) {
  const [tab, setTab] = useState("all");
  const rows = candidates.filter(
    (item) =>
      tab === "all" ||
      (tab === "reserve" && item.stage === "储备") ||
      (tab === "progress" && !["储备", "已入职", "失败"].includes(item.stage)),
  );
  return (
    <section className="page-section">
      <StatStrip
        items={[
          ["储备", 20, "reserve"],
          ["推进中", 8, "progress"],
          ["已入职", 0, "success"],
          ["失败", 6, "failure"],
        ]}
      />
      <div className="surface page-section">
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: "all", label: "全部" },
            { value: "reserve", label: "储备" },
            { value: "progress", label: "推进中" },
            { value: "hired", label: "已入职" },
            { value: "failed", label: "失败" },
          ]}
        />
        <div className="surface-body">
          <div className="progress-table">
            {rows.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(`/progress/${item.id}-vla`)}
              >
                <span className="avatar">{item.name.slice(-1)}</span>
                <span>
                  <b>{item.name}</b>
                  <small>
                    {item.company} · {item.title}
                  </small>
                </span>
                <span>
                  <small>申请岗位</small>
                  <b>具身智能 VLA 算法负责人</b>
                </span>
                <Status tone="info">{item.stage}</Status>
                <Icon name="chevronRight" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CompanyRelatedTable({ title, rows, onOpen }) {
  return (
    <section className="page-section surface">
      <header className="surface-header">
        <h2>{title}</h2>
      </header>
      <div className="related-table">
        {rows.map((item) => (
          <button key={item.id} onClick={() => onOpen(item)}>
            <span>
              <b>{item.title}</b>
              <small>{item.meta}</small>
            </span>
            <Status tone={toneForStatus(item.status)}>{item.status}</Status>
            <Icon name="chevronRight" />
          </button>
        ))}
      </div>
      <footer className="related-pagination">
        <span>第 1 页，共 1 页</span>
        <div>
          <IconButton icon="chevronLeft" label="上一页" disabled />
          <IconButton icon="chevronRight" label="下一页" disabled />
        </div>
      </footer>
    </section>
  );
}

export function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = contacts.find((item) => item.id === id) || contacts[0];
  return (
    <DetailShell
      type="联系人"
      title={contact.name}
      description={`${contact.company} · ${contact.role}`}
      status={contact.status}
      listRoute="/contacts"
      primaryLabel="开始沟通"
      onPrimary={() => navigate(`/communications/${contact.id}`)}
    >
      <section className="page-section detail-layout">
        <div className="stack">
          <div className="surface">
            <InfoGrid
              items={[
                ["公司", contact.company],
                ["部门与角色", contact.role],
                ["联系方式", contact.channel],
                ["联系状态", contact.status],
                [
                  "联系偏好",
                  "工作日下午通过邮件或脉脉联系；避免在同一周内重复触达。",
                  true,
                ],
                [
                  "已有关系",
                  "通过前同事顾承宇建立联系，可在邮件中说明共同关系。",
                  true,
                ],
                [
                  "备注",
                  "关注具身智能算法和机器人平台方向的中高端岗位。",
                  true,
                ],
              ]}
            />
          </div>
          <div className="surface">
            <header className="surface-header">
              <h2>沟通历史</h2>
            </header>
            <div className="surface-body">
              <ActivityTimeline
                items={timeline.slice(0, 2).map((item, index) => ({
                  ...item,
                  title: index === 0 ? "收到招聘需求补充" : "首次发送合作介绍",
                }))}
              />
            </div>
          </div>
        </div>
        <aside className="surface">
          <header className="surface-header">
            <h2>关联业务</h2>
          </header>
          <SummaryList
            items={[
              {
                title: "星澜机器人招聘机会",
                meta: "2 个 HC · 上海",
                status: "已确认",
                icon: "signal",
                route: "/opportunities/opp-vla",
              },
              {
                title: "星澜机器人客户开发",
                meta: "等待确认联系",
                status: "等待用户",
                icon: "route",
                route: "/workstreams/client-xinglan/client",
              },
            ]}
            onOpen={(item) => navigate(item.route)}
          />
        </aside>
      </section>
    </DetailShell>
  );
}

export function OpportunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const opportunity =
    opportunities.find((item) => item.id === id) || opportunities[0];
  const [split, setSplit] = useState(false);
  return (
    <DetailShell
      type="招聘机会"
      title={opportunity.summary}
      description={`${opportunity.company} · 来源联系人 ${opportunity.contact}`}
      status={opportunity.status}
      listRoute="/opportunities"
      primaryLabel="拆分为岗位"
      onPrimary={() => setSplit(true)}
    >
      <section className="page-section detail-layout">
        <div className="surface">
          <InfoGrid
            items={[
              ["公司", opportunity.company],
              ["来源联系人", opportunity.contact],
              [
                "原始需求",
                "公司计划扩充具身智能算法团队，希望引进一位负责人和若干核心算法骨干。",
                true,
              ],
              ["招聘方向", "VLA、多模态机器人学习、操作策略"],
              ["预计人数", "负责人 1 人，核心骨干 1-2 人"],
              ["地点", "上海"],
              ["紧急度", "高"],
              ["有效期", opportunity.valid],
              ["待澄清", opportunity.unclear, true],
            ]}
          />
        </div>
        <aside className="stack">
          <div className="surface">
            <header className="surface-header">
              <h2>相关信号</h2>
            </header>
            <SummaryList
              items={[
                {
                  title: "B+ 轮融资后扩充团队",
                  meta: "公司公告与岗位变化",
                  status: "已采纳",
                  icon: "signal",
                  route: "/signals/sig-funding",
                },
              ]}
              onOpen={(item) => navigate(item.route)}
            />
          </div>
        </aside>
      </section>
      <Modal
        open={split}
        onClose={() => setSplit(false)}
        title="拆分为正式岗位"
        description="确认后创建岗位，并可立即启动岗位招聘主线"
        size="lg"
        footer={
          <>
            <Button onClick={() => setSplit(false)}>返回修改</Button>
            <Button
              tone="primary"
              onClick={() => {
                setSplit(false);
                toast("已创建 2 个岗位");
                navigate("/positions/vla-lead");
              }}
            >
              确认创建岗位
            </Button>
          </>
        }
      >
        <div className="stack">
          <div className="split-position">
            <CheckboxLike checked />
            <span>
              <b>具身智能 VLA 算法负责人</b>
              <small>上海 · 1 人 · 负责人职级</small>
            </span>
          </div>
          <div className="split-position">
            <CheckboxLike checked />
            <span>
              <b>机器人学习核心算法工程师</b>
              <small>上海 · 1-2 人 · 高级/专家职级</small>
            </span>
          </div>
          <Switch
            checked={true}
            onChange={() => {}}
            label="创建后启动岗位招聘主线"
            description="岗位信息作为主线初始输入，后续仍需确认具体配置。"
          />
        </div>
      </Modal>
    </DetailShell>
  );
}

function CheckboxLike({ checked }) {
  return (
    <span className={`checkbox-box ${checked ? "is-checked" : ""}`}>
      {checked && <Icon name="check" />}
    </span>
  );
}

export function PositionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const position = positions.find((item) => item.id === id) || positions[0];
  const [tab, setTab] = useState("detail");
  const [parse, setParse] = useState(false);
  return (
    <DetailShell
      type="岗位"
      title={position.name}
      description={`${position.company} · ${position.location} · 招聘 ${position.headcount} 人`}
      status={position.status}
      listRoute="/positions"
      primaryLabel="进入岗位招聘主线"
      onPrimary={() => navigate("/workstreams/position-vla/position")}
      secondary={
        <Button icon="task" onClick={() => setParse(true)}>
          AI 重新解析
        </Button>
      }
    >
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "detail", label: "岗位资料" },
          { value: "analysis", label: "岗位解析" },
          { value: "candidates", label: "候选人" },
          { value: "progress", label: "招聘推进" },
          { value: "history", label: "版本与历史" },
        ]}
      />
      {tab === "detail" && (
        <section className="page-section detail-layout">
          <div className="surface">
            <header className="surface-header">
              <h2>岗位 JD</h2>
              <Status tone="success">用户已确认</Status>
            </header>
            <article className="jd-content">
              <h3>岗位职责</h3>
              <ol>
                <li>负责具身智能 VLA 模型和机器人操作策略的技术路线与落地。</li>
                <li>
                  带领算法团队完成多模态感知、决策与控制闭环，推动真实机器人评测。
                </li>
                <li>
                  与本体、数据和平台团队协作，建立可复用的数据与训练基础设施。
                </li>
              </ol>
              <h3>任职要求</h3>
              <ol>
                <li>
                  计算机、自动化、机器人等相关方向，具备 6 年以上算法研发经验。
                </li>
                <li>
                  在机器人学习、多模态大模型、模仿学习或强化学习中至少一项有深入实践。
                </li>
                <li>有团队管理、复杂项目交付和跨团队协作经验。</li>
              </ol>
            </article>
          </div>
          <aside className="surface">
            <InfoGrid
              columns={1}
              items={[
                ["公司", position.company],
                ["地点", position.location],
                ["招聘人数", `${position.headcount} 人`],
                ["年限参考", "6 年以上"],
                ["薪酬", "总包 100-160 万"],
                ["入职时间", "优先 2 个月内"],
              ]}
            />
          </aside>
        </section>
      )}
      {tab === "analysis" && (
        <section className="page-section surface analysis-sections">
          <InfoGrid
            items={[
              [
                "岗位定位",
                "负责从 VLA 技术路线到真实机器人落地，并承担核心团队建设。",
                true,
              ],
              [
                "上下游关系",
                "上游连接多模态模型、数据和训练平台；下游连接机器人本体、控制和产品交付。",
                true,
              ],
              [
                "关键技能",
                <span className="tag-list">
                  {["VLA", "机器人学习", "多模态", "模仿学习", "团队管理"].map(
                    (item) => (
                      <span className="tag" key={item}>
                        {item}
                      </span>
                    ),
                  )}
                </span>,
                true,
              ],
              [
                "软性和隐性要求",
                "需要能够在研究和工程交付之间切换，并推动算法、本体和平台团队协作。\n岗位可能处于快速扩张期，汇报线和团队边界需要在面试中确认。",
                true,
              ],
              [
                "建议寻访关键词",
                "VLA + 机器人学习\n多模态 + 操作策略\n模仿学习 + 机器人\n通用机器人策略 + 具身智能\n机器人算法负责人 + 多模态",
                true,
              ],
              [
                "对标企业",
                "智元机器人、银河通用、星动纪元、逐际动力、上海人工智能实验室",
                true,
              ],
            ]}
          />
        </section>
      )}
      {tab === "candidates" && (
        <CompanyRelatedTable
          title="岗位候选人"
          rows={candidates.map((item) => ({
            id: item.id,
            title: `${item.name} · ${item.score} 分`,
            meta: `${item.company} · ${item.title}`,
            status: item.stage,
          }))}
          onOpen={(item) => navigate(`/candidates/${item.id}`)}
        />
      )}
      {tab === "progress" && (
        <section className="page-section">
          <StatStrip
            items={[
              ["储备", position.reserve, "reserve"],
              ["推进中", position.progress, "progress"],
              ["已入职", position.hired, "success"],
              ["失败", position.failed, "failure"],
            ]}
          />
          <CompanyRelatedTable
            title="推进记录"
            rows={candidates.slice(0, 4).map((item) => ({
              id: item.id,
              title: item.name,
              meta: `${item.company} · 最近更新 ${item.updated}`,
              status: item.stage,
            }))}
            onOpen={(item) => navigate(`/progress/${item.id}-vla`)}
          />
        </section>
      )}
      {tab === "history" && (
        <section className="page-section surface">
          <div className="surface-body">
            <ActivityTimeline
              items={timeline.map((item, index) => ({
                ...item,
                title:
                  index === 0
                    ? "岗位解析更新为 v3"
                    : index === 1
                      ? "调整工作年限参考"
                      : "岗位首次创建",
              }))}
            />
          </div>
        </section>
      )}
      <Modal
        open={parse}
        onClose={() => setParse(false)}
        title="AI 重新解析岗位"
        description="默认不更新岗位 JD，只补充岗位理解、匹配和寻访建议"
        footer={
          <>
            <Button onClick={() => setParse(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setParse(false);
                toast("岗位解析任务已创建");
                navigate("/tasks/task-position");
              }}
            >
              开始解析
            </Button>
          </>
        }
      >
        <div className="stack">
          <Switch
            checked={false}
            onChange={() => toast("打开后需要填写新版 JD 的说明", "info")}
            label="同时更新岗位 JD"
            description="关闭时保持当前 JD，不生成 JD 更新建议。"
          />
          <Textarea
            label="补充说明"
            placeholder="例如：客户强调需要真实机器人操作项目和 5 人以上团队管理经验。"
          />
        </div>
      </Modal>
    </DetailShell>
  );
}

export function CandidateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const candidate = candidates.find((item) => item.id === id) || candidates[0];
  const [tab, setTab] = useState("profile");
  const [resume, setResume] = useState(false);
  const [match, setMatch] = useState(false);
  return (
    <DetailShell
      type="候选人"
      title={candidate.name}
      description={`${candidate.company} · ${candidate.title} · ${candidate.location}`}
      status={candidate.status}
      listRoute="/candidates"
      primaryLabel="启动候选人求职主线"
      onPrimary={() => navigate("/workstreams/career-linhao/career")}
      secondary={
        <>
          <Button icon="upload" onClick={() => setResume(true)}>
            更新简历
          </Button>
          <Button icon="task" onClick={() => setMatch(true)}>
            人岗匹配
          </Button>
        </>
      }
    >
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "profile", label: "候选人资料" },
          { value: "resume", label: "简历预览" },
          { value: "communication", label: "沟通" },
          { value: "positions", label: "岗位推进" },
          { value: "academic", label: "论文与专利" },
          { value: "history", label: "来源与历史" },
        ]}
      />
      {tab === "profile" && (
        <section className="page-section detail-layout">
          <div className="stack">
            <div className="surface">
              <InfoGrid
                items={[
                  ["联系方式", "138 **** 2186 · linhao@example.com"],
                  ["工作年限", `${candidate.years} 年`],
                  [
                    "当前公司与职位",
                    `${candidate.company} · ${candidate.title}`,
                    true,
                  ],
                  [
                    "行业与技能",
                    <span className="tag-list">
                      {candidate.skills.map((item) => (
                        <span className="tag" key={item}>
                          {item}
                        </span>
                      ))}
                    </span>,
                    true,
                  ],
                  [
                    "求职意向",
                    "具身智能算法负责人 / 机器人学习负责人\n上海优先，可考虑杭州；期望总包不低于 120 万。",
                    true,
                  ],
                  ["教育经历", "上海交通大学 · 计算机科学 · 博士", true],
                ]}
              />
            </div>
            <div className="surface">
              <header className="surface-header">
                <h2>工作与项目经历</h2>
              </header>
              <div className="experience-list">
                <article>
                  <header>
                    <span>
                      <b>远川智能</b>
                      <small>机器人算法负责人 · 2022 至今</small>
                    </span>
                    <Status tone="info">当前</Status>
                  </header>
                  <p>
                    负责机器人操作策略和 VLA 方向，团队从 4 人扩展到 8
                    人；推动多模态操作策略在真实机器人场景落地。
                  </p>
                </article>
                <article>
                  <header>
                    <span>
                      <b>上海人工智能实验室</b>
                      <small>研究员 · 2018-2022</small>
                    </span>
                  </header>
                  <p>
                    从事机器人学习、模仿学习和通用操作策略研究，参与多个开源项目。
                  </p>
                </article>
              </div>
            </div>
          </div>
          <aside className="stack">
            <div className="surface">
              <header className="surface-header">
                <h2>资料可信状态</h2>
              </header>
              <div className="surface-body stack">
                <Status tone="success">核心字段已确认</Status>
                <p className="muted">
                  最新简历由候选人今天 10:36
                  提供；公开资料和历史简历用于补充核验。
                </p>
                <Button onClick={() => navigate("/tasks/task-enrich")}>
                  查看补全任务
                </Button>
              </div>
            </div>
            <div className="surface">
              <header className="surface-header">
                <h2>下一步</h2>
              </header>
              <SummaryList
                items={[
                  {
                    title: "VLA 算法负责人",
                    meta: "星澜机器人 · 89 分",
                    status: "二轮面试",
                    icon: "briefcase",
                    route: "/progress/linhao-vla",
                  },
                  {
                    title: "查看沟通",
                    meta: "收到新版简历",
                    status: "需处理",
                    icon: "message",
                    route: "/communications/comm-linhao",
                  },
                ]}
                onOpen={(item) => navigate(item.route)}
              />
            </div>
          </aside>
        </section>
      )}
      {tab === "resume" && (
        <section className="page-section resume-preview surface">
          <header className="surface-header">
            <h2>林昊_简历_2026-08.pdf</h2>
            <Button icon="download" onClick={() => toast("简历下载已开始")}>
              下载原件
            </Button>
          </header>
          <article>
            <h2>林昊</h2>
            <p>机器人算法负责人 · 具身智能 / 机器人学习</p>
            <h3>职业概述</h3>
            <p>
              9 年机器人算法研发与团队管理经验，聚焦多模态机器人学习、VLA
              和真实机器人操作策略落地。
            </p>
            <h3>核心经历</h3>
            <p>
              在远川智能负责 8
              人算法团队，建立从数据采集、训练评测到真实机器人部署的完整闭环。
            </p>
            <h3>项目经历</h3>
            <p>
              主导多模态操作策略项目，覆盖桌面操作、移动操作和复杂物体交互，显著提升跨任务泛化能力。
            </p>
          </article>
        </section>
      )}
      {tab === "communication" && (
        <CompanyRelatedTable
          title="沟通记录"
          rows={[
            {
              id: "comm-linhao",
              title: "脉脉会话 · 收到新简历",
              meta: "今天 10:36 · 候选人补充薪资和地点意向",
              status: "需处理",
            },
          ]}
          onOpen={() => navigate("/communications/comm-linhao")}
        />
      )}
      {tab === "positions" && (
        <CompanyRelatedTable
          title="岗位推进"
          rows={positions.slice(0, 3).map((item) => ({
            id: item.id,
            title: item.name,
            meta: `${item.company} · 匹配 ${candidate.score} 分`,
            status: item.id === "vla-lead" ? candidate.stage : "储备",
          }))}
          onOpen={(item) => navigate(`/progress/${candidate.id}-${item.id}`)}
        />
      )}
      {tab === "academic" && (
        <section className="page-section two-column">
          <CompanyRelatedTable
            title="关联论文"
            rows={papers.slice(0, 2).map((item) => ({
              id: item.id,
              title: item.title,
              meta: `${item.org} · ${item.year}`,
              status: "已关联",
            }))}
            onOpen={(item) => navigate(`/papers/${item.id}`)}
          />
          <CompanyRelatedTable
            title="关联专利"
            rows={patents.slice(0, 1).map((item) => ({
              id: item.id,
              title: item.title,
              meta: `${item.applicant} · ${item.date}`,
              status: "已关联",
            }))}
            onOpen={(item) => navigate(`/patents/${item.id}`)}
          />
        </section>
      )}
      {tab === "history" && (
        <section className="page-section surface">
          <div className="surface-body">
            <ActivityTimeline items={timeline} />
          </div>
        </section>
      )}
      <Modal
        open={resume}
        onClose={() => setResume(false)}
        title="更新候选人简历"
        description="文件会先判断是否为简历，再解析、查重并生成字段级建议"
        footer={
          <>
            <Button onClick={() => setResume(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setResume(false);
                toast("简历处理任务已创建");
                navigate("/tasks/task-enrich");
              }}
            >
              开始处理
            </Button>
          </>
        }
      >
        <div className="upload-drop">
          <i>
            <Icon name="upload" />
          </i>
          <h3>拖放 PDF 或 DOCX 简历</h3>
          <p>非简历文件、损坏文件和超限文件会在处理前被阻止。</p>
          <Button>选择文件</Button>
        </div>
      </Modal>
      <Modal
        open={match}
        onClose={() => setMatch(false)}
        title="为林昊做人岗匹配"
        description="岗位角色和范围门禁会在匹配排序前生效"
        footer={
          <>
            <Button onClick={() => setMatch(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setMatch(false);
                toast("匹配任务已开始");
                navigate("/tasks/task-match");
              }}
            >
              开始匹配
            </Button>
          </>
        }
      >
        <MultiSelect
          label="岗位范围"
          values={["active"]}
          onChange={() => {}}
          options={[
            { value: "active", label: "全部招聘中岗位" },
            ...positions.map((item) => ({ value: item.id, label: item.name })),
          ]}
        />
      </Modal>
    </DetailShell>
  );
}

export function MappingDetailPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [view, setView] = useState("structure");
  const [node, setNode] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  return (
    <DetailShell
      type="人才摸排"
      title="具身智能核心人才摸排"
      description="12 家目标公司 · 8 类关键角色 · 93 位已确认人物"
      status="维护中"
      listRoute="/mappings"
      primaryLabel="启动增量维护"
      onPrimary={() => navigate("/tasks/task-mapping")}
      secondary={
        <Button icon="upload" onClick={() => setImportOpen(true)}>
          导入或导出
        </Button>
      }
    >
      <Tabs
        value={view}
        onChange={setView}
        items={[
          { value: "structure", label: "组织与方向" },
          { value: "people", label: "关键人物" },
          { value: "evidence", label: "关系证据" },
          { value: "gaps", label: "空缺与覆盖" },
        ]}
      />
      {view === "structure" && (
        <section className="page-section mapping-detail">
          <aside className="surface mapping-outline">
            <header className="surface-header">
              <h2>范围</h2>
            </header>
            {[
              "具身智能",
              "VLA 与机器人学习",
              "灵巧手与结构",
              "机器人平台与芯片",
            ].map((item, index) => (
              <button
                className={index === 1 ? "is-active" : ""}
                key={item}
                onClick={() => toast(`已切换到 ${item}`)}
              >
                {item}
                <span>{index ? 20 + index * 9 : 93}</span>
              </button>
            ))}
          </aside>
          <div className="surface org-canvas">
            <header className="surface-header">
              <div>
                <h2>VLA 与机器人学习</h2>
                <small>按公司与团队组织</small>
              </div>
              <div className="inline">
                <IconButton
                  icon="plus"
                  label="新增节点"
                  onClick={() => setNode({ title: "新增节点", type: "方向" })}
                />
                <IconButton
                  icon="download"
                  label="导出当前范围"
                  onClick={() => toast("导出文件已生成")}
                />
              </div>
            </header>
            <div className="org-levels">
              <article className="root-node">
                <button
                  onClick={() =>
                    setNode({ title: "VLA 与机器人学习", type: "方向" })
                  }
                >
                  <b>VLA 与机器人学习</b>
                  <small>38 位已确认人物</small>
                </button>
              </article>
              <section>
                {companies.slice(0, 3).map((company, index) => (
                  <article key={company.id}>
                    <button
                      onClick={() =>
                        setNode({ title: company.name, type: "公司" })
                      }
                    >
                      <b>{company.name}</b>
                      <small>
                        {[16, 12, 10][index]} 位人物 ·{" "}
                        {index ? "待补充团队" : "3 个团队"}
                      </small>
                    </button>
                    <div>
                      {["算法负责人", "核心研究员"].map((role, roleIndex) => (
                        <button
                          key={role}
                          onClick={() =>
                            navigate(
                              `/candidates/${candidates[(index + roleIndex) % candidates.length].id}`,
                            )
                          }
                        >
                          <span className="avatar">
                            {candidates[
                              (index + roleIndex) % candidates.length
                            ].name.slice(-1)}
                          </span>
                          <span>
                            <b>
                              {
                                candidates[
                                  (index + roleIndex) % candidates.length
                                ].name
                              }
                            </b>
                            <small>{role}</small>
                          </span>
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </section>
            </div>
          </div>
        </section>
      )}
      {view === "people" && (
        <CompanyRelatedTable
          title="关键人物"
          rows={candidates.map((item) => ({
            id: item.id,
            title: item.name,
            meta: `${item.company} · ${item.title} · ${item.skills.join("、")}`,
            status: "已确认",
          }))}
          onOpen={(item) => navigate(`/candidates/${item.id}`)}
        />
      )}
      {view === "evidence" && (
        <section className="page-section surface">
          <EvidenceList
            items={[
              {
                title: "林昊与韩思雨曾共同发表论文",
                source: "OpenAlex、论文原文 · 已关联候选人",
                verified: true,
              },
              {
                title: "赵星羽可能向感知团队负责人汇报",
                source: "公开履历与团队页面推断",
                verified: false,
              },
              {
                title: "陈松与许澈共同持有灵巧手专利",
                source: "国家专利公开信息",
                verified: true,
              },
            ]}
          />
        </section>
      )}
      {view === "gaps" && (
        <section className="page-section surface">
          <div className="surface-body stack">
            {[
              ["星澜机器人 · 数据团队负责人", 35],
              ["云脉芯能 · 机器人平台负责人", 46],
              ["拓界智驾 · 端到端规控负责人", 58],
            ].map(([label, value]) => (
              <div className="coverage-row" key={label}>
                <span>{label}</span>
                <i>
                  <i style={{ width: `${value}%` }} />
                </i>
                <b>{value}%</b>
                <Button
                  size="sm"
                  onClick={() => navigate("/tasks/task-mapping")}
                >
                  补充摸排
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}
      <Drawer
        open={Boolean(node)}
        onClose={() => setNode(null)}
        title={node?.title}
      >
        <div className="stack">
          <Input label="节点名称" defaultValue={node?.title} />
          <Select
            label="节点类型"
            value="direction"
            onChange={() => {}}
            options={[
              { value: "direction", label: node?.type || "方向" },
              { value: "company", label: "公司" },
              { value: "role", label: "关键角色" },
            ]}
          />
          <Textarea
            label="描述"
            placeholder="说明该节点在摸排范围中的业务含义"
          />
          <Button
            tone="primary"
            onClick={() => {
              setNode(null);
              toast("节点已保存，布局保持稳定");
            }}
          >
            保存节点
          </Button>
        </div>
      </Drawer>
      <Modal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        title="导入或导出当前摸排"
        footer={<Button onClick={() => setImportOpen(false)}>关闭</Button>}
      >
        <div className="action-options">
          <button onClick={() => toast("Excel 模板已下载")}>
            <i>
              <Icon name="download" />
            </i>
            <span>
              <b>导出当前范围</b>
              <small>导出为可修改后重新导入的 Excel。</small>
            </span>
            <Icon name="chevronRight" />
          </button>
          <button onClick={() => toast("文件选择已打开", "info")}>
            <i>
              <Icon name="upload" />
            </i>
            <span>
              <b>导入到当前摸排</b>
              <small>支持 Excel 和 FreeMind，重名时先确认替换或保留。</small>
            </span>
            <Icon name="chevronRight" />
          </button>
        </div>
      </Modal>
    </DetailShell>
  );
}

export function PaperDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const paper = papers.find((item) => item.id === id) || papers[0];
  const [associate, setAssociate] = useState(false);
  return (
    <DetailShell
      type="论文"
      title={paper.title}
      description={`${paper.zh} · ${paper.year}`}
      status="已导入"
      listRoute="/papers"
      primaryLabel="联网补全"
      onPrimary={() => {
        toast("论文补全任务已创建");
        navigate("/tasks/task-academic");
      }}
      secondary={
        <Button icon="users" onClick={() => setAssociate(true)}>
          关联候选人
        </Button>
      }
    >
      <section className="page-section detail-layout">
        <article className="surface paper-reading">
          <header>
            <span>
              <small>摘要</small>
              <h2>{paper.zh}</h2>
            </span>
            <Button
              icon="link"
              onClick={() => toast("原文已在新标签页打开", "info")}
            >
              查看原文
            </Button>
          </header>
          <p>
            本文提出一个开源视觉语言动作模型，通过互联网规模的视觉语言预训练与机器人示范数据结合，使模型能够理解自然语言指令并在多种机器人任务上执行操作。
          </p>
          <h3>作者与机构</h3>
          <p>
            {paper.authors}
            <br />
            {paper.org}
          </p>
          <h3>候选人关联</h3>
          <p>{paper.related}</p>
        </article>
        <aside className="surface">
          <InfoGrid
            columns={1}
            items={[
              ["发表时间", paper.year],
              ["作者", paper.authors],
              ["机构", paper.org],
              ["来源", paper.source],
              ["DOI / URL", "https://arxiv.org/abs/2406.09246"],
              ["补全状态", "核心字段已确认"],
            ]}
          />
        </aside>
      </section>
      <Modal
        open={associate}
        onClose={() => setAssociate(false)}
        title="关联论文作者与候选人"
        footer={
          <>
            <Button onClick={() => setAssociate(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setAssociate(false);
                toast("候选人关联已保存");
              }}
            >
              保存关联
            </Button>
          </>
        }
      >
        <MultiSelect
          label="候选人"
          values={["lin-hao"]}
          onChange={() => {}}
          options={candidates.map((item) => ({
            value: item.id,
            label: `${item.name} · ${item.company}`,
          }))}
        />
      </Modal>
    </DetailShell>
  );
}

export function PatentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const patent = patents.find((item) => item.id === id) || patents[0];
  return (
    <DetailShell
      type="专利"
      title={patent.title}
      description={`${patent.applicant} · ${patent.date}`}
      status={patent.status}
      listRoute="/patents"
      primaryLabel="检索共同发明人"
      onPrimary={() => {
        toast("共同发明人检索任务已创建");
        navigate("/tasks/task-patent");
      }}
    >
      <section className="page-section detail-layout">
        <article className="surface paper-reading">
          <header>
            <span>
              <small>专利摘要</small>
              <h2>{patent.title}</h2>
            </span>
            <Button
              icon="link"
              onClick={() => toast("专利原文已在新标签页打开", "info")}
            >
              查看原文
            </Button>
          </header>
          <p>
            本发明涉及机器人灵巧手结构设计，通过紧凑的传动与驱动布置，在有限空间内实现多自由度运动，并兼顾力控精度和量产可维护性。
          </p>
          <h3>发明人</h3>
          <p>{patent.inventors}</p>
          <h3>候选人关联</h3>
          <p>{patent.related}</p>
        </article>
        <aside className="surface">
          <InfoGrid
            columns={1}
            items={[
              ["申请人", patent.applicant],
              ["发明人", patent.inventors],
              ["公开时间", patent.date],
              ["状态", patent.status],
              ["分类方向", "机器人机构 · 灵巧手"],
              ["来源", "国家专利公开信息"],
            ]}
          />
        </aside>
      </section>
    </DetailShell>
  );
}

export function ProgressDetailPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [stage, setStage] = useState("interview-2");
  const [record, setRecord] = useState(false);
  const [end, setEnd] = useState(false);
  const [type, setType] = useState("interview");
  const stageItems = [
    { id: "recommended", label: "已推荐" },
    { id: "interview-1", label: "一轮面试" },
    { id: "interview-2", label: "二轮面试" },
    { id: "salary", label: "谈薪" },
    { id: "offer", label: "Offer" },
    { id: "admission", label: "录取" },
    { id: "onboard", label: "入职" },
  ];
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="候选人 × 岗位推进"
        title="林昊 · 具身智能 VLA 算法负责人"
        description="星澜机器人 · 最近更新今天 10:54"
        status={<Status tone="info">二轮面试</Status>}
        back={() => navigate("/workstreams/position-vla/position")}
        actions={
          <>
            <Button onClick={() => navigate("/communications/comm-linhao")}>
              查看沟通
            </Button>
            <Button tone="primary" icon="plus" onClick={() => setRecord(true)}>
              记录新进展
            </Button>
            <Button tone="dangerGhost" onClick={() => setEnd(true)}>
              结束推进
            </Button>
          </>
        }
      />
      <section className="progress-stepbar">
        {stageItems.map((item, index) => (
          <button
            className={
              item.id === stage
                ? "is-current"
                : stageItems.findIndex((entry) => entry.id === stage) > index
                  ? "is-done"
                  : ""
            }
            key={item.id}
            onClick={() => {
              setStage(item.id);
              toast(`已切换查看 ${item.label} 阶段`);
            }}
          >
            <i>
              {stageItems.findIndex((entry) => entry.id === stage) > index ? (
                <Icon name="check" />
              ) : (
                index + 1
              )}
            </i>
            <span>{item.label}</span>
          </button>
        ))}
      </section>
      <section className="page-section detail-layout">
        <div className="stack">
          <div className="surface">
            <header className="surface-header">
              <h2>当前进展</h2>
              <Status tone="info">二轮面试已完成</Status>
            </header>
            <InfoGrid
              items={[
                ["正式推荐", "2026-08-14 11:20 · 已发送候选人报告和脱敏简历"],
                ["最近面试", "二轮技术面试 · 2026-08-16 15:00"],
                [
                  "面试反馈",
                  "技术深度符合预期；需要补充团队管理规模和到岗时间。",
                  true,
                ],
                [
                  "下一步",
                  "安排业务负责人面试，候选人下周二、周三下午可参加。",
                  true,
                ],
                ["薪资信息", "当前总包约 105 万；期望总包不低于 120 万"],
                ["入职时间", "确认 Offer 后约 6 周"],
              ]}
            />
          </div>
          <div className="surface">
            <header className="surface-header">
              <h2>完整时间线</h2>
            </header>
            <div className="surface-body">
              <ActivityTimeline items={timeline} />
            </div>
          </div>
        </div>
        <aside className="stack">
          <div className="surface">
            <header className="surface-header">
              <h2>对象摘要</h2>
            </header>
            <InfoGrid
              columns={1}
              items={[
                ["候选人", "林昊 · 机器人算法负责人"],
                ["岗位", "具身智能 VLA 算法负责人"],
                ["公司", "星澜机器人"],
                ["匹配", "89 分 · 推荐"],
                ["最近沟通", "收到新版简历和薪资意向"],
              ]}
            />
            <div className="surface-body inline">
              <Button size="sm" onClick={() => navigate("/candidates/lin-hao")}>
                候选人
              </Button>
              <Button size="sm" onClick={() => navigate("/positions/vla-lead")}>
                岗位
              </Button>
              <Button size="sm" onClick={() => navigate("/companies/xinglan")}>
                公司
              </Button>
            </div>
          </div>
          <div className="surface">
            <header className="surface-header">
              <h2>Agent 建议</h2>
            </header>
            <div className="surface-body">
              <p className="muted">
                下一轮建议重点确认候选人的团队管理边界、实际带人规模和跨团队交付经验。
              </p>
              <div className="privacy-note">
                <Icon name="info" />
                <span>
                  正式推荐、面试确认、薪资承诺、Offer
                  和录取决定必须由猎头手动记录。
                </span>
              </div>
            </div>
          </div>
        </aside>
      </section>
      <Modal
        open={record}
        onClose={() => setRecord(false)}
        title="记录新的推进进展"
        description="选择事实类型并保留时间、来源和附件"
        size="lg"
        footer={
          <>
            <Button onClick={() => setRecord(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setRecord(false);
                toast("推进记录已保存，并同步更新关联页面");
              }}
            >
              保存进展
            </Button>
          </>
        }
      >
        <div className="form-grid">
          <Select
            label="记录类型"
            value={type}
            onChange={setType}
            options={[
              { value: "recommend", label: "正式推荐" },
              { value: "interview", label: "面试安排或反馈" },
              { value: "salary", label: "谈薪记录" },
              { value: "offer", label: "Offer" },
              { value: "admission", label: "录取决定" },
              { value: "onboard", label: "入职" },
            ]}
          />
          <Input label="发生时间" value="2026-08-17 14:00" readOnly />
          <Textarea
            className="span-2"
            label="事实与反馈"
            placeholder="记录已发生的事实、客户或候选人反馈；不要在这里生成承诺。"
          />
          <Input
            className="span-2"
            label="附件"
            placeholder="上传面试反馈、推荐材料或 Offer 文件"
            prefix="paper"
          />
        </div>
      </Modal>
      <Modal
        danger
        open={end}
        onClose={() => setEnd(false)}
        title="结束本次岗位推进"
        description="需要记录真实结束原因"
        footer={
          <>
            <Button onClick={() => setEnd(false)}>继续推进</Button>
            <Button
              tone="danger"
              onClick={() => {
                setEnd(false);
                toast("推进已结束，历史完整保留");
                navigate("/workstreams/position-vla/position");
              }}
            >
              确认结束
            </Button>
          </>
        }
      >
        <div className="stack">
          <Select
            label="结束原因"
            value="candidate"
            onChange={() => {}}
            options={[
              { value: "candidate", label: "候选人放弃" },
              { value: "rejected", label: "客户落选" },
              { value: "unsuitable", label: "候选人不合适" },
              { value: "not-onboard", label: "未按计划入职" },
            ]}
          />
          <Textarea
            label="原因说明"
            placeholder="记录事实和后续是否可以重新联系"
          />
        </div>
      </Modal>
    </div>
  );
}
