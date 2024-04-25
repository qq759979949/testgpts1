<template>
  <div>
    <newPiTable
      :columns="Data.colunms"
      :data="Data.tableData"
      :selectable="false"
      rowKey=""
      :pagination="false"
      :isShowSetting="false"
      :tableLoad="Data.tableLoad"
      :tableHeight="'auto'"
    >
      <template #projectTargetValueChange="scope">
        <el-input
          v-model="scope.row.projectTargetValueChange"
          placeholder="请输入"
          v-if="scope.row.targetCanChange === '是' && isEdit && scope.row.afterChangeEdit"
          @change="changeInput(scope.row)"
        >
          <template #prefix v-if="scope.row.isChange">
            <div class="input-triangle"></div>
          </template>
        </el-input>
        <div v-else>
          <div class="noChange" v-if="!scope.row.isChange">{{ scope.row.projectTargetValueChange }}</div>
          <div class="noChange hasChange" v-else>{{ scope.row.projectTargetValueChange }}</div>
        </div>
      </template>
    </newPiTable>
  </div>
</template>

<script setup>
// import { costColums, maunInfomCostColums } from '../tableColunms';

const api = window.$api;
const route = useRoute();
const props = defineProps({
  // 是否为变更模块
  isChange: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  costColumns: {
    type: Array,
    default: () => [],
  },
  // 数据
  tableDataCost: {
    type: Array,
    default: () => [],
  },
});
const Data = reactive({
  projectType: '',
  tableLoad: false,
  tableData: [],
  oid: '',
  colunms: props.costColumns,
});
watch(
  () => props.tableDataCost,
  (val) => {
    Data.tableData = val;
  },
);
const handleQuearyData = () => {
  Data.tableLoad = true;
  api.targetApi.queryTargetIndicators({ oid: Data.oid, targetIndicatorsType: '成本指标', orderNumbers: '' }).then((res) => {
    if (res.success) {
      Data.tableData = res.data;
      Data.tableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
};
// 更改变更后的目标值
const changeInput = (scope) => {
  scope.isEdit = true;
  scope.isChange = true;
};
onMounted(() => {
  Data.projectType = route.query.projectType ? route.query.projectType : JSON.parse(sessionStorage.getItem('currentProject')).type;
  Data.oid = route.query.projectOid ? route.query.projectOid : sessionStorage.getItem('editOid');
  // if (props.isChange) {
  Data.colunms = props.costColumns;
  // } else {
  //   Data.colunms = Data.projectType === '产品开发类项目' ? costColums : maunInfomCostColums;
  // }
  if (!props.isChange) {
    handleQuearyData();
  }
});
</script>

<style lang="less" scoped>
.btn {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.btn-dialog {
  text-align: right;
  margin: 10px 0;
}
.prototype {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #f02323;
}
.input-triangle {
  position: absolute;
  top: 3%;
  left: 0px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0px 1px 8px 11px;
  border-color: transparent transparent #f68800 transparent;
  transform: rotate(180deg);
  border-radius: 30%;
}
.noChange {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  line-height: 22px;
}
.hasChange {
  color: #f02323;
}
</style>
