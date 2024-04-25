<template>
  <div class="uploadLocal">
    <el-form :model="uploadParam" label-width="120px">
      <el-form-item :label="$intl('type').d('选择文件类型') + '：'">
        <el-select
          v-model="uploadParam.type"
          :clearable="true"
          filterable
          style="width: 100%"
          :fit-input-width="true"
          :popper-append-to-body="false"
          popper-class="select_class"
          :placeholder="$intl('Please enter the ').d('请输入') + $intl('type').d('类型')"
        >
          <!-- <el-option v-for="item in filesData.createFileType" :key="item.oid" :label="item.label" :value="item.oid" /> -->
        </el-select>
      </el-form-item>
      <el-form-item :label="$intl('filePosition').d('文件存放位置') + '：'">
        <el-tree-select
          v-model="uploadParam.position"
          :data="fileTree"
          check-strictly
          :isSingle="true"
          :props="defaultProps"
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
    </el-form>
    <div class="uploadContent">
      <el-upload ref="upload" drag action="/" :on-preview="handlePreview" v-model:file-list="fileList" :auto-upload="false" :multiple="true" :on-change="uploadChange">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
      </el-upload>
    </div>
  </div>
</template>
<script>
export default defineComponent({
  setup() {
    const filesData = reactive({
      fileTree: [],
      fileList: [],
      defaultProps: {
        children: 'children',
        label: 'displayName',
      },
      uploadParam: {
        position: '',
        type: '',
      },
    });
    const uploadChange = () => {};
    const handlePreview = () => {};
    return {
      ...toRefs(filesData),
      uploadChange,
      handlePreview,
    };
  },
});
</script>

<style scoped lang="scss">
.uploadLocal {
  padding: 10px 100px;
  width: 100%;
  .selectType {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
    .label {
      line-height: 32px;
    }
  }
  .uploadContainer {
    width: 100%;
    border: 1px dashed #ccc;
    background: #f9f9f9;
    height: 200px;
    .clickFile {
      text-align: center;
      line-height: 200px;
    }
  }
}
</style>
<style lang="scss">
.upload-demo {
  .el-upload {
    justify-content: flex-start;
    width: 95% !important;
  }
}
</style>
