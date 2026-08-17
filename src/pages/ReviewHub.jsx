import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { allPages, opsPages, userPages } from "../data/pageRegistry";
import { Icon } from "../components/Icon";
import { Button } from "../components/ui";

export function ReviewHub() {
  const navigate = useNavigate();
  const [section, setSection] = useState("user");
  const pages = section === "user" ? userPages : opsPages;
  return (
    <main className="review-hub" data-theme="light">
      <section className="review-hero">
        <div>
          <span className="eyebrow">HUNTER SAAS · PHASE 1</span>
          <h1>完整可交互原型审核入口</h1>
          <p>
            围绕客户开发、岗位招聘、人才摸排和候选人求职四类持续业务主线，覆盖用户端、运营端、Agent
            长任务、异步外部等待、数据进入、授权、订阅和故障恢复。
          </p>
          <div className="inline" style={{ marginTop: 22 }}>
            <Button
              tone="primary"
              icon="home"
              onClick={() => navigate("/home")}
            >
              进入用户端
            </Button>
            <Button
              tone="secondary"
              icon="settings"
              onClick={() => navigate("/ops")}
            >
              进入运营端
            </Button>
          </div>
        </div>
        <div className="review-meta">
          <article>
            <strong>46</strong>
            <small>用户端页面</small>
          </article>
          <article>
            <strong>15</strong>
            <small>运营端页面</small>
          </article>
          <article>
            <strong>31</strong>
            <small>类中间结果</small>
          </article>
        </div>
      </section>
      <section className="review-content">
        <nav className="review-nav surface">
          <button
            className={section === "user" ? "is-active" : ""}
            onClick={() => setSection("user")}
          >
            用户端页面
          </button>
          <button
            className={section === "ops" ? "is-active" : ""}
            onClick={() => setSection("ops")}
          >
            运营端页面
          </button>
          <button onClick={() => navigate("/components")}>组件与状态</button>
          <button onClick={() => navigate("/review/stories")}>
            端到端故事
          </button>
          <button onClick={() => navigate("/review/intermediate-results")}>
            中间结果覆盖
          </button>
        </nav>
        <div>
          <div className="section-header">
            <div>
              <h2>
                {section === "user" ? "用户端 U01–U46" : "运营端 O01–O15"}
              </h2>
              <p>点击任一页面进入真实交互；返回后仍保留原型状态。</p>
            </div>
            <span className="status status-success">
              <i />
              已建立 {allPages.length} 个页面入口
            </span>
          </div>
          <div className="page-index-grid">
            {pages.map(([id, title, route]) => (
              <button
                className="page-index-card"
                key={id}
                onClick={() => navigate(route)}
              >
                <b>{id}</b>
                <span>
                  <strong>{title}</strong>
                  <small>{route}</small>
                </span>
                <Icon name="chevronRight" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
