<!-- 
    项目风险模块

-->
<template>
  <div class="project-risk page_common">
    <div class="top-card">
      <el-row>
        <el-col :span="4" v-for="item in 3">
          <el-card class="card" shadow="never">
            <el-row>
              <el-col :span="20">
                <div><img src="@/assets/img/avatar.jpg" alt="" class="image" /></div>
                <div class="total-num">问题总数量</div>
              </el-col>
              <el-col :span="4" class="right-num">12</el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="divider"></div>
    <div class="currentProject">{{ currentProject?.projectShortName }} -- {{ currentProject?.projectName }}</div>
    <div class="title-top">
      <div class="title-btn">
        <el-button type="primary" @click="createRisk">{{ $intl('createRisk').d('创建风险') }}</el-button>
        <el-button type="primary" :disabled="selectTableData.length !== 1" @click="goEdit">{{ $intl('btn.edit').d('编辑') }}</el-button>
        <!-- <el-button>{{ $intl('btn.copy').d('复制') }}</el-button> -->
        <el-button @click="onDelete">{{ $intl('btn.delete').d('删除') }}</el-button>
        <el-button @click="exportRisk">{{ $intl('btn.export').d('导出') }}</el-button>
        <!-- <el-dropdown class="ml12" trigger="click" @command="handleMenuClick">
          <el-button >
            {{ $intl('btn.more').d('更多') }} <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu >
              <el-dropdown-item command="exportQuetionTemplate">{{ $intl('btn.export').d('导出') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
      </div>
      <div class="title-search">
        <el-input v-model="searchInput" class="w-50 m-2" @change="searchData" placeholder="请输入..." suffix-icon="Search" clearable />
      </div>
    </div>
    <div class="tableCss">
      <PiTable :columns="colunms" :data="tableData" :selectable="true" @selectionChange="selectionChange" rowKey="projectIssueOid" :pagination="true">
        <template #riskName="scope">
          <el-link type="primary" @click="goRisk(scope.row)" :underline="false">
            {{ scope.row.riskName }}
          </el-link>
        </template>
      </PiTable>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, getCurrentInstance, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getRisks, deleteObj, exportProjects } from '@/api/risk';
import PiTable from '@/components/pdcCustom/PiTable.vue';
export default defineComponent({
  name: 'createRisk',
  components: { PiTable },
  setup() {
    const { proxy: that } = getCurrentInstance();
    const router = useRouter();
    const Data = reactive({
      searchInput: '',
      colunms: [],
      tableData: [],
      selectTableData: [],
      handSearchTable: [], //表格过滤数据
      oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
      allColums: [],
      columsStr: '',
      page: 1,
      pageSize: 10,
      total: 0,
      sessionId: '',
      currentProject: JSON.parse(sessionStorage.getItem('currentProject')),
    });

    //选择的表格数据行
    function selectionChange(keys, data) {
      Data.selectTableData = data;
    }
    //获取表格列表数据
    function _getRisks() {
      getRisks({
        oid: Data.oid,
        columns: Data.columsStr,
        page: Data.page,
        range: Data.pageSize,
        sessionId: Data.page === 1 ? undefined : Data.sessionId,
      }).then((res) => {
        if (res.success) {
          let arr = res.data.total ? res.data.rows : [];
          arr.forEach((e) => {
            for (let key in e) {
              if (e[key] instanceof Object) {
                e[key] = e[key].display;
              }
            }
          });
          Data.tableData = arr;
          Data.total = res.data.total;
          Data.sessionId = res.data.sessionId;
        } else {
          that.$message.warning(res.message + '失败！');
        }
      });
    }
    function searchData() {
      let arr = [];
      if (Data.searchInput !== '') {
        Data.tableData.map((item) => {
          let count = 0;
          for (let k in item) {
            if (item[k]) {
              let nowValue = item[k].toString();
              if (nowValue.includes(Data.searchInput)) {
                count++;
              }
            }
          }
          if (count) {
            arr.push(item);
          }
          Data.tableData = arr;
        });
      } else {
        Data.tableData = Data.handSearchTable;
      }
    }
    function handleMenuClick(e) {
      switch (e) {
        case 'exportQuetionTemplate':
          exportList();
          break;
      }
    }
    function onDelete() {
      let arr = Data.selectTableData.map((item) => {
        return item.oid;
      });
      deleteObj({ oids: arr.join(',') }).then((res) => {
        if (res.success) {
          that.$message.success('操作成功');
          _getRisks();
        } else {
          that.$message.warning(res.message);
        }
      });
    }
    function exportRisk() {}
    function exportList() {
      let params = {
        projects: [],
        titles: [
          {
            name: 'number',
            num: 1,
            title: '风险编号',
          },
          {
            name: 'name',
            num: 2,
            title: '风险名称',
          },
          {
            name: 'riskType',
            num: 3,
            title: '风险类别',
          },
          {
            name: 'activity',
            num: 4,
            title: '活动',
          },
          {
            name: 'addDate',
            num: 5,
            title: '提出时间',
          },
          {
            name: 'resolveUser',
            num: 6,
            title: '风险解决人',
          },
          {
            name: 'expectedSolutionDate',
            num: 7,
            title: '实际解决时间',
          },
          {
            name: 'state',
            num: 8,
            title: '状态',
          },
        ],
      };
      if (Data.selectTableData.length === 0) {
        params.projects = Data.tableData;
      } else {
        let arr = Data.tableData.filter((item) => Data.selectTableData.includes(item.oid));
        params.projects = arr;
      }
      exportProjects(params).then((res) => {
        let blob = new Blob([res]);
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = '项目风险.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      });
    }

    function goEdit() {
      let oid = Data.selectTableData[0].oid;
      console.log(Data.selectTableData);
      sessionStorage.setItem('currentEditRisk', oid);
      router.push({ name: 'editRisk' });
    }
    function createRisk() {
      router.push({ name: 'createRisk' });
    }
    function goRisk(obj) {
      sessionStorage.setItem('currentRisk', obj.oid);
      router.push({ name: 'riskDetail' });
    }
    // 获取数据
    const userInfo = JSON.parse(window.$Cookies.get('userInfo'));
    async function initFun() {
      // 获取表头
      if (!Data.colunms.length) {
        let columnsParmas = {
          inside: 'risklibraryListTable',
          userName: userInfo.username,
        };
        let allColumsParmas = {
          tableID: 'risklibraryListTable',
          types: 'com.pisx.pmgt.risk.PIProjectRisk',
        };
        let columsObj = await that.$commonApis.getColums(columnsParmas, allColumsParmas);
        Data.colunms = columsObj.colunmsData;
        Data.allColums = columsObj.allColumsData;
        Data.columsStr = columsObj.columsStr;
      }
      // 获取数据
      _getRisks();
    }
    onMounted(() => {
      initFun();
    });

    return {
      ...toRefs(Data),
      selectionChange,
      searchData,
      handleMenuClick,
      onDelete,
      createRisk,
      goRisk,
      goEdit,
    };
  },
});
</script>

<style scoped lang="scss">
.project-risk {
  width: 100%;
  padding: 16px;
  background: #fff;
  margin-right: 16px;
  .title {
    //模块标题
    font-size: 20px;
    font-weight: bold;
    margin: 0 0 10px 0;
  }
  .top-card {
    height: 130px;
    position: relative;
    margin: -20px -16px;
    background-color: #f3f6f9;
    .card {
      background-color: #fff;
      height: 110px;
      margin-right: 20px;
      border: 0px solid;
      border-radius: 0px;
      .image {
        display: inline-block;
        width: 40px;
        height: 40px;
      }
      .total-num {
        font-size: 12px;
        color: #999;
      }
      .right-num {
        font-size: 24px;
        color: #333;
        font-weight: 550;
        line-height: 80px;
      }
    }
  }
  .divider {
    position: relative;
    margin: 0 -20px;
    background-color: #f3f6f9;
    height: 20px;
    margin-bottom: 10px;
  }
  .currentProject {
    font-size: 20px;
    font-weight: 550;
    color: #333;
    padding-bottom: 10px;
  }
  .title-top {
    //顶部按钮+搜索框
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
}
</style>