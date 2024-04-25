<template>
  <div class="after-quality">
    <div>
      <p class="title">
        <span>验证台数</span>
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
                </span>
                <span v-else :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">{{ scope.row[item.dataIndex] }}</span>
              </span>
              <!-- 台数明细 -->
              <span v-if="item.identification === 'QuantityDetails'">
                <el-link type="primary" :underline="true" @click="handleGoDetails(scope, item.phaseOid, item.phaseName)">
                  {{ scope.row[item.dataIndex] }}
                </el-link>
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
              <span v-if="item.identification === 'QuantityDetails'">
                <el-link type="primary" :underline="true" @click="handleGoDetails(scope, item.phaseOid, item.phaseName)">
                  {{ scope.row[item.dataIndex] }}
                </el-link>
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
            <el-link v-if="item.identification === 'QuantityDetails'" type="primary" :underline="true" @click="handleGoDetails(scope, item.phaseOid, item.phaseName)">
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
    <!-- 验证台数对话框 -->
    <el-dialog v-model="Data.dialogVisible" title="台数明细" width="1400">
      <div class="details">
        <div class="details-table">
          <NewPiTable :columns="Data.detailsColunms" :data="Data.detailsTableData" :selectable="false" rowKey="oid" height="600">
            <template #reviewNumber="scope">
              <el-link type="primary" :underline="true" @click="handleGoDetail">
                {{ scope.row.reviewNumber }}
              </el-link>
            </template>
            <template #modelType="scope">
              <span>{{ scope.row.modelType }}</span>
            </template>
          </NewPiTable>
        </div>
        <div id="myEcharts" :style="{ width: '500px', height: '500px' }"></div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="Data.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import levelTable from '@/views/projectInitiation/components/levelTable.vue';
import { onMounted } from 'vue';
import { set } from 'lodash';
import * as echarts from 'echarts';
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
    Data.countNumber = 1;
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
  projectType: route.query.processOID ? JSON.parse(sessionStorage.getItem('taskProject'))?.type : JSON.parse(sessionStorage.getItem('currentProject'))?.type,
  dialogVisible: false, // 台数明细弹框
  checkoutWBS: true,
  detailsColunms: [
    {
      title: '序号',
      dataIndex: 'sortId',
      width: 70,
    },
    {
      title: '机型',
      dataIndex: 'modelType',
      width: 220,
    },
    {
      title: '订货号',
      dataIndex: 'itemId',
    },
    {
      title: '台数',
      dataIndex: 'amount',
    },
  ], // 台数明细表头
  detailsTableData: [], // 台数明细列表
  setNumberColunms: [], // 验证台数表头
  productColunms: [
    // {
    //   label: '单位',
    //   dataIndex: 'unit',
    //   children: [],
    //   fixed: true,
    // },
    // {
    //   label: '验收阶段',
    //   dataIndex: 'acceptancePhase',
    //   width: 200,
    //   children: [],
    //   fixed: true,
    // },
    // {
    //   label: '实际值提供者',
    //   dataIndex: 'actualValueProvided',
    //   width: 200,
    //   children: [],
    //   fixed: true,
    // },
    {
      label: '计算说明',
      dataIndex: 'formula',
      width: 90,
      children: [],
      fixed: true,
    },
  ], // 产品开发类表头
  otherTypeColums: [
    {
      label: '指标名称',
      dataIndex: 'indicatorName',
      children: [],
      fixed: true,
    },
    {
      label: '指标小类',
      dataIndex: 'indicatorSmallType',
      width: 120,
      children: [],
      fixed: true,
    },
    // {
    //   label: '单位',
    //   dataIndex: 'unit',
    //   children: [],
    //   fixed: true,
    // },
    // {
    //   label: '验收阶段',
    //   dataIndex: 'acceptancePhase',
    //   width: 200,
    //   children: [],
    //   fixed: true,
    // },
    {
      label: '本项目目标值',
      dataIndex: 'projectTargetValue',
      width: 120,
      children: [],
      fixed: true,
    },
    {
      label: '备注',
      dataIndex: 'remark',
      children: [],
      fixed: true,
    },
  ], // 其他类表头
  setNumberData: [], // 验证台数列表
  xAxisData: [],
  yAxisData: [],
  oid: route.query.projectOid ? JSON.parse(sessionStorage.getItem('taskProject'))?.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  acceptancePhaseList: [],
  acceptanceDuration: [],
  newChildren: [],
  newExitRateChildren: [],
  newFailureChildren: [],
  newLostCostChildren: [],
  newDurationChildren: [],
  newInteriorChildren: [],
  setNumberLoad: false,
  selectRow: '',
  countNumber: 0,
  phaseList: [],
  reviewPoint: '',
  pointNumber: 0,
  phaseName: '',
  phaseNumber: '',
  phaseOid: '',
  strOrderNumber: '',
  orderNumberSelect: false,
  selectPhaseOid: '',
  selectPhaseName: '', // 当前阶段名称
});
// 台数明细验收阶段
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
        res.data.map((item, index) => {
          if (Data.projectType === '产品开发类项目') {
            if (Data.countNumber === 0 && Data.pointNumber === 0) {
              Data.productColunms.push({
                label: item.name,
                dataIndex: item.label,
                orderIndex: index + 1,
                children: [
                  { label: '标准值', dataIndex: '' },
                  { label: '有效值', dataIndex: '' },
                  { label: '全部', dataIndex: '' },
                  { label: '达成率', dataIndex: '' },
                  { label: '是否达标', dataIndex: '' },
                  { label: '台数明细', dataIndex: '' },
                ],
              });
              Data.setNumberColunms = Data.productColunms;
            } else {
              // 评审页面,触发技术评审点调整列表二级表头顺序
              if (Data.productColunms.length === 5) {
                Data.productColunms = Data.productColunms.slice(0, 1);
              }
              Data.productColunms.push({
                label: item.name,
                dataIndex: item.label,
                orderIndex: index + 1,
                children: [
                  { label: '标准值', dataIndex: '' },
                  { label: '有效值', dataIndex: '' },
                  { label: '全部', dataIndex: '' },
                  { label: '达成率', dataIndex: '' },
                  { label: '是否达标', dataIndex: '' },
                  { label: '台数明细', dataIndex: '' },
                ],
              });
              Data.setNumberColunms = Data.productColunms;
            }
          } else {
            Data.setNumberColunms.push({
              label: item.name,
              dataIndex: item.label,
              children: [
                { label: '标准值', dataIndex: '' },
                { label: '有效值', dataIndex: '' },
                { label: '全部', dataIndex: '' },
                { label: '达成率', dataIndex: '' },
                { label: '是否达标', dataIndex: '' },
                { label: '台数明细', dataIndex: '' },
              ],
            });
          }
        });
      }
      Data.setNumberData.forEach((itm) => {
        if (itm.phaseInfoList.length > 0) {
          itm.phaseInfoList.forEach((ele, index) => {
            ele.quantityDetails = '';
            Data.setNumberColunms = Data.setNumberColunms.map((item) => {
              if (item.label === ele.phaseKey) {
                item.children.map((chil) => {
                  if (chil.label === '标准值') {
                    chil.dataIndex = `phase${item.orderIndex}StandardValue`;
                    chil.ident = `phase${item.orderIndex}-StandardValue`;
                  } else if (chil.label === '有效值') {
                    chil.dataIndex = `phase${item.orderIndex}ValidValue`;
                    chil.ident = `phase${item.orderIndex}-ValidValue`;
                  } else if (chil.label === '全部') {
                    chil.dataIndex = `phase${item.orderIndex}Whole`;
                    chil.ident = `phase${item.orderIndex}-Whole`;
                  } else if (chil.label === '达成率') {
                    chil.dataIndex = `phase${item.orderIndex}AchievementRate`;
                    chil.ident = `phase${item.orderIndex}-AchievementRate`;
                  } else if (chil.label === '是否达标') {
                    chil.dataIndex = `phase${item.orderIndex}IsCompliance`;
                    chil.ident = `phase${item.orderIndex}-IsCompliance`;
                  } else if (chil.label === '台数明细') {
                    chil.dataIndex = `phase${item.orderIndex}QuantityDetails`;
                    chil.ident = `phase${item.orderIndex}-QuantityDetails`;
                    chil.phaseOid = `phase${item.orderIndex}IndicatorOid`;
                    chil.phaseName = `phase${item.orderIndex}PhaseName`;
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
            set(row, item.phaseOid, '');
            set(row, item.phaseName, '');
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
          set(ids, `phase${idx + 1}QuantityDetails`, '台数明细');
          set(ids, `phase${idx + 1}IndicatorOid`, ids.indicatorPhaseOid);
          set(ids, `phase${idx + 1}PhaseName`, ids.phaseName);
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
            } else {
              data.roleFlag = false;
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
        sessionStorage.setItem('setNumberData', JSON.stringify(newArr.length > 0 ? newArr.join(',') : ''));
      } else {
        window.$message.error(res.message);
      }
    });
  }
};
// 验证台数
const verificationStations = () => {
  if (Data.projectType === '产品开发类项目' && Data.countNumber === 0) {
    Data.setNumberColunms = Data.productColunms;
  } else {
    if (Data.countNumber === 0) {
      Data.setNumberColunms = Data.otherTypeColums;
    }
  }
  Data.setNumberLoad = true;
  // let orderNumbers = ''
  // if(route.name === 'target' || route.name === 'examineReview' || ) {
  //   orderNumbers = ''
  // }
  // else {

  // }
  let params = {
    oid: route.name === 'examineReview' ? route.query.projectOid : Data.oid,
    targetIndicatorsType: '质量指标',
    indicatorName: '验证台数',
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
      });
      Data.setNumberData.length > 0 ? acceptancePhase() : '';
      Data.setNumberLoad = false;
    } else {
      window.$message.error(res.message);
      Data.setNumberLoad = false;
    }
  });
};
// 弹出台数明细
const handleGoDetails = (row, oid, phaseName) => {
  Data.phaseOid = oid;
  Data.selectRow = row;
  Data.dialogVisible = true;
  Data.setNumberData.forEach((item) => {
    if (item.index === Data.selectRow.row.index) {
      item.phaseInfoList.forEach((row) => {
        for (let key in row) {
          if (key === Data.phaseOid) {
            Data.selectPhaseOid = item[key] ? item[key] : '';
          }
          if (key === phaseName) {
            Data.selectPhaseName = item[key] ? item[key] : '';
          }
        }
      });
    }
  });
  route.name === 'createReview' || route.name === 'editReview' || route.name === 'examineReview' || route.name === 'examineProcess' ? initPieData() : getQuantityDetailsByPhase();
};
// 评审获取台数明细
const initPieData = () => {
  let paramsData = new FormData();
  paramsData.append('itemIds', Data.strOrderNumber);
  paramsData.append('projectOid', route.name !== 'target' ? Data.oid : Data.selectPhaseOid);
  paramsData.append('reviewPhase', Data.selectPhaseName);
  api.payPacketApi.queryQuantityDetails(paramsData).then((res) => {
    if (res.success) {
      Data.xAxisData = res.data.xData;
      Data.yAxisData = res.data.seriesData;
      Data.detailsTableData = res.data.itemInfos;
      nextTick(() => {
        initData();
      });
    }
  });
};
const initData = () => {
  var myChart = echarts.init(document.getElementById('myEcharts'));
  myChart.setOption({
    title: {
      text: '台数统计',
      subtextStyle: {
        align: 'right', // 子标题向左对齐
        padding: [20, 100, 20, 20],
      },
    },
    xAxis: {
      name: 'h',
      type: 'category',
      data: Data.xAxisData,
      axisLine: {
        show: true,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      name: '台',
      type: 'value',
      axisLine: {
        show: true,
      },
    },
    series: [
      {
        data: Data.yAxisData,
        type: 'bar',
        barWidth: '15%',
        itemStyle: {
          color: '#6395FA',
        },
        label: {
          show: true, //开启显示
          position: 'top', //在上方显示
          textStyle: {
            //数值样式
            fontSize: '14px',
            color: '#666',
          },
          formatter: '{c}',
        },
      },
    ],
  });
  window.addEventListener('resize', function () {
    myChart.resize();
  });
};
// 其他页面获取台数明细
const getQuantityDetailsByPhase = () => {
  api.targetApi.queryQuantityDetailsByPhase({ oid: Data.selectPhaseOid }).then((res) => {
    if (res.success) {
      Data.xAxisData = res.data.xData;
      Data.yAxisData = res.data.seriesData;
      Data.detailsTableData = res.data.itemInfos;
      nextTick(() => {
        initData();
      });
    }
  });
};
// 提交
const handleSubmit = () => {
  Data.dialogVisible = false;
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
    img {
      width: 15px;
      height: 15px;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
}
.details {
  display: flex;
  .details-table {
    flex: 1;
    margin-right: 10px;
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
:deep(.el-dialog__header) {
  font-weight: 700;
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
