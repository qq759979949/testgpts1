<template>
  <div class="create_evaluate" v-loading="Data.pageLoad" v-if="isPageVisible">
    <el-affix position="top" :offset="100">
      <div class="top_area" :class="!Data.status ? 'present' : ''">
        <div class="select_radio" v-if="!editData.tempalteOid">
          <span class="title">选择评价模版：</span>
          <div class="radio_box">
            <el-radio-group v-model="Data.createRadio" @change="radioChange">
              <el-radio v-for="item in Data.radioData" :key="item.internalValue" :label="item.internalValue">{{ item.displayValue }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="select_radio" v-else>
          <span class="title">选择评价模版：</span>
          <div class="radio_box">{{ editData.selectTemplate }}</div>
        </div>
        <div v-if="Data.isActived && !editData.tempalteOid" class="notice">
          <img src="@/assets/img/waring.png" alt="" />
          <span>{{ hasTip }}</span>
        </div>
        <!-- tab -->
        <div class="tab_box" v-if="Data.status">
          <el-tabs v-model="Data.tabValue" @tab-click="handleTabClick">
            <el-tab-pane :label="$intl('Basic information').d('基本信息')" name="base_info"></el-tab-pane>
            <el-tab-pane :label="$intl('Project Phase Evaluation').d('项目阶段评价')" name="phase_evaluation"></el-tab-pane>
            <el-tab-pane :label="$intl('Association').d('关联')" name="association"></el-tab-pane>
            <el-tab-pane :label="$intl('Process settings').d('流程设置')" name="process_settings"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-affix>
    <div class="bot_area" v-if="Data.status">
      <div class="depart" id="base_info">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.baseInfoVisable = !Data.fold.baseInfoVisable">{{ Data.fold.baseInfoVisable ? '-' : '+' }}</span>
          <span class="title">基础信息</span>
        </div>
        <div class="area-content" v-if="Data.fold.baseInfoVisable">
          <p class="base-title">{{ Data.baseInform.tempName }}</p>
          <div>
            <!-- <div class="base">
              <span class="base-title-left">模版名称：</span>
              <span>{{ Data.baseInform.title }}</span>
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
        <div class="area-content" v-if="Data.fold.milestoneVisable">
          <NewPiTable
            :columns="Data.evaluateColums"
            :data="Data.evaluateTableData"
            :selectable="false"
            :stripe="true"
            rowKey="oid"
            :pagination="false"
            :isShowSetting="false"
            :tableLoad="Data.tableLoad1"
          >
            <template #pmSelfDesc="scope">
              <el-input v-model="scope.row.pmSelfDesc" placeholder="请输入" type="textarea">{{ scope.row.pmSelfDesc }}</el-input>
            </template>
          </NewPiTable>
        </div>
      </div>
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
              <el-link type="primary" :underline="false" v-if="scope.row.relativeFile">
                <span style="margin-right: 6px" @click="downFile(scope.row)">{{ scope.row.relativeDocName + '(' + scope.row.relativeDocNumber + ')' }}</span>
                <el-tooltip content="更新交付物" placement="top">
                  <el-icon @click="relativeClick(scope.row)" style="cursor: pointer" size="20" color="#386bd7" v-if="true"><Upload /></el-icon>
                </el-tooltip>
              </el-link>
              <el-tooltip content="上传交付物" placement="top" v-else>
                <el-icon @click="relativeClick(scope.row)" style="cursor: pointer" size="20" color="#386bd7"><Upload /></el-icon>
              </el-tooltip>
            </template>
          </NewPiTable>
        </div>
      </div>
      <div class="depart" id="process_settings">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.workflowVisable = !Data.fold.workflowVisable">{{ Data.fold.workflowVisable ? '-' : '+' }}</span>
          <span class="title">流程设置</span>
        </div>
        <div v-if="Data.fold.workflowVisable" class="wokflowStyle">
          <el-col :span="12">
            <el-form ref="ruleForm" label-width="120px" label-position="left">
              <el-form-item v-for="(item, index) in Data.userFormData" :key="index" :label="item.activityName + ' ：'" :prop="item.activityName">
                <el-input v-model="item.userName" disabled style="width: 100%"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <!-- <select-user ref="selectUserGrading" :parmasObj="Data.parmasObj" v-model:selectUserData="Data.selectUserData"></select-user> -->
        </div>
      </div>
    </div>
  </div>
  <!-- 不满足创建条件 -->
  <div class="empet" v-else>
    <div class="back">
      <p>
        {{ isPageTip + '，请点击' }}
        <a @click="backClick">返回</a>
        {{ '去完成操作' }}
      </p>
    </div>
    <div class="refresh">
      <p>
        {{ '如以完成上述操作，请点击' }}
        <a @click="mountedRefresh">刷新</a>
      </p>
    </div>
  </div>
  <div v-if="Data.status">
    <el-affix position="bottom" :offset="100">
      <el-button type="" @click="handleSave">保存</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </el-affix>
  </div>
  <!-- 关联交付物弹框 -->
  <div class="diliverFile">
    <el-dialog v-model="Data.diliverDialog" destroy-on-close title="交付物汇总" width="85%" top="50px" @close="deliverClose">
      <div class="search">
        <span>{{ '交付物要求：' }}</span>
        <el-input v-model="Data.deliverSearchValue" :clearable="true" style="width: 240px" placeholder="请输入交付物要求" @change="deliverValueChange"></el-input>
      </div>
      <div class="table_box">
        <NewPiTable
          rowKey="oid"
          :columns="Data.deliverColumns"
          :data="Data.deliverTabelData"
          :selectable="true"
          :isSingleSelect="true"
          :pagination="true"
          :isWebPagination="Data.deliverTabelData?.length > 10"
          :page-size="10"
          :isShowSetting="false"
          :tableLoad="deliverLoad"
          :tableHeight="550"
          @selectionRadioChange="selectionRadioChange"
        >
          <template #subjectName="scope">
            <el-link type="primary" :underline="false" @click="jumpFileDetail(scope.row)">
              {{ scope.row.subjectName }}
            </el-link>
          </template>
        </NewPiTable>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deliverClose">{{ $intl('cancel').d('取消') }}</el-button>
          <el-button type="primary" :loading="Data.isLoading" @click="deliverConfirm">{{ $intl('confirm').d('确认') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="createEvaluate">
import { evaluateColums, relevanceColums } from './modules/tableColumns';
// import selectUser from '@/components/process/selectUser.vue';
import { useCommonHandler } from '@/hooks';
const route = useRoute();
const router = useRouter();
const Data = reactive({
  pageLoad: false, // 页面load
  status: false, // 默认不展示下方数据
  isActived: false, // 是否已经启动评价验收
  createRadio: '',
  radioData: [],
  evaluateColums: evaluateColums,
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
  baseInform: {
    title: '',
    contentList: [],
  },
  // 关联
  evaluateTableData: [],
  relevanceTabelData: [],
  diliverDialog: false,
  isLoading: false,
  deliverSearchValue: '',
  // deliverSearchData: [],
  deliverColumns: [
    { title: '序号', dataIndex: 'index', width: 60 },
    { title: '所属交付阶段', dataIndex: 'activityStage', minWidth: 160, ellipsis: true },
    { title: '任务代号', dataIndex: 'activityCode', minWidth: 120, ellipsis: true },
    { title: '交付物要求', dataIndex: 'deliverableName', minWidth: 200, ellipsis: true },
    { title: '交付物状态', dataIndex: 'subjectState', minWidth: 120, ellipsis: true },
    { title: '实际交付内容', dataIndex: 'subjectName', minWidth: 120, ellipsis: true },
    { title: '行号', dataIndex: 'activityLineNumber', minWidth: 90, ellipsis: true },
    { title: '责任人', dataIndex: 'responsibleUser', minWidth: 120, ellipsis: true },
    { title: '签批人', dataIndex: 'activityAuditor', minWidth: 120, ellipsis: true },
    { title: '活动名称', dataIndex: 'activityName', minWidth: 240, ellipsis: true },
    { title: '目标完成时间', dataIndex: 'targetEndDate', minWidth: 160, ellipsis: true },
    { title: '实际完成时间', dataIndex: 'actualEndDate', minWidth: 160, ellipsis: true },
    { title: '交付时间', dataIndex: 'deliverableDate', minWidth: 160, ellipsis: true },
  ],
  deliverTabelData: [],

  projectOid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
  parmasObj: {
    processTemplate: 'SDLG_ProjectModifyWF',
    oid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
  },

  userFormData: [
    {
      activityName: 'PMO检查',
      userName: '文雅晴',
    },
    {
      activityName: 'PMO检查',
      userName: '文雅晴',
    },
    {
      activityName: 'PMO检查',
      userName: '文雅晴',
    },
  ],
  tableLoad: false,
  tableLoad1: false,
});
const editData = reactive({
  selectTemplate: route.query.templateName || '',
  evaluationOid: route.query.templateOid?.split(':')[2] || '',
  tempalteOid: route.query.templateOid || '',
});
/**初始化数据 */
onMounted(() => {
  if (editData.tempalteOid) {
    getEditData();
  } else {
    getTemplateList();
  }
  // sessionStorage.setItem('currentProject', 'oid');
});
const getEditData = async () => {
  await getEvaluateProcess();
  Data.status = true;
  getBaseInfo();
  getProjectPhaseEvaluation();
  getRelatedData();
};
const mountedRefresh = () => {
  isPageVisible.value = true;
  getTemplateList();
};
const backClick = () => {
  router.push({ name: 'projectDetail' });
};

// 获取基本信息
const getBaseInfo = async () => {
  await window.$api.projectEvaluateApi.getEvalTempInfo({ projectOid: Data.projectOid, evalTempId: editData.evaluationOid }).then((res) => {
    if (res.success) {
      Data.baseInform.title = res.data.evalPreCondition;
      Data.baseInform.tempName = res.data.tempName;
      Data.baseInform.evalScore = res.data.evalScore;
      Data.baseInform.contentList = res.data.evalDesc.split('\n');
    } else {
      window.$message.error(res.message);
    }
  });
};
// 获取项目评价模板
const isPageVisible = ref(true);
const isPageTip = ref('');
const getTemplateList = async () => {
  Data.pageLoad = true;
  await window.$api.projectEvaluateApi.initEvalTempList({ oid: Data.projectOid }).then((res) => {
    if (res.success) {
      Data.radioData = res.data;
    } else {
      isPageVisible.value = false;
      isPageTip.value = res.message;
      window.$message.error(res.message);
    }
    Data.pageLoad = false;
  });
};

// 校验项目经理自评
const checkEvaluate = () => {
  let isRight = true;
  Data.evaluateTableData.forEach((item) => {
    if (!item.pmSelfDesc) {
      isRight = false;
    }
  });
  return isRight;
};
/**tab切换 */
const handleTabClick = (tab) => {
  const id = tab.props.name;
  document.querySelector('#' + id).scrollIntoView({
    behavior: 'smooth',
  });
};

const hasTip = ref('');

// 选择评价模板
const radioChange = async (val) => {
  hasTip.value = '';
  Data.pageLoad = true;
  await getEvaluateProcess();
  if (Data.isActived && !editData.tempalteOid) {
    Data.pageLoad = false;
    return;
  }

  Data.createRadio = val;
  window.$api.projectEvaluateApi.getEvalTempInfo({ projectOid: Data.projectOid, evalTempId: Data.createRadio }).then((res) => {
    if (res.success) {
      if (res.data.msg) {
        Data.isActived = true;
        Data.status = false;
        hasTip.value = res.data.msg;
      } else {
        Data.isActived = false;
        Data.status = true;
        Data.baseInform.title = res.data.evalPreCondition;
        Data.baseInform.tempName = res.data.tempName;
        Data.baseInform.evalScore = res.data.evalScore;
        Data.baseInform.contentList = res.data.evalDesc.split('\n');
        getProjectPhaseEvaluation();
        getRelatedData();
        // getEvaluateProcess();
      }
    } else {
      window.$message.error(res.message);
    }
    Data.pageLoad = false;
  });
};
// 获取项目阶段评价
const getProjectPhaseEvaluation = async () => {
  Data.tableLoad1 = true;
  await window.$api.projectEvaluateApi
    .getProjectPhaseEvaluation({ projectOid: Data.projectOid, evalTempId: editData.tempalteOid ? editData.evaluationOid : Data.createRadio })
    .then((res) => {
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
  await window.$api.projectEvaluateApi
    .getEvaluationRelativeListViewTable({ projectOid: Data.projectOid, evalTempId: editData.tempalteOid ? editData.evaluationOid : Data.createRadio })
    .then((res) => {
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

// 关联点击交付物弹框
const rowData = ref({});
const relativeClick = (item) => {
  rowData.value = {};
  rowData.value = item;
  Data.diliverDialog = true;
};
// 弹框显示调用接口
watch(
  () => Data.diliverDialog,
  (val) => {
    if (val) {
      Data.deliverTabelData = [];
      getDelieverData();
    }
  },
);

// 获取交付物内容
const deliverLoad = ref(false);
const allDeliverData = ref([]);
const getDelieverData = () => {
  deliverLoad.value = true;
  window.$api.planApi.queryAllDeliverableByProject({ projectOid: Data.projectOid }).then((res) => {
    if (res.success) {
      Data.deliverTabelData = res.data;
      allDeliverData.value = res.data;
    } else {
      window.$message.error(res.message);
    }
    deliverLoad.value = false;
  });
};
// 单选
const singleSelectData = ref([]);
const selectionRadioChange = (val, rows) => {
  singleSelectData.value = [];
  singleSelectData.value.push(rows);
};
// 搜索内容
const deliverValueChange = (val) => {
  Data.deliverTabelData = allDeliverData.value.filter((e) => e.deliverableName.includes(val) && e);
};
const deliverClose = () => {
  Data.deliverSearchValue = '';
  Data.diliverDialog = false;
};
const deliverConfirm = () => {
  if (singleSelectData.value.length === 0) return window.$message.warning('请选择数据');
  if (!singleSelectData.value[0].subjectName) return window.$message.warning('请选择有实际交付内容的数据！');
  Data.diliverDialog = false;
  refreshRelativeTable();
};
// 点击跳转文档详情
const jumpFileDetail = (item) => {
  let obj = {
    actualLockUser: item.checkOutUser,
  };
  sessionStorage.setItem('fileDetail', JSON.stringify(obj));
  router.push({ name: 'fileDetail', query: { oid: item.documentOid, folderId: '' } });
};

// 将选择的数据渲染到关联表中
const refreshRelativeTable = () => {
  Data.relevanceTabelData.forEach((v) => {
    if (v.relativeOid === rowData.value.relativeOid) {
      v.relativeFile = singleSelectData.value[0].subjectName;
      v.relativeDocName = singleSelectData.value[0].subjectName;
      v.relativeDocNumber = singleSelectData.value[0].subjectNumber;
      v.deliverableOid = singleSelectData.value[0].deliverableOid;
    }
  });
};

// 获取评价的流程设置
const getEvaluateProcess = async () => {
  await window.$api.projectEvaluateApi
    .getEvaluationProcessUserInfoByEvalTemp({ projectOid: Data.projectOid, evalTempId: editData.tempalteOid ? editData.evaluationOid : Data.createRadio })
    .then((res) => {
      if (res.success) {
        Data.userFormData = res.data.map((item) => {
          item.userName = item.userNames.join(',');
          return item;
        });
        // Data.relevanceTabelData = res.data;
      } else {
        Data.status = false;
        Data.isActived = true;
        hasTip.value = res.message;
        // window.$message.error(res.message);
      }
    });
};

// 保存
const handleSave = () => {
  if (!checkEvaluate()) return window.$message.error('项目经理自评不能为空');
  // {
  //   window.$message.error('项目经理自评不能为空');
  //   return false;
  // }
  Data.pageLoad = true;
  const obj = new FormData();
  obj.append('projectOid', Data.projectOid);
  if (editData.tempalteOid) {
    obj.append('evalTempId', editData.evaluationOid);
    obj.append('evaluationOid', editData.tempalteOid);
  } else {
    obj.append('evalTempId', Data.createRadio);
  }

  obj.append('saveFlag', true);
  obj.append('pointBean', JSON.stringify(Data.evaluateTableData));
  obj.append('relativeInfo', JSON.stringify(Data.relevanceTabelData));
  window.$api.projectEvaluateApi.createEvaluationAndStartProcess(obj).then((res) => {
    if (res.success) {
      window.$message.success('保存成功');
      // window.$navTagStore.removeTag(route, router);
      // window.$navTagStore.removeCacheTag(route.name);
      // router.push({ name: 'projectEvaluate' });
    } else {
      window.$message.error(res.message);
    }
    Data.pageLoad = false;
  });
};
// 提交
const handleSubmit = () => {
  if (!checkEvaluate()) return window.$message.error('项目经理自评不能为空');
  if (Data.relevanceTabelData.some((e) => !e.relativeFile)) return window.$message.error('关联文件不能为空');
  // if (!checkEvaluate()) {
  //   window.$message.error('项目经理自评不能为空');
  //   return false;
  // }
  Data.pageLoad = true;
  const obj = new FormData();
  obj.append('projectOid', Data.projectOid);
  if (editData.tempalteOid) {
    obj.append('evalTempId', editData.evaluationOid);
    obj.append('evaluationOid', editData.tempalteOid);
  } else {
    obj.append('evalTempId', Data.createRadio);
  }
  obj.append('saveFlag', false);
  obj.append('pointBean', JSON.stringify(Data.evaluateTableData));
  obj.append('relativeInfo', JSON.stringify(Data.relevanceTabelData));
  window.$api.projectEvaluateApi.createEvaluationAndStartProcess(obj).then((res) => {
    if (res.success) {
      window.$message.success('提交成功');
      window.$navTagStore.removeTag(route, router);
      window.$navTagStore.removeCacheTag(route.name);
      router.push({ name: 'projectEvaluate' });
    } else {
      window.$message.error(res.message);
    }
    Data.pageLoad = false;
  });
};
</script>

<style lang="less" scoped>
.create_evaluate {
  // padding: 16px;
  // background: #fff;
  .top_area {
    margin-bottom: 20px;
    padding: 16px 16px 0 16px;
    background: #fff;
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
    margin: 0 8px 0 16px;
    height: calc(100vh - 310px);
    overflow-y: scroll;
    margin-top: 80px;
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
      .wokflowStyle {
        padding: 10px;
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
          margin: 15px 0 -10px 0;
        }
      }
      &:nth-last-child(1) {
        margin-bottom: 0;
      }
    }
  }
  .notice {
    font-size: 14px;
    font-family: 'PingFangSC, PingFang SC';
    font-weight: 400;
    color: #333333;
    height: 50px;
    line-height: 50px;
    background: #fef8db;
    padding-left: 20px;
    display: flex;
    align-items: center;
    img {
      margin-right: 5px;
    }
  }
  .present {
    height: 150px;
  }
}
// :deep('.el-table td.el-table__cell div') {
//   white-space: pre-wrap;
// }
.empet {
  padding: 16px;
  background: #fff;
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  a {
    font-size: 16px;
    color: #2664f6;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}

.diliverFile {
  .search {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  :deep(.el-dialog) {
    .el-dialog__body {
      padding-top: 10px;
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
  height: 56px !important;
  line-height: 56px !important;
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
