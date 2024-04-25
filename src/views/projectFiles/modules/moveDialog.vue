<template>
  <div class="move_dialog">
    <el-dialog v-model="Data.dialogVisible" destroy-on-close title="移动文件" width="30vw" @close="close">
      <el-form-item :label="$intl('filePosition').d('文件存放位置') + '：'">
        <el-tree-select
          v-model="Data.targetPosition"
          :data="treeData"
          check-strictly
          :isSingle="true"
          :props="Data.defaultProps"
          node-key="oid"
          filterable
          style="width: 100%"
          :fit-input-width="true"
          :popper-append-to-body="false"
          popper-class="select_class"
          :placeholder="$intl('Please enter the ').d('请输入') + $intl('filePosition').d('文件存放位置')"
        >
          <template #default="{ node }">{{ node.data.name }}</template>
        </el-tree-select>
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
  moveData: {
    type: Array,
    default: () => [],
  },
  treeData: {
    type: Array,
    default: () => [],
  },
});
const Data = reactive({
  dialogVisible: false,
  isLoading: false,

  targetPosition: '',
  defaultProps: {
    children: 'children',
    label: 'displayName',
  },
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
  let oids = props.moveData.map((v) => v.oid).join(',');
  let params = {
    docOids: oids,
    folderOid: Data.targetPosition,
  };
  api.fileApi.moveDocs(params).then((res) => {
    if (!res?.success) return window.$message.error(res.message);
    Data.dialogVisible = false;
    Data.isLoading = false;
    window.$message.success('移动成功');
    emit('confirm');
  });
};
/**
 * emit输出
 */
const emit = defineEmits(['update:close', 'confirm']);
</script>

<style lang="less" scoped></style>
