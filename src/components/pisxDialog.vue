<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-05 08:23:31
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-27 11:47:50
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\components\pisxDialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- 
    弹窗组件，里面的内容可使用插槽
 -->
<template>
  <div class="dialogCss">
    <el-dialog v-model="Data.isShowDialog" :title="Data.titles" :width="Data.width" @close="close" destroy-on-close :close-on-click-modal="false">
      <slot name="content"></slot>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit" :loading="loading">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  // 控制显示隐藏
  isShow: {
    type: Boolean,
    default: false,
  },
  // 标题
  title: {
    type: String,
    default: ' ',
  },
  // 弹窗宽度
  width: {
    type: [Number, String],
    default: 600,
  },
  // 加载状态
  loading: {
    type: Boolean,
    defualt: false,
  },
});

//传出方法
const emit = defineEmits(['update:isShow', 'close', 'submit', 'update:loading']);

const Data = reactive({
  isShowDialog: false,
  titles: ' ',
  width: 0,
});

watch(
  () => props.isShow,
  (val) => {
    Data.isShowDialog = val;
  },
);

watch(
  () => props.width,
  (val) => {
    Data.width = val;
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  },
);

watch(
  () => props.title,
  (val) => {
    Data.titles = val;
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  },
);

//关闭方法
const close = () => {
  emit('update:isShow');
  emit('close');
};

// 提交方法
const submit = () => {
  emit('submit');
};
</script>

<style lang="less" scoped>
.dialogCss {
  :deep(.el-dialog__footer) {
    border-top: solid 1px #dedede;
    margin-right: 16px;
  }
}
</style>
