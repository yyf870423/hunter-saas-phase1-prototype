import { Input, Select, Textarea } from "./ui";

const educationOptions = [
  { value: "", label: "不限" },
  { value: "大专", label: "大专" },
  { value: "本科", label: "本科" },
  { value: "硕士", label: "硕士" },
  { value: "博士", label: "博士" },
];

const genderOptions = [
  { value: "", label: "未填写" },
  { value: "男", label: "男" },
  { value: "女", label: "女" },
];

const degreePolicyOptions = [
  { value: "必须满足", label: "必须满足" },
  { value: "可酌情降低", label: "可酌情降低" },
];

const patentStatusOptions = [
  { value: "申请中", label: "申请中" },
  { value: "已授权", label: "已授权" },
  { value: "已失效", label: "已失效" },
];

const valueOf = (record, keys, fallback = "") => {
  for (const key of keys) {
    if (record?.[key] !== undefined && record?.[key] !== null) {
      return Array.isArray(record[key]) ? record[key].join("，") : record[key];
    }
  }
  return fallback;
};

export function buildAssetFormValue(kind, record = {}) {
  const common = { id: record.id };
  if (kind === "companies" || kind === "company") {
    return {
      ...common,
      name: valueOf(record, ["name"]),
      matchTerms: valueOf(record, ["matchTerms"]),
      industries: valueOf(record, ["industries"]),
      intro: valueOf(record, ["intro"]),
      funding: valueOf(record, ["funding", "financing"]),
      locations: valueOf(record, ["locations", "baseLocations"]),
      talentAttraction: valueOf(record, ["talentAttraction"]),
      compensation: valueOf(record, ["compensation", "compensationBenefits"]),
      interview: valueOf(record, ["interview", "interviewProcess"]),
      requirements: valueOf(record, ["requirements", "recruitmentNotes"]),
      remarks: valueOf(record, ["remarks", "note"]),
    };
  }
  if (kind === "candidates" || kind === "candidate") {
    return {
      ...common,
      name: valueOf(record, ["name"]),
      nameEn: valueOf(record, ["nameEn"]),
      phone: valueOf(record, ["phone"]),
      email: valueOf(record, ["email"]),
      gender: valueOf(record, ["gender"]),
      location: valueOf(record, ["location"]),
      company: valueOf(record, ["company"]),
      title: valueOf(record, ["title"]),
      level: valueOf(record, ["level"]),
      years: valueOf(record, ["years"]),
      expectedSalary: valueOf(record, ["expectedSalary"]),
      skills: valueOf(record, ["skills"]),
      industries: valueOf(record, ["industries"]),
      educationHistory: valueOf(
        record,
        ["educationText"],
        record.educationHistory
          ?.map(
            (item) =>
              `${item.school}｜${item.degree}｜${item.major}｜${item.period}`,
          )
          .join("\n") || "",
      ),
      workHistory: valueOf(
        record,
        ["workText"],
        record.workHistory
          ?.map(
            (item) =>
              `${item.company}｜${item.title}｜${item.period}\n${item.description || ""}`,
          )
          .join("\n\n") || "",
      ),
      projects: valueOf(
        record,
        ["projectText"],
        record.projects
          ?.map(
            (item) =>
              `${item.name}｜${item.role}｜${item.period}\n${item.description || ""}`,
          )
          .join("\n\n") || "",
      ),
      summary: valueOf(record, ["summary"]),
    };
  }
  if (kind === "positions" || kind === "position") {
    return {
      ...common,
      title: valueOf(record, ["title"]),
      company: valueOf(record, ["company"]),
      location: valueOf(record, ["location"]),
      salary: valueOf(record, ["salary"]),
      headcount: valueOf(record, ["headcount"], "1"),
      minYears: valueOf(record, ["minYears"]),
      education: valueOf(record, ["education"]),
      degreePolicy: valueOf(record, ["degreePolicy"], "必须满足"),
      skills: valueOf(record, ["skills"]),
      jd: valueOf(record, ["jd", "description"]),
      keywords: valueOf(
        record,
        ["keywords"],
        record.analysis?.keywords?.join("\n") || "",
      ),
    };
  }
  if (kind === "contacts" || kind === "contact") {
    return {
      ...common,
      name: valueOf(record, ["name"]),
      role: valueOf(record, ["role", "title"]),
      phone: valueOf(record, ["phone"]),
      email: valueOf(record, ["email"]),
      note: valueOf(record, ["note"]),
    };
  }
  if (kind === "papers" || kind === "paper") {
    return {
      ...common,
      title: valueOf(record, ["title"]),
      titleZh: valueOf(record, ["titleZh"]),
      authors: valueOf(record, ["authors"]),
      institutions: valueOf(record, ["institutions"]),
      venue: valueOf(record, ["venue"]),
      year: valueOf(record, ["year"]),
      doi: valueOf(record, ["doi"]),
      sources: valueOf(record, ["sources"]),
      tags: valueOf(record, ["tags"]),
      abstractZh: valueOf(record, ["abstractZh"]),
      abstract: valueOf(record, ["abstract"]),
    };
  }
  return {
    ...common,
    title: valueOf(record, ["title"]),
    publicationNo: valueOf(record, ["publicationNo"]),
    inventors: valueOf(record, ["inventors"]),
    assignee: valueOf(record, ["assignee"]),
    filingDate: valueOf(record, ["filingDate"]),
    grantDate: valueOf(record, ["grantDate"]),
    patentType: valueOf(record, ["patentType"]),
    status: valueOf(record, ["status"], "申请中"),
    tags: valueOf(record, ["tags"]),
    abstract: valueOf(record, ["abstract"]),
  };
}

function FormSection({ title, description, action, children }) {
  return (
    <section className="asset-form-section">
      <header>
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        {action}
      </header>
      <div className="form-grid">{children}</div>
    </section>
  );
}

export function AssetForm({ kind, value, onChange, errors = {} }) {
  const update = (key, next) => onChange?.({ ...value, [key]: next });
  const input = (key) => ({
    value: value?.[key] ?? "",
    onChange: (event) => update(key, event.target.value),
    error: errors[key],
  });

  if (kind === "companies" || kind === "company") {
    return (
      <div className="asset-form">
        <FormSection
          title="基本资料"
          description="公司名称用于岗位和候选人的关联判断。"
        >
          <Input
            label="公司名称 *"
            placeholder="如：上海人工智能实验室"
            {...input("name")}
          />
          <Input
            label="包含匹配词"
            placeholder="多个词用中文或英文逗号分隔"
            help="公司名仍按完全匹配；候选人或岗位公司字段包含任一匹配词时也会关联。"
            {...input("matchTerms")}
          />
          <Input
            className="span-2"
            label="行业标签"
            placeholder="最多 5 个，用中文或英文逗号分隔"
            {...input("industries")}
          />
          <Textarea
            className="span-2"
            rows={4}
            label="公司简介"
            placeholder="公司业务、核心产品、发展阶段和行业定位"
            {...input("intro")}
          />
        </FormSection>
        <FormSection title="经营与人才信息">
          <Textarea
            rows={4}
            label="融资情况"
            placeholder="融资轮次、上市状态、市值等公开信息"
            {...input("funding")}
          />
          <Textarea
            rows={4}
            label="Base 地点"
            placeholder="城市与对应业务"
            {...input("locations")}
          />
          <Textarea
            className="span-2"
            rows={4}
            label="公司优势和亮点"
            placeholder="对候选人的吸引点、优势岗位和原因"
            {...input("talentAttraction")}
          />
          <Textarea
            rows={4}
            label="薪资结构和福利"
            placeholder="薪资、奖金、期权、福利和工作节奏"
            {...input("compensation")}
          />
          <Textarea
            rows={4}
            label="一般面试流程"
            placeholder="典型轮次、考察重点和周期"
            {...input("interview")}
          />
          <Textarea
            rows={3}
            label="其他要求"
            placeholder="年龄偏好、目标背景、禁挖公司或特殊流程"
            {...input("requirements")}
          />
          <Textarea
            rows={3}
            label="备注"
            placeholder="猎头自行记录的补充信息"
            {...input("remarks")}
          />
        </FormSection>
      </div>
    );
  }

  if (kind === "candidates" || kind === "candidate") {
    return (
      <div className="asset-form">
        <FormSection title="基本信息">
          <Input label="姓名 *" {...input("name")} />
          <Input
            label="英文名"
            placeholder="English name"
            {...input("nameEn")}
          />
          <Input label="电话" type="tel" {...input("phone")} />
          <Input label="邮箱" type="email" {...input("email")} />
          <Select
            label="性别"
            value={value.gender || ""}
            onChange={(next) => update("gender", next)}
            options={genderOptions}
          />
          <Input label="所在地" placeholder="城市" {...input("location")} />
          <Input label="当前公司" {...input("company")} />
          <Input label="当前职位" {...input("title")} />
          <Input
            label="职级"
            placeholder="如：总监 / P7 / MD"
            {...input("level")}
          />
          <Input
            label="工作年限"
            type="number"
            min="0"
            step="0.5"
            {...input("years")}
          />
          <Input
            className="span-2"
            label="期望薪资"
            placeholder="如：80-120 万"
            {...input("expectedSalary")}
          />
        </FormSection>
        <FormSection title="技能与履历">
          <Input
            label="技能标签"
            placeholder="多个标签用逗号分隔"
            {...input("skills")}
          />
          <Input
            label="行业标签"
            placeholder="多个标签用逗号分隔"
            {...input("industries")}
          />
          <Textarea
            className="span-2"
            rows={4}
            label="教育经历"
            placeholder="每行一段：学校｜学历｜专业｜时间"
            {...input("educationHistory")}
          />
          <Textarea
            className="span-2"
            rows={5}
            label="工作经历"
            placeholder="填写公司、职位、时间和主要工作内容"
            {...input("workHistory")}
          />
          <Textarea
            className="span-2"
            rows={5}
            label="项目经历"
            placeholder="填写项目、角色、时间、职责和成果"
            {...input("projects")}
          />
          <Textarea
            className="span-2"
            rows={4}
            label="候选人摘要"
            {...input("summary")}
          />
        </FormSection>
      </div>
    );
  }

  if (kind === "positions" || kind === "position") {
    return (
      <div className="asset-form">
        <FormSection title="岗位信息">
          <Input
            label="职位名称 *"
            placeholder="如：具身智能算法负责人"
            {...input("title")}
          />
          <Input label="公司" {...input("company")} />
          <Input label="工作地点" {...input("location")} />
          <Input
            label="薪资范围"
            placeholder="如：80-120 万"
            {...input("salary")}
          />
          <Input
            label="招聘人数"
            type="number"
            min="1"
            {...input("headcount")}
          />
          <Input
            label="最低年限"
            type="number"
            min="0"
            {...input("minYears")}
          />
          <Select
            label="学历要求"
            value={value.education || ""}
            onChange={(next) => update("education", next)}
            options={educationOptions}
          />
          <Select
            label="学历要求程度"
            value={value.degreePolicy || "必须满足"}
            onChange={(next) => update("degreePolicy", next)}
            options={degreePolicyOptions}
          />
          <Input
            className="span-2"
            label="关键技能"
            placeholder="多个技能用中文或英文逗号分隔"
            {...input("skills")}
          />
          <Textarea
            className="span-2"
            rows={8}
            label="岗位描述（JD）"
            placeholder="粘贴完整岗位描述"
            {...input("jd")}
          />
          <Textarea
            className="span-2"
            rows={4}
            label="自动寻访关键词"
            placeholder="每行一组关键词，最多 5 组"
            {...input("keywords")}
          />
        </FormSection>
      </div>
    );
  }

  if (kind === "contacts" || kind === "contact") {
    return (
      <div className="asset-form">
        <FormSection
          title="联系人资料"
          description="联系人由猎头自行沟通，Hunter 只记录资料和沟通历史。"
        >
          <Input label="姓名 *" {...input("name")} />
          <Input
            label="角色"
            placeholder="如：研发招聘负责人"
            {...input("role")}
          />
          <Input label="电话" type="tel" {...input("phone")} />
          <Input label="邮箱" type="email" {...input("email")} />
          <Textarea
            className="span-2"
            rows={4}
            label="备注"
            {...input("note")}
          />
        </FormSection>
      </div>
    );
  }

  if (kind === "papers" || kind === "paper") {
    return (
      <div className="asset-form">
        <FormSection title="论文信息">
          <Input className="span-2" label="英文标题 *" {...input("title")} />
          <Input className="span-2" label="中文标题" {...input("titleZh")} />
          <Input
            label="作者"
            placeholder="多位作者用逗号分隔"
            {...input("authors")}
          />
          <Input
            label="作者机构"
            placeholder="多个机构用逗号分隔"
            {...input("institutions")}
          />
          <Input label="刊物 / 会议" {...input("venue")} />
          <Input label="年份" type="number" {...input("year")} />
          <Input label="DOI" {...input("doi")} />
          <Input
            label="数据来源"
            placeholder="OpenAlex、Crossref 等"
            {...input("sources")}
          />
          <Input
            className="span-2"
            label="标签"
            placeholder="多个标签用逗号分隔"
            {...input("tags")}
          />
          <Textarea
            className="span-2"
            rows={5}
            label="中文摘要"
            {...input("abstractZh")}
          />
          <Textarea
            className="span-2"
            rows={5}
            label="英文摘要"
            {...input("abstract")}
          />
        </FormSection>
      </div>
    );
  }

  return (
    <div className="asset-form">
      <FormSection title="专利信息">
        <Input className="span-2" label="专利名称 *" {...input("title")} />
        <Input label="公开号" {...input("publicationNo")} />
        <Input label="权利人" {...input("assignee")} />
        <Input
          className="span-2"
          label="发明人"
          placeholder="多位发明人用逗号分隔"
          {...input("inventors")}
        />
        <Input
          label="申请日"
          placeholder="YYYY-MM-DD"
          {...input("filingDate")}
        />
        <Input
          label="授权日"
          placeholder="YYYY-MM-DD"
          {...input("grantDate")}
        />
        <Input label="专利类型" {...input("patentType")} />
        <Select
          label="状态"
          value={value.status || "申请中"}
          onChange={(next) => update("status", next)}
          options={patentStatusOptions}
        />
        <Input
          className="span-2"
          label="标签"
          placeholder="多个标签用逗号分隔"
          {...input("tags")}
        />
        <Textarea
          className="span-2"
          rows={6}
          label="专利摘要"
          {...input("abstract")}
        />
      </FormSection>
    </div>
  );
}
