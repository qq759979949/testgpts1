<template>
  <div class="check_process" v-loading="Data.processLoading">
    <el-affix position="top" :offset="100">
      <div class="top_area">
        <div class="base-title">
          <div class="left_box">
            <span>{{ '【' + processStepName + '】' + Data.baseInform.tempName }}</span>
            <el-button type="primary" plain @click="handeProjectDetail">项目详情</el-button>
          </div>
          <div class="right_box">
            <el-button type="primary" v-for="(item, index) in handButton" :key="index" @click="handSubmit(item)">{{ item.label }}</el-button>
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
            <el-tab-pane v-if="processJuge && projectType === '产品开发类项目'" :label="$intl('Package members').d('配包成员表格')" name="sub_package"></el-tab-pane>
            <el-tab-pane :label="$intl('Association').d('关联')" name="association"></el-tab-pane>
            <el-tab-pane :label="$intl('Process settings').d('流程处理')" name="process_settings"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-affix>
    <div class="bot_area">
      <div class="depart" id="base_info">
        <div class="title_box">
          <span class="hand_icon" @click="clickLookOrHide('baseInfoVisable')">{{ Data.fold.baseInfoVisable ? '-' : '+' }}</span>
          <span class="title">基础信息</span>
        </div>
        <div class="area-content" id="baseInfoVisable" :class="Data.fold.baseInfoVisable ? 'look_height' : 'hide_height'">
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
          <span class="hand_icon" @click="clickLookOrHide('milestoneVisable')">{{ Data.fold.milestoneVisable ? '-' : '+' }}</span>
          <span class="title">项目阶段评价</span>
        </div>
        <div
          class="area-content"
          id="milestoneVisable"
          :class="Data.fold.milestoneVisable ? 'look_height' : 'hide_height'"
          v-if="processStepName === '校对' || processStepName === '重新提交'"
        >
          <NewPiTable
            rowKey="pointOid"
            :columns="evaluateColums"
            :data="Data.evaluateTableData"
            :selectable="false"
            :pagination="false"
            :isShowSetting="false"
            :tableLoad="Data.tableLoad1"
          >
            <template #pmSelfDesc="scope">
              <el-input v-model="scope.row.pmSelfDesc" v-if="processStepName === '重新提交'" placeholder="请输入" type="textarea">{{ scope.row.pmSelfDesc }}</el-input>
            </template>
          </NewPiTable>
        </div>
        <!-- 打分组件 -->
        <div
          class="area-content"
          id="milestoneVisable"
          :class="Data.fold.milestoneVisable ? 'look_height' : 'hide_height'"
          v-else-if="processStepName !== '校对' && processStepName !== '重新提交'"
        >
          <phaseEvaluation
            ref="evaluationElement"
            :workItemOid="workitemOid"
            :phaseData="Data.evaluateTableData"
            v-model:scoreResultData="scoreResultData"
            v-model:scoreFileData="scoreFileData"
            :isUpdate="isUpdate"
            @saveFun="saveFun"
          ></phaseEvaluation>
        </div>
      </div>

      <!-- 项目成员打分 -->
      <projectPartScoring v-if="processJuge" :phaseObjData="phaseObj" v-model:checkHand="checkFlag"></projectPartScoring>

      <!-- 关联 -->
      <div class="depart" id="association">
        <div class="title_box">
          <span class="hand_icon" @click="clickLookOrHide('productVisable')">{{ Data.fold.productVisable ? '-' : '+' }}</span>
          <span class="title">关联</span>
        </div>
        <div class="area-content" id="productVisable" :class="Data.fold.productVisable ? 'look_height' : 'hide_height'">
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
              <el-link type="primary" v-if="scope.row.relativeFile">
                <span style="margin-right: 6px" @click="downFile(scope.row)">{{ scope.row.relativeDocName + '(' + scope.row.relativeDocNumber + ')' }}</span>
                <el-tooltip content="更新交付物" placement="top">
                  <span>
                    <el-icon @click="relativeClick(scope.row)" style="cursor: pointer" size="20" color="#386bd7" v-if="processStepName === '重新提交'"><Upload /></el-icon>
                  </span>
                </el-tooltip>
              </el-link>
              <div v-else>
                <el-tooltip content="上传交付物" placement="top">
                  <span>
                    <el-icon @click="relativeClick(scope.row)" style="cursor: pointer" size="20" color="#386bd7" v-if="processStepName === '重新提交'"><Upload /></el-icon>
                  </span>
                </el-tooltip>
              </div>
            </template>
            <!-- <template #relativeFile="scope">
              <el-link type="primary" :underline="true" @click="downFile(scope.row)">
                {{ scope.row.relativeFile }}
              </el-link>
            </template> -->
          </NewPiTable>
        </div>
      </div>
      <div class="depart" id="process_settings">
        <div class="title_box">
          <span class="hand_icon" @click="clickLookOrHide('workflowVisable')">{{ Data.fold.workflowVisable ? '-' : '+' }}</span>
          <span class="title">流程处理</span>
        </div>
        <div class="area-content" id="workflowVisable" :class="Data.fold.workflowVisable ? 'look_height' : 'hide_height'">
          <ProcessRecord :oid="workitemOid" :stepList="stepArr"></ProcessRecord>
          <ProcessSubmit
            ref="prcess_submit"
            v-if="!isCompleted"
            :oid="workitemOid"
            :processOID="processOid"
            :isTask="false"
            :isHandVisible="false"
            v-model:handButton="handButton"
            @processSubmit="submitFun"
            @goBack="goBack"
          ></ProcessSubmit>
        </div>
      </div>
    </div>
  </div>
  <!-- 关联交付物弹框 -->
  <linkDeliver :isShow="Data.diliverDialog" v-model:close="Data.diliverDialog" :rowData="rowData" @refreshRelativeTable="refreshRelativeTable"></linkDeliver>

  <!-- 项目详情 -->
  <el-drawer v-model="Data.projectVisable" class="drawerSelf" size="60vw" title="项目详情">
    <!-- <template #header>
      <h4>项目详情</h4>
    </template> -->
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
import linkDeliver from './modules/linkDeliver.vue';
import projectDetail from './modules/projectDetail.vue';
const route = useRoute();
const router = useRouter();
const Data = reactive({
  processLoading: false,
  selectTemplate: '',
  evaluationOid: route.query.oid && route.query.oid.split(':')[2],
  // tempalteOid: route.query.oid,
  projectOid: route.query.projectOid,
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
  diliverDialog: false,
  /**用户 */
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),

  // 项目详情抽屉
  projectVisable: false,
});

/**流程相关参数oid */
const workitemOid = ref(route.query.workitemOID);
const processOid = ref(route.query.processOID);
const processStepName = ref(route.query.workItemName);
const isCompleted = ref(route.query.isCompleted);
const projectType = ref(route.query.projectType);

/**操作按钮 */
const handButton = ref([]);

const processJuge = computed(() => {
  let visible = false;
  if (route.query.workItemName === '项目成员打分' || route.query.workItemName === '成员打分审核' || route.query.workItemName === '通知') {
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
onBeforeMount(() => {
  Data.processLoading = true;
  getBaseInfo();
});
onMounted(async () => {
  await getProjectPhaseEvaluation();
  await getRelatedData();
  Data.processLoading = false;
  // getProcessSteps();
});

/**点击显示隐藏 */
const clickLookOrHide = (type) => {
  Data.fold[type] = !Data.fold[type];
};

/**获取审批节点 */
const stepArr = ref([]);
const activeStepStr = ref('');
const getProcessSteps = () => {
  let param = {
    oid: route.query.workitemOID,
  };
  window.$api.processApi.getProcessSteps(param).then((res) => {
    if (res.success) {
      stepArr.value = res.data;
      stepArr.value.forEach((el) => {
        if (el.state && el.state.indexOf('RUNNING') !== -1) {
          activeStepStr.value = el.name;
        }
      });
    }
  });
};

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
    } else {
      window.$message.error(res.message);
    }
  });
};

// 打分保存后
const isUpdate = ref(false);
const saveFun = (val) => {
  isUpdate.value = val;
  getProjectPhaseEvaluation();
};

// 获取项目阶段评价
const getProjectPhaseEvaluation = async () => {
  Data.tableLoad1 = true;
  await window.$api.projectEvaluateApi.getProjectPhaseEvaluation({ projectOid: Data.projectOid, evalTempId: Data.evaluationOid, workItemOid: workitemOid.value }).then((res) => {
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
        res.data.length > 0
          ? res.data.map((e) => {
              e.relativeFile = e.relativeFileName;
              return e;
            })
          : [];
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

// 重新提交
const rowData = ref({});
const relativeClick = (item) => {
  rowData.value = {};
  rowData.value = item;
  Data.diliverDialog = true;
};
// 将选择的数据渲染到关联表中
const refreshRelativeTable = (item) => {
  Data.relevanceTabelData.forEach((v) => {
    if (v.relativeOid === rowData.value.relativeOid) {
      v.relativeFile = item[0].deliverableName;
      v.relativeDocName = item[0].subjectName;
      v.relativeDocNumber = item[0].subjectNumber;
      v.deliverableOid = item[0].deliverableOid;
    }
  });
};
/**
 * 打分处理
 */
const scoreResultData = ref([]);
const scoreFileData = ref([]);
const evaluationElement = ref(null);

/**主包配包表格填写后校验保存 */
const checkFlag = ref(true);

const prcess_submit = ref(null);
const handSubmit = (item) => {
  if (processJuge) {
    if (!checkFlag.value) {
      let txt = projectType === '产品开发类项目' ? '请先保存改变的主包或配包的数据' : '请先保存改变的主包的数据！';
      window.$message.warning(txt);
      return;
    }
  }
  prcess_submit.value.submitClick(item);
};

// 流程提交
const submitFun = async (operation, callback, resolution) => {
  if (Data.templateName === 'EvaluationGradeProcess') {
    if (!evaluationElement.value.checkParameters(scoreResultData.value)) return;
    Data.processLoading = true;
    let params = new FormData();
    // 处理传入的数据
    let fileArr = [];
    scoreResultData.value.forEach((e) => {
      scoreFileData.value.forEach((v) => {
        if (e.index === v.pointOrder) {
          // 文件入参
          if (v.handFileList && v.handFileList.length > 0) {
            fileArr = v.handFileList.map((m) => {
              if (!m?.fileOid) {
                params.append(m.uid + '&&&' + m.name, m.raw);
                return m.uid + '&&&' + m.name;
              }
            });
          }
          /**用户 */
          e.evaluationUser = v.checkUserList.filter((v) => v.includes(e.evaluationUser))[0];
          // 赋值
          e.fileName = fileArr.filter((e) => e);
          // 分值相减--传入入参
          e.resultScore = (Number(e.resultScore) - Number(v.baseScore)).toString();
          // 保存的文件
          let newArr = v.handFileList.filter((e) => e.fileOid);
          e.hasUploadFile = newArr.length > 0 ? newArr.map((v) => v.fileOid) : [];
          e.saveFlag = '1';
        }
      });
    });

    // 整合入参---对象
    let parmasObj = {
      actualCompleteUser: Data.userInfo.username,
      comment: resolution,
      evaluationResultParams: scoreResultData.value,
      oid: route.query.workitemOID,
      route: operation,
      userName: Data.userInfo.thirdPartUser,
    };
    params.append('taskFormData', JSON.stringify(parmasObj));
    // 整合入参--文件
    // scoreResultData.value.forEach((e) => {
    // e.fileName.forEach((v) => {
    // let keys = Object.keys(v);
    // v[keys[0]].name = v[keys[0]].uid.toString() + '&&&' + v[keys[0]].name;
    // params.append('fileInfo&&&' + v[keys[0]].name, v[keys[0]]);
    // });
    // });
    window.$api.projectEvaluateApi.completeEvaluationGradeTask(params).then((res) => {
      if (res.success) {
        window.$message.success(res.data);
        goBack();
      } else {
        window.$message.error(res.message);
      }
      Data.processLoading = false;
    });
  } else {
    if (processStepName.value === '重新提交') {
      if (Data.relevanceTabelData.some((e) => !e.relativeFile)) return window.$message.error('关联文件不能为空');
      Data.processLoading = true;
      let obj = {
        custActVar: JSON.stringify({
          pointBean: Data.evaluateTableData,
          relativeInfo: Data.relevanceTabelData,
        }),
      };
      callback(obj);
    } else {
      Data.processLoading = true;
      await callback();
    }
  }
  Data.processLoading = false;
};

/**取消 */
const goBack = () => {
  router.push({ name: 'toDoPage' });
  window.$navTagStore.removeTag(route, router);
  window.$navTagStore.removeCacheTag(route.name);
};
</script>

<style lang="less" scoped>
.check_process {
  .top_area {
    margin-bottom: 14px;
    padding: 16px 16px 0 16px;
    background: #fff;
    .base-title {
      font-weight: 700;
      color: rgba(0, 0, 0, 0.85);
      display: flex;
      text-align: left;
      font-size: 20px;
      font-family: 'PingFangSC, PingFang SC';
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      .left_box {
        :deep(.el-button) {
          margin-left: 20px;
        }
      }
      .right_box {
        :deep(.el-button) {
          margin-right: 20px;
          margin-left: 0;
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
    height: calc(100vh - 224px);
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
        padding: 14px;
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
          // margin: 15px 0 -10px 0;
        }
      }
      .look_height {
        padding: 14px;
        height: auto;
      }
      .hide_height {
        height: 0;
        padding: 14px 0 0 0;
        overflow: hidden;
      }
      &:nth-last-child(1) {
        // padding: 0 15px;
        margin-bottom: 0;
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
:deep(.el-overlay) {
  :deep(.drawerSelf) {
    :deep(.el-drawer__header) {
      margin-bottom: 0;
    }
  }
}
:deep(.el-drawer__header) {
  margin-bottom: 0 !important;
}
</style>
