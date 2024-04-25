<!-- 产品和竞品配置参数

-->
<template>
  <div class="competitorConfig page_common">
    <div class="title">产品和竞品配置参数</div>
    <div class="btnList">
      <div>
        <!-- <el-button v-for="(item, index) of Data.btnList" :key="index" :type="item.isPrimary ? 'primary' : ''" @click="clickHandler(item.clickName)">{{ item.label }}</el-button> -->
        <el-button type="primary" @click="clickHandler('uploadFile')" :disabled="Data.projectType === '待处理' ? false : true">上传附件</el-button>
        <el-popconfirm title="确认是否要删除附件?" @confirm="clickHandler('removeFile')">
          <template #reference>
            <el-button :disabled="Data.projectType === '待处理' ? false : true">删除附件</el-button>
          </template>
        </el-popconfirm>
        <el-button @click="clickHandler('downLoadConfigParamModel')">下载产品和竞品配置参数模板</el-button>
        <el-button @click="clickHandler('downLoadNewConfigModel')">下载新产品配置方案对比表模板</el-button>
      </div>
      <el-input style="width: 200px" placeholder="请输入关键词" v-model="Data.searchVal" @change="searchHandler" clearable>
        <template #suffix>
          <el-icon class="el-input__icon"><Search /></el-icon>
        </template>
      </el-input>
    </div>
    <div>
      <NewPiTable
        :columns="Data.colunms"
        :data="Data.tableData"
        :selectable="true"
        @selectionChange="changeSelect"
        :tableLoad="Data.tableLoad"
        :isShowSetting="false"
        :pagination="Data.tableData?.length > 10"
        :isWebPagination="Data.tableData?.length > 10"
        :page-size="10"
        :total="Data.tableData.length"
      >
        <template #fileName="scope">
          <el-link :underline="false" type="primary" @click="downLoad(scope.row.fileOid, scope.row.fileName)">{{ scope.row.fileName }}</el-link>
        </template>
      </NewPiTable>
    </div>
    <upload-dialog v-model:isShow="Data.isShow" :title="'上传附件'" @submit="submit"></upload-dialog>
  </div>
</template>

<script setup>
import NewPiTable from '@/components/common/table/newPiTable.vue';
import { useCommonHandler } from '@/hooks';
import * as _ from 'lodash';
const projectOid = JSON.parse(sessionStorage.getItem('currentProject')).oid;
const api = window.$api;

const Data = reactive({
  tableLoad: false,
  searchVal: '',
  // 表头
  colunms: [
    {
      title: '标签或文件名',
      dataIndex: 'fileName',
    },
    {
      title: '格式',
      dataIndex: 'formatName',
    },
    {
      title: '上次修改时间',
      dataIndex: 'lastModifyTime',
    },
    {
      title: '修改者',
      dataIndex: 'uploadUser',
    },
  ],
  // 表格数据
  tableData: [],
  handlerSearchData: [],
  // 按钮集合
  btnList: [
    {
      label: '上传附件',
      isPrimary: true,
      clickName: 'uploadFile',
    },
    {
      label: '删除附件',
      isPrimary: false,
      clickName: 'removeFile',
    },
    {
      label: '下载产品和竞品配置参数模板',
      isPrimary: false,
      clickName: 'downLoadConfigParamModel',
    },
    {
      label: '下载新产品配置方案对比表模板',
      isPrimary: false,
      clickName: 'downLoadNewConfigModel',
    },
  ],
  selectRows: [], // 选择数据
  projectType: sessionStorage.getItem('projectState'), // 项目类型
});

onMounted(() => {
  initData();
});

// 下载文件
const downLoad = (e, fileName) => {
  console.log(e);
  let params = {
    oid: e,
  };
  api.commonApi.downloadContent(params).then((res) => {
    if (!res) return window.$message.error('下载失败');
    useCommonHandler.download(res, fileName);
  });
};

// 按钮点击操作
const clickHandler = (name) => {
  let oids = [];
  switch (name) {
    case 'uploadFile':
      Data.isShow = true;
      break;
    case 'removeFile':
      if (Data.selectRows.length === 0) return window.$message.warning('请选择要删除的数据');
      Data.selectRows.forEach((e) => {
        oids.push(e.fileOid);
      });
      _deletePiProjectAttachment(oids.join(','));
      break;
    case 'downLoadConfigParamModel':
      console.log('产品和竞品配置参数模板');
      _projectInitiationApi('产品和竞品配置参数模板');
      break;
    case 'downLoadNewConfigModel':
      console.log('新产品配置方案对比表模板');
      _projectInitiationApi('新产品配置方案对比表模板');
      break;
  }
};

// 导出模板
const _projectInitiationApi = (modelName) => {
  sessionStorage.removeItem('downloadName');
  let params = {
    reviewType: modelName,
  };
  api.projectInitiationApi.downloadFinancialTemplate(params).then((res) => {
    let str = decodeURIComponent(sessionStorage.getItem('downloadName'));
    useCommonHandler.download(res, str.split('=')[1]);
  });
};
// 表格数据初始化
const initData = () => {
  Data.tableLoad = true;
  let params = new FormData();
  params.append('projectOid', projectOid);
  api.competitorConfigApi.queryPiProjectAttachment(params).then((res) => {
    if (res.success) {
      Data.tableData = res.data;
      Data.handlerSearchData = _.cloneDeep(res.data);
      Data.tableLoad = false;
    } else {
      Data.tableData = [];
      Data.tableLoad = false;
    }
  });
};

// 上传方法
const submit = (fileList) => {
  let params = new FormData();
  params.append('projectOid', projectOid);
  fileList.forEach((e) => {
    params.append('fileInfo', e.raw);
  });
  api.competitorConfigApi.uploadPiProjectAttachment(params).then((res) => {
    if (res.success) {
      window.$message.success(res.data);
      Data.isShow = false;
      initData();
    }
  });
};

// 删除功能
const _deletePiProjectAttachment = (oids) => {
  let params = new FormData();
  params.append('projectOid', projectOid);
  params.append('fileOids', oids);
  api.competitorConfigApi.deletePiProjectAttachment(params).then((res) => {
    if (res.success) {
      window.$message.success('删除成功');
      initData();
      Data.selectRows = [];
    }
  });
};

// 搜索方法
const searchHandler = (val) => {
  let handSearchTable = [];
  if (val) {
    Data.handlerSearchData.filter((item) => {
      let count = 0;
      for (let k in item) {
        if (item[k]) {
          let nowValue = item[k].toString();
          if (nowValue.includes(val)) {
            count++;
          }
        }
      }
      if (count) {
        handSearchTable.push(item);
      }
    });
    Data.tableData = handSearchTable;
  } else {
    Data.tableData = Data.handlerSearchData;
  }
};

// 选择的数据
const changeSelect = (row) => {
  Data.selectRows = [];
  Data.selectRows = row;
};
</script>

<style lang="less" scoped>
.competitorConfig {
  height: calc(100vh - 120px);
  padding: 16px;
  background-color: #fff;
  .title {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
  }
  .btnList {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }
}
</style>
