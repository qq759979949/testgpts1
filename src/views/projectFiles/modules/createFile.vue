<template>
  <div class="create_file">
    <el-dialog
      v-model="Data.isShowDialog"
      :destroy-on-close="true"
      :title="!isEdit ? $intl('create document').d('新建文档') : $intl('edit document').d('编辑文档')"
      width="600"
      @close="close"
    >
      <div class="content" v-loading="contentVisible">
        <el-form :model="Data.uploadParam" label-width="120px">
          <el-form-item :label="$intl('filePosition').d('文件存放位置') + '：'">
            <el-tree-select
              :disabled="isEdit"
              v-model="Data.uploadParam.position"
              :data="fileTree"
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
          <el-form-item :label="$intl('type').d('类型') + '：'" :required="true">
            <el-select
              :disabled="isEdit"
              v-model="Data.uploadParam.type"
              :clearable="true"
              filterable
              style="width: 100%"
              :fit-input-width="true"
              :popper-append-to-body="false"
              popper-class="select_class"
              :placeholder="$intl('Please enter the ').d('请输入') + $intl('type').d('类型')"
              @change="typeChnange"
            >
              <el-option v-for="item in Data.createFileType" :key="item.oid" :label="item.label" :value="item.oid" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="Data.uploadParam.fileSmalltype"
              :clearable="true"
              filterable
              style="width: 100%"
              :fit-input-width="true"
              :popper-append-to-body="false"
              popper-class="select_class"
              :placeholder="$intl('Please enter the ').d('请输入') + $intl('Document subcategories').d('文档小类')"
            >
              <el-option v-for="item in Data.createFileSmallType" :key="item.oid" :label="item.label" :value="item.oid" />
            </el-select>
            <template #label>
              <span style="color: red; margin-right: 6px" v-if="isIconShow">*</span>
              <span>{{ $intl('Document subcategories').d('文档小类') + '：' }}</span>
            </template>
          </el-form-item>

          <el-form-item :label="$intl('file description').d('文件名称') + '：'">
            <el-input
              :disabled="isEdit"
              v-model="Data.uploadParam.fileName"
              :placeholder="$intl('Please enter the ').d('请输入') + $intl('file description').d('文件描述')"
            ></el-input>
          </el-form-item>
          <!-- <span style="margin-bottom: 10px; color: red">注：首个上传的文件默认为主对象，其余为附件</span> -->
        </el-form>
        <el-upload ref="upload" drag action="/" :on-preview="handlePreview" v-model:file-list="Data.fileList" :auto-upload="false" :multiple="false" :on-change="uploadChange">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" :loading="Data.isLoading" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useCommonHandler } from '@/hooks';
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  // 是否编辑
  isEdit: {
    type: Boolean,
    default: false,
  },
  // 编辑数据
  editData: {
    type: Array,
    default: () => [],
  },
  // 树状数据
  fileTree: {
    type: Array,
    default: () => [],
  },
});

const Data = reactive({
  isShowDialog: false,
  /** 表单数据*/
  uploadParam: {
    position: '',
    type: '',
    fileSmalltype: '',
    fileName: '',
  },
  createFileType: [],
  createFileSmallType: [],
  defaultProps: {
    children: 'children',
    label: 'displayName',
  },

  /**编辑数据 */
  editfileData: [],

  /**文件列表 */
  fileList: [],
  // isSingle: false,

  /**确认事件 */
  isLoading: false,

  /**用户 */
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),
  /**项目oid */
  projectOid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
});

const api = window.$api;
// const router = useRouter();
/**判断显隐 */
watch(
  () => props.isShow,
  (val) => {
    if (val) {
      // if (!props.isEdit) {
      // Data.uploadParam = {
      //   position: props.fileTree[0].oid,
      //   type: '',
      //   fileSmalltype: '',
      //   fileName: '',
      // };
      Data.uploadParam.type = '';
      Data.uploadParam.fileSmalltype = '';
      Data.uploadParam.fileName = '';
      Data.fileList = [];
      // }
      getCreateTypeFun();
      Data.isShowDialog = true;
    } else {
      Data.isShowDialog = false;
    }
  },
);

/**默认位置 */
watch(
  () => props.fileTree,
  (val) => {
    if (val.length > 0) {
      Data.uploadParam.position = val[0].oid;
    }
  },
);

/**判断文档小类必填 */
const isIconShow = ref(false);
watch(
  () => Data.createFileSmallType,
  (val) => {
    if (val.length > 0) {
      isIconShow.value = true;
    } else {
      isIconShow.value = false;
    }
  },
);

/**编辑文件 */
watch(
  () => Data.editfileData,
  (val) => {
    if (val.length > 0) {
      Data.fileList = [...val];
    }
  },
);

onMounted(() => {
  if (!props.isEdit) {
    Data.uploadParam = {
      // position: '',
      type: '',
      fileSmalltype: '',
      fileName: '',
    };
  }
});

const contentVisible = ref(false);

// 获取类型方法
const getCreateTypeFun = () => {
  contentVisible.value = true;
  Data.createFileType = [];
  let parmas = {
    type: 'com.ptc.ReferenceDocument',
    includeSelf: 'true',
  };
  api.fileApi.getCreateType(parmas).then((res) => {
    if (!res.success) return window.$message.error(res.message);
    for (let key in res.data) {
      Data.createFileType.push({
        oid: key,
        name: res.data[key],
        label: res.data[key],
      });
    }
    contentVisible.value = props.isEdit;
  });
};

/**选择文档类型事件 */
const typeChnange = async (val) => {
  Data.createFileSmallType = [];
  Data.uploadParam.fileSmalltype = '';
  // 新建
  let params = {
    serviceKey: 'wt.doc.WTDocument',
    softType: val,
  };
  let layoutObj = await window.$commonApisFun.getCreateLayoutData(params, 'getOtherCreateLayout');
  handleDataFun(layoutObj);
};
// 文档小类数据处理
const handleDataFun = (layoutObj) => {
  layoutObj.formList.forEach((v) => {
    if (v.list.length > 0) {
      v.list.forEach((e) => {
        e.forEach((m) => {
          if (m.name === 'SmallDocType') {
            Data.createFileSmallType = m.options.map((k) => {
              k.oid = k.label;
              k.name = k.value;
              return k;
            });
          }
        });
      });
    }
  });
  contentVisible.value = false;
};

/**上传文件切换 */
const uploadChange = (uploadFile, fileData) => {
  let str = fileData[fileData.length - 1].name.substring(0, fileData[fileData.length - 1].name.lastIndexOf('.'));
  if (!props.isEdit) {
    Data.uploadParam.fileName = str;
  }
};
watch(
  () => Data.fileList,
  (val) => {
    if (Data.fileList.length > 1) {
      // 单选只允许单文件
      if (val.length > 1) {
        Data.fileList = [Data.fileList[Data.fileList.length - 1]];
      }
    }
  },
);
const handlePreview = (value) => {
  api.fileApi.downloadContent({ oid: value.oid }).then((res) => {
    useCommonHandler.download(res, value.name);
  });
};

/**获取容器Oid */
const getContainerOidFun = async () => {
  return await api.commonApi.getContainerOid({ oid: Data.projectOid }).then((res) => {
    if (!res.success) return window.$message.error(res.message);
    return res.data;
  });
};

/**提交 */
const submit = async () => {
  Data.isLoading = true;
  if (!Data.uploadParam.type) {
    window.$message.error('请选择类型');
    Data.isLoading = false;
    return;
  }
  if (Data.createFileSmallType.length > 0 && !Data.uploadParam.fileSmalltype) {
    window.$message.error('请选择文档小类');
    Data.isLoading = false;
    return;
  }
  /**获取容器id */
  let containerOid = await getContainerOidFun();
  let datas = {};
  if (!props.isEdit) {
    // 新建保存
    datas = {
      type: Data.uploadParam.type,
      containerOid: containerOid,
      attributes: {
        name: Data.uploadParam.fileName,
        'folder.id': Data.uploadParam.position,
        SmallDocType: Data.uploadParam.fileSmalltype,
        actualCreateUser: Data.userInfo.username,
      },
      // ...fileObj
    };
  } else {
    // 编辑保存
    let typesArr = props.editData[0].typeInner.split('|');
    datas = {
      oid: props.editData[0].oid,
      type: typesArr[typesArr.length],
      containerOid: containerOid,
      attributes: {
        // name: filesData.uploadParam.fileName,
        'folder.id': Data.uploadParam.position,
        SmallDocType: Data.uploadParam.fileSmalltype,
        actualCreateUser: Data.userInfo.username,
      },
      filesForm: {
        primaryOid: Data.fileList[0]?.raw ? '' : Data.editfileData[0].oid,
      },
    };
  }
  let param = new FormData();
  param.append('serviceKey', 'wt.doc.WTDocument');
  param.append('formData', JSON.stringify(datas));
  if (Data.fileList[0]?.raw) {
    param.append('primaryFile', Data.fileList[0].raw);
  }

  Data.fileList.forEach((file, i) => {
    // 多个文件
    if (i > 0) {
      param.append('secondaryFile', file.raw);
    }
  });
  // 保存
  api.fileApi[props.isEdit ? 'editDocument' : 'saveDocument'](param).then((res) => {
    if (res.success) {
      Data.isLoading = false;
      emit('createSubmit', res);
    } else {
      Data.isLoading = false;
      window.$message.error(res.message);
    }
  });
};

const close = () => {
  if (Data.isShowDialog) {
    if (props.isEdit) {
      api.fileApi.undoCheckoutObj({ oids: props.editData[0].oid });
    }
    Data.fileList = [];
    emit('update:isShow', false);
  }
};
/**输出 */
const emit = defineEmits(['update:isShow', 'createSubmit']);
defineExpose({
  Data,
  handleDataFun,
});
</script>

<style lang="less" scoped>
.create_file {
}
</style>
