<template>
  <div class="custom-item-wrapper">
    <todoTable
      v-bind="$attrs"
      table-name="user_workflow_task_map"
      types="wt.workflow.work.WorkItem"
      :table-api="tableApi"
      :payload="payload"
      @handApprove="handApprove"
      :activeKey="activeKey"
      :isHomePage="isHomePage"
      @goProcess="goProcess"
      ref="toDoProcess"
    >
      <template #filters v-if="isHomePage !== 'isHomePage'">
        <div class="title-todo">
          <!-- 流程列表 -->
          <!-- <el-button type="primary" @click="handleClick">重新分配任务</el-button> -->
        </div>
        <div>
          <!-- <span class="process-status">流程状态：</span>
          <el-select v-model="payload.state" filterable clearable class="custom-form-item" placeholder="请选择">
            <el-option v-for="item in stateList" :key="item.value" :value="item.value" :label="item.label" />
          </el-select> -->
          <el-input style="width: 200px; margin-left: 10px" placeholder="请输入搜索关键词" @change="onSearch" v-model="searchValue" clearable></el-input>
        </div>
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
  name: 'toDoWorklfowTable',
  components: { todoTable },
  setup(props) {
    const { proxy: that } = getCurrentInstance();
    const router = useRouter();
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
      tableApi: window.$api.toDoApi.getTodoData,
      searchValue: '',
    });

    const handApprove = (item) => {
      sessionStorage.setItem('todoRecord', JSON.stringify(item));
      // console.log(item);
      /**文件流程入口 */
      // switch (key) {
      //   case value:

      //     break;

      //   default:
      //     break;
      // }
      // router.push({ name: 'toDoDetail' });
    };
    // 待办流程跳转
    const goProcess = async (scope) => {
      // await window.$commonApisFun.getProjectMenuList(scope.projectOid, JSON.parse(window.$Cookies.get('userInfo')).username, scope.projectType);
      window.$navTagStore.removeAllCache();
      let templateName = scope.processTemplateName;
      let projectObj = {};
      let currentProject = {};
      let breadcrumbName = '';
      currentProject.type = scope.projectType;
      currentProject.oid = scope.projectOid;
      breadcrumbName = `【${scope.workItemName}】${scope.processName} - ${scope.pboName}`;
      // currentProject.id = scope.id;
      // currentProject.projectShortName = scope.projectShortName ? scope.projectShortName : '';
      // currentProject.state = scope.projectState ? scope.projectState : '';
      // currentProject.projectName = scope.projectName ? scope.projectName : '';
      await window.$api.processApi.getByOid({ oid: scope.projectOid }).then((res) => {
        if (res.success) {
          currentProject.id = res.data.id;
          sessionStorage.setItem('taskProject', JSON.stringify(res.data));
        }
      });
      // sessionStorage.setItem('currentProject', JSON.stringify(currentProject));
      sessionStorage.setItem('breadcrumbName', breadcrumbName);
      let btnRole = [];
      let params2 = {
        projectOid: scope.projectOid,
        userName: JSON.parse(window.$Cookies.get('userInfo')).username,
      };
      await window.$api.commonApi.getPermissionByProjectldAndUserName(params2).then((res) => {
        if (res.data && res.data.length > 0) {
          btnRole = res?.data.map((e) => {
            return e.path;
          });
          localStorage.setItem('singleProjectRole', JSON.stringify(btnRole));
        } else {
          localStorage.setItem('singleProjectRole', JSON.stringify(['a:a:a']));
        }
        let currentProjectRole = [];
        let params = {
          projectOid: scope.projectOid,
          userName: JSON.parse(window.$Cookies.get('userInfo')).username,
        };
        // 获取到了用户在项目中的角色，才会让它跳转
        window.$api.commonApi.getRoleNamesByUserName(params).then((res) => {
          if (res.success) {
            currentProjectRole = res?.data;
            localStorage.setItem('currentProjectRole', JSON.stringify(currentProjectRole));
          } else {
            localStorage.setItem('currentProjectRole', JSON.stringify(['空']));
            window.$message.error(res.message);
          }
        });
      });

      switch (templateName) {
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
            },
          });
          break;
        // 定级
        case 'SDLG_ProjectRankingWF':
          router.push({
            name: 'maintenanceGrading',
            query: {
              oid: scope.primaryBusinessObject,
              workitemOID: scope.workitemOID,
              processOID: scope.processOID,
              projectOid: scope.projectOid,
              workItemName: scope.workItemName,
              processName: scope.processName,
              projectType: scope.projectType,
              projectShortName: scope.projectShortName,
              projectName: scope.projectName,
            },
          });
          break;
        case 'SDLG_ProjectModifyWF':
          if (scope.workItemName === '重新提交') {
            router.push({
              name: 'rejectEdit',
              query: {
                oid: scope.primaryBusinessObject,
                workitemOID: scope.workitemOID,
                processOID: scope.processOID,
                projectOid: scope.projectOid,
                workItemName: scope.workItemName,
                projectType: scope.projectType,
                processName: scope.processName,
                projectShortName: scope.projectShortName,
                projectName: scope.projectName,
              },
            });
          } else {
            router.push({
              name: 'changeProcess',
              query: {
                oid: scope.primaryBusinessObject,
                workitemOID: scope.workitemOID,
                processOID: scope.processOID,
                projectOid: scope.projectOid,
                workItemName: scope.workItemName,
                projectType: scope.projectType,
                processName: scope.processName,
                projectShortName: scope.projectShortName,
                projectName: scope.projectName,
              },
            });
          }
          break;
        // 立项流程
        case 'PIProjectStartWf':
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
              id: currentProject.id,
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
              processOID: scope.processOID, // 进程Oid
              workItemName: scope.workItemName, // 当前阶段
              goFlag: true,
              projectOid: scope.projectOid, // 项目ID
              processType: scope.processType, // 流程类型
              reviewType: scope.reviewType, // 评审类型
              meetFlag: true,
              fromTabName: '代办流程',
              reviewPoint: scope.reviewPoint, // 技术评审点
            },
          });
          break;
        // 风险跳转
        case 'PIProjectRiskWf':
          if (scope.workItemName === '重新提交') {
            router.push({
              name: 'rejectRisk',
              query: {
                oid: scope.primaryBusinessObject,
                workitemOID: scope.workitemOID,
                processOID: scope.processOID,
                projectOid: scope.projectOid,
                workItemName: scope.workItemName,
                projectType: scope.projectType,
                processName: scope.processName,
                projectShortName: scope.projectShortName,
                context: scope.context,
              },
            });
          } else {
            router.push({
              name: 'riskProcess',
              query: {
                riskOid: scope.primaryBusinessObject,
                workitemOID: scope.workitemOID,
                processOID: scope.processOID,
                workItemName: scope.workItemName,
                processName: scope.processName,
                projectShortName: scope.projectShortName,
                context: scope.context,
              },
            });
          }
          break;
        // 问题跳转
        case 'PIProjectIssueWf':
          if (scope.workItemName === '重新提交') {
            router.push({
              name: 'rejectQuestion',
              query: {
                oid: scope.primaryBusinessObject,
                workitemOID: scope.workitemOID,
                processOID: scope.processOID,
                projectOid: scope.projectOid,
                workItemName: scope.workItemName,
                projectType: scope.projectType,
                processName: scope.processName,
                projectShortName: scope.projectShortName,
                context: scope.context,
              },
            });
          } else {
            router.push({
              name: 'questionProcess',
              query: {
                issueOid: scope.primaryBusinessObject,
                workitemOID: scope.workitemOID,
                processOID: scope.processOID,
                workItemName: scope.workItemName,
                processName: scope.processName,
                projectShortName: scope.projectShortName,
                context: scope.context,
              },
            });
          }
          break;
        default:
          break;
      }
      // if (scope.processName.includes('项目定级流程') && scope.workItemName === '维护项目等级') {
      //   router.push({ name: 'maintenanceGrading', query: { oid: scope.primaryBusinessObject, workitemOID: scope.workitemOID } });
      // }
    };
    const onSearch = () => {
      that.$refs.toDoProcess.searchData(Data.searchValue);
    };
    return {
      ...toRefs(Data),
      getMyTaskData,
      handApprove,
      onSearch,
      goProcess,
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
