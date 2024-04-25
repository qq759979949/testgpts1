<template>
  <PiTable
    v-bind="$attrs"
    v-model:currentPage="pageInfo.page"
    v-model:pageSize="pageInfo.range"
    :total="pageInfo.total"
    rowKey="oid"
    :selectable="true"
    :pagination="true"
    :columns="columns"
    :allColumns="allColumns"
    :data="tableData"
    :tableName="tableName"
    :tableLoad="tableLoad"
    @updateTableData="updateTableData"
  >
    <template v-for="item in columns" #[item.dataIndex]="scope">
      <slot :name="item.dataIndex" v-bind="scope"> </slot>
    </template>
  </PiTable>
</template>

<script setup>
import { getCustomizeHeaders } from "@/api/common";
import PiTable from "@/components/pdcCustom/PiTable.vue";
import { ref, reactive, onMounted, watch, getCurrentInstance } from "vue";

const props = defineProps({
  columnsApi: {
    type: Function,
    default: () => {},
  },
  tableApi: {
    type: Function,
    default: () => {},
  },
  tableName: {
    type: String,
    default: "",
  },
  payload: {
    type: Object,
    default: () => ({}),
  },
});

const columns = ref([]);
const allColumns = ref([]);
const tableData = ref([]);
const tableLoad = ref(false);
const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
const pageInfo = reactive({
  page: 1,
  range: 10,
  total: 0,
});
let sessionId = undefined;
let columnsStr = "";
const $message =
  getCurrentInstance().appContext.config.globalProperties.$message;

watch(
  () => pageInfo.page,
  () => {
    init();
  }
);

watch(
  () => pageInfo.range,
  () => {
    pageInfo.page = 1;
    init();
  }
);

onMounted(() => {
  init();
});

const init = async () => {
  tableLoad.value = true;
  // 获取默认表头
  if (!columns.value.length) {
    await getColumns();
  }

  // 获取数据
  sessionId = pageInfo.page === 1 ? undefined : sessionId;
  await props
    .tableApi({
      columns: columnsStr,
      username: userInfo.username,
      sessionId,
      ...pageInfo,
      ...props.payload,
    })
    .then((res) => {
      if (res.success) {
        let arr = res.data.rows;
        arr.forEach((e) => {
          for (let key in e) {
            if (e[key] instanceof Object) {
              e[key] = e[key].display;
            }
          }
        });
        tableData.value = arr;
        pageInfo.total = res.data.total;
        sessionId = res.data.sessionId;
      } else {
        $message.warning(res.message + "失败！");
      }
      tableLoad.value = false;
    });
};

const getColumns = async () => {
  const params = {
    inside: props.tableName,
    userName: userInfo.username,
  };
  await getCustomizeHeaders(params).then((res) => {
    if (res.success) {
      columnsStr = res.data.labelList;
    } else {
      $message.error(res);
    }
  });

  // 获取表头所有数据
  await props.columnsApi().then((res) => {
    let temp = res.data.columns;
    columns.value = columnsStr.split(",").map((v) => {
      return {
        title: temp[v],
        dataIndex: v,
        ellipsis: true,
        width: 130,
      };
    });
    allColumns.value = [];
    for (let key in temp) {
      let obj = {
        title: temp[key],
        dataIndex: key,
        ellipsis: true,
        width: 130,
      };
      allColumns.value.push(obj);
    }
  });
};

const updateTableData = () => {
  columns.value = [];
  pageInfo.page = 1;
  init();
};
</script>

<style lang="scss" scoped></style>
