<template>
  <!-- <div class="my-filter-input" style="text-align: right">
    <el-input v-model="Data.option" placeholder="请输入" type="text" @keyup="keyupEvent" @input="changeOptionEvent"></el-input>
  </div> -->
  <div class="filter-bottom">
    <div class="sub-title">
      筛选条件
      <el-link class="title-btn" type="primary" @click="reset" :underline="false">清空</el-link>
    </div>
    <div class="sub-section">选择</div>
    <el-input :placeholder="'请输入'" v-model="Data.option.data" @keyup="keyupEvent" @input="changeOptionEvent"></el-input>
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
// const inputValue = ref('');
const load = () => {
  Data.column = props.params.column;
  Data.option = props.params.column.filters[0];
};
const changeOptionEvent = () => {
  const checked = !!Data.option.data;
  props.params.$panel.changeOption(null, checked, Data.option);
};
const keyupEvent = (e) => {
  if (e.keyCode === 13) {
    props.params.$panel.confirmFilter();
  }
};
const reset = () => {
  emit('reset');
};
const emit = defineEmits(['reset']);
</script>

<style lang="less" scoped>
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
</style>
