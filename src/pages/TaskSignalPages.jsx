import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Drawer,
  IconButton,
  Input,
  Modal,
  PageHeader,
  Status,
  Tabs,
  Textarea,
  useToast,
} from "../components/ui";
import { Icon } from "../components/Icon";
import {
  EvidenceList,
  InfoGrid,
  SummaryList,
  TaskProcess,
  toneForStatus,
} from "../components/business";
import { signals, tasks } from "../data/demo";
import { usePrototype } from "../store/PrototypeStore";

const runEvents = [
  {
    time: "10:02:18",
    title: "读取岗位和候选人范围",
    summary:
      "已确认目标岗位、地点、职级和停止条件；本次只处理尚未读取的候选人。",
    tone: "success",
    icon: "briefcase",
    detail: "候选人范围：猎聘、脉脉和公开网络；停止条件与门禁规则已经确认。",
  },
  {
    time: "10:05:46",
    title: "从人才平台召回候选人",
    summary: "猎聘返回 24 位，脉脉返回 17 位；合并后得到 35 位唯一候选人。",
    tone: "success",
    icon: "users",
    detail: "平台请求分批串行执行；重复项 6 位已通过姓名、履历和来源标识合并。",
  },
  {
    time: "10:18:22",
    title: "读取候选人详情和附件",
    summary:
      "已读取 18 位候选人，2 份附件正在视觉解析；没有重复打开已完成详情。",
    tone: "info",
    icon: "file",
    detail:
      "已完成 18 / 35；PDF 附件 2 份；失败 0；检查点：detail-page-2-item-6。",
  },
  {
    time: "10:24:09",
    title: "岗位角色门禁与匹配",
    summary: "12 位推荐、4 位有条件匹配、2 位因角色或范围明显不适配被拒绝。",
    tone: "info",
    icon: "task",
    detail:
      "硬性拒绝：岗位角色层级明显冲突 1 位，工作范围无法接受 1 位；有条件匹配保留减分理由。",
  },
  {
    time: "10:27:41",
    title: "等待人才平台重新登录",
    summary: "脉脉登录状态失效，已保留结果池和检查点；猎聘任务仍可继续。",
    tone: "danger",
    icon: "warning",
    detail:
      "受影响平台：脉脉；最后成功检查点：page-3-item-4；重新登录后可从该位置继续。",
  },
];

function TechnicalDetail({ open, close, event }) {
  const toast = useToast();
  const raw = `event_type: ${event?.tone === "danger" ? "platform_session_expired" : "business_step_completed"}\ncheckpoint: detail-page-2-item-6\nretryable: true\nsource_count: 18\nredaction: business_content_hidden`;
  return (
    <Modal
      open={open}
      onClose={close}
      title="技术详情"
      description="用于诊断和支持，业务处理请返回任务过程"
      size="lg"
      footer={
        <>
          <Button onClick={close}>关闭</Button>
          <Button
            tone="primary"
            icon="copy"
            onClick={() => {
              navigator.clipboard?.writeText(raw);
              toast("技术详情已复制");
            }}
          >
            复制全部
          </Button>
        </>
      }
    >
      <pre className="technical-detail">{raw}</pre>
    </Modal>
  );
}

export function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { state, update } = usePrototype();
  const task = tasks.find((item) => item.id === id) || tasks[1];
  const [status, setStatus] = useState(state.taskStatus[id] || task.status);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [technical, setTechnical] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      who: "user",
      text: "为这个岗位继续找人，匹配分数线设为 0，但仍保留岗位角色和范围门禁。",
    },
    {
      who: "agent",
      text: "已读取岗位 v3 和历史检查点。本次会继续尚未完成的平台读取，完成后将候选人按推荐、有条件匹配和不建议三类交付。",
    },
  ]);
  const [progress, setProgress] = useState(
    status === "运行中" ? 58 : status === "失败" ? 43 : 100,
  );
  const threadRef = useRef(null);
  useEffect(() => {
    if (status !== "运行中") return undefined;
    const timer = window.setInterval(
      () => setProgress((current) => Math.min(88, current + 1)),
      2400,
    );
    return () => window.clearInterval(timer);
  }, [status]);
  const setTaskStatus = (next) => {
    setStatus(next);
    update((current) => ({
      ...current,
      taskStatus: { ...current.taskStatus, [id]: next },
    }));
  };
  const send = () => {
    if (!message.trim()) return;
    const text = message;
    setMessages((current) => [...current, { who: "user", text }]);
    setMessage("");
    window.setTimeout(
      () =>
        setMessages((current) => [
          ...current,
          {
            who: "agent",
            text: "补充信息已加入当前任务版本。我会先判断影响范围，只重做受影响的步骤。",
          },
        ]),
      500,
    );
  };
  const events = status === "失败" ? runEvents : runEvents.slice(0, 4);
  return (
    <div className="page-content task-detail-page">
      <PageHeader
        eyebrow={`${task.type} · ${status}`}
        title={task.title}
        description={task.mainline}
        back={() => navigate(task.mainlineRoute || "/tasks")}
        actions={
          <>
            {status === "运行中" ? (
              <Button
                icon="pause"
                onClick={() => {
                  setTaskStatus("已暂停");
                  toast("任务已暂停，检查点已保留");
                }}
              >
                暂停
              </Button>
            ) : (
              <Button
                tone="primary"
                icon="play"
                onClick={() => {
                  setTaskStatus("运行中");
                  toast("任务已从检查点继续");
                }}
              >
                继续任务
              </Button>
            )}
            <Button tone="dangerGhost" onClick={() => setCancelOpen(true)}>
              取消任务
            </Button>
          </>
        }
      />
      <div className="task-run-layout">
        <div className="task-context-strip">
          <span>
            <small>当前任务</small>
            <b>{task.action}</b>
          </span>
          <span>
            <small>{task.mainlineRoute ? "所属业务主线" : "任务来源"}</small>
            <b>{task.mainline}</b>
          </span>
          <Status tone={toneForStatus(status)}>{status}</Status>
          {task.mainlineRoute && (
            <Button
              size="sm"
              icon="route"
              onClick={() => navigate(task.mainlineRoute)}
            >
              返回业务主线
            </Button>
          )}
        </div>
        <main className="thread-main">
          <header>
            <div>
              <small>{task.type} · 自动保存</small>
              <h1>运行过程</h1>
            </div>
            <div className="inline">
              <Status tone={toneForStatus(status)}>{status}</Status>
              <IconButton
                icon="more"
                label="任务菜单"
                onClick={() => toast("任务菜单已打开", "info")}
              />
            </div>
          </header>
          <div className="thread" ref={threadRef}>
            <div className="task-live-summary">
              <span>
                <b>
                  {status === "运行中"
                    ? "正在读取候选人详情"
                    : status === "失败"
                      ? "平台登录失效，等待处理"
                      : "任务当前未运行"}
                </b>
                <small>{progress}% · 已用 42 分钟 · 预计剩余 18 分钟</small>
              </span>
              <div className="progress">
                <i>
                  <i style={{ width: `${progress}%` }} />
                </i>
              </div>
            </div>
            {messages.map((item, index) => (
              <div
                className={`message-row ${item.who === "user" ? "is-user" : ""}`}
                key={`${item.text}-${index}`}
              >
                {item.who === "user" ? (
                  <>
                    <article>
                      <small>沈岚</small>
                      <p>{item.text}</p>
                    </article>
                    <i>
                      <Icon name="user" />
                    </i>
                  </>
                ) : (
                  <>
                    <i>
                      <Icon name="task" />
                    </i>
                    <article>
                      <small>Hunter Agent</small>
                      <p>{item.text}</p>
                    </article>
                  </>
                )}
              </div>
            ))}
            <TaskProcess
              events={events}
              onOpen={(event) => setSelectedEvent(event)}
            />
            {status === "失败" && (
              <div className="banner banner-danger">
                <Icon name="warning" />
                <span>
                  <b>脉脉登录状态失效</b>
                  <small>
                    结果池和检查点已保留。处理平台登录后，可在本页继续同一个任务。
                  </small>
                </span>
                <Button
                  size="sm"
                  onClick={() => navigate("/account/platforms")}
                >
                  处理平台
                </Button>
              </div>
            )}
          </div>
          <div className="thread-composer">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="补充任务要求、文字、链接或文件"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send();
                }
              }}
            />
            <footer>
              <div className="inline">
                <IconButton
                  icon="paper"
                  label="添加文件"
                  onClick={() => toast("文件选择已打开", "info")}
                />
                <IconButton
                  icon="link"
                  label="添加链接"
                  onClick={() =>
                    setMessage(
                      (current) => `${current}${current ? "\n" : ""}https://`,
                    )
                  }
                />
              </div>
              <Button size="sm" tone="primary" icon="send" onClick={send}>
                发送
              </Button>
            </footer>
          </div>
        </main>
      </div>
      <Drawer
        open={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title}
      >
        <div className="stack">
          <InfoGrid
            columns={1}
            items={[
              ["时间", selectedEvent?.time],
              ["业务摘要", selectedEvent?.summary],
              ["具体内容", selectedEvent?.detail],
            ]}
          />
          <EvidenceList
            items={[
              {
                title: "岗位版本 v3",
                source: "用户确认 · 今天 09:58",
                verified: true,
              },
              {
                title: "人才平台候选人详情",
                source: "猎聘、脉脉",
                verified: selectedEvent?.tone !== "danger",
              },
            ]}
          />
          <Button onClick={() => setTechnical(true)}>查看技术详情</Button>
        </div>
      </Drawer>
      <TechnicalDetail
        open={technical}
        close={() => setTechnical(false)}
        event={selectedEvent}
      />
      <Modal
        danger
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="取消当前任务"
        description="已确认的业务成果不会删除"
        footer={
          <>
            <Button onClick={() => setCancelOpen(false)}>返回任务</Button>
            <Button
              tone="danger"
              onClick={() => {
                setCancelOpen(false);
                setTaskStatus("已取消");
                toast("任务已取消");
              }}
            >
              确认取消
            </Button>
          </>
        }
      >
        <p>
          尚未完成的执行会停止。当前检查点、运行记录和已确认结果仍保留，可用于追溯。
        </p>
      </Modal>
    </div>
  );
}

export function SignalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const signal = signals.find((item) => item.id === id) || signals[0];
  const [status, setStatus] = useState(signal.status);
  const [create, setCreate] = useState(false);
  const [evidence, setEvidence] = useState(false);
  const [note, setNote] = useState(false);
  return (
    <div className="page-content">
      <PageHeader
        eyebrow={`${signal.type}信号 · ${signal.time}`}
        title={signal.title}
        description={`${signal.object} · ${signal.source}`}
        status={<Status tone={toneForStatus(status)}>{status}</Status>}
        back={() => navigate("/signals")}
        actions={
          <>
            <Button
              onClick={() => {
                setStatus("观察中");
                toast("信号已加入观察");
              }}
            >
              持续观察
            </Button>
            <Button tone="primary" icon="plus" onClick={() => setCreate(true)}>
              创建业务主线
            </Button>
            <Button
              tone="dangerGhost"
              onClick={() => {
                setStatus("已忽略");
                toast("信号已忽略");
              }}
            >
              忽略
            </Button>
          </>
        }
      />
      <section className="detail-layout page-section">
        <div className="stack">
          <div className="surface">
            <header className="surface-header">
              <h2>信号内容与判断</h2>
              <button className="link" onClick={() => setEvidence(true)}>
                查看全部证据
              </button>
            </header>
            <InfoGrid
              items={[
                ["相关对象", signal.object],
                ["优先级", signal.priority],
                ["有效期", signal.expires],
                ["可信状态", "两类独立来源相互印证"],
                [
                  "为什么值得关注",
                  "融资公告明确提到扩充具身智能研发和商业化团队；公司官网随后新增 VLA、机器人平台和灵巧手岗位。",
                  true,
                ],
                [
                  "仍需确认",
                  "具体 HC、职级范围、汇报线和外部猎头合作意愿。",
                  true,
                ],
              ]}
            />
          </div>
          <div className="surface">
            <header className="surface-header">
              <h2>可能的后续动作</h2>
            </header>
            <div className="action-options">
              <button onClick={() => setCreate(true)}>
                <i>
                  <Icon name="building" />
                </i>
                <span>
                  <b>启动客户开发</b>
                  <small>核验公司、负责人和招聘需求，形成招聘机会。</small>
                </span>
                <Icon name="chevronRight" />
              </button>
              <button onClick={() => navigate("/workstreams/new?type=mapping")}>
                <i>
                  <Icon name="users" />
                </i>
                <span>
                  <b>启动人才摸排</b>
                  <small>摸清目标团队、关键角色、人员和关系。</small>
                </span>
                <Icon name="chevronRight" />
              </button>
              <button onClick={() => setNote(true)}>
                <i>
                  <Icon name="file" />
                </i>
                <span>
                  <b>补充信息</b>
                  <small>添加你掌握的关系、文字、链接或文件。</small>
                </span>
                <Icon name="chevronRight" />
              </button>
            </div>
          </div>
        </div>
        <aside className="stack">
          <div className="surface">
            <header className="surface-header">
              <h2>触发链</h2>
            </header>
            <div className="surface-body">
              <div className="trigger-chain">
                <span>
                  <i>
                    <Icon name="signal" />
                  </i>
                  <b>招聘信号</b>
                  <small>今天 08:35</small>
                </span>
                <span>
                  <i>
                    <Icon name="task" />
                  </i>
                  <b>核验任务</b>
                  <small>已完成</small>
                </span>
                <span>
                  <i>
                    <Icon name="clock" />
                  </i>
                  <b>等待用户决定</b>
                  <small>当前</small>
                </span>
              </div>
            </div>
          </div>
          <div className="surface">
            <header className="surface-header">
              <h2>相关对象</h2>
            </header>
            <SummaryList
              items={[
                {
                  title: "星澜机器人",
                  meta: "具身智能 · 上海",
                  status: "重点招聘",
                  icon: "building",
                  route: "/companies/xinglan",
                },
                {
                  title: "周雅雯",
                  meta: "HRD · 可联系",
                  status: "已确认",
                  icon: "user",
                  route: "/contacts/zhou-yawen",
                },
              ]}
              onOpen={(item) => navigate(item.route)}
            />
          </div>
        </aside>
      </section>
      <Modal
        open={create}
        onClose={() => setCreate(false)}
        title="用这个信号创建业务主线"
        description="信号内容和证据会作为主线的初始输入"
        footer={
          <>
            <Button onClick={() => setCreate(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => navigate("/workstreams/new?type=client")}
            >
              继续配置
            </Button>
          </>
        }
      >
        <div className="choice-grid">
          <button className="choice-card is-selected">
            <i>
              <Icon name="building" />
            </i>
            <span>
              <b>客户开发</b>
              <small>优先确认负责人、招聘需求和合作机会。</small>
            </span>
          </button>
          <button
            className="choice-card"
            onClick={() => navigate("/workstreams/new?type=mapping")}
          >
            <i>
              <Icon name="users" />
            </i>
            <span>
              <b>人才摸排</b>
              <small>优先摸清团队、关键角色和人物关系。</small>
            </span>
          </button>
        </div>
      </Modal>
      <Drawer
        open={evidence}
        onClose={() => setEvidence(false)}
        title="信号证据"
      >
        <EvidenceList
          items={[
            {
              title: "星澜机器人 B+ 轮融资公告",
              source: "公司公众号 · 今天 08:20",
              verified: true,
            },
            {
              title: "投资机构项目公告",
              source: "投资机构官网 · 今天 08:28",
              verified: true,
            },
            {
              title: "公司官网新增 12 个岗位",
              source: "官网招聘 · 今天 08:31",
              verified: true,
            },
            {
              title: "团队扩充规模推断",
              source: "根据岗位数量推断 · 待确认",
              verified: false,
            },
          ]}
        />
      </Drawer>
      <Modal
        open={note}
        onClose={() => setNote(false)}
        title="补充信号信息"
        footer={
          <>
            <Button onClick={() => setNote(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setNote(false);
                toast("补充信息已保存并进入核验");
              }}
            >
              保存并核验
            </Button>
          </>
        }
      >
        <div className="stack">
          <Textarea
            label="补充说明"
            placeholder="例如：我认识该公司前招聘负责人，可以先核验合作意愿。"
          />
          <Input label="链接" placeholder="粘贴公开资料链接" prefix="link" />
        </div>
      </Modal>
    </div>
  );
}

export function CommunicationPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      side: "out",
      time: "昨天 16:18",
      text: "林老师，星澜机器人正在组建 VLA 核心团队，岗位会负责多模态操作策略和团队建设。方便了解一下你最近的职业考虑吗？",
    },
    {
      side: "in",
      time: "今天 09:12",
      text: "可以先了解。我最近带的团队扩大到 8 人，也补充了一个多模态操作策略项目，晚些时候把新版简历发你。",
    },
    {
      side: "in",
      time: "今天 10:36",
      text: "简历更新好了，薪资希望总包不低于 120 万，上海可以考虑。",
      attachment: "林昊_简历_2026-08.pdf",
    },
  ]);
  const [impact, setImpact] = useState(false);
  const send = () => {
    if (!text.trim()) return;
    setMessages((current) => [...current, { side: "out", time: "刚刚", text }]);
    setText("");
    toast("消息已发送");
  };
  return (
    <div className="page-content communication-page">
      <PageHeader
        eyebrow="候选人沟通 · 已收到回复"
        title="与林昊的沟通"
        description="脉脉 · 候选人求职主线 · 最近更新今天 10:36"
        back={() => navigate("/candidates/lin-hao")}
        actions={
          <>
            <Button onClick={() => setImpact(true)}>处理新资料</Button>
            <Button tone="dangerGhost" onClick={() => toast("已停止自动联系")}>
              停止联系
            </Button>
          </>
        }
      />
      <div className="communication-layout">
        <aside className="conversation-list surface">
          <header className="surface-header">
            <h2>相关会话</h2>
          </header>
          {[
            { name: "林昊", meta: "候选人 · 收到新简历", active: true },
            { name: "周雅雯", meta: "客户联系人 · 等待回复" },
            { name: "赵星羽", meta: "候选人 · 初次沟通" },
          ].map((item) => (
            <button className={item.active ? "is-active" : ""} key={item.name}>
              <i className="avatar">{item.name.slice(-1)}</i>
              <span>
                <b>{item.name}</b>
                <small>{item.meta}</small>
              </span>
            </button>
          ))}
        </aside>
        <main className="conversation-main surface">
          <header>
            <div>
              <b>林昊</b>
              <small>远川智能 · 机器人算法负责人</small>
            </div>
            <Status tone="success">收到回复</Status>
          </header>
          <section>
            {messages.map((message, index) => (
              <article
                className={
                  message.side === "out" ? "message-out" : "message-in"
                }
                key={`${message.time}-${index}`}
              >
                <time>{message.time}</time>
                <p>{message.text}</p>
                {message.attachment && (
                  <button
                    className="message-attachment"
                    onClick={() => toast("已打开简历预览", "info")}
                  >
                    <Icon name="file" />
                    <span>
                      <b>{message.attachment}</b>
                      <small>2.8 MB · PDF</small>
                    </span>
                    <Icon name="chevronRight" />
                  </button>
                )}
              </article>
            ))}
          </section>
          <footer className="conversation-composer">
            <Textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="输入消息；正式推荐、薪资和 Offer 承诺由你手动确认"
            />
            <div className="between">
              <div className="inline">
                <IconButton
                  icon="paper"
                  label="添加附件"
                  onClick={() => toast("附件选择已打开", "info")}
                />
                <IconButton
                  icon="file"
                  label="补录电话或线下沟通"
                  onClick={() => toast("人工补录表单已打开", "info")}
                />
              </div>
              <Button tone="primary" icon="send" onClick={send}>
                发送
              </Button>
            </div>
          </footer>
        </main>
        <aside className="conversation-context surface">
          <header className="surface-header">
            <h2>上下文与建议</h2>
          </header>
          <div className="surface-body stack">
            <InfoGrid
              columns={1}
              items={[
                ["关联候选人", "林昊"],
                ["关联岗位", "具身智能 VLA 算法负责人"],
                ["当前进展", "二轮面试"],
                ["联系授权", "本会话允许，用户确认后发送"],
              ]}
            />
            <div className="reply-suggestion">
              <small>回复建议</small>
              <p>
                收到，谢谢。团队管理规模和项目进展很有帮助。我先更新资料并重新核对岗位匹配，再和你确认下一步。
              </p>
              <Button
                size="sm"
                onClick={() =>
                  setText(
                    "收到，谢谢。团队管理规模和项目进展很有帮助。我先更新资料并重新核对岗位匹配，再和你确认下一步。",
                  )
                }
              >
                采纳并编辑
              </Button>
            </div>
          </div>
        </aside>
      </div>
      <Modal
        open={impact}
        onClose={() => setImpact(false)}
        title="处理候选人新资料"
        description="新简历和薪资意向会更新候选人资料，并局部重新匹配"
        footer={
          <>
            <Button onClick={() => setImpact(false)}>稍后处理</Button>
            <Button
              tone="primary"
              onClick={() => {
                setImpact(false);
                toast("已创建资料更新与局部匹配任务");
                navigate("/tasks/task-enrich");
              }}
            >
              创建处理任务
            </Button>
          </>
        }
      >
        <div className="impact-list">
          <article>
            <Icon name="file" />
            <span>
              <b>新简历</b>
              <small>解析、查重并生成字段级更新建议。</small>
            </span>
            <Status tone="info">待处理</Status>
          </article>
          <article>
            <Icon name="briefcase" />
            <span>
              <b>薪资与地点意向</b>
              <small>更新为总包不低于 120 万，上海可考虑。</small>
            </span>
            <Status tone="warning">需确认</Status>
          </article>
          <article>
            <Icon name="task" />
            <span>
              <b>相关岗位匹配</b>
              <small>仅重新计算受新信息影响的 6 个岗位。</small>
            </span>
            <Status tone="info">局部重做</Status>
          </article>
        </div>
      </Modal>
    </div>
  );
}
