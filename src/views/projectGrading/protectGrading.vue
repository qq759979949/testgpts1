<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-04 11:43:35
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-17 16:09:59
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectGrading\protectGrading.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="edit_grading" v-loading="Data.isLoading">
    <common-comp targrtGrading=".edit_grading" ref="completeProcess" @submitSuccess="submitSuccess" :tabList="Data.tabList">
      <template v-slot:routingList v-if="Data.isDetail !== 'true'">
        <div class="bottomConfirm">
          <process-radio @processSubmit="submit" :oid="Data.projectOid" :processOID="Data.processOid"></process-radio>
        </div>
      </template>
      <template v-slot:processAdvice v-if="Data.isDetail !== 'true'">
        <div class="bottomConfirm">
          <process-advice @processResolution="processResolution"></process-advice>
        </div>
      </template>
    </common-comp>
    <!-- <el-affix position="bottom" :offset="0">
      <div class="bottomConfirm"> -->
    <!-- <ProcessSubmit ref="processSubmit" @processSubmit="submit" :oid="Data.projectOid" :isGrade="true" :processOID="Data.processOid"></ProcessSubmit> -->
    <!-- </div> -->
    <!-- </el-affix> -->
  </div>
</template>

<script setup>
import commonComp from './module/commonComp.vue';
const route = useRoute();
const { proxy: that } = getCurrentInstance();
const Data = reactive({
  processOid: route.query.processOID,
  projectOid: route.query.workitemOID,
  isLoading: false,
  tabList: [
    {
      label: '里程碑计划',
      name: 'milestone_plan',
    },
    {
      label: '目标/指标',
      name: 'goals_indicators',
    },
    {
      label: '定级汇报材料',
      name: 'report_materials',
    },
    {
      label: '项目评价与主包金额',
      name: 'evaluation_main',
    },
    {
      label: '流程处理',
      name: 'process_dealt',
    },
  ],
  resolution: '',
  isDetail: route.query.isDetail,
});
const submit = (opera, submit) => {
  Data.isLoading = true;
  that.$refs.completeProcess.submitProtectGrad(opera, submit, Data.resolution);
};
const submitSuccess = () => {
  Data.isLoading = false;
};
const processResolution = (value) => {
  Data.resolution = value;
};
</script>

<style lang="less" scoped>
.edit_grading {
  // height: 100%;
  // padding: 16px;
  // background: #fff;
  .bottomConfirm {
    background: #fff;
  }
  :deep(.processSubmit .actionBox) {
    margin-top: 0px;
    padding-bottom: 0px;
  }
}
.main .scrollView {
  min-height: calc(100vh - 60px - 36px - 4px) !important;
  .routerView {
    min-height: calc(100vh - 60px - 36px - 4px) !important;
  }
}
</style>
