import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  DataTable,
  Drawer,
  IconButton,
  Input,
  Modal,
  PageHeader,
  Progress,
  Radio,
  Select,
  Status,
  Tabs,
  Textarea,
  useToast,
} from "../components/ui";
import { Icon } from "../components/Icon";
import { toneForStatus } from "../components/business";

const importKinds = [
  [
    "user",
    "候选人简历",
    "PDF、DOCX、图片、URL 或文本",
    "简历文件会先通过内容类型门禁",
  ],
  [
    "building",
    "公司资料",
    "PDF、DOCX 或只输入公司名",
    "可用 LLM 或 Agent 解析，确认后写入",
  ],
  ["briefcase", "岗位", "JD 文件、文本或链接", "解析为岗位草稿并确认"],
  ["paper", "论文", "标题、URL、PDF 或批量列表", "检索、去重并关联作者候选人"],
  ["patent", "专利", "标题、公开链接或批量列表", "关联发明人与候选人"],
  ["route", "人才摸排", "Excel 或 FreeMind", "导入到当前摸排；重名时先确认"],
];

const importRuns = [
  {
    id: "import-resumes",
    name: "5 份候选人简历",
    type: "候选人",
    status: "等待确认",
    progress: 100,
    result: "4 份可写入，1 份疑似重复",
    time: "今天 10:22",
  },
  {
    id: "import-company",
    name: "星澜机器人公司资料.docx",
    type: "公司",
    status: "已完成",
    progress: 100,
    result: "已创建公司资料",
    time: "昨天 16:40",
  },
  {
    id: "import-mapping",
    name: "具身智能人才摸排.xlsx",
    type: "人才摸排",
    status: "失败",
    progress: 62,
    result: "第 74 行 candidate_id 无效",
    time: "8 月 15 日",
  },
];

export function ImportsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [history, setHistory] = useState("all");
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="数据进入"
        title="把外部资料带入 Hunter"
        description="所有输入先经过格式、内容类型、身份、重复和字段门禁；确认后才写入正式业务资产。"
        actions={
          <Button
            tone="primary"
            icon="upload"
            onClick={() => navigate("/imports/new")}
          >
            新建导入
          </Button>
        }
      />
      <div className="import-kind-grid">
        {importKinds.map(([icon, title, formats, note]) => (
          <button
            key={title}
            onClick={() => navigate(`/imports/new?type=${title}`)}
          >
            <i>
              <Icon name={icon} />
            </i>
            <span>
              <h2>{title}</h2>
              <p>{formats}</p>
              <small>{note}</small>
            </span>
            <Icon name="chevronRight" />
          </button>
        ))}
      </div>
      <section className="page-section surface">
        <header className="surface-header">
          <div>
            <h2>最近导入任务</h2>
            <small>任务可以离开页面继续处理</small>
          </div>
          <Button
            size="sm"
            icon="download"
            onClick={() => toast("模板下载已开始")}
          >
            下载模板
          </Button>
        </header>
        <Tabs
          value={history}
          onChange={setHistory}
          items={[
            { value: "all", label: "全部" },
            { value: "running", label: "处理中" },
            { value: "waiting", label: "等待确认" },
            { value: "failed", label: "失败" },
          ]}
        />
        <div className="import-history">
          {importRuns.map((run) => (
            <button key={run.id} onClick={() => navigate(`/imports/${run.id}`)}>
              <i className={`import-${toneForStatus(run.status)}`}>
                <Icon
                  name={
                    run.type === "候选人"
                      ? "user"
                      : run.type === "公司"
                        ? "building"
                        : "route"
                  }
                />
              </i>
              <span>
                <b>{run.name}</b>
                <small>
                  {run.type} · {run.result}
                </small>
                <Progress value={run.progress} />
              </span>
              <Status tone={toneForStatus(run.status)}>{run.status}</Status>
              <time>{run.time}</time>
              <Icon name="chevronRight" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ImportWizardPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [kind, setKind] = useState("resume");
  const [inputMode, setInputMode] = useState("file");
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState("");
  const [target, setTarget] = useState("library");
  const chooseFile = () => {
    setFile({
      name:
        kind === "mapping"
          ? "具身智能核心人才摸排.xlsx"
          : "林昊_简历_2026-08.pdf",
      size: "2.8 MB",
    });
    setError("");
  };
  const next = () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2 && inputMode === "file" && !file) {
      setError("请选择要导入的文件");
      return;
    }
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    toast("导入任务已创建，可以离开页面");
    navigate("/imports/import-resumes");
  };
  return (
    <div className="page-content import-wizard">
      <PageHeader
        eyebrow="新建导入"
        title="导入外部业务资料"
        description="选择类型和输入方式后，Hunter 会先校验再创建后台任务。"
        back={() => navigate("/imports")}
      />
      <div className="stepper">
        {["选择类型", "添加内容", "检查与去重", "确认目标"].map(
          (label, index) => (
            <div
              className={
                index + 1 < step
                  ? "is-done"
                  : index + 1 === step
                    ? "is-active"
                    : ""
              }
              key={label}
            >
              <i>{index + 1 < step ? <Icon name="check" /> : index + 1}</i>
              <span>{label}</span>
            </div>
          ),
        )}
      </div>
      <section className="surface wizard-card">
        {step === 1 && (
          <div className="surface-body">
            <h2>选择数据类型</h2>
            <div className="choice-grid">
              {[
                ["resume", "user", "候选人简历", "支持文件、URL 和文本"],
                ["company", "building", "公司资料", "支持文件或只输入公司名"],
                ["position", "briefcase", "岗位", "支持 JD 文件、链接或文本"],
                ["mapping", "route", "人才摸排", "支持 Excel 和 FreeMind"],
              ].map(([value, icon, title, note]) => (
                <button
                  className={`choice-card ${kind === value ? "is-selected" : ""}`}
                  key={value}
                  onClick={() => setKind(value)}
                >
                  <i>
                    <Icon name={icon} />
                  </i>
                  <span>
                    <b>{title}</b>
                    <small>{note}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="surface-body stack">
            <h2>添加要处理的内容</h2>
            <Tabs
              value={inputMode}
              onChange={setInputMode}
              items={[
                { value: "file", label: "文件" },
                { value: "url", label: "URL" },
                { value: "text", label: "文本" },
              ]}
            />
            {inputMode === "file" && (
              <div
                className={`upload-drop ${drag ? "is-over" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDrag(false);
                  chooseFile();
                }}
              >
                <i>
                  <Icon name="upload" />
                </i>
                {file ? (
                  <>
                    <h3>{file.name}</h3>
                    <p>{file.size} · 等待格式和内容门禁</p>
                    <Button tone="dangerGhost" onClick={() => setFile(null)}>
                      移除文件
                    </Button>
                  </>
                ) : (
                  <>
                    <h3>拖放文件到这里</h3>
                    <p>
                      {kind === "mapping"
                        ? "只支持 XLSX 和 MM 文件"
                        : "支持 PDF、DOCX、图片和批量 ZIP"}
                    </p>
                    <Button onClick={chooseFile}>选择文件</Button>
                  </>
                )}
                {error && (
                  <span className="field-message">
                    <Icon name="warning" />
                    {error}
                  </span>
                )}
              </div>
            )}
            {inputMode === "url" && (
              <Input
                label="公开 URL"
                placeholder="https://"
                prefix="link"
                help="Hunter 会展开允许的内部链接和个人主页，但不会绕过访问权限。"
              />
            )}
            {inputMode === "text" && (
              <Textarea
                label="原始文本"
                placeholder="粘贴简历、岗位或公司资料原文"
              />
            )}
          </div>
        )}
        {step === 3 && (
          <div className="surface-body stack">
            <h2>格式、内容与重复预检</h2>
            <div className="check-list">
              <article>
                <i className="check-success">
                  <Icon name="check" />
                </i>
                <span>
                  <b>文件格式可读取</b>
                  <small>PDF · 2.8 MB · 未损坏</small>
                </span>
              </article>
              <article>
                <i className="check-success">
                  <Icon name="check" />
                </i>
                <span>
                  <b>内容类型是候选人简历</b>
                  <small>
                    包含姓名、教育、工作和项目经历；不是公司介绍或合同。
                  </small>
                </span>
              </article>
              <article>
                <i className="check-warning">
                  <Icon name="warning" />
                </i>
                <span>
                  <b>发现 1 位疑似重复候选人</b>
                  <small>
                    林昊 · 当前公司与最近经历一致，进入任务后确认合并或保留。
                  </small>
                </span>
                <Button
                  size="sm"
                  onClick={() => toast("重复对比已打开", "info")}
                >
                  查看对比
                </Button>
              </article>
            </div>
            <div className="privacy-note">
              <Icon name="info" />
              <span>预检只判断能否创建任务，不会写入正式业务资产。</span>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="surface-body stack">
            <h2>确认写入目标</h2>
            <div className="choice-grid">
              <button
                className={`choice-card ${target === "library" ? "is-selected" : ""}`}
                onClick={() => setTarget("library")}
              >
                <i>
                  <Icon name="database" />
                </i>
                <span>
                  <b>候选人资产库</b>
                  <small>解析完成后逐项确认，再创建或更新候选人。</small>
                </span>
              </button>
              <button
                className={`choice-card ${target === "stream" ? "is-selected" : ""}`}
                onClick={() => setTarget("stream")}
              >
                <i>
                  <Icon name="route" />
                </i>
                <span>
                  <b>同时关联业务主线</b>
                  <small>写入候选人后，关联到林昊求职主线。</small>
                </span>
              </button>
            </div>
            <Select
              label="确认方式"
              value="manual"
              onChange={() => {}}
              options={[
                { value: "manual", label: "逐项人工确认" },
                { value: "authorized", label: "按已有授权规则确认" },
              ]}
            />
            <div className="banner banner-info">
              <Icon name="info" />
              <span>
                <b>创建后可以离开页面</b>
                <small>任务完成、需要确认或遇到问题时会通知你。</small>
              </span>
            </div>
          </div>
        )}
        <footer className="wizard-actions">
          <Button disabled={step === 1} onClick={() => setStep(step - 1)}>
            上一步
          </Button>
          <div>
            <Button onClick={() => navigate("/imports")}>取消</Button>
            <Button tone="primary" onClick={next}>
              {step === 4 ? "开始解析" : "下一步"}
            </Button>
          </div>
        </footer>
      </section>
    </div>
  );
}

const reviewRows = [
  {
    id: "r1",
    name: "林昊",
    type: "更新候选人",
    result: "发现工作和项目经历更新",
    duplicate: "与现有候选人高度一致",
    action: "合并更新",
    status: "待确认",
  },
  {
    id: "r2",
    name: "赵星羽",
    type: "新建候选人",
    result: "核心字段完整",
    duplicate: "没有发现重复",
    action: "创建",
    status: "待确认",
  },
  {
    id: "r3",
    name: "陈松",
    type: "更新候选人",
    result: "补充专利和期望地点",
    duplicate: "candidate_id 已确认",
    action: "合并更新",
    status: "待确认",
  },
  {
    id: "r4",
    name: "公司组织花名册.docx",
    type: "不支持的内容",
    result: "内容不是候选人简历",
    duplicate: "不执行身份查重",
    action: "放弃",
    status: "已阻止",
  },
];

export function ImportRunPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState("review");
  const [selected, setSelected] = useState(["r1", "r2", "r3"]);
  const [preview, setPreview] = useState(null);
  const [writing, setWriting] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!writing) return undefined;
    const timer = setInterval(
      () =>
        setProgress((value) => {
          if (value >= 100) {
            clearInterval(timer);
            setWriting(false);
            toast("3 位候选人已写入业务资产");
            return 100;
          }
          return Math.min(100, value + 8);
        }),
      180,
    );
    return () => clearInterval(timer);
  }, [writing, toast]);
  return (
    <div className="page-content">
      <PageHeader
        eyebrow="导入任务 · 等待确认"
        title="5 份候选人简历"
        description="4 份可处理，1 份非简历文件已阻止；正式写入前仍可修改每项选择。"
        back={() => navigate("/imports")}
        actions={
          <>
            <Button icon="download" onClick={() => toast("失败清单已导出")}>
              导出失败清单
            </Button>
            <Button
              tone="primary"
              disabled={writing}
              loading={writing}
              onClick={() => {
                setWriting(true);
                setProgress(4);
              }}
            >
              {writing ? "正在写入" : "确认并写入 3 项"}
            </Button>
          </>
        }
      />
      {writing && (
        <div className="banner banner-info">
          <Icon name="task" />
          <span>
            <b>正在后台写入候选人</b>
            <small>可以离开页面，任务会继续运行；不要重复点击。</small>
          </span>
          <Progress value={progress} />
        </div>
      )}
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "review", label: "等待确认" },
          { value: "failed", label: "已阻止" },
          { value: "written", label: "已写入" },
        ]}
      />
      <section className="page-section">
        <DataTable
          rows={
            tab === "failed"
              ? reviewRows.filter((row) => row.status === "已阻止")
              : tab === "written"
                ? progress === 100
                  ? reviewRows
                      .slice(0, 3)
                      .map((row) => ({ ...row, status: "已写入" }))
                  : []
                : reviewRows.filter((row) => row.status === "待确认")
          }
          selected={selected}
          onSelect={setSelected}
          columns={[
            { key: "name", label: "项目", width: "20%" },
            { key: "type", label: "处理方式", width: "15%" },
            { key: "result", label: "解析结果", width: "25%" },
            { key: "duplicate", label: "身份与重复", width: "22%" },
            { key: "action", label: "写入选择", width: "12%" },
            {
              key: "status",
              label: "状态",
              width: "10%",
              render: (value) => (
                <Status tone={toneForStatus(value)}>{value}</Status>
              ),
            },
          ]}
          onRowClick={setPreview}
          actions={(row) => (
            <IconButton
              icon="chevronRight"
              label="查看和确认"
              onClick={() => setPreview(row)}
            />
          )}
        />
      </section>
      <Drawer
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title={preview?.name || "解析详情"}
      >
        <div className="stack">
          <Status tone={toneForStatus(preview?.status)}>
            {preview?.status}
          </Status>
          <div className="field-diff">
            <article>
              <small>当前系统</small>
              <b>机器人算法负责人 · 远川智能</b>
              <p>团队规模 4 人；最近项目更新于 2025 年。</p>
            </article>
            <article className="is-suggested">
              <small>本次文件建议</small>
              <b>机器人算法负责人 · 远川智能</b>
              <p>团队规模 8 人；补充多模态操作策略项目和薪资意向。</p>
            </article>
          </div>
          <Select
            label="处理方式"
            value={preview?.status === "已阻止" ? "drop" : "merge"}
            onChange={() => {}}
            options={[
              { value: "merge", label: "合并更新现有候选人" },
              { value: "keep", label: "保留为新候选人" },
              { value: "drop", label: "放弃本项" },
            ]}
          />
          <Button
            tone="primary"
            disabled={preview?.status === "已阻止"}
            onClick={() => {
              setPreview(null);
              toast("本项选择已保存");
            }}
          >
            确认本项
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
