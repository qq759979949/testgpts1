<template>
  <div class="todo-task-wrapper page_common" v-loading="papgLoad">
    <tabs-badge :activeKey="activeKey" :tabs="tabs" @tabHandleClick="tabHandleClick"></tabs-badge>
    <div class="todo-table-wrapper">
      <component :is="activeKey" v-if="tasks.includes(activeKey)" :key="activeKey" :isHomePage="isHomePage" :activeKey="activeKey" />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, getCurrentInstance } from 'vue';
import Tasks from './module/task';
import tabsBadge from '@/components/tabs/tabsBadge.vue';
export default defineComponent({
  props: {
    isHomePage: {
      type: String,
      default: '',
    },
  },
  components: {
    ...Tasks,
    tabsBadge,
  },
  setup(props) {
    const { proxy: that } = getCurrentInstance();
    // const router = useRouter();
    const Data = reactive({
      papgLoad: false,
      activeKey: 'toDoWorklfowTable',
      tabs: [
        {
          type: 'toDoWorklfowTable',
          title: '待办流程',
          value: 0,
        },
        {
          type: 'ApproverProjectTaskTable',
          title: '待执行任务',
          value: 0,
        },
        {
          type: 'AcceptedProjectTaskTable',
          title: '待审核任务',
          value: 0,
        },
        {
          type: 'activedProcess',
          title: '已完成流程',
        },
        {
          type: 'activedTask',
          title: '已完成任务',
        },
        {
          type: 'excutedTask',
          title: '已审核任务',
        },
      ],
      tasks: Object.keys(Tasks),
      isHomePage: props.isHomePage,
    });

    // const initFun = () => {
    //   getTodoTables().then((res) => {
    //     const data = res.data;
    //     if (data.length) {
    //       const tables = data
    //         .filter((i) => i.isShow === 1)
    //         .map((i) => {
    //           // const title = this.lang === "zh-CN" ? i.name : i.todoEnName;
    //           const title = i.name
    //           return {
    //             title,
    //             type: camelToPascal(i.insideName),
    //             value: 7
    //           };
    //         });
    //       Data.tabs = tables;
    //       console.log(Data.tabs)
    //       console.log(data.tasks)
    //       Data.activeKey = tables[0].type;
    //     }
    //   });
    // }
    // const camelToPascal = (camelCase) => {
    //   return camelCase
    //     .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    //       return index === 0 ? word.toUpperCase() : word.toUpperCase();
    //     })
    //     .replace(/\s+/g, "");
    // }

    const tabHandleClick = (key) => {
      Data.papgLoad = true;
      Data.activeKey = key;
      getTaskValue();
    };
    const getTaskValue = () => {
      window.$api.toDoApi.getApprovalAndAssignTaskAmount({}).then((res) => {
        if (res.success) {
          Data.tabs = Data.tabs.map((item) => {
            if (item.type === 'AcceptedProjectTaskTable') {
              item.value = res.data.approvalTaskAmount;
            } else if (item.type === 'ApproverProjectTaskTable') {
              item.value = res.data.assignTaskAmount;
            }
            return item;
          });
        } else {
          that.$message.error(res.message);
        }
        Data.papgLoad = false;
      });
    };
    const ToDoWorkflowValue = () => {
      const params = {
        status: 'OPEN',
      };
      window.$api.toDoApi.getWorkflowData(params).then((res) => {
        if (res.success) {
          Data.tabs = Data.tabs.map((item) => {
            if (item.type === 'toDoWorklfowTable') {
              item.value = res.data.content.length;
            }
            return item;
          });
        } else {
          that.$message.error(res.message);
        }
      });
    };
    onMounted(() => {
      getTaskValue();
      ToDoWorkflowValue();
      // initFun()
      // console.log(props.isHomePage);
    });

    return {
      ...toRefs(Data),
      tabHandleClick,
      getTaskValue,
      ToDoWorkflowValue,
    };
  },
});
</script>
<style lang="less" scoped>
.page_common {
  .custom-item-wrapper {
    padding-top: 8px;
  }
}
</style>

<style lang="less" scoped>
.todo-task-wrapper {
  // width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  display: flex;
  padding: 16px;
  flex-direction: column;
  .todo-table-wrapper {
    flex: 1;
    height: 0;
  }
  .todo-table-header {
    padding: 0 20px;
    .badge-tab {
      margin-left: 10px;
    }
  }
  :v-deep(.custom-item-wrapper) {
    padding-top: 0;
  }
  :v-deep(.content-item-filters) {
    margin-top: 0;
  }
  // 自定义组件容器
  .custom-item-wrapper {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 4px;
    // padding-top: 8px;
    display: flex;
    flex-direction: column;
    .custom-form-item {
      width: 100px;
    }
  }
  :deep(.el-tabs__header) {
    margin: 0;
  }
}
</style>
