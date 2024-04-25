<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-17 17:54:06
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectChange\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEcreateProjectChange
-->
<template>
  <div class="projectChange">
    <div class="top_area">
      <num-total :changeList="Data.changeList"></num-total>
      <!-- <el-row class="content_row">
        <el-col class="grid_content" :class="Data.cardList.length - 1 === index ? 'grid_content1' : ''" v-for="(item, index) in Data.cardList" :key="index" :span="4">
          <el-card class="card" shadow="never">
            <el-row>
              <el-col :span="20">
                <div><img :src="item.src" alt="" class="image" /></div>
                <div class="total-num">{{ item.name }}</div>
              </el-col>
              <el-col :span="4" class="right-num">{{ item.num }}</el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row> -->
    </div>
    <div class="bottom_area">
      <div class="title_change">{{ Data.currentProject.projectShortName }}--{{ Data.currentProject.projectName }}</div>
      <div class="btn_func">
        <div class="left_btn">
          <el-button type="primary" v-permission="'/plmProject/EditPC'" @click="goCreate">创建项目变更</el-button>
          <el-button v-permission="'/plmProject/EditPC'" @click="editChange">编辑</el-button>
          <el-button @click="batchDelete" v-permission="'/plmProject/DeletePC'">删除</el-button>
        </div>
        <div class="right_input"><el-input style="width: 200px" placeholder="请输入关键词" v-model="Data.changeVal" clearable @change="onSearch" /></div>
      </div>
      <NewPiTable
        :columns="Data.objectColunms"
        :data="Data.objectTableData"
        :isShowSetting="true"
        :selectable="true"
        :stripe="false"
        :pagination="false"
        :tableHeight="550"
        table-name="projectChangeTable"
        pageLabelName="defaultChange"
        :tableLoad="Data.tableLoad"
        :allColumns="Data.allColumns"
        @selectionChange="changeSelect"
        @updateTableData="updateTableData"
      >
        <template #changeNumber="scope">
          <div class="goClickStyle" type="primary" @click="seeDetail(scope)">{{ scope.row.changeNumber }}</div>
        </template>
      </NewPiTable>
    </div>
  </div>
</template>

<script setup>
import numTotal from '@/views/projectChange/comp/numTotal.vue';
const router = useRouter();
const Data = reactive({
  currentProject: JSON.parse(sessionStorage.getItem('currentProject')),
  objectColunms: [],
  objectTableData: [],
  tableLoad: false,
  allColumns: [],
  changeList: [],
  columnsParams: [],
  columnsStr: {},
  selectedData: [],
  changeVal: '',
});
const changeSelect = (val) => {
  Data.selectedData = val;
};
const updateTableData = () => {
  Data.columns = [];
  initFun();
};
const initFun = async () => {
  Data.tableLoad = true;
  // 获取表头
  let obj = {
    tableName: 'projectChangeTable',
    pageLabelName: 'defaultChange',
  };
  const obj1 = { dictCode: 'projectChange' };
  const newObj = await window.$commonApisFun.getAllColumns(obj, obj1);
  Data.objectColunms = newObj.displayHeader.map((item) => {
    console.log(item);
    if (item.dataIndex === 'creator') {
      item.width = 150;
    }
    return item;
  });
  Data.columnsStr = newObj.columnsStr;
  Data.allColumns = newObj.allHeader;
  Data.tableLoad = false;
  getChangeList();
  // getAllColumns();
};
// 创建变更
const goCreate = () => {
  if (Data.currentProject.type === '产品开发类项目' || Data.currentProject.type === '制造技术类项目' || Data.currentProject.type === '信息技术类项目') {
    if (Data.currentProject.state === '工作进行中') {
      window.$api.projectChangeApi.hasChangeProcess({ oid: Data.currentProject.oid }).then((res) => {
        if (res.success) {
          if (!res.data) {
            router.push({ name: 'createProjectChange' });
          } else {
            window.$message.error('存在正在进行的变更流程，不可以再发起变更！');
          }
        } else {
          window.$message.error(res.message);
        }
      });
    } else {
      window.$message.error('该项目状态下不支持发起变更！');
    }
  } else {
    window.$message.error('该项目类型不支持发起变更！');
  }
};
// 获取变更数据
const getChangeList = () => {
  Data.tableLoad = true;
  window.$api.projectChangeApi.queryChangeRequests({ oid: Data.currentProject.oid }).then((res) => {
    if (res.success) {
      Data.changeList = res.data;
      Data.objectTableData = res.data.showProjectChangeItems;
      Data.tableLoad = false;
      Data.tableDataCopy = res.data.showProjectChangeItems;
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
};
// 编辑变更
const editChange = () => {
  if (Data.selectedData.length === 1) {
    if (Data.selectedData[0].state === '正在工作') {
      router.push({ name: 'editProjectChange', query: { oid: Data.selectedData[0].changeOid } });
    } else {
      window.$message.error('当前状态下不可编辑！');
    }
  } else {
    window.$message.error('请选择一条数据进行编辑！');
  }
};
// 批量删除
const batchDelete = () => {
  if (Data.selectedData.length > 0) {
    const newData = Data.selectedData.filter((item) => item.state !== '正在工作');
    if (newData.length > 0) {
      window.$message.error('当前状态下的变更不可以删除！');
    } else {
      window.$ElMessageBox
        .confirm('确定要删除勾选的数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(async () => {
          Data.tableLoad = true;
          const newD = Data.selectedData.map((item) => {
            return item.changeOid;
          });
          const obj = new FormData();
          obj.append('oids', newD);
          window.$api.projectChangeApi.deleteChangeRequests(obj).then((res) => {
            if (res.success) {
              window.$message.success('删除成功！');
              getChangeList();
            } else {
              Data.tableLoad = false;
              window.$message.error(res.message);
            }
          });
        })
        .catch(() => {});
    }
  } else {
    window.$message.error('请选择数据删除！');
  }
};
// 查看变更详情
const seeDetail = (scope) => {
  window.$api.processApi.queryProcessHistory({ oid: scope.row.changeOid, queryAll: false }).then((res) => {
    if (res.success) {
      router.push({ name: 'projectChangeDetail', query: { oid: scope.row.changeOid, processOid: res.data.length > 0 ? res.data[0].processOid : '' } });
    } else {
      window.$message.error(res.message);
    }
  });
};
// 搜索变更
const onSearch = (it) => {
  Data.objectTableData = Data.tableDataCopy.filter((item) => {
    for (let key in Data.columnsStr) {
      if (item[key] && item[key].toString().includes(it)) {
        return item;
      }
    }
  });
};
onMounted(() => {
  initFun();
});
</script>

<style scoped lang="less">
.projectChange {
  padding: 16px;
  .top_area {
    height: 110px;
  }
  .bottom_area {
    margin-top: 16px;
    background: #fff;
    padding: 16px;
    .title_change {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
    }
    .btn_func {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }
  }
  .goClickStyle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #386bd7;
    cursor: pointer;
  }
}
</style>
