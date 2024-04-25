<template>
  <div class="checkInDialog">
    <el-dialog v-model="Data.dialogVisible" destroy-on-close title="检入" width="30vw" @close="close">
      <el-form-item label="备注">
        <el-input v-model="Data.checkDesc" type="textarea" />
      </el-form-item>
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
  checkInData: {
    type: Object,
    default: () => {},
  },
});
const Data = reactive({
  dialogVisible: false,
  isLoading: false,
  checkDesc: '',
});
watch(
  () => props.isShow,
  (val) => {
    Data.dialogVisible = val;
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
  let parmasStr = props.checkInData.map((e) => e.oid).join(',');
  api.fileApi.checkinObj({ oids: parmasStr, remark: Data.checkDesc }).then((res) => {
    if (!res?.success) return window.$message.error(res.message);
    Data.dialogVisible = false;
    Data.isLoading = false;
    window.$message.success('检入成功！');
    emit('confirm');
  });
  // let parmas = {
  //   oid: props.renameData.oid,
  //   name: Data.formObjData.name,
  //   number: Data.formObjData.number,
  // };
  // api.fileApi.renameDoc(parmas).then((res) => {
  //   if (!res?.success) return window.$message.error(res.message);
  //   emit('confirm');
  // });
};
/**
 * emit输出
 */
const emit = defineEmits(['update:close', 'confirm']);
</script>

<style lang="less" scoped></style>
