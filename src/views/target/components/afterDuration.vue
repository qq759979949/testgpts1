<template>
  <div class="after-quality">
    <div>
      <p class="title">
        <span>验证时长</span>
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
            <!-- 当前阶段可编辑 -->
            <span v-if="item.isCurrentPhase">
              <!-- 标准值 -->
              <span v-if="item.identification === 'StandardValue'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 有效值 -->
              <span v-if="item.identification === 'ValidValue'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 全部 -->
              <span v-if="item.identification === 'Whole'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 达成率 -->
              <span v-if="item.identification === 'AchievementRate'">{{ scope.row[item.dataIndex] }}</span>
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
                  <span v-else :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">{{ scope.row[item.dataIndex] }}</span>
                </span>
                <span v-else :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">{{ scope.row[item.dataIndex] }}</span>
              </span>
            </span>
            <!-- 不是当前阶段的读取 -->
            <span v-else>
              <!-- 标准值 -->
              <span v-if="item.identification === 'StandardValue'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 有效值 -->
              <span v-if="item.identification === 'ValidValue'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 全部 -->
              <span v-if="item.identification === 'Whole'">{{ scope.row[item.dataIndex] }}</span>
              <!-- 达成率 -->
              <span v-if="item.identification === 'AchievementRate'">{{ scope.row[item.dataIndex] }}</span>
              <span v-if="item.identification === 'IsCompliance' && scope.row[item.dataIndex] !== ''" :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">
                {{ scope.row[item.dataIndex] }}
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
                <span v-else :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">{{ scope.row[item.dataIndex] }}</span>
              </span>
            </span>
          </div>
          <!-- 目标指标读取 -->
          <div v-else>
            <span v-if="item.identification === 'StandardValue'">{{ scope.row[item.dataIndex] }}</span>
            <span v-else-if="item.identification === 'ValidValue'">{{ scope.row[item.dataIndex] }}</span>
            <span v-else-if="item.identification === 'Whole'">{{ scope.row[item.dataIndex] }}</span>
            <span v-else-if="item.identification === 'AchievementRate'">{{ scope.row[item.dataIndex] }}</span>
            <span v-else-if="item.identification === 'IsCompliance'" :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">{{ scope.row[item.dataIndex] }}</span>
            <el-link v-if="item.identification === 'QuantityDetails'" type="primary" :underline="true" @click="handleGoDetails(scope)">
              {{ scope.row[item.dataIndex] }}
            </el-link>
          </div>
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
  projectType: '',
  // 验证时长表头
  setNumberColunms: [
    // { label: '单位', dataIndex: 'unit', children: [], fixed: true },
    // { label: '验收阶段', dataIndex: 'acceptancePhase', width: 200, children: [], fixed: true },
    { label: '备注', dataIndex: 'remark', children: [], fixed: true },
    { label: '计算说明', dataIndex: 'formula', children: [], fixed: true },
  ],
  setNumberData: [], // 验证时长列表
  oid: route.query.projectOid ? JSON.parse(sessionStorage.getItem('taskProject'))?.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  acceptancePhaseList: [],
  newChildren: [],
  setNumberLoad: false,
  countNumber: 0,
  phaseList: [],
  reviewPoint: '',
  pointNumber: 0,
  phaseName: '',
  phaseNumber: '',
  strOrderNumber: '',
  orderNumberSelect: false,
});
// 获取阶段
const acceptancePhase = () => {
  api.payPacketApi.queryReviewPhaseByProjectType({ oid: route.name === 'examineReview' ? route.query.projectOid : Data.oid, phaseName: props.reviewPoint }).then((res) => {
    if (res.success) {
      Data.phaseList = res.data;
      if (Data.checkoutWBS) {
        Data.phaseList.map((item) => {
          if (item.name === Data.reviewPoint) {
            Data.phaseName = item.label;
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
              { label: '标准值', dataIndex: '' },
              { label: '有效值', dataIndex: '' },
              { label: '全部', dataIndex: '' },
              { label: '达成率', dataIndex: '' },
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
            ele.quantityDetails = '';
            Data.setNumberColunms = Data.setNumberColunms.map((item) => {
              if (item.label === ele.phaseKey) {
                item.children.map((chil) => {
                  if (chil.label === '标准值') {
                    chil.dataIndex = `${item.dataIndex}StandardValue`;
                    chil.ident = `${item.dataIndex}-StandardValue`;
                  } else if (chil.label === '有效值') {
                    chil.dataIndex = `${item.dataIndex}ValidValue`;
                    chil.ident = `${item.dataIndex}-ValidValue`;
                  } else if (chil.label === '全部') {
                    chil.dataIndex = `${item.dataIndex}Whole`;
                    chil.ident = `${item.dataIndex}-Whole`;
                  } else if (chil.label === '达成率') {
                    chil.dataIndex = `${item.dataIndex}AchievementRate`;
                    chil.ident = `${item.dataIndex}-AchievementRate`;
                  } else if (chil.label === '是否达标') {
                    chil.dataIndex = `${item.dataIndex}IsCompliance`;
                    chil.ident = `${item.dataIndex}-IsCompliance`;
                  } else if (chil.label === '台数明细') {
                    chil.dataIndex = `${item.dataIndex}QuantityDetails`;
                    chil.ident = `${item.dataIndex}-QuantityDetails`;
                  }
                });
              }
              return item;
            });
            if (
              ele.hasOwnProperty('standardValue') ||
              ele.hasOwnProperty('validValue') ||
              ele.hasOwnProperty('whole') ||
              ele.hasOwnProperty('achievementRate') ||
              ele.hasOwnProperty('isCompliance') ||
              ele.hasOwnProperty('quantityDetails')
            ) {
              ele[`phase${index + 1}StandardValue`] = ele['standardValue'];
              ele[`phase${index + 1}ValidValue`] = ele['validValue'];
              ele[`phase${index + 1}Whole`] = ele['whole'];
              ele[`phase${index + 1}AchievementRate`] = ele['achievementRate'];
              ele[`phase${index + 1}IsCompliance`] = ele['isCompliance'];
              ele[`phase${index + 1}AuantityDetails`] = ele['quantityDetails'];
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
          if (item.identification === 'StandardValue') {
            set(row, item.dataIndex, '');
          } else if (item.identification === 'ValidValue') {
            set(row, item.dataIndex, '');
          } else if (item.identification === 'Whole') {
            set(row, item.dataIndex, '');
          } else if (item.identification === 'AchievementRate') {
            set(row, item.dataIndex, '');
          } else if (item.identification === 'IsCompliance') {
            set(row, item.dataIndex, '');
          } else if (item.identification === 'QuantityDetails') {
            set(row, item.dataIndex, '台数明细');
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
        item.phaseInfoList.forEach((ids, idx) => {
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
        // let flowTechnicalData = Data.setNumberData.filter((item) => {
        //   if (!item.roleFlag && item.acceptancePhase.includes(Data.reviewPoint)) {
        //     return item;
        //   }
        // });
        // let newArr = flowTechnicalData.map((item) => {
        //   return item.actualValueProvided;
        // });
        // sessionStorage.setItem('setNumberData', JSON.stringify(newArr.length > 0 ? newArr.join(',') : ''));
      } else {
        window.$message.error(res.message);
      }
    });
  }
};
// 验证时长
const verificationStations = () => {
  Data.setNumberLoad = true;
  let params = {
    oid: route.name === 'examineReview' ? route.query.projectOid : Data.oid,
    targetIndicatorsType: '质量指标',
    indicatorName: '验证时长',
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
      });
      if (Data.setNumberData.length > 0) {
        Data.setNumberColunms.map((item) => (item.width = 120));
        acceptancePhase();
      } else {
        Data.setNumberColunms.map((item) => (item.width = 0));
      }
      Data.setNumberLoad = false;
    } else {
      window.$message.error(res.message);
      Data.setNumberLoad = false;
    }
  });
};
onMounted(() => {
  if (route.name === 'createReview' || route.name === 'editReview') {
    let orderNumber = JSON.parse(sessionStorage.getItem('orderNumber'));
    Data.strOrderNumber = orderNumber.length > 0 ? orderNumber.join(', ').replace(/\s+/g, '') : '';
  }
  verificationStations();
});
defineExpose({ Data });
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
}
.uploadTitle {
  position: relative;
  .upload-icon {
    position: absolute;
    right: -8%;
    cursor: pointer;
    top: 8%;
    color: #386bda;
  }
  .columnTitle {
    max-width: 100px;
    word-wrap: break-word;
  }
}
:deep(.el-input-number.is-controls-right .el-input-number__decrease) {
  height: 15px;
  background: #fff;
}
:deep(.el-input-number.is-controls-right .el-input-number__increase) {
  height: 15px;
  background: #fff;
}
:deep(.el-input--large .el-input__inner) {
  width: 45px;
}
:deep(.el-input__wrapper) {
  height: 30px;
}
:deep(.el-table td.el-table__cell div) {
  width: 100%;
  height: 32px;
  border-radius: 4px;
  border: 0px solid #d9d9d9;
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
    border-right: 1px solid #000 !important;
  }
}
</style>
