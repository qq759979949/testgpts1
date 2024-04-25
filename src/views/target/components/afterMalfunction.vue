<template>
  <div class="after-quality">
    <div>
      <p class="title">一年内故障率</p>
      <levelTable
        :columns="Data.setNumberColunms"
        :tableData="Data.setNumberData"
        :tableLoad="Data.setNumberLoad"
        :border="true"
        :isCheckBox="false"
        :columnIndex="0"
        :isAddColumn="true"
        class="special-tabel"
      >
        <template #[item.dataIndex]="scope" v-for="(item, index) in Data.newChildren" :key="index">
          <!-- 评审可编辑 -->
          <div v-if="props.isEdit">
            <span v-if="item.isCurrentPhase">
              <!-- 故障项次 -->
              <span v-if="item.identification === 'FaultCount'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 销售总数 -->
              <span v-if="item.identification === 'SalesTotal'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 故障率 -->
              <span v-if="item.identification === 'FaultRate'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 是否达标 -->
              <span v-if="item.identification === 'IsCompliance'">
                <span v-if="scope.row.roleFlag && scope.row[Data.phaseName + 'IsEdit']">
                  <el-select v-model="scope.row[item.dataIndex]" style="width: 100%">
                    <el-option key="yes" :label="'是'" :value="'是'" />
                    <el-option key="no" :label="'否'" :value="'否'" />
                  </el-select>
                </span>
                <span v-if="item.identification === 'IsCompliance'">
                  <el-select
                    v-model="scope.row[item.dataIndex]"
                    style="width: 100%"
                    :disabled="true"
                    v-if="scope.row[item.dataIndex] === '' || scope.row[item.dataIndex] === undefined"
                  >
                    <el-option key="yes" :label="'是'" :value="'是'" />
                    <el-option key="no" :label="'否'" :value="'否'" />
                  </el-select>
                </span>
                <span v-else :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">{{ scope.row[item.dataIndex] }}</span>
              </span>
            </span>
            <span v-else>
              <!-- 故障项次 -->
              <span v-if="item.identification === 'FaultCount'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 销售总数 -->
              <span v-if="item.identification === 'SalesTotal'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 故障率 -->
              <span v-if="item.identification === 'FaultRate'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 是否达标 -->
              <span v-if="item.identification === 'IsCompliance'">
                <el-select
                  v-model="scope.row[item.dataIndex]"
                  style="width: 100%"
                  :disabled="true"
                  v-if="scope.row[item.dataIndex] === '' || scope.row[item.dataIndex] === undefined"
                >
                  <el-option key="yes" :label="'是'" :value="'是'" />
                  <el-option key="no" :label="'否'" :value="'否'" />
                </el-select>
                <span v-else :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">{{ scope.row[item.dataIndex] }}</span>
              </span>
            </span>
          </div>
          <!-- 目标指标读取 -->
          <div v-else>
            <!-- 故障项次 -->
            <span v-if="item.identification === 'FaultCount'">{{ scope.row[item.dataIndex] }}</span>
            <!-- 销售总数 -->
            <span v-if="item.identification === 'SalesTotal'">{{ scope.row[item.dataIndex] }}</span>
            <!-- 故障率 -->
            <span v-if="item.identification === 'FaultRate'">{{ scope.row[item.dataIndex] }}</span>
            <!-- 是否达标 -->
            <span v-if="item.identification === 'IsCompliance'" :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">{{ scope.row[item.dataIndex] }}</span>
          </div>
        </template>
        <template #faultList="scope">
          <el-link type="primary" :underline="true" @click="handleIssuesList">
            {{ scope.row.faultList }}
          </el-link>
        </template>
        <template #acceptancePhase="scope">
          <el-tooltip :content="scope.row.acceptancePhase" placement="top">
            <div class="columnTitle">
              <span>{{ scope.row.acceptancePhase }}</span>
            </div>
          </el-tooltip>
        </template>
        <template #actualValueProvided="scope">
          <el-tooltip :content="scope.row.actualValueProvided" placement="top">
            <div class="columnTitle">
              <span>{{ scope.row.actualValueProvided }}</span>
            </div>
          </el-tooltip>
        </template>
      </levelTable>
    </div>
  </div>
  <!-- 故障列表对话框 -->
  <el-dialog v-model="Data.dialogVisible" title="故障列表" width="1200">
    <div class="search">
      <el-input v-model="Data.searchValue" style="width: 224px; margin-left: 20px" placeholder="请输入搜索关键词" clearable @keyup.enter="handleSearch">
        <template #suffix>
          <el-icon class="el-input__icon" @click="handleSearch"><Search /></el-icon>
        </template>
      </el-input>
    </div>
    <newPiTable
      :columns="Data.detailsColunms"
      :data="Data.detailsTableData"
      :selectable="false"
      rowKey="oid"
      :border="true"
      :isShowSetting="false"
      :tableLoad="Data.gressRableLoad"
      :total="Data.total"
      :pagination="Data.detailsTableData?.length > 10"
      :isWebPagination="Data.detailsTableData?.length > 10"
      :page-size="10"
      height="600"
    >
      <template #backResult="scope">
        <el-tooltip :content="scope.row.backResult" placement="top">
          <div class="columnTitle">
            <span>{{ scope.row.backResult }}</span>
          </div>
        </el-tooltip>
      </template>
    </newPiTable>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="Data.dialogVisible = false">取消</el-button>
        <!-- <el-button type="primary" @click="Data.dialogVisible = false">确定</el-button> -->
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import levelTable from '@/views/projectInitiation/components/levelTable.vue';
import { onMounted } from 'vue';
import { set } from 'lodash';
const api = window.$api;
const route = useRoute();
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  orderOid: {
    type: String,
    default: '',
  },
  // 基本信息-技术评审点
  reviewPoint: {
    type: String,
    default: '',
  },
  WBSVerify: {
    type: Boolean,
    default: true,
  },
});
watch(
  () => props.orderOid,
  (val) => {
    Data.pointNumber = 1;
    Data.orderNumberSelect = true;
    verificationStations();
  },
);
watch(
  () => props.reviewPoint,
  (val) => {
    Data.pointNumber = 1;
    Data.reviewPoint = val;
    verificationStations();
    if (Data.checkoutWBS) {
      getRoleNameData();
    }
  },
);
watch(
  () => props.WBSVerify,
  (val) => {
    Data.checkoutWBS = val;
  },
  {
    deep: true,
  },
);
const Data = reactive({
  checkoutWBS: true,
  projectType: '',
  dialogVisible: false,
  setNumberColunms: [
    // { label: '单位', dataIndex: 'unit', children: [], fixed: true },
    // { label: '验收阶段', dataIndex: 'acceptancePhase', width: 200, children: [], fixed: true },
    // { label: '实际值提供者', dataIndex: 'actualValueProvided', width: 200, children: [], fixed: true },
    { label: '故障清单', dataIndex: 'faultList', children: [], width: 120, fixed: true },
    { label: '计算说明', dataIndex: 'formula', children: [], fixed: true, width: 90 },
  ],
  detailsColunms: [
    { title: '反馈单号', dataIndex: 'feedBackId', width: 100 },
    { title: '整机编号', dataIndex: 'pin_code', width: 170 },
    { title: '订货号', dataIndex: 'order_code', width: 170 },
    { title: '订货号名称', dataIndex: '', width: 130 },
    { title: '失效件索赔供应商', dataIndex: '', width: 160 },
    { title: '故障所属事业部', dataIndex: '', width: 160 },
    { title: '失效件编码', dataIndex: '', width: 130 },
    { title: '失效件名称', dataIndex: '', width: 130 },
    { title: '购机日期', dataIndex: 'recordTime', width: 130 },
    { title: '报修时间', dataIndex: '', width: 130 },
    { title: '鉴定意见', dataIndex: '', width: 130 },
    { title: '赔总金额', dataIndex: '', width: 130 },
  ],
  setNumberData: [],
  detailsTableData: [],
  oid: route.query.projectOid ? JSON.parse(sessionStorage.getItem('taskProject'))?.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  acceptancePhaseList: [],
  newChildren: [],
  setNumberLoad: false,
  gressRableLoad: false,
  phaseList: [],
  reviewPoint: '',
  pointNumber: 0,
  phaseName: '',
  phaseNumber: '',
  tableDataCopy: [],
  defalutTableData: [],
  searchValue: '',
  total: 0,
  orderNumberSelect: false,
  strOrderNumber: '',
});
// 验收阶段
const acceptancePhase = () => {
  api.payPacketApi.queryReviewPhaseByProjectType({ oid: route.name === 'examineReview' ? route.query.projectOid : Data.oid, phaseName: props.reviewPoint }).then((res) => {
    if (res.success) {
      Data.phaseList = res.data;
      if (Data.checkoutWBS) {
        Data.phaseList.map((item, index) => {
          item.phaseIndex = index + 1;
          if (item.name === Data.reviewPoint) {
            // Data.phaseName = item.label;
            Data.phaseName = `phase${item.phaseIndex}`;
          }
        });
        // 评审页面,获取当前技术评审点阶段
        Data.phaseNumber = Data.phaseName ? Data.phaseName.match(/\d+/)[0] : '';
      }
      // 获取当前阶段顺序
      if (res.data.length > 0) {
        let phaseColums = res.data.map((item, index) => {
          let obj = {
            label: item.name,
            dataIndex: item.label,
            orderIndex: index + 1,
            children: [
              { label: '故障项次', dataIndex: '' },
              { label: '销售总数', dataIndex: '' },
              { label: '故障率', dataIndex: '' },
              { label: '是否达标', dataIndex: '' },
            ],
          };
          return obj;
        });
        if (Data.pointNumber === 0) {
          Data.setNumberColunms.splice(2, 0, ...phaseColums);
        } else {
          Data.setNumberColunms.splice(2, 4, ...phaseColums);
        }
      }
      Data.setNumberData.forEach((itm) => {
        if (itm.phaseInfoList.length > 0) {
          itm.phaseInfoList.forEach((ele, index) => {
            Data.setNumberColunms = Data.setNumberColunms.map((item) => {
              if (item.label === ele.phaseKey) {
                item.children.map((chil) => {
                  if (chil.label === '故障项次') {
                    chil.dataIndex = `phase${item.orderIndex}FaultCount`;
                    chil.ident = `phase${item.orderIndex}-FaultCount`;
                  } else if (chil.label === '销售总数') {
                    chil.dataIndex = `phase${item.orderIndex}SalesTotal`;
                    chil.ident = `phase${item.orderIndex}-SalesTotal`;
                  } else if (chil.label === '故障率') {
                    chil.dataIndex = `phase${item.orderIndex}FaultRate`;
                    chil.ident = `phase${item.orderIndex}-FaultRate`;
                  } else if (chil.label === '是否达标') {
                    chil.dataIndex = `phase${item.orderIndex}IsCompliance`;
                    chil.ident = `phase${item.orderIndex}-IsCompliance`;
                  }
                });
              }
              return item;
            });
            if (ele.hasOwnProperty('faultCount') || ele.hasOwnProperty('salesTotal') || ele.hasOwnProperty('faultRate') || ele.hasOwnProperty('isCompliance')) {
              ele[`phase${index + 1}FaultCount`] = ele['faultCount'];
              ele[`phase${index + 1}SalesTotal`] = ele['salesTotal'];
              ele[`phase${index + 1}FaultRate`] = ele['faultRate'];
              ele[`phase${index + 1}IsCompliance`] = ele['isCompliance'];
            }
          });
        }
      });
      Data.newChildren = [];
      Data.setNumberColunms.forEach((item) => {
        if (item.children.length > 0) {
          item.children.forEach((row) => {
            Data.newChildren.push(row);
          });
        }
      });
      Data.newChildren.map((item) => {
        item.identification = item.ident ? item.ident.split('-')[1] : '';
        item.identification === 'IsCompliance' ? (item.width = 90) : (item.width = 120);
        Data.setNumberData.map((row) => {
          if (item.identification === 'FaultCount') {
            set(row, item.dataIndex, '');
          } else if (item.identification === 'SalesTotal') {
            set(row, item.dataIndex, '');
          } else if (item.identification === 'FaultRate') {
            set(row, item.dataIndex, '');
          } else if (item.identification === 'IsCompliance') {
            set(row, item.dataIndex, '');
          }
          return row;
        });
        if (Data.checkoutWBS) {
          // 评审页面,选择技术评审点维护列表对应的阶段
          let dataNumber = item.dataIndex ? item.dataIndex.match(/\d+/)[0] : '';
          item.dataIndex.includes(Data.phaseName) && dataNumber === Data.phaseNumber ? (item.isCurrentPhase = true) : (item.isCurrentPhase = false);
        }
      });
      Data.setNumberData.map((item) => {
        item.phaseInfoList.forEach((ids) => {
          if (item.index === ids.index) {
            for (let key in item) {
              // 评审页面,选择技术评审点对应的某一条数据
              if (Data.checkoutWBS) {
                if (key.includes(Data.phaseName) && item.acceptancePhase.includes(Data.reviewPoint)) {
                  set(item, Data.phaseName + 'IsEdit', true);
                }
              }
              for (let key1 in ids) {
                if (key === key1) {
                  set(item, key, ids[key1]);
                }
              }
            }
          }
        });
      });
    }
  });
  // if (Data.checkoutWBS) {
  //   getRoleNameData();
  // }
};
// 评审页面,项目经理和项目助理编辑
const getRoleNameData = () => {
  if (route.name === 'createReview' || route.name === 'editReview') {
    let params = {
      projectOid: route.name === 'examineReview' ? route.query.projectOid : Data.oid,
      userName: JSON.parse(window.$Cookies.get('userInfo')).username,
    };
    api.commonApi.getRoleNamesByUserName(params).then((res) => {
      if (res.success) {
        let currentProjectRole = res?.data;
        currentProjectRole.forEach((role) => {
          Data.setNumberData.map((data) => {
            if (role.includes('项目经理') || role.includes('项目助理')) {
              if (data.actualValueProvided.includes('项目经理') || data.actualValueProvided.includes('项目助理')) {
                data.roleFlag = true;
              } else {
                data.roleFlag = false;
              }
            }
          });
        });
        let flowTechnicalData = Data.setNumberData.filter((item) => {
          if (!item.roleFlag && item.acceptancePhase.includes(Data.reviewPoint)) {
            return item;
          }
        });
        let newArr = flowTechnicalData.map((item) => {
          return item.actualValueProvided;
        });
        sessionStorage.setItem('malfunctionData', JSON.stringify(newArr.length > 0 ? newArr.join(',') : ''));
      } else {
        window.$message.error(res.message);
      }
    });
  }
};
// 1年内故障率
const verificationStations = () => {
  Data.setNumberLoad = true;
  let params = {
    oid: route.name === 'examineReview' ? route.query.projectOid : Data.oid,
    targetIndicatorsType: '质量指标',
    indicatorName: '1年内故障率',
    orderNumbers: !Data.orderNumberSelect ? Data.strOrderNumber : props.orderOid,
    phaseName: props.reviewPoint,
  };
  api.targetApi.queryTargetIndicators(params).then((res) => {
    if (res.success) {
      Data.setNumberData = res.data;
      Data.setNumberData.map((item, index) => {
        item.index = index + 1;
        item.phaseInfoList.map((row) => {
          row.index = item.index;
        });
        set(item, 'faultList', '故障列表');
      });
      acceptancePhase();
      Data.setNumberLoad = false;
    } else {
      window.$message.error(res.message);
      Data.setNumberLoad = false;
    }
  });
};
const handleIssuesList = () => {
  Data.dialogVisible = true;
  Data.gressRableLoad = true;
  let params = {
    itemIds: route.name === 'createReview' || route.name === 'editReview' || route.name === 'examineReview' ? props.orderOid : '',
    oid: route.name === 'target' ? Data.oid : '',
  };
  api.targetApi.queryFailureDetailsByItems(params).then((res) => {
    if (res.success) {
      Data.detailsTableData = res.data;
      Data.tableDataCopy = [...Data.detailsTableData];
      Data.defalutTableData = Data.detailsTableData;
      Data.total = Data.detailsTableData.length;
      Data.gressRableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.gressRableLoad = false;
    }
  });
};
// 搜索
const handleSearch = () => {
  const searchTerm = Data.searchValue.toLowerCase();
  Data.detailsTableData = Data.tableDataCopy.filter((row) => {
    return Object.keys(row).some((key) => {
      return String(row[key]).toLowerCase().includes(searchTerm);
    });
  });
};
watch(
  () => Data.searchValue,
  (val) => {
    if (val === '') {
      Data.detailsTableData = [...Data.defalutTableData];
    }
  },
);
onMounted(() => {
  if (route.name === 'createReview' || route.name === 'editReview') {
    let orderNumber = JSON.parse(sessionStorage.getItem('orderNumber'));
    Data.strOrderNumber = orderNumber.length > 0 ? orderNumber.join(', ').replace(/\s+/g, '') : '';
  }
  verificationStations();
});
defineExpose({ Data, verificationStations });
</script>

<style lang="less" scoped>
.after-quality {
  .title {
    font-size: 14px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 700;
    background: beige;
    color: #333333;
    margin: 15px 0 10px 0;
  }
}
.prototype {
  font-size: 14px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  // background: rgb(247, 211, 2);
  width: 65px;
  height: 32px;
  line-height: 32px;
  display: inline-block;
  border-radius: 3px;
}
.search {
  text-align: right;
  margin-bottom: 10px;
}
.special-tabel {
  :deep(.el-table) {
    border: 1px solid #000;
  }
  :deep(.el-table tr td:first-child) {
    border-right: 1px solid #000;
  }
  :deep(.el-table thead.is-group th.el-table__cell) {
    border-right: 1px solid #000;
    border-color: #000 !important;
  }
  :deep(.el-table--enable-row-transition .el-table__body td.el-table__cell) {
    border-color: #000 !important;
  }
  :deep(.el-table.is-scrolling-none th.el-table-fixed-column--left, .el-table.is-scrolling-none th.el-table-fixed-column--right) {
    border-color: #000;
  }
  :deep(.el-table th.el-table__cell.is-leaf) {
    border-color: #000;
  }
}
</style>
