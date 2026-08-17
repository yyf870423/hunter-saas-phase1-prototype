import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  DateRange,
  Modal,
  PageHeader,
  Segmented,
  Status,
  useToast,
} from "../components/ui";
import { Icon } from "../components/Icon";
import { toneForStatus } from "../components/business";
import { signals, tasks, workstreams } from "../data/demo";

const actionItems = [
  {
    id: "contact",
    category: "decision",
    priority: "高优先级",
    tone: "warning",
    icon: "message",
    title: "确认是否联系星澜机器人 HRD 周雅雯",
    source: "客户开发 · 星澜机器人招聘机会",
    reason: "联系草稿已就绪；今天处理可以继续澄清 2 个潜在 HC。",
    due: "今天 11:20 前",
    action: "审核联系内容",
    route: "/workstreams/client-xinglan/client",
  },
  {
    id: "review",
    category: "decision",
    priority: "等待确认",
    tone: "info",
    icon: "users",
    title: "审核 VLA 岗位首批 18 位候选人",
    source: "岗位招聘 · 具身智能 VLA 算法负责人",
    reason: "12 位推荐、4 位有条件匹配、2 位不建议；审核后才能开始沟通。",
    due: "建议今天完成",
    action: "开始审核",
    route: "/workstreams/position-vla/position",
  },
  {
    id: "reply",
    category: "reply",
    priority: "新回复",
    tone: "success",
    icon: "message",
    title: "候选人林昊已发送最新版简历",
    source: "候选人求职 · 林昊下一份工作",
    reason: "需要确认资料更新建议，并局部重算 6 个岗位匹配。",
    due: "18 分钟前收到",
    action: "处理新资料",
    route: "/communications/comm-linhao",
  },
  {
    id: "platform",
    category: "issue",
    priority: "阻塞任务",
    tone: "danger",
    icon: "warning",
    title: "脉脉登录失效，1 个寻访任务已暂停",
    source: "平台账号 · 脉脉",
    reason: "检查点和已读取结果均已保留；重新登录后可以继续。",
    due: "9 分钟前",
    action: "处理平台登录",
    route: "/account/platforms",
  },
  {
    id: "signal",
    category: "signal",
    priority: "重点信号",
    tone: "violet",
    icon: "signal",
    title: "云脉芯能成立机器人芯片团队",
    source: "机会与信号 · 公司变化",
    reason: "可能适合建立客户开发主线，也可先加入具身智能人才摸排。",
    due: "今天 08:46",
    action: "判断是否行动",
    route: "/signals/signal-team",
  },
];

const routeForWorkstream = (item) =>
  `/workstreams/${item.id}/${item.type === "客户开发" ? "client" : item.type === "岗位招聘" ? "position" : item.type === "人才摸排" ? "mapping" : "career"}`;

export function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const [range, setRange] = useState("today");
  const [date, setDate] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [decision, setDecision] = useState(null);
  const [taskView, setTaskView] = useState("running");
  const filteredActions = useMemo(
    () =>
      actionFilter === "all"
        ? actionItems
        : actionItems.filter((item) => item.category === actionFilter),
    [actionFilter],
  );
  const taskGroups = {
    running: tasks.slice(0, 3),
    waiting: [
      tasks[0],
      { ...tasks[2], status: "等待外部", action: "等待候选人回复" },
    ],
    error: [
      {
        ...tasks[1],
        title: "脉脉人才寻访",
        status: "已暂停",
        action: "登录状态失效，检查点已保留",
      },
    ],
  };

  return (
    <div className="page-content dashboard-page">
      <PageHeader
        eyebrow="2026 年 8 月 17 日 · 星期一"
        title="上午好，沈岚"
        description="先处理会阻塞业务推进的事项，再查看主线进度和新发现。"
        actions={
          <>
            <Segmented
              value={range}
              onChange={setRange}
              items={[
                { value: "today", label: "今天" },
                { value: "week", label: "本周" },
              ]}
            />
            <DateRange value={date} onChange={setDate} width="184px" />
            <Button
              tone="primary"
              icon="plus"
              onClick={() => navigate("/workstreams/new")}
            >
              新建业务主线
            </Button>
          </>
        }
      />

      <section className="dashboard-status-strip">
        <button onClick={() => setActionFilter("all")}>
          <span>
            <Icon name="task" />
            待你处理
          </span>
          <b>8</b>
          <small>3 项阻塞推进</small>
        </button>
        <button onClick={() => setTaskView("running")}>
          <span>
            <Icon name="play" />
            正在执行
          </span>
          <b>3</b>
          <small>预计今日完成 2 个</small>
        </button>
        <button onClick={() => setTaskView("waiting")}>
          <span>
            <Icon name="clock" />
            外部等待
          </span>
          <b>5</b>
          <small>收到 2 条新回复</small>
        </button>
        <button onClick={() => navigate("/assets")}>
          <span>
            <Icon name="check" />
            本月确认成果
          </span>
          <b>42</b>
          <small>较上月同期 +18%</small>
        </button>
      </section>

      <section className="page-section surface dashboard-action-queue">
        <header className="surface-header">
          <div>
            <h2>行动队列</h2>
            <span className="muted">
              不同来源的待办统一按业务影响和时效排序
            </span>
          </div>
          <button
            className="link"
            onClick={() => navigate("/tasks?status=waiting")}
          >
            查看全部待办
          </button>
        </header>
        <div className="action-queue-filters">
          <Segmented
            value={actionFilter}
            onChange={setActionFilter}
            items={[
              { value: "all", label: "全部 8" },
              { value: "decision", label: "需要确认 3" },
              { value: "reply", label: "新回复 2" },
              { value: "issue", label: "异常 1" },
              { value: "signal", label: "信号 2" },
            ]}
          />
        </div>
        <div className="action-queue-list">
          {filteredActions.map((item) => (
            <article key={item.id}>
              <span className="action-queue-icon">
                <Icon name={item.icon} />
              </span>
              <div className="action-queue-copy">
                <span>
                  <Status tone={item.tone}>{item.priority}</Status>
                  <small>{item.source}</small>
                </span>
                <b>{item.title}</b>
                <p>{item.reason}</p>
              </div>
              <time>{item.due}</time>
              <Button
                size="sm"
                tone={item.tone === "danger" ? "dangerGhost" : "secondary"}
                onClick={() => setDecision(item)}
              >
                {item.action}
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section dashboard-primary-grid">
        <div className="surface">
          <header className="surface-header">
            <div>
              <h2>正在推进的业务主线</h2>
              <span className="muted">
                显示目标、当前并行工作、阻塞和下一步
              </span>
            </div>
            <button className="link" onClick={() => navigate("/workstreams")}>
              全部主线
            </button>
          </header>
          <div className="dashboard-workstream-table">
            {workstreams.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(routeForWorkstream(item))}
              >
                <i>
                  <Icon
                    name={
                      item.type === "客户开发"
                        ? "building"
                        : item.type === "岗位招聘"
                          ? "briefcase"
                          : item.type === "人才摸排"
                            ? "users"
                            : "user"
                    }
                  />
                </i>
                <span className="workstream-main">
                  <small>{item.type}</small>
                  <b>{item.target}</b>
                  <em>{item.object}</em>
                </span>
                <span className="workstream-current">
                  <small>当前并行工作</small>
                  <b>
                    {item.running
                      ? `${item.running} 个任务运行`
                      : "暂无运行任务"}
                  </b>
                  <em>{item.waiting}</em>
                </span>
                <span className="workstream-next">
                  <Status tone={toneForStatus(item.status)}>
                    {item.status}
                  </Status>
                  <small>下一步</small>
                  <b>{item.next}</b>
                </span>
                <Icon name="chevronRight" />
              </button>
            ))}
          </div>
        </div>
        <aside className="surface dashboard-task-panel">
          <header className="surface-header">
            <h2>Agent 与外部等待</h2>
            <button className="link" onClick={() => navigate("/tasks")}>
              任务中心
            </button>
          </header>
          <div className="dashboard-task-tabs">
            <Segmented
              value={taskView}
              onChange={setTaskView}
              items={[
                { value: "running", label: "运行 3" },
                { value: "waiting", label: "等待 5" },
                { value: "error", label: "异常 1" },
              ]}
            />
          </div>
          <div className="dashboard-task-list">
            {taskGroups[taskView].map((task, index) => (
              <button
                key={`${task.id}-${index}`}
                onClick={() => navigate(`/tasks/${task.id}`)}
              >
                <span>
                  <b>{task.title}</b>
                  <small>{task.action}</small>
                </span>
                <Status tone={toneForStatus(task.status)}>{task.status}</Status>
              </button>
            ))}
          </div>
          <div className="dashboard-wait-note">
            <Icon name="info" />
            <span>等待外部回复的主线不会持续消耗 Agent 用量。</span>
          </div>
        </aside>
      </section>

      <section className="page-section surface dashboard-discoveries">
        <header className="surface-header">
          <div>
            <h2>新发现</h2>
            <span className="muted">
              尚未阻塞当前工作，判断后再创建支线或加入已有主线
            </span>
          </div>
          <button className="link" onClick={() => navigate("/signals")}>
            全部信号
          </button>
        </header>
        <div>
          {signals.slice(0, 3).map((signal) => (
            <button
              key={signal.id}
              onClick={() => navigate(`/signals/${signal.id}`)}
            >
              <Icon name="signal" />
              <span>
                <b>{signal.title}</b>
                <small>
                  {signal.object} · {signal.time}
                </small>
              </span>
              <Status tone={signal.priority === "高" ? "warning" : "neutral"}>
                {signal.priority === "高" ? "建议关注" : signal.status}
              </Status>
              <Icon name="chevronRight" />
            </button>
          ))}
        </div>
      </section>

      <div className="banner banner-warning dashboard-expiry">
        <Icon name="warning" />
        <span>
          <b>试用权益将在 15 天后到期</b>
          <small>到期后仍可查看和导出数据，Agent 与外部联系将暂停。</small>
        </span>
        <button
          className="link"
          onClick={() => navigate("/account/subscription")}
        >
          查看权益
        </button>
      </div>

      <Modal
        open={Boolean(decision)}
        onClose={() => setDecision(null)}
        title="处理当前事项"
        description={decision?.title}
        footer={
          <>
            <Button
              onClick={() => {
                toast("已设为稍后处理", "info");
                setDecision(null);
              }}
            >
              稍后处理
            </Button>
            <Button
              tone="primary"
              onClick={() => {
                const route = decision?.route;
                setDecision(null);
                if (route) navigate(route);
              }}
            >
              进入处理
            </Button>
          </>
        }
      >
        <div className="decision-summary">
          <Status tone={decision?.tone}>{decision?.priority}</Status>
          <p>{decision?.reason}</p>
          <div className="privacy-note">
            <Icon name="info" />
            <span>
              进入详情后可以查看证据、影响范围和已完成工作，再决定是否确认。
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
