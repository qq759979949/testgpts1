<!-- 多级表头 
  此表格无分页
  表头插槽： <template #表头label="column">{{ column.label }}</template> 
  表格插槽:  <template #属性名="scope">{{ scope.row.label }}</template> 
-->
<template>
  <div class="levelTable" v-loading="tableLoad">
    <el-table
      :data="data.tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :cell-style="columnStyle"
      :show-summary="isShowSummary"
      :summary-method="getTotal"
      :sum-text="sumText"
      fit
      :border="border"
      :header-cell-style="headerCellStyleFun"
      :row-class-name="tableRowClassName"
    >
      <el-table-column v-if="isArrayCheckBox" prop="checkBox" type="selection" width="55" />
      <el-table-column
        v-for="(item, index) in data.columns"
        :width="item.width"
        :prop="item.dataIndex"
        :key="index"
        :label="item.label"
        :header-align="'center'"
        :align="'center'"
        :fixed="item.fixed"
      >
        <!-- 这个是一级表头的插槽 -->
        <template #header="{ column }">
          <slot :name="column.label" v-bind="column" :key="index">
            {{ column.label }}
          </slot>
        </template>
        <!-- 这个是复选框 -->
        <template #default="scope">
          <slot :name="item.dataIndex" v-bind="scope">
            {{ scope.row[item.dataIndex]?.display || scope.row[item.dataIndex] }}
          </slot>
          <el-table-column v-if="index === 0 && isCheckBox" prop="checkBox" type="selection" width="55" />
          <el-table-column
            v-for="(column2, index2) in item.children"
            v-if="item.children && item.children.length > 0"
            :prop="column2.dataIndex"
            :label="column2.label"
            :key="index2"
            :sortable="column2.sortable"
            :width="column2.width"
            :header-align="'center'"
            :align="'center'"
            :fixed="item.fixed"
            :sort-method="column2.sortableType ? xmSort : () => {}"
          >
            <!-- 二级表头的插槽  -->
            <template #header="{ column }">
              <slot :name="column.label" v-bind="column">
                {{ column.label }}
              </slot>
            </template>
            <!-- 有二级表头的话，数据插槽 -->
            <template #default="scope">
              <slot :name="column2.dataIndex" v-bind="scope">
                {{ scope.row[column2.dataIndex]?.display || scope.row[column2.dataIndex] }}
              </slot>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-if="isWebPagination"
        v-model:current-page.sync="data.page"
        v-model:page-size.sync="data.range"
        layout="total, sizes, prev, pager, next"
        small
        :page-sizes="[5, 10, 20, 50, 100]"
        :total="data.total"
      />
    </div>
  </div>
</template>

<script setup>
import * as _ from 'lodash';
const props = defineProps({
  // 表头
  columns: {
    type: Array,
  },
  // 表格数据
  tableData: {
    type: Array,
  },
  // 是否开启多选框？ 默认不开启
  isCheckBox: {
    type: Boolean,
    default: false,
  },
  // 是否复选框占一整列
  isArrayCheckBox: {
    type: Boolean,
    default: false,
  },
  // 边框
  border: {
    type: Boolean,
    defualt: false,
  },
  // 想要添加 表头列的背景色的样式, 里面是表头属性
  CssColumn: {
    type: Array,
    default: () => ['member', 'userName'],
  },
  // 第几列需要添加背景色
  columnIndex: {
    type: Number,
    default: 0,
  },
  isAddColumn: {
    type: Boolean,
    default: false,
  },
  // loading
  tableLoad: {
    type: Boolean,
    default: false,
  },
  /**分页-每页显示数量 ***前端分页的时候必填*** */
  pageSize: {
    type: Number,
    default: 10,
  },
  /**分页-总数 */
  total: {
    type: Number,
    default: 0,
  },
  /**是否前台分页 */
  isWebPagination: {
    type: Boolean,
    default: false,
  },
  /**表格高度 */
  tableHeight: {
    type: Number || String,
    default: 0,
  },
  // 是否显示合计行
  isShowSummary: {
    type: Boolean,
    default: false,
  },
  // 合计行文本
  sumText: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['selectHandler', 'getTotal']);

// 中文排序
const xmSort = (obj1, obj2) => {
  if (obj1.department.value) {
    return obj1.department.value.localeCompare(obj2.department.value, 'zh-CN');
  }
};

const data = reactive({
  columns: [], // 表头
  tableData: [], // 表格
  selectAll: false, // 全选复选框
  indeterminate: false, // 复选框不确定状态
  page: 1,
  range: 10,
  total: 0,
  showData: [],
});

// 监听 表头
watch(
  () => props.columns,
  (newVal) => {
    if (newVal.length > 0) {
      data.columns = newVal;
    }
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  },
);

/**
 * 监听数据处理
 */
let watchData = watch(
  () => props.tableData,
  (val) => {
    init();
  },
  { deep: true },
  // { immediate: true },
);

/**
 * 监听分页
 */
watch(
  () => data.page,
  (val) => {
    if (props.isWebPagination) {
      init();
    } else {
      emit('update:currentPage', val);
    }
  },
);
watch(
  () => data.range,
  (val) => {
    if (props.isWebPagination) {
      init();
    } else {
      emit('update:pageSize', val);
    }
  },
);
watch(
  () => props.total,
  (val) => {
    data.total = parseInt(val);
  },
);

/**初始函数 */
onMounted(() => {
  init();
  data.columns = _.cloneDeep(props.columns);
  data.range = props.pageSize;
});

// 合计行方法
const getTotal = (e) => {
  if (props.isShowSummary) {
    const { columns, data } = e;
    const sums = [];

    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = '合计';
      } else {
        // 这里可以根据需要自定义合计逻辑,只有属性为权重的时候才合计
        if (column.property.includes('Percent')) {
          if (data.length > 0) {
            let sum = 0;
            data.forEach((e2) => {
              if (typeof e2[`${column.property}`].value !== 'number') {
                sum += Number(e2[`${column.property}`].value);
              } else {
                sum += e2[`${column.property}`].value;
              }
            });
            sums[index] = sum.toFixed(4);
          } else {
            sums[index] = '-';
          }
        }
      }
    });
    return sums;
  }
};

/**初始化数据 */
const init = () => {
  if (props.isWebPagination) {
    data.total = props.tableData.length || 0;
    data.tableData = props.tableData.slice((data.page - 1) * data.range, data.page * data.range);
  } else {
    data.tableData = props.tableData;
  }
  watchData();

  nextTick(() => {
    watchData = watch(
      () => props.tableData,
      (val) => {
        init();
      },
      { deep: true },
      // { immediate: true },
    );
  });
};

// 这个仅限把第一列或者特定的列的样式给改背景色
const columnStyle = ({ column, columnIndex }) => {
  if (!props.isAddColumn) {
    if (props.CssColumn.includes(column.property) || columnIndex === props.columnIndex) {
      return { 'background-color': '#f6f6f6' };
    }
  }
};
// 表头样式
const headerCellStyleFun = ({ column }) => {
  if (column.label === '详细设计转样机' || column.label === '样机转小批生产' || column.label === '小批转批量验证' || column.label === '批量验证转批量生产') {
    return { 'font-size': '16px', 'background-color': '#d9d9d9' };
  }
};
// 表格行样式
const tableRowClassName = ({ row }) => {
  for (let key in row) {
    if (key.endsWith('IsCompliance') && row[key] === '否') {
      return 'select-row';
    }
  }
};
//表格选择数据，然后传出去
const handleSelectionChange = (row) => {
  emit('selectHandler', row);
};
</script>

<style lang="less" scoped>
.levelTable {
  background-color: #fff;
  .pagination {
    display: flex;
    justify-content: end;
    margin-top: 10px;
  }
  // border: 1px solid #d3d3d3;
  // :deep(.el-table) {
  //   .el-table__header {
  //     .is-group {
  //       tr {
  //         th {
  //           border-right: 1px solid #d3d3d3;
  //           border-bottom: 1px solid #d3d3d3;
  //         }
  //         &:first-child {
  //           th {
  //             border-bottom: 1px solid #dedede;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   .el-table__inner-wrapper {
  //     .el-table__body-wrapper {
  //       .el-scrollbar {
  //         .el-scrollbar__wrap {
  //           .el-scrollbar__view {
  //             table tbody tr td {
  //               border-right: 1px solid #d3d3d3;
  //               border-bottom: 1px solid #d3d3d3;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
}
:deep(.el-table .select-row) {
  background: rgb(247, 211, 2);
}
/* 针对第一列的表头和应用到数据的样式 */
:deep(.el-table tr th:first-child) {
  background-color: #f6f6f6;
  border-right: #e2e3e6;
}
:deep(.el-table tr td:first-child) {
  border-right: #e2e3e6;
}
:deep(.el-table thead.is-group th.el-table__cell) {
  background-color: #f6f6f6;
  border-right: 1px solid #e2e3e6;
}
</style>
