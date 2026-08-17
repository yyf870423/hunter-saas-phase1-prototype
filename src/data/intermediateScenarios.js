const eventSceneByTitle = {
  客户开发计划已更新: "target-plan",
  招聘信号已完成交叉核验: "source-evidence",
  已形成公司与联系人草稿: "company-contact-draft",
  "是否联系 HRD 周雅雯？": "message-draft",
  "允许使用你的工作邮箱发送联系邮件？": "outbound-permission",
  等待客户联系人回复: "external-wait",
  "客户回复确认 2 个在招岗位": "recruitment-opportunity",
  "发现潜在支线：灵巧手团队也在扩招": "branch-suggestion",
  找人和匹配计划已调整: "target-plan",
  "允许使用已登录的人才平台查找候选人？": "platform-permission",
  首批候选人已完成匹配: "candidate-pool",
  "允许联系已进入联系名单的候选人？": "contact-permission",
  等待候选人异步回复: "external-wait",
  "地点变化需要重新评估 6 位候选人": "impact-analysis",
  摸排范围已扩展: "target-plan",
  "允许读取平台中的一度关系用于核验联系路径？": "relation-permission",
  "3 个团队组织结构已补齐": "organization-draft",
  "7 条人物关系需要人工核验": "relation-review",
  "发现潜在支线：云脉芯能成立机器人芯片团队": "branch-suggestion",
  "已筛出 6 个建议岗位": "position-match",
  等待候选人确认新简历: "external-wait",
  "允许解析候选人刚发送的新简历？": "attachment-permission",
  新简历已生成资料更新建议: "profile-diff",
  "资料更新会影响 6 个岗位匹配": "impact-analysis",
};

export const extraScenarioEvents = {
  client: [
    {
      id: "client-clarification",
      scene: "clarification",
      type: "approval",
      interactionKind: "clarification",
      time: "今天 09:04",
      title: "客户开发范围需要补充确认",
      detail:
        "“机器人方向”可能指整机、具身算法或核心零部件。范围不同会显著影响目标公司、联系人和用量。",
      status: "等待回答",
      tone: "warning",
      blocking: "review",
      action: "补充目标范围",
      data: {
        question: "本轮优先覆盖哪一类公司？",
        options: [
          "具身智能整机与通用机器人公司",
          "VLA 与机器人学习团队",
          "灵巧手、关节和机器人芯片公司",
        ],
      },
      afterResponse:
        "目标范围已补充到当前主线，执行计划和后续检索条件会据此更新。",
    },
    {
      id: "client-search-strategy",
      scene: "search-strategy",
      type: "approval",
      interactionKind: "editable-criteria",
      time: "今天 09:05",
      title: "公司别名与客户开发检索条件已整理",
      detail:
        "已结合官网、融资新闻和公开招聘信息整理公司别名、方向词与时间范围。开始大规模检索前可直接修改。",
      status: "待确认",
      tone: "warning",
      blocking: "review",
      action: "检查检索条件",
      data: {
        groups: [
          ["公司名与别名", ["星澜机器人", "Xinglan Robotics", "星澜具身智能"]],
          ["招聘与业务方向", ["VLA", "机器人学习", "运动控制", "灵巧手"]],
          ["时间范围", ["近 12 个月"]],
        ],
      },
      afterResponse:
        "检索条件已确认，我会按更新后的范围交叉核验公司和招聘信号。",
    },
    {
      id: "client-source-conflict",
      scene: "source-conflict",
      type: "approval",
      interactionKind: "source-conflict",
      time: "今天 09:17",
      title: "两条招聘证据存在冲突",
      detail:
        "公司官网仍展示岗位，但招聘负责人三个月前表示该方向暂停。Hunter 无法把两条信息同时视为当前事实。",
      status: "待判断",
      tone: "warning",
      blocking: "review",
      action: "核对冲突证据",
      data: {
        claims: [
          [
            "公司招聘官网",
            "VLA 算法负责人仍在招聘",
            "2026-08-12",
            "官网当前页面",
          ],
          [
            "招聘负责人公开回复",
            "VLA HC 暂停，等待下一轮预算",
            "2026-05-03",
            "公开招聘社区",
          ],
          [
            "B+ 轮融资公告",
            "资金用于扩充机器人研发团队",
            "2026-08-11",
            "公司公告",
          ],
        ],
      },
      afterResponse:
        "冲突证据已按你的决定标记；招聘机会会保留不确定性，不把过期信息写成当前事实。",
    },
    {
      id: "client-recruitment-opportunity",
      scene: "recruitment-opportunity",
      type: "approval",
      interactionKind: "recruitment-opportunity",
      time: "今天 11:16",
      title: "客户回复形成 2 个招聘机会",
      detail:
        "HRD 已确认两个 HC。完整 JD、职级和汇报线仍有缺口，需要决定写入为岗位还是先保留招聘机会。",
      status: "待审核",
      tone: "warning",
      blocking: "review",
      action: "审核招聘机会",
      data: {
        opportunities: [
          [
            "VLA 算法负责人",
            "HC 已确认",
            "完整 JD、薪酬范围",
            "创建岗位招聘主线",
          ],
          ["运动控制专家", "HC 已确认", "职级、汇报线", "保留为招聘机会"],
        ],
      },
      afterResponse:
        "招聘机会已按你的决定写入；已确认岗位会进入岗位招聘主线，信息不足项继续保留待补充。",
    },
    {
      id: "client-send-result",
      scene: "external-send-result",
      type: "approval",
      interactionKind: "send-result",
      time: "今天 09:34",
      title: "3 条外部联系已完成，1 条需要处理",
      detail:
        "邮件和脉脉消息已返回明确状态。失败动作不会自动反复重试，避免重复发送或触发平台风控。",
      status: "部分完成",
      tone: "warning",
      blocking: "review",
      action: "处理发送结果",
      data: {
        deliveries: [
          ["周雅雯 · HRD", "工作邮箱", "已送达", "等待回复"],
          ["许晴 · 招聘负责人", "脉脉", "已发送", "等待回复"],
          [
            "陈树明 · 研发 VP",
            "工作邮箱",
            "地址退信",
            "核验邮箱或改用关系路径",
          ],
          ["郭宇航 · 创始人办公室", "共同联系人", "已转达", "三天后提醒"],
        ],
      },
      afterResponse:
        "外发结果已记录。失败项会按你的选择重试或换渠道，已成功项不会重复发送。",
    },
    {
      id: "client-generated-report",
      scene: "generated-file",
      type: "result",
      interactionKind: "markdown-file",
      time: "今天 11:22",
      title: "客户开发调研记录已生成",
      detail:
        "完整来源清单、联系人核验过程和未确认项已整理为 Markdown 文件，方便留档和继续补充。",
      status: "已生成",
      tone: "success",
      action: "预览调研记录",
      route: "/files/client-xinglan-report.md",
      data: { filename: "星澜机器人客户开发调研记录.md" },
    },
    {
      id: "client-partial",
      scene: "partial-completion",
      type: "approval",
      interactionKind: "partial-result",
      time: "今天 11:24",
      title: "部分结果可以先交付",
      detail:
        "公司与 3 位联系人已完成核验；运动控制岗位职级和汇报线仍缺少可靠来源。",
      status: "等待决定",
      tone: "warning",
      blocking: "review",
      action: "处理部分结果",
      data: {
        done: ["公司资料", "3 位联系人", "VLA 岗位机会"],
        pending: ["运动控制岗位职级", "汇报线"],
      },
      afterResponse: "已按你的选择保留可用结果，并继续补齐尚未确认的岗位信息。",
    },
  ],
  position: [
    {
      id: "position-analysis-result",
      scene: "position-analysis",
      type: "approval",
      interactionKind: "position-analysis",
      time: "今天 08:21",
      title: "岗位解析建议已生成",
      detail:
        "联网调研与 JD 分析得到岗位定位、关键技能、隐性要求和 5 组寻访关键词，确认后才更新岗位。",
      status: "待审核",
      tone: "warning",
      blocking: "review",
      action: "审核岗位解析",
      data: {
        fields: [
          ["岗位定位", "负责 VLA 技术路线、团队和产品落地的算法负责人"],
          ["关键技能", "VLA、模仿学习、机器人学习、多模态、真机数据闭环"],
          [
            "软性和隐性要求",
            "需要在快速变化的创业环境中建立方法和团队；汇报线仍可能调整",
          ],
          [
            "寻访关键词",
            "VLA / robot learning；具身智能 / 操作策略；diffusion policy / manipulation",
          ],
        ],
      },
      afterResponse:
        "岗位解析建议已应用，后续搜索和匹配将使用确认后的岗位版本。",
    },
    {
      id: "position-search-strategy",
      scene: "search-strategy",
      type: "approval",
      interactionKind: "editable-criteria",
      time: "今天 08:23",
      title: "多渠道找人条件已整理",
      detail:
        "搜索词、目标公司、地点和排除边界已经结合岗位解析生成，可修改后开始召回。",
      status: "待确认",
      tone: "warning",
      blocking: "review",
      action: "检查搜索条件",
      data: {
        groups: [
          [
            "关键词组",
            [
              "VLA, vision language action",
              "robot learning, imitation learning",
              "diffusion policy, manipulation",
            ],
          ],
          [
            "目标公司",
            ["智元机器人", "银河通用", "千寻智能", "Physical Intelligence"],
          ],
          ["地点", ["上海", "杭州"]],
          [
            "角色边界",
            ["负责人 / 总监 / 高级专家", "排除仅学术研究且无落地经验"],
          ],
        ],
      },
      afterResponse: "搜索条件已确认，召回任务将使用这些条件并保留来源证据。",
    },
    {
      id: "position-dedupe",
      scene: "identity-dedupe",
      type: "approval",
      interactionKind: "identity-conflict",
      time: "今天 08:56",
      title: "发现 3 组疑似重复身份",
      detail:
        "姓名、公司和公开资料存在交叉，但不能只按姓名自动合并，需要检查履历与来源。",
      status: "待核对",
      tone: "warning",
      blocking: "review",
      action: "核对重复身份",
      data: {
        conflicts: [
          ["林昊", "Hao Lin · 远川智能", "OpenReview / 脉脉", "建议合并"],
          ["陈松", "Song Chen · 原力机器人", "专利 / 猎聘", "建议合并"],
          [
            "王晨",
            "Chen Wang · 两段公司不一致",
            "GitHub / 论文",
            "建议保留两者",
          ],
        ],
      },
      afterResponse:
        "身份冲突已按你的决定处理，候选池会基于去重后的身份继续匹配。",
    },
    {
      id: "position-login-blocked",
      scene: "login-blocked",
      type: "permission",
      interactionKind: "login-blocked",
      time: "今天 09:02",
      title: "脉脉登录状态失效",
      detail: "脉脉任务已在第 3 页第 4 位保存检查点；猎聘和内部来源不受影响。",
      status: "需处理",
      tone: "danger",
      blocking: "review",
      action: "处理平台登录",
      data: {
        platform: "脉脉",
        checkpoint: "page-3-item-4",
        retained: "22 位候选人和全部已下载附件",
      },
      afterResponse:
        "平台登录已恢复，我会从 page-3-item-4 继续，不重复读取已处理候选人。",
    },
    {
      id: "position-no-result",
      scene: "no-result",
      type: "approval",
      interactionKind: "no-result",
      time: "今天 09:03",
      title: "当前条件没有找到可进入审核的候选人",
      detail:
        "已完成内部人才池、论文作者、猎聘和脉脉首轮检索；召回的 37 位均未通过角色或地点门槛。",
      status: "等待调整",
      tone: "warning",
      blocking: "review",
      action: "调整检索范围",
      data: {
        searched: [
          "内部人才池 1,284 人",
          "论文作者 216 人",
          "猎聘 40 个详情",
          "脉脉 31 个详情",
        ],
        reasons: ["岗位角色要求过窄", "地点只接受上海", "排除了纯研究背景"],
        suggestions: ["放宽到高级专家", "加入杭州", "保留有真机项目的研究背景"],
      },
      afterResponse:
        "检索范围已调整，我会只重跑受影响的召回与门禁步骤，并保留本轮诊断。",
    },
    {
      id: "position-runtime-failure",
      scene: "runtime-failure",
      type: "approval",
      interactionKind: "runtime-failure",
      time: "今天 09:04",
      title: "候选人解析步骤连续失败",
      detail:
        "第 19 位候选人的附件解析连续两次超时。任务已停在检查点，前 18 位结果和原始附件均已保留。",
      status: "需处理",
      tone: "danger",
      blocking: "review",
      action: "处理运行失败",
      data: {
        step: "脉脉附件视觉解析",
        checkpoint: "page-2-item-9",
        retained: "18 位候选人、7 份附件、全部匹配输入",
        error: "VISION_PARSE_TIMEOUT · 两次尝试均超过 180 秒",
      },
      afterResponse:
        "失败步骤已按你的决定处理，任务会从保存的检查点继续，不重复解析已完成候选人。",
    },
    {
      id: "position-gate-failure",
      scene: "gate-failure",
      type: "result",
      interactionKind: "gate-failure",
      time: "今天 09:05",
      title: "2 条候选人输出未通过门禁",
      detail:
        "一条缺少来源证据，一条把推断职级写成确定事实。Hunter 已要求 Agent 在当前步骤修正。",
      status: "自动修正中",
      tone: "warning",
      data: {
        failures: [
          "候选人 C-018：当前公司缺少来源",
          "候选人 C-023：职级证据不足",
        ],
      },
    },
  ],
  mapping: [
    {
      id: "mapping-academic-clues",
      scene: "academic-clues",
      type: "approval",
      interactionKind: "academic-clues",
      time: "今天 09:16",
      title: "论文与专利线索已归入人物证据",
      detail:
        "找到 18 篇论文和 9 件专利；去重后 11 条线索可用于确认人物方向和团队关系。",
      status: "待审核",
      tone: "warning",
      blocking: "review",
      action: "审核学术线索",
      data: {
        items: [
          [
            "论文",
            "Generalist Robot Policies from Multi-Embodiment Data",
            "林昊、韩思雨",
            "CoRL 2024",
          ],
          ["专利", "一种多自由度灵巧手传动机构", "陈松、许澈", "CN117842816A"],
          [
            "论文",
            "Efficient Robot Control on Edge Accelerators",
            "周亦辰",
            "ICRA 2025",
          ],
        ],
      },
      afterResponse:
        "确认的论文与专利线索已关联到人物和团队，未确认项继续保留为线索。",
    },
    {
      id: "mapping-relation-path",
      scene: "relation-path",
      type: "approval",
      interactionKind: "relation-path",
      time: "今天 09:26",
      title: "找到 5 条可用联系路径",
      detail:
        "路径来自已有候选人关系、共同论文和一度关系；每条都需要核验证据与有效期。",
      status: "待核验",
      tone: "warning",
      blocking: "review",
      action: "核验联系路径",
      data: {
        paths: [
          ["沈岚 → 林昊 → 韩思雨", "候选人关系 + 共同论文", "高"],
          ["周雅雯 → 陈树明", "同公司公开组织关系", "高"],
          ["秦放 → 王晨", "共同论文 1 篇", "中"],
        ],
      },
      afterResponse:
        "已确认的联系路径写入摸排成果，证据不足的路径继续保留为待核验。",
    },
    {
      id: "mapping-coverage-gap",
      scene: "coverage-gap",
      type: "result",
      interactionKind: "partial-result",
      time: "今天 09:32",
      title: "人才摸排覆盖率达到 72%",
      detail:
        "负责人和核心算法成员覆盖较完整；平台工程、数据和机器人芯片方向仍有 16 个关键位置缺口。",
      status: "继续补齐",
      tone: "info",
      data: {
        done: [
          "VLA 负责人 8/9",
          "机器人学习核心成员 31/36",
          "灵巧手结构 14/18",
        ],
        pending: [
          "平台工程 7 个位置",
          "数据闭环 4 个位置",
          "机器人芯片 5 个位置",
        ],
      },
    },
    {
      id: "mapping-budget",
      scene: "budget-blocked",
      type: "permission",
      interactionKind: "budget-blocked",
      time: "今天 09:40",
      title: "本轮深度摸排接近用量上限",
      detail:
        "已使用 82% 的当前任务预算；继续补齐全部 16 个位置预计额外使用 24%。",
      status: "等待决定",
      tone: "warning",
      blocking: "review",
      action: "调整范围或预算",
      data: { used: 82, estimate: 24 },
      afterResponse:
        "预算与范围已更新，我会优先补齐高优先级岗位并保留剩余缺口。",
    },
  ],
  career: [
    {
      id: "career-reply-attachment",
      scene: "external-reply",
      type: "object",
      interactionKind: "external-reply",
      time: "今天 09:01",
      title: "候选人回复并发送新版简历",
      detail:
        "林昊补充了跨本体 VLA 项目、杭州工作地点和团队管理意向；附件已通过简历文件门禁。",
      status: "待读取",
      tone: "warning",
      blocking: "review",
      action: "查看回复与附件",
      data: {
        reply:
          "可以考虑上海或杭州；希望了解汇报线和期权结构。最新版简历见附件。",
        filename: "林昊-2026-08-16.pdf",
      },
      afterResponse:
        "新简历和人工补充信息已进入字段差异分析，不会直接覆盖候选人资料。",
    },
    {
      id: "career-profile-diff",
      scene: "profile-diff",
      type: "approval",
      interactionKind: "profile-diff",
      time: "今天 09:08",
      title: "新简历已生成字段级更新建议",
      detail:
        "识别 6 项变化；每项保留原值、新值、来源和影响范围，确认后才写入候选人。",
      status: "待审核",
      tone: "warning",
      blocking: "review",
      action: "审核资料变化",
      data: {
        diffs: [
          ["工作地点", "上海", "上海、杭州", "候选人回复 + 新简历"],
          ["团队规模", "12 人", "15 人", "新简历"],
          ["项目经历", "2 项", "新增跨本体策略评测平台", "新简历"],
          ["期望薪资", "110-140 万", "总包 120 万以上，可谈期权", "候选人回复"],
        ],
      },
      afterResponse:
        "字段更新已按你的选择写入候选人，旧值和来源仍保留在版本记录中。",
    },
    {
      id: "career-conflict",
      scene: "identity-conflict",
      type: "approval",
      interactionKind: "identity-conflict",
      time: "今天 09:10",
      title: "附件姓名与系统英文名存在冲突",
      detail:
        "附件写作 Hao Lin，系统另有 Lin Hao；履历、邮箱和公开主页高度一致，建议关联为同一候选人。",
      status: "待核对",
      tone: "warning",
      blocking: "review",
      action: "核对身份",
      data: {
        conflicts: [
          [
            "Hao Lin",
            "林昊 · Lin Hao",
            "邮箱、两段工作经历、个人主页一致",
            "建议关联已有候选人",
          ],
        ],
      },
      afterResponse: "身份已关联到林昊，附件解析结果会进入该候选人的资料审核。",
    },
    {
      id: "career-local-rematch",
      scene: "local-rematch",
      type: "result",
      interactionKind: "impact-analysis",
      time: "今天 09:14",
      title: "只需重算 6 个岗位的匹配",
      detail:
        "地点和管理规模变化会影响 6 个岗位；其余 12 个历史匹配不受影响，不会全量重跑。",
      status: "待确认范围",
      tone: "warning",
      blocking: "review",
      action: "检查影响范围",
      data: {
        affected: [
          "星澜机器人 · VLA 算法负责人",
          "澄川自动化 · 机器人学习负责人",
          "拓界智驾 · 端到端算法总监",
        ],
        unchanged: 12,
      },
      afterResponse: "已按确认范围局部重算 6 个岗位，其他历史匹配保持不变。",
    },
  ],
};

const sceneMeta = [
  ["target-plan", "目标理解与执行计划", "client"],
  ["clarification", "需求歧义与补充确认", "client"],
  ["search-strategy", "搜索策略与可编辑条件", "position"],
  ["source-evidence", "来源与证据", "client"],
  ["source-conflict", "来源冲突与时效判断", "client"],
  ["company-contact-draft", "公司与联系人草稿", "client"],
  ["recruitment-opportunity", "招聘信号与机会", "client"],
  ["external-reply", "外部回复与附件", "career"],
  ["organization-draft", "组织与人才摸排草图", "mapping"],
  ["candidate-pool", "人物线索与候选池", "position"],
  ["identity-dedupe", "身份查重与冲突", "position"],
  ["profile-diff", "简历与资料解析", "career"],
  ["academic-clues", "论文与专利线索", "mapping"],
  ["relation-path", "人物关系与联系路径", "mapping"],
  ["position-analysis", "岗位理解与解析建议", "position"],
  ["position-match", "人岗匹配结果", "career"],
  ["message-draft", "沟通内容草稿", "client"],
  ["outbound-permission", "外部发送与授权", "client"],
  ["external-send-result", "外部发送结果", "client"],
  ["impact-analysis", "影响分析与版本差异", "position"],
  ["branch-suggestion", "支线任务建议", "client"],
  ["generated-file", "生成文件", "client"],
  ["partial-completion", "部分完成", "client"],
  ["no-result", "无结果与条件调整", "position"],
  ["coverage-gap", "覆盖缺口", "mapping"],
  ["login-blocked", "登录与权限阻塞", "position"],
  ["budget-blocked", "预算与额度阻塞", "mapping"],
  ["runtime-failure", "运行失败与检查点恢复", "position"],
  ["gate-failure", "门禁失败与自动修正", "position"],
  ["external-wait", "异步等待", "client"],
  ["local-rematch", "局部重新匹配", "career"],
];

export const intermediateScenarioCatalog = sceneMeta.map(
  ([scene, title, kind]) => ({ scene, title, kind }),
);

export function buildWorkstreamEvents(kind, baseEvents, scene) {
  const annotated = baseEvents.map((event, index) => ({
    id: event.id || `${kind}-base-${index}`,
    ...event,
    scene: event.scene || eventSceneByTitle[event.title],
  }));
  const extras = extraScenarioEvents[kind] || [];
  if (!scene) return annotated;
  const target = extras.find((event) => event.scene === scene);
  if (target) return [...annotated.slice(0, 2), target];
  return annotated;
}
