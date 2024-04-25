<template>
  <div class="link_file">
    <div class="search_box">
      <el-form ref="formRef" :inline="true" :model="formData">
        <el-form-item label="类型" prop="objType" :rules="[{ required: true, message: '请选择类型' }]" v-if="moduleType !== 'file'">
          <el-select v-model="formData.objType" clearable style="width: 10vw">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称：">
          <el-input v-model="formData.docName" style="width: 10vw" placeholder="请输入名称" clearable :disabled="inputVisible" />
        </el-form-item>
        <el-form-item label="编号：">
          <el-input v-model="formData.docNumber" style="width: 10vw" placeholder="请输入编号" clearable :disabled="inputVisible" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch()" @keydown.enter="enter_up()">搜索</el-button>
          <el-button type="primary" @click="onClear">清除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_box">
      <div class="title">搜索结果</div>
      <newPiTable
        ref="linkFileTable"
        rowKey="oidOrVid"
        :tableHeight="'auto'"
        :columns="Data.dataColunms"
        :data="Data.tableData"
        :isSingleSelect="true"
        :tableLoad="Data.tableLoad"
        :selectable="true"
        :pagination="true"
        v-model:current-page.sync="Data.page"
        v-model:page-size.sync="Data.range"
        :total="Data.total"
        @selectionChange="dataSelect"
      >
        <!-- 状态展示 -->
        <template #state="scope">
          <div class="state-wrapper" type="primary" :style="useCommonHandler.getColor(scope.row.state)">
            {{ scope.row.state }}
          </div>
        </template>
      </newPiTable>
    </div>
  </div>
</template>

<script setup>
import { useCommonHandler } from '@/hooks';
const api = window.$api;
const route = useRoute();
const props = defineProps({
  isTabName: {
    type: String,
    default: '',
  },
  /**模块名称 */
  moduleType: {
    type: String,
    default: '',
  },
  oid: {
    type: String,
    default: '',
  },
});
const Data = reactive({
  dataColunms: [
    // { title: '编号', dataIndex: 'docNumber' },
    // { title: '名称', dataIndex: 'docName' },
    // { title: '上下文', dataIndex: 'container' },
    // { title: '版本', dataIndex: 'version' },
    // { title: '上次修改时间', dataIndex: 'updateTime' },
    // { title: '创建者', dataIndex: 'creator' },
  ],
  tableData: [],
  tableLoad: false,
  page: 1,
  range: 5,
  total: 0,
});
const formData = reactive({
  objType: '',
  docName: '',
  docNumber: '',
});

const inputVisible = ref(true);
watch(
  () => formData.objType,
  (val) => {
    if (props.moduleType !== 'file') {
      val ? (inputVisible.value = false) : (inputVisible.value = true);
    } else {
      inputVisible.value = false;
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (props.isTabName === 'linkFile') {
    //绑定监听事件
    window.addEventListener('keydown', enter_up);
  }

  if (props.moduleType === 'file') {
    Data.dataColunms = [
      { title: '编号', dataIndex: 'docNumber' },
      { title: '名称', dataIndex: 'docName' },
      { title: '上下文', dataIndex: 'container' },
      { title: '版本', dataIndex: 'version' },
      { title: '状态', dataIndex: 'state' },
      { title: '上次修改时间', dataIndex: 'updateTime' },
      { title: '创建者', dataIndex: 'creator' },
    ];
  } else if (props.moduleType === 'planDeliver') {
    Data.dataColunms = [
      { title: '编号', dataIndex: 'number' },
      { title: '名称', dataIndex: 'name' },
      { title: '状态', dataIndex: 'state' },
      { title: '版本', dataIndex: 'version' },
    ];
  }
});
onUnmounted(() => {
  //销毁事件
  window.removeEventListener('keydown', enter_up, false);
});
// 键盘事件
const enter_up = (e) => {
  if (e.keyCode == 13 && props.isTabName === 'linkFile') {
    getDataFun();
  }
};

/**搜索条件--类型 */
const typeOptions = ref([
  { label: '文档', value: 'WTDocument' },
  { label: '部件', value: 'WTPart' },
  { label: '图纸', value: 'EPMDocument' },
  { label: '更改通告', value: 'WTChangeOrder2' },
]);

/**分页 */
watch(
  () => Data.page,
  () => {
    getDataFun();
  },
);
watch(
  () => Data.range,
  () => {
    Data.page === 1 && getDataFun();
    Data.page = 1;
  },
);
// 搜索
const formRef = ref(null);
const onSearch = () => {
  if (props.moduleType !== 'file') {
    formRef.value.validate((valid) => {
      if (valid) {
        getDataFun();
      } else {
        return false;
      }
    });
  } else {
    getDataFun();
  }
};

const linkFileTable = ref(null);
// 获取数据
const getDataFun = () => {
  Data.tableLoad = true;
  if (props.moduleType === 'file') {
    let parmas = {
      docName: formData.docName,
      docNumber: formData.docNumber,
      page: Data.page,
      count: Data.range,
      projectOid: props.oid ? props.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
    };
    api.fileApi
      .queryDocs(parmas)
      .then((res) => {
        if (res.success) {
          Data.tableData = res.data.itemList;
          Data.tableData.forEach((e) => {
            e.oidOrVid === route.query.oid ? (e.choose = true) : (e.choose = false);
          });
          Data.total = res.data.totalCount;
        }
        Data.tableLoad = false;
      })
      .catch((err) => {
        Data.tableLoad = false;
        window.$message.error(err);
      });
  } else if (props.moduleType === 'planDeliver') {
    let parmas = {
      objType: formData.objType,
      objName: formData.docName,
      objNumber: formData.docNumber,
      page: Data.page,
      count: Data.range,
    };
    api.planApi
      .queryWTObject(parmas)
      .then((res) => {
        if (res.success) {
          Data.tableData = res.data.itemList;
          Data.tableData.forEach((e) => {
            e.oidOrVid === route.query.oid ? (e.choose = true) : (e.choose = false);
          });
          Data.total = res.data.totalCount;
        }
        Data.tableLoad = false;
      })
      .catch((err) => {
        Data.tableLoad = false;
        window.$message.error(err);
      });
  }
};

/**表格选择 */
const linkFileSelectData = ref([]);
const dataSelect = (val, rows) => {
  linkFileSelectData.value = [];
  linkFileSelectData.value.push(rows);
  // console.log(linkFileSelectData.value, 226);
  linkFileSelectData.value[0].type = formData.objType;
  emit('update:linkFileSelectData', linkFileSelectData.value);
};

/**
 * emit输出
 */
const emit = defineEmits(['update:linkFileSelectData']);

const onClear = () => {
  formData.objType = '';
  formData.docName = '';
  formData.docNumber = '';
  Data.tableData = [];
  Data.total = 0;
};
</script>

<style lang="less" scoped>
.link_file {
  .table_box {
    .title {
      font-size: 18px;
      font-weight: 600px;
      margin-bottom: 10px;
    }
  }
}
</style>
