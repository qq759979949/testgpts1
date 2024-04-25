<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-10 16:12:07
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-01-29 10:09:45
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectChange\comp\attribute.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="milesStoneTable">
    <NewPiTable :columns="Data.planColumns" :data="Data.planTableData" :selectable="false" :pagination="false" :tableLoad="Data.tableLoad">
      <template #afterChange="scope">
        <div v-if="isEdit">
          <el-date-picker
            v-model="scope.row.afterChange"
            type="date"
            placeholder="请选择"
            format="YYYY/MM/DD"
            value-format="YYYY/MM/DD"
            @change="changeInput(scope.row)"
            :disabled-date="(date) => disabledDate(date, scope.row.beforeChange)"
          ></el-date-picker>
          <div class="input-triangle1" v-if="scope.row.isChange"></div>
        </div>
        <div v-else>
          <div class="noChange" v-if="!scope.row.isChange">{{ scope.row.afterChange }}</div>
          <div class="noChange hasChange" v-else>{{ scope.row.afterChange }}</div>
        </div>
        <!-- <el-icon class="iconEdit" v-if="scope.row.isChange"><CircleCheckFilled /></el-icon> -->
      </template>
    </NewPiTable>
  </div>
</template>
<script setup>
import dayjs from 'dayjs';
const props = defineProps({
  // 表格是否可编辑
  isEdit: {
    type: Boolean,
    default: false,
  },
  // 是否是创建时
  isCreate: {
    type: Boolean,
    default: false,
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  oid: {
    type: String,
    default: '',
  },
});
const Data = reactive({
  planColumns: [
    { title: '里程碑计划', dataIndex: 'plan' },
    { title: '更改前', dataIndex: 'beforeChange' },
    { title: '更改后', dataIndex: 'afterChange' },
    { title: '变更天数', dataIndex: 'changeDays' },
  ],
  planTableData: props.tableData,
  tableLoad: false,
});
const changeInput = (scope) => {
  if (scope.beforeChange && scope.afterChange) {
    const date1 = dayjs(scope.beforeChange);
    const date2 = dayjs(scope.afterChange);
    scope.changeDays = Number(date2.diff(date1, 'day'));
  } else {
    scope.changeDays = '';
  }
  emit('changeInput', scope);
};
// 获取创建变更时的可变更计划值
const getCreateChangeList = () => {
  Data.tableLoad = true;
  window.$api.projectChangeApi.getInfoLayout({ oid: props.oid, serviceKey: 'com.pisx.pmgt.project.PIProject' }).then((res) => {
    if (res.success) {
      let newData = [];
      res.data.forEach((item) => {
        if (item.groupName === '项目阶段导航') {
          newData = item.items.filter((i) => {
            return i.label.includes('计划');
          });
        }
      });
      Data.planTableData = newData.map((item) => {
        item.plan = item.label;
        item.beforeChange = item.displayValue;
        item.afterChange = item.displayValue;
        return item;
      });
    } else {
      window.$message.error(res.message);
    }
    Data.tableLoad = false;
  });
};
// 不可选日期
const disabledDate = (time, date) => {
  return time.getTime() <= dayjs(date);
};
watch(
  () => props.tableData,
  (val) => {
    if (val.length === 0) {
      getCreateChangeList();
    } else {
      Data.planTableData = val;
    }
  },
);
watch(
  () => props.isEdit,
  () => {
    if (props.isCreate && !props.isEdit) {
      getCreateChangeList();
    }
  },
);
onMounted(() => {
  if (props.isCreate) {
    getCreateChangeList();
  }
});
const emit = defineEmits(['changeInput']);
defineExpose({
  Data,
});
</script>
<style scoped lang="less">
.milesStoneTable {
  // 橙色三角形
  .input-triangle1 {
    position: absolute;
    top: 16%;
    left: 12px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0px 1px 8px 11px;
    border-color: transparent transparent #f68800 transparent;
    transform: rotate(180deg);
    border-radius: 30%;
  }
  :deep(.el-input-group--prepend > .el-input__wrapper) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
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
}
</style>
