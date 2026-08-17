export const workstreamKinds = [
  {
    value: "client",
    label: "客户开发",
    icon: "building",
    description: "发现潜在客户、核验招聘需求、找到负责人并持续跟进。",
    starter: "我想持续跟进一家可能有招聘需求的公司",
  },
  {
    value: "position",
    label: "岗位招聘",
    icon: "briefcase",
    description: "从岗位理解、找人和匹配开始，持续推进候选人到入职。",
    starter: "我有一个岗位，需要持续找到并推进合适候选人",
  },
  {
    value: "mapping",
    label: "人才摸排",
    icon: "users",
    description: "摸清目标领域的公司、组织、方向、关键人物和关系。",
    starter: "我想摸清一个方向的人才池和关键关系",
  },
  {
    value: "career",
    label: "候选人求职",
    icon: "user",
    description: "围绕一位候选人的目标持续找岗位、沟通并推进。",
    starter: "我想持续帮助一位候选人寻找和推进机会",
  },
];

export const creationFlows = {
  client: {
    title: "建立客户开发主线",
    intro:
      "请告诉我目标公司、关注的招聘方向，以及你现在掌握的线索。我会先整理核验范围，不会直接代表你联系对方。",
    examples: [
      "星澜机器人近期融资，帮我确认是否在扩招算法和机器人团队",
      "每周关注具身智能创业公司，发现明确招聘需求后提醒我",
    ],
    followup:
      "我会先核验招聘信号、公司背景和可能的负责人。请确认：只关注星澜机器人，还是同时关注上下游同类公司？",
    config: {
      scope: "星澜机器人及其机器人算法团队",
      trigger: "手动启动；每周一复查公开招聘信号",
      approval: "公司与联系人写入前人工确认",
      contact: "联系内容必须由猎头确认后发送",
      stop: "确认 1 个有效招聘机会，或连续 3 次核验无新增信号",
    },
  },
  position: {
    title: "建立岗位招聘主线",
    intro:
      "请提供岗位、客户公司和招聘目标。岗位资料不完整也可以，我会先梳理岗位理解、找人范围和完成标准。",
    examples: [
      "为星澜机器人招聘具身智能 VLA 算法负责人，两个月内完成 2 人入职",
      "上传客户发来的 JD，并优先从现有人才池开始匹配",
    ],
    followup:
      "我已关联到系统中的“具身智能 VLA 算法负责人”。请补充必须满足的条件、可放宽的条件，以及希望何时看到首批候选人。",
    config: {
      scope: "星澜机器人 · 具身智能 VLA 算法负责人",
      trigger: "手动启动；候选人资料更新后局部重匹配",
      approval: "候选人推荐和联系均需人工确认",
      contact: "允许生成沟通草稿，不自动发送",
      stop: "确认 30 位候选人，或 8 位愿意沟通的候选人",
    },
  },
  mapping: {
    title: "建立人才摸排主线",
    intro:
      "请描述要摸排的行业方向、目标公司范围和希望回答的问题。我会把公司、组织、方向、关键人物和关系纳入同一份成果。",
    examples: [
      "摸排国内具身智能 VLA 方向，覆盖核心公司、团队负责人和关键候选人",
      "从 12 家目标公司开始，优先补齐关键岗位和可联系关系",
    ],
    followup:
      "请确认摸排深度：只建立公司与关键人物清单，还是继续补齐组织层级、人物关系和可利用的联系路径？",
    config: {
      scope: "12 家具身智能公司 · VLA / 灵巧手 / 机器人平台",
      trigger: "手动启动；发现新的目标公司时建议补充",
      approval: "人物与关系写入前人工确认",
      contact: "本主线只建档，不主动联系候选人",
      stop: "关键角色覆盖达到 85%，且两轮补充无重要缺口",
    },
  },
  career: {
    title: "建立候选人求职主线",
    intro:
      "请选择候选人，并告诉我他的求职目标、限制条件和当前沟通状态。我会持续找岗位，并在收到新信息后更新资料和局部重匹配。",
    examples: [
      "帮助林昊寻找上海的机器人平台负责人机会，暂不考虑纯管理岗位",
      "根据候选人最新简历重新找岗位，但推荐前都需要我确认",
    ],
    followup:
      "我已关联候选人林昊。请确认地点、薪酬、职级和不能接受的条件，以及是否允许我在收到新简历后自动更新待审核建议。",
    config: {
      scope: "林昊 · 上海 / 杭州 · 机器人平台与 VLA",
      trigger: "手动启动；候选人回复或资料更新后继续",
      approval: "岗位推荐和资料更新均需人工确认",
      contact: "只生成建议，由猎头决定是否联系",
      stop: "候选人入职，或候选人明确暂停求职",
    },
  },
};

export const creationPlans = {
  client: [
    {
      id: "client-goal",
      title: "明确客户开发目标",
      detail: "确认目标公司、招聘方向和已有招聘信号。",
    },
    {
      id: "client-scope",
      title: "补齐核验范围与完成标准",
      detail: "定义要核验的信号、负责人和有效招聘机会标准。",
    },
    {
      id: "client-policy",
      title: "确认联系授权与停止条件",
      detail: "明确联系前审批、周期复查和停止规则。",
    },
    {
      id: "client-create",
      title: "创建客户开发主线",
      detail: "保存配置并开始核验招聘机会。",
    },
  ],
  position: [
    {
      id: "position-goal",
      title: "明确岗位招聘目标",
      detail: "关联岗位、客户公司、入职人数和时间目标。",
    },
    {
      id: "position-scope",
      title: "补齐找人范围与完成标准",
      detail: "确认硬门槛、可放宽条件和首批交付时间。",
    },
    {
      id: "position-policy",
      title: "确认推荐授权与停止条件",
      detail: "明确候选人审核、联系和停止规则。",
    },
    {
      id: "position-create",
      title: "创建岗位招聘主线",
      detail: "保存配置并开始多渠道找人与匹配。",
    },
  ],
  mapping: [
    {
      id: "mapping-goal",
      title: "明确人才摸排目标",
      detail: "确认行业方向、公司范围和需要回答的问题。",
    },
    {
      id: "mapping-scope",
      title: "补齐摸排深度与完成标准",
      detail: "确认组织、关键人物、关系和联系路径的覆盖要求。",
    },
    {
      id: "mapping-policy",
      title: "确认写入授权与停止条件",
      detail: "明确关系核验、人工确认和覆盖率停止规则。",
    },
    {
      id: "mapping-create",
      title: "创建人才摸排主线",
      detail: "保存配置并开始建立目标人才池。",
    },
  ],
  career: [
    {
      id: "career-goal",
      title: "明确候选人求职目标",
      detail: "关联候选人并确认地点、岗位方向和限制条件。",
    },
    {
      id: "career-scope",
      title: "补齐找岗位范围与完成标准",
      detail: "确认薪酬、职级、岗位偏好和机会筛选标准。",
    },
    {
      id: "career-policy",
      title: "确认资料与推荐规则",
      detail: "明确新资料审核、岗位沟通和停止条件。",
    },
    {
      id: "career-create",
      title: "创建候选人求职主线",
      detail: "保存配置并开始持续找岗位和匹配。",
    },
  ],
};

const commonMeta = {
  client: {
    title: "星澜机器人招聘机会",
    eyebrow: "客户开发主线",
    status: "等待用户",
    tone: "warning",
    description: "确认招聘信号、找到负责人并形成可以推进的招聘机会。",
    goal: "确认星澜机器人的算法与机器人团队是否扩招，并找到有权确认岗位需求的负责人。",
    completion: "形成至少 1 个有效招聘机会，并确认需求负责人和下一步沟通动作。",
    next: "确认是否向 HRD 周雅雯发送联系邮件",
    running: "1 个 Agent 任务",
    wait: "1 项人工确认",
    assets: "1 家公司 · 4 位联系人 · 1 个招聘机会",
  },
  position: {
    title: "具身智能 VLA 算法负责人",
    eyebrow: "岗位招聘主线",
    status: "推进中",
    tone: "info",
    description: "理解岗位、找到候选人、完成匹配并由猎头推进到入职。",
    goal: "为星澜机器人招聘 2 位具身智能 VLA 算法负责人，优先上海，两个月内完成入职。",
    completion: "完成 2 人入职；推荐与联系动作必须由猎头确认。",
    next: "审核首批 18 位候选人并确认联系名单",
    running: "2 个 Agent 任务",
    wait: "18 位候选人待审核",
    assets: "1 个岗位 · 46 位候选人 · 5 人推进中",
  },
  mapping: {
    title: "具身智能核心人才摸排",
    eyebrow: "人才摸排主线",
    status: "维护中",
    tone: "violet",
    description: "摸清目标领域的公司、组织、方向、关键人物和可利用关系。",
    goal: "覆盖国内具身智能核心公司及其 VLA、灵巧手和机器人平台关键团队。",
    completion: "关键角色覆盖达到 85%，重要人物均有证据、归类和联系路径判断。",
    next: "核验 7 条人物关系并补齐 3 个团队负责人",
    running: "1 个摸排任务",
    wait: "7 条关系待核验",
    assets: "12 家公司 · 93 位人物 · 28 条关系",
  },
  career: {
    title: "林昊下一份工作",
    eyebrow: "候选人求职主线",
    status: "等待外部",
    tone: "neutral",
    description: "围绕候选人的意向持续找岗位、补充资料、重匹配并推进。",
    goal: "帮助林昊寻找上海或杭州的机器人平台负责人机会，暂不考虑纯管理岗位。",
    completion: "候选人确认并入职合适岗位，或候选人明确暂停求职。",
    next: "等待候选人确认新简历和地点范围",
    running: "当前无运行任务",
    wait: "等待候选人回复",
    assets: "1 位候选人 · 18 个岗位 · 2 项推进",
  },
};

const phases = {
  client: [
    ["招聘信号核验", "完成", "融资、招聘页面和团队变化已交叉验证"],
    ["公司与负责人调研", "完成", "确认 4 位可能影响招聘决策的联系人"],
    ["联系与需求澄清", "进行中", "联系草稿等待猎头确认"],
    ["招聘机会确认", "未开始", "确认 HC、地点、职级和合作方式"],
  ],
  position: [
    ["岗位理解与找人计划", "完成", "岗位画像和 5 组寻访关键词已确认"],
    ["多渠道找人与匹配", "进行中", "已召回 46 人，首批 18 人待审核"],
    ["候选人沟通", "进行中", "5 人推进中，2 人等待回复"],
    ["推荐、面试与入职", "进行中", "2 人进入面试，尚无 Offer"],
  ],
  mapping: [
    ["范围与摸排计划", "完成", "12 家目标公司和 8 类关键角色已确认"],
    ["组织、方向和人物建档", "进行中", "93 位人物已确认，覆盖度 72%"],
    ["关系和联系路径核验", "进行中", "7 条关系等待人工核验"],
    ["缺口补齐与持续维护", "未开始", "覆盖达到 85% 后转入低频维护"],
  ],
  career: [
    ["候选人目标与资料", "进行中", "新简历和地点范围等待候选人确认"],
    ["找岗位与匹配", "完成", "18 个岗位中筛出 6 个推荐岗位"],
    ["候选人确认与沟通", "等待外部", "等待候选人反馈岗位意向"],
    ["推荐、面试与入职", "进行中", "2 个岗位已进入面试"],
  ],
};

const workstreamPlans = {
  client: [
    {
      id: "verify-signal",
      title: "核验招聘信号",
      detail: "官网 6 个岗位与 B+ 轮融资扩招说明已交叉验证。",
      status: "completed",
    },
    {
      id: "find-contacts",
      title: "补齐公司与负责人",
      detail: "已确认公司资料和 4 位可能影响招聘决策的联系人。",
      status: "completed",
    },
    {
      id: "review-contact",
      title: "确认联系内容并联系 HRD",
      detail: "联系草稿等待猎头审核和一次性发送授权。",
      status: "waiting",
    },
    {
      id: "confirm-opportunity",
      title: "确认正式招聘机会",
      detail: "收到回复后确认 HC、地点、职级和合作方式。",
      status: "pending",
    },
  ],
  position: [
    {
      id: "position-plan",
      title: "确认岗位理解和找人计划",
      detail: "岗位画像、硬门槛和 5 组寻访关键词已确认。",
      status: "completed",
    },
    {
      id: "public-recall",
      title: "完成内部与公开来源召回",
      detail: "内部人才池、论文作者和专利发明人召回已完成。",
      status: "completed",
    },
    {
      id: "platform-recall",
      title: "读取猎聘和脉脉候选人",
      detail: "已扫描 68 张卡片；猎聘读取第 2 页，脉脉等待平台返回。",
      status: "running",
    },
    {
      id: "first-match",
      title: "完成首批 18 位候选人匹配",
      detail: "12 位推荐、4 位有条件匹配、2 位不建议。",
      status: "completed",
    },
    {
      id: "candidate-review",
      title: "审核首批候选人并确认联系名单",
      detail: "18 位候选人等待猎头审核。",
      status: "waiting",
    },
  ],
  mapping: [
    {
      id: "mapping-plan",
      title: "确认 12 家公司和 3 个方向",
      detail: "VLA、灵巧手和机器人平台的摸排范围已确认。",
      status: "completed",
    },
    {
      id: "mapping-org",
      title: "补齐 3 个团队组织结构",
      detail: "新增 18 位确认人物和 6 位待核验人物。",
      status: "completed",
    },
    {
      id: "mapping-relations",
      title: "核验 7 条人物关系",
      detail: "需要结合猎头已有关系判断当前汇报与合作关系。",
      status: "waiting",
    },
    {
      id: "mapping-branch",
      title: "处理云脉芯能支线建议",
      detail: "决定建立客户开发支线，或仅纳入当前摸排。",
      status: "pending",
    },
    {
      id: "mapping-coverage",
      title: "将关键角色覆盖率提升至 85%",
      detail: "补齐剩余组织和关键人物后转入低频维护。",
      status: "pending",
    },
  ],
  career: [
    {
      id: "career-intent",
      title: "确认候选人最新意向",
      detail: "等待林昊确认地点范围和新版简历。",
      status: "waiting",
    },
    {
      id: "career-match",
      title: "完成 18 个岗位匹配",
      detail: "已筛出 6 个建议岗位。",
      status: "completed",
    },
    {
      id: "career-discuss",
      title: "与候选人确认 6 个岗位意向",
      detail: "候选人回复后由猎头决定是否推荐。",
      status: "waiting",
    },
    {
      id: "career-resume",
      title: "审核并更新最新简历",
      detail: "新简历解析后形成字段级更新建议。",
      status: "waiting",
    },
    {
      id: "career-rematch",
      title: "重算受影响的岗位匹配",
      detail: "资料确认后只重算相关岗位。",
      status: "pending",
    },
  ],
};

const events = {
  client: [
    {
      type: "user",
      time: "今天 09:02",
      text: "优先确认星澜机器人融资后是不是在扩招算法和机器人团队；没有明确需求前不要直接联系。",
    },
    {
      type: "agent",
      time: "今天 09:03",
      text: "明白。我会先判断招聘需求是否真实存在，再找能够确认需求的人；没有足够证据前不会联系任何人。",
    },
    {
      type: "plan",
      time: "今天 09:03",
      title: "客户开发计划已更新",
      detail:
        "先核验招聘信号，再补齐负责人和联系路径；形成明确招聘机会后才进入联系阶段。",
      chips: ["招聘信号", "负责人", "联系路径"],
    },
    {
      type: "result",
      time: "今天 09:18",
      title: "招聘信号已完成交叉核验",
      detail:
        "公司官网新增 6 个算法岗位，B+ 轮融资公告提到扩充机器人研发团队，两类证据时间一致。",
      status: "已确认",
      tone: "success",
      action: "查看 5 条证据",
      route: "/signals/signal-funding",
    },
    {
      type: "agent",
      time: "今天 09:19",
      text: "招聘信号已经由官网岗位和融资公告相互印证。下一步需要确认谁负责这批岗位，以及公司是否接受外部猎头合作。",
    },
    {
      type: "object",
      time: "今天 09:24",
      title: "已形成公司与联系人草稿",
      detail:
        "星澜机器人公司资料已补充；识别 4 位联系人，其中 HRD 周雅雯最可能确认招聘需求。",
      status: "待确认",
      tone: "warning",
      action: "查看公司资料",
      route: "/companies/xinglan",
    },
    {
      type: "agent",
      time: "今天 09:27",
      text: "周雅雯最可能直接确认招聘需求。我已经准备好一封只询问 HC 和合作方式的邮件，但发送前需要你的明确授权。",
    },
    {
      type: "permission",
      time: "今天 09:29",
      title: "允许使用你的工作邮箱发送联系邮件？",
      detail:
        "将以你的身份向周雅雯发送当前已审核的邮件草稿。正式外部联系属于高风险动作，本次不提供持续授权。",
      status: "等待授权",
      tone: "warning",
      scope: [
        ["对象", "HRD 周雅雯"],
        ["发送内容", "已审核邮件草稿 1 封"],
        ["使用数据", "你的姓名、公司和工作邮箱"],
        ["执行后", "在本主线等待回复"],
      ],
      options: [
        { value: "deny", label: "拒绝" },
        { value: "once", label: "仅允许本次", tone: "primary" },
      ],
    },
    {
      type: "approval",
      time: "今天 09:31",
      title: "是否联系 HRD 周雅雯？",
      detail: "建议先询问 VLA 团队是否新增负责人岗位。邮件草稿不会自动发送。",
      primary: "审核联系内容",
      secondary: "暂不联系",
    },
    {
      type: "branch",
      time: "今天 09:35",
      title: "发现潜在支线：灵巧手团队也在扩招",
      detail:
        "招聘页面新增结构工程师和运动控制岗位，可建立独立岗位招聘主线；当前主线不会自动创建。",
      primary: "查看支线建议",
      secondary: "忽略",
    },
  ],
  position: [
    {
      type: "user",
      time: "今天 08:16",
      text: "管理经验可以适当放宽，但必须有 VLA 或端到端机器人学习落地经验。今天给我首批候选人。",
    },
    {
      type: "agent",
      time: "今天 08:17",
      text: "我会把 VLA 或端到端机器人学习的真实落地经验作为核心门槛，管理经验只影响排序，不作为直接淘汰条件。先调整找人和匹配计划。",
    },
    {
      type: "plan",
      time: "今天 08:18",
      title: "找人和匹配计划已调整",
      detail:
        "并行使用内部人才池、论文作者、专利发明人、人才平台和人才摸排成果；先做角色适配门禁，再分层展示。",
      chips: ["内部人才池", "学术作者", "猎聘", "脉脉"],
    },
    {
      type: "agent",
      time: "今天 08:19",
      text: "内部人才池和公开学术来源可以直接开始。猎聘和脉脉需要使用你的登录状态，我会先向你确认读取范围。",
    },
    {
      type: "permission",
      time: "今天 08:20",
      title: "允许使用已登录的人才平台查找候选人？",
      detail:
        "Hunter 已获准在当前业务主线中使用猎聘和脉脉执行搜索、翻页和详情读取，不会自动打招呼、申请好友或发送消息。",
      status: "当前业务主线已授权",
      tone: "success",
      scope: [
        ["平台", "猎聘、脉脉"],
        ["操作", "搜索、翻页、读取候选人详情"],
        ["数据范围", "当前岗位关键词和筛选条件"],
        ["预计用量", "最多读取 40 个详情"],
      ],
    },
    {
      type: "task",
      time: "今天 08:24",
      title: "2 个人才平台任务正在运行",
      detail:
        "内部人才池和论文作者召回已完成；猎聘正在读取第 2 页；脉脉等待平台回复。",
      status: "运行中",
      tone: "info",
      action: "查看任务运行",
      route: "/tasks/task-sourcing",
    },
    {
      type: "agent",
      time: "今天 08:25",
      text: "找人工作已经开始。普通执行过程会留在这条业务主线中；你只需要在异常或需要补充信息时进入任务详情。",
    },
    {
      type: "result",
      time: "今天 09:06",
      title: "首批候选人已完成匹配",
      detail:
        "46 位唯一候选人进入候选池；首批 18 位已完成匹配，其中 12 位推荐、4 位有条件匹配、2 位不建议；其余 28 位等待后续评估。",
      status: "待审核",
      tone: "warning",
      action: "审核 18 位候选人",
      route: "/candidates",
    },
    {
      type: "agent",
      time: "今天 09:07",
      text: "首批结果已经准备好。建议先审核 12 位推荐候选人，再决定是否扩大来源；有条件匹配的人选都保留了减分原因。",
    },
    {
      type: "object",
      time: "今天 09:08",
      title: "候选人赵星羽已加入结果",
      detail: "匹配 86 分。端到端与多模态经验符合；管理规模需要沟通确认。",
      status: "推荐",
      tone: "success",
      action: "打开候选人",
      route: "/candidates/zhao-xingyu",
    },
    {
      type: "impact",
      time: "今天 09:14",
      title: "新信息只影响 6 位候选人",
      detail:
        "岗位地点从上海扩展到杭州。无需重跑全部召回，只需重算 6 位因地点受限的候选人。",
      primary: "确认局部重匹配",
      secondary: "保留原条件",
      planUpdate: {
        summary: "新增地点适配的局部重匹配步骤",
        before: "candidate-review",
        item: {
          id: "location-rematch",
          title: "重算 6 位候选人的地点适配",
          detail: "岗位地点扩展到杭州，只重算因地点受限的候选人。",
          status: "running",
        },
      },
    },
  ],
  mapping: [
    {
      type: "user",
      time: "今天 08:42",
      text: "除公司和关键人外，继续补齐组织层级、研究方向、人物关系和可以利用的联系路径。",
    },
    {
      type: "agent",
      time: "今天 08:43",
      text: "我会把组织、方向、关键人物和关系放在同一份摸排成果中，并区分已确认关系和仍需核验的推断。",
    },
    {
      type: "plan",
      time: "今天 08:44",
      title: "摸排范围已扩展",
      detail:
        "12 家公司按 VLA、灵巧手、机器人平台拆分；每个方向补齐负责人、关键成员、关系和证据。",
      chips: ["组织架构", "关键角色", "人物关系", "联系路径"],
    },
    {
      type: "permission",
      time: "今天 08:48",
      title: "允许读取平台中的一度关系用于核验联系路径？",
      detail:
        "只读取与你已有关系的姓名和公开职业信息，用于判断联系路径；不会自动申请好友或发送消息。",
      status: "等待授权",
      tone: "warning",
      scope: [
        ["用途", "人物关系与联系路径核验"],
        ["数据范围", "当前摸排涉及的 93 位人物"],
        ["写入", "关系建议需人工确认"],
        ["有效范围", "仅当前人才摸排主线"],
      ],
      options: [
        { value: "deny", label: "拒绝" },
        { value: "once", label: "仅允许本次" },
        { value: "mainline", label: "当前业务主线持续允许", tone: "primary" },
      ],
    },
    {
      type: "result",
      time: "今天 09:11",
      title: "3 个团队组织结构已补齐",
      detail:
        "新增 18 位确认人物和 6 位待核验人物；所有关系均保留来源与置信度。",
      status: "已确认",
      tone: "success",
      action: "打开人才摸排",
      route: "/mappings/embodied",
    },
    {
      type: "agent",
      time: "今天 09:13",
      text: "三个核心团队已经可以查看。当前最大缺口不是人物数量，而是 7 条关系无法确认是否仍然有效，需要你结合已有关系人工判断。",
    },
    {
      type: "approval",
      time: "今天 09:20",
      title: "7 条人物关系需要人工核验",
      detail:
        "公开论文与履历显示有合作关系，但无法确认当前汇报线，不会自动写入正式关系。",
      primary: "开始核验",
      secondary: "稍后处理",
    },
    {
      type: "branch",
      time: "今天 09:28",
      title: "发现潜在支线：云脉芯能成立机器人芯片团队",
      detail: "可建立客户开发主线核验招聘需求，也可先纳入当前摸排的目标公司。",
      primary: "查看两种处理方式",
      secondary: "仅加入摸排",
    },
  ],
  career: [
    {
      type: "user",
      time: "昨天 16:18",
      text: "林昊只考虑上海或杭州，不接受纯管理岗位。拿到新简历后先更新资料，再重新匹配。",
    },
    {
      type: "agent",
      time: "昨天 16:19",
      text: "我会先按地点和岗位性质筛选，资料发生变化时只重算受影响岗位。正式推荐仍由你和候选人确认。",
    },
    {
      type: "result",
      time: "昨天 16:36",
      title: "已筛出 6 个建议岗位",
      detail:
        "从 18 个岗位中筛出 6 个；其中星澜机器人 VLA 负责人匹配度最高，地点和技术方向符合。",
      status: "已确认",
      tone: "success",
      action: "查看岗位列表",
      route: "/positions",
    },
    {
      type: "agent",
      time: "昨天 16:38",
      text: "目前有 6 个岗位值得和林昊讨论，其中星澜机器人的方向最接近。候选人还没有确认新版简历，因此先不发起正式推荐。",
    },
    {
      type: "wait",
      time: "昨天 17:42",
      title: "等待候选人确认新简历",
      detail:
        "候选人已回复“晚上发最新版”。等待不会持续消耗 Agent 用量，收到附件后可继续。",
      status: "等待外部",
      tone: "neutral",
      action: "查看沟通记录",
      route: "/communications/comm-linhao",
    },
    {
      type: "object",
      time: "今天 09:02",
      title: "收到新简历，已生成资料更新建议",
      detail: "新增 1 段项目经历和 3 项技能；原字段不直接覆盖，等待猎头确认。",
      status: "待确认",
      tone: "warning",
      action: "审核资料更新",
      route: "/candidates/lin-hao",
    },
    {
      type: "agent",
      time: "今天 09:02",
      text: "新简历已收到。解析前需要你允许读取附件；解析结果只形成字段级建议，不会直接覆盖候选人资料。",
    },
    {
      type: "permission",
      time: "今天 09:03",
      title: "允许解析候选人刚发送的新简历？",
      detail:
        "解析结果只生成字段级更新建议，不直接覆盖候选人的现有资料。原始文件仅用于当前候选人和本主线。",
      status: "等待授权",
      tone: "warning",
      scope: [
        ["文件", "林昊_2026最新简历.pdf"],
        ["操作", "文件解析、查重、影响分析"],
        ["写入", "确认后才更新候选人"],
        ["预计用量", "约 1 次视觉解析"],
      ],
      options: [
        { value: "deny", label: "拒绝" },
        { value: "once", label: "仅允许本次", tone: "primary" },
      ],
    },
    {
      type: "impact",
      time: "今天 09:04",
      title: "资料更新会影响 6 个岗位匹配",
      detail: "确认更新后只重新计算相关岗位，不重新搜索已经完成的来源。",
      primary: "确认更新并重匹配",
      secondary: "仅保存资料",
      planUpdate: {
        summary: "开始处理新简历并局部重匹配",
        before: "career-rematch",
        item: {
          id: "career-resume",
          title: "审核并更新最新简历",
          detail: "读取附件、查重并生成字段级更新建议。",
          status: "running",
        },
      },
    },
  ],
};

export const workstreamDetails = Object.fromEntries(
  Object.entries(commonMeta).map(([kind, meta]) => [
    kind,
    {
      ...meta,
      phases: phases[kind],
      plan: workstreamPlans[kind],
      planVersion: kind === "position" ? 4 : 3,
      planUpdatedAt: kind === "career" ? "今天 09:04" : "今天 09:28",
      events: events[kind],
    },
  ]),
);
