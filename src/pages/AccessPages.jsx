import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  MultiSelect,
  Radio,
  Switch,
  Textarea,
  useToast,
} from "../components/ui";
import { Icon } from "../components/Icon";

function AuthContext({ title, description }) {
  return (
    <aside className="auth-context">
      <div className="brand">
        <span className="brand-mark">
          <Icon name="signal" />
        </span>
        <span>
          <b>Hunter</b>
          <small>智能猎头工作空间</small>
        </span>
      </div>
      <section>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="auth-points">
          <div>
            <i>
              <Icon name="route" />
            </i>
            <span>
              <b>围绕业务主线持续推进</b>
              <small>任务、数据、外部等待和人工决策保留在同一上下文。</small>
            </span>
          </div>
          <div>
            <i>
              <Icon name="task" />
            </i>
            <span>
              <b>Agent 过程可见且可恢复</b>
              <small>离开页面后继续运行，遇到问题时保留现场和恢复入口。</small>
            </span>
          </div>
          <div>
            <i>
              <Icon name="database" />
            </i>
            <span>
              <b>结果经过门禁进入业务资产</b>
              <small>默认人工确认，也可在明确授权范围内自动确认。</small>
            </span>
          </div>
        </div>
      </section>
      <small>数据默认只对当前工作空间可见</small>
    </aside>
  );
}

export function LoginPage({ ops = false }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [mode, setMode] = useState("password");
  const [phone, setPhone] = useState(ops ? "ops@hunter.cn" : "138 1024 6688");
  const [password, setPassword] = useState(
    ops ? "operations-demo" : "hunter-demo",
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    if (!phone.trim() || !password.trim()) {
      setError("请填写账号和登录凭据");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toast("登录成功");
      navigate(ops ? "/ops" : "/home");
    }, 650);
  };
  return (
    <main className="auth-page" data-theme="light">
      <AuthContext
        title={ops ? "Hunter 运营支持" : "把猎头工作变成可持续推进的业务进程"}
        description={
          ops
            ? "运营端仅处理账号、权益、任务健康和脱敏诊断，不查看用户业务内容。"
            : "从机会发现、人才摸排和岗位找人，到沟通、推荐与入职，Hunter 在同一工作空间中连接人工判断与 Agent 执行。"
        }
      />
      <section className="auth-form-wrap">
        <div className="auth-form">
          <header>
            <h2>{ops ? "登录运营端" : "登录 Hunter"}</h2>
            <p>{ops ? "仅限已授权运营人员" : "进入沈岚的个人工作空间"}</p>
          </header>
          <div className="segmented">
            <button
              className={mode === "password" ? "is-active" : ""}
              onClick={() => setMode("password")}
            >
              密码登录
            </button>
            <button
              className={mode === "code" ? "is-active" : ""}
              onClick={() => setMode("code")}
            >
              验证码登录
            </button>
          </div>
          <form onSubmit={submit}>
            <Input
              label={ops ? "运营账号" : "手机号或邮箱"}
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setError("");
              }}
              error={error && !phone.trim() ? error : ""}
            />
            <Input
              label={mode === "password" ? "密码" : "验证码"}
              type={mode === "password" ? "password" : "text"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              error={error && !password.trim() ? error : ""}
            />
            {error && phone.trim() && password.trim() && (
              <div className="banner banner-danger">
                <Icon name="warning" />
                <span>
                  <b>登录失败</b>
                  <small>{error}</small>
                </span>
              </div>
            )}
            <Button tone="primary" size="lg" loading={loading} type="submit">
              {loading ? "正在验证" : "登录"}
            </Button>
          </form>
          <div className="form-foot">
            <button className="link" onClick={() => setForgot(true)}>
              忘记密码
            </button>
            {!ops && (
              <button className="link" onClick={() => navigate("/apply")}>
                申请试用
              </button>
            )}
          </div>
        </div>
      </section>
      <Modal
        open={forgot}
        onClose={() => setForgot(false)}
        title="找回登录方式"
        description="验证完成后会向账号绑定的联系方式发送重置入口"
        footer={
          <>
            <Button onClick={() => setForgot(false)}>取消</Button>
            <Button
              tone="primary"
              onClick={() => {
                setForgot(false);
                toast("重置入口已发送", "info");
              }}
            >
              发送重置入口
            </Button>
          </>
        }
      >
        <Input label="手机号或邮箱" placeholder="输入注册时使用的联系方式" />
      </Modal>
    </main>
  );
}

export function ApplyPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState(["embodied"]);
  const [role, setRole] = useState("independent");
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!event.currentTarget.elements.name.value.trim())
      next.name = "请填写姓名";
    if (!event.currentTarget.elements.contact.value.trim())
      next.contact = "请填写可联系的手机号或邮箱";
    if (!accepted) next.accepted = "请先阅读并同意数据与隐私说明";
    setErrors(next);
    if (!Object.keys(next).length) setSubmitted(true);
  };
  return (
    <main className="auth-page" data-theme="light">
      <AuthContext
        title="申请 Hunter 阶段一邀测"
        description="我们会根据业务方向、当前工作方式和真实使用目标审核申请，并控制每批邀测人数。"
      />
      <section className="auth-form-wrap">
        <div className="auth-form apply-form">
          <header>
            <h2>{submitted ? "申请已提交" : "申请试用"}</h2>
            <p>
              {submitted
                ? "申请编号 AP-260817-028，审核结果会发送到你填写的联系方式。"
                : "填写真实信息有助于我们判断当前版本是否适合你的工作方式。"}
            </p>
          </header>
          {submitted ? (
            <div className="submission-result">
              <i>
                <Icon name="check" />
              </i>
              <h3>等待审核</h3>
              <p>
                预计在 2
                个工作日内完成。重复提交会显示本次申请状态，不会创建新的申请。
              </p>
              <Button tone="primary" onClick={() => navigate("/login")}>
                返回登录
              </Button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="form-grid">
                <Input
                  name="name"
                  label="姓名"
                  placeholder="例如：沈岚"
                  error={errors.name}
                />
                <Input
                  name="contact"
                  label="手机号或邮箱"
                  placeholder="用于接收审核结果"
                  error={errors.contact}
                />
                <div className="field span-2">
                  <span className="field-label">当前身份</span>
                  <div className="inline">
                    <Radio
                      checked={role === "independent"}
                      onChange={() => setRole("independent")}
                    >
                      独立猎头
                    </Radio>
                    <Radio
                      checked={role === "agency"}
                      onChange={() => setRole("agency")}
                    >
                      猎头机构顾问
                    </Radio>
                    <Radio
                      checked={role === "enterprise"}
                      onChange={() => setRole("enterprise")}
                    >
                      企业招聘顾问
                    </Radio>
                  </div>
                </div>
                <MultiSelect
                  label="主要业务方向"
                  values={direction}
                  onChange={setDirection}
                  options={[
                    { value: "embodied", label: "具身智能" },
                    { value: "robotics", label: "机器人" },
                    { value: "autonomous", label: "自动驾驶" },
                    { value: "semiconductor", label: "半导体" },
                  ]}
                />
                <Input label="每月处理岗位数量" placeholder="例如：8-12 个" />
                <Textarea
                  className="span-2"
                  label="希望 Hunter 帮你完成什么"
                  placeholder="描述一个真实、重复发生且目前耗时较多的工作场景"
                />
                <div className="span-2">
                  <Checkbox
                    checked={accepted}
                    onChange={(value) => {
                      setAccepted(value);
                      setErrors((current) => ({ ...current, accepted: "" }));
                    }}
                  >
                    我已阅读并同意邀测数据与隐私说明
                  </Checkbox>
                  {errors.accepted && (
                    <span className="field-message">
                      <Icon name="warning" />
                      {errors.accepted}
                    </span>
                  )}
                </div>
              </div>
              <Button tone="primary" size="lg" type="submit">
                提交申请
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState("manual");
  const [notify, setNotify] = useState(true);
  const [workspace, setWorkspace] = useState("沈岚的猎头工作空间");
  const next = () => {
    if (step < 4) setStep(step + 1);
    else {
      toast("首次设置已完成");
      navigate("/home");
    }
  };
  return (
    <main className="onboarding-page" data-theme="light">
      <header>
        <div className="brand">
          <span className="brand-mark">
            <Icon name="signal" />
          </span>
          <span>
            <b>Hunter</b>
            <small>首次开通</small>
          </span>
        </div>
        <button className="link" onClick={() => toast("草稿已保存")}>
          保存并稍后继续
        </button>
      </header>
      <section className="onboarding-card">
        <div className="stepper">
          {["工作空间", "确认方式", "通知", "开始使用"].map((label, index) => (
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
          ))}
        </div>
        {step === 1 && (
          <div className="onboarding-content">
            <span className="eyebrow">步骤 1 / 4</span>
            <h1>设置个人工作空间</h1>
            <p>业务数据归属于该工作空间。阶段一不提供团队成员协作。</p>
            <Input
              label="工作空间名称"
              value={workspace}
              onChange={(event) => setWorkspace(event.target.value)}
              help="后续可在账户设置中修改"
            />
            <div className="privacy-note">
              <Icon name="info" />
              <span>
                运营人员不能查看你的候选人、岗位、公司、消息、附件和 Agent
                输出正文。
              </span>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="onboarding-content">
            <span className="eyebrow">步骤 2 / 4</span>
            <h1>选择默认确认方式</h1>
            <p>无论选择哪一种方式，Hunter 的安全与质量门禁始终生效。</p>
            <div className="choice-grid">
              <button
                className={`choice-card ${mode === "manual" ? "is-selected" : ""}`}
                onClick={() => setMode("manual")}
              >
                <i>
                  <Icon name="user" />
                </i>
                <span>
                  <b>默认人工确认</b>
                  <small>
                    Agent
                    产出先进入待办，由你决定是否写入业务资产。推荐用于首次使用。
                  </small>
                </span>
              </button>
              <button
                className={`choice-card ${mode === "scoped" ? "is-selected" : ""}`}
                onClick={() => setMode("scoped")}
              >
                <i>
                  <Icon name="task" />
                </i>
                <span>
                  <b>按规则自动确认</b>
                  <small>
                    仅在后续明确设置的对象、范围、预算和停止条件内生效。
                  </small>
                </span>
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="onboarding-content">
            <span className="eyebrow">步骤 3 / 4</span>
            <h1>设置通知方式</h1>
            <p>外部回复、待确认事项、任务异常和额度预警会优先通知。</p>
            <div className="settings-list">
              <Switch
                checked={notify}
                onChange={setNotify}
                label="站内通知"
                description="在 Hunter 中接收全部业务通知"
              />
              <Switch
                checked={true}
                onChange={() => toast("邮件通知已开启")}
                label="邮件摘要"
                description="每天 18:00 汇总未处理事项"
              />
              <Switch
                checked={false}
                onChange={() => toast("请先验证手机号", "info")}
                label="短信提醒"
                description="仅用于平台登录失效和高优先级异常"
              />
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="onboarding-content">
            <span className="eyebrow">步骤 4 / 4</span>
            <h1>从第一项工作开始</h1>
            <p>可以先导入已有数据，也可以直接创建一条持续推进的业务主线。</p>
            <div className="choice-grid">
              <button
                className="choice-card"
                onClick={() => navigate("/imports")}
              >
                <i>
                  <Icon name="upload" />
                </i>
                <span>
                  <b>导入已有数据</b>
                  <small>导入简历、公司、岗位、论文、专利或人才摸排。</small>
                </span>
              </button>
              <button
                className="choice-card is-selected"
                onClick={() => navigate("/workstreams/new")}
              >
                <i>
                  <Icon name="route" />
                </i>
                <span>
                  <b>创建业务主线</b>
                  <small>
                    从客户开发、岗位招聘、人才摸排或候选人求职开始。
                  </small>
                </span>
              </button>
            </div>
          </div>
        )}
        <footer>
          <Button disabled={step === 1} onClick={() => setStep(step - 1)}>
            上一步
          </Button>
          <Button tone="primary" onClick={next}>
            {step === 4 ? "进入工作台" : "下一步"}
          </Button>
        </footer>
      </section>
    </main>
  );
}
