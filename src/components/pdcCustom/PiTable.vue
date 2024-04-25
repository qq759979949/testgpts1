<template>
  <div class="pi-table">
    <el-table
      ref="pi-table"
      style="width: 100%"
      :data="isFrontEnd && pagination ? showData.slice((page1 - 1) * range1, page1 * range1) : showData"
      :size="'small'"
      fit
      border
      v-loading="tableLoad"
      :max-height="height ? height : '100%'"
      @selection-change="handleSelectionChange"
      :rowKey="rowKey"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :cell-style="columnStyle"
      :span-method="arraySpanMethod"
      @row-contextmenu="rightClickRow"
    >
      <el-table-column v-if="selectable" type="selection" width="55" />
      <el-table-column v-if="singleSelect" width="30">
        <template #default="scope">
          <el-checkbox @change="singleSelectChange($event, scope.row)" v-model="scope.row.selected"></el-checkbox>
        </template>
      </el-table-column>
      <slot></slot>
      <el-table-column
        v-for="item in showColumns"
        :label="item.title"
        :prop="item.dataIndex"
        :width="item.width"
        :show-overflow-tooltip="item.ellipsis"
        :column-key="item.filters"
        :key="item.dataIndex"
      >
        <!-- 表头筛选 -->
        <template #header="scope" v-if="item.filters">
          <span>{{ scope.column.label }}</span>
          <el-popover placement="top-start" :width="264" trigger="click">
            <template #reference>
              <el-link class="filter-btn" :underline="false">
                <el-icon><Filter /></el-icon>
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
                  <el-link class="title-btn" type="primary" :underline="false" @click="clearFilter(scope.column, item)">清空</el-link>
                </div>
                <div class="sub-section">{{ scope.column.label }}选择</div>
                <el-select v-if="item.filters === 'select'" multiple :teleported="true" @change="changeFilter(scope.column, item, 'select')" v-model="scope.column.filteredValue">
                  <el-option v-for="(val, index) in item.filterList" :key="index" :value="val" :label="val" />
                </el-select>
                <el-date-picker
                  type="daterange"
                  style="width: 100%"
                  :teleported="true"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="changeFilter(scope.column, item, 'date')"
                  v-model="scope.column.filteredValue"
                  v-if="item.filters === 'date'"
                />
              </div>
            </div>
          </el-popover>
        </template>
        <template #header="scope" v-else>
          <div @onMouseOver="onMouseOver('refName' + scope.$index)">
            <el-tooltip :disabled="isShowTooltip" :content="item.title" placement="top">
              <div class="columnTitle">
                <span v-if="item.rules === true || item.rules">
                  <i class="iconfont icon-bitian" style="font-size: 16px; color: red"></i>
                </span>
                <span :ref="'refName' + scope.$index">{{ item.title }}</span>
              </div>
            </el-tooltip>
          </div>
        </template>

        <!-- slot插槽 -->
        <template #default="scope">
          <slot :name="item.dataIndex" v-bind="scope">
            {{ scope.row[item.dataIndex]?.display || scope.row[item.dataIndex] }}
          </slot>
          <!-- 多层表头 -->
          <el-table-column
            v-for="subItem in item.children"
            v-if="item.children && item.children.length > 0"
            :label="subItem.title"
            :prop="subItem.dataIndex"
            :width="subItem.width"
            :min-width="subItem.minWidth || subItem.width"
            :show-overflow-tooltip="subItem.ellipsis"
            :column-key="subItem.filters"
            :key="subItem.dataIndex"
            :fixed="subItem.fixed"
          >
            <template #default="scope">
              <slot :name="subItem.dataIndex" v-bind="scope">
                {{ scope.row[subItem.dataIndex]?.display || scope.row[subItem.dataIndex] }}
              </slot>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
      <!-- 设置按钮列 -->
      <el-table-column v-if="isShowSetting" :width="40" fixed="right" align="right">
        <template #header>
          <el-link :style="{ fontSize: '16px' }" :underline="false" @click="setHeader">
            <el-icon><Setting /></el-icon>
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页自己写插槽 template #pagination-->
    <!-- <slot name="pagination"></slot> -->
    <!-- <el-pagination
      v-if="pagination"
      v-model:current-page="page"
      v-model:page-size="range"
      layout="total, prev, pager, next, sizes,jumper"
      :total="total"
      @current-change="pageChange"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
    /> -->
    <el-pagination
      v-if="pagination && isFrontEnd"
      v-model:current-page.sync="page1"
      v-model:page-size.sync="range1"
      layout="total, prev, pager, next, sizes,jumper"
      background
      :page-sizes="[10, 20, 30, 100]"
      :total="totals"
      small
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-pagination
      v-if="pagination && !isFrontEnd"
      v-model:current-page.sync="page"
      v-model:page-size.sync="range"
      layout="total, prev, pager, next, sizes,jumper"
      background
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      small
    />
    <headerSetting v-model:isShow="showHeaderSetting" @confirm="confirmHeader" :tableName="tableName" :pageLabelName="pageLabelName"></headerSetting>
  </div>
</template>
<script>
import { Search, Ship } from '@element-plus/icons-vue';
import headerSetting from './HeaderSetting.vue';
import { shallowRef } from 'vue';
import * as _ from 'lodash';
export default {
  name: 'PiTable',
  components: {
    headerSetting,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    singleSelect: {
      type: Boolean,
      default: false,
    },
    radionSelect: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Boolean,
      default: false,
    },
    isShowSetting: {
      type: Boolean,
      default: true,
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    tableLoad: {
      type: Boolean,
      default: false,
    },
    tableName: {
      type: String,
      default: '',
    },
    pageLabelName: {
      type: String,
      default: '',
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 0,
    },
    isFrontEnd: {
      type: Boolean,
      default: true,
    },
    height: String,
    CssColumn: {
      type: Array,
      default: () => [],
    },
    // 第几列需要添加背景色
    columnIndex: {
      type: Number,
      default: 0,
    },
    /**是否需要右键 */
    isrightClick: {
      type: Boolean,
      default: false,
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
      selectedRow: '',
      isShowTooltip: false,
      page1: 1,
      range1: 10,
      totals: 0,
      checked: false,
    };
  },
  watch: {
    columns: {
      handler(val) {
        this.showColumns = [];
        val.forEach((column) => {
          // if (column.filters) {
          //   if (column.filters === "select") {
          //     column.filterList = [];
          //     column.filterVal = [];
          //     this.data.forEach((item) => {
          //       column.filterList.push(item[column.dataIndex]);
          //     });
          //     column.filterList = Array.from(new Set(column.filterList));
          //   }
          // }
          this.showColumns.push(column);
        });
      },
      immediate: true,
      deep: true,
    },
    data: {
      handler(val) {
        this.showData = [];
        val.forEach((item) => {
          const obj = _.cloneDeep(item);
          obj.selected = false;
          this.showData.push(obj);
        });
        this.showColumns.forEach((column) => {
          if (column.filters) {
            if (column.filters === 'select') {
              column.filterList = [];
              column.filterVal = [];
              val.forEach((item) => {
                column.filterList.push(item[column.dataIndex]);
              });
              column.filterList = Array.from(new Set(column.filterList));
            }
          }
        });
        this.totals = this.showData.length;
      },
      deep: true,
      immediate: true,
    },
    showData: {
      handler(val) {
        // this.showColumns.forEach((column) => {
        //   if (column.filters) {
        //     if (column.filters === "select") {
        //       column.filterList = [];
        //       column.filterVal = [];
        //       this.data.forEach((item) => {
        //         column.filterList.push(item[column.dataIndex]);
        //       });
        //       column.filterList = Array.from(new Set(column.filterList));
        //     }
        //   }
        // })
      },
      deep: true,
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
    pageData() {
      if (this.pagination) {
        // 是否需要分页
        //   let arr = []
        //   this.showData.forEach((item, index) => {
        //     if ( index > (this.page - 1) * this.range - 1 && index < this.page * this.range ) {
        //       arr.push(item);
        //     }
        //   })
        //   return arr
        // } else {
        return this.showData;
      }
    },
  },
  methods: {
    rightClickRow(row, column, event) {
      if (!this.isrightClick) return;
      event.preventDefault();
      this.$emit('rightClick', row, event);
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
      // 多选
      if (!this.radionSelect) {
        this.selectArr = [];
        val.forEach((item) => {
          this.selectArr.push(item[this.rowKey]);
        });
        this.$emit('selectionChange', this.selectArr, val);
      } else {
        if (val.length == 1) {
          // 单选 第一次选择的时候
          this.$refs['pi-table'].toggleRowSelection(val[0], true);
          this.$emit('selectionChange', val);
        } else if (val.length !== 1) {
          const newRows = val.filter((it, index) => {
            if (index == val.length - 1) {
              this.$refs['pi-table'].toggleRowSelection(it, true);
              return true;
            } else {
              this.$refs['pi-table'].toggleRowSelection(it, false);
              return false;
            }
          });
          this.selectArr = newRows;
          this.$emit('selectionChange', this.selectArr, val);
        }
      }
    },
    onSort(col, type) {
      if (col.columnKey === 'select') {
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
    clearFilter(column, info) {
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
          if (!filter.value.includes(item[filter.key])) {
            flag = false;
          }
        });
        if (flag) {
          this.showData.push(item);
        }
      });
      if (this.isFrontEnd) {
        this.page1 = 1;
        this.totals = this.showData.length;
      }
    },
    // 筛选
    changeFilter(column, info) {
      const filterVal = column.filteredValue;
      info.filterVal = filterVal;
      this.showData = [];
      // filterCollect.push()
      let filterCollect = [];
      this.showColumns.forEach((column) => {
        if (column.filterVal && column.filterVal.length > 0) {
          filterCollect.push({
            key: column.dataIndex,
            value: column.filterVal,
            type: column.title.includes('时间') ? 'date' : 'select',
          });
        }
      });
      this.data.forEach((item) => {
        let flag = true;
        filterCollect.forEach((filter) => {
          if (filter.type === 'select') {
            if (!filter.value.includes(item[filter.key])) {
              flag = false;
            }
          }
          if (filter.type === 'date') {
            if (!this.judgeDate(item[filter.key], filter.value[0], filter.value[1])) {
              flag = false;
            }
          }
        });
        if (flag) {
          this.showData.push(item);
        }
      });
      if (this.isFrontEnd) {
        this.page1 = 1;
        this.totals = this.showData.length;
      }
    },
    judgeDate(curDate, beginDate, endDate) {
      let newCurDate = new Date(curDate),
        newBeginDate = new Date(beginDate),
        newEndDate = new Date(endDate);
      if (newCurDate >= newBeginDate && newCurDate <= newEndDate) {
        return true;
      }
      return false;
    },
    setHeader() {
      this.showHeaderSetting = true;
    },
    confirmHeader(arr) {
      this.showColumns = arr;
      this.showHeaderSetting = false;
      this.$emit('updateTableData');
    },
    handleSizeChange(val) {
      this.page1 = 1;
      this.range1 = val;
      this.$emit('handleSizeChange');
    },
    handleCurrentChange(val) {
      this.page1 = val;
      this.$emit('handleCurrentChange');
    },
    clearSelection() {
      this.$refs['pi-table'].clearSelection();
    },
    singleSelectChange(val, obj) {
      if (!val) {
        this.resetChecked();
      } else {
        this.resetChecked(obj.id);
      }
      if (val) {
        this.$emit('selectionChange', obj);
      } else {
        this.$emit('selectionChange', {});
      }
    },
    resetChecked(id) {
      // 单选专用
      this.showData.forEach((item) => {
        item.selected = item.id === id;
      });
    },
    toggleSelection(row) {
      this.$refs['pi-table'].toggleRowSelection(row, true);
    },
    // 某列样式
    columnStyle({ column }) {
      if (this.CssColumn.includes(column.property)) {
        return { 'background-color': '#f5f7fa' };
      }
    },
    flitterData(arr) {
      let spanOneArr = [];
      let concatOne = 0;
      arr.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
        } else {
          if (item.module === arr[index - 1].module) {
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }
        }
      });
      return {
        one: spanOneArr,
      };
    },
    // 合并
    arraySpanMethod({ column, rowIndex, columnIndex }) {
      if (this.CssColumn.includes(column.property)) {
        if (columnIndex === 0) {
          const _row = this.flitterData(this.showData).one[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col,
          };
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pi-table {
  height: 100%;
  width: 100%;
  display: flex;
  font-size: 1rem;
  flex-direction: column;
  --el-transparent-bg-color: rgba(50, 205, 50, 0.1);
  .el-table--small {
    font-size: 1rem;
  }
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
    --el-table-row-hover-bg-color: #f8faf7;
  }
  .el-pagination {
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 10px;
    --el-pagination-button-bg-color: #fff;
    --el-disabled-bg-color: rgba(245, 247, 250, 1);
    --el-pagination-button-height: 28px;
  }
  &::v-deep {
    .el-table th.el-table__cell {
      background-color: var(--el-table-header-bg-color);
    }
    .el-table thead {
      color: var(--el-table-header-text-color);
    }
    .el-table .el-table__cell {
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
        background-color: #fff;
        font-weight: 400;
        color: #333;
      }
      .el-pager li:not(.disabled).is-active {
        background: var(--el-color-primary);
        border: none;
        color: #fff;
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
    .el-table th.el-table__cell {
      border-right: 1px solid #ebeef5;
    }
    .el-table__fixed-right {
      top: -1px;
    }
    .el-table--border,
    .el-table--group {
      border: 0px;
    }
    .el-table--border .el-table__cell {
      border-right: 0px;
    }
    .el-table--border::before,
    .el-table__fixed-right::before,
    .el-table--group::before {
      width: 0px;
    }
    .el-table--border::after,
    .el-table--group::after {
      width: 0px;
    }
    .el-table__border-left-patch {
      width: 0;
    }
    .el-table__inner-wrapper::before {
      width: 0;
    }
  }
  .filter-btn {
    vertical-align: baseline;
    margin-left: 4px;
  }
}
:deep(.el-table) {
  .el-table__expand-icon {
    width: 13px;
    height: 13px;
    background: url('@/assets/img/展开.png') no-repeat;
    background-size: 100% 100%;
    margin-right: 10px;

    .el-icon {
      display: none;
    }
  }
  .el-table__expand-icon--expanded {
    transform: none;
    background: url('@/assets/img/折叠.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>

<style lang="scss">
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
  .el-table.is-scrolling-left .el-table-fixed-column--right.is-first-column::before {
    box-shadow: none !important;
  }
  .el-table.is-scrolling-middle .el-table-fixed-column--right.is-first-column::before {
    box-shadow: none !important;
  }
}
.columnTitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
