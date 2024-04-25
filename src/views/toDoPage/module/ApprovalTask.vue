<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-11 15:06:36
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\toDoPage\module\ApprovalTask.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-25 17:13:43
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\toDoPage\module\ApprovalTask.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="custom-item-wrapper">
    <todoTable
      v-bind="$attrs"
      table-name="approverProjectTaskTable"
      types="com.pisx.pmgt.assignment.PIResourceAssignment"
      :table-api="tableApi"
      :payload="payload"
      :activeKey="activeKey"
      :isHomePage="isHomePage"
      @appearDrawer="appearDrawer"
      ref="approverTable"
    >
      <template #filters v-if="isHomePage !== 'isHomePage'">
        <div class="title-todo">
          <!-- 待执行的任务列表 -->
          <!-- <el-button type="primary" @click="handleClick">重新分配任务</el-button> -->
        </div>
        <div>
          <el-input style="width: 200px; margin-left: 10px" placeholder="请输入搜索关键词" @change="onSearch" v-model="searchValue" clearable></el-input>
        </div>
      </template>
    </todoTable>
    <el-drawer v-model="drawer" title="执行任务" :before-close="handleClose" size="50%" v-if="state !== '待审核' && drawer">
      <AuditTask :oid="oid" ref="auditTask" :holidays="holidays" :projectOid="projectOid" :activeName="activeName" v-loading="loading"></AuditTask>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-drawer>
    <el-drawer v-model="drawer1" title="审核任务" :before-close="handleClose1" size="50%" v-if="state === '待审核' && drawer1">
      <PerformTask :oid="oid" ref="performTaskTable" table-name="activedTaskTable" :activeName="activeName"></PerformTask>
    </el-drawer>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, getCurrentInstance } from 'vue';
import dayjs from 'dayjs';
import todoTable from './components/todoTables.vue';
import { getApprovalTaskData } from '@/api/todoApi';
import PerformTask from './components/performTask.vue';
import AuditTask from './components/auditTask.vue';
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
  name: 'ApproverProjectTaskTable',
  components: { todoTable, AuditTask, PerformTask },
  setup(props) {
    const { proxy: that } = getCurrentInstance();
    // const router = useRouter();
    const Data = reactive({
      payload: {
        state: 'OPEN',
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
      tableApi: window.$api.toDoApi.getAssignProjectTasks,
      oid: '',
      state: '',
      holidays: [],
      drawer1: false,
      projectOid: '',
      loading: false,
      activeName: '',
      searchValue: '',
    });
    const appearDrawer = (scope) => {
      Data.activeName = scope.row.plannableReference;
      let currentProject = {};
      currentProject.oid = scope.row.projectOid;
      currentProject.type = scope.row.projectType;
      currentProject.projectShortName = scope.row.projectShortName ? scope.row.projectShortName : '';
      currentProject.projectName = scope.row.projectName ? scope.row.projectName : '';
      // sessionStorage.setItem('currentProject', JSON.stringify(currentProject));
      Data.state = scope.row.plannableStatus;
      Data.oid = scope.row.oid;
      Data.projectOid = scope.row.projectOid;
      if (Data.state !== '待审核') {
        //   if (Data.state !== '待审核') {
        getApproveResourceTime(scope.row.oid);
        // } else {
        //   Data.holidays = [];
        // }
        // getApproveResourceTime(scope.row.oid);
        // if (scope.row.plannableStatus !== '待审核') {
        Data.drawer = true;
        that.$nextTick(() => {
          that.$refs.auditTask.getTaskBaseInfo();
          that.$refs.auditTask.getDeliverable();
        });
      } else {
        Data.drawer1 = true;
        that.$nextTick(() => {
          that.$refs.performTaskTable.getTaskBaseInfo();
          that.$refs.performTaskTable.getDeliverable();
          that.$refs.performTaskTable.getApproveResourceTime();
        });
      }

      // }
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
          Data.drawer = false;
          that.$refs.approverTable.getDataContentAll();
        } else {
          Data.loading = false;
          that.$message.error(res.message);
        }
      });
    };
    // 审核任务资源工时
    const getApproveResourceTime = (oid) => {
      window.$api.toDoApi.getResourceHours({ oid: oid }).then((res) => {
        if (res.success) {
          Data.holidays = res.data.map((item) => {
            item.workDate = dayjs(item.workDate).format('YYYY-MM-DD');
            return item.workDate;
          });
        } else {
          that.$message.error(res.message);
        }
      });
    };
    const onSearch = () => {
      that.$refs.approverTable.searchData(Data.searchValue);
    };
    return {
      ...toRefs(Data),
      getApprovalTaskData,
      appearDrawer,
      handleClose,
      submit,
      getApproveResourceTime,
      handleClose1,
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
