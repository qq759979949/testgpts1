<template>
  <div class="check_process" v-loading="Data.processLoading">
    <el-affix position="top" :offset="100">
      <div class="top_area">
        <div class="base-title">
          <div class="left_box">
            <span>{{ Data.baseInform.tempName }}</span>
            <el-button type="primary" plain @click="handeProjectDetail">项目详情</el-button>
          </div>
        </div>
        <!-- <div class="select_radio">
          <span class="title">选择评价模版：</span>
          <div class="radio_box">{{ Data.selectTemplate }}</div>
        </div> -->
        <div class="tab_box">
          <el-tabs v-model="Data.tabValue" @tab-click="handleTabClick">
            <el-tab-pane :label="$intl('Basic information').d('基本信息')" name="base_info"></el-tab-pane>
            <el-tab-pane :label="$intl('Project Phase Evaluation').d('项目阶段评价')" name="phase_evaluation"></el-tab-pane>
            <el-tab-pane v-if="processJuge" :label="$intl('Main package members').d('主包成员表格')" name="main_package"></el-tab-pane>
            <el-tab-pane v-if="processJuge && Data.projectType === '产品开发类项目'" :label="$intl('Package members').d('配包成员表格')" name="sub_package"></el-tab-pane>
            <el-tab-pane :label="$intl('Association').d('关联')" name="association"></el-tab-pane>
            <el-tab-pane :label="$intl('Process settings').d('流程处理')" name="process_settings"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-affix>
    <div class="bot_area">
      <div class="depart" id="base_info">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.baseInfoVisable = !Data.fold.baseInfoVisable">{{ Data.fold.baseInfoVisable ? '-' : '+' }}</span>
          <span class="title">基础信息</span>
        </div>
        <div class="area-content" v-if="Data.fold.baseInfoVisable">
          <!-- <p class="base-title">{{ Data.baseInform.tempName }}</p> -->
          <div>
            <!-- <div class="base">
              <span class="base-title-left">模版名称：</span>
              <span>{{ Data.selectTemplate }}</span>
            </div> -->
            <div class="statement">
              <span class="base-title-left">评价说明：</span>
              <ul style="list-style-type: none; padding: 0; margin: 0">
                <li class="base-item" v-for="(item, index) in Data.baseInform.contentList" :key="index">{{ item ? item : '-' }}</li>
              </ul>
            </div>
            <!-- <div class="base">
              <span class="base-title-left">开启条件：</span>
              <span>-</span>
            </div>
            <div class="score">
              <span class="score-title-left">得分：</span>
              <span>{{ Data.baseInform.evalScore }}</span>
            </div> -->
          </div>
        </div>
      </div>
      <div class="depart" id="phase_evaluation">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.milestoneVisable = !Data.fold.milestoneVisable">{{ Data.fold.milestoneVisable ? '-' : '+' }}</span>
          <span class="title">项目阶段评价</span>
        </div>
        <div class="area-content" v-if="Data.fold.milestoneVisable && runData.value === '校对'">
          <NewPiTable
            :columns="evaluateColums"
            :data="Data.evaluateTableData"
            :selectable="false"
            rowKey="oid"
            :pagination="false"
            :isShowSetting="false"
            :tableLoad="Data.tableLoad1"
          >
            <!-- <template #pmSelfDesc="scope">
                <el-input v-model="scope.row.pmSelfDesc" placeholder="请输入" type="textarea">{{ scope.row.pmSelfDesc }}</el-input>
              </template> -->
          </NewPiTable>
        </div>
        <div class="area-content" v-else-if="Data.fold.milestoneVisable && runData.value !== '校对'">
          <phaseEvaluation
            ref="evaluationElement"
            :workItemOid="route.query.oid"
            :phaseData="Data.evaluateTableData"
            v-model:scoreResultData="scoreResultData"
            v-model:scoreFileData="scoreFileData"
          ></phaseEvaluation>
        </div>
      </div>

      <!-- 项目成员打分 -->
      <projectPartScoring class="scorStyle" v-if="processJuge" :detailProjectType="Data.projectType" :detailOid="Data.projectOid" :phaseObjData="phaseObj"></projectPartScoring>

      <div class="depart" id="association">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.productVisable = !Data.fold.productVisable">{{ Data.fold.productVisable ? '-' : '+' }}</span>
          <span class="title">关联</span>
        </div>
        <div class="area-content" v-if="Data.fold.productVisable">
          <NewPiTable
            :columns="relevanceColums"
            :data="Data.relevanceTabelData"
            :selectable="false"
            rowKey="oid"
            :pagination="false"
            :isShowSetting="false"
            :tableLoad="Data.tableLoad"
          >
            <template #relativeFile="scope">
              <el-link type="primary" :underline="true" @click="downFile(scope.row)">
                {{ scope.row.relativeFile }}
              </el-link>
            </template>
          </NewPiTable>
        </div>
      </div>
      <div class="depart" id="process_settings">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.workflowVisable = !Data.fold.workflowVisable">{{ Data.fold.workflowVisable ? '-' : '+' }}</span>
          <span class="title">流程处理</span>
        </div>
        <ProcessRecord v-model:exposeStepArr="exposeStepArr" :oid="route.query.oid"></ProcessRecord>
        <!-- <ProcessSubmit :oid="route.query.workitemOID" :processOID="route.query.processOID" :isTask="false" @processSubmit="submitFun"></ProcessSubmit> -->
      </div>
    </div>
  </div>
  <!-- 项目详情 -->
  <el-drawer v-model="Data.projectVisable" class="drawerSelf" size="60vw">
    <template #header>
      <h4>项目详情</h4>
    </template>
    <template #default>
      <projectDetail :phaseObjData="phaseObj"></projectDetail>
    </template>
  </el-drawer>
</template>

<script setup name="checkEvaluate">
import { useCommonHandler } from '@/hooks';
import { evaluateColums, relevanceColums } from './modules/tableColumns';
import phaseEvaluation from './modules/phaseEvaluation.vue';
import projectPartScoring from './modules/projectPartScoring.vue';
import projectDetail from './modules/projectDetail.vue';
const route = useRoute();
const router = useRouter();
const Data = reactive({
  processLoading: false,
  selectTemplate: '',
  evaluationOid: route.query.oid && route.query.oid.split(':')[2],
  projectOid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
  projectType: JSON.parse(sessionStorage.getItem('currentProject')).type,
  templateName: route.query.templateName,
  // tab数据
  tabValue: 'base_info',
  // 折叠效果
  fold: {
    baseInfoVisable: true, // 基本信息
    milestoneVisable: true, // 项目阶段评价
    productVisable: true, // 关联
    workflowVisable: true, // 流程设置
  },
  // 基本信息
  baseInform: {},
  // 关联
  evaluateTableData: [],
  relevanceTabelData: [],
  tableLoad1: false,
  tableLoad: false,

  /**用户 */
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),

  // 项目详情抽屉
  projectVisable: false,
});

/**监听流程指引数据 */
const exposeStepArr = ref([]);
const runData = ref('');
// const tabPane = ref(false);
watch(
  () => exposeStepArr.value,
  (val) => {
    let arr = val.filter((v) => v.state && v.state.indexOf('RUNNING') !== -1);
    runData.value = arr.length > 0 && arr[0].name;
  },
);

const processJuge = computed(() => {
  let visible = false;
  let temp = true;
  if (exposeStepArr.value.length > 0) {
    temp = exposeStepArr.value.some((v) => v.stateDisplay !== '已执行');
  }
  if (temp) {
    if (runData.value === '项目成员打分' || runData.value === '成员打分审核' || runData.value === '通知') {
      visible = true;
    } else {
      visible = false;
    }
  } else {
    visible = true;
  }
  return visible;
});

// 项目详情
const handeProjectDetail = () => {
  Data.projectVisable = true;
};

/**tab切换 */
const handleTabClick = (tab) => {
  const id = tab.props.name;
  document.querySelector('#' + id).scrollIntoView({
    behavior: 'smooth',
  });
};
onMounted(async () => {
  Data.processLoading = true;
  await getProjectPhaseEvaluation();
  await getRelatedData();
  getBaseInfo();
  // getProcessInfoData();
});

// 获取基本信息
const phaseObj = ref({});
const getBaseInfo = async () => {
  await window.$api.projectEvaluateApi.getEvalTempInfo({ projectOid: Data.projectOid, evalTempId: Data.evaluationOid }).then((res) => {
    if (res.success) {
      // Data.baseInform.title = res.data.evalPreCondition;
      Data.baseInform.tempName = res.data.tempName;
      Data.baseInform.evalScore = res.data.evalScore;
      Data.baseInform.contentList = res.data.evalDesc.split('\n');
      let arr = res.data.tempName.split('-');
      Data.selectTemplate = arr[arr.length - 1];
      phaseObj.value = res.data.nowPhase;
      console.log(phaseObj.value, '--------------');
    } else {
      window.$message.error(res.message);
    }
    Data.processLoading = false;
  });
};
// 获取项目阶段评价
const getProjectPhaseEvaluation = async () => {
  Data.tableLoad1 = true;
  await window.$api.projectEvaluateApi.getProjectPhaseEvaluation({ projectOid: Data.projectOid, evalTempId: Data.evaluationOid }).then((res) => {
    if (res.success) {
      Data.evaluateTableData = res.data;
      Data.tableLoad1 = false;
    } else {
      window.$message.error(res.message);
      Data.tableLoad1 = false;
    }
  });
};
// 获取关联数据
const getRelatedData = async () => {
  Data.tableLoad = true;
  await window.$api.projectEvaluateApi.getEvaluationRelativeListViewTable({ projectOid: Data.projectOid, evalTempId: Data.evaluationOid }).then((res) => {
    if (res.success) {
      Data.relevanceTabelData =
        res.data.length > 0 &&
        res.data.map((e) => {
          e.relativeFile = e.relativeFileName;
          return e;
        });
      Data.tableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
};
// 点击名称下载
const downFile = (item) => {
  window.$api.commonApi.downloadContent({ oid: item.relativeDataOid }).then((res) => {
    if (!res) return window.$message.error('下载失败');
    useCommonHandler.download(res, item.relativeFile);
  });
};

/**
 * 打分处理
 */
const scoreResultData = ref([]);
const scoreFileData = ref([]);
const evaluationElement = ref(null);
</script>

<style lang="less" scoped>
.check_process {
  .top_area {
    margin-bottom: 14px;
    padding: 16px 16px 0 16px;
    background: #fff;
    .base-title {
      text-align: left;
      font-size: 20px;
      font-family: 'PingFangSC, PingFang SC';
      font-weight: 700;
      color: rgba(0, 0, 0, 0.85);
      display: flex;
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      .left_box {
        :deep(.el-button) {
          margin-left: 20px;
        }
      }
    }
    .select_radio {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .title {
        margin-right: 10px;
        display: inline-block;
      }
      :deep(.el-radio-group) {
        .el-radio {
          margin-right: 20px;
        }
        .is-checked {
          .el-radio__inner {
            background-color: transparent;
            &::after {
              width: 6px;
              height: 6px;
              background-color: #2664f6;
            }
          }
        }
      }
    }
    .tab_box {
      :deep(.el-tabs__header) {
        margin-bottom: 0px;
      }
    }
  }
  .bot_area {
    padding: 0 8px 0 16px;
    height: calc(100vh - 228px);
    overflow-y: scroll;
    // margin-top: 80px;
    .depart {
      background: #fff;
      margin-bottom: 10px;
      .title_box {
        display: flex;
        align-items: center;
        height: 40px;
        border-bottom: 1px solid #dddddd;
        padding: 0 16px;
        .hand_icon {
          width: 18px;
          height: 18px;
          display: flex;
          border: 1px solid rgba(0, 0, 0, 0.2);
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
      .area-content {
        padding: 15px;
        .base-title {
          font-size: 20px;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: 700;
          color: rgba(0, 0, 0, 0.85);
        }
        .base {
          margin: 15px 0;
        }
        .base-title-left {
          font-size: 14px;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: 400;
          color: #666666;
          display: inline-block;
          margin-right: 25px;
        }
        .score-title-left {
          margin-right: 50px;
          font-size: 14px;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: 400;
          color: #666666;
        }
        .base-item {
          font-size: 14px;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: 400;
          color: #333333;
          margin-bottom: 5px;
        }
        .statement {
          display: flex;
          // margin: 0 0 -10px 0;
        }
        :deep(.el-overlay) {
          .drawerSelf {
            .el-drawer__header {
              margin-bottom: 0;
            }
          }
        }
      }
      &:nth-last-child(1) {
        padding: 0 15px;
        .title_box {
          padding: 0;
        }
      }
    }
    .wokflowStyle {
      padding: 10px;
    }
  }
}
:deep(.el-table) {
  td.el-table__cell div {
    white-space: pre-wrap;
  }
}
:deep(.el-affix) {
  width: 100% !important;
  // height: 56px !important;
  line-height: 40px !important;
  text-align: right;
}
:deep(.el-affix--fixed) {
  z-index: 100;
  height: 56px !important;
  line-height: 56px !important;
  background: #ffffff;
  box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.2);
  border-radius: 1px;
  padding-right: 13px;
  bottom: 0 !important;
}
</style>
