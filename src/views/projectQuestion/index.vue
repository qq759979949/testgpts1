
<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-11 11:26:36
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectChange\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEcreateProjectChange
-->
<template>
  <div class="projectQuestion">
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
          <el-button type="primary" v-permission="'/plmProject/EditP'" @click="createQuestion">创建问题</el-button>
          <el-button v-permission="'/plmProject/EditP'" @click="editChange">编辑</el-button>
          <el-button v-permission="'/plmProject/DeleteP'" @click="delQuestion">删除</el-button>
        </div>
        <div class="right_input"><el-input style="width: 200px" placeholder="请输入关键词" /></div>
      </div>
      <NewPiTable
        :columns="Data.objectColunms"
        :data="Data.objectTableData"
        :isShowSetting="true"
        :selectable="true"
        :stripe="false"
        :pagination="false"
        :tableHeight="550"
        table-name="projectQuestionTable"
        pageLabelName="defaultQuestion"
        :tableLoad="Data.tableLoad"
        :allColumns="Data.allColumns"
        @selectionChange="changeSelect"
        @updateTableData="updateTableData"
      >
        <template #issueName="scope">
          <el-link type="primary" @click="seeDetail(scope)">{{ scope.row.issueName }}</el-link>
        </template>
      </NewPiTable>
    </div>
  </div>
</template>

<script setup>
import numTotal from '@/views/projectRisk/comp/numTotal.vue';
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
    tableName: 'projectQuestionTable',
    pageLabelName: 'defaultQuestion',
  };
  const obj1 = { dictCode: 'projectQuestion' };
  const newObj = await window.$commonApisFun.getAllColumns(obj, obj1);
  Data.objectColunms = newObj.displayHeader;
  Data.columnsStr = newObj.columnsStr;
  Data.allColumns = newObj.allHeader;
  Data.tableLoad = false;
  getChangeList();
};
// 创建问题
const createQuestion = () => {
  router.push({ name: 'createQuestion' });
};
// 获取风险数据
const getChangeList = () => {
  Data.tableLoad = true;
  window.$api.projectQuestionApi.queryProjectIssues({ oid: Data.currentProject.oid }).then((res) => {
    if (res.success) {
      Data.changeList = res.data;
      Data.objectTableData = res.data.issuesResps;
      Data.tableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
};
// 编辑问题
const editChange = () => {
  if (Data.selectedData.length === 1) {
    if (Data.selectedData[0].state === '开启') {
      // sessionStorage.setItem('issueOid', Data.selectedData[0].riskOid);
      router.push({ name: 'editQuestion', query: { issueOid: Data.selectedData[0].issueOid } });
    } else {
      window.$message.error('当前状态下不可编辑！');
    }
  } else {
    window.$message.error('请选择一条数据进行编辑！');
  }
};
// 批量删除
const delQuestion = () => {
  if (Data.selectedData.length > 0) {
    const newData = Data.selectedData.filter((item) => item.state !== '开启');
    if (newData.length > 0) {
      window.$message.error('当前状态下的问题不可以删除！');
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
            return item.issueOid;
          });
          const obj = new FormData();
          obj.append('oids', newD);
          window.$api.projectQuestionApi.deleteProjectIssues(obj).then((res) => {
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
// 查看问题详情
const seeDetail = (scope) => {
  // window.$api.processApi.queryProcessHistory({ oid: scope.row.changeOid, queryAll: false }).then((res) => {
  //   if (res.success) {
  router.push({
    name: 'questionDetail',
    query: { issueOid: scope.row.issueOid },
  });
  //   } else {
  //     window.$message.error(res.message);
  //   }
  // });
};
onMounted(() => {
  initFun();
});
</script>

<style scoped lang="less">
.projectQuestion {
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
}
</style>