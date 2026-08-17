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
import { SummaryList, toneForStatus } from "../components/business";
import { signals, tasks, workstreams } from "../data/demo";
import { useState } from "react";

export function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const [range, setRange] = useState("today");
  const [date, setDate] = useState("");
  const [decision, setDecision] = useState(null);
  const metricItems = [
    ["等待你处理", "8", "+3", "task", "warning"],
    ["外部等待", "5", "2 条新回复", "message", "info"],
    ["运行中的任务", "3", "预计今日完成 2 个", "play", "blue"],
    ["本月已确认成果", "42", "+18%", "check", "success"],
  ];
  const priority = [
    {
      title: "确认是否联系星澜机器人 HRD 周雅雯",
      meta: "客户开发 · 星澜机器人 · 建议今天处理",
      status: "高优先级",
      icon: "message",
      tone: "warning",
      route: "/workstreams/client-xinglan/client",
    },
    {
      title: "审核 VLA 岗位首批 18 位候选人",
      meta: "岗位招聘 · 12 位推荐 · 4 位有条件 · 2 位不建议",
      status: "等待确认",
      icon: "users",
      tone: "info",
      route: "/workstreams/position-vla/position",
    },
    {
      title: "脉脉登录失效，1 个任务已暂停",
      meta: "处理后可以从检查点继续，不重复已完成读取",
      status: "需处理",
      icon: "warning",
      tone: "danger",
      route: "/account/platforms",
    },
  ];
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="2026 年 8 月 17 日 · 星期一"
        title="上午好，沈岚"
        description="优先处理会阻塞业务主线的人工事项，等待中的主线不会持续消耗用量。"
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
      <section className="metric-grid">
        {metricItems.map(([label, value, trend, icon, tone]) => (
          <article className="metric" key={label}>
            <span>
              {label}
              <Icon name={icon} />
            </span>
            <strong>{value}</strong>
            <small className={`metric-note-${tone}`}>{trend}</small>
          </article>
        ))}
      </section>
      <section className="page-section two-column">
        <div className="surface">
          <header className="surface-header">
            <div>
              <h2>等待你处理</h2>
              <span className="muted">按业务影响和时效排序</span>
            </div>
            <button
              className="link"
              onClick={() => navigate("/tasks?status=waiting")}
            >
              查看全部
            </button>
          </header>
          <SummaryList items={priority} onOpen={(item) => setDecision(item)} />
        </div>
        <div className="surface">
          <header className="surface-header">
            <h2>重点信号</h2>
            <button className="link" onClick={() => navigate("/signals")}>
              查看全部
            </button>
          </header>
          <SummaryList
            items={signals.slice(0, 3).map((item) => ({
              title: item.title,
              meta: `${item.object} · ${item.time}`,
              status: item.priority === "高" ? "高优先级" : item.status,
              icon: "signal",
              tone: item.priority === "高" ? "warning" : "info",
              route: `/signals/${item.id}`,
            }))}
            onOpen={(item) => navigate(item.route)}
          />
        </div>
      </section>
      <section className="page-section split-layout">
        <div className="surface">
          <header className="surface-header">
            <div>
              <h2>重点业务主线</h2>
              <span className="muted">长期状态与单次任务分开显示</span>
            </div>
            <button className="link" onClick={() => navigate("/workstreams")}>
              全部主线
            </button>
          </header>
          <div className="dashboard-workstreams">
            {workstreams.map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  navigate(
                    `/workstreams/${item.id}/${item.type === "客户开发" ? "client" : item.type === "岗位招聘" ? "position" : item.type === "人才摸排" ? "mapping" : "career"}`,
                  )
                }
              >
                <span className="stream-icon">
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
                </span>
                <span>
                  <small>{item.type}</small>
                  <b>{item.target}</b>
                  <em>{item.next}</em>
                </span>
                <span>
                  <Status tone={toneForStatus(item.status)}>
                    {item.status}
                  </Status>
                  <small>{item.changed}</small>
                </span>
                <Icon name="chevronRight" />
              </button>
            ))}
          </div>
        </div>
        <aside className="stack detail-aside">
          <div className="surface">
            <header className="surface-header">
              <h2>任务运行</h2>
              <button className="link" onClick={() => navigate("/tasks")}>
                任务中心
              </button>
            </header>
            <div className="surface-body stack">
              {tasks.slice(0, 3).map((task) => (
                <button
                  className="mini-task"
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                >
                  <span>
                    <b>{task.title}</b>
                    <small>{task.action}</small>
                  </span>
                  <Status tone={toneForStatus(task.status)}>
                    {task.status}
                  </Status>
                </button>
              ))}
            </div>
          </div>
          <div className="banner banner-warning">
            <Icon name="warning" />
            <span>
              <b>试用权益将在 15 天后到期</b>
              <small>到期后仍可查看和导出数据，Agent 和外部联系将暂停。</small>
            </span>
            <button
              className="link"
              onClick={() => navigate("/account/subscription")}
            >
              查看权益
            </button>
          </div>
        </aside>
      </section>
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
          <Status tone="warning">{decision?.status}</Status>
          <p>{decision?.meta}</p>
          <div className="privacy-note">
            <Icon name="info" />
            <span>进入详情后可以查看证据和影响范围，再决定是否确认。</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
