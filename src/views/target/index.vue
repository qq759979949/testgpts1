<template>
  <div class="target">
    <!-- tab -->
    <el-affix position="top" :offset="100">
      <div class="top_area">
        <div class="tab_box">
          <el-tabs v-model="Data.tabValue" @tab-click="handleTabClick">
            <el-tab-pane
              v-for="(item, index) in Data.state === '待处理' ? Data.beforeProjectEstablishment : Data.afterProjectEstablishment"
              :key="index"
              :label="$intl(item.enName).d(item.label)"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-affix>
    <!-- content -->
    <div class="bot_area">
      <div>
        <div class="depart" :id="item.name" v-for="(item, index) in Data.state === '待处理' ? Data.beforeProjectEstablishment : Data.afterProjectEstablishment" :key="index">
          <div class="title_box">
            <span class="hand_icon" @click="item.switchover = !item.switchover">{{ item.switchover ? '-' : '+' }}</span>
            <span class="title">{{ item.label }}</span>
          </div>
          <div class="content">
            <component v-if="item.switchover" :is="item.component" :productCategoryList="Data.productCategoryList" :acceptancePhaseList="Data.acceptancePhaseList"></component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 立项前
import technical from './components/technical.vue'; // 技术指标
import quality from './components/quality.vue'; // 质量指标
import cost from './components/cost.vue'; // 成本指标
import marketIndicator from './components/market.vue'; // 市场指标
import materialIndicator from './components/materialIndicator.vue'; // 物料指标
import patentComponents from './components/patent.vue'; // 专利指标
import economic from './components/economic.vue'; // 经济效益指标
import othersIndicator from './components/othersIndicator.vue'; // 其他指标
// 立项后
import afterTechnical from './components/afterTechnical.vue'; // 技术指标
import afterQuality from './components/afterQuality.vue'; // 质量指标
import afterCost from './components/afterCost.vue'; // 成本指标
import afterMarketIndicator from './components/afterMarketIndicator.vue'; // 市场指标
import afterMaterialIndicator from './components/afterMaterialIndicator.vue'; // 物料指标
import afterPatent from './components/afterPatent.vue'; // 专利指标
import afterEconomic from './components/afterEconomic.vue'; // 经济效益指标
import afterOtherIndicator from './components/afterOtherIndicator.vue'; // 其他指标
import afterOtherQuality from './components/afterOtherQuality.vue'; // 质量指标 ---非产品类
import afterOtherCost from './components/afterOtherCost.vue'; // 成本指标---非产品类
const api = window.$api;
const porps = defineProps({
  isEvaluate: {
    type: Boolean,
    default: false,
  },
});
const Data = reactive({
  state: '',
  projectType: '',
  // 立项前
  beforeProjectEstablishment: [],
  // 立项后
  afterProjectEstablishment: [],
  tabValue: '',
  productCategoryList: [],
  pointerTypeList: [],
  acceptancePhaseList: [],
  oid: '',
});
// 获取目标/指标类型
const getType = () => {
  if (Data.projectType === '产品开发类项目') {
    // 立项前
    Data.beforeProjectEstablishment = [
      {
        name: 'technical_index',
        label: '技术指标（性能门）',
        component: technical,
        ref: 'technical',
        switchover: true,
      },
      {
        name: 'quality_index',
        label: '质量指标（质量门）',
        component: quality,
        ref: 'quality',
        switchover: true,
      },
      {
        name: 'cost_index',
        label: '成本指标（成本门）',
        component: cost,
        ref: 'cost',
        switchover: true,
      },
      {
        name: 'market',
        label: '市场指标',
        enName: 'market',
        component: marketIndicator,
        ref: 'market',
        switchover: true,
      },
      {
        name: 'material_specification',
        label: '物料指标',
        enName: 'material_specification',
        component: materialIndicator,
        ref: 'material',
        switchover: true,
      },
      {
        name: 'patent',
        label: '专利指标',
        enName: 'patent',
        component: patentComponents,
        ref: 'patent',
        switchover: true,
      },
    ];
    // 立项后
    Data.afterProjectEstablishment = [
      {
        name: 'technical_index',
        label: '技术指标（性能门）',
        enName: 'technical_index',
        component: afterTechnical,
        ref: 'technica',
        switchover: true,
      },
      {
        name: 'quality_index',
        label: '质量指标（质量门）',
        enName: 'quality_index',
        component: afterQuality,
        ref: 'quality',
        switchover: true,
      },
      {
        name: 'cost_index',
        label: '成本指标（成本门）',
        enName: 'cost_index',
        component: afterCost,
        ref: 'cost',
        switchover: true,
      },
      {
        name: 'market',
        label: '市场指标',
        enName: 'market',
        component: afterMarketIndicator,
        ref: 'market',
        switchover: true,
      },
      {
        name: 'material_specification',
        label: '物料指标',
        enName: 'material_specification',
        component: afterMaterialIndicator,
        ref: 'material',
        switchover: true,
      },
      {
        name: 'patent',
        label: '专利指标',
        enName: 'patent',
        component: afterPatent,
        ref: 'patent',
        switchover: true,
      },
    ];
  } else {
    // 立项前
    Data.beforeProjectEstablishment = [
      {
        name: 'economic',
        label: '经济效益指标',
        enName: 'economic benefit index',
        component: economic,
        ref: 'economic',
        switchover: true,
      },
      {
        name: 'quality_index',
        label: '质量指标（质量门）',
        component: quality,
        ref: 'quality',
        switchover: true,
      },
      {
        name: 'cost_index',
        label: '成本指标（成本门）',
        component: cost,
        ref: 'cost',
        switchover: true,
      },
      {
        name: 'others_index',
        label: '其他指标',
        component: othersIndicator,
        ref: 'othersIndicator',
        switchover: true,
      },
    ];
    // 立项后
    Data.afterProjectEstablishment = [
      {
        name: 'economic',
        label: '经济效益指标',
        enName: 'economic',
        component: afterEconomic,
        ref: 'afterEconomic',
        switchover: true,
      },
      {
        name: 'quality_index',
        label: '质量指标（质量门）',
        enName: 'quality_index',
        // component: afterQuality,
        component: afterOtherQuality,
        ref: 'quality',
        switchover: true,
      },
      {
        name: 'cost_index',
        label: '成本指标（成本门）',
        enName: 'cost_index',
        component: afterOtherCost,
        ref: 'cost',
        switchover: true,
      },
      {
        name: 'otherIndicator',
        label: '其他指标',
        enName: 'otherIndicator',
        component: afterOtherIndicator,
        ref: 'otherIndicator',
        switchover: true,
      },
    ];
  }
  Data.state == '待处理' ? (Data.tabValue = Data.beforeProjectEstablishment[0].name) : (Data.tabValue = Data.afterProjectEstablishment[0].name);
};
// tab切换
const handleTabClick = (tab) => {
  const id = tab.props.name;
  document.querySelector('#' + id).scrollIntoView({
    behavior: 'smooth',
  });
};
// 下拉
const getSelectData = () => {
  // 产品类别
  api.targetApi.getProductTypes({ oid: Data.oid }).then((res) => {
    if (res.success) {
      if (res.data.length > 0) {
        Data.productCategoryList = res.data.map((item) => {
          return { label: item, value: item };
        });
      }
    }
  });
  // 验收阶段
  api.payPacketApi.queryReviewPhaseByProjectType({ oid: Data.oid }).then((res) => {
    if (res.success) {
      Data.acceptancePhaseList = res.data;
    }
  });
};
onMounted(() => {
  Data.projectType = JSON.parse(sessionStorage.getItem('currentProject')).type;
  Data.state = JSON.parse(sessionStorage.getItem('currentProject')).state;
  Data.oid = JSON.parse(sessionStorage.getItem('currentProject')).oid;
  getSelectData();
  getType();
});
</script>

<style lang="less" scoped>
.target {
  width: calc(100% - 32px);
  margin: 0 16px;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  color: #333333;
  .top_area {
    margin-bottom: 20px;
    padding: 16px 16px 0 16px;
    background: #fff;
    .tab_box {
      :deep(.el-tabs__header) {
        margin-bottom: 0px;
      }
    }
  }

  .bot_area {
    padding: 0 8px 0 16px;
    height: calc(100vh - 230px);
    overflow-y: scroll;
    margin-top: 20px;
    .depart {
      background: #fff;
      margin-bottom: 10px;

      .title_box {
        display: flex;
        align-items: center;
        height: 40px;
        border-bottom: 1px solid #dddddd;

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

        .title {
          font-size: 16px;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: 700;
          color: #333333;
        }
      }
      .self-checker-setting {
        display: flex;
        align-items: center;
        height: 40px;
        border-bottom: 1px solid #dddddd;
        padding: 0 16px;

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

        .title {
          font-size: 16px;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: 500;
          color: #333333;
          flex: 1;
        }
      }
      .base-content {
        margin: 15px 24px 0 -15px;
        padding-bottom: 25px;
      }

      .milestone-content {
        padding: 15px;
        padding-left: 70px;
      }

      .product-content {
        padding: 15px;
      }
      .progress-content {
        padding: 15px;
      }
      .target-content {
        padding: 15px;
        .content-title {
          font-size: 16px;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: 500;
          color: #333333;
          margin-bottom: 10px;
        }
        .content-title-sublevel {
          font-size: 14px;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: 500;
          color: #333333;
          margin-bottom: 5px;
        }
      }
      .self_checker-content {
        padding: 5px 15px 15px 15px;
      }
      .workflow-content {
        padding: 15px;
        padding-left: 0;
        margin-left: 12px;
      }
      .fault_feedback-content {
        padding: 15px;
      }
      .formBox {
        .btnMake {
          display: flex;
          justify-content: flex-start;
          padding: 10px 15px 0px 15px;
        }
      }
      .content {
        margin: 15px 24px 0 0;
        padding-bottom: 25px;
      }
    }
  }
}
</style>
