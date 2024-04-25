<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-12 08:57:13
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectChange\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="processDetail">
    <el-affix target=".processDetail" :offset="100">
      <!-- <div class="numContainer">
        <num-total></num-total>
      </div> -->
      <div class="top_area">
        <div class="depart">
          <div class="title_box">
            <span class="title title1">基本信息</span>
          </div>
          <section class="section-container">
            <el-form :model="Data.form" label-width="120px" label-position="right" :disabled="true">
              <el-form-item label="所属阶段：" :required="true">
                <el-select v-model="Data.form.valuePlan" class="m-2" placeholder="请选择" style="width: 240px">
                  <el-option v-for="item in Data.optionsPlan" :key="item.activityName" :label="item.activityName" :value="item.activityName" />
                </el-select>
              </el-form-item>
              <el-form-item label="变更类别：" :required="true">
                <el-checkbox-group v-model="Data.form.type" :disabled="true">
                  <el-checkbox label="项目属性变更" name="type" />
                  <el-checkbox label="进度变更" name="type" />
                  <el-checkbox label="目标/指标变更" name="type" />
                  <el-checkbox label="薪酬包成员变更" name="type" />
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="变更说明：">
                <el-input v-model="Data.form.description"></el-input>
              </el-form-item>
            </el-form>
          </section>
        </div>
        <div class="tab_box">
          <el-tabs v-model="Data.tabValue" @tab-click="handleTabClick">
            <el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) in Data.tabList" :key="index"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-affix>
    <div :class="route.name !== 'changeDetail' ? 'bottom_area' : 'bottom_area1'">
      <div class="second_area second_area1">
        <div class="depart" id="project_attribute">
          <div class="title_box">
            <span class="hand_icon" @click="expandFunc('arrow1')" v-if="Data.arrowList.arrow1">-</span>
            <span class="hand_icon" @click="expandFunc('arrow1')" v-else>+</span>
            <span class="title">项目属性</span>
          </div>
          <section class="section-container" v-show="Data.arrowList.arrow1">
            <attribute @changeInput="changeInput" :table-data="Data.tableList.attributeTableData" :oid="Data.parmasObj.oid"></attribute>
          </section>
        </div>
      </div>
      <div class="second_area">
        <div class="depart" id="milestone_plan">
          <div class="title_box">
            <span class="hand_icon" @click="expandFunc('arrow2')" v-if="Data.arrowList.arrow2">-</span>
            <span class="hand_icon" @click="expandFunc('arrow2')" v-else>+</span>
            <span class="title">里程碑计划</span>
          </div>
          <section class="section-container" v-show="Data.arrowList.arrow2">
            <milesstone-table @changeInput="changeInput" :table-data="Data.tableList.milessTableData" :oid="Data.parmasObj.oid"></milesstone-table>
          </section>
        </div>
      </div>
      <div class="second_area">
        <div class="depart" id="project_target">
          <div class="title_box">
            <span class="hand_icon" @click="expandFunc('arrow3')" v-if="Data.arrowList.arrow3">-</span>
            <span class="hand_icon" @click="expandFunc('arrow3')" v-else>+</span>
            <span class="title">目标/指标</span>
          </div>
          <section class="section-container" v-show="Data.arrowList.arrow3">
            <target-indicators
              :phaseList="Data.phaseList"
              :tableData="Data.tableList.targetTableData"
              ref="targetTable"
              :projectType="Data.projectType"
              :oid="Data.parmasObj.oid"
            ></target-indicators>
          </section>
        </div>
      </div>
      <div class="second_area">
        <div class="depart" id="main_member">
          <div class="title_box">
            <span class="hand_icon" @click="expandFunc('arrow4')" v-if="Data.arrowList.arrow4">-</span>
            <span class="hand_icon" @click="expandFunc('arrow4')" v-else>+</span>
            <span class="title">薪酬包</span>
          </div>
          <section class="section-container" v-show="Data.arrowList.arrow4">
            <div class="contentTitle">主包成员表格</div>
            <mainMemberTable :table-data="Data.tableList.mainTableData" :project-oid="Data.projectOid" :phase-list-main="Data.phaseList"></mainMemberTable>
            <div v-if="Data.projectType === '产品开发类项目'">
              <div class="contentTitle">配包成员表格</div>
              <minorMemberTable :table-data="Data.tableList.minorTableData" :project-oid="Data.projectOid" :phase-list-minor="Data.phaseList"></minorMemberTable>
            </div>
          </section>
        </div>
      </div>
      <!-- <div class="second_area">
        <div class="depart" id="minor_member">
          <div class="title_box">
            <span class="hand_icon" @click="expandFunc('arrow5')" v-if="Data.arrowList.arrow5">-</span>
            <span class="hand_icon" @click="expandFunc('arrow5')" v-else>+</span>
            <span class="title">配包成员表格</span>
          </div>
          <section class="section-container" v-show="Data.arrowList.arrow5">
            
          </section>
        </div>
      </div> -->
      <div class="second_area">
        <div class="depart" id="upload_file">
          <div class="title_box">
            <span class="hand_icon" @click="expandFunc('arrow6')" v-if="Data.arrowList.arrow6">-</span>
            <span class="hand_icon" @click="expandFunc('arrow6')" v-else>+</span>
            <span class="title">附件</span>
          </div>
          <section class="section-container" v-show="Data.arrowList.arrow6">
            <el-form-item label="定级汇报材料：" :required="false" style="width: 100%">
              <div v-for="(item, index) in Data.fileArray" :key="index" class="uploadFile">
                <el-link type="primary" @click="handlePreview(item)">{{ item.fileName }}</el-link>
              </div>
            </el-form-item>
          </section>
        </div>
      </div>
      <div class="second_area">
        <div class="depart" id="process_dealt">
          <div class="title_box">
            <span class="hand_icon" @click="expandFunc('arrow8')" v-if="Data.arrowList.arrow8">-</span>
            <span class="hand_icon" @click="expandFunc('arrow8')" v-else>+</span>
            <span class="title">流程处理</span>
          </div>
          <section class="section-container" v-show="Data.arrowList.arrow8">
            <process-record :oid="Data.processOid" :isDetail="route.name !== 'changeDetail' ? true : false"></process-record>
          </section>
        </div>
      </div>
    </div>
    <el-affix position="bottom" :offset="0" v-if="route.name !== 'changeDetail'">
      <div class="bottomConfirm">
        <el-button @click="cancel" class="bottomBtn">取消</el-button>
      </div>
    </el-affix>
  </div>
</template>

<script setup>
import attribute from './comp/attribute.vue';
import milesstoneTable from './comp/milesstoneTable.vue';
import mainMemberTable from './comp/mainMemberTable.vue';
import minorMemberTable from './comp/minorMemberTable.vue';
import targetIndicators from './comp/targetIndicators.vue';
// import numTotal from './comp/numTotal.vue';
import { useCommonHandler } from '@/hooks';
const route = useRoute();
const router = useRouter();
const Data = reactive({
  tabList: [
    {
      label: '项目属性',
      name: 'project_attribute',
    },
    {
      label: '里程碑计划',
      name: 'milestone_plan',
    },
    {
      label: '目标/指标',
      name: 'project_target',
    },
    {
      label: '薪酬包',
      name: 'main_member',
    },
    {
      label: '附件',
      name: 'upload_file',
    },
    // {
    //   label: '流程设置',
    //   name: 'process_setting',
    // },
    {
      label: '流程处理',
      name: 'process_dealt',
    },
  ],
  tabValue: 'project_attribute',
  arrowList: {
    arrow1: false,
    arrow2: false,
    arrow3: false,
    arrow4: false,
    arrow6: true,
    arrow7: true,
    arrow8: true,
  },
  form: {},
  fileList: [],
  parmasObj: {
    processTemplate: 'SDLG_ProjectModifyWF',
    oid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
  },
  processOid: route.query.processOid,
  selectUserData: [],
  fileArray: [],
  radioList: [],
  projectOid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
  projectType: JSON.parse(sessionStorage.getItem('currentProject')).type,
  tableList: {
    attributeTableData: [],
    milessTableData: [],
    mainTableData: [],
    minorTableData: [],
  }, // 返回的数据详情
  phaseList: [], // 阶段
});
// 锚点
const handleTabClick = (tab) => {
  const id = tab.props.name;
  document.querySelector('#' + id).scrollIntoView({
    behavior: 'smooth', // 定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"
  });
};
// 展开缩起
const expandFunc = (index) => {
  Data.arrowList[index] = !Data.arrowList[index];
};
// 更改内容(基本属性/里程碑计划)
const changeInput = (scope) => {
  scope.isChange = true;
};
// 查看附件
const handlePreview = (item) => {
  window.$api.fileApi.downloadContent({ oid: item.oid }).then((res) => {
    useCommonHandler.download(res, item.fileName);
  });
};
// 获取变更数据
const getChangeDetails = () => {
  window.$api.projectChangeApi.queryChangeRequestDetails({ oid: route.query.oid }).then((res) => {
    if (res.success) {
      Data.form.type = res.data.changeType.split(',');
      changeCheckBox(Data.form.type);
      Data.tableList.attributeTableData = !Data.form.type.includes('项目属性变更') ? [] : res.data.projectAttributeJson ? JSON.parse(res.data.projectAttributeJson) : [];
      Data.tableList.milessTableData = !Data.form.type.includes('进度变更') ? [] : res.data.scheduleChangeJson ? JSON.parse(res.data.scheduleChangeJson) : [];
      Data.tableList.mainTableData = !Data.form.type.includes('薪酬包成员变更') ? [] : res.data.primaryPackageJson ? JSON.parse(res.data.primaryPackageJson) : [];
      Data.tableList.minorTableData = !Data.form.type.includes('薪酬包成员变更') ? [] : res.data.secondaryPackageJson ? JSON.parse(res.data.secondaryPackageJson) : [];
      Data.tableList.targetTableData = !Data.form.type.includes('目标/指标变更') ? [] : res.data.targetAndIndexChangeJson ? JSON.parse(res.data.targetAndIndexChangeJson) : [];
      Data.form.valuePlan = res.data.stage ? res.data.stage : '';
      Data.form.description = res.data.description ? res.data.description : '';
      Data.fileArray = res.data.secondaryFileNames.map((item, index) => {
        const obj = {};
        obj.oid = res.data.secondaryFileOids[index];
        obj.fileName = item;
        return obj;
      });
      Data.secondaryFileOids = res.data.secondaryFileOids;
    } else {
      window.$message.error(res.message);
    }
  });
};
// 获取阶段
const getPhaseColumns = () => {
  window.$api.payPacketApi.getPhaseNames({ oid: Data.parmasObj.oid }).then((res) => {
    if (res.success) {
      Data.phaseList = res.data.map((item) => {
        const obj = {};
        obj.label = item.name;
        obj.dataIndex = item.label;
        return obj;
      });
    } else {
      window.$message.error(res.message);
    }
  });
};
// 默认展开与否
const changeCheckBox = (val) => {
  if (val.includes('项目属性变更')) {
    Data.arrowList.arrow1 = true;
  }
  if (val.includes('目标/指标变更')) {
    Data.arrowList.arrow3 = true;
  }
  if (val.includes('进度变更')) {
    Data.arrowList.arrow2 = true;
  }
  if (val.includes('薪酬包成员变更')) {
    Data.arrowList.arrow4 = true;
  }
};
// 返回
const cancel = () => {
  window.$navTagStore.removeTag(route, router);
  window.$navTagStore.removeCacheTag(route.name);
  router.push({ name: 'projectChange' });
};
onMounted(() => {
  getPhaseColumns();
  getChangeDetails();
});
</script>

<style scoped lang="less">
.processDetail {
  // padding: 16px;
  .numContainer {
    height: 110px;
    margin: 0 16px 16px 16px;
  }
  .top_area {
    margin: 0 16px;
    padding: 16px 0;
    background: hsl(0, 0%, 100%);
    max-height: 210px;
    .tab_box {
      padding: 0 16px;
    }
    :deep(.el-form-item) {
      margin-bottom: 0px;
    }
  }
  .depart {
    background: #fff;
    // margin-bottom: 10px;
    .title_box {
      display: flex;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #dddddd;
      // padding: 0 16px;
      .hand_icon {
        margin-left: 16px;
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
      }
      .title1 {
        margin-left: 16px;
      }
    }
    .section-container {
      padding: 10px 16px;
      .contentTitle {
        color: #333;
        font-size: 16px;
        margin: 10px 0;
      }
    }
    // :deep(.el-form-item) {
    //   margin-bottom: 0px;
    // }
    .uploadFile {
      margin-right: 20px;
    }
  }
  .second_area {
    margin-top: 20px;
    padding: 16px 0;
    background: hsl(0, 0%, 100%);
    .iconEdit {
      color: #f68800;
      margin-left: 5px;
      top: 5px;
    }
  }
  .second_area1 {
    margin-top: 0px;
  }
  .bottom_area {
    margin: 0 8px 0 16px;
    height: calc(100vh - 400px);
    overflow-y: scroll;
    margin-top: 20px;
  }
  .bottom_area1 {
    margin: 0 8px 0 16px;
    height: calc(100vh - 350px);
    overflow-y: scroll;
    margin-top: 20px;
  }
  .bottomConfirm {
    width: 100%;
    height: 56px;
    background: #fff;
    box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.2);
    border-radius: 1px;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    overflow-x: hidden;
    bottom: 0px;
    .bottomBtn {
      margin-top: 12px;
      margin-right: 30px;
    }
  }
}
</style>
