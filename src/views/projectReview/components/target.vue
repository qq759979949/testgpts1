<template>
  <div class="target-content">
    <div>
      <div class="content-title">技术指标（性能门）</div>
      <afterTechnical :isEdit="true"></afterTechnical>
    </div>
    <div>
      <div class="content-title">质量指标（质量门）</div>
      <afterQuality :isEdit="true"></afterQuality>
    </div>
    <div>
      <div class="content-title-sublevel">成本指标（成本门）</div>
      <afterCost :isEdit="true"></afterCost>
    </div>
    <div>
      <div class="content-title-sublevel">市场指标</div>
      <afterMarketIndicator :isEdit="true"></afterMarketIndicator>
    </div>
    <div>
      <div class="content-title-sublevel">物料指标</div>
      <afterMaterialIndicator :isEdit="true"></afterMaterialIndicator>
    </div>
    <div>
      <div class="content-title-sublevel">专利</div>
      <afterPatent :isEdit="true"></afterPatent>
    </div>
  </div>
</template>

<script setup>
import afterTechnical from '@/views/target/components/afterTechnical.vue'; // 技术指标
import afterQuality from '@/views/target/components/afterQuality.vue'; // 质量指标
import afterCost from '@/views/target/components/afterCost.vue'; // 成本指标
import afterMarketIndicator from '@/views/target/components/afterMarketIndicator.vue'; // 市场指标
import afterMaterialIndicator from '@/views/target/components/afterMaterialIndicator.vue'; // 物料指标
import afterPatent from '@/views/target/components//afterPatent.vue'; // 专利指标
import {
  targetColunms,
  qualityColunms,
  durationColunms,
  interiorColunms,
  externalColunms,
  failureColunms,
  lostCostColunms,
  indicatorColunms,
  marketColunms,
  materialColunms,
  patentColunms,
} from './tableColunms';
const Data = reactive({
  targetColunms: targetColunms,
  qualityColunms: qualityColunms,
  durationColunms: durationColunms,
  interiorColunms: interiorColunms,
  externalColunms: externalColunms,
  failureColunms: failureColunms,
  lostCostColunms: lostCostColunms,
  indicatorColunms: indicatorColunms,
  marketColunms: marketColunms,
  materialColunms: materialColunms,
  patentColunms: patentColunms,
  targetTableData: [],
});
</script>

<style lang="less" scoped>
.target-content {
  .content-title {
    font-size: 16px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    color: #333333;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .content-title-sublevel {
    font-size: 14px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    color: #333333;
    margin-bottom: 10px;
    margin-top: 15px;
  }
}
</style>
