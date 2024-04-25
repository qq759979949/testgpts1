// 目标/指标
export const targetColums = [
  {
    title: '指标',
    dataIndex: 'indicator',
  },
  {
    title: '单位',
    dataIndex: 'unit',
  },
  {
    title: '目标值',
    dataIndex: 'targetValue',
  },
  {
    title: '实际值',
    dataIndex: 'actualValue',
  },
  {
    title: '证明材料',
    dataIndex: 'material',
  },
  {
    title: '是否达标',
    dataIndex: 'standard',
  },
];

// 交付物汇总
export const deliverableColums = [
  {
    title: '所属交付阶段',
    dataIndex: 'deliveryPhase',
    filters: true,
  },
  {
    title: '交付物要求',
    dataIndex: 'requirement',
    filters: true,
  },
  {
    title: '实际交付内容',
    dataIndex: 'content',
  },
  {
    title: '责任人',
    dataIndex: 'name',
  },
  {
    title: '签批人',
    dataIndex: 'signer',
  },
  {
    title: '活动名称',
    dataIndex: 'activityName',
    filters: true,
  },
  {
    title: '目标完成时间',
    dataIndex: 'targetCompletionTime',
    filters: true,
  },
  {
    title: '实际完成时间',
    dataIndex: 'actualFinishTime ',
    filters: true,
  },
  {
    title: '交付时间',
    dataIndex: 'leadTime',
    filters: true,
  },
];

// 变更记录
// changeNumber: '变更编码';
// changeType: '变更类型';
// createTime: '创建时间';
// creator: '负责人/创建者';
// description: '变更说明';
// resolvedDate: '解决时间';
// stage: '阶段';
// state: '状态';
export const alterationColunms = [
  {
    title: '序号',
    dataIndex: 'orderIndex',
  },
  {
    title: '变更编码',
    dataIndex: 'changeNumber',
  },
  {
    title: '变更类型',
    dataIndex: 'changeType',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '负责人/创建者',
    dataIndex: 'creator',
  },
  {
    title: '变更说明',
    dataIndex: 'description',
  },
  {
    title: '解决时间',
    dataIndex: 'resolvedDate',
  },
  {
    title: '阶段',
    dataIndex: 'stage',
  },
  {
    title: '状态',
    dataIndex: 'state',
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
    dataIndex: 'operateRealName',
  },
  {
    title: '操作说明',
    label: '操作说明',
    dataIndex: 'changeInfo',
  },
];

// 关联
export const relevanceColums = [
  {
    title: '关联描述',
    dataIndex: 'relativeDesc',
    Width: 100,
  },
  {
    title: '关联数据',
    // dataIndex: 'associatedData',
    dataIndex: 'relativeFile',
    minWidth: 200,
  },
];

// 项目阶段评价
export const evaluateColums = [
  {
    title: '评价维度',
    dataIndex: 'pointName',
    width: 100,
  },
  {
    title: '基础分值',
    dataIndex: 'baseScore',
    width: 100,
  },
  {
    title: '分值区间',
    dataIndex: 'scoreStr',
    width: 100,
  },
  {
    title: '项目阶段完成情况',
    dataIndex: 'pmSelfDesc',
    rules: true,
    required: true,
  },
  {
    title: '评价方式',
    dataIndex: 'methodStr',
    width: 100,
  },
  {
    title: '评价人',
    dataIndex: 'userListStr',
    width: 140,
  },
  {
    title: '评价标准',
    dataIndex: 'pointDesc',
    width: 700,
  },
];
