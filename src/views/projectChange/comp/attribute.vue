<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-10 16:12:07
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-10 16:18:42
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectChange\comp\attribute.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="attribute">
    <NewPiTable :columns="Data.attributeColumns" :data="Data.attributeTableData" :selectable="false" :pagination="false" :tableLoad="Data.tableLoad" rowKey="name">
      <template #afterChange="scope">
        <el-input v-model="scope.row.afterChange" @change="changeInput(scope.row)" placeholder="请输入" v-if="isEdit && scope.row.filedType !== 'SELECT'">
          <template #prefix v-if="scope.row.isChange">
            <div class="input-triangle"></div>
          </template>
        </el-input>
        <div v-if="isEdit && scope.row.filedType === 'SELECT'">
          <el-select v-model="scope.row.afterChange" @change="changeInput(scope.row)" placeholder="请输入" style="width: 100%">
            <el-option v-for="item in scope.row.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <div class="input-triangle1" v-if="scope.row.isChange"></div>
        </div>
        <div v-if="isEdit && scope.row.filedType === 'DATE'">
          <el-date-picker
            v-model="scope.row.afterChange"
            type="date"
            placeholder="请选择"
            format="YYYY/MM/DD"
            value-format="YYYY/MM/DD"
            @change="changeInput(scope.row)"
          ></el-date-picker>
          <div class="input-triangle1" v-if="scope.row.isChange"></div>
        </div>
        <div v-if="!isEdit">
          <div class="noChange" v-if="!scope.row.isChange">{{ scope.row.afterChange }}</div>
          <div class="noChange hasChange" v-else>{{ scope.row.afterChange }}</div>
        </div>
      </template>
    </NewPiTable>
  </div>
</template>
<script setup>
const props = defineProps({
  // 表格是否可编辑
  isEdit: {
    type: Boolean,
    default: false,
  },
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
  attributeColumns: [
    { title: '属性', dataIndex: 'attribute' },
    { title: '更改前', dataIndex: 'beforeChange' },
    { title: '更改后', dataIndex: 'afterChange' },
  ],
  attributeTableData: props.tableData,
  tableLoad: false,
});
const changeInput = (scope) => {
  emit('changeInput', scope);
};
// 获取创建变更时的可变更属性值
const getCreateChangeList = () => {
  Data.tableLoad = true;
  window.$api.projectChangeApi.getChangeAttrLayout({ oid: props.oid }).then((res) => {
    if (res.success) {
      if (res.data.length > 0) {
        Data.attributeTableData = res.data[0].items.map((item) => {
          item.attribute = item.label;
          if (item.filedType === 'INPUT') {
            item.displayValue = item.value;
          }
          item.beforeChange = item.displayValue;
          item.afterChange = item.displayValue;
          if (item.options) {
            let newData = [];
            item.options.forEach((it) => {
              for (let key in it) {
                let obj1 = {};
                obj1.value = it[key];
                obj1.label = it[key];
                newData.push(obj1);
              }
            });
            item.options = newData;
          }
          return item;
        });
      }
    } else {
      window.$message.error(res.message);
    }
    Data.tableLoad = false;
  });
};
watch(
  () => props.tableData,
  (val) => {
    if (val.length === 0) {
      getCreateChangeList();
    } else {
      Data.attributeTableData = val;
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
.attribute {
  // 橙色三角形
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
