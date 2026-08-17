import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  navItems,
  companies,
  candidates,
  positions,
  workstreams,
  tasks,
  signals,
} from "../data/demo";
import { usePrototype } from "../store/PrototypeStore";
import {
  Button,
  Drawer,
  IconButton,
  Modal,
  SearchInput,
  Status,
  useToast,
} from "./ui";
import { Icon } from "./Icon";
import { useEffect, useMemo, useState } from "react";

const notificationItems = [
  {
    id: 1,
    type: "外部回复",
    title: "周雅雯回复了星澜机器人招聘需求",
    time: "8 分钟前",
    route: "/communications/contact-zhou",
    unread: true,
  },
  {
    id: 2,
    type: "支线任务",
    title: "VLA 候选人召回等待审核",
    time: "18 分钟前",
    route: "/tasks/task-sourcing",
    unread: true,
  },
  {
    id: 3,
    type: "信号",
    title: "星澜机器人融资信号可信度已核验",
    time: "今天 08:35",
    route: "/signals/sig-funding",
    unread: true,
  },
  {
    id: 4,
    type: "平台",
    title: "脉脉登录失效，1 个任务已暂停",
    time: "昨天 22:14",
    route: "/account/platforms",
    unread: false,
  },
];

function Brand({ expanded = false, operations = false }) {
  return (
    <span className="brand" aria-label="Hunter">
      <span className="brand-mark">
        <Icon name="signal" />
      </span>
      {expanded && (
        <span className="brand-copy">
          <b>Hunter</b>
          <small>{operations ? "运营支持工作台" : "智能猎头工作空间"}</small>
        </span>
      )}
    </span>
  );
}

function UsageRing({ value = 64, expanded = false, onClick }) {
  if (expanded) {
    return (
      <button
        type="button"
        className="usage-mini"
        aria-label={`查看本月 Agent 用量，已使用 ${value}%`}
        onClick={onClick}
      >
        <span>
          <b>本月 Agent 用量</b>
          <em>{value}%</em>
        </span>
        <i>
          <i style={{ width: `${value}%` }} />
        </i>
      </button>
    );
  }
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  return (
    <button
      type="button"
      className="usage-ring-button"
      title={`本月 Agent 用量 ${value}%`}
      aria-label={`查看本月 Agent 用量，已使用 ${value}%`}
      onClick={onClick}
    >
      <span className="usage-ring" aria-hidden="true">
        <svg viewBox="0 0 40 40">
          <circle cx="20" cy="20" r={radius} />
          <circle
            className="usage-ring-progress"
            cx="20"
            cy="20"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <b>{value}</b>
      </span>
      {expanded && (
        <span className="usage-ring-copy">
          <b>Agent 用量</b>
          <small>本月已使用 {value}%</small>
        </span>
      )}
    </button>
  );
}

function NewMenu({ open, close }) {
  const navigate = useNavigate();
  if (!open) return null;
  return (
    <div className="new-menu" role="menu">
      <button
        onClick={() => {
          navigate("/workstreams/new");
          close();
        }}
      >
        <Icon name="route" />
        <span>
          <b>新建业务主线</b>
          <small>客户开发、岗位招聘、人才摸排或候选人求职</small>
        </span>
      </button>
      <button
        onClick={() => {
          navigate("/imports/new");
          close();
        }}
      >
        <Icon name="upload" />
        <span>
          <b>导入数据</b>
          <small>简历、岗位、公司、论文、专利和摸排</small>
        </span>
      </button>
      <button
        onClick={() => {
          navigate("/candidates");
          close();
        }}
      >
        <Icon name="user" />
        <span>
          <b>手动新建资产</b>
          <small>在对应列表中创建候选人、岗位或公司</small>
        </span>
      </button>
    </div>
  );
}

function NotificationDrawer({ open, close }) {
  const navigate = useNavigate();
  const { state, update } = usePrototype();
  const [tab, setTab] = useState("all");
  const [items, setItems] = useState(notificationItems);
  const visible =
    tab === "unread" ? items.filter((item) => item.unread) : items;
  return (
    <Drawer open={open} onClose={close} title="通知中心" width="440px">
      <div className="drawer-toolbar">
        <button
          className={tab === "all" ? "is-active" : ""}
          onClick={() => setTab("all")}
        >
          全部
        </button>
        <button
          className={tab === "unread" ? "is-active" : ""}
          onClick={() => setTab("unread")}
        >
          未读
        </button>
        <button
          onClick={() => {
            setItems((current) =>
              current.map((item) => ({ ...item, unread: false })),
            );
            update({ notifications: 0 });
          }}
        >
          全部已读
        </button>
      </div>
      <div className="notification-list">
        {visible.map((item) => (
          <article className={item.unread ? "is-unread" : ""} key={item.id}>
            <button
              onClick={() => {
                setItems((current) =>
                  current.map((entry) =>
                    entry.id === item.id ? { ...entry, unread: false } : entry,
                  ),
                );
                navigate(item.route);
                close();
              }}
            >
              <i />
              <span>
                <small>{item.type}</small>
                <b>{item.title}</b>
                <time>{item.time}</time>
              </span>
            </button>
            <IconButton
              icon="trash"
              label="删除通知"
              onClick={() =>
                setItems((current) =>
                  current.filter((entry) => entry.id !== item.id),
                )
              }
            />
          </article>
        ))}
      </div>
      <Button
        tone="secondary"
        icon="settings"
        onClick={() => {
          navigate("/account/notifications");
          close();
        }}
      >
        通知设置
      </Button>
    </Drawer>
  );
}

function GlobalSearch({ open, close }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (!query.trim())
      return [
        {
          group: "最近访问",
          label: "具身智能 VLA 算法负责人",
          meta: "岗位 · 星澜机器人",
          route: "/positions/vla-lead",
          icon: "briefcase",
        },
        {
          group: "最近访问",
          label: "林昊",
          meta: "候选人 · 机器人算法负责人",
          route: "/candidates/lin-hao",
          icon: "user",
        },
      ];
    const q = query.toLowerCase();
    return [
      ...companies.map((item) => ({
        group: "公司",
        label: item.name,
        meta: `${item.industry} · ${item.location}`,
        route: `/companies/${item.id}`,
        icon: "building",
      })),
      ...positions.map((item) => ({
        group: "岗位",
        label: item.name,
        meta: `${item.company} · ${item.location}`,
        route: `/positions/${item.id}`,
        icon: "briefcase",
      })),
      ...candidates.map((item) => ({
        group: "候选人",
        label: item.name,
        meta: `${item.company} · ${item.title}`,
        route: `/candidates/${item.id}`,
        icon: "user",
      })),
      ...workstreams.map((item) => ({
        group: "业务主线",
        label: item.target,
        meta: `${item.type} · ${item.status}`,
        route: `/workstreams/${item.id}/${item.type === "客户开发" ? "client" : item.type === "岗位招聘" ? "position" : item.type === "人才摸排" ? "mapping" : "career"}`,
        icon: "route",
      })),
      ...tasks.map((item) => ({
        group: "支线任务",
        label: item.title,
        meta: `${item.type} · ${item.status}`,
        route: `/tasks/${item.id}`,
        icon: "task",
      })),
      ...signals.map((item) => ({
        group: "信号",
        label: item.title,
        meta: `${item.type} · ${item.priority}优先级`,
        route: `/signals/${item.id}`,
        icon: "signal",
      })),
    ]
      .filter((item) => `${item.label}${item.meta}`.toLowerCase().includes(q))
      .slice(0, 10);
  }, [query]);
  return (
    <Modal
      open={open}
      onClose={close}
      title="全局搜索"
      description="搜索业务主线、支线任务、信号和全部业务资产"
      size="lg"
    >
      <div className="global-search">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="输入姓名、公司、岗位或支线任务"
        />
        <div className="search-results">
          {results.length ? (
            results.map((item, index) => (
              <button
                key={`${item.route}-${index}`}
                onClick={() => {
                  navigate(item.route);
                  close();
                }}
              >
                <i>
                  <Icon name={item.icon} />
                </i>
                <span>
                  <b>{item.label}</b>
                  <small>{item.meta}</small>
                </span>
                <em>{item.group}</em>
                <Icon name="chevronRight" />
              </button>
            ))
          ) : (
            <section className="search-empty">
              <b>没有找到“{query}”</b>
              <span>可以新建业务主线，或导入新的业务数据。</span>
              <div>
                <Button
                  tone="secondary"
                  onClick={() => {
                    navigate("/workstreams/new");
                    close();
                  }}
                >
                  新建业务主线
                </Button>
                <Button
                  tone="primary"
                  onClick={() => {
                    navigate("/imports/new");
                    close();
                  }}
                >
                  导入数据
                </Button>
              </div>
            </section>
          )}
        </div>
      </div>
    </Modal>
  );
}

export function AppShell({ children }) {
  const { state, update } = usePrototype();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const params = new URLSearchParams(location.search);
  const [notificationsOpen, setNotificationsOpen] = useState(
    params.get("panel") === "notifications",
  );
  const [searchOpen, setSearchOpen] = useState(
    params.get("panel") === "search",
  );
  const [newOpen, setNewOpen] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  useEffect(() => {
    setNotificationsOpen(params.get("panel") === "notifications");
    setSearchOpen(params.get("panel") === "search");
    setNewOpen(false);
  }, [location.pathname, location.search]);
  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  return (
    <div
      className={`app-shell ${navExpanded ? "nav-expanded" : "nav-collapsed"}`}
      data-theme={state.theme}
    >
      <aside className="sidebar">
        <button
          className="sidebar-brand-button"
          aria-label="返回工作台"
          title="Hunter 工作台"
          onClick={() => navigate("/home")}
        >
          <Brand expanded={navExpanded} />
        </button>
        <IconButton
          className="sidebar-expand-button"
          icon={navExpanded ? "panelLeft" : "panelRight"}
          label={navExpanded ? "收起导航" : "展开导航"}
          onClick={() => setNavExpanded((current) => !current)}
        />
        <span className="sidebar-section-label">业务工作区</span>
        <nav>
          {navItems.map(([icon, label, route]) => (
            <NavLink
              key={route}
              to={route}
              title={navExpanded ? undefined : label}
              aria-label={label}
              className={({ isActive }) => (isActive ? "is-active" : "")}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <UsageRing
            expanded={navExpanded}
            onClick={() => navigate("/account/usage")}
          />
          <button
            className="profile-mini"
            title={navExpanded ? undefined : "沈岚 · 个人工作空间"}
            onClick={() => navigate("/account/profile")}
          >
            <i className="avatar">SL</i>
            <span>
              <b>沈岚</b>
              <small>个人工作空间</small>
            </span>
            <Icon name="chevronRight" />
          </button>
        </div>
      </aside>
      <section className="app-stage">
        <header className="topbar">
          <button
            type="button"
            className="search-input"
            onClick={() => setSearchOpen(true)}
          >
            <Icon name="search" />
            <span className="placeholder">搜索主线、支线任务和业务资产</span>
            <kbd>Ctrl K</kbd>
          </button>
          <span className="topbar-spacer" />
          <div className="topbar-actions">
            <span className="new-button-wrap">
              <Button
                tone="primary"
                icon="plus"
                onClick={() => setNewOpen((current) => !current)}
              >
                新建
              </Button>
              <NewMenu open={newOpen} close={() => setNewOpen(false)} />
            </span>
            <IconButton
              icon={state.theme === "light" ? "moon" : "sun"}
              label={state.theme === "light" ? "切换深色模式" : "切换浅色模式"}
              onClick={() =>
                update({ theme: state.theme === "light" ? "dark" : "light" })
              }
            />
            <button
              className="icon-button notification-button"
              aria-label="打开通知"
              onClick={() => setNotificationsOpen(true)}
            >
              <Icon name="bell" />
              {state.notifications > 0 && <em>{state.notifications}</em>}
            </button>
            <IconButton
              icon="settings"
              label="账户设置"
              onClick={() => navigate("/account/profile")}
            />
          </div>
        </header>
        <main>{children}</main>
      </section>
      <NotificationDrawer
        open={notificationsOpen}
        close={() => setNotificationsOpen(false)}
      />
      <GlobalSearch open={searchOpen} close={() => setSearchOpen(false)} />
    </div>
  );
}

const opsNav = [
  ["home", "运营概览", "/ops"],
  ["users", "试用申请", "/ops/applications"],
  ["database", "工作空间", "/ops/workspaces"],
  ["briefcase", "订阅与权益", "/ops/subscriptions"],
  ["task", "任务运行", "/ops/tasks"],
  ["warning", "错误中心", "/ops/errors"],
  ["signal", "依赖健康", "/ops/dependencies"],
  ["file", "诊断包", "/ops/diagnostics"],
  ["message", "公告管理", "/ops/announcements"],
  ["clock", "审计日志", "/ops/audit"],
];

export function OpsShell({ children }) {
  const { state, update } = usePrototype();
  const navigate = useNavigate();
  const toast = useToast();
  const [navExpanded, setNavExpanded] = useState(false);
  return (
    <div
      className={`app-shell ops-shell ${navExpanded ? "nav-expanded" : "nav-collapsed"}`}
      data-theme={state.theme}
    >
      <aside className="sidebar">
        <button
          className="sidebar-brand-button"
          aria-label="返回运营工作台"
          title="Hunter 运营工作台"
          onClick={() => navigate("/ops")}
        >
          <Brand expanded={navExpanded} operations />
        </button>
        <IconButton
          className="sidebar-expand-button"
          icon={navExpanded ? "panelLeft" : "panelRight"}
          label={navExpanded ? "收起导航" : "展开导航"}
          onClick={() => setNavExpanded((current) => !current)}
        />
        <span className="sidebar-section-label">Hunter 运营</span>
        <nav>
          {opsNav.map(([icon, label, route]) => (
            <NavLink
              end={route === "/ops"}
              key={route}
              to={route}
              title={navExpanded ? undefined : label}
              aria-label={label}
              className={({ isActive }) => (isActive ? "is-active" : "")}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <button
            className="profile-mini"
            onClick={() => toast("当前为运营支持角色", "info")}
          >
            <i className="avatar">YY</i>
            <span>
              <b>于一凡</b>
              <small>运营支持 · 最小权限</small>
            </span>
            <Icon name="chevronRight" />
          </button>
        </div>
      </aside>
      <section className="app-stage">
        <header className="topbar">
          <div className="inline">
            <Status tone="info">运营环境</Status>
            <span className="muted">所有业务内容默认不可见</span>
          </div>
          <span />
          <div className="topbar-actions">
            <IconButton
              icon={state.theme === "light" ? "moon" : "sun"}
              label="切换主题"
              onClick={() =>
                update({ theme: state.theme === "light" ? "dark" : "light" })
              }
            />
            <IconButton
              icon="logout"
              label="退出运营端"
              onClick={() => navigate("/ops/login")}
            />
          </div>
        </header>
        <main>{children}</main>
      </section>
    </div>
  );
}
