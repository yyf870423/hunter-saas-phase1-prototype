import { useMemo, useState } from "react";
import {
  candidateDecisionMeta,
  candidateReviewItems,
  candidateTierMeta,
} from "../data/candidateReview";
import { Icon } from "./Icon";
import { Button, Status } from "./ui";

const filters = [
  ["all", "全部"],
  ["recommended", "推荐"],
  ["conditional", "有条件"],
  ["rejected", "不建议"],
  ["handled", "已处理"],
];

export function CandidateReviewWorkspace({
  onBack,
  onSubmit,
  initialDecisions = {},
  readOnly = false,
}) {
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(candidateReviewItems[0].id);
  const [decisions, setDecisions] = useState(initialDecisions);
  const selected =
    candidateReviewItems.find((item) => item.id === selectedId) ||
    candidateReviewItems[0];
  const handled = Object.keys(decisions).length;
  const counts = useMemo(
    () => ({
      all: candidateReviewItems.length,
      recommended: candidateReviewItems.filter(
        (item) => item.tier === "recommended",
      ).length,
      conditional: candidateReviewItems.filter(
        (item) => item.tier === "conditional",
      ).length,
      rejected: candidateReviewItems.filter((item) => item.tier === "rejected")
        .length,
      handled,
    }),
    [handled],
  );
  const visibleItems = candidateReviewItems.filter((item) =>
    filter === "all"
      ? true
      : filter === "handled"
        ? Boolean(decisions[item.id])
        : item.tier === filter,
  );

  const decide = (decision) => {
    const nextDecisions = { ...decisions, [selected.id]: decision };
    setDecisions(nextDecisions);
    const next = candidateReviewItems.find(
      (item) => !nextDecisions[item.id] && item.id !== selected.id,
    );
    if (next) setSelectedId(next.id);
  };

  const applySuggestions = () => {
    const next = Object.fromEntries(
      candidateReviewItems.map((item) => [
        item.id,
        candidateTierMeta[item.tier].suggestion,
      ]),
    );
    setDecisions(next);
  };

  const applyScoreRule = () => {
    setDecisions((current) => ({
      ...current,
      ...Object.fromEntries(
        candidateReviewItems
          .filter((item) => item.score >= 85)
          .map((item) => [item.id, "contact"]),
      ),
      "zhao-xingyu": "reject",
    }));
  };

  const reserveUnreviewed = () => {
    setDecisions((current) => ({
      ...Object.fromEntries(
        candidateReviewItems.map((item) => [
          item.id,
          current[item.id] || "reserve",
        ]),
      ),
    }));
  };

  return (
    <section className="candidate-review-workspace" aria-label="候选人完整审核">
      <header className="candidate-review-header">
        <Button icon="chevronLeft" size="sm" onClick={onBack}>
          返回业务主线
        </Button>
        <span>
          <small>首批综合匹配结果</small>
          <b>审核 18 位候选人</b>
        </span>
        <div>
          <span className="candidate-review-progress">
            <b>{handled}</b> / {candidateReviewItems.length} 已处理
          </span>
          {!readOnly && (
            <>
              <Button size="sm" onClick={applySuggestions}>
                按建议处理未审核
              </Button>
              <Button size="sm" onClick={applyScoreRule}>
                85 分及以上加入联系
              </Button>
              <Button size="sm" onClick={reserveUnreviewed}>
                未处理加入岗位储备
              </Button>
              <Button
                size="sm"
                tone="primary"
                disabled={handled !== candidateReviewItems.length}
                onClick={() => onSubmit(decisions)}
              >
                提交本批审核
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="candidate-review-summary" aria-label="审核结果分层">
        <span>
          <b>18</b>
          <small>本批候选人</small>
        </span>
        <span>
          <b>12</b>
          <small>推荐</small>
        </span>
        <span>
          <b>4</b>
          <small>有条件</small>
        </span>
        <span>
          <b>2</b>
          <small>不建议</small>
        </span>
        <p>
          <Icon name="info" />
          所有渠道已合并去重；提交前业务主线保持等待。
        </p>
      </div>

      <div
        className="candidate-review-filters"
        role="tablist"
        aria-label="候选人审核筛选"
      >
        {filters.map(([value, label]) => (
          <button
            type="button"
            role="tab"
            aria-selected={filter === value}
            className={filter === value ? "is-active" : ""}
            key={value}
            onClick={() => setFilter(value)}
          >
            {label}
            <span>{counts[value]}</span>
          </button>
        ))}
      </div>

      <div className="candidate-review-body">
        <aside className="candidate-review-list" aria-label="候选人列表">
          {visibleItems.length ? (
            visibleItems.map((item) => {
              const tier = candidateTierMeta[item.tier];
              const decision = candidateDecisionMeta[decisions[item.id]];
              return (
                <button
                  type="button"
                  className={item.id === selected.id ? "is-active" : ""}
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                >
                  <span className="candidate-review-list-score">
                    {item.score}
                  </span>
                  <span>
                    <b>{item.name}</b>
                    <small>
                      {item.company} · {item.title}
                    </small>
                  </span>
                  <Status tone={decision?.tone || tier.tone} dot={false}>
                    {decision?.label || tier.label}
                  </Status>
                </button>
              );
            })
          ) : (
            <div className="candidate-review-empty">
              <Icon name="search" />
              <span>当前筛选没有候选人</span>
            </div>
          )}
        </aside>

        <article
          className="candidate-review-detail"
          aria-label={`${selected.name} 候选人审核详情`}
        >
          <div className="candidate-review-profile">
            <span className="candidate-review-avatar">
              {selected.name.slice(-1)}
            </span>
            <span>
              <div>
                <h2>{selected.name}</h2>
                <Status
                  tone={candidateTierMeta[selected.tier].tone}
                  dot={false}
                >
                  {candidateTierMeta[selected.tier].label}
                </Status>
              </div>
              <p>
                {selected.title} · {selected.company}
              </p>
              <small>
                {selected.location} · {selected.years} 年经验 ·{" "}
                {selected.education}
              </small>
            </span>
            <strong>
              <b>{selected.score}</b>
              <small>综合匹配</small>
            </strong>
          </div>

          <div className="candidate-review-sources">
            <small>合并来源</small>
            {selected.sources.map((source) => (
              <span key={source}>{source}</span>
            ))}
          </div>

          <p className="candidate-review-summary-copy">{selected.summary}</p>

          <section className="candidate-review-section candidate-score-breakdown">
            <h3>匹配得分</h3>
            <div>
              {selected.breakdown.map(([label, value]) => (
                <span key={label}>
                  <small>{label}</small>
                  <b>{value}</b>
                  <i>
                    <em style={{ width: `${value}%` }} />
                  </i>
                </span>
              ))}
            </div>
          </section>

          <section className="candidate-review-section">
            <h3>推荐理由</h3>
            <p>{selected.reason}</p>
          </section>

          <section className="candidate-review-section candidate-review-columns">
            <div>
              <h3>关键证据</h3>
              <ul>
                {selected.evidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="candidate-risk-list">
              <h3>风险提示</h3>
              <ul>
                {selected.risks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="candidate-review-section">
            <h3>建议动作</h3>
            <p>{selected.recommendation}</p>
          </section>

          <section className="candidate-review-section candidate-review-columns">
            <div>
              <h3>工作经历</h3>
              <ul>
                {selected.experience.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>关键技能</h3>
              <div className="candidate-review-skills">
                {selected.skills.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </section>
        </article>
      </div>

      {!readOnly && (
        <footer className="candidate-review-actions">
          <span>
            {decisions[selected.id]
              ? `当前决定：${candidateDecisionMeta[decisions[selected.id]].label}`
              : "请选择当前候选人的处理决定"}
          </span>
          <div>
            <Button size="sm" onClick={() => decide("reject")}>
              不合适
            </Button>
            <Button size="sm" onClick={() => decide("hold")}>
              保留观察
            </Button>
            <Button size="sm" onClick={() => decide("reserve")}>
              加入岗位储备
            </Button>
            <Button size="sm" tone="primary" onClick={() => decide("contact")}>
              加入联系名单
            </Button>
          </div>
        </footer>
      )}
    </section>
  );
}
