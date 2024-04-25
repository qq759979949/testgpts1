<template>
  <div class="renameDialog">
    <el-dialog v-model="Data.dialogVisible" destroy-on-close :title="title" width="20vw" @close="close">
      <el-form ref="ruleFormRef" :model="Data.formObjData" :rules="Data.rules" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="Data.formObjData.name" />
        </el-form-item>
        <el-form-item label="编号" prop="number">
          <span>{{ Data.formObjData.number }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">{{ $intl('cancel').d('取消') }}</el-button>
          <el-button type="primary" :loading="Data.isLoading" @click="confirm">{{ $intl('confirm').d('确认') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const api = window.$api;
const props = defineProps({
  /**弹框显隐 */
  isShow: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '重命名',
  },
  formObj: {
    type: Object,
    default: () => {},
  },
  renameData: {
    type: Object,
    default: () => {},
  },
});
const Data = reactive({
  dialogVisible: false,
  isLoading: false,
  rules: {
    name: [{ required: true, message: '请输入名称', trigger: 'change' }],
    number: [{ required: true, message: '请输入编号', trigger: 'change' }],
  },
  formObjData: {},
});
watch(
  () => props.isShow,
  (val) => {
    Data.dialogVisible = val;
    Data.formObjData = { ...props.formObj };
  },
);

/**弹框关闭事件 */
const close = () => {
  Data.dialogVisible = false;
  emit('update:close', false);
};

/**弹框确认事件 */
const confirm = () => {
  Data.isLoading = true;
  let parmas = {
    oid: props.renameData.oid,
    name: Data.formObjData.name,
    number: Data.formObjData.number,
  };
  api.fileApi.renameDoc(parmas).then((res) => {
    if (!res?.success) return window.$message.error(res.message);
    Data.dialogVisible = false;
    Data.isLoading = false;
    emit('confirm');
  });
};
/**
 * emit输出
 */
const emit = defineEmits(['update:close', 'confirm']);
</script>

<style lang="less" scoped></style>
