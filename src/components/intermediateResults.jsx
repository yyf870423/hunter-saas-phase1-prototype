import { useState } from "react";
import { Icon } from "./Icon";
import {
  Button,
  Checkbox,
  Input,
  MultiSelect,
  Radio,
  Status,
  Textarea,
  useToast,
} from "./ui";

function WorkspaceShell({ event, onBack, children, footer }) {
  return (
    <section className="intermediate-workspace">
      <header>
        <Button size="sm" tone="ghost" icon="chevronLeft" onClick={onBack}>
          返回对话
        </Button>
        <span>
          <small>中间结果审核</small>
          <h2>{event.title}</h2>
        </span>
        <Status tone={event.tone || "info"}>{event.status || "处理中"}</Status>
      </header>
      <div className="intermediate-scroll">
        <p className="intermediate-intro">{event.detail}</p>
        {children}
      </div>
      {footer && <footer>{footer}</footer>}
    </section>
  );
}

function SubmitFooter({ onBack, onSubmit, readOnly, label = "提交处理结果" }) {
  return (
    <>
      <Button onClick={onBack}>返回对话</Button>
      <Button tone="primary" disabled={readOnly} onClick={onSubmit}>
        {readOnly ? "结果已处理" : label}
      </Button>
    </>
  );
}

function EditableCriteria({ event, onBack, onSubmit, readOnly }) {
  const [groups, setGroups] = useState(() =>
    event.data.groups.map(([label, values]) => ({ label, values })),
  );
  const update = (index, values) =>
    setGroups((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, values } : item,
      ),
    );
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() =>
            onSubmit(
              `已确认 ${groups.reduce((sum, item) => sum + item.values.length, 0)} 项检索条件`,
            )
          }
          label="确认并继续检索"
        />
      }
    >
      <div className="criteria-editor-v2">
        {groups.map((group, index) => (
          <section key={group.label}>
            <header>
              <h3>{group.label}</h3>
              <small>回车添加，点击移除</small>
            </header>
            <div className="editable-tags-v2">
              {group.values.map((value) => (
                <button
                  type="button"
                  disabled={readOnly}
                  key={value}
                  onClick={() =>
                    update(
                      index,
                      group.values.filter((item) => item !== value),
                    )
                  }
                >
                  <span>{value}</span>
                  <Icon name="close" />
                </button>
              ))}
              <Input
                disabled={readOnly}
                placeholder="输入后按回车"
                onKeyDown={(keyboardEvent) => {
                  if (
                    keyboardEvent.key === "Enter" &&
                    keyboardEvent.currentTarget.value.trim()
                  ) {
                    keyboardEvent.preventDefault();
                    update(index, [
                      ...group.values,
                      keyboardEvent.currentTarget.value.trim(),
                    ]);
                    keyboardEvent.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </section>
        ))}
      </div>
    </WorkspaceShell>
  );
}

function Clarification({ event, onBack, onSubmit, readOnly }) {
  const [choice, setChoice] = useState(event.data.options[0]);
  const [note, setNote] = useState("");
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() => onSubmit(note.trim() || choice)}
          label="提交补充信息"
        />
      }
    >
      <div className="clarification-v2">
        <section>
          <Icon name="message" />
          <span>
            <small>Hunter 需要确认</small>
            <h3>{event.data.question}</h3>
            <p>选择最接近的范围，或在下方直接说明其他要求。</p>
          </span>
        </section>
        <div className="decision-options-v2">
          {event.data.options.map((item) => (
            <Radio
              key={item}
              checked={choice === item}
              onChange={() => setChoice(item)}
            >
              {item}
            </Radio>
          ))}
        </div>
        <Textarea
          disabled={readOnly}
          value={note}
          onChange={(changeEvent) => setNote(changeEvent.target.value)}
          placeholder="也可以直接输入范围、排除项或优先级"
        />
      </div>
    </WorkspaceShell>
  );
}

function SourceConflict({ event, onBack, onSubmit, readOnly }) {
  const [decisions, setDecisions] = useState(() =>
    Object.fromEntries(
      event.data.claims.map((_, index) => [
        index,
        index === 1 ? "stale" : "valid",
      ]),
    ),
  );
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() => onSubmit("冲突证据的有效性和时效已确认")}
          label="保存证据判断"
        />
      }
    >
      <div className="source-conflict-v2">
        {event.data.claims.map((row, index) => (
          <article key={row[0]}>
            <header>
              <span>
                <Icon name="link" />
                <b>{row[0]}</b>
              </span>
              <small>{row[2]}</small>
            </header>
            <blockquote>{row[1]}</blockquote>
            <p>来源：{row[3]}</p>
            <div className="decision-options-v2">
              <Radio
                checked={decisions[index] === "valid"}
                onChange={() =>
                  setDecisions((current) => ({ ...current, [index]: "valid" }))
                }
              >
                作为当前证据
              </Radio>
              <Radio
                checked={decisions[index] === "stale"}
                onChange={() =>
                  setDecisions((current) => ({ ...current, [index]: "stale" }))
                }
              >
                标记为过期
              </Radio>
              <Radio
                checked={decisions[index] === "invalid"}
                onChange={() =>
                  setDecisions((current) => ({
                    ...current,
                    [index]: "invalid",
                  }))
                }
              >
                标记无效
              </Radio>
            </div>
          </article>
        ))}
      </div>
    </WorkspaceShell>
  );
}

function RecruitmentOpportunity({ event, onBack, onSubmit, readOnly }) {
  const [decisions, setDecisions] = useState(() =>
    Object.fromEntries(
      event.data.opportunities.map((row, index) => [index, row[3]]),
    ),
  );
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() => onSubmit("招聘机会审核决定已保存")}
          label="确认招聘机会"
        />
      }
    >
      <div className="opportunity-review-v2">
        {event.data.opportunities.map((row, index) => (
          <article key={row[0]}>
            <header>
              <span>
                <Status tone="success">{row[1]}</Status>
                <h3>{row[0]}</h3>
              </span>
              <small>缺少：{row[2]}</small>
            </header>
            <div className="decision-options-v2">
              <Radio
                checked={decisions[index] === "创建岗位招聘主线"}
                onChange={() =>
                  setDecisions((current) => ({
                    ...current,
                    [index]: "创建岗位招聘主线",
                  }))
                }
              >
                创建岗位招聘主线
              </Radio>
              <Radio
                checked={decisions[index] === "保留为招聘机会"}
                onChange={() =>
                  setDecisions((current) => ({
                    ...current,
                    [index]: "保留为招聘机会",
                  }))
                }
              >
                保留为招聘机会
              </Radio>
              <Radio
                checked={decisions[index] === "忽略"}
                onChange={() =>
                  setDecisions((current) => ({ ...current, [index]: "忽略" }))
                }
              >
                忽略
              </Radio>
            </div>
          </article>
        ))}
      </div>
    </WorkspaceShell>
  );
}

function SendResult({ event, onBack, onSubmit, readOnly }) {
  const [failedAction, setFailedAction] = useState("核验邮箱后重试");
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() => onSubmit(`退信联系人将${failedAction}`)}
          label="确认后续处理"
        />
      }
    >
      <div className="send-result-v2">
        <div className="review-table-v2">
          <div>
            <b>联系人</b>
            <b>渠道</b>
            <b>结果</b>
            <b>下一步</b>
          </div>
          {event.data.deliveries.map((row) => (
            <div key={row[0]}>
              <b>{row[0]}</b>
              <span>{row[1]}</span>
              <Status
                tone={
                  row[2].includes("退信")
                    ? "danger"
                    : row[2].includes("已")
                      ? "success"
                      : "info"
                }
              >
                {row[2]}
              </Status>
              <span>{row[3]}</span>
            </div>
          ))}
        </div>
        <section>
          <h3>处理失败项</h3>
          <div className="decision-options-v2">
            <Radio
              checked={failedAction === "核验邮箱后重试"}
              onChange={() => setFailedAction("核验邮箱后重试")}
            >
              核验邮箱后重试
            </Radio>
            <Radio
              checked={failedAction === "改用关系路径"}
              onChange={() => setFailedAction("改用关系路径")}
            >
              改用关系路径
            </Radio>
            <Radio
              checked={failedAction === "停止联系"}
              onChange={() => setFailedAction("停止联系")}
            >
              停止联系
            </Radio>
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}

function IdentityConflict({ event, onBack, onSubmit, readOnly }) {
  const [choices, setChoices] = useState({});
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() =>
            onSubmit(
              `已处理 ${Object.keys(choices).length || event.data.conflicts.length} 组身份冲突`,
            )
          }
          label="确认身份处理"
        />
      }
    >
      <div className="conflict-list-v2">
        {event.data.conflicts.map((row, index) => (
          <article key={`${row[0]}-${index}`}>
            <header>
              <span>
                <Icon name="users" />
                <b>{row[0]}</b>
              </span>
              <Status tone="warning">需要核对</Status>
            </header>
            <dl>
              <div>
                <dt>可能对应</dt>
                <dd>{row[1]}</dd>
              </div>
              <div>
                <dt>证据</dt>
                <dd>{row[2]}</dd>
              </div>
              <div>
                <dt>Hunter 建议</dt>
                <dd>{row[3]}</dd>
              </div>
            </dl>
            <div className="decision-options-v2">
              <Radio
                checked={choices[index] === "merge"}
                onChange={() =>
                  setChoices((current) => ({ ...current, [index]: "merge" }))
                }
              >
                关联已有候选人
              </Radio>
              <Radio
                checked={choices[index] === "separate"}
                onChange={() =>
                  setChoices((current) => ({ ...current, [index]: "separate" }))
                }
              >
                保留为不同身份
              </Radio>
              <Radio
                checked={choices[index] === "evidence"}
                onChange={() =>
                  setChoices((current) => ({ ...current, [index]: "evidence" }))
                }
              >
                继续补证据
              </Radio>
            </div>
          </article>
        ))}
      </div>
    </WorkspaceShell>
  );
}

function ProfileDiff({ event, onBack, onSubmit, readOnly }) {
  const [choices, setChoices] = useState(() =>
    Object.fromEntries(event.data.diffs.map((_, index) => [index, "new"])),
  );
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() =>
            onSubmit(`已审核 ${event.data.diffs.length} 项候选人资料变化`)
          }
          label="应用所选更新"
        />
      }
    >
      <div className="diff-table-v2">
        <div className="diff-head">
          <b>字段</b>
          <b>当前内容</b>
          <b>建议内容</b>
          <b>来源</b>
          <b>处理</b>
        </div>
        {event.data.diffs.map((row, index) => (
          <div key={row[0]}>
            <b>{row[0]}</b>
            <span>{row[1]}</span>
            <span className="suggested-value">{row[2]}</span>
            <small>{row[3]}</small>
            <span className="diff-actions-v2">
              <Radio
                checked={choices[index] === "old"}
                onChange={() =>
                  setChoices((current) => ({ ...current, [index]: "old" }))
                }
              >
                保留原值
              </Radio>
              <Radio
                checked={choices[index] === "new"}
                onChange={() =>
                  setChoices((current) => ({ ...current, [index]: "new" }))
                }
              >
                使用建议
              </Radio>
            </span>
          </div>
        ))}
      </div>
    </WorkspaceShell>
  );
}

function AcademicClues({ event, onBack, onSubmit, readOnly }) {
  const [selected, setSelected] = useState(
    event.data.items.map((_, index) => index),
  );
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() =>
            onSubmit(`已确认 ${selected.length} 条论文与专利线索`)
          }
          label="确认所选线索"
        />
      }
    >
      <div className="review-table-v2">
        <div>
          <span />
          <b>类型</b>
          <b>标题</b>
          <b>人物</b>
          <b>来源</b>
        </div>
        {event.data.items.map((row, index) => (
          <div key={row[1]}>
            <Checkbox
              disabled={readOnly}
              checked={selected.includes(index)}
              onChange={(checked) =>
                setSelected((current) =>
                  checked
                    ? [...current, index]
                    : current.filter((item) => item !== index),
                )
              }
            />
            <Status tone={row[0] === "论文" ? "info" : "violet"}>
              {row[0]}
            </Status>
            <b>{row[1]}</b>
            <span>{row[2]}</span>
            <small>{row[3]}</small>
          </div>
        ))}
      </div>
    </WorkspaceShell>
  );
}

function RelationPath({ event, onBack, onSubmit, readOnly }) {
  const [decisions, setDecisions] = useState(() =>
    Object.fromEntries(event.data.paths.map((_, index) => [index, "confirm"])),
  );
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() => onSubmit("联系路径核验结果已保存")}
          label="保存核验结果"
        />
      }
    >
      <div className="relation-review-v2">
        {event.data.paths.map((row, index) => (
          <article key={row[0]}>
            <header>
              <Icon name="route" />
              <b>{row[0]}</b>
              <Status tone={row[2] === "高" ? "success" : "warning"}>
                可信度 {row[2]}
              </Status>
            </header>
            <p>{row[1]}</p>
            <div>
              <Radio
                checked={decisions[index] === "confirm"}
                onChange={() =>
                  setDecisions((current) => ({
                    ...current,
                    [index]: "confirm",
                  }))
                }
              >
                确认关系
              </Radio>
              <Radio
                checked={decisions[index] === "reject"}
                onChange={() =>
                  setDecisions((current) => ({ ...current, [index]: "reject" }))
                }
              >
                否决
              </Radio>
              <Radio
                checked={decisions[index] === "pending"}
                onChange={() =>
                  setDecisions((current) => ({
                    ...current,
                    [index]: "pending",
                  }))
                }
              >
                继续核验
              </Radio>
            </div>
          </article>
        ))}
      </div>
    </WorkspaceShell>
  );
}

function PositionAnalysis({ event, onBack, onSubmit, readOnly }) {
  const [selected, setSelected] = useState(
    event.data.fields.map((_, index) => index),
  );
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() => onSubmit(`已应用 ${selected.length} 项岗位解析建议`)}
          label="应用所选建议"
        />
      }
    >
      <div className="analysis-review-v2">
        {event.data.fields.map((row, index) => (
          <article
            key={row[0]}
            className={selected.includes(index) ? "is-selected" : ""}
          >
            <header>
              <Checkbox
                disabled={readOnly}
                checked={selected.includes(index)}
                onChange={(checked) =>
                  setSelected((current) =>
                    checked
                      ? [...current, index]
                      : current.filter((item) => item !== index),
                  )
                }
              >
                <b>{row[0]}</b>
              </Checkbox>
              <Button size="sm" disabled={readOnly}>
                编辑
              </Button>
            </header>
            <p>{row[1]}</p>
          </article>
        ))}
      </div>
    </WorkspaceShell>
  );
}

function ExternalReply({ event, onBack, onSubmit, readOnly }) {
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() =>
            onSubmit("回复、附件和人工补充信息已进入资料差异分析")
          }
          label="读取并比较资料"
        />
      }
    >
      <div className="external-reply-v2">
        <section>
          <h3>候选人回复</h3>
          <blockquote>{event.data.reply}</blockquote>
        </section>
        <button type="button">
          <Icon name="file" />
          <span>
            <b>{event.data.filename}</b>
            <small>PDF · 2.4 MB · 文件门禁通过</small>
          </span>
          <Button size="sm">打开附件</Button>
        </button>
        <section>
          <h3>人工补充信息</h3>
          <Textarea
            disabled={readOnly}
            placeholder="记录电话、微信或线下沟通中获得的新信息"
          />
        </section>
      </div>
    </WorkspaceShell>
  );
}

function MarkdownFile({ event, onBack }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const markdown = `# 星澜机器人客户开发调研记录\n\n## 已确认结论\n\n- B+ 轮融资后持续扩充机器人研发团队。\n- VLA 算法负责人和运动控制专家已有明确 HC。\n- HRD 周雅雯可直接确认合作方式。\n\n## 尚待核验\n\n1. 运动控制岗位职级与汇报线。\n2. 灵巧手团队是否接受外部猎头。\n\n## 来源\n\n- 公司招聘官网\n- B+ 轮融资公告\n- 客户联系人邮件回复`;
  return (
    <WorkspaceShell event={event} onBack={onBack}>
      <div className="markdown-file-v2">
        <header>
          <span>
            <Icon name="file" />
            <span>
              <b>{event.data.filename}</b>
              <small>Markdown · 刚刚生成</small>
            </span>
          </span>
          <div>
            <Button
              size="sm"
              icon="copy"
              onClick={() => {
                navigator.clipboard?.writeText(markdown);
                setCopied(true);
                toast("文件内容已复制");
              }}
            >
              {copied ? "已复制" : "复制"}
            </Button>
            <Button
              size="sm"
              icon="download"
              onClick={() => toast("文件下载已开始")}
            >
              下载
            </Button>
          </div>
        </header>
        <pre>{markdown}</pre>
      </div>
    </WorkspaceShell>
  );
}

function PartialResult({ event, onBack, onSubmit, readOnly }) {
  const [choice, setChoice] = useState("continue");
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() =>
            onSubmit(
              choice === "accept"
                ? "接受当前可用结果并结束本轮"
                : "保留可用结果并继续补齐缺口",
            )
          }
          label="确认处理方式"
        />
      }
    >
      <div className="partial-result-v2">
        <section>
          <h3>
            <Icon name="check" />
            已完成
          </h3>
          <ul>
            {event.data.done.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3>
            <Icon name="clock" />
            尚未完成
          </h3>
          <ul>
            {event.data.pending.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <div className="decision-options-v2">
          <Radio
            checked={choice === "continue"}
            onChange={() => setChoice("continue")}
          >
            保留当前结果并继续补齐
          </Radio>
          <Radio
            checked={choice === "accept"}
            onChange={() => setChoice("accept")}
          >
            接受部分结果并结束本轮
          </Radio>
          <Radio
            checked={choice === "scope"}
            onChange={() => setChoice("scope")}
          >
            缩小范围后继续
          </Radio>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function NoResult({ event, onBack, onSubmit, readOnly }) {
  const [selected, setSelected] = useState([event.data.suggestions[0]]);
  const [note, setNote] = useState("");
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() =>
            onSubmit(note || `按 ${selected.join("、")} 调整范围`)
          }
          label="应用调整并重试"
        />
      }
    >
      <div className="no-result-v2">
        <section>
          <h3>已经查过</h3>
          <div>
            {event.data.searched.map((item) => (
              <Status key={item} tone="neutral">
                {item}
              </Status>
            ))}
          </div>
        </section>
        <section>
          <h3>可能原因</h3>
          <ul>
            {event.data.reasons.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3>建议调整</h3>
          <div className="suggestion-checks-v2">
            {event.data.suggestions.map((item) => (
              <Checkbox
                key={item}
                disabled={readOnly}
                checked={selected.includes(item)}
                onChange={(checked) =>
                  setSelected((current) =>
                    checked
                      ? [...current, item]
                      : current.filter((entry) => entry !== item),
                  )
                }
              >
                {item}
              </Checkbox>
            ))}
          </div>
          <Textarea
            disabled={readOnly}
            value={note}
            onChange={(changeEvent) => setNote(changeEvent.target.value)}
            placeholder="也可以直接说明新的搜索条件"
          />
        </section>
      </div>
    </WorkspaceShell>
  );
}

function RuntimeFailure({ event, onBack, onSubmit, readOnly }) {
  const toast = useToast();
  const [choice, setChoice] = useState("从检查点重试当前步骤");
  const [technicalOpen, setTechnicalOpen] = useState(false);
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() => onSubmit(choice)}
          label="确认恢复方式"
        />
      }
    >
      <div className="runtime-failure-v2">
        <div className="barrier-summary">
          <Icon name="warning" />
          <span>
            <b>任务没有丢失已完成结果</b>
            <p>
              失败步骤已停止，Hunter
              不会从头重跑，也不会无限重复同一个失败动作。
            </p>
          </span>
        </div>
        <dl className="barrier-meta-v2">
          <div>
            <dt>失败步骤</dt>
            <dd>{event.data.step}</dd>
          </div>
          <div>
            <dt>检查点</dt>
            <dd>{event.data.checkpoint}</dd>
          </div>
          <div>
            <dt>已保留</dt>
            <dd>{event.data.retained}</dd>
          </div>
        </dl>
        <div className="decision-options-v2">
          <Radio
            checked={choice === "从检查点重试当前步骤"}
            onChange={() => setChoice("从检查点重试当前步骤")}
          >
            从检查点重试当前步骤
          </Radio>
          <Radio
            checked={choice === "跳过当前附件继续"}
            onChange={() => setChoice("跳过当前附件继续")}
          >
            跳过当前附件继续
          </Radio>
          <Radio
            checked={choice === "停止并保留诊断"}
            onChange={() => setChoice("停止并保留诊断")}
          >
            停止并保留诊断
          </Radio>
        </div>
        <Button
          icon="file"
          onClick={() => setTechnicalOpen((current) => !current)}
        >
          {technicalOpen ? "收起技术详情" : "查看技术详情"}
        </Button>
        {technicalOpen && (
          <section className="technical-error-v2">
            <header>
              <b>技术详情</b>
              <Button
                size="sm"
                icon="copy"
                onClick={() => toast("错误信息已复制")}
              >
                复制
              </Button>
            </header>
            <code>{event.data.error}</code>
          </section>
        )}
      </div>
    </WorkspaceShell>
  );
}

function BarrierResult({ event, onBack, onSubmit, readOnly }) {
  const toast = useToast();
  const isBudget = event.interactionKind === "budget-blocked";
  const isGate = event.interactionKind === "gate-failure";
  const options = isBudget
    ? ["仅补齐高优先级位置", "增加本轮预算", "保存结果并停止"]
    : isGate
      ? ["自动修正当前步骤", "查看不合格字段", "停止并保留诊断"]
      : ["打开平台登录", "跳过该平台继续", "停止当前任务"];
  const [choice, setChoice] = useState(options[0]);
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() => onSubmit(choice)}
          label="确认并继续"
        />
      }
    >
      <div className="barrier-result-v2">
        <div className="barrier-summary">
          <Icon name="warning" />
          <span>
            <b>{event.title}</b>
            <p>{event.detail}</p>
          </span>
        </div>
        {isBudget && (
          <div className="budget-meter-v2">
            <span>
              <b>当前已使用</b>
              <strong>{event.data.used}%</strong>
            </span>
            <i>
              <i style={{ width: `${event.data.used}%` }} />
            </i>
            <small>继续全部范围预计额外使用 {event.data.estimate}%</small>
          </div>
        )}
        {isGate && (
          <ul>
            {event.data.failures.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {!isBudget && !isGate && (
          <dl className="barrier-meta-v2">
            <div>
              <dt>平台</dt>
              <dd>{event.data.platform}</dd>
            </div>
            <div>
              <dt>检查点</dt>
              <dd>{event.data.checkpoint}</dd>
            </div>
            <div>
              <dt>已保留</dt>
              <dd>{event.data.retained}</dd>
            </div>
          </dl>
        )}
        <div className="decision-options-v2">
          {options.map((item) => (
            <Radio
              key={item}
              checked={choice === item}
              onChange={() => setChoice(item)}
            >
              {item}
            </Radio>
          ))}
        </div>
        {!isBudget && !isGate && (
          <Button
            icon="play"
            onClick={() => toast("已请求打开人才平台浏览器", "info")}
          >
            打开平台处理
          </Button>
        )}
      </div>
    </WorkspaceShell>
  );
}

function ImpactAnalysis({ event, onBack, onSubmit, readOnly }) {
  const items = event.data.affected || [];
  const [selected, setSelected] = useState(items);
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        <SubmitFooter
          onBack={onBack}
          readOnly={readOnly}
          onSubmit={() => onSubmit(`只重算 ${selected.length} 个受影响岗位`)}
          label="确认局部重算"
        />
      }
    >
      <div className="impact-review-v2">
        <div className="impact-callout">
          <Icon name="refresh" />
          <span>
            <b>不会全量重跑</b>
            <p>
              仅重算你确认的受影响对象；{event.data.unchanged || 0}{" "}
              个历史结果保持不变。
            </p>
          </span>
        </div>
        {items.map((item) => (
          <Checkbox
            key={item}
            disabled={readOnly}
            checked={selected.includes(item)}
            onChange={(checked) =>
              setSelected((current) =>
                checked
                  ? [...current, item]
                  : current.filter((entry) => entry !== item),
              )
            }
          >
            {item}
          </Checkbox>
        ))}
      </div>
    </WorkspaceShell>
  );
}

function GenericResult({ event, onBack, onSubmit, readOnly }) {
  const [note, setNote] = useState("");
  const data = event.data || {};
  return (
    <WorkspaceShell
      event={event}
      onBack={onBack}
      footer={
        event.blocking ? (
          <SubmitFooter
            onBack={onBack}
            readOnly={readOnly}
            onSubmit={() => onSubmit(note || "按 Hunter 建议继续")}
            label="提交反馈"
          />
        ) : null
      }
    >
      <div className="generic-result-v2">
        {event.inlineData?.rows?.length ? (
          <div className="review-table-v2 generic-table">
            <div>
              {event.inlineData.columns.map((column) => (
                <b key={column.key}>{column.label}</b>
              ))}
            </div>
            {event.inlineData.rows.map((row, index) => (
              <div key={row.id || index}>
                {event.inlineData.columns.map((column) => (
                  <span key={column.key}>{row[column.key]}</span>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="generic-result-copy">
            <Icon name="info" />
            <p>
              完整内容和证据已保留在当前业务主线中。你可以直接在下方输入修改要求，或按
              Hunter 建议继续。
            </p>
          </div>
        )}
        {event.blocking && (
          <Textarea
            value={note}
            onChange={(changeEvent) => setNote(changeEvent.target.value)}
            placeholder="输入修改意见、处理范围或其他要求"
          />
        )}
      </div>
    </WorkspaceShell>
  );
}

export function IntermediateResultWorkspace({
  event,
  onBack,
  onSubmit,
  readOnly = false,
}) {
  const props = { event, onBack, onSubmit, readOnly };
  switch (event.interactionKind) {
    case "clarification":
      return <Clarification {...props} />;
    case "editable-criteria":
      return <EditableCriteria {...props} />;
    case "source-conflict":
      return <SourceConflict {...props} />;
    case "recruitment-opportunity":
      return <RecruitmentOpportunity {...props} />;
    case "send-result":
      return <SendResult {...props} />;
    case "identity-conflict":
      return <IdentityConflict {...props} />;
    case "profile-diff":
      return <ProfileDiff {...props} />;
    case "academic-clues":
      return <AcademicClues {...props} />;
    case "relation-path":
      return <RelationPath {...props} />;
    case "position-analysis":
      return <PositionAnalysis {...props} />;
    case "external-reply":
      return <ExternalReply {...props} />;
    case "markdown-file":
      return <MarkdownFile event={event} onBack={onBack} />;
    case "partial-result":
      return <PartialResult {...props} />;
    case "no-result":
      return <NoResult {...props} />;
    case "runtime-failure":
      return <RuntimeFailure {...props} />;
    case "login-blocked":
    case "budget-blocked":
    case "gate-failure":
      return <BarrierResult {...props} />;
    case "impact-analysis":
      return <ImpactAnalysis {...props} />;
    default:
      return <GenericResult {...props} />;
  }
}
