<!-- 多级表头 
  此表格无分页
  表头插槽： <template #表头label="column">{{ column.label }}</template> 
  表格插槽:  <template #属性名="scope">{{ scope.row.label }}</template> 
-->
<template>
  <div class="financeDesk">
    <el-drawer :size="size" v-model="Data.isDisabled" :title="title" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close @close="close">
      <objectInfos
        v-for="(item2, index) in Data.infoDatas"
        :key="index"
        :detailLayout="item2.items"
        :column="1"
        :infoTitle="item2.groupName"
        @downLoad="downLoad"
        :width="item2.width"
      ></objectInfos>
      <template #footer>
        <el-button @click="close">取消</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import objectInfos from './objectInfos.vue';
const emit = defineEmits(['update:isShow', 'downLoad']);
const props = defineProps({
  isShow: {
    type: Boolean,
    defualt: false,
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String || Number,
    default: '' || null,
  },
  // 基础信息
  info: {
    type: Object,
    default: () => {},
  },
});
const Data = reactive({
  isDisabled: false,
  infoDatas: [],
});

watch(
  () => props.isShow,
  (newVal) => {
    Data.isDisabled = newVal;
  },
);

watch(
  () => props.info,
  (newVal) => {
    Data.infoDatas = newVal;
  },
  {
    deep: true,
    // immediate: true,
  },
);

// 关闭抽屉
const close = () => {
  Data.isDisabled = false;
  emit('update:isShow', false);
};

// 下载附件
const downLoad = (e, fileName) => {
  emit('downLoad', e, fileName);
};
</script>

<style lang="less" scoped>
.financeDesk {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
  }
  :deep(.el-descriptions__header) {
    margin-bottom: 5px;
  }
  :deep(.el-descriptions__title) {
    margin-top: 20px;
  }
}
</style>
