import VXETable from 'vxe-table';
import FilterInput from '@/components/common/customTable/filterComponents/FilterInput.vue';
import FilterSelect from '@/components/common/customTable/filterComponents/FilterSelect.vue';
import FilterDate from '@/components/common/customTable/filterComponents/FilterDate.vue';

// 下拉框筛选
VXETable.renderer.add('FilterSelect', {
  // 筛选模板
  renderFilter(renderOpts, params) {
    return <FilterSelect params={params} onClear={this.filterResetMethod}></FilterSelect>;
  },
  // 重置数据方法
  filterResetMethod(params) {
    const { options } = params;
    options.forEach((option) => {
      option.data.value = null;
    });
  },
  // 筛选方法
  filterMethod({ option, row, column }) {
    const { data } = option;
    const cellValue = row[column.field].toString();
    if (cellValue) {
      return cellValue.indexOf(data.value) > -1;
    }
    return false;
  },
});

// 时间过滤
VXETable.renderer.add('FilterDate', {
  // 筛选模板
  renderFilter(renderOpts, params) {
    return <FilterDate params={params} onClear={this.filterResetMethod}></FilterDate>;
  },
  // 重置数据方法
  filterResetMethod(params) {
    const { options } = params;
    options.forEach((option) => {
      option.data = [];
    });
  },
  // 筛选方法
  filterMethod({ option, row, column }) {
    const { data } = option;
    const cellValue = row[column.field];
    const time = new Date(cellValue).getTime();
    const time1 = new Date(data[0]).getTime();
    const time2 = new Date(data[1]).getTime();
    if (cellValue) {
      return time >= time1 && time <= time2;
    }
    return false;
  },
});

// 创建一个简单的输入框筛选
VXETable.renderer.add('FilterInput', {
  // 筛选模板
  renderFilter(renderOpts, params) {
    // return <filter-input params={params}></filter-input>;
    return [<FilterInput onReset={() => this.reset(params)} params={params}></FilterInput>];
  },
  reset(params) {
    params.$panel.resetFilter();
  },
  // 重置数据方法
  filterResetMethod(params) {
    const { options } = params;
    options.forEach((option) => {
      option.data = '';
    });
  },
  // 重置筛选复原方法（当未点击确认时，该选项将被恢复为默认值）
  filterRecoverMethod({ option }) {
    option.data = '';
  },
  // 筛选方法
  filterMethod(params) {
    const { option, row, column } = params;
    const { data } = option;
    const cellValue = row[column.field];
    if (cellValue) {
      return cellValue.indexOf(data) > -1;
    }
    return false;
  },
});
