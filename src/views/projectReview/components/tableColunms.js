// 技术指标（性能门）
export const targetColunms = [
  { title: '指标名称', dataIndex: 'indicatorName' },
  { title: '单位', dataIndex: 'unit', width: 70 },
  { title: '权重', dataIndex: 'weight', width: 70 },
  { title: '内部竞品目标值', dataIndex: 'internalCompetitive' },
  { title: '外部竞品目标值', dataIndex: 'ExternalCompetitive' },
  { title: '本项目目标值', dataIndex: 'targetValue' },
  { title: '验收阶段', dataIndex: 'acceptancePhase' },
  { title: '备注', dataIndex: 'remark', width: 300 },
  {
    title: '详设转样机阶段',
    dataIndex: 'prototypeStage',
    children: [
      { title: '实际值', dataIndex: 'actualValue', width: 100 },
      { title: '是否达标', dataIndex: 'standard', width: 110 },
      { title: '证明文件', dataIndex: 'documentaryEvidence', width: 120 },
    ],
  },
  {
    title: '样机转小批阶段',
    dataIndex: 'batchStage',
    children: [
      { title: '实际值', dataIndex: 'batchlValue', width: 100 },
      { title: '是否达标', dataIndex: 'batchstandard', width: 110 },
      { title: '证明文件', dataIndex: 'batchEvidence', width: 120 },
    ],
  },
  { title: '实际值', dataIndex: 'realValue' },
];

// 质量指标（质量门）
export const qualityColunms = [
  { title: '公式', dataIndex: 'formula' },
  { title: '单位', dataIndex: 'unit' },
  { title: '验收阶段', dataIndex: 'acceptancePhase' },
  { title: '备注', dataIndex: 'remark' },
  {
    title: '详设转样机阶段',
    dataIndex: 'prototypeStage',
    children: [
      { title: '标准值', dataIndex: 'qualityStandValue' },
      { title: '有效值', dataIndex: 'qualityEffective' },
      { title: '全部', dataIndex: 'qualityAll' },
      { title: '达成率', dataIndex: 'yieldRate' },
      { title: '是否达标', dataIndex: 'qualityReach' },
    ],
  },
  {
    title: '样机转小批阶段',
    dataIndex: 'batchStage',
    children: [
      { title: '标准值', dataIndex: 'batchStageValue' },
      { title: '有效值', dataIndex: 'batchStageEffective' },
      { title: '全部', dataIndex: 'batchStageAll' },
      { title: '达成率', dataIndex: 'batchStageRate' },
      { title: '是否达标', dataIndex: 'batchStageReach' },
    ],
  },
];

// 验证时长
export const durationColunms = [
  { title: '公式', dataIndex: 'formula' },
  { title: '单位', dataIndex: 'unit' },
  { title: '验收阶段', dataIndex: 'acceptancePhase' },
  { title: '备注', dataIndex: 'remark' },
  {
    title: '详设转样机阶段',
    dataIndex: 'prototypeStage',
    children: [
      { title: '标准值', dataIndex: 'standardValue' },
      { title: '有效值', dataIndex: '' },
      { title: '全部', dataIndex: '' },
      { title: '达成率', dataIndex: '' },
      { title: '是否达标', dataIndex: '' },
    ],
  },
  {
    title: '样机转小批阶段',
    dataIndex: 'batchStage',
    children: [
      { title: '标准值', dataIndex: 'standardValue' },
      { title: '有效值', dataIndex: '' },
      { title: '全部', dataIndex: '' },
      { title: '达成率', dataIndex: '' },
      { title: '是否达标', dataIndex: '' },
    ],
  },
];

// 内部问题关闭率
export const interiorColunms = [
  { title: '公式', dataIndex: 'formula' },
  { title: '单位', dataIndex: 'unit' },
  { title: '验收阶段', dataIndex: 'acceptancePhase' },
  { title: '问题清单', dataIndex: 'remark' },
  {
    title: '详设转样机阶段',
    dataIndex: 'prototypeStage',
    children: [
      { title: '关闭数', dataIndex: '' },
      { title: '总数', dataIndex: '' },
      { title: '关闭率', dataIndex: '' },
      { title: '是否达标', dataIndex: '' },
    ],
  },
  {
    title: '小批转批量验证阶段',
    dataIndex: 'batchStage',
    children: [
      { title: '关闭数', dataIndex: '' },
      { title: '总数', dataIndex: '' },
      { title: '关闭率', dataIndex: '' },
      { title: '是否达标', dataIndex: '' },
    ],
  },
];

// 外部问题关闭率
export const externalColunms = [
  { title: '公式', dataIndex: 'formula' },
  { title: '单位', dataIndex: 'unit' },
  { title: '验收阶段', dataIndex: 'acceptancePhase' },
  { title: '问题清单', dataIndex: 'remark' },
  {
    title: '详设转样机阶段',
    dataIndex: 'prototypeStage',
    children: [
      { title: '关闭数', dataIndex: '' },
      { title: '总数', dataIndex: '' },
      { title: '关闭率', dataIndex: '' },
      { title: '是否达标', dataIndex: '' },
    ],
  },
  {
    title: '小批转批量验证阶段',
    dataIndex: 'batchStage',
    children: [
      { title: '关闭数', dataIndex: '' },
      { title: '总数', dataIndex: '' },
      { title: '关闭率', dataIndex: '' },
      { title: '是否达标', dataIndex: '' },
    ],
  },
];

// 1年内故障率
export const failureColunms = [
  { title: '公式', dataIndex: 'formula' },
  { title: '单位', dataIndex: 'unit' },
  { title: '验收阶段', dataIndex: 'acceptancePhase' },
  { title: '故障清单', dataIndex: 'faultList' },
  {
    title: '小批转批量验证阶段',
    dataIndex: 'prototypeStage',
    children: [
      { title: '故障项次', dataIndex: '' },
      { title: '销售总数', dataIndex: '' },
      { title: '故障率', dataIndex: '' },
      { title: '是否达标', dataIndex: '' },
    ],
  },
];

// 质量损失成本
export const lostCostColunms = [
  { title: '公式', dataIndex: 'formula' },
  { title: '单位', dataIndex: 'unit' },
  { title: '验收阶段', dataIndex: 'acceptancePhase' },
  { title: '备注', dataIndex: 'remark' },
  {
    title: '小批转批量验证阶段',
    dataIndex: 'prototypeStage',
    children: [
      { title: '损失成本', dataIndex: '' },
      { title: '是否达标', dataIndex: '' },
    ],
  },
];

// 成本指标（成本门）
export const indicatorColunms = [
  { title: '指标名称', dataIndex: 'indicatorName' },
  { title: '单位', dataIndex: 'unit' },
  { title: '内部竞品目标值', dataIndex: 'internalCompetitive' },
  { title: '外部竞品目标值', dataIndex: 'externalCompetitive' },
  { title: '本项目目标值', dataIndex: 'targetValue' },
  { title: '验收阶段', dataIndex: 'acceptancePhase' },
  { title: '备注', dataIndex: 'remark' },
  {
    title: '详设转样机阶段',
    dataIndex: 'prototypeStage',
    children: [
      { title: '实际值', dataIndex: '' },
      { title: '是否达标', dataIndex: '' },
      { title: '证明文件', dataIndex: '' },
    ],
  },
  {
    title: '样机转小批阶段',
    dataIndex: 'batchStage',
    children: [
      { title: '实际值', dataIndex: '' },
      { title: '是否达标', dataIndex: '' },
      { title: '证明文件', dataIndex: '' },
    ],
  },
];

// 市场指标
export const marketColunms = [
  { title: '指标名称', dataIndex: 'indicatorName' },
  { title: '单位', dataIndex: 'unit' },
  { title: '内部竞品目标值', dataIndex: 'internalCompetitive' },
  { title: '外部竞品目标值', dataIndex: 'externalCompetitive' },
  { title: '本项目目标值', dataIndex: 'targetValue' },
  { title: '验收阶段', dataIndex: 'acceptancePhase' },
  { title: '备注', dataIndex: 'remark' },
  {
    title: '详设转样机阶段',
    dataIndex: 'prototypeStage',
    children: [
      { title: '实际值', dataIndex: '' },
      { title: '是否达标', dataIndex: '' },
      { title: '证明文件', dataIndex: '' },
    ],
  },
  {
    title: '样机转小批阶段',
    dataIndex: 'batchStage',
    children: [
      { title: '实际值', dataIndex: '' },
      { title: '是否达标', dataIndex: '' },
      { title: '证明文件', dataIndex: '' },
    ],
  },
];

// 物料指标
export const materialColunms = [
  { title: '指标名称', dataIndex: 'indicatorName' },
  { title: '单位', dataIndex: 'unit' },
  { title: '内部竞品目标值', dataIndex: 'internalCompetitive' },
  { title: '外部竞品目标值', dataIndex: 'externalCompetitive' },
  { title: '本项目目标值', dataIndex: 'targetValue' },
  { title: '验收阶段', dataIndex: 'acceptancePhase' },
  { title: '备注', dataIndex: 'remark' },
  {
    title: '详设转样机阶段',
    dataIndex: 'prototypeStage',
    children: [
      { title: '实际值', dataIndex: '' },
      { title: '是否达标', dataIndex: '' },
      { title: '证明文件', dataIndex: '' },
    ],
  },
  {
    title: '样机转小批阶段',
    dataIndex: 'batchStage',
    children: [
      { title: '实际值', dataIndex: '' },
      { title: '是否达标', dataIndex: '' },
      { title: '证明文件', dataIndex: '' },
    ],
  },
];

// 专利
export const patentColunms = [
  { title: '指标名称', dataIndex: 'indicatorName' },
  { title: '单位', dataIndex: 'unit' },
  { title: '本项目目标值', dataIndex: 'targetValue' },
  { title: '备注', dataIndex: 'remark' },
  { title: '实际值', dataIndex: 'actualValue' },
  { title: '证明文件', dataIndex: 'documentaryEvidence' },
];

// 自检人设置
export const selfCheckerColunms = [
  { title: '自检人', dataIndex: 'selfCheck', width: 120, fixed: true },
  { title: '交付物说明', dataIndex: 'deliverableDec', width: 500, fixed: true },
  { title: '自检要素', dataIndex: 'elementContext', width: 350, fixed: true },
  { title: '验收标准', dataIndex: 'acceptanceStandard', width: 420 },
  { title: '等级', dataIndex: 'level', width: 80 },
  { title: '是否可裁剪', dataIndex: 'canCut', width: 220 },
];

// 自检表
export const selfStageColums = [
  { title: '自检人', dataIndex: 'selfCheck_CN', width: 120, fixed: true },
  { title: '自检结果', dataIndex: 'elementResult', width: 120, fixed: true, required: true },
  { title: '自检结果说明(必填)', dataIndex: 'elementResultDesc', width: 400, fixed: true, required: true },
  { title: '交付物说明', dataIndex: 'deliverableDec', width: 430 },
  { title: '交付物结果', dataIndex: 'fileBeanList', width: 150, required: true },
  { title: '自检要素', dataIndex: 'elementContext', width: 350 },
  { title: '验收标准', dataIndex: 'acceptanceStandard', width: 400 },
  { title: '等级', dataIndex: 'level', width: 80 },
  { title: '是否可裁剪', dataIndex: 'canCut', width: 160 },
];

// 上传
export const uploadColunms = [
  { title: '名称', dataIndex: 'name' },
  { title: '文件大小', dataIndex: 'size' },
  { title: '创建者', dataIndex: 'creator' },
  { title: '修改时间', dataIndex: 'updateTime' },
];

// 交付物汇总
export const deliverableColunms = [
  { title: '序号', dataIndex: 'index', width: 55 },
  { title: '交付物要求', dataIndex: 'deliverableName' },
  { title: '实际交付内容', dataIndex: 'temppath' },
  { title: '自检人', dataIndex: 'creator' },
  { title: '交付时间', dataIndex: 'updateTime' },
  { title: '修改时间', dataIndex: 'updateTime', filters: 'date' },
];
