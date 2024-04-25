<template>
  <div class="custom-item-wrapper receivedTask">
    <todoTable
      v-bind="$attrs"
      table-name="acceptedProjectTaskTable"
      types="com.pisx.pmgt.assignment.PIResourceAssignment"
      :table-api="tableApi"
      :payload="payload"
      :activeKey="activeKey"
      :isHomePage="isHomePage"
      @appearDrawer="appearDrawer"
      @handApprove="handApprove"
      ref="acceptedTable"
    >
      <template #filters v-if="isHomePage !== 'isHomePage'">
        <div class="title-todo">
          <!-- 待审核的任务列表 -->
          <!-- <el-button type="primary" @click="handleClick">重新分配任务</el-button> -->
        </div>
        <div>
          <el-input style="width: 200px; margin-left: 10px" placeholder="请输入搜索关键词" @change="onSearch" v-model="searchValue" clearable></el-input>
        </div>
      </template>
    </todoTable>
    <el-drawer v-model="drawer" title="审核任务" :before-close="handleClose" size="50%" v-if="drawer">
      <PerformTask :oid="oid" ref="performTaskTable" @submitProcess="submitProcess" :activeName="activeName"></PerformTask>
    </el-drawer>
    <!-- <el-drawer v-model="drawer1" title="查看交付物" :before-close="handleClose1" size="50%">
      <PiTable :isShowSetting="false" :columns="columnsFile" :data="dataFile"></PiTable>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose1">取消</el-button>
          <el-button type="primary" @click="handleClose1">确认</el-button>
        </span>
      </template>
    </el-drawer> -->
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';
// import { useRouter } from 'vue-router';
import todoTable from './components/todoTables.vue';
import { getReceivedTaskData } from '@/api/todoApi';
import PerformTask from './components/performTask.vue';
// import AuditTask from './auditTask.vue';
// import PiTable from '@/components/pdcCustom/PiTable.vue';
export default defineComponent({
  name: 'AcceptedProjectTaskTable',
  components: { todoTable, PerformTask },
  props: {
    isHomePage: {
      type: String,
      default: '',
    },
    activeKey: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { proxy: that } = getCurrentInstance();
    // const router = useRouter();
    const Data = reactive({
      payload: {
        state: 'PENDINGAPPROVAL',
      },
      stateList: [
        {
          label: '全部',
          value: 'ALL',
        },
        {
          label: '打开',
          value: 'OPEN',
        },
        {
          label: '已完成',
          value: 'COMPLETED',
        },
      ],
      isHomePage: props.isHomePage,
      drawer: false,
      drawer1: false,
      columnsFile: [],
      dataFile: [],
      tableApi: window.$api.toDoApi.getApprovalProjectTasks,
      oid: '',
      searchValue: '',
      activeName: '',
    });
    const appearDrawer = (scope) => {
      Data.activeName = scope.row.plannableReference;
      Data.oid = scope.row.oid;
      Data.drawer = true;
      that.$nextTick(() => {
        that.$refs.performTaskTable.getTaskBaseInfo();
        that.$refs.performTaskTable.getDeliverable();
        that.$refs.performTaskTable.getApproveResourceTime();
        that.$refs.performTaskTable.getApproveResourceAssignmentsPage();
      });
    };
    const handleClose1 = () => {
      Data.drawer1 = false;
    };
    const handleClose = () => {
      Data.drawer = false;
    };
    const handApprove = (val) => {
      Data.drawer1 = true;
    };
    const submitProcess = () => {
      Data.drawer = false;
      that.$refs.acceptedTable.getDataContentAll();
    };
    const onSearch = () => {
      that.$refs.acceptedTable.searchData(Data.searchValue);
    };
    return {
      ...toRefs(Data),
      getReceivedTaskData,
      appearDrawer,
      handleClose1,
      handleClose,
      handApprove,
      submitProcess,
      onSearch,
    };
  },
});
</script>

<style lang="scss" scoped>
.receivedTask {
  :deep(.el-drawer__header) {
    padding-bottom: 10px;
    margin-bottom: 0;
  }
  :deep(.el-drawer__footer) {
    border-top: 1px solid #00000017;
  }
  .title-todo {
    font-size: 16px;
    color: #333;
    font-weight: 550;
  }
}
</style>
