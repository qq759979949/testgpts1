<template>
  <div class="filter-bottom">
    <div class="sub-title">
      筛选条件
      <el-link class="title-btn" type="primary" :underline="false" @click="clear">清空</el-link>
    </div>
    <div class="sub-section">
      <div>{{ Data.option.label }}</div>
      <el-select :placeholder="'请选择'" v-model="Data.option.data.value" :teleported="false" clearable @change="changeOptionEvent">
        <el-option v-for="item in Data.option.data.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  params: {
    type: Object,
    default: () => {},
  },
});
onBeforeMount(() => {
  load();
});
const Data = reactive({
  column: null,
  option: null,
});
const load = () => {
  Data.column = props.params.column;
  Data.option = props.params.column.filters[0];
};
const emit = defineEmits(['clear']);
function changeOptionEvent() {
  const checked = !!Data.option.data.value;
  // changeOption 的第三个参数只能是 filters 的第一层子元素，给第二层就触发不了筛选按钮
  props.params.$panel.changeOption(null, checked, Data.option);
}
function clear(item) {
  props.params.$panel.resetFilter();
  emit('clear', { options: [Data.option.data] });
}
</script>

<style lang="less" scoped>
.filter-bottom {
  .sub-title {
    color: #999;
    margin: 6px 10px 10px;
    .title-btn {
      vertical-align: top;
      float: right;
      font-size: 12px;
    }
  }
  .sub-section {
    margin: 0 10px 10px;
  }
}
</style>
