// 替换记录
export const replaceColumn = [
  {
    title: '操作时间',
    label: '操作时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作人',
    label: '操作人',
    dataIndex: 'actuallyoperator',
  },
  {
    title: '替换内容',
    label: '替换内容',
    dataIndex: 'replaceInfo',
  },
  {
    title: '替换人',
    label: '替换人',
    dataIndex: 'actuallyReplacer',
  },
  {
    title: '被替换人',
    label: '被替换人',
    dataIndex: 'actuallyByReplacer',
  },
];

// 变更记录
export const changeRecordColumn = [
  {
    title: '操作时间',
    label: '操作时间',
    dataIndex: 'operateDate',
  },
  {
    title: '操作人',
    label: '操作人',
    dataIndex: 'operateUser',
  },
  {
    title: '操作说明',
    label: '操作说明',
    dataIndex: 'changeInfo',
  },
];

// 主包阶段占比、扣减金额与阶段得分 表头
export const mainPackageColumn = [
  {
    label: '',
    dataIndex: 'attr',
    width: 160,
  },
  {
    label: '样机建造',
    dataIndex: 'phase1',
    children: [],
  },
  {
    label: '小批应用',
    dataIndex: 'phase2',
    children: [],
  },
  {
    label: '批量验证',
    dataIndex: 'phase3',
    children: [],
  },
];

// 主包阶段占比、扣减金额与阶段得分 表格数据
export const mainPackageTableData = [
  {
    attr: '阶段占比 (%)',
    modelCreate: '40',
    smallApp: '40',
    batchVerify: '20',
    id: '1',
  },
  {
    attr: '变更次数',
    modelCreate: 0,
    smallApp: '20',
    batchVerify: '33',
    id: '2',
  },
  {
    attr: '扣减金额',
    modelCreate: '999',
    smallApp: '22',
    batchVerify: '36',
    id: '3',
  },
  {
    attr: '阶段得分',
    modelCreate: '100',
    smallApp: '98',
    batchVerify: '75',
    id: '4',
  },
  {
    attr: '阶段主包薪酬 (元)',
    modelCreate: '2000',
    smallApp: '1900',
    batchVerify: '1600',
    id: '5',
  },
];

// 主包成员 表头
export const mainMemberColumn = [
  {
    label: '',
    dataIndex: '',
    children: [
      {
        label: '成员 (角色)',
        dataIndex: 'userName',
        width: 150,
        fixed: 'left',
      },
    ],
  },
  {
    label: '样机建造',
    dataIndex: 'modelCreate',
    children: [
      {
        label: '权重 (%)',
        dataIndex: 'phase1Percent',
      },
      {
        label: '个人打分',
        dataIndex: 'phase1Score',
      },
      {
        label: '个人加权得分',
        dataIndex: 'phase1WeightedScore',
        width: 110,
      },
      {
        label: '个人薪酬 (元)',
        dataIndex: 'phase1Reward',
        sortable: true,
        width: 140,
      },
    ],
  },
  {
    label: '小批应用',
    dataIndex: 'smallApp',
    children: [
      {
        label: '权重 (%)',
        dataIndex: 'phase2Percent',
      },
      {
        label: '个人打分',
        dataIndex: 'phase2Score',
      },
      {
        label: '个人加权得分',
        dataIndex: 'phase2WeightedScore',
        width: 110,
      },
      {
        label: '个人薪酬 (元)',
        dataIndex: 'phase2Reward',
        sortable: true,
        width: 140,
      },
    ],
  },
  {
    label: '批量验证',
    dataIndex: 'batchVerify',
    children: [
      {
        label: '权重 (%)',
        dataIndex: 'phase3Percent',
      },
      {
        label: '个人打分',
        dataIndex: 'phase3Score',
      },
      {
        label: '个人加权得分',
        dataIndex: 'phase3WeightedScore',
        width: 110,
      },
      {
        label: '个人薪酬 (元)',
        dataIndex: 'phase3Reward',
        sortable: true,
        width: 140,
      },
    ],
  },
];

//  主包成员 表格数据
export const mainMemberTableData = [
  {
    member: '张苑栋 (项目经理)',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '98',
    modelCreatePersonPay: '12000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '98',
    smallAppPersonPay: '12000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '98',
    batchVerifyPersonPay: '12000',
  },
  {
    member: '沙才 (研发工程师)',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
  },
  {
    member: '沙才 (研发工程师)',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
  },
  {
    member: '沙才 (研发工程师)',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
  },
  {
    member: '沙才 (研发工程师)',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
  },
  {
    member: '沙才 (研发工程师)',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
  },
  {
    member: '沙才 (研发工程师)',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
  },
  {
    member: '沙才 (研发工程师)',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
  },
  {
    member: '沙才 (研发工程师)',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
  },
  {
    member: '沙才 (研发工程师)',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
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
        width: 140,
      },
    ],
  },
  {
    label: '样机建造',
    dataIndex: 'modelCreate',
    children: [
      {
        label: '阶段占比 (%)',
        dataIndex: 'modelCreateStageProportion',
      },
      {
        label: '配包金额 (元)',
        dataIndex: 'modelCreatePackageSum',
      },
    ],
  },
  {
    label: '小批应用',
    dataIndex: 'smallApp',
    children: [
      {
        label: '阶段占比 (%)',
        dataIndex: 'smallAppStageProportion',
      },
      {
        label: '配包金额 (元)',
        dataIndex: 'smallAppPackageSum',
      },
    ],
  },
  {
    label: '批量验证',
    dataIndex: 'batchVerify',
    children: [
      {
        label: '阶段占比 (%)',
        dataIndex: 'batchVerifyStageProportion',
      },
      {
        label: '配包金额 (元)',
        dataIndex: 'batchVerifyPackageSum',
      },
    ],
  },
];

// 配包各部门权重与金额 表格数据
export const packageDepartWeightTableData = [
  {
    depart: '中试基地',
    modelCreateStageProportion: '',
    modelCreatePackageSum: '10000',
    smallAppStageProportion: '',
    smallAppPackageSum: '10000',
    batchVerifyStageProportion: '0',
    batchVerifyPackageSum: '10000',
  },
  {
    depart: '物资采购本部',
    modelCreateStageProportion: '',
    modelCreatePackageSum: '9000',
    smallAppStageProportion: '',
    smallAppPackageSum: '9000',
    batchVerifyStageProportion: '0',
    batchVerifyPackageSum: '10000',
  },
  {
    depart: '营销公司',
    modelCreateStageProportion: '',
    modelCreatePackageSum: '9000',
    smallAppStageProportion: '',
    smallAppPackageSum: '9000',
    batchVerifyStageProportion: '0',
    batchVerifyPackageSum: '10000',
  },
  {
    depart: '国际营销公司',
    modelCreateStageProportion: '',
    modelCreatePackageSum: '9000',
    smallAppStageProportion: '',
    smallAppPackageSum: '9000',
    batchVerifyStageProportion: '0',
    batchVerifyPackageSum: '10000',
  },
  {
    depart: '配件公司',
    modelCreateStageProportion: '',
    modelCreatePackageSum: '9000',
    smallAppStageProportion: '',
    smallAppPackageSum: '9000',
    batchVerifyStageProportion: '0',
    batchVerifyPackageSum: '10000',
  },
  {
    depart: '装·事业部',
    modelCreateStageProportion: '',
    modelCreatePackageSum: '9000',
    smallAppStageProportion: '',
    smallAppPackageSum: '9000',
    batchVerifyStageProportion: '0',
    batchVerifyPackageSum: '10000',
  },
  {
    depart: '挖·事业部',
    modelCreateStageProportion: '',
    modelCreatePackageSum: '9000',
    smallAppStageProportion: '',
    smallAppPackageSum: '9000',
    batchVerifyStageProportion: '0',
    batchVerifyPackageSum: '10000',
  },
  {
    depart: '零·事业部',
    modelCreateStageProportion: '',
    modelCreatePackageSum: '9000',
    smallAppStageProportion: '',
    smallAppPackageSum: '9000',
    batchVerifyStageProportion: '0',
    batchVerifyPackageSum: '10000',
  },
  {
    depart: '运营管理本部',
    modelCreateStageProportion: '',
    modelCreatePackageSum: '9000',
    smallAppStageProportion: '',
    smallAppPackageSum: '9000',
    batchVerifyStageProportion: '0',
    batchVerifyPackageSum: '10000',
  },
  {
    depart: '财务本部',
    modelCreateStageProportion: '',
    modelCreatePackageSum: '9000',
    smallAppStageProportion: '',
    smallAppPackageSum: '9000',
    batchVerifyStageProportion: '0',
    batchVerifyPackageSum: '10000',
  },
  {
    depart: '战略规划本部',
    modelCreateStageProportion: '',
    modelCreatePackageSum: '9000',
    smallAppStageProportion: '',
    smallAppPackageSum: '9000',
    batchVerifyStageProportion: '0',
    batchVerifyPackageSum: '10000',
  },
  {
    depart: '质量管理部',
    modelCreateStageProportion: '',
    modelCreatePackageSum: '9000',
    smallAppStageProportion: '',
    smallAppPackageSum: '9000',
    batchVerifyStageProportion: '0',
    batchVerifyPackageSum: '10000',
  },
  {
    depart: '信息技术研究院',
    modelCreateStageProportion: '',
    modelCreatePackageSum: '9000',
    smallAppStageProportion: '',
    smallAppPackageSum: '9000',
    batchVerifyStageProportion: '0',
    batchVerifyPackageSum: '10000',
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
        width: 80,
      },
      {
        label: '部门',
        dataIndex: 'depart',
        width: 160,
      },
    ],
  },
  {
    label: '样机建造',
    dataIndex: 'modelCreate',
    children: [
      {
        label: '权重 (%)',
        dataIndex: 'modelCreateWeight',
      },
      {
        label: '个人打分',
        dataIndex: 'modelCreatePersonRate',
      },
      {
        label: '个人加权得分',
        dataIndex: 'modelCreatePersonWeightRate',
        width: 110,
      },
      {
        label: '个人薪酬 (元)',
        dataIndex: 'modelCreatePersonPay',
        sortable: true,
        width: 140,
      },
    ],
  },
  {
    label: '小批应用',
    dataIndex: 'smallApp',
    children: [
      {
        label: '权重 (%)',
        dataIndex: 'smallAppWeight',
      },
      {
        label: '个人打分',
        dataIndex: 'smallAppPersonRate',
      },
      {
        label: '个人加权得分',
        dataIndex: 'smallAppPersonWeightRate',
        width: 110,
      },
      {
        label: '个人薪酬 (元)',
        dataIndex: 'smallAppPersonPay',
        sortable: true,
        width: 140,
      },
    ],
  },
  {
    label: '批量验证',
    dataIndex: 'batchVerify',
    children: [
      {
        label: '权重 (%)',
        dataIndex: 'batchVerifyWeight',
      },
      {
        label: '个人打分',
        dataIndex: 'batchVerifyPersonRate',
      },
      {
        label: '个人加权得分',
        dataIndex: 'batchVerifyWeightRate',
        width: 110,
      },
      {
        label: '个人薪酬 (元)',
        dataIndex: 'batchVerifyPersonPay',
        sortable: true,
        width: 140,
      },
    ],
  },
];

//  配包成员 表格数据
export const packageMemberTableData = [
  {
    member: '张苑栋',
    depart: '',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '98',
    modelCreatePersonPay: '12000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '98',
    smallAppPersonPay: '12000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '98',
    batchVerifyPersonPay: '12000',
  },
  {
    member: '沙才',
    depart: '',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
  },
  {
    member: '沙才',
    depart: '',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
  },
  {
    member: '沙才',
    depart: '',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
  },
  {
    member: '沙才',
    depart: '',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
  },
  {
    member: '沙才',
    depart: '',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
  },
  {
    member: '沙才',
    depart: '',
    modelCreateWeight: '',
    modelCreatePersonRate: '',
    modelCreatePersonWeightRate: '100',
    modelCreatePersonPay: '15000',
    smallAppWeight: '',
    smallAppPersonRate: '',
    smallAppPersonWeightRate: '100',
    smallAppPersonPay: '15000',
    batchVerifyWeight: '',
    batchVerifyPersonRate: '',
    batchVerifyWeightRate: '100',
    batchVerifyPersonPay: '18000',
  },
];

export const modelData = [
  {
    phase1Change: { value: 0, canEdit: true },
    phase2Change: { value: 0, canEdit: true },

    phase1Cut: { value: 0, canEdit: true },
    phase1Percent: 40,
    phase1Reward: 0,
    phase1Score: 0,
  },
  {
    phase2Cut: { value: 0, canEdit: true },
    phase2Percent: 40,
    phase2Reward: 0,
    phase2Score: 0,
  },
  {
    phase3Cut: { value: 0, canEdit: true },
    phase3Percent: 40,
    phase3Reward: 0,
    phase3Score: 0,
  },
];

//薪酬包的模块按钮以及权限
export const btnList = {
  // 项目评价与主包金额
  projectEvaluate: [
    {
      isPrimary: true,
      label: '保存',
      clickName: 'save',
      clickProps: [1],
    },
    {
      isPrimary: true,
      label: '变更记录',
      clickName: 'lookData',
      clickProps: [1],
    },
  ],
  // 主包阶段占比、扣减金额与阶段得分
  mainPackageWeight: [
    {
      isPrimary: true,
      label: '保存',
      clickName: 'save',
      clickProps: [2],
    },
    {
      isPrimary: false,
      label: '变更记录',
      clickName: 'lookData',
      clickProps: [5],
    },
  ],
  // 主包成员表格
  mainMemberTable: [
    {
      isPrimary: true,
      label: '保存',
      clickName: 'save',
      clickProps: [3],
    },
    {
      isPrimary: true,
      label: '同步',
      clickName: 'syncTeam',
      clickProps: [1],
    },
    {
      isPrimary: false,
      label: '添加',
      clickName: 'add',
      clickProps: [1],
    },
    {
      isPrimary: false,
      label: '移除',
      clickName: 'remove',
      clickProps: [1],
    },
    {
      isPrimary: false,
      label: '导出',
      clickName: 'exportTable',
      clickProps: [1, 'exportUserRewardsInfo'],
    },
    {
      isPrimary: false,
      label: '导入',
      clickName: 'importTable',
      clickProps: [1],
    },
    {
      isPrimary: false,
      label: '变更记录',
      clickName: 'lookData',
      clickProps: [2],
    },
    {
      isPrimary: false,
      label: '替换记录',
      clickName: '_queryRewardsReplaceRecord',
      clickProps: [1],
    },
  ],
  // 配包各部门权重与金额
  packageDepartWeight: [
    {
      isPrimary: true,
      label: '保存',
      clickName: 'save',
      clickProps: [4],
    },
    {
      isPrimary: false,
      label: '导出',
      clickName: 'exportTable',
      clickProps: [3, 'exportDeptInfo'],
    },
    {
      isPrimary: false,
      label: '导入',
      clickName: 'exportTable',
      clickProps: [3],
    },
    {
      isPrimary: false,
      label: '变更记录',
      clickName: 'lookData',
      clickProps: [3],
    },
  ],
  // 配包成员表格
  packageMemberTable: [
    {
      isPrimary: true,
      label: '保存',
      clickName: 'save',
      clickProps: [5],
    },
    {
      isPrimary: true,
      label: '同步',
      clickName: 'syncTeam',
      clickProps: [2],
    },
    {
      isPrimary: false,
      label: '添加',
      clickName: 'add',
      clickProps: [2],
    },
    {
      isPrimary: false,
      label: '移除',
      clickName: 'remove',
      clickProps: [2],
    },
    {
      isPrimary: false,
      label: '导出',
      clickName: 'exportTable',
      clickProps: [2, 'exportUserRewardsInfo'],
    },
    {
      isPrimary: false,
      label: '导入',
      clickName: 'importTable',
      clickProps: [2],
    },
    {
      isPrimary: false,
      label: '变更记录',
      clickName: 'lookData',
      clickProps: [4],
    },
    {
      isPrimary: false,
      label: '替换记录',
      clickName: '_queryRewardsReplaceRecord',
      clickProps: [2],
    },
  ],
};
