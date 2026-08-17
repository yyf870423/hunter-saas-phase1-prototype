import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { Button, IconButton, Status } from "./ui";

export const agentModes = [
  {
    value: "plan",
    label: "规划模式",
    icon: "route",
    description: "只研究和生成计划，不执行外部操作或业务写入。",
  },
  {
    value: "edit",
    label: "执行模式",
    icon: "edit",
    description: "执行搜索、分析和草稿操作；敏感操作前询问。",
  },
  {
    value: "auto",
    label: "自动执行",
    icon: "play",
    description: "在当前业务主线授权范围内不逐次询问，强制门禁仍生效。",
  },
];

export function AgentModeSelect({ value, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected =
    agentModes.find((item) => item.value === value) || agentModes[1];
  useEffect(() => {
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const closeWithEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, []);
  return (
    <div className={`agent-mode-select ${open ? "is-open" : ""}`} ref={ref}>
      <button
        type="button"
        aria-label="Agent 操作模式"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name={selected.icon} />
        <span>{selected.label}</span>
        <Icon name="chevronDown" />
      </button>
      {open && (
        <div className="agent-mode-panel">
          <header>
            <b>Agent 操作模式</b>
            <small>仅影响当前业务主线</small>
          </header>
          {agentModes.map((item) => (
            <button
              type="button"
              className={value === item.value ? "is-selected" : ""}
              key={item.value}
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
            >
              <i>
                <Icon name={item.icon} />
              </i>
              <span>
                <b>{item.label}</b>
                <small>{item.description}</small>
              </span>
              {value === item.value && <Icon name="check" />}
            </button>
          ))}
          <footer>
            <Icon name="info" />
            <span>任何模式都不能关闭 Hunter 的安全、质量和预算门禁。</span>
          </footer>
        </div>
      )}
    </div>
  );
}

const planStatus = {
  completed: ["已完成", "success", "check"],
  running: ["进行中", "info", "play"],
  waiting: ["等待", "warning", "clock"],
  pending: ["未开始", "neutral", "more"],
};

export function PlanListDock({
  items,
  title = "执行计划",
  updatedAt = "刚刚更新",
  version = 1,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const completed = items.filter((item) => item.status === "completed").length;
  return (
    <section className={`plan-list-dock ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="plan-list-toggle"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <i>
          <Icon name="task" />
        </i>
        <span>
          <b>{title}</b>
          <small>
            {completed} / {items.length} 已完成 · v{version} · {updatedAt}
          </small>
        </span>
        <Icon name="chevronDown" />
      </button>
      {open && (
        <ol>
          {items.map((item, index) => {
            const [label, tone, icon] =
              planStatus[item.status] || planStatus.pending;
            return (
              <li className={`is-${item.status}`} key={item.id || item.title}>
                <i>
                  {item.status === "pending" ? index + 1 : <Icon name={icon} />}
                </i>
                <span>
                  <b>{item.title}</b>
                  <small>{item.detail}</small>
                </span>
                <Status tone={tone} dot={false}>
                  {label}
                </Status>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

export function MessageAttachments({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="message-attachments">
      {items.map((item) => (
        <span key={item.id || item.name}>
          <Icon name={item.type === "image" ? "image" : "file"} />
          <i>
            <b>{item.name}</b>
            <small>{item.meta}</small>
          </i>
        </span>
      ))}
    </div>
  );
}

function ComposerAttachments({ items = [], onRemove }) {
  if (!items.length) return null;
  return (
    <div className="composer-attachments" aria-label="待发送附件">
      {items.map((item) => (
        <span key={item.id || item.name}>
          <Icon name={item.type === "image" ? "image" : "file"} />
          <b>{item.name}</b>
          <IconButton
            icon="close"
            label={`移除 ${item.name}`}
            onClick={() => onRemove(item.id)}
          />
        </span>
      ))}
    </div>
  );
}

export function ConversationDetail({
  preview,
  onOpen,
  onCopy,
  onClose,
  onConfirm,
  onReject,
}) {
  return (
    <aside className="conversation-detail" aria-label="大结果审核">
      <header>
        <span>
          <small>{preview.eyebrow}</small>
          <b>{preview.title}</b>
        </span>
        <div>
          {onOpen && (
            <IconButton icon="maximize" label="打开完整内容" onClick={onOpen} />
          )}
          <IconButton icon="close" label="关闭大结果审核" onClick={onClose} />
        </div>
      </header>
      <div className="conversation-detail-scroll">
        <section className={`preview-hero preview-${preview.tone || "info"}`}>
          <span>
            <Icon name={preview.icon || "sparkles"} />
          </span>
          <div>
            {preview.status && (
              <Status tone={preview.tone || "info"}>{preview.status}</Status>
            )}
            <p>{preview.detail}</p>
          </div>
        </section>
        {preview.metrics?.length ? (
          <dl className="preview-metrics">
            {preview.metrics.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {preview.items?.length ? (
          <section className="preview-section">
            <h3>{preview.listTitle || "关键内容"}</h3>
            <ul>
              {preview.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {preview.evidence?.length ? (
          <section className="preview-section">
            <h3>证据与来源</h3>
            <div className="preview-evidence">
              {preview.evidence.map((item) => (
                <button type="button" key={item} onClick={onCopy}>
                  <Icon name="file" />
                  <span>{item}</span>
                  <Icon name="copy" />
                </button>
              ))}
            </div>
          </section>
        ) : null}
        <div className="preview-actions">
          {onReject && (
            <Button size="sm" onClick={onReject}>
              {preview.rejectLabel || "暂不处理"}
            </Button>
          )}
          <Button size="sm" icon="copy" onClick={onCopy}>
            复制摘要
          </Button>
          {onConfirm && (
            <Button size="sm" tone="primary" onClick={onConfirm}>
              {preview.confirmLabel || "确认并继续"}
            </Button>
          )}
          {onOpen && (
            <Button size="sm" tone="primary" onClick={onOpen}>
              打开完整内容
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}

export function ConversationWorkspace({
  children,
  navigation,
  preview,
  detail,
  navigationCollapsed = false,
}) {
  const classes = [
    "conversation-workspace",
    navigation ? "has-navigation" : "",
    navigationCollapsed ? "navigation-collapsed" : "",
    preview ? "has-preview" : "",
    detail ? "has-detail" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <section className={classes}>
      {navigation && (
        <div className="mainline-conversation-navigation">{navigation}</div>
      )}
      <div className="mainline-conversation-main">{children}</div>
      {preview && (
        <div className="mainline-conversation-preview">{preview}</div>
      )}
      {detail && <div className="mainline-conversation-detail">{detail}</div>}
    </section>
  );
}

const workstreamTone = {
  等待用户: "warning",
  推进中: "info",
  维护中: "violet",
  等待外部: "neutral",
};

export function WorkstreamConversationNav({
  items,
  currentId,
  onSelect,
  onCreate,
  collapsed = false,
  onToggleCollapse,
}) {
  return (
    <nav
      className={`workstream-conversation-nav ${collapsed ? "is-collapsed" : ""}`}
      aria-label="业务主线"
    >
      <header>
        {!collapsed && (
          <span>
            <b>业务主线</b>
            <small>{items.length} 条持续业务</small>
          </span>
        )}
        <div>
          {!collapsed && (
            <IconButton icon="plus" label="新建业务主线" onClick={onCreate} />
          )}
          {onToggleCollapse && (
            <IconButton
              icon={collapsed ? "panelRight" : "panelLeft"}
              label={collapsed ? "展开业务主线" : "收起业务主线"}
              onClick={onToggleCollapse}
            />
          )}
        </div>
      </header>
      {!collapsed && (
        <div className="workstream-conversation-list">
          {items.map((item) => (
            <button
              type="button"
              className={item.id === currentId ? "is-active" : ""}
              key={item.id}
              onClick={() => onSelect(item)}
            >
              <span>
                <b>{item.target}</b>
                <time>{item.changed}</time>
              </span>
              <small>{item.type}</small>
              <p>{item.waiting}</p>
              <Status tone={workstreamTone[item.status] || "neutral"}>
                {item.status}
              </Status>
            </button>
          ))}
        </div>
      )}
      {collapsed && (
        <button
          type="button"
          className="collapsed-workstream-context"
          aria-label="展开当前业务主线"
          onClick={onToggleCollapse}
        >
          <Icon name="route" />
          <span>
            {items.find((item) => item.id === currentId)?.target || "新主线"}
          </span>
        </button>
      )}
    </nav>
  );
}

export function ConversationComposer({
  value,
  onChange,
  onSend,
  attachments = [],
  onAddFile,
  onAddScreenshot,
  onAddLink,
  onRemoveAttachment,
  disabled = false,
  processing = false,
  placeholder = "补充目标、要求、链接或新的业务信息",
  mode = "edit",
  onModeChange = () => {},
}) {
  return (
    <div className="conversation-composer">
      <ComposerAttachments items={attachments} onRemove={onRemoveAttachment} />
      <textarea
        aria-label="发送给 Hunter"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if ((value.trim() || attachments.length) && !disabled) onSend();
          }
        }}
      />
      <footer>
        <div>
          <AgentModeSelect
            value={mode}
            onChange={onModeChange}
            disabled={disabled}
          />
          <IconButton
            icon="file"
            label="添加文件"
            disabled={disabled}
            onClick={onAddFile}
          />
          <IconButton
            icon="image"
            label="添加截图"
            disabled={disabled}
            onClick={onAddScreenshot}
          />
          <IconButton
            icon="link"
            label="添加链接"
            disabled={disabled}
            onClick={onAddLink}
          />
          <span>Enter 发送 · Shift + Enter 换行</span>
        </div>
        <Button
          tone="primary"
          icon="send"
          disabled={disabled || (!value.trim() && !attachments.length)}
          loading={processing}
          onClick={onSend}
        >
          发送
        </Button>
      </footer>
    </div>
  );
}

export function ConversationEntry({ role = "agent", time, children }) {
  return (
    <article className={`conversation-entry conversation-entry-${role}`}>
      <div>
        <header>
          <b>{role === "user" ? "你" : "Hunter"}</b>
          <time>{time}</time>
        </header>
        <div className="conversation-bubble">{children}</div>
      </div>
    </article>
  );
}

export function AgentThinking({ label = "Hunter 正在整理下一步" }) {
  return (
    <ConversationEntry time="刚刚">
      <div className="agent-thinking" role="status" aria-live="polite">
        <span>
          <i />
          <i />
          <i />
        </span>
        <b>{label}</b>
      </div>
    </ConversationEntry>
  );
}

const eventAppearance = {
  plan: ["route", "计划更新"],
  task: ["task", "任务运行"],
  result: ["check", "阶段结果"],
  object: ["database", "业务成果"],
  approval: ["user", "等待你处理"],
  wait: ["clock", "外部等待"],
  branch: ["signal", "支线建议"],
  impact: ["refresh", "影响分析"],
  permission: ["settings", "操作授权"],
};

export function InlineDataTable({ data }) {
  if (!data?.columns?.length || !data?.rows?.length) return null;
  return (
    <section className="inline-data" aria-label={data.title || "结构化数据"}>
      {data.title && (
        <header>
          <b>{data.title}</b>
          {data.summary && <small>{data.summary}</small>}
        </header>
      )}
      <div className="inline-data-scroll">
        <table>
          <thead>
            <tr>
              {data.columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, index) => (
              <tr key={row.id || index}>
                {data.columns.map((column) => (
                  <td key={column.key}>{row[column.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.note && <p className="inline-data-note">{data.note}</p>}
    </section>
  );
}

export function BusinessEventCard({ event, onAction, onSelect }) {
  const [icon, label] = eventAppearance[event.type] || ["info", "运行记录"];
  const headerContent = (
    <>
      <span className="business-event-icon">
        <Icon name={icon} />
      </span>
      <span>
        <small>{label}</small>
        <b>{event.title}</b>
      </span>
      <time>{event.time}</time>
      {onSelect && <Icon name="panelRight" />}
    </>
  );
  return (
    <article
      className={`business-event business-event-${event.type} ${event.resolved ? "is-resolved" : ""}`}
    >
      <header>
        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(event)}
            aria-label={`查看详情：${event.title}`}
          >
            {headerContent}
          </button>
        ) : (
          <div>{headerContent}</div>
        )}
      </header>
      <p>{event.detail}</p>
      {event.chips?.length ? (
        <div className="event-chips">
          {event.chips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      ) : null}
      {event.scope?.length ? (
        <dl className="permission-scope">
          {event.scope.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <footer>
        {event.status ? (
          <Status tone={event.tone || "neutral"}>{event.status}</Status>
        ) : (
          <span />
        )}
        <div>
          {!event.resolved &&
            event.options?.map((option) => (
              <Button
                key={option.value}
                size="sm"
                tone={option.tone || "secondary"}
                onClick={() => onAction(event, option.value)}
              >
                {option.label}
              </Button>
            ))}
          {!event.resolved && event.secondary && (
            <Button size="sm" onClick={() => onAction(event, "secondary")}>
              {event.secondary}
            </Button>
          )}
          {!event.resolved && (event.primary || event.action) && (
            <Button
              size="sm"
              tone={event.blocking === "review" ? "primary" : "secondary"}
              onClick={() =>
                event.blocking === "review"
                  ? onSelect?.(event)
                  : onAction(event, "primary")
              }
            >
              {event.primary || event.action}
            </Button>
          )}
        </div>
      </footer>
    </article>
  );
}

function MarkdownEvent({ event, onAction, onSelect }) {
  const [, label] = eventAppearance[event.type] || ["info", "进展更新"];
  const hasDecision =
    !event.resolved &&
    (event.options?.length || event.secondary || event.primary || event.action);
  return (
    <ConversationEntry time={event.time}>
      <div
        className={`markdown-message ${event.blocking ? "has-decision" : ""}`}
      >
        <small className="markdown-eyebrow">{label}</small>
        <h3>{event.title || label}</h3>
        <p>{event.detail || event.text}</p>
        {event.metrics?.length ? (
          <dl className="inline-metrics">
            {event.metrics.map(([metricLabel, value]) => (
              <div key={metricLabel}>
                <dt>{metricLabel}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {event.chips?.length ? (
          <ul>
            {event.chips.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {event.scope?.length ? (
          <dl className="inline-scope">
            {event.scope.map(([scopeLabel, value]) => (
              <div key={scopeLabel}>
                <dt>{scopeLabel}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <InlineDataTable data={event.inlineData} />
        {event.largeResult && !event.resolved && (
          <button
            type="button"
            className="large-result-link"
            onClick={() => onSelect(event)}
            aria-label={`查看大结果：${event.title}`}
          >
            <span>
              <b>{event.action || "查看完整结果"}</b>
              <small>
                {event.largeResultHint ||
                  "在宽幅审核区查看、筛选并处理完整数据"}
              </small>
            </span>
            <Icon name="panelRight" />
          </button>
        )}
        <footer>
          {event.status && (
            <Status tone={event.tone || "neutral"}>{event.status}</Status>
          )}
          {event.route && !event.largeResult && !event.blocking && (
            <Button
              size="sm"
              tone="ghost"
              icon="chevronRight"
              onClick={() => onAction(event, "primary")}
            >
              {event.action || "查看详情"}
            </Button>
          )}
          {hasDecision && !event.largeResult && (
            <div className="inline-decision">
              {event.options?.map((option) => (
                <Button
                  key={option.value}
                  size="sm"
                  tone={option.tone || "secondary"}
                  onClick={() => onAction(event, option.value)}
                >
                  {option.label}
                </Button>
              ))}
              {event.secondary && (
                <Button size="sm" onClick={() => onAction(event, "secondary")}>
                  {event.secondary}
                </Button>
              )}
              {(event.primary || (event.action && event.blocking)) && (
                <Button
                  size="sm"
                  tone="primary"
                  onClick={() => onAction(event, "primary")}
                >
                  {event.confirmLabel || event.primary || event.action}
                </Button>
              )}
            </div>
          )}
        </footer>
      </div>
    </ConversationEntry>
  );
}

export function ConversationEvent({ event, onAction, onSelect }) {
  if (event.type === "user") {
    return (
      <ConversationEntry role="user" time={event.time}>
        <p>{event.text}</p>
        <MessageAttachments items={event.attachments} />
      </ConversationEntry>
    );
  }
  if (event.type === "agent") {
    return (
      <ConversationEntry time={event.time}>
        <p>{event.text}</p>
      </ConversationEntry>
    );
  }
  if (event.type === "thinking") {
    return <AgentThinking label={event.text} />;
  }
  return (
    <MarkdownEvent event={event} onAction={onAction} onSelect={onSelect} />
  );
}

export function PermissionRequestCard({ event, onAction }) {
  return (
    <BusinessEventCard
      event={{ ...event, type: "permission" }}
      onAction={onAction}
    />
  );
}

export function WorkstreamTypeChooser({ items, value, onChange }) {
  return (
    <div className="workstream-type-grid">
      {items.map((item) => (
        <button
          type="button"
          className={value === item.value ? "is-selected" : ""}
          key={item.value}
          onClick={() => onChange(item.value)}
        >
          <i>
            <Icon name={item.icon} />
          </i>
          <span>
            <b>{item.label}</b>
            <small>{item.description}</small>
          </span>
          <Icon name="chevronRight" />
        </button>
      ))}
    </div>
  );
}

export function ConfigurationCard({ title, config, onEdit, onOpen }) {
  const rows = [
    ["范围", config.scope],
    ["触发", config.trigger],
    ["确认方式", config.approval],
    ["外部联系", config.contact],
    ["停止条件", config.stop],
  ];
  return (
    <article className="conversation-config-card">
      <header>
        <span>
          <small>结构化配置</small>
          <b>{title}</b>
        </span>
        <Button
          size="sm"
          icon={onOpen ? "panelRight" : "edit"}
          onClick={onOpen || onEdit}
        >
          {onOpen ? "查看配置" : "修改配置"}
        </Button>
      </header>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function MainlineContextPanel({ config, onOpenContext }) {
  return (
    <div className="mainline-context stack">
      <section className="surface">
        <header className="surface-header">
          <h2>主线状态</h2>
          <Status tone={config.tone}>{config.status}</Status>
        </header>
        <div className="surface-body mainline-context-summary">
          <div>
            <small>当前下一步</small>
            <b>{config.next}</b>
          </div>
          <dl>
            <div>
              <dt>运行</dt>
              <dd>{config.running}</dd>
            </div>
            <div>
              <dt>等待</dt>
              <dd>{config.wait}</dd>
            </div>
            <div>
              <dt>成果</dt>
              <dd>{config.assets}</dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="surface">
        <header className="surface-header">
          <h2>目标与完成标准</h2>
          <IconButton icon="edit" label="编辑目标" onClick={onOpenContext} />
        </header>
        <div className="surface-body context-copy">
          <span>
            <small>业务目标</small>
            <p>{config.goal}</p>
          </span>
          <span>
            <small>完成标准</small>
            <p>{config.completion}</p>
          </span>
        </div>
      </section>
    </div>
  );
}
