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

export function CreationProgress({ kind, step, mode }) {
  const selectedMode = agentModes.find((item) => item.value === mode);
  const steps = [
    ["选择业务目标", Boolean(kind)],
    ["补齐范围和完成标准", step >= 2],
    ["检查授权和停止条件", step >= 2],
    ["确认创建业务主线", step >= 3],
  ];
  return (
    <aside className="creation-progress" aria-label="创建进度">
      <header>
        <span>
          <small>新建业务主线</small>
          <b>创建进度</b>
        </span>
        <Status tone={step >= 3 ? "success" : "info"}>
          {step >= 3 ? "可创建" : "准备中"}
        </Status>
      </header>
      <div className="creation-progress-scroll">
        <ol>
          {steps.map(([label, complete], index) => (
            <li className={complete ? "is-complete" : ""} key={label}>
              <i>{complete ? <Icon name="check" /> : index + 1}</i>
              <span>
                <b>{label}</b>
                <small>{complete ? "已完成" : "等待补充"}</small>
              </span>
            </li>
          ))}
        </ol>
        <section>
          <small>Agent 操作模式</small>
          <b>{selectedMode?.label}</b>
          <p>{selectedMode?.description}</p>
        </section>
        <div className="draft-save-note">
          <Icon name="check" />
          <span>当前内容自动保存；返回业务主线列表后可以继续。</span>
        </div>
      </div>
    </aside>
  );
}

export function ConversationDetail({ preview, onOpen, onCopy, onClose }) {
  return (
    <aside className="conversation-detail" aria-label="卡片详情">
      <header>
        <span>
          <small>{preview.eyebrow}</small>
          <b>{preview.title}</b>
        </span>
        <div>
          {onOpen && (
            <IconButton icon="maximize" label="打开完整内容" onClick={onOpen} />
          )}
          <IconButton icon="close" label="关闭卡片详情" onClick={onClose} />
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
          <Button size="sm" icon="copy" onClick={onCopy}>
            复制摘要
          </Button>
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
}) {
  const classes = [
    "conversation-workspace",
    navigation ? "has-navigation" : "",
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

export function ConversationComposer({
  value,
  onChange,
  onSend,
  onAttach,
  disabled = false,
  processing = false,
  placeholder = "补充目标、要求、链接或新的业务信息",
  mode = "edit",
  onModeChange = () => {},
}) {
  return (
    <div className="conversation-composer">
      <textarea
        aria-label="发送给 Hunter"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (value.trim() && !disabled) onSend();
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
            onClick={onAttach}
          />
          <IconButton
            icon="link"
            label="添加链接"
            disabled={disabled}
            onClick={onAttach}
          />
          <span>Enter 发送 · Shift + Enter 换行</span>
        </div>
        <Button
          tone="primary"
          icon="send"
          disabled={disabled || !value.trim()}
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
      <span className="conversation-avatar">
        <Icon name={role === "user" ? "user" : "route"} />
      </span>
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

export function BusinessEventCard({ event, onAction, onSelect }) {
  const [icon, label] = eventAppearance[event.type] || ["info", "运行记录"];
  return (
    <article className={`business-event business-event-${event.type}`}>
      <header>
        <button
          type="button"
          onClick={() => onSelect?.(event)}
          aria-label={`查看详情：${event.title}`}
        >
          <span className="business-event-icon">
            <Icon name={icon} />
          </span>
          <span>
            <small>{label}</small>
            <b>{event.title}</b>
          </span>
          <time>{event.time}</time>
          {onSelect && <Icon name="panelRight" />}
        </button>
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
          {(event.primary || event.action) && (
            <Button
              size="sm"
              tone={event.type === "approval" ? "primary" : "secondary"}
              onClick={() => onAction(event, "primary")}
            >
              {event.primary || event.action}
            </Button>
          )}
        </div>
      </footer>
    </article>
  );
}

export function ConversationEvent({ event, onAction, onSelect }) {
  if (event.type === "user") {
    return (
      <ConversationEntry role="user" time={event.time}>
        <p>{event.text}</p>
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
  return (
    <BusinessEventCard event={event} onAction={onAction} onSelect={onSelect} />
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

export function ConfigurationCard({ title, config, onEdit }) {
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
        <Button size="sm" icon="edit" onClick={onEdit}>
          修改配置
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
