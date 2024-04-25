<template>
  <div class="my-filter">
    <div class="sub-title">
      筛选条件
      <el-link class="title-btn" type="primary" :underline="false" @click="clear">清空</el-link>
    </div>
    <template v-for="(item, index) in params.column.filters" :key="index">
      <div class="sub-section">{{ item.label }}</div>
      <el-date-picker
        v-model="item.data"
        type="datetimerange"
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="YYYY/MM/DD HH:mm:ss"
        clearable
        @change="changeOptionEvent($event, item)"
      />
    </template>
  </div>
</template>

<script setup>
const { params } = defineProps({
  params: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['clear']);
const changeOptionEvent = (val, item) => {
  const checked = !!item.data?.length;
  params.$panel.changeOption(null, checked, item);
};
function clear(item) {
  params.$panel.resetFilter();
  emit('clear', { options: params.column.filters });
}
</script>

<style lang="less" scoped>
.my-filter {
  padding: 10px;
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
</style>
