<!--表格组件备份-->
<template>
  <div class="pi-table" v-loading="tableLoad">
    <el-table
      border
      ref="piTable"
      :class="{ border }"
      style="width: 100%"
      :height="tableHeight"
      :data="showData"
      table-layout="fixed"
      :row-key="rowKey"
      :tree-props="defaultProps"
      :stripe="stripe"
      @select="tableSelect"
      @select-all="selectAll"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="selectable" type="selection" width="55" />
      <slot></slot>
      <el-table-column v-if="isIndex" type="index" label="序列" width="80" />
      <el-table-column
        v-for="item in showColumns"
        :label="item.title"
        :prop="item.dataIndex"
        :width="item.width"
        :min-width="item.minWidth || item.width"
        :show-overflow-tooltip="item.ellipsis"
        :column-key="item.filters"
        :key="item.dataIndex"
      >
        <!-- 表头筛选 -->
        <template #header="scope" v-if="item.filters">
          <span>{{ scope.column.label }}</span>
          <el-popover placement="bottom-start" :width="264" :hide-after="10" trigger="click">
            <template #reference>
              <el-link class="filter-btn" :underline="false">
                <el-icon size="12">
                  <svg><use xlink:href="#icon-filter"></use></svg>
                </el-icon>
              </el-link>
            </template>
            <div class="table-filter-box">
              <div class="filter-top">
                <div class="sub-title">快捷操作</div>
                <el-link class="block-btn" @click="onSort(scope.column, 'up')" :underline="false">
                  <el-icon><SortUp /></el-icon>
                  升序排列
                </el-link>
                <el-link @click="onSort(scope.column, 'down')" :underline="false">
                  <el-icon><SortDown /></el-icon>
                  降序排列
                </el-link>
              </div>
              <div class="filter-bottom">
                <div class="sub-title">
                  筛选条件
                  <el-link class="title-btn" type="primary" :underline="false" @click="clearFilter(scope.column, item, item.filters)">清空</el-link>
                </div>
                <div class="sub-section">{{ scope.column.label }}选择</div>
                <!-- 选择 -->
                <el-select
                  v-if="item.filters === 'select'"
                  multiple
                  :teleported="false"
                  @change="changeFilter(scope.column, item, item.filters)"
                  v-model="scope.column.filteredValue"
                >
                  <el-option v-for="(val, index) in item.filterList" :key="index" :value="val" :label="val" />
                </el-select>
                <!-- 时间 -->
                <el-date-picker
                  v-if="item.filters === 'date'"
                  type="daterange"
                  style="width: 90%"
                  :teleported="false"
                  v-model="scope.column.filteredValue"
                  @change="changeFilter(scope.column, item, item.filters)"
                />
                <!-- input -->
                <el-input
                  v-if="item.filters === 'input'"
                  :placeholder="'请输入' + item.title"
                  @input="inputSearch(scope.column, item, item.filters)"
                  v-model="scope.column.filteredValue"
                ></el-input>
              </div>
            </div>
          </el-popover>
        </template>
        <template #header="scope" v-else>
          <!-- 表头超出隐藏，移入显示悬浮框 -->
          <!-- <div @onMouseOver="onMouseOver('refName' + scope.$index)">
            <el-tooltip
              :disabled="isShowTooltip"
              :content="item.title"
              placement="top"
            >
              <div class="columnTitle">
                <span :ref="'refName' + scope.$index">{{ item.title }}</span>
              </div>
            </el-tooltip>
          </div> -->
          <div class="columnTitle">
            <el-text v-if="item.required" type="danger" style="margin-right: 4px">*</el-text>
            <span :ref="'refName' + scope.$index">{{ item.title }}</span>
          </div>
        </template>

        <!-- slot插槽 -->
        <template #default="scope">
          <slot :name="item.dataIndex" v-bind="scope">
            <!-- {{ scope.row[item.dataIndex]?.display || scope.row[item.dataIndex] }} -->
            {{ getDisplay(scope, item) }}
          </slot>
        </template>
      </el-table-column>
      <!-- 设置按钮列 -->
      <el-table-column v-if="isShowSetting" :width="45" fixed="right" align="right">
        <template #header>
          <el-link :style="{ fontSize: '16px' }" :underline="false" @click="setHeader">
            <el-icon>
              <Setting />
            </el-icon>
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- layout="total, prev, pager, next, sizes,jumper" -->
    <el-pagination
      v-if="pagination"
      v-model:current-page.sync="page"
      v-model:page-size.sync="range"
      layout="total, sizes, prev, pager, next"
      background
      small
      :page-sizes="[5, 10, 20, 50, 100]"
      :total="isWebPagination ? webTotal : total"
    />
    <headerSetting
      v-model:isShow="showHeaderSetting"
      @confirm="confirmHeader"
      :columns="columns"
      :allColumns="allColumns"
      :selectedList="showColumns"
      :tableName="tableName"
    ></headerSetting>
  </div>
</template>
<script>
import { Search, Ship } from '@element-plus/icons-vue';
import headerSetting from './HeaderSetting.vue';
import { shallowRef } from 'vue';
import * as _ from 'lodash';
export default {
  // name: 'PiTable',
  components: {
    headerSetting,
  },
  props: {
    /** 树状参数 */
    defaultProps: {
      type: Object,
      default: () => {},
    },
    /**斑马线 */
    stripe: {
      type: Boolean,
      default: true,
    },
    /**是否边框 */
    border: {
      type: Boolean,
      default: false,
    },
    /**接收父组件表格数据 */
    data: {
      type: Array,
      default: () => [],
    },
    /**接收父组件表头 */
    columns: {
      type: Array,
      default: () => [],
    },
    /**所有表头 */
    allColumns: {
      type: Array,
      default: () => [],
    },
    //是否需要勾选
    selectable: {
      type: Boolean,
      default: false,
    },
    //是否需要序列
    isIndex: {
      type: Boolean,
      default: false,
    },
    /**唯一值 */
    rowKey: {
      type: String,
      default: 'oid',
    },
    /**loading */
    tableLoad: {
      type: Boolean,
      default: false,
    },
    /**是否显示表头设置 */
    isShowSetting: {
      type: Boolean,
      default: true,
    },
    /**设置表头内布值 */
    tableName: {
      type: String,
      default: '',
    },
    /**是否分页 */
    pagination: {
      type: Boolean,
      default: false,
    },
    /**分页-当前页码 */
    currentPage: {
      type: Number,
      default: 1,
    },
    /**分页-每页显示数量 */
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
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      selectArr: [],
      showColumns: [],
      showData: [],
      showHeaderSetting: false,
      Search: shallowRef(Search),
      tempArray: [],
      isShowTooltip: false,
    };
  },
  watch: {
    /**表头 */
    columns: {
      handler(val) {
        this.showColumns = [];
        val.forEach((column) => {
          if (column.filters) {
            if (column.filters === 'select') {
              column.filterList = [];
              column.filterVal = [];
              this.showData.forEach((item) => {
                column.filterList.push(item[column.dataIndex]);
              });
              column.filterList = Array.from(new Set(column.filterList));
            }
          }
          if (column.dataIndex === 'number') column.width = 120;
          this.showColumns.push(column);
        });
      },
      immediate: true,
    },
    /**数据 */
    data: {
      handler(val) {
        this.showData = [];
        if (val.length) {
          val.forEach((item) => {
            this.showData.push(item);
          });
        }
      },
      deep: true,
      immediate: true,
    },
    /**数据处理 */
    showData: {
      handler(val) {
        this.showColumns.forEach((column) => {
          if (column.filters) {
            if (column.filters === 'select') {
              column.filterList = [];
              column.filterVal = [];
              this.data.forEach((item) => {
                column.filterList.push(item[column.dataIndex]);
              });
              column.filterList = Array.from(new Set(column.filterList));
            }
          }
        });
      },
      deep: true,
      immediate: true,
    },
    /**前端分页 */
    isWebPagination: {
      handler(val) {
        if (val) {
          this.webTotal = this.data.length;
          let list = [...this.data];
        }
      },
      immediate: true,
    },
  },
  computed: {
    page: {
      get() {
        return this.currentPage;
      },
      set(val) {
        this.$emit('update:currentPage', val);
      },
    },
    range: {
      get() {
        return this.pageSize;
      },
      set(val) {
        this.$emit('update:pageSize', val);
      },
    },
  },
  methods: {
    // 获取表格数据slot里面display的值
    getDisplay(scope, item) {
      let data = scope.row[item.dataIndex];
      if (data?.constructor === Object && 'display' in data) {
        return scope.row[item.dataIndex].display;
      } else {
        return scope.row[item.dataIndex];
      }
    },
    // 表头超出隐藏
    onMouseOver(refName) {
      let parentWidth = this.$refs[refName][0].parentNode.offsetWidth;
      let contentWidth = this.$refs[refName][0].offsetWidth;
      // 判断是否开启tooltip功能
      if (contentWidth > parentWidth) {
        this.isShowTooltip = false;
      } else {
        this.isShowTooltip = true;
      }
    },

    handleSelectionChange(val) {
      // this.selectArr = [];
      // val.forEach((item) => {
      //   this.selectArr.push(item[this.rowKey]);
      // });
      // this.$emit('selectionChange', this.selectArr, val);
      // this.$emit('selectionChange', val);
    },
    /**
     * 单选
     * @row {object} 单选的数据
     * */
    singleChecked(row) {
      this.$refs.piTable.clearSelection();
      this.$refs.piTable.toggleRowSelection(row);
    },
    tableSelect(val, rows) {
      /**
       * val选中的数据
       * rows选中的那一行
       */
      this.$emit('selectionChange', val, rows);
    },
    selectAll(val) {
      /**
       * 手动勾选全部
       */
      this.$emit('selectionChange', val);
    },
    /**
     * 排序
     * @onSort 排序总方法
     * @numSort 数字排序
     * @textSort 文字排序
     * @timeSort 时间排序
     */
    onSort(col, type) {
      if (col.columnKey === 'select' || col.columnKey === 'input') {
        this.textSort(this.showData, col.property, type);
      } else if (col.columnKey === 'date') {
        this.timeSort(this.showData, col.property, type);
      }
    },
    numSort(arr, property, type) {
      arr.sort(function (a, b) {
        let aInfo = a[property] ? a[property] : 0;
        let bInfo = b[property] ? b[property] : 0;
        if (type === 'up') {
          return aInfo - bInfo;
        } else {
          return bInfo - aInfo;
        }
      });
    },
    textSort(arr, property, type) {
      arr.sort((a, b) => {
        let aInfo = a[property] ? a[property] : '';
        let bInfo = b[property] ? b[property] : '';
        if (type === 'up') {
          return aInfo.localeCompare(bInfo, 'zh');
        } else {
          return bInfo.localeCompare(aInfo, 'zh');
        }
      });
    },
    timeSort(arr, property, type) {
      arr.sort(function (a, b) {
        let aInfo = a[property] ? a[property] : '';
        let bInfo = b[property] ? b[property] : '';
        if (type === 'up') {
          return aInfo > bInfo ? 1 : -1;
        } else {
          return aInfo < bInfo ? 1 : -1;
        }
      });
    },
    /**
     * 筛选
     * @changeFilter 选择后数据变化
     * @inputSearch input输入框输入搜索数据
     * @clearFilter 清除数据
     */
    changeFilter(column, info, filterType) {
      const filterVal = column.filteredValue;
      info.filterVal = filterVal;
      this.showData = [];
      let filterCollect = [];
      this.showColumns.forEach((column) => {
        if (column.filterVal && column.filterVal.length > 0) {
          filterCollect.push({
            key: column.dataIndex,
            value: column.filterVal,
          });
        }
      });
      this.data.forEach((item) => {
        let flag = true;
        filterCollect.forEach((filter) => {
          if (filterType === 'input') {
            if (!(item[filter.key].indexOf(filter.value) > -1)) {
              flag = false;
            }
          } else if (filterType === 'select') {
            if (!filter.value.includes(item[filter.key])) {
              flag = false;
            }
          } else if (filterType === 'date') {
            let startTime = new Date(filter.value[0]).getTime();
            let endTime = new Date(filter.value[1]).getTime();
            let dataDate = new Date(item[filter.key]).getTime();
            if (!(startTime <= dataDate && endTime >= dataDate)) {
              flag = false;
            }
          }
        });
        if (flag) {
          this.showData.push(item);
        }
      });
    },
    inputSearch(column, info, filterType) {
      setTimeout(() => {
        this.changeFilter(column, info, filterType);
      }, 1000);
    },
    clearFilter(column, info, filterType) {
      column.filteredValue = [];
      info.filterVal = [];
      this.showData = [];
      let filterCollect = [];
      this.showColumns.forEach((column) => {
        if (column.filterVal && column.filterVal.length > 0) {
          filterCollect.push({
            key: column.dataIndex,
            value: column.filterVal,
          });
        }
      });
      this.data.forEach((item) => {
        let flag = true;
        filterCollect.forEach((filter) => {
          if (filterType === 'input') {
            if (!(item[filter.key].indexOf(filter.value) > -1)) {
              flag = false;
            }
          } else if (filterType === 'select') {
            if (!filter.value.includes(item[filter.key])) {
              flag = false;
            }
          }
        });
        if (flag) {
          this.showData.push(item);
        }
      });
    },
    /**
     * 设置表头
     * */
    setHeader() {
      this.showHeaderSetting = true;
    },
    confirmHeader(arr) {
      this.showColumns = arr;
      this.showHeaderSetting = false;
      this.$emit('updateTableData');
    },
    pageChange(val) {},
  },
};
</script>

<style lang="less" scoped>
.pi-table {
  // height: 100%;
  display: flex;
  flex-direction: column;
  --el-transparent-bg-color: rgba(50, 205, 50, 0.1);

  .table-nav {
    display: flex;
    align-items: baseline;
    height: 36px;
    margin-bottom: 10px;
    line-height: 36px;
    background: var(--el-transparent-bg-color);
    border: 1px solid var(--el-color-primary);
    padding: 0 10px;
    font-size: 14px;
    border-radius: 5px;
    a,
    span {
      font-size: 16px;
      padding: 0 5px;
    }
  }
  .el-table {
    flex: 1;
    --el-table-header-bg-color: #f5f7fa;
    --el-table-header-text-color: #333;
    // --el-table-row-hover-bg-color: #f8faf7;
  }
  :deep(.el-pagination) {
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 10px;
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
  // .el-pagination   {
  //   .el-pager {
  //     li
  //   }
  // }
  :deep(.el-table) {
    th.el-table__cell {
      // background-color: var(--el-table-header-bg-color);
      background-color: #e8ebf0;
    }
    thead {
      color: var(--el-table-header-text-color);
    }
    .el-table__cell {
      padding: 0;
      height: 46px;
      line-height: 46px;
    }
    .el-table__body tr.hover-row > td.el-table__cell {
      background-color: var(--el-table-row-hover-bg-color);
    }
    .el-pagination.is-background {
      .el-pager li {
        border: 1px solid #e7e9ee;
        // background-color: #fff;
        font-weight: 400;
        // color: #333;
      }
      .el-pager li:not(.disabled).is-active {
        // background: rgba(91, 183, 59, 0.1);
        border: none;
        // color: var(--el-color-primary);
        font-weight: 400;
      }
      .btn-prev,
      .btn-next {
        background-color: var(--el-disabled-bg-color);
      }
    }
    .el-table__fixed-right-patch {
      top: 0;
      border: 1px solid #fff;
    }
    th.el-table__cell {
      border-right: 1px solid #ebeef5;
    }
    .el-table__fixed-right {
      top: -1px;
    }
    .el-table--border,
    .el-table--group {
      border: 0px;
    }
    .el-table__cell {
      border-right: 0;
    }
    &::before {
      width: 0px;
    }
    &::after {
      width: 0px;
    }
    .el-table__border-left-patch {
      width: 0;
    }
  }
  .border {
    :deep(th.el-table__cell) {
      border-right: 1px solid #e2e3e6;
    }
    :deep(.el-table__cell) {
      border-right: 1px solid #e2e3e6;
    }
  }
  .filter-btn {
    vertical-align: baseline;
    margin-left: 4px;
  }
}
</style>

<style lang="less">
.table-filter-box {
  user-select: none;
  .filter-top {
    padding: 6px 10px 10px 10px;
    border-bottom: 1px solid #ddd;
    .sub-title {
      color: #999;
      margin-bottom: 10px;
    }
    .block-btn {
      display: block;
      margin-bottom: 4px;
    }
  }
  .filter-bottom {
    padding: 6px 10px;
    .sub-title {
      color: #999;
      margin-bottom: 10px;
      .title-btn {
        vertical-align: top;
        float: right;
        font-size: 12px;
      }
    }
    .sub-section {
      margin-bottom: 10px;
    }
  }
}
.pi-table {
  .el-dialog__header {
    border-bottom: 1px solid #ddd;
    margin-right: 0;
  }
  .el-dialog__body {
    padding: 10px 20px 20px 20px;
  }
  .el-dialog__footer {
    border-top: 1px solid #ddd;
    padding: 10px 20px;
  }
}
.columnTitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
