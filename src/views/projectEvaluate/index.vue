<template>
  <div class="project_valuate page_common" v-loading="Data.PageLoad">
    <div class="title">{{ $intl('Evaluation List').d('评价列表') }}</div>
    <div class="btn_search">
      <div class="btn_box">
        <el-button type="primary" v-permission="'/plmProject/CE'" @click="createEvaluation">{{ $intl('Create evaluation').d('创建评价') }}</el-button>
        <el-button v-permission="'/plmProject/DE'" :disabled="Data.selectTableData.length !== 1" @click="handleEdit">{{ $intl('edit').d('编辑') }}</el-button>
      </div>
      <div class="input_search">
        <el-input v-model="Data.searchValue" style="width: 224px" placeholder="请输入搜索关键词" clearable>
          <template #suffix>
            <el-icon class="el-input__icon"><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>
    <div class="table_box">
      <NewPiTable
        :columns="Data.evaluationColumns"
        :data="Data.evaluationTableData"
        :selectable="true"
        :pagination="Data.evaluationTableData?.length > 10"
        :isWebPagination="Data.evaluationTableData?.length > 10"
        :page-size="10"
        @selectionChange="selectionChange"
      >
        <template #evalName="scope">
          <el-tooltip :content="scope.row.evalName" placement="top" :hide-after="0">
            <el-link
              style="display: inline-block; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
              type="primary"
              :underline="false"
              @click="goDetailFun(scope)"
            >
              {{ scope.row.evalName }}
            </el-link>
          </el-tooltip>
        </template>
        <template #evalDesc="scope">
          <el-tooltip :content="scope.row.evalDesc" placement="top" :hide-after="10">
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
              {{ scope.row.evalDesc }}
            </span>
          </el-tooltip>
        </template>
        <template #evalState="scope">
          <span style="color: #386bd7">
            {{ scope.row.evalState }}
          </span>
        </template>
      </NewPiTable>
    </div>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';
const Data = reactive({
  PageLoad: false,
  searchValue: '',

  // 表格数据
  evaluationColumns: [
    { title: '评价名称', dataIndex: 'evalName', minWidth: 110 },
    { title: '创建者', dataIndex: 'createUser', minWidth: 130, ellipsis: true },
    { title: '创建时间', dataIndex: 'createTime', minWidth: 130, ellipsis: true },
    { title: '完成时间', dataIndex: 'completeTime', minWidth: 130, ellipsis: true },
    { title: '得分', dataIndex: 'evalScore', minWidth: 130, ellipsis: true },
    { title: '是否发放', dataIndex: 'isDistribute', minWidth: 130, ellipsis: true },
    { title: '发放时间', dataIndex: 'distributeTime', minWidth: 130, ellipsis: true },
    { title: '描述', dataIndex: 'evalDesc', minWidth: 350 },
    { title: '状态', dataIndex: 'evalState', minWidth: 130 },
  ],
  evaluationTableData: [],
  selectTableData: [],
  projectOid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
});

const router = useRouter();
/**创建 */
const createEvaluation = () => {
  if (Data.evaluationTableData.some((v) => v.evalState === '正在审阅')) return window.$message.warning('请先完成正在进行的评价流程！');
  router.push({ name: 'createEvaluate' });
};
// 编辑
const handleEdit = () => {
  if (Data.selectTableData.length === 0) return window.$message.warning('请选择需要编辑的数据');
  if (Data.selectTableData[0].evalState !== '正在工作') return window.$message.warning('请选择正在工作状态的数据！');
  router.push({ name: 'editEvaluate', query: { templateName: Data.selectTableData[0].evalName, templateOid: Data.selectTableData[0].evaluationOid } });
};
// 复选框选择
const selectionChange = (data) => {
  Data.selectTableData = data;
};
// 获取评价数据
const getEvaluateData = () => {
  Data.PageLoad = true;
  window.$api.projectEvaluateApi.getEvaluationTable({ oid: Data.projectOid }).then((res) => {
    if (res.success) {
      Data.evaluationTableData = res.data;
    } else {
      window.$message.error(res.message);
    }
    Data.PageLoad = false;
  });
};
/**详细信息 */
const goDetailFun = (scope) => {
  console.log(scope, 102);
  // router.push({ name: 'detailEvaluate', query: { templateName: scope.evalName, templateOid: scope.evaluationOid } });
  router.push({ name: 'detailEvaluate', query: { templateName: scope.row.evalName, oid: scope.row.evaluationOid } });
};
onMounted(() => {
  getEvaluateData();
});
</script>

<style lang="less" scoped>
.project_valuate {
  // overflow: scroll;
  padding: 16px;
  margin-bottom: 16px;
  background: #fff;
  min-height: calc(100vh - 116px);
  .title {
    font-size: 18px;
    font-family: 'PingFangSC, PingFang SC';
    font-weight: 500;
    color: #333333;
    margin-bottom: 8px;
  }
  .btn_search {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .table_box {
    :deep(.el-link) {
      .el-link__inner {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        display: inline-block;
      }
    }
  }
}
</style>
