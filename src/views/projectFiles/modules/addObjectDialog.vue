<template>
  <div class="add_object">
    <el-dialog v-model="Data.addObjectVisible" destroy-on-close :title="title" width="60vw" @close="close">
      <el-tabs v-model="Data.activeName" class="demo-tabs" @tab-change="handleClick">
        <el-tab-pane v-for="item in Data.tabArrs" :key="item.name" :label="item.label" :name="item.name">
          <component
            :is="comp[Data.componentName]"
            v-model:uploadData="uploadData"
            v-model:isIconShow="isIconShow"
            :isTabName="item.name"
            :moduleType="moduleType"
            :isDefaultType="isDefaultType"
            :isDefaultPosition="isDefaultPosition"
            :isTask="isTask"
            :simpleOid="simpleOid"
            :oid="oid"
            v-model:linkFileSelectData="linkFileSelectData"
          ></component>
        </el-tab-pane>
      </el-tabs>

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
import linkFile from './components/linkFile.vue';
import uploadFile from './components/uploadFile.vue';
const api = window.$api;
const comp = shallowReactive({
  linkFile,
  uploadFile,
});
const props = defineProps({
  /**弹框显隐 */
  isShow: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  formObj: {
    type: Object,
    default: () => {},
  },
  /**引用的模块--当前有：文档，计划任务交付物 */
  moduleType: {
    type: String,
    default: '',
  },
  oid: {
    type: String,
    defalut: '',
  },
  isDefaultPosition: {
    type: String,
    defalut: '',
  },
  isDefaultType: {
    type: String,
    defalut: '',
  },
  isTask: {
    type: Boolean,
    default: false,
  },
  simpleOid: {
    type: String,
    defalut: '',
  },
});
const Data = reactive({
  addObjectVisible: false,
  isLoading: false,
  activeName: 'linkFile',

  tabArrs: [
    { label: '关联系统对象', name: 'linkFile' },
    { label: '本地上传', name: 'uploadFile' },
  ],
  componentName: 'linkFile',
  // rules: {
  //   name: [{ required: true, message: '请输入名称', trigger: 'change' }],
  //   number: [{ required: true, message: '请输入编号', trigger: 'change' }],
  // },
  // formObjData: {},
  // 项目id
  projectOid: props.oid ? props.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  /**用户 */
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),
});
watch(
  () => props.isShow,
  (val) => {
    Data.addObjectVisible = val;
    // handleClick();
  },
);

const handleClick = (tab) => {
  Data.componentName = tab;
};

/**弹框关闭事件 */
const close = () => {
  Data.dialogVisible = false;
  emit('update:close', false);
};

/**弹框确认事件 */
const confirm = async () => {
  if (Data.componentName === 'linkFile') {
    if (props.moduleType === 'planDeliver' && linkFileSelectData.value.length !== 1) return window.$message.warning('只能绑定一个交付物，请重新选择！');
    emit('confirm', linkFileSelectData.value, Data.componentName);
  } else if (Data.componentName === 'uploadFile') {
    if (JSON.stringify(uploadData.value) == '{}') return window.$message.warning('请输入内容！');
    if (!(uploadData.value.position && uploadData.value.type && (isIconShow.value ? uploadData.value.fileSmalltype : true) && uploadData.value.fileName))
      return window.$message.warning('请输入必填内容！');
    if (uploadData.value.fileList.length === 0) return window.$message.warning('请上传文件！');
    Data.isLoading = true;
    /**获取容器id */
    let containerOid = await getContainerOidFun();
    let datas = {};
    datas = {
      type: uploadData.value.type,
      containerOid: containerOid,
      attributes: {
        name: uploadData.value.fileName,
        'folder.id': uploadData.value.position,
        SmallDocType: uploadData.value.fileSmalltype,
        actualCreateUser: Data.userInfo.username,
      },
    };

    // 文档模块--创建文档
    if (props.moduleType === 'file') {
      let param = new FormData();
      param.append('serviceKey', 'wt.doc.WTDocument');
      param.append('formData', JSON.stringify(datas));
      if (uploadData.value.fileList[0]?.raw) {
        param.append('primaryFile', uploadData.value.fileList[0].raw);
      }
      // await api.fileApi.editDocument(params)
      api.fileApi.saveDocument(param).then((res) => {
        if (res.success) {
          window.$message.success('添加成功');
          Data.addObjectVisible = false;
          emit('confirm', [res.data], Data.componentName);
        } else {
          window.$message.error(res.message);
        }
        Data.isLoading = false;
      });
    } else if (props.moduleType === 'planDeliver') {
      datas.files = uploadData.value.fileList[0]?.raw;
      emit('confirm', datas, Data.componentName, uploadData);
      Data.isLoading = false;
    }
  }
};

/**
 * 判断小类
 */
const isIconShow = ref(false);
/**
 * 本地上传文件
 */
const uploadData = ref({});
/**
 * 关联系统文件
 */
const linkFileSelectData = ref([]);

/**获取容器Oid */
const getContainerOidFun = async () => {
  return await api.commonApi.getContainerOid({ oid: Data.projectOid }).then((res) => {
    if (!res.success) return window.$message.error(res.message);
    return res.data;
  });
};

/**
 * emit输出
 */
const emit = defineEmits(['update:close', 'confirm']);
defineExpose({
  Data,
});
</script>

<style lang="less" scoped>
.add_object {
  :deep(.el-dialog) {
    .el-dialog__body {
      padding-top: 12px;
    }
  }
}
</style>
