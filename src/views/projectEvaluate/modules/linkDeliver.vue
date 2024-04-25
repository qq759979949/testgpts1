<template>
  <div class="diliverFile">
    <el-dialog v-model="Data.diliverDialog" destroy-on-close title="交付物汇总" width="85%" @close="deliverClose">
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

<script setup>
const props = defineProps({
  /**弹框显隐 */
  isShow: {
    type: Boolean,
    default: false,
  },
  /**点击的一行 */
  rowData: {
    type: Object,
    default: () => {},
  },
});

const Data = reactive({
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
});
const route = useRoute();
const router = useRouter();

// 弹框显示调用接口
watch(
  () => props.isShow,
  (val) => {
    Data.diliverDialog = val;
    Data.deliverTabelData = [];
    getDelieverData();
  },
);
// 获取交付物内容
const deliverLoad = ref(false);
const allDeliverData = ref([]);
const projectOid = ref(route.query.projectOid);
const getDelieverData = () => {
  deliverLoad.value = true;
  window.$api.planApi.queryAllDeliverableByProject({ projectOid: projectOid.value }).then((res) => {
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
  emit('update:close', Data.diliverDialog);
};
const deliverConfirm = () => {
  if (singleSelectData.value.length === 0) return window.$message.warning('请选择数据');
  if (!singleSelectData.value[0].subjectName) return window.$message.warning('请选择有实际交付内容的数据！');
  Data.diliverDialog = false;
  emit('refreshRelativeTable', singleSelectData.value);
};
// 点击跳转文档详情
const jumpFileDetail = (item) => {
  let obj = {
    actualLockUser: item.checkOutUser,
  };
  sessionStorage.setItem('fileDetail', JSON.stringify(obj));
  router.push({ name: 'fileDetail', query: { oid: item.documentOid, folderId: '' } });
};

const emit = defineEmits(['refreshRelativeTable', 'update:close']);
</script>

<style lang="less" scoped>
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
</style>
