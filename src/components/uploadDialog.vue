<template>
  <div class="selectedDialog">
    <el-dialog v-model="isShowDialog" :title="title" width="600" @close="close" destroy-on-close :close-on-click-modal="false">
      <slot name="topContent"></slot>
      <el-upload ref="upload" drag action="/" :on-preview="handlePreview" v-model:file-list="fileList" :auto-upload="false" :multiple="!isSingle" :on-change="uploadChange">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" :loading="isLoading" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'uploadDialog',
  props: {
    isShow: {
      type: Boolean,
    },
    closeLoading: {
      type: Boolean,
    },
    isSingle: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    editFile: {
      type: Array,
      default: () => [],
    },
  },
  components: {},
  data() {
    return {
      isLoading: false,
      isShowDialog: false,
      fileList: [],
    };
  },
  watch: {
    isShow(val) {
      this.isShowDialog = val;
      if (!val) this.isLoading = false;
    },
    fileList(val) {
      if (this.isSingle) {
        // 单选只允许单文件
        if (val.length > 1) {
          this.fileList = [this.fileList[this.fileList.length - 1]];
        }
      }
    },
    editFile(val) {
      if (val.length > 0) {
        this.fileList = [...val];
      }
    },
    closeLoading(val) {
      if (!val) this.isLoading = false;
    },
  },
  created() {},
  mounted() {},
  methods: {
    uploadChange(uploadFile, fileData) {
      this.$emit('uploadChange', fileData);
    },
    close() {
      this.fileList = [];
      this.$emit('update:isShow', false);
    },
    submit() {
      if (this.fileList.length === 0) {
        this.$message.warning('请添加附件！');
        return;
      }
      this.isLoading = true;
      this.$emit('submit', this.fileList);
    },
    handlePreview(value) {
      this.$emit('handlePreview', value);
    },
  },
};
</script>

<style scoped lang="scss">
.selectedDialog {
  :deep(.el-dialog__header) {
    border-bottom: 1px solid var(--el-border-color);
    margin-right: 0;
  }
  :deep(.el-dialog__body) {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  :deep(.el-dialog__footer) {
    border-top: 1px solid var(--el-border-color);
  }
}
</style>
