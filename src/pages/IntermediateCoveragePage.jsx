import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Button, PageHeader, Status } from "../components/ui";
import { intermediateScenarioCatalog } from "../data/intermediateScenarios";

const routeByKind = {
  client: "/workstreams/client-xinglan/client",
  position: "/workstreams/position-vla/position",
  mapping: "/workstreams/mapping-embodied/mapping",
  career: "/workstreams/career-linhao/career",
};

const kindLabel = {
  client: "客户开发",
  position: "岗位招聘",
  mapping: "人才摸排",
  career: "候选人求职",
};

const interactionCopy = {
  "target-plan": "查看计划变化、暂停并通过自然语言补充目标",
  clarification: "选择最接近的范围，或通过自然语言补充边界",
  "search-strategy": "增删公司、关键词、方向和范围后继续",
  "source-evidence": "打开来源、复制、标记无效并补充证据",
  "source-conflict": "逐条判断当前有效、过期或无效证据",
  "company-contact-draft": "逐字段核对公司和联系人及联系方式",
  "recruitment-opportunity": "创建岗位主线、保留机会或忽略",
  "external-reply": "查看回复、打开附件并补录人工信息",
  "organization-draft": "核验组织、人物、方向和缺口",
  "candidate-pool": "查看完整匹配分、理由、风险并逐人处理",
  "identity-dedupe": "合并、保留两者或继续补证据",
  "profile-diff": "逐字段保留原值或使用新值",
  "academic-clues": "筛选、关联人物并确认论文与专利线索",
  "relation-path": "核验、否决或继续核验联系路径",
  "position-analysis": "逐项编辑并应用岗位解析建议",
  "position-match": "查看候选人可匹配岗位和建议动作",
  "message-draft": "编辑沟通对象、身份、渠道和正文",
  "outbound-permission": "选择一次性授权、拒绝或自然语言调整",
  "external-send-result": "查看逐条结果，重试失败项或改用其他渠道",
  "impact-analysis": "选择受影响范围并执行局部重算",
  "branch-suggestion": "创建支线、稍后提醒或忽略",
  "generated-file": "右侧预览、复制和下载 Markdown 文件",
  "partial-completion": "接受部分结果、继续或缩小范围",
  "no-result": "查看已查范围和原因，修改条件后局部重试",
  "coverage-gap": "查看已完成范围与关键缺口",
  "login-blocked": "打开平台、从检查点继续或跳过",
  "budget-blocked": "增加预算、缩小范围或停止",
  "runtime-failure": "查看检查点、技术详情并选择恢复方式",
  "gate-failure": "查看不合法字段、自动修正或下载诊断",
  "external-wait": "查看等待对象、恢复条件和已保留成果",
  "local-rematch": "选择受影响岗位，避免全量重跑",
};

export function IntermediateCoveragePage() {
  const navigate = useNavigate();
  return (
    <main className="intermediate-coverage-page">
      <section className="coverage-content">
        <div className="coverage-heading">
          <PageHeader
            eyebrow="业务主线对话"
            title="中间结果交互覆盖索引"
            description="每一项都进入真实业务主线的对应进度，并直接打开可操作结果。完成处理后，结果会形成用户消息，Agent 再继续推进。"
            back={() => navigate("/review")}
            actions={
              <Button
                tone="primary"
                icon="route"
                onClick={() => navigate("/workstreams/position-vla/position")}
              >
                从头体验岗位主线
              </Button>
            }
          />
        </div>
        <div className="coverage-summary-v2">
          <article>
            <strong>{intermediateScenarioCatalog.length}</strong>
            <span>类中间结果</span>
          </article>
          <article>
            <strong>4</strong>
            <span>条业务主线</span>
          </article>
          <article>
            <strong>3</strong>
            <span>结果承载层级</span>
          </article>
          <article>
            <strong>100%</strong>
            <span>可点击审核</span>
          </article>
        </div>
        <section className="surface coverage-table-v2">
          <header>
            <span>
              <h2>完整覆盖清单</h2>
              <p>不是组件演示；每项均使用相应业务数据和正常推进上下文。</p>
            </span>
            <Status tone="success">已建立直接验收入口</Status>
          </header>
          <div className="coverage-row coverage-head">
            <b>中间结果</b>
            <b>所属业务主线</b>
            <b>主要交互</b>
            <b>验收</b>
          </div>
          {intermediateScenarioCatalog.map((item) => (
            <div className="coverage-row" key={`${item.kind}-${item.scene}`}>
              <span>
                <Icon name="task" />
                <b>{item.title}</b>
              </span>
              <Status
                tone={
                  item.kind === "client"
                    ? "violet"
                    : item.kind === "position"
                      ? "info"
                      : item.kind === "mapping"
                        ? "success"
                        : "warning"
                }
              >
                {kindLabel[item.kind]}
              </Status>
              <p>{interactionCopy[item.scene]}</p>
              <Button
                size="sm"
                icon="chevronRight"
                onClick={() =>
                  navigate(`${routeByKind[item.kind]}?scene=${item.scene}`)
                }
              >
                打开场景
              </Button>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
