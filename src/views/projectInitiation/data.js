// 表头数组 +  表格数组
export const columnList = {
  // 项目立项主页(流程操作页)
  tabList: [
    {
      label: '详细信息',
      id: 'baseInfo',
      isExpand: true,
      isShowEditBtn: true,
    },
    {
      label: '团队',
      id: 'team',
      isExpand: true,
      isShowEditBtn: true,
    },
    {
      label: '里程碑计划',
      id: 'plan',
      isExpand: true,
      isShowEditBtn: true,
    },
    {
      label: '目标/指标',
      id: 'target',
      isExpand: true,
      isShowEditBtn: true,
    },
    {
      label: '薪酬包',
      id: 'payPacket',
      isExpand: true,
      isShowEditBtn: true,
    },
  ],
  // 项目立项主页(流程提交页)
  tabList2: [
    {
      label: '详细信息',
      id: 'baseInfo',
      isExpand: true,
      isShowEditBtn: true,
    },
    {
      label: '团队',
      id: 'team',
      isExpand: true,
      isShowEditBtn: true,
    },
    {
      label: '里程碑计划',
      id: 'plan',
      isExpand: true,
      isShowEditBtn: true,
    },
    {
      label: '目标/指标',
      id: 'target',
      isExpand: true,
      isShowEditBtn: true,
    },
    {
      label: '薪酬包',
      id: 'payPacket',
      isExpand: true,
      isShowEditBtn: true,
    },
    {
      label: '流程设置',
      id: 'processSet',
      isExpand: true,
      isShowEditBtn: false,
    },
  ],
};

// 计划表头
export const planColumn = [
  {
    title: '里程碑计划',
    dataIndex: 'actStartDisplayName',
  },
  {
    title: '项目时间',
    dataIndex: 'actStartValue',
  },
];

// 计划表格数据
export const planTableData = [
  {
    milestone: '计划项目开始时间',
    projectTime: '2020/05/29',
  },
  {
    milestone: '计划先期研究与概念研究完成时间时间',
    projectTime: '2020/06/07',
  },
  {
    milestone: '计划详细设计完成时间',
    projectTime: '2020/05/11',
  },
  {
    milestone: '计划样机试制完成时间',
    projectTime: '2020/05/11',
  },
  {
    milestone: '计划可靠性验证完成时间',
    projectTime: '2020/05/29',
  },
  {
    milestone: '计划小批验证时间',
    projectTime: '2020/05/25',
  },
  {
    milestone: '计划批量验证完成时间',
    projectTime: '2020/05/25',
  },
  {
    milestone: '计划批量验证完成时间',
    projectTime: '2020/05/25',
  },
  {
    milestone: '计划批量验证完成时间',
    projectTime: '2020/05/25',
  },
  {
    milestone: '计划批量验证完成时间',
    projectTime: '2020/05/25',
  },
  {
    milestone: '计划批量验证完成时间',
    projectTime: '2020/05/25',
  },
];

// 目标/指标表头
export const targetColumn = [
  {
    title: '指标类别',
    dataIndex: 'indicatorType',
  },
  {
    title: '指标名称',
    dataIndex: 'indicatorName',
  },
  {
    title: '单位',
    dataIndex: 'unit',
  },
  {
    title: '目标值',
    dataIndex: 'projectTargetValue',
  },
];

// 目标/指标表格数据
export const targetTableData = [
  {
    indexType: '技术指标',
    indexName: '目标油耗',
    unit: '升',
    targetVal: '40',
  },
  {
    indexType: '质量指标',
    indexName: '市场容量',
    unit: '-',
    targetVal: '文字内容',
  },
  {
    indexType: '市场指标',
    indexName: '目标效率',
    unit: '-',
    targetVal: '90%',
  },
  {
    indexType: '技术指标',
    indexName: '目标操控性',
    unit: '-',
    targetVal: '操作舒适',
  },
];

// 主包成员 表头
export const mainMemberColumn = [
  {
    label: '',
    dataIndex: '',
    children: [
      {
        label: '成员(角色)',
        dataIndex: 'member',
        width: 160,
      },
    ],
  },
  {
    label: '',
    dataIndex: '',
    children: [
      {
        label: '账号',
        dataIndex: 'account',
      },
      {
        label: '分工',
        dataIndex: 'work',
      },
      {
        label: '部门',
        dataIndex: 'depart',
      },
      {
        label: '成员属性',
        dataIndex: 'memberAttr',
      },
    ],
  },
  {
    label: '样机建造',
    name: 'modelCreate',
    dataIndex: 'modelCreate',
    children: [
      {
        label: '权重(%)',
        dataIndex: 'modelCreateWeight',
      },
    ],
  },
  {
    label: '小批应用',
    dataIndex: 'smallApp',
    children: [
      {
        label: '权重(%)',
        dataIndex: 'smallAppWeight',
      },
    ],
  },
  {
    label: '批量验证',
    dataIndex: 'batchVerify',
    children: [
      {
        label: '权重(%)',
        dataIndex: 'batchVerifyWeight',
      },
    ],
  },
];

// 主包成员 表格数据
export const mainMemberTableData = [
  {
    member: '张苑栋(项目经理)',
    account: 'cn08730',
    work: '分工1',
    depart: '技术中心部门',
    memberAttr: '核心成员',
    modelCreateWeight: '20',
    smallAppWeight: '20',
    batchVerifyWeight: '20',
  },
  {
    member: '沙才(研发工程师)',
    account: 'cn09846',
    work: '分工2',
    depart: '技术中心部门',
    memberAttr: '核心成员',
    modelCreateWeight: '19',
    smallAppWeight: '19',
    batchVerifyWeight: '19',
  },
];

// 配包各部门权重与金额 表头
export const packageDepartWeightColumn = [
  {
    label: '',
    dataIndex: '',
    children: [
      {
        label: '部门',
        dataIndex: 'depart',
      },
    ],
  },
  {
    label: '样机建造',
    dataIndex: 'modelCreate',
    children: [
      {
        label: '阶段占比 (%)',
        dataIndex: 'modelStageProp',
      },
      {
        label: '配包金额 (元)',
        dataIndex: 'modelPackageMoney',
      },
    ],
  },
  {
    label: '小批应用',
    dataIndex: 'smallApp',
    children: [
      {
        label: '阶段占比 (%)',
        dataIndex: 'smallStageProp',
      },
      {
        label: '配包金额 (元)',
        dataIndex: 'smallPackageMoney',
      },
    ],
  },
  {
    label: '批量验证',
    dataIndex: 'batchVerify',
    children: [
      {
        label: '阶段占比 (%)',
        dataIndex: 'batchStageProp',
      },
      {
        label: '配包金额 (元)',
        dataIndex: 'batchPackageMoney',
      },
    ],
  },
];

// 配包各部门权重与金额 表格数据
export const packageDepartWeightTableData = [
  {
    depart: '中试基地',
    modelStageProp: '5',
    modelPackageMoney: '',
    smallStageProp: '5',
    smallPackageMoney: '',
    batchStageProp: '5',
    batchPackageMoney: '',
  },
  {
    depart: '物资采购本部',
    modelStageProp: '2',
    modelPackageMoney: '',
    smallStageProp: '2',
    smallPackageMoney: '',
    batchStageProp: '2',
    batchPackageMoney: '',
  },
  {
    depart: '营销公司',
    modelStageProp: '1',
    modelPackageMoney: '',
    smallStageProp: '1',
    smallPackageMoney: '',
    batchStageProp: '1',
    batchPackageMoney: '',
  },
  {
    depart: '国际营销公司',
    modelStageProp: '1',
    modelPackageMoney: '',
    smallStageProp: '1',
    smallPackageMoney: '',
    batchStageProp: '1',
    batchPackageMoney: '',
  },
  {
    depart: '配件公司',
    modelStageProp: '12',
    modelPackageMoney: '',
    smallStageProp: '12',
    smallPackageMoney: '',
    batchStageProp: '12',
    batchPackageMoney: '',
  },
  {
    depart: '装·事业部',
    modelStageProp: '3',
    modelPackageMoney: '',
    smallStageProp: '3',
    smallPackageMoney: '',
    batchStageProp: '3',
    batchPackageMoney: '',
  },
  {
    depart: '挖·事业部',
    modelStageProp: '5',
    modelPackageMoney: '',
    smallStageProp: '5',
    smallPackageMoney: '',
    batchStageProp: '5',
    batchPackageMoney: '',
  },
  {
    depart: '零·事业部',
    modelStageProp: '2',
    modelPackageMoney: '',
    smallStageProp: '2',
    smallPackageMoney: '',
    batchStageProp: '2',
    batchPackageMoney: '',
  },
  {
    depart: '运营管理本部',
    modelStageProp: '0',
    modelPackageMoney: '',
    smallStageProp: '0',
    smallPackageMoney: '',
    batchStageProp: '0',
    batchPackageMoney: '',
  },
  {
    depart: '财务本部',
    modelStageProp: '1',
    modelPackageMoney: '',
    smallStageProp: '1',
    smallPackageMoney: '',
    batchStageProp: '1',
    batchPackageMoney: '',
  },
  {
    depart: '战略规划本部',
    modelStageProp: '1',
    modelPackageMoney: '',
    smallStageProp: '1',
    smallPackageMoney: '',
    batchStageProp: '1',
    batchPackageMoney: '',
  },
  {
    depart: '质量管理部',
    modelStageProp: '0',
    modelPackageMoney: '',
    smallStageProp: '0',
    smallPackageMoney: '',
    batchStageProp: '0',
    batchPackageMoney: '',
  },
  {
    depart: '信息技术研究院',
    modelStageProp: '8',
    modelPackageMoney: '',
    smallStageProp: '8',
    smallPackageMoney: '',
    batchStageProp: '8',
    batchPackageMoney: '',
  },
];

// 配包成员 表头
export const packageMemberColumn = [
  {
    label: '',
    dataIndex: '',
    children: [
      {
        label: '成员',
        dataIndex: 'member',
        width: 160,
      },
    ],
  },
  {
    label: '',
    dataIndex: '',
    children: [
      {
        label: '部门',
        dataIndex: 'depart',
      },
      {
        label: '账号',
        dataIndex: 'account',
      },
      {
        label: '分工',
        dataIndex: 'work',
      },
      {
        label: '成员属性',
        dataIndex: 'memberAttr',
      },
    ],
  },
  {
    label: '样机建造',
    name: 'modelCreate',
    dataIndex: 'modelCreate',
    children: [
      {
        label: '权重(%)',
        dataIndex: 'modelCreateWeight',
      },
    ],
  },
  {
    label: '小批应用',
    dataIndex: 'smallApp',
    children: [
      {
        label: '权重(%)',
        dataIndex: 'smallAppWeight',
      },
    ],
  },
  {
    label: '批量验证',
    dataIndex: 'batchVerify',
    children: [
      {
        label: '权重(%)',
        dataIndex: 'batchVerifyWeight',
      },
    ],
  },
];

// 配包成员 表格数据
export const packageMemberTableData = [
  {
    member: '曲云',
    depart: '物资采购部',
    account: 'cn08730',
    work: '分工1',
    memberAttr: '核心成员',
    modelCreateWeight: '20',
    smallAppWeight: '20',
    batchVerifyWeight: '20',
  },
  {
    member: '金静',
    depart: '物资采购部',
    account: 'cn09846',
    work: '分工2',
    memberAttr: '一般成员',
    modelCreateWeight: '19',
    smallAppWeight: '19',
    batchVerifyWeight: '19',
  },
  {
    member: '季功奇',
    depart: '物资采购部',
    account: 'cn17500',
    work: '分工3',
    memberAttr: '核心成员',
    modelCreateWeight: '61',
    smallAppWeight: '61',
    batchVerifyWeight: '61',
  },
  {
    member: '孟瑶',
    depart: '信息技术研究部',
    account: 'cn76544',
    work: '分工4',
    memberAttr: '核心成员',
    modelCreateWeight: '100',
    smallAppWeight: '100',
    batchVerifyWeight: '100',
  },
  {
    member: '乐建婷',
    depart: '战略规划本部',
    account: 'cn09880',
    work: '分工5',
    memberAttr: '一般成员',
    modelCreateWeight: '100',
    smallAppWeight: '100',
    batchVerifyWeight: '100',
  },
];

export const arr = [
  {
    label: '产品规划评审',
    id: 'chanpinguihua',
    isExpand: true,
    isShowEditBtn: true,
  },
  {
    label: '国际营销评审',
    id: 'guojiyingxiao',
    isExpand: true,
    isShowEditBtn: true,
  },
  {
    label: '营销评审',
    id: 'yingxiao',
    isExpand: true,
    isShowEditBtn: true,
  },
  {
    label: '战略评审',
    id: 'zhanlve',
    isExpand: true,
    isShowEditBtn: true,
  },
  {
    label: '质量成本评审',
    id: 'zhiliangchengben',
    isExpand: true,
    isShowEditBtn: true,
  },
];
