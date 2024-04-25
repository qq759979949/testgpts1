<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-10 16:12:07
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-16 10:51:39
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectChange\comp\attribute.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="targetIndicators">
    <div class="content_box" v-if="props.projectType === '产品开发类项目'">
      <div class="title_box">
        <span class="hand_icon" @click="Data.switchover.technical = !Data.switchover.technical">{{ Data.switchover.technical ? '-' : '+' }}</span>
        <span class="title">技术指标</span>
      </div>
      <technical
        :technicalColumns="Data.technicalColumns"
        :isChange="true"
        :isEdit="props.isEdit"
        :productCategoryList="Data.productCategoryList"
        :acceptancePhaseList="props.phaseList"
        v-model:tableDataTechnical="Data.tableDataList.tableDataTechnical"
        v-if="Data.switchover.technical"
      ></technical>
    </div>
    <!-- <div class="content_box">
      <div class="title">质量指标</div>
      <quality
        :qualityColumns="Data.qualityColumns"
        :isChange="true"
        :isEdit="props.isEdit"
        :productCategoryList="Data.productCategoryList"
        :acceptancePhaseList="props.phaseList"
        :tableDataQuaility="Data.tableDataList.tableDataQuaility"
      ></quality>
    </div> -->
    <div class="content_box">
      <div class="title_box">
        <span class="hand_icon" @click="Data.switchover.cost = !Data.switchover.cost">{{ Data.switchover.cost ? '-' : '+' }}</span>
        <span class="title">成本指标</span>
      </div>
      <cost :costColumns="Data.costColumns" :isChange="true" :isEdit="props.isEdit" :tableDataCost="Data.tableDataList.tableDataCost" v-if="Data.switchover.cost"></cost>
    </div>
    <div class="content_box" v-if="props.projectType === '产品开发类项目'">
      <div class="title_box">
        <span class="hand_icon" @click="Data.switchover.market = !Data.switchover.market">{{ Data.switchover.market ? '-' : '+' }}</span>
        <span class="title">市场指标</span>
      </div>
      <marketIndicator
        :marketColumns="Data.marketColumns"
        :isChange="true"
        :isEdit="props.isEdit"
        :productCategoryList="Data.productCategoryList"
        :acceptancePhaseList="props.phaseList"
        v-model:tableDataMarket="Data.tableDataList.tableDataMarket"
        v-if="Data.switchover.market"
      ></marketIndicator>
    </div>
    <div class="content_box" v-if="props.projectType === '产品开发类项目'">
      <div class="title_box">
        <span class="hand_icon" @click="Data.switchover.material = !Data.switchover.material">{{ Data.switchover.material ? '-' : '+' }}</span>
        <span class="title">物料指标</span>
      </div>
      <materialIndicator
        :materialColumns="Data.materialColumns"
        :isChange="true"
        :isEdit="props.isEdit"
        :productCategoryList="Data.productCategoryList"
        :acceptancePhaseList="props.phaseList"
        v-model:tableDataMaterial="Data.tableDataList.tableDataMaterial"
        v-if="Data.switchover.material"
      ></materialIndicator>
    </div>
    <div class="content_box" v-if="props.projectType === '产品开发类项目'">
      <div class="title_box">
        <span class="hand_icon" @click="Data.switchover.patent = !Data.switchover.patent">{{ Data.switchover.patent ? '-' : '+' }}</span>
        <span class="title">专利指标</span>
      </div>
      <patentComponents
        :patentColumns="Data.patentColumns"
        :isChange="true"
        :isEdit="props.isEdit"
        :productCategoryList="Data.productCategoryList"
        v-model:tableDataPatent="Data.tableDataList.tableDataPatent"
        v-if="Data.switchover.patent"
      ></patentComponents>
    </div>
    <div class="content_box" v-if="props.projectType !== '产品开发类项目'">
      <div class="title_box">
        <span class="hand_icon" @click="Data.switchover.economic = !Data.switchover.economic">{{ Data.switchover.economic ? '-' : '+' }}</span>
        <span class="title">经济效益指标</span>
      </div>
      <economic
        :economicColumns="Data.economicColumns"
        :isChange="true"
        :isEdit="props.isEdit"
        :productCategoryList="Data.productCategoryList"
        :acceptancePhaseList="props.phaseList"
        v-model:tableDataEconomic="Data.tableDataList.tableDataEconomic"
        v-if="Data.switchover.economic"
      ></economic>
    </div>
    <div class="content_box" v-if="props.projectType !== '产品开发类项目'">
      <div class="title_box">
        <span class="hand_icon" @click="Data.switchover.other = !Data.switchover.other">{{ Data.switchover.other ? '-' : '+' }}</span>
        <span class="title">其他指标</span>
      </div>
      <othersIndicator
        :otherColumns="Data.otherColumns"
        :isChange="true"
        :isEdit="props.isEdit"
        :productCategoryList="Data.productCategoryList"
        :acceptancePhaseList="props.phaseList"
        v-model:tableDataOther="Data.tableDataList.tableDataOther"
        v-if="Data.switchover.other"
      ></othersIndicator>
    </div>
  </div>
</template>
<script setup>
// 立项前
import technical from '../target/technical.vue'; // 技术
// import quality from '@/views/target/components/quality.vue'; // 质量
import cost from '../target/cost.vue'; // 成本
import marketIndicator from '../target/market.vue'; // 市场
import materialIndicator from '../target/materialIndicator.vue'; // 物料
import patentComponents from '../target/patent.vue'; // 专利
import economic from '../target/economic.vue'; // 经济效益
import othersIndicator from '../target/othersIndicator.vue'; // 其他指标
import { productColunms, materialIndicatorColums, otherQualityColums, marketColums, patentColums, economicsColums, moneyColumns } from './columns';
const { proxy: that } = getCurrentInstance();
const route = useRoute();
const props = defineProps({
  // 表格是否可编辑
  isEdit: {
    type: Boolean,
    default: false,
  },
  isCreate: {
    type: Boolean,
    default: false,
  },
  tableData: {
    type: Object,
    default: () => {},
  },
  oid: {
    type: String,
    default: '',
  },
  phaseList: {
    type: Array,
    default: () => [],
  },
  projectType: {
    type: String,
    default: '',
  },
});
const Data = reactive({
  technicalColumns: productColunms,
  qualityColumns: otherQualityColums,
  marketColumns: marketColums,
  materialColumns: materialIndicatorColums,
  patentColumns: patentColums,
  economicColumns: economicsColums,
  otherColumns: productColunms,
  costColumns: moneyColumns,
  // 立项前
  beforeProjectEstablishment: [],
  // tableData: [],
  projectType: route.query.projectType ? route.query.projectType : JSON.parse(sessionStorage.getItem('currentProject')).type,
  productCategoryList: [],
  tableDataList: {
    tableDataTechnical: [],
    tableDataQuaility: [],
    tableDataOther: [],
    tableDataEconomic: [],
    tableDataPatent: [],
    tableDataMaterial: [],
    tableDataMarket: [],
    tableDataCost: [],
  },
  switchover: {
    technical: true,
    cost: true,
    material: true,
    market: true,
    economic: true,
    other: true,
    patent: true,
  },
});
watch(
  () => props.isEdit,
  (val) => {
    if (val) {
      getSelectData();
    }
    if (props.isCreate && !props.isEdit) {
      if (props.projectType === '产品开发类项目') {
        getTargetType('技术指标');
        // getTargetType('质量指标');
        getTargetType('市场指标');
        getTargetType('物料指标');
        getTargetType('专利指标');
        getTargetType('成本指标');
      } else {
        // getTargetType('质量指标');
        getTargetType('经济效益指标');
        getTargetType('其他指标');
        getTargetType('成本指标');
      }
    }
  },
);
watch(
  () => props.tableData,
  (val) => {
    if (val.length === 0) {
      if (props.projectType === '产品开发类项目') {
        getTargetType('技术指标');
        // getTargetType('质量指标');
        getTargetType('市场指标');
        getTargetType('物料指标');
        getTargetType('专利指标');
        getTargetType('成本指标');
      } else {
        // getTargetType('质量指标');
        getTargetType('经济效益指标');
        getTargetType('其他指标');
        getTargetType('成本指标');
      }
    } else {
      Data.tableDataList = val;
    }
  },
);
// 查询目标指标
const getTargetType = (type) => {
  let params = {
    oid: props.oid,
    targetIndicatorsType: type,
    orderNumbers: '',
  };
  window.$api.targetApi.queryTargetIndicators(params).then((res) => {
    if (res.success) {
      Data.tableData = res.data;
      nextTick(() => {
        Data.tableData = Data.tableData.map((item) => {
          item.bothFlag = true;
          item.targetCanChange = item.isCanChange;
          item.afterChangeEdit = true;
          item.projectTargetValueChange = item.projectTargetValue;
          return item;
        });
      });
      switch (type) {
        case '技术指标':
          Data.tableDataList.tableDataTechnical = Data.tableData;
          break;
        case '质量指标':
          Data.tableDataList.tableDataQuaility = Data.tableData;
          break;
        case '市场指标':
          Data.tableDataList.tableDataMarket = Data.tableData;
          break;
        case '物料指标':
          Data.tableDataList.tableDataMaterial = Data.tableData;
          break;
        case '专利指标':
          Data.tableDataList.tableDataPatent = Data.tableData;
          break;
        case '经济效益指标':
          Data.tableDataList.tableDataEconomic = Data.tableData;
          break;
        case '成本指标':
          Data.tableDataList.tableDataCost = Data.tableData;
          break;
        case '其他指标':
          Data.tableDataList.tableDataOther = Data.tableData;
          break;
      }
    } else {
      window.$message.error(res.message);
    }
  });
};
// 下拉
const getSelectData = () => {
  // 产品类别
  window.$api.targetApi.getProductTypes().then((res) => {
    if (res.success) {
      if (res.data) {
        Data.productCategoryList = res.data.map((item) => {
          return { label: item, value: item };
        });
      }
    }
  });
};
onMounted(() => {
  if (props.isCreate) {
    if (props.projectType === '产品开发类项目') {
      getTargetType('技术指标');
      // getTargetType('质量指标');
      getTargetType('市场指标');
      getTargetType('物料指标');
      getTargetType('专利指标');
      getTargetType('成本指标');
    } else {
      // getTargetType('质量指标');
      getTargetType('经济效益指标');
      getTargetType('其他指标');
      getTargetType('成本指标');
    }
  }
});
defineExpose({
  Data,
});
</script>
<style scoped lang="less">
.targetIndicators {
  .content_box {
    padding: 10px;
    .title {
      font-size: 16px;
      color: #333;
      // margin-bottom: 10px;
    }
  }
  .title_box {
    display: flex;
    align-items: center;
    height: 40px;
    // border-bottom: 1px solid #dddddd;
    // padding: 0 16px;
    .hand_icon {
      width: 14px;
      height: 14px;
      display: flex;
      border: 1px solid rgba(0, 0, 0, 0.06);
      color: #333333;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-right: 10px;
      &:hover {
        border: 1px solid #2664f6;
      }
    }
  }
  // 橙色三角形
  .input-triangle {
    position: absolute;
    top: 3%;
    left: 0px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0px 1px 8px 11px;
    border-color: transparent transparent #f68800 transparent;
    transform: rotate(180deg);
    border-radius: 30%;
  }
  :deep(.el-input-group--prepend > .el-input__wrapper) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .noChange {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
  .hasChange {
    color: #f02323;
  }
}
</style>
