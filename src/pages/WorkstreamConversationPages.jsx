import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Drawer,
  Input,
  Modal,
  PageHeader,
  Segmented,
  Status,
  Switch,
  Textarea,
  useToast,
} from "../components/ui";
import { Icon } from "../components/Icon";
import {
  agentModes,
  ConfigurationCard,
  ConversationComposer,
  ConversationEntry,
  ConversationEvent,
  ConversationHistory,
  ConversationPreview,
  ConversationWorkspace,
  MainlineContextPanel,
  PhaseList,
  WorkstreamTypeChooser,
} from "../components/conversation";
import {
  creationFlows,
  workstreamDetails,
  workstreamKinds,
} from "../data/workstreamConversations";

const initialCreationSessions = [
  {
    id: "draft-new",
    title: "新的业务主线",
    summary: "选择业务目标后开始整理",
    time: "刚刚",
    pinned: true,
    kind: "",
    mode: "edit",
  },
  {
    id: "draft-position",
    title: "星澜机器人 VLA 招聘",
    summary: "岗位招聘草稿 · 还需确认完成标准",
    time: "今天 09:40",
    pinned: false,
    kind: "position",
    mode: "edit",
  },
  {
    id: "draft-mapping",
    title: "具身智能核心人才摸排",
    summary: "人才摸排草稿 · 已保存 12 家公司",
    time: "昨天",
    pinned: false,
    kind: "mapping",
    mode: "plan",
  },
];

function CreationSummary({ kind, flow, step, mode, onEdit, onCreate }) {
  const selectedMode = agentModes.find((item) => item.value === mode);
  return (
    <aside
      className="conversation-preview creation-summary"
      aria-label="主线启动摘要"
    >
      <header>
        <span>
          <small>实时预览</small>
          <b>主线启动摘要</b>
        </span>
        {kind && <Status tone="info">准备中</Status>}
      </header>
      <div className="conversation-preview-scroll">
        {!kind ? (
          <div className="summary-placeholder">
            <Icon name="route" />
            <b>尚未选择主线类型</b>
            <p>在中间选择要持续推进的业务目标，Hunter 会逐步整理配置。</p>
          </div>
        ) : (
          <>
            <div className="summary-title">
              <Icon
                name={workstreamKinds.find((item) => item.value === kind)?.icon}
              />
              <span>
                <small>
                  {workstreamKinds.find((item) => item.value === kind)?.label}
                </small>
                <b>{flow.title}</b>
              </span>
            </div>
            <dl className="creation-summary-list">
              <div>
                <dt>目标范围</dt>
                <dd>{flow.config.scope}</dd>
              </div>
              <div>
                <dt>触发方式</dt>
                <dd>{flow.config.trigger}</dd>
              </div>
              <div>
                <dt>确认方式</dt>
                <dd>{flow.config.approval}</dd>
              </div>
              <div>
                <dt>停止条件</dt>
                <dd>{flow.config.stop}</dd>
              </div>
              <div>
                <dt>Agent 模式</dt>
                <dd>
                  {selectedMode?.label} · {selectedMode?.description}
                </dd>
              </div>
            </dl>
            <Button icon="edit" onClick={onEdit}>
              检查结构化配置
            </Button>
            <Button tone="primary" disabled={step < 2} onClick={onCreate}>
              确认并创建主线
            </Button>
            {step < 2 && (
              <small className="summary-help">再回答一个问题后即可创建</small>
            )}
          </>
        )}
        <div className="privacy-note">
          <Icon name="info" />
          <span>
            主线本身不持续消耗用量；只有搜索、浏览、解析和联系等实际任务会计费用量。
          </span>
        </div>
      </div>
    </aside>
  );
}

export function NewWorkstreamPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const initialKind = searchParams.get("type") || "";
  const [kind, setKind] = useState(initialKind);
  const [step, setStep] = useState(initialKind ? 1 : 0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [configOpen, setConfigOpen] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [contact, setContact] = useState(false);
  const [mode, setMode] = useState("edit");
  const [sessions, setSessions] = useState(initialCreationSessions);
  const [activeSessionId, setActiveSessionId] = useState("draft-new");
  const [deleteSession, setDeleteSession] = useState(null);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const flow = kind ? creationFlows[kind] : null;

  const chooseKind = (value) => {
    setKind(value);
    setStep(1);
    setMessages([]);
    setMessage("");
    setSessions((current) =>
      current.map((session) =>
        session.id === activeSessionId
          ? {
              ...session,
              title: workstreamKinds.find((item) => item.value === value)
                ?.label,
              summary: `${creationFlows[value].title} · 正在补齐配置`,
              kind: value,
              time: "刚刚",
            }
          : session,
      ),
    );
  };

  const selectCreationSession = (id) => {
    const session = sessions.find((item) => item.id === id);
    setActiveSessionId(id);
    setKind(session?.kind || "");
    setMode(session?.mode || "edit");
    setStep(session?.kind ? 1 : 0);
    setSessionsOpen(false);
    setMessages(
      session?.kind
        ? [
            {
              role: "agent",
              text: "草稿已恢复。你可以继续补充目标，或检查右侧启动摘要。",
              time: "刚刚",
            },
          ]
        : [],
    );
  };

  const createConversation = () => {
    const id = `draft-${Date.now()}`;
    setSessions((current) => [
      {
        id,
        title: "新的业务主线",
        summary: "尚未选择业务目标",
        time: "刚刚",
        pinned: false,
        kind: "",
        mode: "edit",
      },
      ...current,
    ]);
    setActiveSessionId(id);
    setKind("");
    setStep(0);
    setMessages([]);
    setMessage("");
    setMode("edit");
    setSessionsOpen(false);
  };

  const toggleSessionPin = (id) => {
    setSessions((current) =>
      current.map((session) =>
        session.id === id ? { ...session, pinned: !session.pinned } : session,
      ),
    );
  };

  const send = (preset) => {
    const text = (preset || message).trim();
    if (!text || !flow) return;
    setMessages((current) => [
      ...current,
      { role: "user", text, time: "刚刚" },
      {
        role: "agent",
        text:
          step === 1
            ? flow.followup
            : `已把这条信息加入${workstreamKinds.find((item) => item.value === kind)?.label}范围，并同步更新右侧配置。你可以继续补充，或确认创建主线。`,
        time: "刚刚",
      },
    ]);
    setStep((current) => Math.min(current + 1, 3));
    setMessage("");
  };

  const create = () => {
    if (kind === "position") {
      setDuplicate(true);
      return;
    }
    toast("业务主线已创建");
    navigate(`/workstreams/${kind}-new/${kind}`);
  };

  const creationHistory = (
    <ConversationHistory
      sessions={sessions}
      activeId={activeSessionId}
      eyebrow="业务主线草稿"
      onSelect={selectCreationSession}
      onNew={createConversation}
      onPin={toggleSessionPin}
      onDelete={setDeleteSession}
    />
  );
  const creationPreview = (
    <CreationSummary
      kind={kind}
      flow={flow}
      step={step}
      mode={mode}
      onEdit={() => setConfigOpen(true)}
      onCreate={create}
    />
  );

  return (
    <div className="page-content workstream-conversation-page">
      <PageHeader
        eyebrow="新建业务主线"
        title="告诉 Hunter 你要持续完成什么"
        description="Hunter 会通过对话补齐范围、授权、停止条件和完成标准，再建立可持续推进的业务主线。"
        back={() => navigate("/workstreams")}
        actions={
          <>
            <Button
              className="chat-mobile-button"
              icon="panelLeft"
              onClick={() => setSessionsOpen(true)}
            >
              会话
            </Button>
            <Button
              className="chat-mobile-button"
              icon="panelRight"
              onClick={() => setPreviewOpen(true)}
            >
              结果
            </Button>
          </>
        }
      />
      <ConversationWorkspace
        history={creationHistory}
        preview={creationPreview}
      >
        <div className="conversation-thread creation-thread">
          <ConversationEntry time="现在">
            <p>
              你希望持续推进哪一类业务？选择类型后，可以直接用几句话描述当前目标和已知信息。
            </p>
            <WorkstreamTypeChooser
              items={workstreamKinds}
              value={kind}
              onChange={chooseKind}
            />
          </ConversationEntry>
          {flow && (
            <ConversationEntry time="现在">
              <p>{flow.intro}</p>
              {messages.length === 0 && (
                <div className="suggested-prompts">
                  {flow.examples.map((example) => (
                    <button key={example} onClick={() => send(example)}>
                      {example}
                    </button>
                  ))}
                </div>
              )}
            </ConversationEntry>
          )}
          {messages.map((item, index) => (
            <ConversationEntry
              role={item.role}
              time={item.time}
              key={`${item.role}-${index}`}
            >
              <p>{item.text}</p>
            </ConversationEntry>
          ))}
          {flow && step >= 2 && (
            <ConfigurationCard
              title={flow.title}
              config={flow.config}
              onEdit={() => setConfigOpen(true)}
            />
          )}
          {duplicate && (
            <article className="duplicate-inline">
              <Icon name="warning" />
              <div>
                <Status tone="warning">发现相同目标</Status>
                <h3>“具身智能 VLA 算法负责人”正在推进</h3>
                <p>
                  已有 2 个任务运行、18
                  位候选人等待审核。建议把新信息补充到原主线，避免重复找人和联系。
                </p>
                <div>
                  <Button onClick={() => setDuplicate(false)}>
                    继续修改新主线
                  </Button>
                  <Button
                    tone="primary"
                    onClick={() =>
                      navigate("/workstreams/position-vla/position")
                    }
                  >
                    补充并恢复原主线
                  </Button>
                </div>
              </div>
            </article>
          )}
        </div>
        <ConversationComposer
          value={message}
          onChange={setMessage}
          disabled={!flow}
          onSend={() => send()}
          onAttach={() => toast("已打开文件和链接选择", "info")}
          mode={mode}
          onModeChange={(value) => {
            setMode(value);
            setSessions((current) =>
              current.map((session) =>
                session.id === activeSessionId
                  ? { ...session, mode: value }
                  : session,
              ),
            );
            toast(
              `已切换为${agentModes.find((item) => item.value === value)?.label}`,
              "info",
            );
          }}
          placeholder={
            flow
              ? `补充${workstreamKinds.find((item) => item.value === kind)?.label}目标和已知信息`
              : "请先选择业务主线类型"
          }
        />
      </ConversationWorkspace>
      <Drawer
        open={sessionsOpen}
        onClose={() => setSessionsOpen(false)}
        title="业务主线草稿"
        width="360px"
      >
        {creationHistory}
      </Drawer>
      <Drawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="主线启动摘要"
        width="520px"
      >
        {creationPreview}
      </Drawer>
      <Modal
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        title="检查业务主线配置"
        description={flow?.title}
        size="lg"
        footer={
          <>
            <Button onClick={() => setConfigOpen(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setConfigOpen(false);
                toast("结构化配置已更新");
              }}
            >
              保存配置
            </Button>
          </>
        }
      >
        {flow && (
          <div className="form-grid">
            <Textarea
              className="span-2"
              label="目标范围"
              defaultValue={flow.config.scope}
            />
            <Input label="触发方式" defaultValue={flow.config.trigger} />
            <Input label="停止条件" defaultValue={flow.config.stop} />
            <Switch
              checked={autoConfirm}
              onChange={setAutoConfirm}
              label="在授权范围内自动确认"
              description="默认关闭；Hunter 的安全和质量门禁始终生效。"
            />
            <Switch
              checked={contact}
              onChange={setContact}
              label="允许外部联系"
              description="正式发送前仍按本主线的确认规则处理。"
            />
          </div>
        )}
      </Modal>
      <Modal
        danger
        open={Boolean(deleteSession)}
        onClose={() => setDeleteSession(null)}
        title="删除这条会话草稿"
        description={deleteSession?.title}
        footer={
          <>
            <Button onClick={() => setDeleteSession(null)}>取消</Button>
            <Button
              tone="danger"
              onClick={() => {
                const remaining = sessions.filter(
                  (session) => session.id !== deleteSession.id,
                );
                setSessions(remaining);
                if (activeSessionId === deleteSession.id)
                  selectCreationSession(remaining[0].id);
                setDeleteSession(null);
                toast("会话草稿已删除", "info");
              }}
            >
              删除会话
            </Button>
          </>
        }
      >
        <p>只删除这条尚未创建的会话草稿，不会影响已经存在的业务主线。</p>
      </Modal>
    </div>
  );
}

function eventToPreview(event, config, session, kind) {
  if (!event) return null;
  const kindEvidence = {
    client: ["星澜机器人官网招聘页", "B+ 轮融资公告", "负责人公开履历"],
    position: ["岗位 JD 与岗位解析", "内部候选人资料", "猎聘和脉脉公开资料"],
    mapping: ["公司官网与团队页面", "论文和专利作者关系", "候选人公开履历"],
    career: ["候选人最新简历", "岗位公开信息", "候选人沟通记录"],
  };
  const scopedItems = event.scope?.map(
    ([label, value]) => `${label}：${value}`,
  );
  return {
    eyebrow:
      event.type === "plan"
        ? "执行计划"
        : event.type === "task"
          ? "任务进展"
          : event.type === "object"
            ? "业务对象"
            : event.type === "permission"
              ? "权限请求"
              : "结果预览",
    title: event.title || session.title,
    detail: event.detail || event.text,
    status: event.status || (event.type === "plan" ? "已更新" : "当前会话"),
    tone: event.tone || (event.type === "permission" ? "warning" : "info"),
    icon:
      event.type === "object"
        ? "database"
        : event.type === "task"
          ? "task"
          : event.type === "permission"
            ? "settings"
            : "sparkles",
    metrics: [
      ["所属会话", session.title],
      ["主线状态", config.status],
      ["更新时间", event.time],
    ],
    listTitle: event.scope ? "操作范围" : "关键信息",
    items: scopedItems || event.chips || [config.next, config.assets],
    evidence: kindEvidence[kind],
    route: event.route,
  };
}

export function WorkstreamDetailPage({ kind }) {
  const navigate = useNavigate();
  const toast = useToast();
  const config = workstreamDetails[kind];
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [sessions, setSessions] = useState(config.sessions);
  const [activeSessionId, setActiveSessionId] = useState(config.sessions[0].id);
  const [eventsBySession, setEventsBySession] = useState(() =>
    Object.fromEntries(
      config.sessions.map((session) => [session.id, session.events]),
    ),
  );
  const [modeBySession, setModeBySession] = useState(() =>
    Object.fromEntries(config.sessions.map((session) => [session.id, "edit"])),
  );
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [paused, setPaused] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [terminate, setTerminate] = useState(false);
  const [attachment, setAttachment] = useState(false);
  const [deleteSession, setDeleteSession] = useState(null);

  const activeSession =
    sessions.find((session) => session.id === activeSessionId) || sessions[0];
  const events = eventsBySession[activeSessionId] || [];
  const mode = modeBySession[activeSessionId] || "edit";
  const updateCurrentEvents = (updater) => {
    setEventsBySession((current) => ({
      ...current,
      [activeSessionId]: updater(current[activeSessionId] || []),
    }));
  };

  const visibleEvents = useMemo(() => {
    if (filter === "all") return events;
    if (filter === "decisions")
      return events.filter((item) =>
        ["approval", "impact", "branch", "permission"].includes(item.type),
      );
    if (filter === "tasks")
      return events.filter((item) =>
        ["plan", "task", "wait"].includes(item.type),
      );
    return events.filter((item) => ["result", "object"].includes(item.type));
  }, [events, filter]);

  const previewEvent =
    selectedEvent ||
    [...events]
      .reverse()
      .find((item) => !["user", "agent"].includes(item.type));
  const preview = eventToPreview(previewEvent, config, activeSession, kind);

  const selectSession = (id) => {
    setActiveSessionId(id);
    setFilter("all");
    setSelectedEvent(null);
    setSessionsOpen(false);
  };

  const createConversation = () => {
    const id = `${kind}-conversation-${Date.now()}`;
    const session = {
      id,
      title: "新的会话",
      summary: "继承主线目标，尚未开始处理",
      time: "刚刚",
      pinned: false,
    };
    setSessions((current) => [session, ...current]);
    setEventsBySession((current) => ({
      ...current,
      [id]: [
        {
          type: "agent",
          time: "刚刚",
          text: `新会话已继承“${config.title}”中已经确认的目标与业务资料。你可以直接提出新的问题或补充信息。`,
        },
      ],
    }));
    setModeBySession((current) => ({ ...current, [id]: "edit" }));
    setActiveSessionId(id);
    setSelectedEvent(null);
    setFilter("all");
    setSessionsOpen(false);
    toast("新会话已创建", "info");
  };

  const changeMode = (value) => {
    const selected = agentModes.find((item) => item.value === value);
    setModeBySession((current) => ({ ...current, [activeSessionId]: value }));
    updateCurrentEvents((current) => {
      const updated =
        value === "auto"
          ? current.map((item) =>
              item.type === "permission" &&
              item.options?.some((option) => option.value === "mainline")
                ? {
                    ...item,
                    status: "当前会话已授权",
                    tone: "success",
                    options: undefined,
                    detail: `${item.detail} 已按自动执行模式在当前会话内授权，Hunter 强制门禁仍然生效。`,
                  }
                : item,
            )
          : current;
      return [
        ...updated,
        {
          type: "agent",
          time: "刚刚",
          text:
            value === "plan"
              ? "操作模式已切换为规划模式。后续只研究和生成计划，不执行外部操作或业务写入。"
              : value === "auto"
                ? "操作模式已切换为自动执行。当前会话已授权范围内的普通操作不再逐次询问，Hunter 强制门禁和人工业务边界保持不变。"
                : "操作模式已切换为执行模式。可以继续搜索、分析和生成草稿，敏感操作会在当前会话中询问。",
        },
      ];
    });
    toast(`已切换为${selected?.label}`, "info");
  };

  const act = (event, action) => {
    if (event.type === "permission") {
      const result =
        action === "deny"
          ? ["已拒绝", "danger", "相关任务将保持等待，不会执行该操作。"]
          : action === "mainline"
            ? [
                "当前会话已授权",
                "success",
                "授权只在当前会话有效，仍受预算和安全门禁约束。",
              ]
            : [
                "已授权本次",
                "success",
                "授权只对本次操作有效，执行完成后自动失效。",
              ];
      updateCurrentEvents((current) =>
        current.map((item) =>
          item === event
            ? {
                ...item,
                status: result[0],
                tone: result[1],
                options: undefined,
                detail: `${item.detail} ${result[2]}`,
              }
            : item,
        ),
      );
      toast(result[2], action === "deny" ? "info" : "success");
      return;
    }
    if (action === "secondary") {
      toast(
        event.type === "branch" ? "支线建议已忽略" : "已保留当前状态",
        "info",
      );
      return;
    }
    if (event.route) {
      navigate(event.route);
      return;
    }
    setSelectedEvent(event);
    toast("处理结果已记录到当前业务主线");
  };

  const send = () => {
    const text = message.trim();
    if (!text) return;
    const impact = {
      type: "impact",
      time: "刚刚",
      title: "补充信息已完成影响分析",
      detail: `Hunter 判断这条信息会影响当前阶段，将只调整相关任务和结果，不会重跑整条主线：${text}`,
      primary: "确认局部更新",
      secondary: "先不处理",
    };
    updateCurrentEvents((current) => [
      ...current,
      { type: "user", time: "刚刚", text },
      impact,
    ]);
    setSessions((current) =>
      current.map((session) =>
        session.id === activeSessionId
          ? {
              ...session,
              title:
                session.title === "新的会话"
                  ? text.slice(0, 18)
                  : session.title,
              summary: `刚刚补充：${text}`,
              time: "刚刚",
            }
          : session,
      ),
    );
    setSelectedEvent(impact);
    setMessage("");
    toast("补充信息已加入当前会话", "info");
  };

  const history = (
    <ConversationHistory
      sessions={sessions}
      activeId={activeSessionId}
      onSelect={selectSession}
      onNew={createConversation}
      onPin={(id) =>
        setSessions((current) =>
          current.map((session) =>
            session.id === id
              ? { ...session, pinned: !session.pinned }
              : session,
          ),
        )
      }
      onDelete={setDeleteSession}
    />
  );

  const openPreview = () => {
    if (preview?.route) navigate(preview.route);
    else setPreviewOpen(true);
  };
  const resultPreview = (
    <ConversationPreview
      preview={preview}
      context={{ ...config, status: paused ? "已暂停" : config.status }}
      onOpen={openPreview}
      onCopy={() => {
        navigator.clipboard
          ?.writeText(`${preview?.title}\n${preview?.detail}`)
          .catch(() => {});
        toast("结果摘要已复制");
      }}
      onOpenContext={() => setContextOpen(true)}
    />
  );

  return (
    <div className="page-content workstream-conversation-page">
      <PageHeader
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        status={
          <Status tone={config.tone}>
            {paused ? "已暂停" : config.status}
          </Status>
        }
        back={() => navigate("/workstreams")}
        actions={
          <>
            <Button
              className="chat-mobile-button"
              icon="panelLeft"
              onClick={() => setSessionsOpen(true)}
            >
              会话
            </Button>
            <Button
              className="chat-mobile-button"
              icon="panelRight"
              onClick={() => setPreviewOpen(true)}
            >
              结果
            </Button>
            <Button
              icon={paused ? "play" : "pause"}
              onClick={() => {
                setPaused(!paused);
                toast(paused ? "业务主线已继续" : "业务主线已暂停", "info");
              }}
            >
              {paused ? "继续" : "暂停"}
            </Button>
            <Button
              tone="primary"
              icon="plus"
              onClick={() => setAttachment(true)}
            >
              补充信息
            </Button>
          </>
        }
      />
      <ConversationWorkspace history={history} preview={resultPreview}>
        <div className="conversation-toolbar">
          <span className="conversation-current-session">
            <small>当前会话</small>
            <b>{activeSession.title}</b>
          </span>
          <Segmented
            value={filter}
            onChange={setFilter}
            items={[
              { value: "all", label: "全部" },
              { value: "decisions", label: "待处理" },
              { value: "tasks", label: "任务" },
              { value: "results", label: "成果" },
            ]}
          />
        </div>
        <div className="conversation-thread detail-thread">
          {visibleEvents.length ? (
            visibleEvents.map((event, index) => (
              <ConversationEvent
                event={event}
                onAction={act}
                onSelect={setSelectedEvent}
                key={`${activeSessionId}-${event.type}-${index}`}
              />
            ))
          ) : (
            <div className="conversation-empty">
              <Icon name="database" />
              <b>当前筛选下没有记录</b>
              <p>切换筛选查看其他业务过程。</p>
            </div>
          )}
        </div>
        <ConversationComposer
          value={message}
          onChange={setMessage}
          onSend={send}
          onAttach={() => setAttachment(true)}
          mode={mode}
          onModeChange={changeMode}
        />
      </ConversationWorkspace>
      <Modal
        open={attachment}
        onClose={() => setAttachment(false)}
        title="补充业务信息"
        description="支持文字、链接和文件；提交后先分析影响范围"
        footer={
          <>
            <Button onClick={() => setAttachment(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setAttachment(false);
                setMessage(
                  "客户补充：杭州也可以接受，但需要候选人每周至少三天到岗。",
                );
                toast("信息已放入输入区，请确认后发送", "info");
              }}
            >
              加入对话
            </Button>
          </>
        }
      >
        <div className="stack">
          <Textarea
            label="补充说明"
            defaultValue="客户补充：杭州也可以接受，但需要候选人每周至少三天到岗。"
          />
          <Input
            label="链接"
            placeholder="粘贴公开资料或平台页面"
            prefix="link"
          />
          <button
            className="conversation-upload"
            onClick={() => toast("已选择 岗位补充说明.docx")}
          >
            <Icon name="upload" />
            <span>
              <b>添加文件</b>
              <small>PDF、DOCX、XLSX；提交前检查格式和内容。</small>
            </span>
          </button>
        </div>
      </Modal>
      <Drawer
        open={contextOpen}
        onClose={() => setContextOpen(false)}
        title="业务主线信息"
        width="460px"
      >
        <div className="stack">
          <MainlineContextPanel
            config={config}
            onOpenContext={() => toast("目标编辑已打开", "info")}
          />
          <PhaseList phases={config.phases} />
          <Button
            tone="dangerGhost"
            icon="trash"
            onClick={() => setTerminate(true)}
          >
            终止业务主线
          </Button>
        </div>
      </Drawer>
      <Drawer
        open={sessionsOpen}
        onClose={() => setSessionsOpen(false)}
        title="当前主线会话"
        width="360px"
      >
        {history}
      </Drawer>
      <Drawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="结果预览"
        width="520px"
      >
        {resultPreview}
      </Drawer>
      <Modal
        danger
        open={Boolean(deleteSession)}
        onClose={() => setDeleteSession(null)}
        title="删除这条会话"
        description={deleteSession?.title}
        footer={
          <>
            <Button onClick={() => setDeleteSession(null)}>取消</Button>
            <Button
              tone="danger"
              onClick={() => {
                const remaining = sessions.filter(
                  (session) => session.id !== deleteSession.id,
                );
                setSessions(remaining);
                if (activeSessionId === deleteSession.id)
                  selectSession(remaining[0].id);
                setDeleteSession(null);
                toast("会话已删除，正式业务资产和任务记录仍然保留", "info");
              }}
            >
              删除会话
            </Button>
          </>
        }
      >
        <p>
          删除后不会出现在当前主线的会话列表中；已经形成的公司、岗位、候选人、任务和证据不会删除。
        </p>
      </Modal>
      <Modal
        danger
        open={terminate}
        onClose={() => setTerminate(false)}
        title="终止这条业务主线"
        description="已确认成果和完整过程会保留"
        footer={
          <>
            <Button onClick={() => setTerminate(false)}>取消</Button>
            <Button
              tone="danger"
              onClick={() => {
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
          未执行任务和自动联动将停止；已经发送的联系无法撤回，后续收到的外部回复仍会记录。
        </p>
      </Modal>
    </div>
  );
}
