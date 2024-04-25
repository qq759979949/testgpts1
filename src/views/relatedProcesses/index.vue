<!--相关进程-->
<template>
  <div class="related_processs page_common bg_css">
    <Anthor class="anthor_css" :offset="100" :target="'.info_box'" :tabList="Data.anthorList" :actived="Data.activedStr"></Anthor>
    <div class="info_box">
      <div class="depart" id="route">
        <div class="title" style="display: flex; justify-content: space-between">
          <div>路由/处理历史记录</div>
          <div>
            <el-input v-model="Data.searchVal" style="width: 224px" placeholder="请输入搜索关键词" @change="onSearch" clearable>
              <template #suffix>
                <el-icon class="el-input__icon"><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
        <newPiTable
          :columns="Data.routeColumns"
          :data="Data.routeTableData"
          :radionSelect="true"
          :selectable="true"
          :isShowSetting="false"
          rowKey="index"
          :pagination="false"
          :total="Data.routeTableData.length"
          ref="projectTable"
          @selectionRadioChange="selectionChange"
          :defaultSingle="false"
          :isSingleSelect="true"
        >
          <template #name="scope">
            <el-link type="primary" :underline="true">
              {{ scope.row.name }}
            </el-link>
          </template>
        </newPiTable>
      </div>
      <div class="depart" id="hand">
        <div class="title">流程指引</div>
        <ProcessRecord
          :stepList="Data.stepList"
          :step="Data.step"
          :tableList="Data.tableList"
          :isOpenProcessRecordHandler="true"
          @processRecordHandler="processRecordHandler"
        ></ProcessRecord>
      </div>
      <div class="depart" id="historyRecord">
        <div class="title">任务历史记录</div>
        <NewPiTable :columns="Data.historyColumns" :data="Data.historyTableData" :pagination="false"></NewPiTable>
      </div>
    </div>
  </div>
</template>

<script setup>
const api = window.$api;
const router = useRouter();
const Data = reactive({
  // 锚点
  anthorList: [
    { label: '路由/处理历史记录', id: 'route' },
    { label: '流程指引', id: 'hand' },
    { label: '处理状况', id: 'process' },
    { label: '任务历史记录', id: 'historyRecord' },
  ],
  activedStr: 'route',

  // 路由处理记录数据
  routeColumns: [
    { title: '名称', dataIndex: 'processName' },
    { title: '版本', dataIndex: 'version', width: 70 },
    { title: '状态', dataIndex: 'processState', width: 120 },
    { title: '启动者', dataIndex: 'creator', width: 150 },
    { title: '开始日期', dataIndex: 'processStartDate', width: 180 },
    { title: '完成日期', dataIndex: 'processEndDate', width: 180 },
    { title: '备注', dataIndex: 'description', width: 350 },
  ],
  tableList: [], // 路由处理记录
  tableDataCopy: [], // 搜索的表格数据
  routeTableData: [],
  searchVal: '', // 搜索值

  // 流程指引数据
  stepList: [],
  step: null,
  oid: '',
  workItemOid: '', // 流程的oid

  // 任务历史记录数据
  historyColumns: [
    { title: '名称', dataIndex: 'activityName' },
    { title: '原工作负责人', dataIndex: 'originalAssignee' },
    { title: '新工作负责人', dataIndex: 'newAssignee' },
    { title: '操作', dataIndex: 'actionName' },
    { title: '执行者', dataIndex: 'actionPerformedBy' },
    { title: '操作原因', dataIndex: 'reasonForAction' },
    { title: '执行时间', dataIndex: 'actionPerformedOn' },
  ],
  historyTableData: [],
  projectName: JSON.parse(sessionStorage.getItem('currentProject')).projectName,
  projectShortName: JSON.parse(sessionStorage.getItem('currentProject')).projectShortName,
  projectType: JSON.parse(sessionStorage.getItem('currentProject')).type,
});

onMounted(() => {
  Data.oid = JSON.parse(sessionStorage.getItem('currentProject')).oid;
  // setTimeout(() => {
  //   Data.stepList = [
  //     { name: '提交立项', oid: '', state: 'CLOSED_COMPLETED_EXECUTED', stateDisplay: '已执行', userFullName: '张三', order: '1', runningTime: '0天0小时1分钟' },
  //     { name: 'PMO检查', oid: '', state: 'CLOSED_COMPLETED_EXECUTED', stateDisplay: '已执行', userFullName: '李四', order: '2', runningTime: '0天0小时1分钟' },
  //     { name: '评审', oid: '', state: 'CLOSED_COMPLETED_EXECUTED', stateDisplay: '已执行', userFullName: '王五', order: '3', runningTime: '0天0小时1分钟' },
  //     { name: '财务审核', oid: '', state: 'OPEN_RUNNING', stateDisplay: '正在运行', userFullName: '赵六', order: '4', runningTime: '5天0小时50分钟' },
  //     { name: '确认', oid: '', state: '', stateDisplay: '', userFullName: '王大', order: '5', runningTime: '' },
  //     { name: '审核', oid: '', state: '', stateDisplay: '', userFullName: '呼呼', order: '6', runningTime: '' },
  //     { name: '会签', oid: '', state: '', stateDisplay: '', userFullName: '哈哈', order: '7', runningTime: '' },
  //     { name: '审定', oid: '', state: '', stateDisplay: '', userFullName: '老板', order: '8', runningTime: '' },
  //     { name: '批准', oid: '', state: '', stateDisplay: '', userFullName: '领导', order: '9', runningTime: '' },
  //     { name: '通知', oid: '', state: '', stateDisplay: '', userFullName: '员工', order: '10', runningTime: '' },
  //   ];
  //   Data.step = 3;
  // }, 10);
  _queryProcessHistory();
});

// 流程记录点击跳转
const processRecordHandler = async (row) => {
  let breadcrumbName = '';
  let projectId = JSON.parse(sessionStorage.getItem('currentProject')).id;
  breadcrumbName = `【${row.workName}】 ${row.processName}`;
  sessionStorage.setItem('breadcrumbName', breadcrumbName);
  await window.$api.processApi.getByOid({ oid: row.pboOid }).then((res) => {
    if (res.success) {
      sessionStorage.setItem('taskProject', JSON.stringify(res.data));
    }
  });
  if (row.processName) {
    if (row.processName.includes('项目立项')) {
      router.push({
        name: 'initiationProcess',
        query: {
          oid: row.pboOid,
          processOID: row.processOid, // 流程oid
          pboOid: row.pboOid, // 项目的oid
          workitemOID: row.id,
          workItemName: row.workName, // 流程节点名称
          processName: row.processName, // 流程名称
          isDetail: row.actualWorkCompletedBy === '' ? false : true,
          projectShortName: Data.projectShortName,
          projectName: Data.projectName,
          projectType: Data.projectType,
          id: projectId,
        },
      });
    } else if (row.processName.includes('项目定级')) {
      if (row.actualWorkCompletedBy === '') {
        router.push({
          name: 'maintenanceGrading',
          query: {
            oid: row.pboOid,
            processOID: row.processOid,
            isDetail: row.actualWorkCompletedBy === '' ? 'false' : 'true',
            workitemOID: row.id,
            projectOid: row.pboOid,
            workItemName: row.workName, // 流程节点名称
            processName: row.processName, // 流程名称
            projectShortName: Data.projectShortName,
            projectName: Data.projectName,
            projectType: Data.projectType,
          },
        });
      } else {
        router.push({ name: 'gradingDetail', query: { oid: row.pboOid, workitemOID: row.id } });
      }
    }
  }
};

//单选的数据
const selectionChange = (val, row) => {
  let oid = row.processOid;
  _getProcessSteps(oid);
  _queryProcessStatus(oid);
  _queryAssignmentHistory(oid);
};

const projectTable = ref(null);

// 查询路由处理历史记录
const _queryProcessHistory = () => {
  api.processApi.queryProcessHistory({ oid: Data.oid, queryAll: true }).then((res) => {
    if (res.success) {
      Data.routeTableData = res.data;
      Data.tableDataCopy = JSON.parse(JSON.stringify(res.data));
      if (Data.routeTableData.length > 0) {
        projectTable.value.toggleRowSelection(Data.routeTableData);
      }
    }
  });
};

/**获取流程步骤图 */
const _getProcessSteps = (oid) => {
  let param = {
    oid: oid,
  };
  api.processApi.getProcessSteps(param).then((res) => {
    if (res.success) {
      // res.data.splice(0, 1);
      Data.stepList = res.data;
      Data.stepList.forEach((el, i) => {
        if (el.state && el.state.indexOf('CLOSED') === 0) {
          Data.step = i + 1;
        }
      });
    }
  });
};

// 路由处理状况
const _queryProcessStatus = (oid) => {
  console.log(oid, 148);
  api.processApi.queryProcessStatus({ oid: oid }).then((res) => {
    if (res.success) {
      Data.tableList = res.data;
    }
  });
};

// 任务历史记录
const _queryAssignmentHistory = (oid) => {
  // OR:wt.workflow.engine.WfProcess:142057947   这个oid有数据
  api.processApi.queryAssignmentHistory({ oid: oid }).then((res) => {
    if (res.success) {
      Data.historyTableData = res.data;
    }
  });
};

// 所有表头模糊搜索
const onSearch = () => {
  let handSearchTable = [];
  if (Data.searchVal) {
    Data.tableDataCopy.filter((item) => {
      let count = 0;
      for (let k in item) {
        if (item[k]) {
          let nowValue = item[k].toString();
          if (nowValue.includes(Data.searchVal)) {
            count++;
          }
        }
      }
      if (count) {
        handSearchTable.push(item);
      }
    });
    Data.routeTableData = handSearchTable;
  } else {
    Data.routeTableData = Data.tableDataCopy;
  }
};
</script>

<style lang="less" scoped>
.related_processs {
  background: #fff;
  padding: 16px 0 0 16px;
  .anthor_css {
    padding-right: 16px;
  }
  .info_box {
    display: block;
    height: calc(100vh - 200px);
    position: relative;
    overflow-y: auto;
    padding-right: 8px;
    .depart {
      margin-bottom: 40px;
      .title {
        font-size: 18px;
        font-family: 'PingFangSC, PingFang SC';
        font-weight: 500;
        color: #333333;
        margin-bottom: 8px;
      }
    }
  }
}
:deep(.anthor .tabBox .el-tabs__header) {
  padding: 0;
}
:deep(.el-tabs__nav) {
  padding-left: 10px;
}
:deep(.el-table__header .el-checkbox) {
  display: none !important;
}
</style>
