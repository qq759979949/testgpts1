<template>
  <div class="base_line_detail">
    <Anthor class="anthor_css" :offset="100" :target="'.info_box'" :tabList="Data.anthorList" :actived="Data.activedStr"></Anthor>
    <div class="info_box">
      <div class="depart" id="navigation" v-loading="Data.stepLoad">
        <div class="title">项目导航</div>
        <Steps :stepList="Data.stepList" :active="Data.active"></Steps>
      </div>
      <div class="depart" id="detail_info" v-loading="Data.detailLoad">
        <div class="title">详细信息</div>
        <ModuleDetail class="detail" :detailLayout="Data.formList" :column="4" infoTitle=""></ModuleDetail>
      </div>
      <div class="depart" id="team">
        <div class="title">团队</div>
        <projectTeam :isActionVisible="false"></projectTeam>
      </div>
      <div class="depart" id="plan">
        <div class="title">计划</div>
        <planTable :isBaseLineDetail="false"></planTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getProjectInfoLayout, getProjectMileStonePlan } from '@/api/project';
import projectTeam from '@/views/projectTeam/index.vue';
import planTable from '@/views/projectPlan/planTable.vue';
const Data = reactive({
  anthorList: [
    { label: '项目导航', id: 'navigation' },
    { label: '详细信息', id: 'detail_info' },
    { label: '团队', id: 'team' },
    { label: '计划', id: 'plan' },
  ],
  activedStr: 'navigation',

  /**导航 */
  stepLoad: false,
  stepList: [],
  active: 0,

  /**详细信息 */
  detailLoad: false,
  formList: [],
});

// const api = window.$api;

onMounted(() => {
  getStepData();
  getInfoData();
});
// 获取导航数据
const getStepData = () => {
  Data.stepLoad = true;
  getProjectMileStonePlan({ oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid }).then((res) => {
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

/**获取详细信息数据 */
const getInfoData = () => {
  Data.detailLoad = true;
  let obj = {
    serviceKey: 'com.pisx.pmgt.project.PIProject',
    oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  };
  getProjectInfoLayout(obj).then((res) => {
    if (res.success) {
      let datas = res.data.filter((v) => v.groupName === '基本属性' || v.groupName === '项目需求');
      datas.forEach((v) => {
        v.items.forEach((m) => Data.formList.push(m));
      });
    } else {
      window.$message.error(res.message);
    }
    Data.detailLoad = false;
  });
};
</script>

<style lang="less" scoped>
.base_line_detail {
  padding: 16px 0 16px 16px;
  background: #fff;
  height: calc(100vh - 116px);
  margin: 0 16px;
  .anthor_css {
    padding-right: 16px;
  }
  .info_box {
    display: block;
    height: calc(100vh - 200px);
    position: relative;
    overflow-y: auto;
    padding-right: 8px;
    .depart {
      margin-bottom: 40px;
      .title {
        font-size: 18px;
        font-family: 'PingFangSC, PingFang SC';
        font-weight: bold;
        color: #333333;
        margin-bottom: 8px;
      }
      :deep(.projectTeam) {
        padding: 0;
        margin: 0;
        .roleList {
          min-height: auto;
        }
      }
      :deep(.main-container) {
        padding: 0;
        margin: 0;
      }
    }
  }
}
:deep(.el-step__icon.is-icon) {
  max-width: 200px;
  width: auto;
}
:deep(.isLast) {
  .el-step__line {
    display: block;
  }
}
</style>
