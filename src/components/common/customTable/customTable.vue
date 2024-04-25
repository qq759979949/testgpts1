<template>
  <div class="customTable">
    <vxe-grid
      ref="customTable"
      show-overflow="tooltip"
      show-header-overflow="tooltip"
      stripe
      :row-config="{ isHover: true, keyField: keyField }"
      :sort-config="{ multiple: false }"
      :loading="tableLoad"
      :data="Data.tableShowList"
      :columns="Data.showColumns"
      :columnConfig="{ resizable: true }"
      :checkbox-config="checkboxConfig"
      @checkbox-all="selectAllEvent"
      @checkbox-change="selectChangeEvent"
      @filter-change="filterChangeEvent"
    >
      <!-- 插槽 -->
      <template v-for="(item, index) in slotList" :key="index" #[item]="{ row }">
        <slot :name="item" v-bind="row" :index="index"></slot>
      </template>
      <!-- 设置表头 -->
      <template #setTableColumns>
        <el-link :style="{ fontSize: '16px' }" :underline="false" @click="setHeader">
          <el-icon><Setting /></el-icon>
        </el-link>
      </template>
    </vxe-grid>
    <!-- layout="total, prev, pager, next, sizes, jumper" -->
    <el-pagination
      v-if="Data.tableShowList.length > 0"
      v-model:current-page="Data.currentPage"
      v-model:page-size="Data.pageSize"
      layout="total, sizes, prev, pager, next"
      background
      :page-sizes="[5, 10, 20, 50, 100]"
      :total="Data.total"
      @current-change="pageChange"
    />
    <headerSetting
      v-model:isShow="Data.showHeaderSetting"
      @confirm="confirmHeader"
      :columns="tableColumns"
      :allColumns="allColumns"
      :selectedList="Data.showColumns"
      :tableName="tableName"
    ></headerSetting>
  </div>
</template>

<script setup>
import headerSetting from '../table/HeaderSetting.vue';
const props = defineProps({
  // 主键
  keyField: {
    type: String,
    default: 'oid',
  },
  /**tableLoad */
  tableLoad: {
    type: Boolean,
    default: false,
  },
  /**表格数据 */
  tableData: {
    type: Array,
    default: () => [],
  },
  /**表头数据 */
  /** 列
   * title -> 显示列标题，
   * field -> 数据对应字段名，
   * width -> 列宽
   * type -> 列类型（checkbox:复选框, seq:序号），
   * fixed -> 横向滚动时固定列
   * params -> 额外的参数（可以用来存放一些私有参数）
   * sortable -> 可排序
   * filters -> 筛选
   *    筛选select -> [{ label, value, data(必选和value一致，筛选判断时使用该字段) }]
   *    筛选输入框input -> [{ data: null }]
   *    filterRender: { name: 'FilterInput' }  默认input不是模糊查询，故使用 FilterInput->自定义输入框渲染器
   * slots -> 插槽：{
   *  default: 内容插槽名, header: 列表头插槽名, footer: 底部插槽名,
   *  edit: 可编辑框插槽名
   * }
   */
  tableColumns: {
    type: Array,
    default: () => [],
  },

  /**所有表头 */
  allColumns: {
    type: Array,
    default: () => [],
  },
  tableName: {
    type: String,
    default: '',
  },

  /**总数 */
  total: {
    type: Number,
    default: 0,
  },
  /**页面条数 */
  pageSize: {
    type: Number,
    default: 10,
  },

  /**是否前端分页 */
  isWebPagination: {
    type: Boolean,
    default: false,
  },
  /**是否分页 */
  showPage: {
    type: Boolean,
    default: false,
  },
});

/**页面数据 */
const Data = reactive({
  /**表格数据 */
  list: [], // 用于存储筛选后的数据
  tableShowList: [], // 当前展示数据
  checkList: [], // 选择的数据
  isAll: false, // 是否全选

  /**分页 */
  currentPage: 1,
  pageSize: 10,
  total: 0,

  /**总数 */
  totalTable: [],

  /**设置表头 */
  showHeaderSetting: false,
  showColumns: [],
});
onMounted(() => {
  Data.showColumns = props.tableColumns;
  Data.pageSize = props.pageSize;
});
const emit = defineEmits(['update:currentPage', 'update:pageSize', 'updateTableData', 'selectEvent', 'pageChange']);
watch(
  () => props.tableData,
  (val) => {
    init();
  },
);
watch(
  () => props.tableColumns,
  (val) => {
    Data.showColumns = val;
  },
);
/**分页 */
watch(
  () => Data.currentPage,
  (val) => {
    if (props.isWebPagination) {
      init();
    } else {
      emit('update:currentPage', val);
    }
  },
);
watch(
  () => Data.pageSize,
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
    Data.total = val;
  },
);

// 改变分页
const pageChange = () => {
  emit('pageChange');
};

// 自定义插槽合集
const slotList = computed(() => {
  const arr = [];
  props.tableColumns
    .filter((v) => v.slots && v.slots.header !== 'setTableColumns')
    .forEach((element) => {
      const slotObj = element.slots;
      Object.keys(slotObj).forEach((v) => {
        arr.push(slotObj[v]);
      });
    });
  return arr;
});
/**初始化数据 */
const init = () => {
  Data.list = [...props.tableData];
  if (props.isWebPagination) {
    Data.tableShowList = Data.list.slice((Data.currentPage - 1) * Data.pageSize, Data.currentPage * Data.pageSize);
  } else {
    Data.tableShowList = Data.list;
  }
  Data.tableShowList.forEach((v) => {
    Object.keys(v).forEach((k) => {
      if (v[k]?.constructor === Object) {
        v[k] = v[k].display;
      }
    });
  });
};
/**
 * 无效数据不能选择
 */
const checkboxConfig = reactive({
  // labelField: 'name',
  checkMethod: ({ row }) => {
    return !(row?.checkedOut && row.checkedOut === '是');
  },
});
/**
 * 选择功能
 */
const customTable = ref(null);
const selectChangeEvent = (e) => {
  const i = Data.checkList.findIndex((v) => v[props.keyField] == e.row[props.keyField]);
  if (e.checked) {
    i === -1 && Data.checkList.push(e.row);
  } else {
    i > -1 && Data.checkList.splice(i, 1);
  }
  emit('selectEvent', getAllCheckbox());
};
const selectAllEvent = (e) => {
  Data.isAll = e.checked;
  Data.checkList = Data.isAll ? [...Data.tableShowList] : [];
  // Data.checkList = Data.isAll ? [...Data.list] : [];
  // this.$refs.MultipleTable.setCheckboxRow(this.list, this.isAll)
  // this.setHtml()
  emit('selectEvent', getAllCheckbox());
};
// 获取所有勾选项
const getAllCheckbox = () => {
  return Data.checkList;
  // return [...this.$refs.MultipleTable.getCheckboxRecords(),...this.$refs.MultipleTable.getCheckboxReserveRecords()]
};
// 清除所有选中
const clearAllCheckbox = () => {
  customTable.value.clearCheckboxRow();
};

/**
 * 筛选
 */
const filterChangeEvent = ({ column, property, values, datas, filterList, $event }) => {
  console.log(filterList, 240);
  console.log(column);
  console.log(property);
  console.log(values);
  console.log(datas);
  console.log($event);

  // Data.total = filterList.length;
};

/**
 * 设置表头
 * */
const setHeader = () => {
  Data.showHeaderSetting = true;
};
const confirmHeader = (arr) => {
  Data.showColumns = arr;
  Data.showHeaderSetting = false;
  emit('updateTableData');
};
</script>

<style lang="less" scoped>
.customTable {
  background-color: #fff;
  :deep(.vxe-grid) {
    color: #333;
    .vxe-table {
      .vxe-table--header-wrapper {
        background-color: #e8ebf0;
        color: #333;
      }
      .vxe-header--column {
        .vxe-resizable {
          &::before {
            background-color: #e8ebf0;
          }
        }
      }
      .vxe-table--border-line {
        border: none;
      }
    }
  }

  :deep(.el-pagination) {
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 10px;
    padding-bottom: 10px;
    --el-pagination-button-bg-color: #fff;
    // --el-disabled-bg-color: rgba(245, 247, 250, 1);
    --el-pagination-button-height: 28px;
    .btn-prev,
    .btn-next {
      background-color: var(--el-disabled-bg-color);
    }
    .btn-prev:disabled,
    .btn-next:disabled {
      background-color: var(--el-disabled-bg-color);
    }
    .el-pager {
      li {
        border: 1px solid #eee;
      }
    }
  }
}
</style>
