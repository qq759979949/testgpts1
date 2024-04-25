<template>
  <div class="custom-item-wrapper">
    <todoTable
      v-bind="$attrs"
      table-name="user_workflow_task_map"
      types="wt.workflow.work.WorkItem"
      :table-api="tableApi"
      @handApprove="handApprove"
      :activeKey="activeKey"
      @goProcess="goProcess"
      :isHomePage="isHomePage"
      ref="activedProcess"
    >
      <template #filters v-if="isHomePage !== 'isHomePage'">
        <div class="title-todo">
          <!-- 已完成的流程列表 -->
          <!-- <el-button type="primary" @click="handleClick">重新分配任务</el-button> -->
        </div>
        <el-input style="width: 200px; margin-left: 10px" placeholder="请输入搜索关键词" @change="onSearch" v-model="searchValue" clearable></el-input>
        <!-- <div>
          <span class="process-status">流程状态：</span>
          <el-select v-model="payload.state" filterable clearable class="custom-form-item" placeholder="请选择">
            <el-option v-for="item in stateList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
          <el-input style="width: 200px; margin-left: 10px" placeholder="请输入搜索关键词"></el-input>
        </div> -->
      </template>
    </todoTable>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { getMyTaskData } from '@/api/todoApi';
import todoTable from './components/todoTables.vue';
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
  name: 'activedProcess',
  components: { todoTable },
  setup(props) {
    const { proxy: that } = getCurrentInstance();
    const router = useRouter();
    const Data = reactive({
      // payload: {
      //   state: 'OPEN',
      // },
      isHomePage: props.isHomePage,
      tableApi: window.$api.toDoApi.getTodoData,
      searchValue: '',
    });

    const handApprove = (item) => {
      sessionStorage.setItem('todoRecord', JSON.stringify(item));
      router.push({ name: 'toDoDetail' });
    };
    const handleClick = () => {
      // console.log('handleClick');
    };
    // 待办流程跳转
    const goProcess = async (scope) => {
      window.$navTagStore.removeAllCache();
      let templateName = scope.processTemplateName;
      // let projectObj = {};
      let currentProject = {};
      // currentProject.type = scope.projectType;
      currentProject.oid = scope.projectOid;
      // currentProject.id = scope.id;
      // currentProject.projectShortName = scope.projectShortName ? scope.projectShortName : '';
      // currentProject.state = scope.projectState ? scope.projectState : '';
      // currentProject.projectName = scope.projectName ? scope.projectName : '';
      // sessionStorage.setItem('currentProject', JSON.stringify(currentProject));
      await window.$api.processApi.getByOid({ oid: scope.projectOid }).then((res) => {
        if (res.success) {
          // currentProject.id = res.data.id;
          sessionStorage.setItem('currentProject', JSON.stringify(res.data));
        }
      });
      switch (templateName) {
        case 'SDLG_ProjectRankingWF':
          router.push({ name: 'gradingDetail', query: { oid: scope.primaryBusinessObject, workitemOID: scope.workitemOID } });
          break;
        case 'SDLG_ProjectModifyWF':
          router.push({
            name: 'changeDetail',
            query: {
              oid: scope.primaryBusinessObject,
              workitemOID: scope.workitemOID,
              processOid: scope.processOID,
            },
          });
          break;
        /**评价验收流程 */
        case 'EvaluationProcess':
        case 'EvaluationGradeProcess':
          router.push({
            name: 'checkEvaluate',
            query: {
              oid: scope.primaryBusinessObject,
              workitemOID: scope.workitemOID,
              processName: scope.processName,
              processOID: scope.processOID,
              projectOid: scope.projectOid,
              templateName: templateName,
              workItemName: scope.workItemName,
              projectType: scope.projectType,
              isCompleted: true,
            },
          });
          break;
        // 项目文档流程
        case 'SDLG_DocWF':
          router.push({
            name: 'fileProcess',
            query: {
              oid: scope.primaryBusinessObject,
              workitemOID: scope.workitemOID,
              processName: scope.processName,
              processOID: scope.processOID,
              workItemName: scope.workItemName,
              isCompleted: true,
            },
          });
          break;
        case 'PIProjectIssueWf':
          router.push({
            name: 'questionProcess',
            query: {
              issueOid: scope.primaryBusinessObject,
              workitemOID: scope.workitemOID,
              processOID: scope.processOID,
              workItemName: scope.workItemName,
              projectShortName: scope.projectShortName,
              projectName: scope.projectName,
              isCompleted: true,
            },
          });
          break;
        case 'PIProjectRiskWf':
          router.push({
            name: 'riskProcess',
            query: {
              riskOid: scope.primaryBusinessObject,
              workitemOID: scope.workitemOID,
              processOID: scope.processOID,
              workItemName: scope.workItemName,
              projectShortName: scope.projectShortName,
              projectName: scope.projectName,
              isCompleted: true,
            },
          });
          break;
        // 评审跳转
        case 'PIProjectReviewWf':
          router.push({
            name: 'examineProcess',
            query: {
              oid: scope.primaryBusinessObject, // 评审ID
              workitemOID: scope.workitemOID,
              processOID: scope.processOID, // 进程oid
              workItemName: scope.workItemName, // 当前阶段
              goFlag: false,
              projectOid: scope.projectOid, // 项目ID
              processType: scope.processType, // 流程类型
              reviewType: scope.reviewType, // 评审类型
              fromTabName: '已完成流程',
              reviewPoint: scope.reviewPoint, // 技术评审点
            },
          });
          break;
        case 'PIProjectStartWf':
          window.$api.processApi.getByOid({ oid: scope.projectOid }).then((res) => {
            if (res.success) {
              sessionStorage.setItem('currentProject', JSON.stringify(res.data));
              router.push({
                name: 'initiationProcess',
                query: {
                  oid: scope.primaryBusinessObject,
                  workitemOID: scope.workitemOID,
                  processOID: scope.processOID,
                  projectOid: scope.projectOid,
                  workItemName: scope.workItemName,
                  processName: scope.processName,
                  projectShortName: scope.projectShortName,
                  projectName: scope.projectName,
                  projectType: scope.projectType,
                  isDetail: 'true',
                },
              });
            }
          });
          break;
        default:
          break;
      }
    };
    const onSearch = () => {
      that.$refs.activedProcess.searchData(Data.searchValue);
    };
    return {
      ...toRefs(Data),
      getMyTaskData,
      handApprove,
      handleClick,
      goProcess,
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
.process-status {
  line-height: 27px;
  display: inline-block;
}
</style>
