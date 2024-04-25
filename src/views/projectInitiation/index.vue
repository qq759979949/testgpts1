<!-- 项目立项页面 -->
<template>
  <div class="projectInitiation" v-loading="Data.processLoading">
    <div>
      <el-affix :target="'.info_box2'">
        <div class="tabBox">
          <el-tabs v-model="Data.actived" @tab-click="handleClick">
            <el-tab-pane v-for="item in Data.tabList" :label="item.label" :name="item.id" :key="item.id"></el-tab-pane>
          </el-tabs>
        </div>
      </el-affix>
      <el-button type="primary" @click="allHide(Data.isShowHide)">{{ Data.isShowHide ? '一键收起' : '一键展开' }}</el-button>
    </div>
    <div class="info_box2">
      <div v-for="(item, index) of Data.tabList" :key="index" class="depart" :id="item.id">
        <div class="depart_title">
          <div>
            <i class="iconfont ExpendIcon icon-yihangyige1" @click="item.isExpand = !item.isExpand" v-if="item.isExpand"></i>
            <i class="iconfont ExpendIcon icon-yihangyige" @click="item.isExpand = !item.isExpand" v-if="!item.isExpand"></i>
            <span style="font-weight: bold; margin-left: 10px">{{ item.label }}</span>
          </div>
          <div>
            <el-button type="primary" v-if="item.isShowEditBtn && item.label === '薪酬包'" @click="gotoEdit(item.id)">跳转薪酬包</el-button>
            <el-button type="primary" v-else-if="item.label !== '流程设置'" @click="gotoEdit(item.id)">跳转编辑</el-button>
          </div>
        </div>
        <div class="depart_content" v-show="item.isExpand">
          <div class="section-container" v-if="item.label === '详细信息'">
            <FormDetail ref="form" labelWidth="200px" :formList="Data.infoDatas" v-model:submitData="Data.submitData"></FormDetail>
          </div>
          <div class="section-container" v-if="item.label === '团队'">
            <projectTeam ref="projectTeamComp" :isActionVisible="false" :isShowSearch="true" :isComponents="true"></projectTeam>
          </div>
          <div class="section-container" v-if="item.label === '里程碑计划'" style="margin-top: 10px">
            <steps :stepList="Data.stepList" :active="Data.active"></steps>
          </div>
          <div class="section-container" v-if="item.label === '目标/指标'" style="margin-top: 10px">
            <div class="depart" :id="item.name" v-for="(item, index) in Data.beforeProjectEstablishment" :key="index">
              <div class="title_box">
                <span class="hand_icon" @click="item.switchover = !item.switchover">{{ item.switchover ? '-' : '+' }}</span>
                <span class="title">{{ item.label }}</span>
              </div>
              <div class="content" v-if="item.switchover">
                <newPiTable :columns="item.colunms" :data="item.tableData" :isShowSetting="false" rowKey="index" :pagination="false" :tableLoad="item.tableLoad"></newPiTable>
              </div>
            </div>
          </div>
          <div class="section-container" v-if="item.label === '薪酬包'" style="margin-top: 10px">
            <div class="section-title2">主包成员表格</div>
            <levelTable :columns="Data.mainMemberColumn" :tableData="Data.mainMemberTableData">
              <!-- 成员角色 -->
              <template #userName="scope">
                <p v-if="scope.row.userName" style="text-align: left">{{ scope.row.userName }}</p>
                <p v-if="scope.row.userName" style="text-align: left">{{ scope.row.userRole ? scope.row.userRole : '' }}</p>
              </template>
            </levelTable>
            <div class="section-title2" v-if="Data.projectType === '产品开发类项目'">配包各部门权重与金额</div>
            <levelTable :columns="Data.packageDepartWeightColumn" :tableData="Data.packageDepartWeightTableData" v-if="Data.projectType === '产品开发类项目'">
              <template v-for="(item, index) of Data.templateList2" :key="index" #[item]="scope">
                <span v-if="scope.row[`${item}`] === -1">-</span>
                <span v-else>{{ scope.row[item] }}</span>
              </template>
            </levelTable>
            <div class="section-title2" v-if="Data.projectType === '产品开发类项目'">配包成员表格</div>
            <levelTable :columns="Data.packageMemberColumn" :tableData="Data.packageMemberTableData" v-if="Data.projectType === '产品开发类项目'">
              <template #department="scope">
                <span>{{ scope.row.department }}</span>
              </template>
            </levelTable>
          </div>
          <div class="section-container" v-if="item.label === '流程设置'" style="margin-top: 10px">
            <SelectUser ref="selectUser" :parmasObj="Data.parmasObj" v-model:selectUserData="Data.selectUserData"></SelectUser>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部提交 -->
    <div class="footer">
      <el-button @click="goback">取消</el-button>
      <!-- <el-button type="primary" @click="onSave">保存</el-button> -->
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </div>
</template>

<script setup name="projectInitiation">
import { columnList, targetColumn } from './data.js';
import { getProjectInfoLayout, getProjectMileStonePlan } from '@/api/project';
import FormDetail from '@/components/formLayout/formDetail.vue';
import projectTeam from '@/views/projectTeam/index.vue';
import {
  productColunms, //立项前 技术指标
  qualityColums, // 质量指标
  costColums, //成本指标
  marketColums, //市场指标
  materialIndicatorColums, //物料指标
  patentColums, // 专利
  economicsColums, //立项前-制造技术类项目和信息技术类项目-经济效益
  otherQualityColums, // 立项前-制造技术类项目和信息技术类项目-质量指标
  maunInfomCostColums, // 立项前-制造技术类项目和信息技术类项目-成本指标
  otherColums, // 立项前-制造技术类项目和信息技术类项目-其他指标
} from '../target/tableColunms.js';
import levelTable from './components/levelTable.vue';
import Cookies from 'js-cookie';

const api = window.$api;
const route = useRoute();
const router = useRouter();
const userInfo = JSON.parse(Cookies.get('userInfo'));
const projectTeamComp = ref(''); // 团队组件
const Data = reactive({
  isShowHide: true,
  processLoading: false, // 项目立项的loadding
  selectUserData: [], //流程选择人的数据
  parmasObj: {
    processTemplate: 'PIProjectStartWf',
    oid: sessionStorage.getItem('editOid'),
  }, // 获取流程选人的传参
  tabList: columnList.tabList2,
  actived: 'baseInfo',
  infoDatas: [],
  loading: false,
  formList: [],
  targetColumn: targetColumn, // 目标/指标 表头
  targetTableData: [], // 目标/指标 表格数据
  oid: '', // 项目oid

  mainMemberColumn: [], // 主包成员表头
  packageMemberColumn: [], // 配包成员表头
  packageDepartWeightColumn: [],

  mainMemberTableData: [], // 主包成员表格
  packageMemberTableData: [], // 配包成员表格
  packageDepartWeightTableData: [],

  // 目标指标
  projectType: JSON.parse(sessionStorage.getItem('currentProject')).type,
  beforeProjectEstablishment: [],
  templateList2: [],

  stepList: [],
  active: 3,
});

onMounted(() => {
  Data.oid = JSON.parse(sessionStorage.getItem('currentProject')).oid;
  Data.parmasObj.oid = Data.oid;
});

onActivated(() => {
  getInfoData(); // 详细信息
  getType(); // 获取目标指标
  projectTeamComp.value[0].getProjectTeam(); // 获取最新的团队数据
  _getPhaseNames(); // 主包表头阶段
  _queryProjectStartMemberInfoBuilderData(1); // 主包成员表格
  if (Data.projectType === '产品开发类项目') {
    _queryProjectStartMemberInfoBuilderData(2); // 配包成员表格
    _getSecondPackageWeightAndAmount(); //配包各部门权重与金额
  }
  initFun(); // 项目导航
});

//一键收起
const allHide = (e) => {
  if (e) {
    Data.isShowHide = !e;
    Data.tabList.forEach((e) => {
      e.isExpand = false;
    });
  } else {
    Data.isShowHide = !e;
    Data.tabList.forEach((e) => {
      e.isExpand = true;
    });
  }
};

// 跳转编辑
const gotoEdit = (e) => {
  switch (e) {
    case 'baseInfo': // 基本信息
      router.push({ name: 'updateProject' });
      break;
    case 'team': // 项目团队
      router.push({ name: 'projectTeam' });
      break;
    case 'plan': // 项目计划
      router.push({ name: 'updateProject' });
      break;
    case 'target': // 目标指标
      router.push({ name: 'target' });
      break;
    case 'payPacket': // 薪酬包  主包成员  权重金额  配包成员
      router.push({ name: 'payPacket' });
      break;
    case 'packageDepart': // 权重金额
      router.push({ name: 'payPacket' });
      break;
    case 'packageMemberTable': // 配包成员
      router.push({ name: 'payPacket' });
      break;
  }
};

// 获取配包各部门权重与金额
const _getSecondPackageWeightAndAmount = () => {
  api.payPacketApi.getSecondPackageWeightAndAmount({ oid: Data.oid }).then((res) => {
    if (res.success) {
      Data.packageDepartWeightTableData = tableDataChange(res.data);
    }
  });
};

// 获取主包、配包表格数据
const _queryProjectStartMemberInfoBuilderData = (type) => {
  api.projectInitiationApi.queryProjectStartMemberInfoBuilderData({ oid: Data.oid, primary: type }).then((res) => {
    if (res.success) {
      if (type === 1) {
        Data.mainMemberTableData = tableDataChange(res.data); // 主包成员表格
      } else if (type === 2) {
        Data.packageMemberTableData = tableDataChange(res.data); // 配包成员表格
      }
    }
  });
};

// 表格数据格式修改
const tableDataChange = (data) => {
  let arr = [];
  if (data.length > 0) {
    data.forEach((e) => {
      let item = {};
      for (var key in e) {
        if (e[key].value || e[key].value === 0) {
          item[key] = e[key].value;
        } else {
          item[key] = e[key];
        }
      }
      arr.push(item);
    });
    return arr;
  } else {
    return [];
  }
};

// 获取详细信息
const getInfoData = () => {
  Data.loading = true;
  let obj = {
    serviceKey: 'com.pisx.pmgt.project.PIProject',
    oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  };
  getProjectInfoLayout(obj).then((res) => {
    if (res.success) {
      Data.loading = false;
      let datas = res.data.map((item) => {
        item.items = item.items.map((i) => {
          i.label = i.label + '：';
          i.value = i.displayValue;
          i.filedType = 'DISPLAY';
          i.required = false;
          if (i.name === 'ObjectivesAndDeliverables') {
            i.displayValue = i.displayValue.map((it, index) => {
              it.number = index + 1;
              return it;
            });
          }
          return i;
        });
        return item;
      });
      Data.infoDatas = window.$formatData(datas, Data.submitData);
      Data.infoDatas.forEach((item) => {
        item.list = item.list.map((el) => {
          el.maxSpan = el.length;
          return el;
        });
      });
    } else {
      Data.formList = [];
      window.$message.error(res.message);
    }
  });
};

// 查询阶段名称   配置表头
const _getPhaseNames = () => {
  api.payPacketApi.getPhaseNames({ oid: Data.oid }).then((res) => {
    if (res.success) {
      let columnList = {
        // 主包成员表格
        mainMemberColumn: [
          {
            label: '',
            dataIndex: '',
            children: [
              {
                label: '成员 (角色)',
                dataIndex: 'userName',
                width: 140,
              },
            ],
          },
          {
            label: '',
            dataIndex: '',
            children: [
              {
                label: '账号',
                dataIndex: 'centerUser',
                width: 120,
              },
              {
                label: '分工',
                dataIndex: 'memberLabor',
                width: 120,
              },
              {
                label: '部门',
                dataIndex: 'pdDepartment',
                width: 120,
              },
              {
                label: '成员属性',
                dataIndex: 'memberProp',
                width: 120,
              },
            ],
          },
        ],
        // 配包各部门权重与金额 表头
        packageDepartWeightColumn: [
          {
            label: '',
            dataIndex: '',
            children: [
              {
                label: '部门',
                dataIndex: 'department',
                width: 140,
              },
            ],
          },
        ],
        // 配包成员表格
        packageMemberColumn: [
          {
            label: '',
            dataIndex: '',
            children: [
              {
                label: '成员',
                dataIndex: 'userName',
                width: 80,
              },
              {
                label: '部门',
                dataIndex: 'department',
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
                dataIndex: 'centerUser',
                width: 120,
              },
              {
                label: '分工',
                dataIndex: 'memberLabor',
                width: 120,
              },
              {
                label: '成员属性',
                dataIndex: 'memberProp',
                width: 120,
              },
            ],
          },
        ],
      };
      res.data.forEach((e, index) => {
        Data.templateList2.push(`${e.label}Percent`); // 每个阶段的权重
        // 主包成员 表头
        columnList.mainMemberColumn.push({
          label: e.name,
          dataIndex: e.label,
          children: [
            {
              label: '权重 (%)',
              dataIndex: `phase${index + 1}Percent`,
            },
            // {
            //   label: '个人打分',
            //   dataIndex: `phase${index + 1}Score`,
            // },
            // {
            //   label: '个人加权得分',
            //   dataIndex: `phase${index + 1}WeightedScore`,
            //   width: 110,
            // },
            // {
            //   label: '个人薪酬 (元)',
            //   dataIndex: `phase${index + 1}Reward`,
            //   sortable: true,
            //   width: 140,
            // },
          ],
        });
        // 配包各部门权重与金额 表头
        columnList.packageDepartWeightColumn.push({
          label: e.name,
          dataIndex: e.label,
          children: [
            {
              label: '阶段占比 (%)',
              dataIndex: `phase${index + 1}Percent`,
            },
            // {
            //   label: '配包金额 (元)',
            //   dataIndex: `phase${index + 1}Reward`,
            // },
          ],
        });
        // 配包成员  表头
        columnList.packageMemberColumn.push({
          label: e.name,
          dataIndex: e.label,
          children: [
            {
              label: '权重 (%)',
              dataIndex: `phase${index + 1}Percent`,
            },
            // {
            //   label: '个人打分',
            //   dataIndex: `phase${index + 1}Score`,
            // },
            // {
            //   label: '个人加权得分',
            //   dataIndex: `phase${index + 1}WeightedScore`,
            //   width: 110,
            // },
            // {
            //   label: '个人薪酬 (元)',
            //   dataIndex: `phase${index + 1}Reward`,
            //   sortable: true,
            //   width: 140,
            // },
          ],
        });
      });
      Data.mainMemberColumn = columnList.mainMemberColumn;
      Data.packageDepartWeightColumn = columnList.packageDepartWeightColumn;
      Data.packageMemberColumn = columnList.packageMemberColumn;
    }
  });
};

const selectUser = ref(null);
/**流程提交 */
const onSubmit = () => {
  selectUser.value[0].validate(async (valid, fields) => {
    if (valid) {
      Data.processLoading = true;
      let parmas = {
        oid: Data.oid,
        processTemplate: 'PIProjectStartWf',
        processUsers: JSON.stringify(Data.selectUserData),
        actualUser: userInfo.username,
      };
      api.commonApi.startWfProcess(parmas).then((res) => {
        if (res.success) {
          window.$message.success('启动成功！');
          goback();
        } else {
          window.$message.error(res.message);
        }
        Data.processLoading = false;
      });
    } else {
      selectUser.value[0].checkForm(valid, fields);
    }
  });
};

/**取消 */
const goback = () => {
  router.push({ name: 'projectDetail' });
  window.$navTagStore.removeTag(route, router);
  window.$navTagStore.removeCacheTag(route.name);
};

// 获取目标/指标类型
const getType = async () => {
  if (Data.projectType === '产品开发类项目') {
    // 立项前
    Data.beforeProjectEstablishment = [
      {
        name: 'technical_index',
        label: '技术指标',
        ref: 'technical',
        switchover: true,
        colunms: productColunms,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'quality_index',
        label: '质量指标',
        ref: 'quality',
        switchover: true,
        colunms: qualityColums,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'cost_index',
        label: '成本指标',
        ref: 'cost',
        switchover: true,
        colunms: costColums,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'market',
        label: '市场指标',
        enName: 'market',
        ref: 'market',
        switchover: true,
        colunms: marketColums,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'material_specification',
        label: '物料指标',
        enName: 'material_specification',
        ref: 'material',
        switchover: true,
        colunms: materialIndicatorColums,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'patent',
        label: '专利指标',
        enName: 'patent',
        ref: 'patent',
        switchover: true,
        colunms: patentColums,
        tableData: [],
        tableLoad: false,
      },
    ];
  } else {
    // 立项前
    Data.beforeProjectEstablishment = [
      {
        name: 'economic',
        label: '经济效益指标',
        enName: 'economic benefit index',
        ref: 'economic',
        switchover: true,
        colunms: economicsColums,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'quality_index',
        label: '质量指标',
        ref: 'quality',
        switchover: true,
        colunms: otherQualityColums,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'cost_index',
        label: '成本指标',
        ref: 'cost',
        switchover: true,
        colunms: maunInfomCostColums,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'others_index',
        label: '其他指标',
        ref: 'othersIndicator',
        switchover: true,
        colunms: otherColums,
        tableData: [],
        tableLoad: false,
      },
    ];
  }
  Data.beforeProjectEstablishment.forEach(async (e) => {
    e.tableLoad = true;
    await api.targetApi.queryTargetIndicators({ oid: Data.oid, targetIndicatorsType: e.label }).then((res) => {
      if (res.success) {
        e.tableData = res.data;
        e.tableLoad = false;
      } else {
        window.$message.error(res.message);
        e.tableLoad = false;
      }
    });
  });
};

// 临时保存流程的选人
const onSave = () => {
  let parmas = {
    primaryBusinessObject: Data.oid,
    processTemplateName: 'PIProjectStartWf',
    processUser: JSON.stringify(Data.selectUserData),
    operationUser: userInfo.username,
  };
  api.commonApi.saveOrUpdateProcessorWorkflow(parmas).then((res) => {
    if (res.success) {
      window.$message.success('保存成功!');
    }
  });
};

// 项目导航
const initFun = () => {
  if (Data.projectType === '产品开发类项目' || Data.projectType === '信息技术类项目' || Data.projectType === '制造技术类项目') {
    getProjectMileStonePlan({ oid: Data.oid }).then((res) => {
      if (res.success) {
        const newArr = res.data.filter((item) => {
          return item.actEndValue;
        });
        Data.active = newArr.length;
        Data.stepList = res.data.map((item, index) => {
          if (index === Data.active) {
            item.status = '进行中';
          } else if (index < Data.active) {
            item.status = '已完成';
          } else if (index > Data.active) {
            item.status = '未开始';
          }
          item.number = index + 1;
          return item;
        });
      } else {
        window.$message.error(res.message);
      }
    });
  }
};

const handleClick = (tab, event) => {
  const id = tab.props.name;
  document.querySelector('#' + id).scrollIntoView({
    behavior: 'smooth', // 定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"
    // block: 'center',
  });
};
</script>

<style lang="less" scoped>
@import '@/assets/commonCss/common.less';
.projectInitiation {
  // height: calc(100vh - 120px);
  overflow-y: scroll;
  position: relative;
  // background-color: #fff;
  padding-bottom: 30px;
  margin-bottom: 20px;
  padding-left: 20px;
  padding-bottom: 8px;
  .anthor_css {
    padding-right: 16px;
  }
  .tabBox {
    background-color: #fff;
  }
  :deep(.anthor .el-tabs__header) {
    padding: 0;
  }
  .info_box2 {
    display: block;
    height: calc(100vh - 230px);
    position: relative;
    overflow-y: auto;
    padding-right: 8px;
    .depart {
      margin-bottom: 20px;
      .title {
        font-size: 18px;
        font-family: 'PingFangSC, PingFang SC';
        font-weight: 500;
        color: #333333;
        margin-bottom: 8px;
      }
    }
  }
  :deep(.el-tabs__nav-scroll) {
    padding-left: 20px;
  }
  .depart {
    background-color: #fff;
    margin-bottom: 10px;
    .depart_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #dddddd;
      padding: 0 16px;
    }
    .hand_icon {
      width: 14px;
      height: 14px;
      display: flex;
      border: 1px solid rgba(0, 0, 0, 0.06);
      color: #333333;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-right: 10px;
      &:hover {
        border: 1px solid #2664f6;
      }
    }
    .depart_content {
      padding: 20px;
    }
    .title_box {
      display: flex;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #dddddd;
      padding: 0 16px;
      .hand_icon {
        width: 14px;
        height: 14px;
        display: flex;
        border: 1px solid rgba(0, 0, 0, 0.06);
        color: #333333;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-right: 10px;
        &:hover {
          border: 1px solid #2664f6;
        }
      }
      .title {
        font-size: 16px;
        font-family: 'PingFangSC, PingFang SC';
        font-weight: 500;
        color: #333333;
      }
    }
  }
  .footer {
    z-index: 99;
    position: fixed;
    width: calc(100vw - 230px);
    bottom: 1px;
    background-color: #fff;
    padding: 10px 20px;
    display: flex;
    justify-content: end;
    box-shadow: 0px -1px 5px 0 rgba(0, 0, 0, 0.08);
  }

  // 详细信息
  .section-container {
    // margin-bottom: 40px;
    padding-left: 20px;
    .section-title {
      font-size: var(--el-font-size-medium);
      font-weight: 600;
      height: 24px;
      line-height: 24px;
      margin-bottom: 12px;
    }
    .section-title2 {
      font-size: var(--el-font-size-medium);
      font-weight: 600;
      height: 14px;
      line-height: 14px;
      margin: 12px 0;
    }

    .section-main {
      padding-top: 12px;
      .row-label {
        display: inline-block;
        width: 100px;
        vertical-align: top;
      }
      .row-content {
        display: inline-block;
        height: 80px;
        width: 800px;
        border-radius: 4px;
        border: 1px solid #ccc;
        padding: 4px 6px;
        .tag-item {
          margin-right: 6px;
          width: 2;
          margin-bottom: 4px;
        }
      }
    }
  }
  :deep(.page_common) {
    padding: 0 1px;
  }
}

:deep(.page_common) {
  padding: 0 0;
  padding-left: 0 !important;
}
</style>
