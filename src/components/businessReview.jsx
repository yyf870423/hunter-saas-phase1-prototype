import { useMemo, useState } from "react";
import { businessReviewDefinitions } from "../data/businessReviews";
import { Icon } from "./Icon";
import { Button, Input, Status, Textarea, useToast } from "./ui";

export function BusinessReviewWorkspace({
  reviewId,
  initialDecisions = {},
  initialDrafts = {},
  readOnly = false,
  onBack,
  onSubmit,
}) {
  const toast = useToast();
  const review = businessReviewDefinitions[reviewId];
  const [selectedId, setSelectedId] = useState(review?.items?.[0]?.id);
  const [decisions, setDecisions] = useState(initialDecisions);
  const [drafts, setDrafts] = useState(() =>
    Object.fromEntries(
      (review?.items || []).map((item) => [
        item.id,
        initialDrafts[item.id] ||
          Object.fromEntries(
            (item.editableFields || []).map((field) => [
              field.key,
              field.value,
            ]),
          ),
      ]),
    ),
  );
  const selected = review?.items?.find((item) => item.id === selectedId);
  const actionable =
    Boolean(review?.decisionOptions?.length) && !review.readOnly;
  const handled = Object.keys(decisions).length;
  const unresolved = Math.max(0, (review?.items?.length || 0) - handled);
  const decisionMeta = useMemo(
    () =>
      Object.fromEntries(
        (review?.decisionOptions || []).map((item) => [item.value, item]),
      ),
    [review],
  );

  if (!review || !selected) return null;

  const decide = (value) => {
    setDecisions((current) => ({ ...current, [selected.id]: value }));
    const next = review.items.find(
      (item) => item.id !== selected.id && !decisions[item.id],
    );
    if (next) setSelectedId(next.id);
  };

  const applySuggestions = () => {
    setDecisions(
      Object.fromEntries(
        review.items.map((item) => [
          item.id,
          item.suggestedDecision || review.suggestedDecision,
        ]),
      ),
    );
    toast("已按系统建议填充未处理项", "info");
  };

  const submit = () => {
    if (actionable && handled !== review.items.length) return;
    onSubmit?.({ decisions, drafts, response: review.response });
  };

  return (
    <section className="business-review-workspace" aria-label={review.title}>
      <header className="business-review-header">
        <Button icon="chevronLeft" size="sm" onClick={onBack}>
          返回业务主线
        </Button>
        <span>
          <small>{review.eyebrow}</small>
          <b>{review.title}</b>
        </span>
        <div>
          {actionable && !readOnly ? (
            <>
              <span className="business-review-progress">
                <b>{handled}</b> / {review.items.length} 已处理
              </span>
              <Button size="sm" onClick={applySuggestions}>
                按建议处理未审核
              </Button>
              <Button
                size="sm"
                tone="primary"
                disabled={unresolved > 0}
                onClick={submit}
              >
                {review.submitLabel || "提交审核"}
              </Button>
            </>
          ) : (
            <Status tone="success" dot={false}>
              {readOnly ? "已处理结果" : "只读结果"}
            </Status>
          )}
        </div>
      </header>

      <div className="business-review-summary">
        {review.metrics.map(([label, value]) => (
          <span key={label}>
            <b>{value}</b>
            <small>{label}</small>
          </span>
        ))}
        <p>
          <Icon name="info" />
          {review.description}
        </p>
      </div>

      {review.summaryFields?.length ? (
        <dl className="business-review-overview">
          {review.summaryFields.map(([label, value, span]) => (
            <div className={span ? "is-wide" : ""} key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="business-review-body">
        <aside className="business-review-list" aria-label="待审核对象">
          {review.items.map((item) => {
            const decision = decisionMeta[decisions[item.id]];
            return (
              <button
                type="button"
                className={item.id === selected.id ? "is-active" : ""}
                key={item.id}
                onClick={() => setSelectedId(item.id)}
              >
                <span>
                  <b>{item.title}</b>
                  <small>{item.subtitle}</small>
                </span>
                <Status
                  tone={decision?.tone || item.tone || "neutral"}
                  dot={false}
                >
                  {decision?.label || item.status}
                </Status>
              </button>
            );
          })}
        </aside>

        <article className="business-review-detail">
          <header>
            <span>
              <small>当前审核对象</small>
              <h2>{selected.title}</h2>
              <p>{selected.subtitle}</p>
            </span>
            <Status tone={selected.tone || "neutral"} dot={false}>
              {selected.status}
            </Status>
          </header>

          <dl className="business-review-fields">
            {(selected.fields || []).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value || "待补充"}</dd>
              </div>
            ))}
          </dl>

          {selected.editableFields?.length ? (
            <section className="business-review-section business-review-editable">
              <h3>可编辑内容</h3>
              {selected.editableFields.map((field) =>
                field.multiline ? (
                  <Textarea
                    key={field.key}
                    label={field.label}
                    rows={7}
                    disabled={readOnly}
                    value={drafts[selected.id]?.[field.key] || ""}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [selected.id]: {
                          ...current[selected.id],
                          [field.key]: event.target.value,
                        },
                      }))
                    }
                  />
                ) : (
                  <Input
                    key={field.key}
                    label={field.label}
                    disabled={readOnly}
                    value={drafts[selected.id]?.[field.key] || ""}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [selected.id]: {
                          ...current[selected.id],
                          [field.key]: event.target.value,
                        },
                      }))
                    }
                  />
                ),
              )}
            </section>
          ) : null}

          {(selected.sections || []).map((section) => (
            <section className="business-review-section" key={section.title}>
              <h3>{section.title}</h3>
              {section.text ? <p>{section.text}</p> : null}
              {section.items?.length ? (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {selected.recommendation ? (
            <section className="business-review-section business-review-recommendation">
              <h3>系统建议</h3>
              <p>{selected.recommendation}</p>
            </section>
          ) : null}

          {selected.evidence?.length ? (
            <section className="business-review-section">
              <h3>证据与来源</h3>
              <div className="business-review-evidence">
                {selected.evidence.map((item) => (
                  <button
                    type="button"
                    key={`${selected.id}-${item.title}`}
                    onClick={() => toast(`已打开证据：${item.title}`, "info")}
                  >
                    <Icon name="link" />
                    <span>
                      <b>{item.title}</b>
                      <small>{item.source}</small>
                      <p>{item.detail}</p>
                    </span>
                    <Status
                      tone={item.verified ? "success" : "warning"}
                      dot={false}
                    >
                      {item.verified ? "已核验" : "待核验"}
                    </Status>
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </div>

      {actionable && !readOnly ? (
        <footer className="business-review-actions">
          <span>
            {decisions[selected.id]
              ? `当前决定：${decisionMeta[decisions[selected.id]].label}`
              : "请选择当前对象的处理决定"}
          </span>
          <div>
            {review.decisionOptions.map((option) => (
              <Button
                key={option.value}
                size="sm"
                tone={option.tone || "secondary"}
                onClick={() => decide(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </footer>
      ) : null}
    </section>
  );
}
