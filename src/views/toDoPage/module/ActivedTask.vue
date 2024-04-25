<template>
  <div class="custom-item-wrapper">
    <todoTable
      v-bind="$attrs"
      table-name="activedTaskTable"
      types="com.pisx.pmgt.assignment.PIResourceAssignment"
      :table-api="tableApi"
      :payload="payload"
      :activeKey="activeKey"
      @appearDrawer="appearDrawer"
      :isHomePage="isHomePage"
      ref="activedTable"
    >
      <template #filters v-if="isHomePage !== 'isHomePage'">
        <div class="title-todo">
          <!-- 已完成的任务列表 -->
          <!-- <el-button type="primary" @click="handleClick">重新分配任务</el-button> -->
        </div>
        <el-input style="width: 200px; margin-left: 10px" placeholder="请输入搜索关键词" @change="onSearch" v-model="searchValue" clearable></el-input>
      </template>
    </todoTable>
    <el-drawer v-model="drawer" title="审核任务" :before-close="handleClose" size="50%" v-if="drawer">
      <PerformTask :oid="oid" ref="performTaskTable" table-name="activedTaskTable" :activeName="activeName"></PerformTask>
    </el-drawer>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';
// import { useRouter } from 'vue-router';
import todoTable from './components/todoTables.vue';
import PerformTask from './components/performTask.vue';
export default defineComponent({
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
  name: 'activedTask',
  components: { todoTable, PerformTask },
  setup(props) {
    const { proxy: that } = getCurrentInstance();
    // const router = useRouter();
    const Data = reactive({
      payload: {
        state: 'COMPLETED',
      },
      isHomePage: props.isHomePage,
      tableApi: window.$api.toDoApi.getAssignProjectTasks,
      oid: '',
      drawer: false,
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
        // that.$refs.performTaskTable.getApproveResourceAssignmentsPage();
      });
    };
    const handleClose = () => {
      Data.drawer = false;
    };
    const onSearch = () => {
      that.$refs.activedTable.searchData(Data.searchValue);
    };
    return {
      ...toRefs(Data),
      appearDrawer,
      handleClose,
      onSearch,
    };
  },
});
</script>

<style lang="scss" scoped>
.title-todo {
  font-size: 16px;
  color: #333;
  font-weight: 550;
}
:deep(.el-drawer__header) {
  margin-bottom: 0px;
  padding-bottom: 12px;
  color: #333;
}
</style>
