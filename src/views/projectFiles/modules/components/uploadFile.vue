<template>
  <div class="upload_file">
    <div class="form_box">
      <el-button type="primary" v-if="isTask && simpleOid" @click="uploadTemplate" :loading="Data.isLoading">下载模板</el-button>
      <el-form :model="Data.formData" label-width="130px" label-position="left">
        <el-form-item :label="$intl('filePosition').d('文件存放位置') + '：'">
          <el-tree-select
            v-model="Data.formData.position"
            :data="Data.fileTree"
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
          <template #label>
            <span style="color: red; margin-right: 6px">*</span>
            <span>{{ $intl('filePosition').d('文件存放位置') + '：' }}</span>
          </template>
        </el-form-item>
        <el-form-item :label="$intl('type').d('类型') + '：'">
          <el-select
            v-model="Data.formData.type"
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
          <template #label>
            <span style="color: red; margin-right: 6px">*</span>
            <span>{{ $intl('type').d('类型') + '：' }}</span>
          </template>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="Data.formData.fileSmalltype"
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
        <el-form-item :label="$intl('file Name').d('文件名称') + '：'">
          <el-input v-model="Data.formData.fileName" :placeholder="$intl('Please enter the ').d('请输入') + $intl('file Name').d('文件名称')"></el-input>
          <template #label>
            <span style="color: red; margin-right: 6px">*</span>
            <span>{{ $intl('file Name').d('文件名称') + '：' }}</span>
          </template>
        </el-form-item>
      </el-form>
    </div>
    <div class="upload_box">
      <el-upload ref="upload" drag action="/" v-model:file-list="Data.formData.fileList" :auto-upload="false" :multiple="!Data.isSingle" :on-change="uploadChange">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
      </el-upload>
    </div>
  </div>
</template>

<script setup>
import { useCommonHandler } from '@/hooks';
const props = defineProps({
  oid: {
    type: String,
    default: '',
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
    defalut: false,
  },
  simpleOid: {
    type: String,
    defalut: '',
  },
});
const Data = reactive({
  // 表单数据
  fileTree: [],
  defaultProps: {
    children: 'children',
    label: 'displayName',
  },
  formData: {
    position: '',
    type: '',
    fileSmalltype: '',
    fileName: '',
    fileList: [],
  },
  createFileType: [],
  createFileSmallType: [],

  // 文件数据
  // fileList: [],
  isSingle: true,

  projectOid: props.oid ? props.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  isLoading: false,
});
const api = window.$api;
onMounted(() => {
  getFileTree();
  getCreateTypeFun();
});
// 获取文件树结构
const getFileTree = async () => {
  Data.tableLoading = true;
  let param = {
    oid: Data.projectOid,
  };
  await api.fileApi.getFolderTree(param).then((res) => {
    if (!res.success) return window.$message.error(res.message);
    Data.fileTree = res.data;
    // 处理新建的时候树状数据
    Data.fileTree.forEach((v) => {
      v.displayName = v.name;
      handCreateTree(v);
    });
    if (!Data.formData.position) {
      Data.formData.position = Data.fileTree[0].oid;
    }
  });
};
const handCreateTree = (item) => {
  if (item.name === props.isDefaultPosition) {
    Data.formData.position = item.oid;
  }
  if (item.children === 0) return;
  item.children.forEach((e) => {
    e.displayName = item.displayName + '/' + e.name;
    handCreateTree(e);
  });
};

/**获取类型 */
const getCreateTypeFun = () => {
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
    Data.createFileType.forEach((item) => {
      if (item.oid === props.isDefaultType) {
        Data.formData.type = item.oid;
      }
    });
  });
};

/**选择文档类型事件 */
const typeChnange = async (val) => {
  Data.createFileSmallType = [];
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
            Data.createFileSmallType = m?.options?.map((k) => {
              k.oid = k.label;
              k.name = k.value;
              return k;
            });
          }
        });
      });
    }
  });
};
/**判断文档小类必填 */
const isIconShow = ref(false);
// 获取模板
const uploadTemplate = () => {
  Data.isLoading = true;
  sessionStorage.removeItem('downloadName');
  window.$api.toDoApi.downloadContentByNumber({ docNumber: props.simpleOid }).then((res) => {
    Data.isLoading = false;
    let str = decodeURIComponent(sessionStorage.getItem('downloadName'));
    useCommonHandler.download(res, str.split('=')[1]);
    // const aLink = document.createElement('a');
    // var blob = new Blob([res], { type: 'application/vnd.ms-excel;application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    // const fileName = '模板';
    // aLink.href = URL.createObjectURL(blob);
    // aLink.setAttribute('download', fileName); // 设置下载文件名称
    // document.body.appendChild(aLink);
    // aLink.click();
    // document.body.removeChild(aLink);
  });
};
watch(
  () => Data.createFileSmallType,
  (val) => {
    if (val?.length > 0) {
      isIconShow.value = true;
    } else {
      isIconShow.value = false;
    }
  },
);
// 大类清空，小类清空
watch(
  () => Data.formData.type,
  (val) => {
    if (!val) {
      Data.formData.fileSmalltype = '';
    }
  },
);

/**文件操作 */
// 单选
// watch(
//   () => Data.fileList,
//   (val) => {
//     if (Data.isSingle) {
//       // 单选只允许单文件
//       if (val.length > 1) {
//         Data.fileList = [Data.fileList[Data.fileList.length - 1]];
//       }
//     }

//     console.log(Data.fileList, 208);
//   },
// );
const uploadChange = (uploadFile, fileData) => {
  if (fileData.length === 1) {
    Data.formData.fileList = fileData;
  } else {
    Data.formData.fileList = fileData.splice(fileData.length - 1, fileData.length);
  }
  // 判断名字，回显到文件名
  // let nameArr = fileData.map((v) => v.name.substring(0, v.name.lastIndexOf('.')));
  // if (nameArr.includes(Data.formData.fileName) || !Data.formData.fileName) {
  //   Data.formData.fileName = Data.formData.fileList[0].name.substring(0, Data.formData.fileList[0].name.lastIndexOf('.'));
  // }
  Data.formData.fileName = Data.formData.fileList[0].name.substring(0, Data.formData.fileList[0].name.lastIndexOf('.'));
};

watch(
  () => Data.formData,
  (val) => {
    setTimeout(() => {
      emit('update:uploadData', val);
      emit('update:isIconShow', isIconShow.value);
    }, 100);
  },
  { deep: true },
);

/**
 * emit输出
 */
const emit = defineEmits(['update:uploadData', 'update:isIconShow']);
</script>

<style lang="less" scoped>
.upload_file {
  padding: 0 6vw;
  .upload_box {
    margin-top: 10px;
  }
}
</style>
