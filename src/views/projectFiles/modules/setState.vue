<template>
  <div class="setState_dialog">
    <el-dialog v-model="Data.dialogVisible" destroy-on-close title="设置状态" width="20vw" @close="close">
      <el-form-item label="状态">
        <el-select v-model="Data.newStatus" :clearable="true" filterable :fit-input-width="true" :popper-append-to-body="false" popper-class="select_class" style="width: 100%">
          <el-option v-for="item in Data.statusOptions" :key="item.innerName" :label="item.display" :value="item.innerName" />
        </el-select>
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
  setStateData: {
    type: Object,
    default: () => {},
  },
});
const Data = reactive({
  dialogVisible: false,
  isLoading: false,
  /**设置弹框 */
  newStatus: '',
  statusOptions: [],
});
watch(
  () => props.isShow,
  (val) => {
    Data.dialogVisible = val;
    if (val) getStateData();
  },
);

const getStateData = () => {
  api.fileApi.queryDocStates({ oid: props.setStateData.oid }).then((res) => {
    if (!res?.success) return window.$message.error(res.message);
    Data.statusOptions = res.data;
  });
};

/**弹框关闭事件 */
const close = () => {
  Data.dialogVisible = false;
  emit('update:close', false);
};

/**弹框确认事件 */
const confirm = () => {
  Data.isLoading = true;
  let params = {
    oid: props.setStateData.oid,
    state: Data.newStatus,
  };
  api.fileApi.setDocState(params).then((res) => {
    if (!res?.success) return window.$message.error(res.message);
    Data.dialogVisible = false;
    Data.isLoading = false;
    window.$message.success('设置成功');
    emit('confirm');
  });
};
/**
 * emit输出
 */
const emit = defineEmits(['update:close', 'confirm']);
</script>

<style lang="less" scoped></style>
