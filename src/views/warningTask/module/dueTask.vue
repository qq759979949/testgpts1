<template>
  <div class="custom-item-wrapper">
    <todoTable
      v-bind="$attrs"
      table-name="dueTaskTable"
      types="com.pisx.pmgt.assignment.PIResourceAssignment"
      :table-api="tableApi"
      :activeKey="activeKey"
      :isHomePage="isHomePage"
      @appearDrawer="appearDrawer"
      ref="approverTable"
    >
      <template #filters v-if="isHomePage !== 'isHomePage'">
        <div class="title-todo">
          <!-- 即将到期的任务列表 -->
          <!-- <el-button type="primary" @click="handleClick">重新分配任务</el-button> -->
        </div>
        <div>
          <!-- <span class="process-status">流程状态：</span> -->
          <!-- <el-select v-model="payload.state" filterable clearable class="custom-form-item" placeholder="请选择">
            <el-option v-for="item in stateList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select> -->
          <el-input style="width: 200px; margin-left: 10px; margin-top: 10px" placeholder="请输入搜索关键词" v-model="searchValue" @change="onSearch" clearable></el-input>
        </div>
      </template>
    </todoTable>
    <el-drawer v-model="drawer" title="审核任务" :before-close="handleClose" size="50%" v-if="drawer">
      <performTask :oid="oid" ref="performTaskTable" @submitProcess="submitProcess" :activeName="activeName"></performTask>
      <!-- <AuditTask></AuditTask> -->
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </span>
      </template> -->
    </el-drawer>
    <el-drawer v-model="drawer1" title="执行任务" :before-close="handleClose1" size="50%" v-if="drawer1">
      <auditTask :oid="oid" ref="auditTask" :activeName="activeName" v-loading="loading"></auditTask>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose1">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-drawer>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, getCurrentInstance } from 'vue';
// import { useRouter } from 'vue-router';
import todoTable from '@/views/toDoPage/module/components/todoTables.vue';
import performTask from '@/views/toDoPage/module/components/performTask.vue';
import auditTask from '@/views/toDoPage/module/components/auditTask.vue';
// import { getApprovalTaskData } from '@/api/todoApi';
export default defineComponent({
  name: 'dueTask',
  components: { todoTable, performTask, auditTask },
  props: {
    activeKey: {
      type: String,
      default: '',
    },
    isHomePage: {
      type: String,
      default: '',
    },
  },
  setup() {
    const { proxy: that } = getCurrentInstance();
    // const router = useRouter();
    const Data = reactive({
      // payload: {
      //   state: 'OPEN',
      // },
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
      tableApi: window.$api.toDoApi.getDueAssignedProjectTasks,
      drawer1: false,
      drawer: false,
      oid: '',
      searchValue: '',
      activeName: '',
      loading: false,
    });
    const appearDrawer = (scope) => {
      Data.activeName = scope.row.plannableReference;
      Data.oid = scope.row.oid;
      if (scope.row.plannableStatus !== '待审核') {
        Data.drawer1 = true;
        that.$nextTick(() => {
          that.$refs.auditTask.getTaskBaseInfo();
          that.$refs.auditTask.getDeliverable();
        });
      } else {
        Data.drawer = true;
        that.$nextTick(() => {
          that.$refs.performTaskTable.getTaskBaseInfo();
          that.$refs.performTaskTable.getDeliverable();
          that.$refs.performTaskTable.getApproveResourceTime();
          that.$refs.performTaskTable.getApproveResourceAssignmentsPage();
        });
      }
    };
    const handleClose = () => {
      Data.drawer = false;
    };
    const handleClose1 = () => {
      Data.drawer1 = false;
    };
    const submit = () => {
      Data.loading = true;
      const params = Object.assign(that.$refs.auditTask.ruleForm, { oid: Data.oid });
      if (
        that.$refs.auditTask.ruleForm.percent_workcomplete.toString() == '' ||
        that.$refs.auditTask.ruleForm.normalWorkHour.toString() == '' ||
        that.$refs.auditTask.ruleForm.reportDate == '' ||
        that.$refs.auditTask.ruleForm.comment.trim() == ''
      ) {
        window.$message.error('请完善必填信息');
        Data.loading = false;
        return false;
      }
      window.$api.toDoApi.submitResourceHours(params).then((res) => {
        if (res.success) {
          // that.$message.success('填报成功');
          Data.loading = false;
          Data.drawer1 = false;
          that.$refs.approverTable.getDataContentAll();
        } else {
          Data.loading = false;
          that.$message.error(res.message);
        }
      });
    };
    const submitProcess = () => {
      Data.drawer = false;
      that.$refs.acceptedTable.getDataContentAll();
    };
    const onSearch = () => {
      that.$refs.approverTable.searchData(Data.searchValue);
    };
    return {
      ...toRefs(Data),
      appearDrawer,
      handleClose,
      handleClose1,
      submit,
      submitProcess,
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
