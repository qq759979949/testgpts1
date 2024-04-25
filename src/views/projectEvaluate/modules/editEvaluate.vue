<template>
  <div class="create_evaluate">
    <el-affix position="top" :offset="100">
      <div class="top_area">
        <div class="select_radio">
          <span class="title">选择评价模版：</span>
          <div class="radio_box">{{ Data.selectTemplate }}</div>
        </div>
        <div class="tab_box">
          <el-tabs v-model="Data.tabValue" @tab-click="handleTabClick">
            <el-tab-pane :label="$intl('Basic information').d('基本信息')" name="base_info"></el-tab-pane>
            <el-tab-pane :label="$intl('Project Phase Evaluation').d('项目阶段评价')" name="phase_evaluation"></el-tab-pane>
            <el-tab-pane :label="$intl('Association').d('关联')" name="association"></el-tab-pane>
            <el-tab-pane :label="$intl('Process settings').d('流程设置')" name="process_settings"></el-tab-pane>
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
          <p class="base-title">{{ Data.baseInform.tempName }}</p>
          <div>
            <div class="base">
              <span class="base-title-left">模版名称：</span>
              <span>{{ Data.baseInform.title }}</span>
            </div>
            <div class="statement">
              <span class="base-title-left">评价说明：</span>
              <ul style="list-style-type: none; padding: 0; margin: 0">
                <li class="base-item" v-for="(item, index) in Data.baseInform.contentList" :key="index">{{ item ? item : '-' }}</li>
              </ul>
            </div>
            <div class="base">
              <span class="base-title-left">开启条件：</span>
              <span>-</span>
            </div>
            <div class="score">
              <span class="score-title-left">得分：</span>
              <span>{{ Data.baseInform.evalScore }}</span>
            </div>
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
            :columns="evaluateColums"
            :data="Data.evaluateTableData"
            :selectable="false"
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
              <el-link type="primary" :underline="true">
                {{ scope.row.relativeFile }}
              </el-link>
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
        </div>
      </div>
    </div>
  </div>
  <div>
    <el-affix position="bottom" :offset="100">
      <el-button type="" @click="handleSave">保存</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </el-affix>
  </div>
</template>

<script setup name="editEvaluate">
import { evaluateColums, relevanceColums } from './tableColumns';
const route = useRoute();
const router = useRouter();
const Data = reactive({
  selectTemplate: route.query.templateName,
  evaluationOid: route.query.templateOid.split(':')[2],
  tempalteOid: route.query.templateOid,
  projectOid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
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
});
// 保存
const handleSave = () => {
  if (!checkEvaluate()) {
    window.$message.error('项目经理自评不能为空');
    return false;
  }
  const obj = new FormData();
  obj.append('projectOid', Data.projectOid);
  obj.append('evalTempId', Data.evaluationOid);
  obj.append('evaluationOid', Data.tempalteOid);
  obj.append('saveFlag', true);
  obj.append('pointBean', JSON.stringify(Data.evaluateTableData));
  window.$api.projectEvaluateApi.createEvaluationAndStartProcess(obj).then((res) => {
    if (res.success) {
      window.$message.success('保存成功');
      window.$navTagStore.removeTag(route, router);
      window.$navTagStore.removeCacheTag(route.name);
      router.push({ name: 'projectEvaluate' });
    } else {
      window.$message.error(res.message);
    }
  });
};
// 提交
const handleSubmit = () => {
  if (!checkEvaluate()) {
    window.$message.error('项目经理自评不能为空');
    return false;
  }
  const obj = new FormData();
  obj.append('projectOid', Data.projectOid);
  obj.append('evalTempId', Data.evaluationOid);
  obj.append('evaluationOid', Data.tempalteOid);
  obj.append('saveFlag', false);
  obj.append('pointBean', JSON.stringify(Data.evaluateTableData));
  window.$api.projectEvaluateApi.createEvaluationAndStartProcess(obj).then((res) => {
    if (res.success) {
      window.$message.success('提交成功');
      window.$navTagStore.removeTag(route, router);
      window.$navTagStore.removeCacheTag(route.name);
      router.push({ name: 'projectEvaluate' });
    } else {
      window.$message.error(res.message);
    }
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
      Data.relevanceTabelData = res.data;
      Data.tableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
};
// 获取评价的流程设置
const getEvaluateProcess = async () => {
  await window.$api.projectEvaluateApi.getEvaluationProcessUserInfoByEvalTemp({ projectOid: Data.projectOid, evalTempId: Data.evaluationOid }).then((res) => {
    if (res.success) {
      Data.userFormData = res.data.map((item) => {
        item.userName = item.userNames.join(',');
        return item;
      });
      // Data.relevanceTabelData = res.data;
    } else {
      window.$message.error(res.message);
    }
  });
};
// 获取基本信息
const getBaseInfo = async () => {
  await window.$api.projectEvaluateApi.getEvalTempInfo({ projectOid: Data.projectOid, evalTempId: Data.evaluationOid }).then((res) => {
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
onMounted(() => {
  getBaseInfo();
  getProjectPhaseEvaluation();
  getRelatedData();
  getEvaluateProcess();
});
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
    padding: 0 8px 0 16px;
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
    }
    .wokflowStyle {
      padding: 10px;
    }
  }
}
// :deep('.el-table td.el-table__cell div') {
//   white-space: pre-wrap;
// }
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
