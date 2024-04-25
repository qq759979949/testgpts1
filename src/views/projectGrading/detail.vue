<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-04 11:43:35
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-01-08 11:31:00
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectGrading\protectGrading.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="grading_detail">
    <common-comp targrtGrading=".grading_detail" ref="completeProcess" :tabList="Data.tabList" :isDeatil="true"></common-comp>
    <!-- <el-affix position="bottom" :offset="0">
      <div class="bottomConfirm">
        <ProcessSubmit ref="processSubmit" @submit="submit" :radioList="Data.radioList" :oid="Data.projectOid" :isGrade="true"></ProcessSubmit>
      </div>
    </el-affix> -->
  </div>
</template>

<script setup>
import commonComp from './module/commonComp.vue';
const route = useRoute();
const { proxy: that } = getCurrentInstance();
const Data = reactive({
  // radioList: [
  //   {
  //     label: '通过',
  //     routing: '通过',
  //   },
  //   {
  //     label: '驳回',
  //     routing: '驳回',
  //   },
  // ],
  projectOid: route.query.oid,
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
      label: '流程处理',
      name: 'process_dealt',
    },
  ],
});
// const submit = (opera) => {
//   that.$refs.completeProcess.submitProtectGrad();
// };
</script>

<style lang="less" scoped>
.edit_grading {
  // height: 100%;
  // padding: 16px;
  // background: #fff;
  .bottomConfirm {
    width: 100%;
    height: 200px;
    background: #fff;
    box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.2);
    border-radius: 1px;
    position: absolute;
    bottom: 0px;
    .bottomBtn {
      margin-top: 12px;
      margin-right: 30px;
    }
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
