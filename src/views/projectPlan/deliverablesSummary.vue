<template>
  <div class="summary-container">
    <div class="header-box">
      <p class="deliverable">
        {{ Data.selectStage ? '本阶段' : '' }}应交付{{ Data.tableData?.length }}项，实际交付
        <span style="color: #386bd7">{{ Data.isDeliver }}</span>
        项，完成率
        <span>{{ Data.isDeliverPercent + '%' }}</span>
      </p>
      <div class="filter-box">
        <span>项目阶段：</span>
        <el-select clearable multiple collapse-tags v-model="Data.selectStage" @change="changeStage">
          <el-option v-for="item in Data.stageList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
    </div>
    <NewPiTable
      :columns="Data.colunms"
      :data="Data.tableData"
      :pagination="true"
      :isWebPagination="Data.tableData?.length > 10"
      :page-size="10"
      :tableLoad="isLoading"
      rowKey="deliverableOid"
      :tableHeight="520"
    >
      <template #name="scope">
        <el-button type="text">{{ scope.row.name }}</el-button>
      </template>
      <template #subjectName="scope">
        <div class="view_box">
          <span>{{ scope.row.subjectName }}</span>
          <el-tooltip content="预览" placement="top" v-if="scope.row.subjectName">
            <el-icon v-prview="{ id: scope.row.documentOid, name: scope.row.fileName }" class="iconClose"><View /></el-icon>
          </el-tooltip>
        </div>
      </template>
    </NewPiTable>
  </div>
</template>

<script setup>
const isLoading = ref(false);
const Data = reactive({
  colunms: [
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
    // { title: '创建时间', dataIndex: 'createTime', minWidth: 120, ellipsis: true },
  ],
  tableData: [],
  stageList: [],
  selectStage: [],
  isDeliver: 0,
  isDeliverPercent: 0,
});
const api = window.$api;
onMounted(() => {
  getStageInfo();
  getTableInfo();
});
const getStageInfo = () => {
  const params = {
    oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  };
  api.planApi.getAllPlanActivityStage(params).then((res) => {
    if (res.success) {
      Data.stageList = res.data;
    }
  });
};
const changeStage = () => {
  getTableInfo();
};
/**获取数据 */
const getTableInfo = () => {
  let parmas = {
    projectOid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
    stage: Data.selectStage.join(','),
  };
  isLoading.value = true;
  api.planApi.queryAllDeliverableByProject(parmas).then((res) => {
    isLoading.value = false;
    if (res.success) {
      Data.tableData = res.data;
      Data.isDeliver = Data.tableData.filter((v) => v.subjectName).length;
      Data.isDeliverPercent = ((Data.isDeliver / Data.tableData?.length) * 100).toFixed(2);
    } else {
      window.$message.error('查询失败');
    }
  });
};
</script>

<style lang="scss" scoped>
.summary-container {
  // height: 560px;
  .view_box {
    display: flex;
    align-items: center;
    .iconClose {
      font-size: 14px;
      color: #626aef;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
.header-box {
  margin-bottom: 8px;
  .deliverable {
    width: 70%;
    display: inline-block;
  }
  .text {
    font-size: 13px;
  }
  .filter-box {
    display: inline-block;
    width: 304px;
    margin-left: calc(30% - 304px);
    span {
      margin-right: 12px;
    }
  }
}
</style>
