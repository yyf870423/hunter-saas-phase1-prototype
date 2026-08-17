import { Icon } from "./Icon";
import { Button, IconButton, Progress, Status } from "./ui";

export const toneForStatus = (status) => {
  if (
    [
      "完成",
      "已完成",
      "已确认",
      "已回复",
      "健康",
      "正常",
      "授权",
      "已通过",
      "已入职",
      "生效",
    ].some((word) => status?.includes(word))
  )
    return "success";
  if (
    ["失败", "失效", "拒绝", "受限", "已终止"].some((word) =>
      status?.includes(word),
    )
  )
    return "danger";
  if (
    ["等待", "待处理", "待审核", "待澄清", "重试", "暂停", "需补充"].some(
      (word) => status?.includes(word),
    )
  )
    return "warning";
  if (
    ["运行", "推进", "招聘", "维护", "观察"].some((word) =>
      status?.includes(word),
    )
  )
    return "info";
  return "neutral";
};

export function InfoGrid({ items, columns = 2 }) {
  return (
    <dl
      className={`info-grid info-columns-${columns}`}
      style={{ "--info-columns": columns }}
    >
      {items.map(([label, value, span], index) => (
        <div className={span ? "info-span" : ""} key={`${label}-${index}`}>
          <dt>{label}</dt>
          <dd>{value || "待补充"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EvidenceList({ items }) {
  return (
    <div className="evidence-list">
      {items.map((item, index) => (
        <button key={`${item.title}-${index}`}>
          <i>
            <Icon name={item.icon || "link"} />
          </i>
          <span>
            <b>{item.title}</b>
            <small>{item.source}</small>
          </span>
          <Status tone={item.verified === false ? "warning" : "success"}>
            {item.verified === false ? "待核验" : "已核验"}
          </Status>
          <Icon name="chevronRight" />
        </button>
      ))}
    </div>
  );
}

export function ActivityTimeline({ items }) {
  return (
    <ol className="activity-timeline">
      {items.map((item, index) => (
        <li key={`${item.time}-${index}`}>
          <i className={`timeline-${item.tone || "neutral"}`}>
            <Icon
              name={
                item.tone === "success"
                  ? "check"
                  : item.tone === "danger"
                    ? "warning"
                    : "clock"
              }
            />
          </i>
          <article>
            <time>{item.time}</time>
            <b>{item.title}</b>
            <p>{item.detail}</p>
            {item.action && (
              <Button tone="ghost" size="sm" onClick={item.action.onClick}>
                {item.action.label}
              </Button>
            )}
          </article>
        </li>
      ))}
    </ol>
  );
}

export function SummaryList({ items, onOpen }) {
  return (
    <div className="summary-list">
      {items.map((item, index) => (
        <button key={`${item.title}-${index}`} onClick={() => onOpen?.(item)}>
          <i className={`summary-tone-${item.tone || "neutral"}`}>
            <Icon name={item.icon || "task"} />
          </i>
          <span>
            <b>{item.title}</b>
            <small>{item.meta}</small>
          </span>
          {item.status && (
            <Status tone={toneForStatus(item.status)}>{item.status}</Status>
          )}
          <Icon name="chevronRight" />
        </button>
      ))}
    </div>
  );
}

export function WorkstreamBoard({ stages, onMove }) {
  return (
    <div className="workstream-board">
      {stages.map((stage) => (
        <section data-stage={stage.kind} key={stage.id}>
          <header>
            <div>
              <b>{stage.title}</b>
              <small>{stage.description}</small>
            </div>
            <em>{stage.items.length}</em>
          </header>
          <div>
            {stage.items.map((item) => (
              <article
                draggable
                key={item.id}
                onDragStart={(event) =>
                  event.dataTransfer.setData(
                    "text/plain",
                    JSON.stringify({ itemId: item.id, stageId: stage.id }),
                  )
                }
              >
                <span>
                  <b>{item.title}</b>
                  <IconButton icon="more" label="更多操作" />
                </span>
                <p>{item.detail}</p>
                <footer>
                  <small>{item.meta}</small>
                  {item.status && (
                    <Status tone={toneForStatus(item.status)}>
                      {item.status}
                    </Status>
                  )}
                </footer>
              </article>
            ))}
          </div>
          <button
            className="lane-drop"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const payload = JSON.parse(
                event.dataTransfer.getData("text/plain"),
              );
              onMove?.(payload.itemId, payload.stageId, stage.id);
            }}
          >
            拖到这里更新阶段
          </button>
        </section>
      ))}
    </div>
  );
}

export function TaskProcess({ events, onOpen }) {
  return (
    <div className="task-process">
      {events.map((event, index) => (
        <button key={`${event.title}-${index}`} onClick={() => onOpen?.(event)}>
          <time>{event.time}</time>
          <i className={`event-${event.tone || "info"}`}>
            <Icon
              name={
                event.icon ||
                (event.tone === "success"
                  ? "check"
                  : event.tone === "danger"
                    ? "warning"
                    : "task")
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
  );
}

export function CandidateMatchCard({ candidate, onOpen, onProgress }) {
  return (
    <article className="match-card">
      <header>
        <div className="avatar large">{candidate.name.slice(-1)}</div>
        <span>
          <h3>{candidate.name}</h3>
          <p>
            {candidate.company} · {candidate.title}
          </p>
        </span>
        <strong>{candidate.score}</strong>
      </header>
      <div className="tag-list">
        {candidate.skills.map((skill) => (
          <span className="tag" key={skill}>
            {skill}
          </span>
        ))}
      </div>
      <section>
        <Progress value={candidate.score} label="综合匹配" />
        <p>核心技术方向与岗位高度重合；职级和团队规模需要在首次沟通中确认。</p>
      </section>
      <footer>
        <Button tone="secondary" onClick={onOpen}>
          查看候选人
        </Button>
        <Button tone="primary" onClick={onProgress}>
          进入推进
        </Button>
      </footer>
    </article>
  );
}

export function StatStrip({ items }) {
  return (
    <div className="stat-strip">
      {items.map(([label, value, tone], index) => (
        <div key={`${label}-${index}`}>
          <span className={`stat-${tone || "neutral"}`}>{value}</span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}
