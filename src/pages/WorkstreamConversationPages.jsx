import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Drawer,
  Input,
  Modal,
  PageHeader,
  Status,
  Switch,
  Textarea,
  useToast,
} from "../components/ui";
import { Icon } from "../components/Icon";
import {
  agentModes,
  AgentThinking,
  ConfigurationCard,
  ConversationComposer,
  ConversationDetail,
  ConversationEntry,
  ConversationEvent,
  ConversationWorkspace,
  MainlineContextPanel,
  MessageAttachments,
  PlanListDock,
  WorkstreamConversationNav,
  WorkstreamTypeChooser,
} from "../components/conversation";
import {
  creationPlans,
  creationFlows,
  workstreamDetails,
  workstreamKinds,
} from "../data/workstreamConversations";
import { workstreams } from "../data/demo";

const workstreamKindByType = {
  客户开发: "client",
  岗位招聘: "position",
  人才摸排: "mapping",
  候选人求职: "career",
};

const workstreamIdByKind = Object.fromEntries(
  workstreams.map((item) => [workstreamKindByType[item.type], item.id]),
);

function workstreamRoute(item) {
  return `/workstreams/${item.id}/${workstreamKindByType[item.type]}`;
}

function firstBlockingCount(items, start = 0) {
  const next = items.findIndex(
    (item, index) => index >= start && item.blocking && !item.resolved,
  );
  return next < 0 ? items.length : next + 1;
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
  const [attachments, setAttachments] = useState([]);
  const [configOpen, setConfigOpen] = useState(false);
  const [navigationCollapsed, setNavigationCollapsed] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [contact, setContact] = useState(false);
  const [mode, setMode] = useState("edit");
  const [processing, setProcessing] = useState(false);
  const threadRef = useRef(null);
  const responseTimerRef = useRef(null);
  const flow = kind ? creationFlows[kind] : null;
  const kindMeta = workstreamKinds.find((item) => item.value === kind);
  const plan = kind
    ? creationPlans[kind].map((item, index) => ({
        ...item,
        status:
          step >= 2 && index < 2
            ? "completed"
            : step >= 2 && index === 2
              ? "waiting"
              : "pending",
      }))
    : [];

  useEffect(() => {
    if (!messages.length) return;
    const frame = window.requestAnimationFrame(() => {
      threadRef.current?.scrollTo({
        top: threadRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages.length, step]);

  useEffect(() => () => window.clearTimeout(responseTimerRef.current), []);

  const chooseKind = (value) => {
    window.clearTimeout(responseTimerRef.current);
    setKind(value);
    setStep(1);
    setMessages([]);
    setMessage("");
    setAttachments([]);
    setProcessing(false);
  };

  const send = (preset) => {
    const text = (preset || message).trim();
    if ((!text && !attachments.length) || !flow) return;
    const sentAttachments = [...attachments];
    const attachmentText = sentAttachments.length
      ? `我还会读取你附上的 ${sentAttachments.map((item) => item.name).join("、")}，并把有效信息合并到当前计划。`
      : "";
    if (processing) return;
    const thinkingId = `thinking-${Date.now()}`;
    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: text || "请结合这些资料继续完善业务主线。",
        attachments: sentAttachments,
        time: "刚刚",
      },
      { id: thinkingId, processing: true },
    ]);
    setMessage("");
    setAttachments([]);
    setProcessing(true);
    responseTimerRef.current = window.setTimeout(() => {
      setMessages((current) =>
        current.map((item) =>
          item.id === thinkingId
            ? {
                role: "agent",
                text:
                  step === 1
                    ? `${attachmentText}${flow.followup}`
                    : `${attachmentText}已把新信息加入${kindMeta?.label}范围，并更新执行计划和结构化配置。你可以继续补充，或确认创建主线。`,
                time: "刚刚",
              }
            : item,
        ),
      );
      setStep((current) => Math.min(current + 1, 3));
      setProcessing(false);
    }, 800);
  };

  const addAttachment = (type) => {
    const attachment =
      type === "image"
        ? {
            id: `image-${Date.now()}`,
            type: "image",
            name: "客户聊天截图.png",
            meta: "PNG · 842 KB",
          }
        : {
            id: `file-${Date.now()}`,
            type: "file",
            name: "星澜机器人岗位补充.docx",
            meta: "DOCX · 128 KB",
          };
    setAttachments((current) => [...current, attachment]);
    toast(`${attachment.name} 已加入待发送内容`, "info");
  };

  const create = () => {
    if (kind === "position") {
      setDuplicate(true);
      return;
    }
    toast("业务主线已创建");
    navigate(`/workstreams/${kind}-new/${kind}`);
  };

  const conversationNav = (
    <WorkstreamConversationNav
      items={workstreams}
      currentId="new"
      onSelect={(item) => navigate(workstreamRoute(item))}
      onCreate={() => {
        setKind("");
        setStep(0);
        setMessages([]);
        setListOpen(false);
      }}
      collapsed={navigationCollapsed}
      onToggleCollapse={() => setNavigationCollapsed((current) => !current)}
    />
  );
  const drawerNav = (
    <WorkstreamConversationNav
      items={workstreams}
      currentId="new"
      onSelect={(item) => {
        navigate(workstreamRoute(item));
        setListOpen(false);
      }}
      onCreate={() => {
        setKind("");
        setStep(0);
        setMessages([]);
        setListOpen(false);
      }}
    />
  );

  return (
    <div className="page-content workstream-conversation-page">
      <PageHeader
        eyebrow="新建业务主线"
        title="告诉 Hunter 你要持续完成什么"
        description="Hunter 会通过对话补齐范围、授权、停止条件和完成标准，再建立可持续推进的业务主线。"
        actions={
          <Button
            className="chat-mobile-button"
            icon="panelLeft"
            onClick={() => setListOpen(true)}
          >
            业务主线
          </Button>
        }
      />
      <ConversationWorkspace
        navigation={conversationNav}
        navigationCollapsed={navigationCollapsed}
      >
        <div className="conversation-thread creation-thread" ref={threadRef}>
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
          {messages.map((item, index) =>
            item.processing ? (
              <AgentThinking
                label="Hunter 正在整理目标和执行条件"
                key={item.id}
              />
            ) : (
              <ConversationEntry
                role={item.role}
                time={item.time}
                key={`${item.role}-${index}`}
              >
                <p>{item.text}</p>
                <MessageAttachments items={item.attachments} />
              </ConversationEntry>
            ),
          )}
          {flow && step >= 2 && (
            <ConfigurationCard
              title={flow.title}
              config={flow.config}
              onEdit={() => setConfigOpen(true)}
            />
          )}
          {flow && step >= 2 && !duplicate && (
            <div className="creation-ready-actions">
              <span>
                <Icon name="check" />
                目标和范围已整理完成；确认授权与停止条件后即可创建。
              </span>
              <Button tone="primary" onClick={create}>
                确认并创建主线
              </Button>
            </div>
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
        {flow && step >= 2 && (
          <PlanListDock
            items={plan}
            title="主线创建计划"
            version={Math.max(1, step)}
            updatedAt="刚刚更新"
            defaultOpen={false}
          />
        )}
        <ConversationComposer
          value={message}
          onChange={setMessage}
          attachments={attachments}
          disabled={!flow || processing}
          processing={processing}
          onSend={() => send()}
          onAddFile={() => addAttachment("file")}
          onAddScreenshot={() => addAttachment("image")}
          onAddLink={() =>
            setMessage(
              (current) =>
                `${current}${current ? "\n" : ""}https://www.xinglan-robotics.cn/careers/vla-lead`,
            )
          }
          onRemoveAttachment={(id) =>
            setAttachments((current) =>
              current.filter((item) => item.id !== id),
            )
          }
          mode={mode}
          onModeChange={(value) => {
            setMode(value);
            toast(
              `已切换为${agentModes.find((item) => item.value === value)?.label}`,
              "info",
            );
          }}
          placeholder={
            flow
              ? `继续补充${kindMeta?.label}目标，或添加文件、截图和链接`
              : "请先选择业务主线类型"
          }
        />
      </ConversationWorkspace>
      <Drawer
        open={listOpen}
        onClose={() => setListOpen(false)}
        title="切换业务主线"
        width="360px"
      >
        {drawerNav}
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
    </div>
  );
}

function eventToDetail(event, config, kind) {
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
              : "过程详情",
    title: event.title || config.title,
    detail: event.detail || event.text,
    status: event.status || (event.type === "plan" ? "已更新" : "当前业务主线"),
    tone: event.tone || (event.type === "permission" ? "warning" : "info"),
    icon:
      event.type === "object"
        ? "database"
        : event.type === "task"
          ? "task"
          : event.type === "permission"
            ? "settings"
            : "sparkles",
    metrics: event.metrics || [
      ["所属主线", config.title],
      ["主线状态", config.status],
      ["更新时间", event.time],
    ],
    listTitle: event.scope ? "操作范围" : "关键信息",
    items: event.detailItems ||
      scopedItems ||
      event.chips || [config.next, config.assets],
    evidence: kindEvidence[kind],
    route: event.route,
    confirmLabel: event.confirmLabel,
    rejectLabel: event.secondary,
  };
}

export function WorkstreamDetailPage({ kind }) {
  const navigate = useNavigate();
  const toast = useToast();
  const config = workstreamDetails[kind];
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState(config.events);
  const [visibleCount, setVisibleCount] = useState(() =>
    firstBlockingCount(config.events),
  );
  const [attachments, setAttachments] = useState([]);
  const [plan, setPlan] = useState(config.plan);
  const [planVersion, setPlanVersion] = useState(config.planVersion);
  const [planUpdatedAt, setPlanUpdatedAt] = useState(config.planUpdatedAt);
  const [mode, setMode] = useState("edit");
  const [processing, setProcessing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [paused, setPaused] = useState(false);
  const [terminated, setTerminated] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [navigationCollapsed, setNavigationCollapsed] = useState(false);
  const [terminate, setTerminate] = useState(false);
  const threadRef = useRef(null);
  const didInitialScrollRef = useRef(false);
  const interactionTimerRef = useRef(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      threadRef.current?.scrollTo({
        top: threadRef.current.scrollHeight,
        behavior: didInitialScrollRef.current ? "smooth" : "auto",
      });
      didInitialScrollRef.current = true;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [events.length, visibleCount]);

  useEffect(() => {
    setEvents(config.events);
    setVisibleCount(firstBlockingCount(config.events));
    setSelectedEvent(null);
    setPlan(config.plan);
    setPlanVersion(config.planVersion);
    setPlanUpdatedAt(config.planUpdatedAt);
    didInitialScrollRef.current = false;
  }, [config]);

  useEffect(() => () => window.clearTimeout(interactionTimerRef.current), []);

  const visibleEvents = events.slice(0, visibleCount);
  const waitingEvent = [...visibleEvents]
    .reverse()
    .find((item) => item.blocking && !item.resolved);

  const detail = selectedEvent
    ? eventToDetail(selectedEvent, config, kind)
    : null;

  const changeMode = (value) => {
    const selected = agentModes.find((item) => item.value === value);
    setMode(value);
    setEvents((current) => {
      const updated =
        value === "auto"
          ? current.map((item) =>
              item.type === "permission" &&
              item.options?.some((option) => option.value === "mainline")
                ? {
                    ...item,
                    status: "当前业务主线已授权",
                    tone: "success",
                    options: undefined,
                    detail: `${item.detail} 已按自动执行模式在当前业务主线内授权，Hunter 强制门禁仍然生效。`,
                  }
                : item,
            )
          : current;
      const next = [
        ...updated.slice(0, visibleCount),
        {
          id: `mode-${Date.now()}`,
          type: "agent",
          time: "刚刚",
          text:
            value === "plan"
              ? "操作模式已切换为规划模式。后续只研究和生成计划，不执行外部操作或业务写入。"
              : value === "auto"
                ? "操作模式已切换为自动执行。当前业务主线已授权范围内的普通操作不再逐次询问，Hunter 强制门禁和人工业务边界保持不变。"
                : "操作模式已切换为执行模式。可以继续搜索、分析和生成草稿，敏感操作会在当前业务主线中询问。",
        },
        ...updated.slice(visibleCount),
      ];
      setVisibleCount((current) => current + 1);
      return next;
    });
    toast(`已切换为${selected?.label}`, "info");
  };

  const applyPlanUpdate = (event) => {
    if (!event.planUpdate) return;
    const { item, before } = event.planUpdate;
    setPlan((current) => {
      const existing = current.findIndex((entry) => entry.id === item.id);
      if (existing >= 0) {
        return current.map((entry, index) =>
          index === existing ? { ...entry, ...item } : entry,
        );
      }
      const beforeIndex = current.findIndex((entry) => entry.id === before);
      const next = [...current];
      next.splice(beforeIndex >= 0 ? beforeIndex : next.length, 0, item);
      return next;
    });
    setPlanVersion((current) => current + 1);
    setPlanUpdatedAt("刚刚");
  };

  const resolveEvent = (event, action, feedback) => {
    const thinkingId = `${event.id}-thinking-${Date.now()}`;
    setProcessing(true);
    setEvents((current) => {
      const index = current.findIndex((item) => item.id === event.id);
      if (index < 0) return current;
      const option = event.options?.find((item) => item.value === action);
      const rejected = action === "deny" || action === "secondary";
      const decision =
        feedback?.text ||
        option?.label ||
        (action === "primary"
          ? event.confirmLabel || event.primary || "确认并继续"
          : event.secondary || "暂不处理");
      const response =
        feedback?.response ||
        (rejected
          ? "已按你的决定保留当前状态，不会执行未获确认的操作。我会继续处理不受影响的工作。"
          : event.afterResponse ||
            "你的决定已记录。我会从当前检查点继续，并在下一次需要确认时再次停下来。");
      const resolved = {
        ...event,
        resolved: true,
        status: rejected ? "已暂缓" : "已确认",
        tone: rejected ? "neutral" : "success",
        options: undefined,
        primary: undefined,
        secondary: undefined,
        action: undefined,
      };
      const additions = [
        {
          id: `${event.id}-decision`,
          type: "user",
          time: "刚刚",
          text: decision,
          attachments: feedback?.attachments,
        },
        {
          id: thinkingId,
          type: "thinking",
          time: "刚刚",
          text: "Hunter 正在应用你的决定并检查后续步骤",
          response,
        },
      ];
      const next = [
        ...current.slice(0, index),
        resolved,
        ...additions,
        ...current.slice(index + 1),
      ];
      setVisibleCount(index + additions.length + 1);
      return next;
    });
    window.clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = window.setTimeout(() => {
      applyPlanUpdate(event);
      setEvents((current) => {
        const thinkingIndex = current.findIndex(
          (item) => item.id === thinkingId,
        );
        if (thinkingIndex < 0) return current;
        const next = current.map((item) =>
          item.id === thinkingId
            ? {
                id: `${event.id}-response`,
                type: "agent",
                time: "刚刚",
                text: item.response,
              }
            : item,
        );
        setVisibleCount(firstBlockingCount(next, thinkingIndex + 1));
        return next;
      });
      setProcessing(false);
    }, 800);
    closeDetail();
    toast(
      action === "deny" ? "操作已拒绝" : "已记录并继续推进",
      action === "deny" ? "info" : "success",
    );
  };

  const act = (event, action) => {
    if (event.route && !event.blocking) {
      selectEvent(event);
      return;
    }
    if (event.blocking) {
      resolveEvent(event, action);
      return;
    }
    setSelectedEvent(event);
  };

  const send = () => {
    const text = message.trim();
    if (!text && !attachments.length) return;
    const sentAttachments = [...attachments];
    const inputSummary =
      text || sentAttachments.map((item) => item.name).join("、");
    if (waitingEvent) {
      resolveEvent(waitingEvent, "feedback", {
        text: text || "请结合这些资料调整当前审核结果。",
        attachments: sentAttachments,
        response:
          "补充信息已收到。我已把它作为当前人工节点的反馈，并重新检查受影响范围；接下来只推进通过检查的步骤。",
      });
      setMessage("");
      setAttachments([]);
      return;
    }
    const impact = {
      id: `impact-${Date.now()}`,
      type: "impact",
      time: "刚刚",
      title: "补充信息已完成影响分析",
      detail: `Hunter 判断这条信息会影响当前阶段，将只调整相关任务和结果，不会重跑整条主线：${inputSummary}`,
      primary: "确认局部更新",
      secondary: "先不处理",
      blocking: "action",
      afterResponse:
        "影响范围已确认，我会只更新受影响的任务与结果，不重跑整条业务主线。",
    };
    const thinkingId = `thinking-${Date.now()}`;
    setProcessing(true);
    setEvents((current) => {
      const next = [
        ...current,
        {
          id: `user-${Date.now()}`,
          type: "user",
          time: "刚刚",
          text: text || "请结合这些资料继续推进。",
          attachments: sentAttachments,
        },
        {
          id: thinkingId,
          type: "thinking",
          time: "刚刚",
          text: "Hunter 正在分析新信息的影响范围",
        },
      ];
      setVisibleCount(next.length);
      return next;
    });
    window.clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = window.setTimeout(() => {
      setEvents((current) => {
        const thinkingIndex = current.findIndex(
          (item) => item.id === thinkingId,
        );
        if (thinkingIndex < 0) return current;
        const next = [
          ...current.slice(0, thinkingIndex),
          {
            id: `agent-${Date.now()}`,
            type: "agent",
            time: "刚刚",
            text: "我已经收到这条补充信息。先判断它会影响哪些正在运行的工作和已有结果，再决定是否需要局部重做。",
          },
          impact,
          ...current.slice(thinkingIndex + 1),
        ];
        setVisibleCount(thinkingIndex + 2);
        return next;
      });
      setProcessing(false);
    }, 800);
    setMessage("");
    setAttachments([]);
    toast("补充信息已加入当前业务主线", "info");
  };

  const addAttachment = (type) => {
    const attachment =
      type === "image"
        ? {
            id: `image-${Date.now()}`,
            type: "image",
            name: "客户补充截图.png",
            meta: "PNG · 612 KB",
          }
        : {
            id: `file-${Date.now()}`,
            type: "file",
            name: "岗位补充说明.docx",
            meta: "DOCX · 96 KB",
          };
    setAttachments((current) => [...current, attachment]);
    toast(`${attachment.name} 已加入待发送内容`, "info");
  };

  const selectEvent = (event) => {
    if (!event.largeResult && !event.route) return;
    setSelectedEvent(event);
    if (window.matchMedia("(max-width: 1120px)").matches) setDetailOpen(true);
  };

  const closeDetail = () => {
    setSelectedEvent(null);
    setDetailOpen(false);
  };
  const cardDetail = detail ? (
    <ConversationDetail
      preview={detail}
      onConfirm={
        selectedEvent?.blocking === "review"
          ? () => resolveEvent(selectedEvent, "primary")
          : undefined
      }
      onReject={
        selectedEvent?.blocking === "review" && selectedEvent.secondary
          ? () => resolveEvent(selectedEvent, "secondary")
          : undefined
      }
      onCopy={() => {
        navigator.clipboard
          ?.writeText(`${detail.title}\n${detail.detail}`)
          .catch(() => {});
        toast("详情摘要已复制");
      }}
      onClose={closeDetail}
    />
  ) : null;
  const conversationNav = (
    <WorkstreamConversationNav
      items={workstreams}
      currentId={workstreamIdByKind[kind]}
      onSelect={(item) => {
        navigate(workstreamRoute(item));
        setListOpen(false);
      }}
      onCreate={() => navigate("/workstreams/new")}
      collapsed={navigationCollapsed}
      onToggleCollapse={() => setNavigationCollapsed((current) => !current)}
    />
  );
  const drawerNav = (
    <WorkstreamConversationNav
      items={workstreams}
      currentId={workstreamIdByKind[kind]}
      onSelect={(item) => {
        navigate(workstreamRoute(item));
        setListOpen(false);
      }}
      onCreate={() => navigate("/workstreams/new")}
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
            {terminated ? "已终止" : paused ? "已暂停" : config.status}
          </Status>
        }
        actions={
          <>
            <Button
              className="chat-mobile-button"
              icon="panelLeft"
              onClick={() => setListOpen(true)}
            >
              业务主线
            </Button>
            <Button icon="info" onClick={() => setContextOpen(true)}>
              主线信息
            </Button>
            <Button
              icon={paused ? "play" : "pause"}
              disabled={terminated}
              onClick={() => {
                setPaused(!paused);
                toast(paused ? "业务主线已继续" : "业务主线已暂停", "info");
              }}
            >
              {terminated ? "已终止" : paused ? "继续" : "暂停"}
            </Button>
          </>
        }
      />
      <ConversationWorkspace
        navigation={conversationNav}
        navigationCollapsed={navigationCollapsed}
        detail={cardDetail}
      >
        <div className="conversation-toolbar">
          <span className="conversation-current-process">
            <small>与 Hunter 持续推进</small>
            <b>{config.next}</b>
          </span>
          <Status
            tone={terminated || paused ? "neutral" : config.tone}
            dot={false}
          >
            {terminated ? "已终止" : paused ? "已暂停" : config.status}
          </Status>
        </div>
        <div className="conversation-thread detail-thread" ref={threadRef}>
          {visibleEvents.map((event, index) => (
            <ConversationEvent
              event={event}
              onAction={act}
              onSelect={selectEvent}
              key={event.id || `${event.type}-${index}`}
            />
          ))}
          {waitingEvent && (
            <div className="conversation-waiting-note">
              <Icon name="clock" />
              <span>
                <b>等待你的反馈</b>
                <small>
                  Hunter 已暂停后续推进；处理上方内容或直接发送补充信息后继续。
                </small>
              </span>
            </div>
          )}
          {terminated && (
            <div className="conversation-waiting-note">
              <Icon name="pause" />
              <span>
                <b>业务主线已终止</b>
                <small>已确认成果和完整过程仍然保留在当前页面。</small>
              </span>
            </div>
          )}
        </div>
        <PlanListDock
          items={plan}
          version={planVersion}
          updatedAt={planUpdatedAt}
          defaultOpen={false}
        />
        <ConversationComposer
          value={message}
          onChange={setMessage}
          attachments={attachments}
          onSend={send}
          onAddFile={() => addAttachment("file")}
          onAddScreenshot={() => addAttachment("image")}
          onAddLink={() =>
            setMessage(
              (current) =>
                `${current}${current ? "\n" : ""}https://www.xinglan-robotics.cn/careers/vla-lead`,
            )
          }
          onRemoveAttachment={(id) =>
            setAttachments((current) =>
              current.filter((item) => item.id !== id),
            )
          }
          mode={mode}
          onModeChange={changeMode}
          disabled={processing || terminated}
          processing={processing}
        />
      </ConversationWorkspace>
      <Drawer
        open={listOpen}
        onClose={() => setListOpen(false)}
        title="切换业务主线"
        width="360px"
      >
        {drawerNav}
      </Drawer>
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
        open={detailOpen}
        onClose={closeDetail}
        title={selectedEvent?.largeResult ? "完整结果" : "详情"}
        width="520px"
      >
        {cardDetail}
      </Drawer>
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
                setTerminate(false);
                setContextOpen(false);
                setTerminated(true);
                setPaused(true);
                toast("业务主线已终止");
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
