<!-- 一级表头 
  此表格无分页
  表头插槽： <template #表头label="column">{{ column.label }}</template> 
  表格插槽:  <template #属性名="scope">{{ scope.row.label }}</template> 
-->
<template>
  <div class="levelTable">
    <el-table :data="data.tableData" :height="tableHeight" style="width: 100%" @selection-change="handleSelectionChange" :cell-style="columnStyle" fit :border="border">
      <!-- 这个是复选框 -->
      <el-table-column v-if="isCheckBox" prop="checkBox" type="selection" width="55" />
      <el-table-column
        v-for="(item, index) in data.columns"
        :prop="item.dataIndex"
        :label="item.label"
        :key="index"
        :sortable="item.sortable"
        :width="item.width"
        :header-align="'center'"
        :align="'center'"
        :fixed="item.fixed"
        :show-summary="isShowSummary"
        :summary-method="getTotal"
        :sum-text="sumText"
      >
        <!-- 这个是表头的插槽 -->
        <template #header="{ column }">
          <slot :name="column.label" v-bind="column" :key="index">
            {{ column.label }}
          </slot>
        </template>
        <!-- 这个是表数据的插槽 -->
        <template #default="scope">
          <slot :name="item.scopeSlot || item.dataIndex" v-bind="scope">
            {{ scope.row[item.dataIndex]?.display || scope.row[item.dataIndex] }}
          </slot>
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
  // 边框
  border: {
    type: Boolean,
    defualt: false,
  },
  // 想要添加 表头列的背景色的样式, 里面是表头属性
  CssColumn: {
    type: Array,
    default: () => ['member'],
  },
  // 第几列需要添加背景色
  columnIndex: {
    type: Number,
    default: 0,
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

const emit = defineEmits(['selectHandler']);

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
              sum += e2[`${column.property}`].value;
            });
            sums[index] = sum;
          } else {
            sums[index] = '-';
          }
        }
      }
    });
    return sums;
  }
};

// 这个仅限把第一列或者特定的列 的样式给改背景色
const columnStyle = ({ column, columnIndex }) => {
  if (props.CssColumn.includes(column.property) || columnIndex === props.columnIndex) {
    return { 'background-color': '#f6f6f6' };
  }
};

//表格选择数据，然后传出去
const handleSelectionChange = (row, rowKey) => {
  emit('selectHandler', row);
};
</script>

<style lang="less" scoped>
.levelTable {
  background-color: #fff;
}

.pagination {
  display: flex;
  justify-content: end;
  margin-top: 10px;
}

/* 针对第一列的表头和应用到数据的样式 */
:deep(.el-table tr th:first-child) {
  background-color: #f6f6f6;
  border-right: #f6f6f6;
}
:deep(.el-table tr td:first-child) {
  // background-color: #f5f7fa;
  border-right: #f6f6f6;
}
:deep(.el-table thead.is-group th.el-table__cell) {
  background-color: #f6f6f6;
}
</style>
