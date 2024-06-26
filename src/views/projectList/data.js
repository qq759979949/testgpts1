export let data = {
  success: true,
  data: [
    {
      groupName: '',
      items: [
        {
          label: '项目类别',
          name: 'type',
          row: 0,
          col: 0,
          value: '',
          dataType: 'java.lang.String',
          required: true,
          single: true,
          filedType: 'SELECT',
          displayValue: '',
          options: [{ label: '软件开发项目', value: '1' }],
        },
        {
          label: '名称',
          name: 'mc',
          row: 1,
          col: 0,
          value: '',
          dataType: 'java.lang.String',
          required: true,
          single: true,
          filedType: 'INPUT',
          displayValue: '',
        },
        {
          label: '简称',
          name: 'jc',
          row: 1,
          col: 1,
          value: '',
          dataType: 'java.lang.String',
          required: true,
          single: true,
          filedType: 'INPUT',
          displayValue: '',
        },
        {
          label: '项目模板',
          name: 'xmmb',
          row: 2,
          col: 0,
          value: '',
          dataType: 'java.lang.String',
          required: true,
          single: true,
          filedType: 'SELECT',
          displayValue: '',
          options: [{ label: '软件开发项目', value: '1' }],
        },
        {
          label: '所属组织',
          name: 'sszz',
          row: 2,
          col: 1,
          value: '',
          dataType: 'java.lang.String',
          required: true,
          single: true,
          filedType: 'SELECT',
          displayValue: '',
          options: [{ label: '软件开发项目', value: '1' }],
        },
        {
          label: '项目小类',
          name: 'xmxl',
          row: 3,
          col: 0,
          value: '',
          dataType: 'java.lang.String',
          required: true,
          single: true,
          filedType: 'SELECT',
          displayValue: '',
          options: [{ label: '软件开发项目', value: '1' }],
        },
        {
          label: '项目预算（万元）',
          name: 'xmys',
          row: 3,
          col: 1,
          value: '',
          dataType: 'java.lang.Long',
          required: false,
          single: true,
          filedType: 'INPUT',
          displayValue: '',
        },
        {
          label: '项目经理',
          name: 'xmjl',
          row: 4,
          col: 0,
          value: '',
          dataType: 'java.lang.String',
          required: false,
          single: true,
          filedType: 'INPUT',
          displayValue: '',
        },
        {
          label: '重要等级',
          name: 'xmys',
          row: 4,
          col: 1,
          value: '',
          dataType: 'java.lang.String',
          required: true,
          single: true,
          filedType: 'SELECT',
          displayValue: '',
          options: [{ label: '软件开发项目', value: '1' }],
        },
        {
          label: '开展方式',
          name: 'kzfs',
          row: 5,
          col: 0,
          value: '',
          dataType: 'java.lang.String',
          required: true,
          single: true,
          filedType: 'SELECT',
          displayValue: '',
          options: [{ label: '软件开发项目', value: '1' }],
        },
        {
          label: '内部订单号',
          name: 'nbddh',
          row: 5,
          col: 1,
          value: '',
          dataType: 'java.lang.String',
          required: false,
          single: true,
          filedType: 'INPUT',
          displayValue: '',
        },
        {
          label: '说明',
          name: 'sm',
          row: 6,
          col: 0,
          value: '',
          dataType: 'java.lang.String',
          required: false,
          single: true,
          filedType: 'INPUT',
          displayValue: '',
        },
        {
          label: '公司代码',
          name: 'gsdm',
          row: 7,
          col: 0,
          value: '',
          dataType: 'java.lang.String',
          required: true,
          single: true,
          filedType: 'SELECT',
          displayValue: '',
          options: [{ label: '软件开发项目', value: '1' }],
        },
        {
          label: '工厂代码',
          name: 'gcdm',
          row: 7,
          col: 1,
          value: '',
          dataType: 'java.lang.String',
          required: true,
          single: true,
          filedType: 'SELECT',
          displayValue: '',
          options: [{ label: '软件开发项目', value: '1' }],
        },
        {
          label: '利润中心编号',
          name: 'lrzxbh',
          row: 8,
          col: 0,
          value: '',
          dataType: 'java.lang.String',
          required: true,
          single: true,
          filedType: 'SELECT',
          displayValue: '',
          options: [{ label: '软件开发项目', value: '1' }],
        },
        {
          label: '目标开始时间',
          name: 'jhkssj',
          row: 9,
          col: 0,
          value: '',
          dataType: 'java.lang.String',
          required: true,
          single: true,
          filedType: 'DATE',
          displayValue: '',
        },
        {
          label: '目标完成时间',
          name: 'jhwcsj',
          row: 9,
          col: 1,
          value: '',
          dataType: 'java.lang.String',
          required: true,
          single: true,
          filedType: 'DATE',
          displayValue: '',
        },
        {
          label: '是否规划内项目',
          name: 'sfghnxm',
          row: 10,
          col: 0,
          value: '',
          dataType: 'java.lang.String',
          required: true,
          single: true,
          filedType: 'RADIO',
          displayValue: '',
          options: [
            { label: '否', value: 0 },
            { label: '是', value: 1 },
          ],
        },
      ],
      objType: 'ext.gwc.pim.pbi.model.product.PBIProductCatalogue',
    },
  ],
};

// 单项目首页 所有带权限的列表，不可随意改变，要与中台权限一致
export const permissionList = [
  {
    label: '删除项目',
    value: '/plmProject/dp',
  },
  {
    label: '项目立项',
    value: '/plmProject/Initiation',
  },
  {
    label: '项目定级',
    value: '/plmProject/Grading',
  },
  {
    label: '编辑项目',
    value: '/plmProject/epd',
  },
  {
    label: '设置状态',
    value: '/plmUnify/state',
  },
  {
    label: '创建评审',
    value: '/plmProject/er',
  },
  {
    label: '创建变更',
    value: '/plmProject/EditPC',
  },
  {
    label: '创建团队',
    value: '/plmProject/EditPTeam',
  },
  {
    label: '更新进度',
    value: '/plmProject/UP',
  },
  {
    label: '交付物汇总',
    value: '/plmProject/UP',
  },
];
