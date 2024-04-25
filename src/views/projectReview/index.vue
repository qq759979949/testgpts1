<template>
  <div class="projectReview">
    <p class="projectReview-title">{{ Data.currentProject.projectName }}-{{ Data.currentProject.projectShortName }}</p>
    <div class="title-top">
      <div class="title-btn">
        <el-button type="primary" v-permission="'/plmProject/cr'" @click="createReview">{{ $intl('createReview').d('创建评审') }}</el-button>
        <el-button v-permission="'/plmProject/er'" @click="handleEdit" :disabled="Data.selectTableData.length !== 1">{{ $intl('edit').d('编辑') }}</el-button>
        <el-button v-permission="'/plmProject/dr'" @click="handleDelete">{{ $intl('delete').d('删除') }}</el-button>
      </div>
      <el-input v-model="Data.searchValue" style="width: 224px; margin-left: 20px" placeholder="请输入搜索关键词" clearable @keyup.enter="searchProject">
        <template #suffix>
          <el-icon class="el-input__icon" @click="searchProject"><Search /></el-icon>
        </template>
      </el-input>
    </div>
    <div class="tableCss">
      <NewPiTable
        :columns="Data.colunms"
        :data="Data.tableData"
        :selectable="true"
        @selectionChange="selectionChange"
        height="600"
        rowKey="oid"
        :tableLoad="Data.tableLoad"
        :pagination="Data.tableData?.length > 10"
        :isWebPagination="Data.tableData?.length > 10"
        :page-size="10"
        :total="Data.tableData.length"
        @updateTableData="updateTableData"
      >
        <template #reviewNumber="scope">
          <el-link type="primary" :underline="true" @click="handleGoDetail(scope.row)">
            {{ scope.row.reviewNumber }}
          </el-link>
        </template>
        <template #orderNumbers="scope">
          <el-tooltip :content="scope.row.orderNumbers" placement="top">
            <div class="columnTitle">
              {{ scope.row.orderNumbers }}
            </div>
          </el-tooltip>
        </template>
      </NewPiTable>
    </div>
  </div>
</template>

<script setup>
import NewPiTable from '@/components/common/table/newPiTable.vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
const api = window.$api;
const router = useRouter();
const Data = reactive({
  searchValue: '',
  colunms: [
    {
      width: 140,
      title: '评审编号',
      dataIndex: 'reviewNumber',
      filters: 'select',
    },
    {
      title: '评审名称',
      width: 150,
      dataIndex: 'reviewName',
      filters: 'select',
    },
    {
      title: '评审点',
      dataIndex: 'reviewPoint',
      filters: 'select',
    },
    {
      title: '修改者',
      dataIndex: 'modifier',
      filters: 'select',
    },
    {
      title: '订货号',
      dataIndex: 'orderNumbers',
      filters: 'select',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      filters: 'date',
    },
    {
      title: '完成时间',
      dataIndex: 'endTime',
      filters: 'date',
    },
    {
      title: '状态',
      dataIndex: 'state',
      filters: 'select',
    },
  ],
  tableData: [], // 评审列表
  selectTableData: [],
  reviewName: '',
  tableDataCopy: [],
  columsStr: '',
  tableLoad: false,
  oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  selectOid: [], // 选中的oid
  currentProject: '', // 当前项目信息
  defalutTableData: [],
});
watch(
  () => Data.searchValue,
  (val) => {
    if (val === '') {
      Data.tableData = [...Data.defalutTableData];
    }
  },
);
onMounted(() => {
  Data.currentProject = JSON.parse(sessionStorage.getItem('currentProject'));
  _getReviewObjects();
});
// 获取评审列表
const _getReviewObjects = () => {
  Data.tableLoad = true;
  api.reviewApi.getReviewObjects({ oid: Data.oid }).then((res) => {
    if (res.success) {
      Data.tableData = res.data;
      Data.tableData.map((item) => {
        item.primaryBusinessObject = item.oid;
        item.columnKey = item.oid;
      });
      Data.tableDataCopy = Data.tableData;
      Data.defalutTableData = Data.tableData;
      Data.tableLoad = false;
    } else {
      Data.tableLoad = false;
      window.$message.error(res.message);
    }
  });
};
// 创建评审
const createReview = () => {
  let projectType = JSON.parse(sessionStorage.getItem('currentProject')).projectType;
  projectType !== '' ? router.push({ name: 'createReview' }) : window.$message.warning('项目类型为空,不允许创建');
};
// 编辑
const handleEdit = () => {
  Data.selectTableData[0].state === '正在工作'
    ? router.push({ name: 'editReview', query: { oid: Data.selectTableData[0].oid } })
    : window.$message.warning('只有正在工作的评审可以编辑修改');
};
// 删除
const handleDelete = () => {
  if (Data.selectTableData.length === 0) return window.$message.warning('请选择需要删除的数据');
  let canDelete = '';
  Data.selectTableData.map((item) => {
    item.state === '正在工作' || item.state === '已取消' ? (canDelete = true) : (canDelete = false);
  });
  if (!canDelete) return window.$message.warning('当前状态下的数据不能被删除');
  if (canDelete) {
    let arr = [];
    Data.selectTableData.forEach((item) => {
      arr.push(item.oid);
    });
    Data.tableLoad = true;
    let params = new FormData();
    params.append('oid', JSON.stringify(arr));
    api.reviewApi.deleteReviewObject(params).then((res) => {
      if (res.success) {
        window.$message.success('删除成功');
        _getReviewObjects();
        Data.tableLoad = false;
      } else {
        window.$message.error(res.message);
        Data.tableLoad = false;
      }
    });
  }
};
// 列表点击查看
const handleGoDetail = (row) => {
  router.push({
    name: 'examineReview',
    query: {
      oid: row.oid, // 评审ID
      goFlag: false,
      projectOid: row.projectOid, // 项目ID
      processType: row.processType,
      reviewType: row.reviewType,
      workitemOID: row.oid,
      meetFlag: false,
      fromTabName: '评审列表',
      reviewPoint: row.reviewPoint ? row.reviewPoint.split('-')[1] : '',
    },
  });
};
// 搜索
const searchProject = () => {
  const searchTerm = Data.searchValue.toLowerCase();
  Data.tableData = Data.tableDataCopy.filter((row) => {
    return Object.keys(row).some((key) => {
      return String(row[key]).toLowerCase().includes(searchTerm);
    });
  });
};
// 列表复选框
const selectionChange = (val) => {
  Data.selectTableData = val;
};
const updateTableData = () => {
  Data.page = 1;
  _getReviewObjects();
};
</script>

<style scoped lang="less">
.projectReview {
  width: calc(100% - 32px);
  min-height: calc(100vh - 60px - 36px - 16px);
  margin: 0 16px;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  color: #333333;
  .projectReview-title {
    font-size: 18px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    margin-bottom: 10px;
  }
  .title {
    //模块标题
    font-size: 20px;
    font-weight: bold;
    margin: 0 0 10px 0;
  }

  .title-top {
    //顶部按钮+搜索框
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
}
</style>
