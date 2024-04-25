<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-11-07 09:47:49
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-04 16:10:57
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\warningTask\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="todo-task-wrapper-call page_common">
    <tabs-badge :activeKey="activeKey" :tabs="tabs" @tabHandleClick="tabHandleClick"></tabs-badge>
    <!-- <el-tabs v-model="activeKey" class="todo-table-header">
        <el-tab-pane
          v-for="item in tabs"
          :key="item.type"
          :name="item.type"
          :label="item.title"
        >
        <template #label>
          <span class="custom-tabs-label">
            <el-badge :value="12" class="badge-tab">
              {{ item.title }}
            </el-badge>
          </span>
        </template>
        </el-tab-pane>
    </el-tabs> -->
    <div class="todo-table-wrapper">
      <component :is="activeKey" v-if="tasks.includes(activeKey)" :key="activeKey" :activeKey="activeKey" :isHomePage="isHomePage" />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, getCurrentInstance, onMounted } from 'vue';
// import { useRouter } from 'vue-router';
// import { getTodoTables } from '@/api/todoApi';
import Tasks from './module/task';
import tabsBadge from '@/components/tabs/tabsBadge.vue';
export default defineComponent({
  components: {
    ...Tasks,
    tabsBadge,
  },
  props: {
    isHomePage: {
      type: String,
      default: '',
    },
  },
  setup() {
    const { proxy: that } = getCurrentInstance();
    // const router = useRouter();
    const Data = reactive({
      activeKey: 'dueTask',
      tabs: [
        {
          type: 'dueTask',
          title: '即将到期的项目任务',
          // value: 12,
        },
        {
          type: 'overdueTask',
          title: '已逾期的项目任务',
          // value: 6,
        },
      ],
      tasks: Object.keys(Tasks),
    });
    const tabHandleClick = (key) => {
      Data.activeKey = key;
    };
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
    const getTaskValue = () => {
      window.$api.toDoApi.getDueTaskAmount({}).then((res) => {
        if (res.success) {
          Data.tabs = Data.tabs.map((item) => {
            if (item.type === 'dueTask') {
              item.value = res.data.yellowTaskAmount;
            } else {
              item.value = res.data.redTaskAmount;
            }
            return item;
          });
        } else {
          that.$message.error(res.message);
        }
      });
    };
    onMounted(() => {
      // initFun()
      getTaskValue();
    });

    return {
      ...toRefs(Data),
      tabHandleClick,
      getTaskValue,
    };
  },
});
</script>

<style lang="scss" scoped>
.todo-task-wrapper-call {
  padding: 16px;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  display: flex;
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
  &:deep {
    .custom-item-wrapper {
      padding-top: 0;
    }
    .content-item-filters {
      margin-top: 0;
    }
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
