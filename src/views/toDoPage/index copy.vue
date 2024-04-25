<template>
  <div class="toDoPage">
    <div>
      <div class="title">{{ $intl('toDoPage').d('任务中心') }}</div>
      <div class="action">
        <el-button type="primary">接收任务</el-button>
        <el-button>重新分配任务</el-button>
        <el-button>拒绝任务</el-button>
      </div>
      <div class="table">
        <PiTable
          :columns="myTaskColumns"
          :data="myTaskTableData"
          rowKey="oid"
          :pagination="true"
          v-model:current-page.sync="page"
          v-model:page-size.sync="range"
          :total="total"
          :tableLoad="tableLoading"
          :selectable="true"
          @selectionChange="selectData"
        >
          <template #role="scope">
            <span>{{ scope.row.role.display }}</span>
          </template>
        </PiTable>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, getCurrentInstance, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import PiTable from '@/components/pdcCustom/PiTable.vue';
import { getUserTaskColumns, getUserTasks } from '@/api/todoApi';
import { getCustomizeHeaders, getTableViewColumns } from '@/api/common';
export default defineComponent({
  components: { PiTable },
  setup() {
    const { proxy: that } = getCurrentInstance();
    const router = useRouter();
    const state = reactive({
      tableLoading: false,
      params: {
        state: 'OPEN',
        columns: undefined,
        sessionId: undefined,
      },
      page: 1,
      range: 10,
      total: 0,
      myTaskColumns: [],
      myTaskTableData: [],
      typeOptions: [
        { label: '全部', value: 'ALL' },
        { label: '未完成', value: 'NOT_COMPLETED' },
        { label: '已完成', value: 'COMPLETED' },
      ],
      typeValue: 'NOT_COMPLETED',
      userInfo: JSON.parse(window.$Cookies.get('userInfo')),

      // 表格点击事件
      // operation(item) {
      //   sessionStorage.setItem('todoRecord', JSON.stringify(item))
      //   router.push({name: 'toDoDetail'})
      // }
      selectData(item, value) {
        let str = JSON.parse(JSON.stringify(item));
        console.log(str, 80);
        let arr = JSON.parse(JSON.stringify(value));
        console.log(arr, 81);
      },
    });

    const initGetList = async () => {
      state.tableLoading = true;
      // 获取默认表头
      const params = {
        inside: 'worklfowTaskTable',
        userName: state.userInfo.username,
      };
      await getCustomizeHeaders(params).then((res) => {
        if (res.success) {
          state.params.columns = res.data.labelList;
        } else {
          that.$message.error(res);
        }
      });

      // 获取表头
      let obj = {
        tableID: 'worklfowTaskTable',
        types: 'wt.workflow.work.WorkItem',
      };
      await getTableViewColumns(obj).then((res) => {
        if (res.success) {
          let columnsKeysArr = state.params.columns.split(',');
          state.myTaskColumns = columnsKeysArr.map((v) => {
            if (v === 'role') {
              return {
                title: res.data.columns[v],
                dataIndex: v,
                scope: v,
              };
            } else {
              return {
                title: res.data.columns[v],
                dataIndex: v,
              };
            }
          });
        } else {
          that.$message.error(res);
        }
      });

      // 获取数据
      state.params.sessionId = state.page === 1 ? undefined : state.params.sessionId;
      state.params.page = state.page;
      state.params.range = state.range;
      getUserTasks(state.params)
        .then((res) => {
          if (res.success) {
            state.myTaskTableData = res.data.rows;
            state.total = res.data.total;
            state.params.sessionId = res.data.sessionId;
          } else {
            that.$message.error(res);
          }
          state.tableLoading = false;
        })
        .catch((err) => {
          state.myTaskTableData = [];
          state.page = 1;
          state.total = 0;
          state.tableLoading = false;
        });
    };

    watch(
      () => state.page,
      (val) => {
        initGetList();
      },
    );
    watch(
      () => state.range,
      () => {
        state.params.page = 1;
        initGetList();
      },
    );

    onMounted(async () => {
      initGetList();
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">
.toDoPage {
  padding-bottom: 50px;
  .processType {
    display: flex;
    justify-content: space-between;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    line-height: 30px;
    margin-bottom: 12px;
  }
  .action {
    margin-bottom: 12px;
  }
}
</style>
