<template>
  <div class="PMOFirstTrail">
    <div class="upContent">
      <div class="title">【PMO复查】决策-立项评审</div>
      <div class="description">
        <FormLayout ref="form" labelWidth="120px" :formList="formList"></FormLayout>
      </div>
      <div class="menu">
        <affixTab :tabList="tabList" :actived="tabActived" :offset="142"></affixTab>
      </div>
    </div>
    <div class="divider"></div>
    <div class="downContent">
      <div class="title" id="pshyjy">评审会议纪要</div>
      <el-divider />
      <div class="meeting">
        <FormLayout ref="form" labelWidth="120px" :formList="formList"></FormLayout>
        <div class="secondTitle secondTitle1">
          <el-icon class="iconUp" v-if="isUpQ" @click="changeIsUp('question')"><CirclePlusFilled /></el-icon>
          <el-icon class="iconUp" v-else @click="changeIsUp('question')"><RemoveFilled /></el-icon>
          项目问题（0）
        </div>
        <div class="btnFucntion">
          <el-button type="primary" @click="createQuestionRisk('question')">创建问题</el-button>
          <el-button>编辑</el-button>
          <el-button>删除</el-button>
        </div>
        <PiTable v-if="isUpQ" :columns="colunms" :data="tableData" :selectable="true" rowKey="projectIssueOid" :pagination="false" :isShowSetting="false"></PiTable>
        <div class="secondTitle">
          <el-icon class="iconUp" v-if="isUpR" @click="changeIsUp('risk')"><CirclePlusFilled /></el-icon>
          <el-icon class="iconUp" v-else @click="changeIsUp('risk')"><RemoveFilled /></el-icon>
          项目风险（0）
        </div>
        <div class="btnFucntion">
          <el-button type="primary" @click="createQuestionRisk('risk')">创建风险</el-button>
          <el-button>编辑</el-button>
          <el-button>删除</el-button>
        </div>
        <PiTable v-if="isUpR" :columns="colunms" :data="tableData" :selectable="true" rowKey="projectIssueOid" :pagination="false" :isShowSetting="false"></PiTable>
      </div>
      <div class="title" id="jfw">交付物</div>
      <el-divider />
      <div class="deliver">
        <div class="btnFucntion">
          <el-button type="primary" @click="uploadFile">上传</el-button>
          <el-button>移除</el-button>
          <el-button>刷新</el-button>
        </div>
        <PiTable :columns="colunms" :data="tableData" :selectable="true" rowKey="projectIssueOid" :pagination="false" :isShowSetting="false"></PiTable>
      </div>
      <div class="title" id="zjb">自检表</div>
      <el-divider />
      <div class="selfTest">
        <PiTable :columns="colunms" :data="tableData" :selectable="false" rowKey="projectIssueOid" :pagination="false" :isShowSetting="false"></PiTable>
      </div>
      <div class="title" id="lccl">流程处理</div>
      <el-divider />
      <div class="processDeal">
        <ProcessRecord :oid="oid"></ProcessRecord>
        <ProcessSubmit :oid="oid" @submit="submit"></ProcessSubmit>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="上传交付物" width="60%" class="uploadFileName">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="从文件上传" name="first">
          <uploadFile></uploadFile>
        </el-tab-pane>
        <el-tab-pane label="从本地上传" name="second">
          <uploadLocal></uploadLocal>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-drawer v-model="drawer2" :direction="direction" class="drawerSelf">
      <template #header style="margin-bottom: 10px">
        <h4>项目{{ questionRisk }}</h4>
      </template>
      <template #default>
        <reviewQuestion :questionRisk="questionRisk"></reviewQuestion>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer2 = false">取消</el-button>
          <el-button type="primary" @click="drawer2 = false">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script>
import FormLayout from '@/components/formLayout/index.vue';
import ProcessRecord from '@/components/processRecord.vue';
import affixTab from '@/components/affixTab.vue';
import ProcessSubmit from '@/components/process/processSubmit.vue';
import PiTable from '@/components/pdcCustom/PiTable.vue';
import uploadFile from './components/uploadFile.vue';
import uploadLocal from './components/uploadLocal.vue';
import reviewQuestion from './components/reviewQuestion.vue';
export default {
  name: 'PMOFirstTrail',
  components: { ProcessRecord, FormLayout, affixTab, ProcessSubmit, PiTable, uploadFile, uploadLocal, reviewQuestion },
  data() {
    return {
      formList: [],
      isUpQ: true, // 项目问题收缩
      isUpR: true, // 项目风险收缩
      dialogVisible: false, // 上传交付物
      drawer2: false, // 项目问题、风险
      direction: 'rtl',
      questionRisk: '',
      activeName: 'first',
      tabList: [
        { label: '评审会议纪要', id: 'pshyjy' },
        { label: '交付物', id: 'jfw' },
        { label: '自检表', id: 'zjb' },
        { label: '流程处理', id: 'lccl' },
      ],
      tabActived: 'pshyjy',
      oid: 'OR:com.pisx.pmgt.risk.PIProjectRisk:339884',
      colunms: [
        {
          width: 140,
          title: '评审编号',
          dataIndex: 'issueNumber',
        },
        {
          title: '评审名称',
          width: 120,
          dataIndex: 'name',
        },
        {
          title: '评审点',
          dataIndex: 'issueType',
        },
        {
          title: '修改者',
          dataIndex: 'priorityType',
        },
        {
          title: '创建时间',
          dataIndex: 'description',
        },
        {
          title: '计划评审时间',
          dataIndex: 'responsibleUserReference',
        },
        {
          title: '评审完成时间',
          dataIndex: 'expectedSolutionDate',
        },
        {
          title: '状态',
          dataIndex: 'state',
        },
      ],
      tableData: [],
    };
  },
  methods: {
    submit() {},
    changeIsUp(type) {
      if (type === 'risk') {
        this.isUpR = !this.isUpR;
      } else {
        this.isUpQ = !this.isUpQ;
      }
    },
    // 上传交付物切换tab
    handleClick() {},
    uploadFile() {
      this.dialogVisible = true;
    },
    createQuestionRisk(type) {
      if (type === 'risk') {
        this.questionRisk = '风险';
      } else {
        this.questionRisk = '问题';
      }
      this.drawer2 = true;
    },
  },
};
</script>

<style scoped lang="scss">
.PMOFirstTrail {
  .upContent {
    .title {
      font-size: 16px;
      font-weight: 550;
    }
  }
  .divider {
    height: 20px;
    background: #f5f7fa;
    margin: 0 -16px;
  }
  .downContent {
    .title {
      font-size: 16px;
      padding-top: 10px;
    }
    .meeting {
      .btnFucntion {
        margin-bottom: 10px;
      }
    }
    .deliver {
      .btnFucntion {
        margin-bottom: 10px;
      }
    }
    .secondTitle {
      font-size: 16px;
      font-weight: 550;
      padding: 10px 0;
      .iconUp {
        cursor: pointer;
      }
    }
    .secondTitle1 {
      padding-top: 0px;
    }
  }
  :deep .el-tabs__header {
    margin: 0 !important;
  }
  :deep .el-divider--horizontal {
    margin: 0 0 10px 0 !important;
  }
}
</style>
<style lang="scss">
.uploadFileName {
  .el-dialog__body {
    padding: 5px var(--el-dialog-padding-primary);
  }
}
.drawerSelf {
  .el-drawer__header {
    margin-bottom: 0px;
    font-size: 18px;
    color: #000;
  }
}
</style>
