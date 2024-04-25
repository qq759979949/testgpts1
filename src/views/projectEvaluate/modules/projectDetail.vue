<template>
  <div class="project_drawer">
    <div class="project">
      <span class="project-title">{{ Data.projectTitle }}</span>
      <span class="project-content">{{ '(' + Data.projectContent }}</span>
      <span class="project-details" @click="handleOpenAlteration">{{ '变更进度 ' + Data.changeOrders + ' 次)' }}</span>
      <div class="step_box">
        <Steps :stepList="Data.stepList" :active="Data.active"></Steps>
      </div>
    </div>
    <div class="content_box">
      <p class="title">考核激励</p>
      <NewPiTable
        ref="projectTable"
        rowKey="index"
        :columns="Data.checkColunms"
        :data="Data.checkTableData"
        :selectable="false"
        :isShowSetting="false"
        :tableLoad="false"
        :pagination="true"
        v-model:current-page.sync="Data.page"
        v-model:page-size.sync="Data.range"
        :total="Data.checkTableData.length"
      >
        <template #fileInfo="scope">
          <el-link v-if="scope.row.fileInfo.length > 0" :underline="false" type="primary" @click="handleExport(scope.row.fileInfo[0])">
            {{ scope.row.fileInfo[0].fileName }}
          </el-link>
          <span v-else></span>
        </template>
        <template #phaseName="scope">
          <span>{{ scope.row.phaseName }}</span>
        </template>
      </NewPiTable>
    </div>
    <div class="content_box">
      <p class="title">目标/指标</p>
      <div class="target">
        <afterEconomic></afterEconomic>
        <div class="more">
          <el-link @click="lookMore">
            {{ '查看更多>>>' }}
          </el-link>
        </div>
      </div>
    </div>
    <div class="content_box">
      <p class="title">项目变更</p>
      <div class="project-change">
        <div v-for="(item, index) in Data.projectChangeList" :key="index" class="change-item">
          <div class="change-top">
            <img :src="item.src" alt="" style="width: 40px; height: 40px" />
            <span>{{ Data.changeList[item.value] }}</span>
          </div>
          <p class="change-number">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div class="content_box">
      <p class="title">交付物汇总</p>
      <p class="deliverable">
        应交付{{ Data.deliverTabelData?.length }}项，实际交付
        <span style="color: #386bd7">{{ Data.isDeliver }}</span>
        项，完成率
        <span>{{ Data.isDeliverPercent + '%' }}</span>
      </p>
      <NewPiTable
        rowKey="oid"
        :columns="Data.deliverColumns"
        :data="Data.deliverTabelData"
        :pagination="Data.deliverTabelData?.length > 5"
        :isWebPagination="Data.deliverTabelData?.length > 5"
        :page-size="5"
        :selectable="false"
        :isShowSetting="false"
      >
        <template #associatedData="scope">
          <el-link type="primary" :underline="true">
            {{ scope.row.associatedData }}
          </el-link>
        </template>
      </NewPiTable>
    </div>
  </div>
  <!-- 变更进度 -->
  <el-dialog v-model="Data.alterationVisable" title="变更记录" width="70%">
    <NewPiTable
      :columns="Data.projectChangeColumns"
      :data="Data.alterationTableData"
      :isShowSetting="true"
      :selectable="false"
      rowKey="changeOid"
      :pagination="false"
      :border="false"
      table-name="projectChangeTable"
      pageLabelName="defaultChange"
      :allColumns="Data.allColumns"
      @updateTableData="updateTableData"
    >
      <template #changeNumber="scope">
        <el-link type="primary" @click="seeDetail(scope)">{{ scope.row.changeNumber }}</el-link>
      </template>
    </NewPiTable>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="Data.alterationVisable = false">取消</el-button>
        <el-button type="primary" @click="handleAlteration">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 目标指标主体页面 -->
  <div class="target_dialog">
    <el-dialog v-model="Data.targetVisible" top="2vh" title="目标指标" width="85%" height="30vh" @close="Data.targetVisible = false">
      <targetPage :isEvaluate="true"></targetPage>
    </el-dialog>
  </div>
</template>

<script setup>
import img_launch from '@/assets/img/launch.png';
import img_speed from '@/assets/img/speed.png';
import img_target from '@/assets/img/target.png';
import img_money from '@/assets/img/money.png';
import img_attribute from '@/assets/img/attribute.png';
// import { alterationColunms } from './tableColumns.js';
import { getProjectMileStonePlan } from '@/api/project';
import afterEconomic from '@/views/target/components/afterEconomic.vue'; // 经济效益指标
import targetPage from '@/views/target/index.vue';
const props = defineProps({
  phaseObjData: {
    type: Object,
    default: () => {},
  },
});
const Data = reactive({
  /**里程碑计划 */
  projectTitle: '里程碑计划',
  projectContent: '当前阶段实际完成时间比计划完成时间延期 5 天；',
  changeOrders: 0,
  stepList: [],
  active: 3,

  /**考核激励 */
  checkColunms: [
    { title: '描述', dataIndex: 'description', width: 220 },
    { title: '阶段', dataIndex: 'phaseName' },
    { title: '激励', dataIndex: 'incentive' },
    { title: '成员', dataIndex: 'pdcUserRealName' },
    { title: '附件', dataIndex: 'fileInfo' },
    { title: '创建者', dataIndex: 'creator' },
    { title: '创建时间', dataIndex: 'createDate', width: 180, filters: 'date' },
  ],
  checkTableData: [],
  page: 1,
  range: 5,

  /**目标指标 */
  targetVisible: false,

  /**交付物 */
  deliverColumns: [
    { title: '序号', dataIndex: 'orderIndex', width: 80 },
    { title: '所属交付阶段', dataIndex: 'deliverableName', minWidth: 120, ellipsis: true },
    { title: '实际交付内容', dataIndex: 'subjectName', minWidth: 120, ellipsis: true },
    { title: '责任人', dataIndex: 'creator', minWidth: 120, ellipsis: true },
    { title: '创建时间', dataIndex: 'createTime', minWidth: 120, ellipsis: true },
  ],
  deliverTabelData: [],
  isDeliver: 0,
  isDeliverPercent: 0,
  /**项目变更 */
  alterationVisable: false,
  changeList: {},
  projectChangeColumns: [],
  allColumns: [],
  columnsParams: [],
  columnsStr: {},
  projectChangeList: [
    { src: img_launch, name: '本项目已发起的变更数量', num: 10, value: 'projectChangeNum' },
    { src: img_speed, name: '进度变更数量', num: 2, value: 'scheduleChangeNum' },
    { src: img_target, name: '目标/指标变更数量', value: 'targetAndIndexChangeNum', num: 3 },
    { src: img_money, name: '薪酬包成员变更数量', num: 4, value: 'compensationPackageChangeNum' },
    { src: img_attribute, name: '项目属性变更数量', num: 1, value: 'attributeChangeNum' },
  ],

  alterationTableData: [],

  projectOid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
});
const route = useRoute();
const router = useRouter();

// const phaseObj = ref({});
// watch(
//   () => props.phaseObjData,
//   (val) => {
//     phaseObj.value = val;
//     console.log(phaseObj.value.name, '199---------------');
//   },
// );

onMounted(() => {
  getStepData();
  getCheckList();
  // getChangeList();
  getDelieverData();
  getChnageClumns();
});
watch(
  () => Data.alterationVisable,
  (val) => {
    if (val) {
      // initFun();
      getChangeList();
    }
  },
);
const updateTableData = () => {
  Data.projectChangeColumns = [];
  getChnageClumns();
};

// 获取考核激励
const getCheckList = () => {
  window.$api.projectEvaluateApi.queryAssessmentIncentivesByPhaseName({ oid: Data.projectOid, phaseName: props.phaseObjData.name }).then((res) => {
    if (res.success) {
      Data.checkTableData = res.data;
    } else {
      window.$message.error(res.message);
    }
  });
};

// 查看变更详情
const seeDetail = (scope) => {
  window.$api.processApi.queryProcessHistory({ oid: scope.row.changeOid, queryAll: false }).then((res) => {
    if (res.success) {
      router.push({ name: 'projectChangeDetail', query: { oid: scope.row.changeOid, processOid: res.data.length > 0 ? res.data[0].processOid : '' } });
    } else {
      window.$message.error(res.message);
    }
  });
};
// 获取把能表头
const getChnageClumns = async () => {
  Data.tableLoad = true;
  // 获取表头
  let obj = {
    tableName: 'projectChangeTable',
    pageLabelName: 'defaultChange',
  };
  await window.$api.commonApi.listSetupColumn(obj).then((res) => {
    if (res.success) {
      Data.projectChangeColumns = [];
      Data.columnsStr = res.data.column;
      for (let key in Data.columnsStr) {
        let obj = {
          title: Data.columnsStr[key],
          dataIndex: key,
          ellipsis: {
            placement: 'right-end',
          },
          filters: Data.columnsStr[key].includes('时间') ? 'date' : 'select',
          minWidth: 120,
        };

        Data.projectChangeColumns.push(obj);
        Data.columnsParams.push(key);
      }
    } else {
      window.$message.error(res);
    }
  });
  Data.tableLoad = false;
  getChangeList();
  getAllColumns();
};
// 获取全部表头
const getAllColumns = () => {
  window.$api.projectChangeApi.listDictItem({ dictCode: 'projectChange' }).then((res) => {
    if (res.success) {
      Data.allColumns = JSON.parse(res.data[0].itemValue);
    } else {
      window.$message.error(res.message);
    }
  });
};
// 获取变更数据
const getChangeList = () => {
  window.$api.projectChangeApi.queryChangeRequests({ oid: Data.projectOid }).then((res) => {
    if (res.success) {
      Data.changeList = res.data;
      res.data.showProjectChangeItems.length > 0 &&
        res.data.showProjectChangeItems.forEach((e, index) => {
          e.orderIndex = index + 1;
        });
      Data.alterationTableData = res.data.showProjectChangeItems;
      Data.changeOrders = res.data.showProjectChangeItems.length;
    } else {
      window.$message.error(res.message);
    }
  });
};
// 获取导航数据
const getStepData = () => {
  Data.stepLoad = true;
  getProjectMileStonePlan({ oid: Data.projectOid }).then((res) => {
    if (res.success) {
      const newArr = res.data.filter((item) => {
        return item.actEndValue;
      });
      Data.active = newArr.length;
      Data.stepList = res.data.map((item, index) => {
        if (index === Data.active) {
          item.status = '进行中';
        } else if (index < Data.active) {
          item.status = '已完成';
        } else if (index > Data.active) {
          item.status = '未开始';
        }
        item.number = index + 1;
        return item;
      });
    } else {
      window.$message.error(res.message);
    }
    Data.stepLoad = false;
  });
};

// 获取交付物汇总数据
const getDelieverData = () => {
  window.$api.projectEvaluateApi.queryAllDeliverableByProjectOid({ projectOid: route.query.oid }).then((res) => {
    if (res.success) {
      res.data.length > 0 &&
        res.data.forEach((e, index) => {
          e.orderIndex = index + 1;
        });
      Data.deliverTabelData = res.data;
      Data.isDeliver = Data.deliverTabelData.filter((v) => v.subjectName).length;
      Data.isDeliverPercent = ((Data.isDeliver / Data.deliverTabelData?.length) * 100).toFixed(2);
    } else {
      window.$message.error(res.message);
    }
  });
};

// 目标指标
const lookMore = () => {
  Data.targetVisible = true;
};

const handleOpenAlteration = () => {
  Data.alterationVisable = true;
};
// 变更记录确定
const handleAlteration = () => {
  Data.alterationVisable = false;
};
</script>

<style lang="less" scoped>
.project_drawer {
  .project {
    // margin: 10px 0;
    font-family: 'PingFangSC, PingFang SC';
    .project-title {
      font-size: 16px;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.85);
      display: inline-block;
      margin-right: 15px;
    }
    .project-content {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
    }
    .project-details {
      color: #4776da;
      text-decoration: underline;
      cursor: pointer;
    }
    .step_box {
      margin-top: 20px;
    }
  }
  .content_box {
    .title {
      margin: 20px 0;
      font-size: 16px;
      font-family: 'PingFangSC, PingFang SC';
      font-weight: 700;
      color: rgba(0, 0, 0, 0.85);
    }
    .target {
      .more {
        text-align: right;
        margin: 10px 0;
      }
    }
    .deliverable {
      font-size: 14px;
      font-family: 'PingFangSC, PingFang SC';
      font-weight: 400;
      color: #666666;
      margin-bottom: 15px;
      margin-left: 10px;
    }
    .project-change {
      display: flex;
      align-items: center;
      justify-content: center;
      .change-item {
        width: 212px;
        height: 110px;
        border-radius: 1px;
        border: 1px solid #d3d3d3;
        margin-right: 15px;
        padding: 10px 15px;
        .change-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;
          span {
            font-size: 38px;
            font-family: 'PingFangSC, PingFang SC';
            font-weight: 500;
            color: #333333;
          }
        }
        .change-number {
          // font-size: 14px;
          font-size: 0.8vw;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: 400;
          color: #666666;
        }
      }
      .change-item:last-child {
        margin-right: 0;
      }
    }
    :deep(.numTotal) {
      .el-row {
        .el-card {
          border: 1px solid #d3d3d3;
        }
      }
    }
  }
}
.target_dialog {
  :deep(.el-overlay-dialog) {
    // overflow: hidden;
  }
  :deep(.el-dialog) {
    .el-dialog__body {
      padding-top: 0;
      .target {
        margin: 0;
        padding: 0;
        width: 100%;
        position: relative;
        .el-affix {
          height: 56px !important;
          .el-affix--fixed {
            top: 80px !important;
            box-shadow: none;
          }
        }
      }
    }
  }
}

// :deep(.target_dialog) {
//   .el-dialog__body {
//     padding-top: 0;
//     .target {
//       margin: 0;
//       padding: 0;
//     }
//   }
// }
</style>
