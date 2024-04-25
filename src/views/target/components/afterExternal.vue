<template>
  <div class="after-quality">
    <div>
      <p class="title">
        <span>外部问题关闭率</span>
      </p>
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
              <!-- 关闭数 -->
              <span v-if="item.identification === 'ClosuresNumber'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 总数 -->
              <span v-if="item.identification === 'Total'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 关闭率 -->
              <span v-if="item.identification === 'ClosuresRate'">{{ scope.row[item.dataIndex] }}</span>
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
              <!-- 关闭数 -->
              <span v-if="item.identification === 'ClosuresNumber'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 总数 -->
              <span v-if="item.identification === 'Total'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 关闭率 -->
              <span v-if="item.identification === 'ClosuresRate'">{{ scope.row[item.dataIndex] }}</span>
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
            <!-- 关闭数 -->
            <span v-if="item.identification === 'ClosuresNumber'">{{ scope.row[item.dataIndex] }}</span>
            <!-- 总数 -->
            <span v-if="item.identification === 'Total'">{{ scope.row[item.dataIndex] }}</span>
            <!-- 关闭率 -->
            <span v-if="item.identification === 'ClosuresRate'">{{ scope.row[item.dataIndex] }}</span>
            <!-- 是否达标 -->
            <span v-if="item.identification === 'IsCompliance'" :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">{{ scope.row[item.dataIndex] }}</span>
          </div>
        </template>
        <template #issuesList="scope">
          <el-link type="primary" :underline="true" @click="handleIssuesList">
            {{ scope.row.issuesList }}
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
  <!-- 问题列表对话框 -->
  <el-dialog v-model="Data.dialogVisible" title="问题列表" width="1400">
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
      height="600"
      :total="Data.total"
      :pagination="Data.detailsTableData?.length > 10"
      :isWebPagination="Data.detailsTableData?.length > 10"
      :page-size="10"
    >
      <template #problemDescription="scope">
        <el-tooltip :content="scope.row.problemDescription" placement="top">
          <div class="columnTitle">
            <span>{{ scope.row.problemDescription }}</span>
          </div>
        </el-tooltip>
      </template>
      <template #backResult="scope">
        <el-tooltip :content="scope.row.backResult" placement="top">
          <div class="columnTitle">
            <span>{{ scope.row.backResult }}</span>
          </div>
        </el-tooltip>
      </template>
    </newPiTable>
    <template #footer>
      <el-button @click="Data.dialogVisible = false">取消</el-button>
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
  setNumberColunms: [
    // { label: '单位', dataIndex: 'unit', children: [], fixed: true },
    // { label: '验收阶段', dataIndex: 'acceptancePhase', width: 200, children: [], fixed: true },
    // { label: '实际值提供者', dataIndex: 'actualValueProvided', width: 200, children: [], fixed: true },
    { label: '问题清单', dataIndex: 'issuesList', children: [], width: 120, fixed: true },
    { label: '计算说明', dataIndex: 'formula', children: [], fixed: true, width: 90 },
  ],
  detailsColunms: [
    { title: '单据编号', dataIndex: 'docID', filters: 'select', width: 100 },
    { title: '问题分类', dataIndex: 'issueType', filters: 'select', width: 100 },
    { title: '产品类型', dataIndex: 'productType', filters: 'select', width: 100 },
    { title: '机型', dataIndex: 'productType', filters: 'select' },
    { title: '订货号', dataIndex: 'order_code', filters: 'select', width: 100 },
    { title: '整机编号', dataIndex: 'pin_code', filters: 'select', width: 100 },
    { title: '购机日期', dataIndex: 'record_time', filters: 'select', width: 100 },
    { title: '装配日期', dataIndex: 'purchaseDate', filters: 'select', width: 100 },
    { title: '工作时间', dataIndex: 'workingTime', filters: 'select', width: 100 },
    { title: '作业工况', dataIndex: 'operatingCondition', filters: 'select', width: 100 },
    { title: '问题描述', dataIndex: 'problemDescription', filters: 'select', width: 100 },
    { title: '回写处置结果', dataIndex: 'backResult', width: 130, filters: 'select' },
    { title: '是否闭环', dataIndex: 'closedLoop', filters: 'select', width: 100 },
  ],
  setNumberData: [],
  detailsTableData: [],
  oid: route.query.projectOid ? JSON.parse(sessionStorage.getItem('taskProject'))?.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  acceptancePhaseList: [],
  newChildren: [],
  setNumberLoad: false,
  dialogVisible: false,
  gressRableLoad: false,
  phaseList: [],
  reviewPoint: '',
  pointNumber: 0,
  phaseName: '',
  phaseNumber: '',
  total: 0,
  tableDataCopy: [],
  defalutTableData: [],
  searchValue: '',
  strOrderNumber: '',
  orderNumberSelect: false,
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
      if (res.data.length > 0) {
        let phaseColums = res.data.map((item, index) => {
          let obj = {
            label: item.name,
            dataIndex: item.label,
            orderIndex: index + 1,
            children: [
              { label: '关闭数', dataIndex: '' },
              { label: '总数', dataIndex: '' },
              { label: '关闭率', dataIndex: '' },
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
                  if (chil.label === '关闭数') {
                    chil.dataIndex = `phase${item.orderIndex}ClosuresNumber`;
                    chil.ident = `phase${item.orderIndex}-ClosuresNumber`;
                  } else if (chil.label === '总数') {
                    chil.dataIndex = `phase${item.orderIndex}Total`;
                    chil.ident = `phase${item.orderIndex}-Total`;
                  } else if (chil.label === '关闭率') {
                    chil.dataIndex = `phase${item.orderIndex}ClosuresRate`;
                    chil.ident = `phase${item.orderIndex}-ClosuresRate`;
                  } else if (chil.label === '是否达标') {
                    chil.dataIndex = `phase${item.orderIndex}IsCompliance`;
                    chil.ident = `phase${item.orderIndex}-IsCompliance`;
                  }
                });
              }
              return item;
            });
            if (ele.hasOwnProperty('closuresNumber') || ele.hasOwnProperty('total') || ele.hasOwnProperty('closuresRate') || ele.hasOwnProperty('isCompliance')) {
              ele[`phase${index + 1}ClosuresNumber`] = ele['closuresNumber'];
              ele[`phase${index + 1}Total`] = ele['total'];
              ele[`phase${index + 1}ClosuresRate`] = ele['closuresRate'];
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
          if (item.identification === 'ClosuresNumber') {
            set(row, item.dataIndex, '');
          } else if (item.identification === 'Total') {
            set(row, item.dataIndex, '');
          } else if (item.identification === 'ClosuresRate') {
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
  if (Data.checkoutWBS) {
    getRoleNameData();
  }
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
        sessionStorage.setItem('externalData', JSON.stringify(newArr.length > 0 ? newArr.join(',') : ''));
      } else {
        window.$message.error(res.message);
      }
    });
  }
};
// 外部问题关闭率
const verificationStations = () => {
  Data.setNumberLoad = true;
  let params = {
    oid: route.name === 'examineReview' ? route.query.projectOid : Data.oid,
    targetIndicatorsType: '质量指标',
    indicatorName: '外部问题关闭率',
    orderNumbers: Data.orderNumberSelect === false ? Data.strOrderNumber : props.orderOid,
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
        set(item, 'issuesList', '问题列表');
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
  api.targetApi.queryIssueDetailsByItems(params).then((res) => {
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
    img {
      width: 15px;
      height: 15px;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
}
.chart {
  width: 200px;
  height: 200px;
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
