<template>
  <div class="risk">
    <div class="title">风险库</div>
    <PiTable
      :columns="riskTableColunms"
      :allColumns="allColums"
      :data="riskTableData"
      :selectable="true"
      @selectionChange="changeSelect"
      rowKey="oid"
      :tableLoad="tableLoad"
      :pagination="true"
      tableName="risklibraryListTable"
      @updateTableData="updateTableData"
    >
      <template #healthStatus="scope">
        <span :class="['status' + scope.row.healthStatus]">
          <el-icon><Cpu /></el-icon>
        </span>
      </template>
      <template #projectName="scope">
        <el-link type="primary" @click="goProject(scope.row)" :underline="false">
          {{ scope.row.projectName }}
        </el-link>
      </template>
      <!-- <template #pagination>
        <el-pagination
          :page-sizes="[10, 20, 50, 100]"
          layout="total, prev, pager, next, sizes,jumper"
          :total="count"
        />
      </template> -->
    </PiTable>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, getCurrentInstance, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import PiTable from '@/components/pdcCustom/PiTable.vue';
import { getRiskListForLibrary } from '@/api/risk';
import { getCustomizeHeaders, getTableViewColumns } from '@/api/common';
export default defineComponent({
  components: { PiTable },
  setup() {
    const { proxy: that } = getCurrentInstance();
    const tableData = reactive({
      tableLoad: false,
      riskTableData: [],
      riskTableColunms: [],
      allColums: [],
      userInfo: JSON.parse(window.$Cookies.get('userInfo')),
    });

    const initFun = async () => {
      tableData.tableLoad = true;
      // 获取默认表头
      let columsStr = '';
      const params = {
        inside: 'risklibraryListTable',
        userName: tableData.userInfo.username,
      };
      await getCustomizeHeaders(params).then((res) => {
        if (res.success) {
          columsStr = res.data.labelList;
        } else {
          tableData.tableLoad = false;
          that.$message.error(res);
        }
      });

      // 获取表头所有数据
      let obj = {
        tableID: 'risklibraryListTable',
        types: 'com.pisx.pmgt.risk.PIProjectRisk',
      };
      await getTableViewColumns(obj).then((res) => {
        let temp = res.data.columns;
        tableData.riskTableColunms = columsStr.split(',').map((v) => {
          return {
            title: temp[v],
            dataIndex: v,
            ellipsis: true,
            width: 130,
          };
        });
        tableData.allColums = [];
        for (let key in temp) {
          let obj = {
            title: temp[key],
            dataIndex: key,
            ellipsis: true,
            width: 130,
          };
          tableData.allColums.push(obj);
        }
      });

      // 获取数据
      await getRiskListForLibrary({
        columns: columsStr,
        username: 'wyu',
        page: 1,
        range: 10,
      }).then((res) => {
        if (res.success) {
          let arr = res.data.total ? res.data.rows : [];
          arr.forEach((e) => {
            for (let key in e) {
              if (e[key] instanceof Object) {
                e[key] = e[key].display;
              }
            }
          });
          tableData.riskTableData = arr;
        } else {
          that.$message.warning(res.message + '失败！');
        }
        tableData.tableLoad = false;
      });
    };

    onMounted(() => {
      initFun();
    });

    const changeSelect = (val) => {
      console.log(val);
    };
    const updateTableData = () => {
      initFun();
    };

    return {
      ...toRefs(tableData),
      updateTableData,
      changeSelect,
    };
  },
});
</script>

<style scoped lang="scss">
</style>