
<template>
  <div class="projectQuestion page_common">
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
        <el-button type="primary" @click="createQuestion">{{ $intl('createQuestion').d('创建问题') }}</el-button>
        <el-button @click="editQuestion" :disabled="selectData.length !== 1">{{ $intl('editQuestion').d('编辑问题') }}</el-button>
        <el-button @click="delQuestion">{{ $intl('btn.delete').d('删除') }}</el-button>
        <el-button @click="exportQuestion">{{ $intl('btn.export').d('导出') }}</el-button>
        <!-- <el-dropdown class="ml12" trigger="click" @command="handleMenuClick">
          <el-button >
            {{ $intl('btn.more').d('更多') }} <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu >
              <el-dropdown-item command="downQuetionTemplate">{{ $intl('btn.downloadTemplate').d('下载模板') }}</el-dropdown-item>
              <el-dropdown-item command="importQuetionTemplate">{{ $intl('btn.import').d('导入') }}</el-dropdown-item>
              <el-dropdown-item command="exportQuetionTemplate">{{ $intl('btn.export').d('导出') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
      </div>
      <div class="title-search">
        <el-input v-model="searchInput" class="w-50 m-2" @change="searchData" placeholder="请输入..." suffix-icon="Search" clearable />
      </div>
    </div>
    <PiTable
      :columns="questionColunms"
      :allColumns="allColums"
      :data="questionTableData"
      :selectable="true"
      rowKey="oid"
      :tableLoad="tableLoad"
      :pagination="true"
      v-model:current-page.sync="page"
      v-model:page-size.sync="range"
      :total="total"
      tableName="issuelibraryListTable"
      @selectionChange="changeSelect"
      @updateTableData="updateTableData"
    >
      <template #name="scope">
        <el-link type="primary" @click="goIssue(scope.row)" :underline="false">
          {{ scope.row.name }}
        </el-link>
      </template>
      <template #[state_state]="scope">
        <div
          class="state-wrapper"
          :style="{
            backgroundColor: getStateColor(scope.row['state.state'].value, stateColor, 0.13),
          }"
        >
          <span
            :style="{
              color: getStateColor(scope.row['state.state'].value, stateColor),
            }"
          >
            {{ scope.row['state.state'].display }}
          </span>
        </div>
      </template>
    </PiTable>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, getCurrentInstance, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import PiTable from '@/components/pdcCustom/PiTable.vue';
import { getProjectIssueList, deleteProjectIssue } from '@/api/problem';
import { getStateColor } from '@/utils/utils';
export default defineComponent({
  components: { PiTable },
  setup() {
    const { proxy: that } = getCurrentInstance();
    const router = useRouter();
    const questionData = reactive({
      searchInput: '',
      allColums: [],
      questionColunms: [],
      questionTableData: [],
      tableLoad: false,
      selectData: [],
      page: 1,
      range: 10,
      total: 0,
      columsStr: '',
      sessionId: undefined,
      userInfo: JSON.parse(window.$Cookies.get('userInfo')),
      oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,

      /**数据处理 */
      state_state: 'state.state',
      stateColor: [
        {
          label: '开启',
          key: 'OPEN',
          value: '#5BB73B',
        },
        {
          label: '正在审阅',
          key: 'UNDERREVIEW',
          value: '#FFD700',
        },
        {
          label: '进行中',
          key: 'IN PROGRESS',
          value: '#51A1FF',
        },
        {
          label: '有效性批准',
          key: '',
          value: '#FFD700',
        },
        {
          label: '已解决',
          key: 'RELEASED',
          value: '#00CED1',
        },
        {
          label: '重新打开',
          key: 'REWORK',
          value: '#FF4D4F',
        },
        {
          label: '已取消',
          key: 'OBSOLESCENCE',
          value: '#D9D9D9',
        },

        // {
        //   label: "新建物料",
        //   key: "NEWITEM",
        //   value: "#5BB73B",
        // },
        // {
        //   label: "正在工作",
        //   key: "INWORK",
        //   value: "#51A1FF",
        // },
        // {
        //   label: "正在审阅",
        //   key: "UNDERREVIEW",
        //   value: "#FFD700",
        // },
        // {
        //   label: "待整理",
        //   key: "TO_BE_PENDING",
        //   value: "#FFA500",
        // },
      ],
      currentProject: JSON.parse(sessionStorage.getItem('currentProject')),
    });

    const changeSelect = (value) => {
      questionData.selectData = value;
    };
    const createQuestion = () => {
      router.push({
        name: 'createQuestion',
      });
    };
    // 删除
    const delQuestion = () => {
      questionData.tableLoad = true;
      const oids = questionData.selectData.join(',');
      deleteProjectIssue({ oids }).then((res) => {
        if (res.success) {
          that.$message.success('操作成功');
          initFun();
        } else {
          that.$message.warning(res.message);
          questionData.tableLoad = false;
        }
      });
    };
    const exportQuestion = () => {};
    const handleMenuClick = (e) => {
      that.$options.methods[e](questionData);
    };

    // 获取数据
    const initFun = async () => {
      questionData.tableLoad = true;
      // 获取表头
      if (!questionData.questionColunms.length) {
        let columnsParmas = {
          inside: 'issuelibraryListTable',
          userName: questionData.userInfo.username,
        };
        let allColumsParmas = {
          tableID: 'issuelibraryListTable',
          types: 'com.pisx.pmgt.change.PIProjectIssue',
        };
        let columsObj = await that.$commonApis.getColums(columnsParmas, allColumsParmas);
        questionData.questionColunms = columsObj.colunmsData;
        questionData.allColums = columsObj.allColumsData;
        questionData.columsStr = columsObj.columsStr;
      }
      // 获取数据
      await getProjectIssueList({
        oid: questionData.oid,
        columns: questionData.columsStr,
        username: questionData.userInfo.username,
        page: questionData.page,
        range: questionData.range,
        sessionId: questionData.page === 1 ? undefined : questionData.sessionId,
      }).then((res) => {
        if (res.success) {
          let arr = res.data.total ? res.data.rows : [];
          // arr.forEach((e)=>{
          //   for (let key in e) {
          //     if(e[key] instanceof Object){
          //       e[key] = e[key].display
          //     }
          //   }
          // })
          questionData.questionTableData = arr;
          questionData.total = res.data.total;
          questionData.sessionId = res.data.sessionId;
        } else {
          that.$message.warning(res.message + '失败！');
        }
        questionData.tableLoad = false;
      });
    };

    // 表头设置更新表格
    const updateTableData = () => {
      questionData.colunms = [];
      questionData.page = 1;
      initFun();
    };

    // 分页
    watch(
      () => questionData.page,
      (val) => {
        initFun();
      },
    );
    watch(
      () => questionData.range,
      () => {
        questionData.questionColunms = 1;
        initFun();
      },
    );

    // 搜索
    const searchData = () => {};

    // 详情
    const goIssue = (obj) => {
      sessionStorage.setItem('issueOid', obj.oid);
      sessionStorage.setItem('isProcessQuestion', obj.isProcess ? true : false);
      router.push({ name: 'questionDetail' });
    };

    // 编辑
    const editQuestion = () => {
      sessionStorage.setItem('issueOid', questionData.selectData[0]);
      router.push({ name: 'editQuestion' });
    };

    onMounted(() => {
      initFun();
    });

    return {
      ...toRefs(questionData),
      createQuestion,
      delQuestion,
      handleMenuClick,
      changeSelect,
      updateTableData,
      searchData,
      goIssue,
      editQuestion,
      getStateColor,
    };
  },
  methods: {
    downQuetionTemplate(e) {
      console.log(e);
    },
  },
});
</script>

<style lang="scss" scoped>
.projectQuestion {
  padding: 16px;
  background: #fff;
  width: 100%;
  margin-right: 16px;
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
  .state-wrapper {
    border-radius: 2px;
    text-align: center;
  }
}
</style>