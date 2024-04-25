<template>
  <div class="create_evaluate" v-loading="Data.loading">
    <el-affix position="top" :offset="100">
      <div class="top_area">
        <div class="tab_box">
          <el-tabs v-model="Data.tabValue" @tab-click="handleTabClick">
            <el-tab-pane :label="$intl('Basic information').d('基本信息')" name="base_info"></el-tab-pane>
            <el-tab-pane :label="$intl('Milestone plan').d('里程碑计划')" name="milestone_plan"></el-tab-pane>
            <el-tab-pane
              :label="$intl('Product configuration').d('产品配置')"
              name="product_configuration"
              v-if="Data.processType === '转阶段' && Data.tableListLength.length > 0"
            ></el-tab-pane>
            <el-tab-pane :label="$intl('Project progress').d('项目进度')" name="progress" v-if="Data.processType === '转阶段'"></el-tab-pane>
            <el-tab-pane :label="$intl('Target').d('目标/指标')" name="target" v-if="Data.processType === '转阶段'"></el-tab-pane>
            <el-tab-pane :label="$intl('Self checker').d('自检人设置')" name="self_checker"></el-tab-pane>
            <el-tab-pane :label="$intl('Attachment').d('附件')" name="attachment"></el-tab-pane>
            <el-tab-pane :label="$intl('Workflow setting').d('流程设置')" name="workflow_setting"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-affix>
    <div class="bot_area">
      <div class="depart" id="base_info">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.baseInfoVisable = !Data.fold.baseInfoVisable">{{ Data.fold.baseInfoVisable ? '-' : '+' }}</span>
          <span class="title">基础信息</span>
        </div>
        <div class="base-content" v-show="Data.fold.baseInfoVisable">
          <baseInfoForm
            :isEdit="false"
            ref="baseInfoRef"
            :parmasObj="Data.baseParmasObj"
            @baseInform="handleBaseInform"
            @processType="handleProcessType"
            @reviewPoint="handleReviewPoint"
            @reviewType="handlerReviewType"
            @order="handleOrderNumber"
          ></baseInfoForm>
        </div>
      </div>
      <div class="depart" id="milestone_plan">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.milestoneVisable = !Data.fold.milestoneVisable">{{ Data.fold.milestoneVisable ? '-' : '+' }}</span>
          <span class="title">里程碑计划</span>
        </div>
        <div class="milestone-content" v-show="Data.fold.milestoneVisable">
          <steps :stepList="Data.stepList" :active="Data.active"></steps>
        </div>
      </div>
      <div class="depart" id="product_configuration" v-show="Data.processType === '转阶段' && Data.tableListLength.length > 0">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.productVisable = !Data.fold.productVisable">{{ Data.fold.productVisable ? '-' : '+' }}</span>
          <span class="title">产品配置</span>
        </div>
        <div class="product-content" v-show="Data.fold.productVisable">
          <productConfigComponent ref="product" v-model:tableList="tableList"></productConfigComponent>
        </div>
      </div>
      <div class="depart" id="progress" v-if="Data.processType === '转阶段'">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.progressVisable = !Data.fold.progressVisable">{{ Data.fold.progressVisable ? '-' : '+' }}</span>
          <span class="title">项目进度</span>
        </div>
        <div class="progress-content" v-show="Data.fold.progressVisable">
          <newPiTable
            :columns="Data.progessColunms"
            :data="Data.progessTableData"
            :selectable="false"
            rowKey="oid"
            :pagination="false"
            :border="true"
            :isShowSetting="false"
            :tableLoad="Data.gressRableLoad"
            height="600"
            stripe
          >
            <template #projectNodeDisplay="scope">
              <span class="project-node">{{ scope.row.projectNodeDisplay }}</span>
            </template>
            <template #description="scope">
              <el-input v-model="scope.row.description" placeholder="请输入">{{ scope.row.description }}</el-input>
            </template>
          </newPiTable>
        </div>
      </div>
      <div class="depart" id="target" v-show="Data.processType === '转阶段'">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.targetVisable = !Data.fold.targetVisable">{{ Data.fold.targetVisable ? '-' : '+' }}</span>
          <span class="title">目标/指标</span>
        </div>
        <div class="target-content" v-show="Data.fold.targetVisable">
          <div class="content-title">
            <span class="hand_icon" @click="Data.fold.technicalVisable = !Data.fold.technicalVisable">{{ Data.fold.technicalVisable ? '-' : '+' }}</span>
            <span class="title">技术指标（性能门）</span>
          </div>
          <div class="product-content" v-show="Data.fold.technicalVisable">
            <afterTechnical :isEdit="Data.isEdit" :reviewPoint="Data.reviewPoint" ref="technical" :WBSVerify="Data.WBSVerify"></afterTechnical>
          </div>
          <div class="content-title">
            <span class="hand_icon" @click="Data.fold.qualityVisable = !Data.fold.qualityVisable">{{ Data.fold.qualityVisable ? '-' : '+' }}</span>
            <span class="title">质量指标（质量门）</span>
          </div>
          <div class="product-content" v-show="Data.fold.qualityVisable">
            <afterSetNumber :isEdit="true" :orderOid="Data.orderOid" :reviewPoint="Data.reviewPoint" ref="quality" :WBSVerify="Data.WBSVerify"></afterSetNumber>
            <afterDuration :isEdit="true" :orderOid="Data.orderOid" :reviewPoint="Data.reviewPoint" ref="duration" :WBSVerify="Data.WBSVerify"></afterDuration>
            <afterInterior :isEdit="true" :orderOid="Data.orderOid" :reviewPoint="Data.reviewPoint" ref="interior" :WBSVerify="Data.WBSVerify"></afterInterior>
            <afterExternal :isEdit="true" :orderOid="Data.orderOid" :reviewPoint="Data.reviewPoint" ref="external" :WBSVerify="Data.WBSVerify"></afterExternal>
            <afterMalfunction :isEdit="true" :orderOid="Data.orderOid" :reviewPoint="Data.reviewPoint" ref="malfunction" :WBSVerify="Data.WBSVerify"></afterMalfunction>
            <afterLossCost :isEdit="true" :orderOid="Data.orderOid" :reviewPoint="Data.reviewPoint" ref="lossCost" :WBSVerify="Data.WBSVerify"></afterLossCost>
          </div>
          <div class="content-title">
            <span class="hand_icon" @click="Data.fold.costVisable = !Data.fold.costVisable">{{ Data.fold.costVisable ? '-' : '+' }}</span>
            <span class="title">成本指标（成本门）</span>
          </div>
          <div class="product-content" v-show="Data.fold.costVisable">
            <afterCost :isEdit="true" ref="cost" :reviewPoint="Data.reviewPoint" :WBSVerify="Data.WBSVerify"></afterCost>
          </div>
          <div class="content-title">
            <span class="hand_icon" @click="Data.fold.marketVisable = !Data.fold.marketVisable">{{ Data.fold.marketVisable ? '-' : '+' }}</span>
            <span class="title">市场指标</span>
          </div>
          <div class="product-content" v-show="Data.fold.marketVisable">
            <afterMarketIndicator :isEdit="true" ref="market" :reviewPoint="Data.reviewPoint" :WBSVerify="Data.WBSVerify"></afterMarketIndicator>
          </div>
          <div class="content-title">
            <span class="hand_icon" @click="Data.fold.materialVisable = !Data.fold.materialVisable">{{ Data.fold.materialVisable ? '-' : '+' }}</span>
            <span class="title">物料指标</span>
          </div>
          <div class="product-content" v-show="Data.fold.materialVisable">
            <afterMaterialIndicator :isEdit="true" ref="material" :reviewPoint="Data.reviewPoint" :WBSVerify="Data.WBSVerify"></afterMaterialIndicator>
          </div>
          <div class="content-title">
            <span class="hand_icon" @click="Data.fold.patentVisable = !Data.fold.patentVisable">{{ Data.fold.patentVisable ? '-' : '+' }}</span>
            <span class="title">专利指标</span>
          </div>
          <div class="product-content" v-show="Data.fold.patentVisable">
            <afterPatent :isEdit="true" ref="patent" :reviewPoint="Data.reviewPoint" :WBSVerify="Data.WBSVerify"></afterPatent>
          </div>
        </div>
      </div>
      <div class="depart" id="self_checker">
        <div class="self-checker-setting">
          <span class="hand_icon" @click="Data.fold.selfCheckerVisable = !Data.fold.selfCheckerVisable">{{ Data.fold.selfCheckerVisable ? '-' : '+' }}</span>
          <span class="title">自检人设置</span>
          <div>
            <el-button @click="handleSetSummary" v-if="router.name === 'examineReview'">交付物汇总</el-button>
          </div>
        </div>
        <div class="formBox" v-show="Data.fold.selfCheckerVisable">
          <div class="btnMake">
            <el-button @click="handleTailor" type="primary">裁剪自检要素</el-button>
            <el-button @click="handleRevocation">撤销裁剪</el-button>
            <el-button @click="handleselfCheckerData">刷新</el-button>
          </div>
          <div class="self_checker-content">
            <newPiTable
              :columns="Data.selfCheckerColunms"
              :data="Data.selfCheckerTableData"
              :selectable="true"
              rowKey="oid"
              :pagination="false"
              :border="true"
              :isShowSetting="false"
              :tableLoad="Data.tableLoad"
              @selectionChange="selectionChange"
            >
              <template #deliverableDec="scope">
                <span :class="scope.row.strikethrough ? 'strikethrough' : ''">{{ scope.row.deliverableDec }}</span>
              </template>
            </newPiTable>
          </div>
        </div>
      </div>
      <div class="depart" id="attachment">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.attachmentVisable = !Data.fold.attachmentVisable">{{ Data.fold.attachmentVisable ? '-' : '+' }}</span>
          <span class="title">附件</span>
        </div>
        <div class="formBox" v-show="Data.fold.attachmentVisable">
          <div class="btnMake">
            <el-button type="primary" @click="uploadFlie">
              <i class="iconfont icon-shangchuan" style="margin-right: 5px"></i>
              上传
            </el-button>
            <el-button @click="handleRemoveFile">移除</el-button>
          </div>
          <div class="self_checker-content">
            <newPiTable
              :columns="Data.uploadColunms"
              :data="Data.uploadTableData"
              :selectable="true"
              rowKey="oid"
              :pagination="false"
              :border="true"
              :isShowSetting="false"
              :isDeep="true"
              @selectionChange="fileSelectionChange"
            >
              <template #name="scope">
                <el-row :gutter="20">
                  <el-col :span="22">
                    <el-link type="primary" :underline="true">
                      {{ scope.row.name }}
                    </el-link>
                  </el-col>
                  <el-col :span="2">
                    <el-icon style="margin-left: 0px; top: 5px; color: #999999; cursor: pointer" v-if="scope.row.isAddFlag">
                      <svg><use xlink:href="#icon-yanjing"></use></svg>
                    </el-icon>
                  </el-col>
                </el-row>
              </template>
            </newPiTable>
          </div>
        </div>
      </div>
      <div class="depart" id="meet-minutes" v-if="Data.fold.meetVisable">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.meetVisable = !Data.fold.meetVisable">{{ Data.fold.meetVisable ? '-' : '+' }}</span>
          <span class="title">会议纪要</span>
        </div>
        <div class="meet-content" v-show="Data.fold.meetVisable">
          <el-form :model="Data.meetForm" label-width="130px" :rules="Data.rules">
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="会议纪要编号:">
                  <el-input v-model="Data.meetForm.meetCode" :disabled="true" placeholder="自动获取默认值" />
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item label="线下会议评审时间:">
                  <el-date-picker v-model="Data.meetForm.meetDate" type="date" placeholder="" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="depart" id="workflow_setting">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.workflowVisable = !Data.fold.workflowVisable">{{ Data.fold.workflowVisable ? '-' : '+' }}</span>
          <span class="title">流程设置</span>
        </div>
        <div class="workflow-content" v-show="Data.fold.workflowVisable">
          <workflowForm
            :parmasObj="Data.parmasObj"
            :userObj="Data.userObj"
            v-model:selectUserData="Data.selectUserData"
            v-model:stepArr="Data.stepArr"
            ref="flow"
            :reviewPointFlag="Data.reviewPointFlag"
          ></workflowForm>
        </div>
      </div>
    </div>
    <!-- 附件上传 -->
    <upload-dialog v-model:isShow="Data.importShow" :isSingle="false" title="上传交付物" @submit="submitImport"></upload-dialog>
    <!-- 交付物汇总 -->
    <el-dialog v-model="Data.deliverablesVisable" title="交付物汇总" width="60%">
      <NewPiTable
        :columns="Data.deliverableColunms"
        :data="Data.deliverableTableData"
        :selectable="false"
        rowKey="oid"
        :pagination="false"
        :border="true"
        :tableLoad="Data.deliveraTableLoad"
      ></NewPiTable>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="Data.deliverablesVisable = false">取消</el-button>
          <el-button type="primary" @click="Data.deliverablesVisable = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-affix position="bottom" :offset="20" v-if="Data.isShowModule">
      <el-button @click="handleSave('保存')">保存</el-button>
      <el-button type="primary" @click="handleSave('提交')">提交</el-button>
    </el-affix>
  </div>
</template>

<script setup>
import baseInfoForm from './components/baseInfoForm.vue';
import productConfigComponent from './components/productConfigComponent.vue'; // 产品配置
import workflowForm from './components/workflowForm.vue'; // 流程设置
import afterTechnical from '@/views/target/components/afterTechnical.vue'; // 技术指标
import afterSetNumber from '@/views/target/components/afterSetNumber.vue'; // 验证台数
import afterDuration from '@/views/target/components/afterDuration.vue'; // 验证时长
import afterInterior from '@/views/target/components/afterInterior.vue'; // 内部问题关闭率
import afterExternal from '@/views/target/components/afterExternal.vue'; // 外部问题关闭率
import afterMalfunction from '@/views/target/components/afterMalfunction.vue'; // 1年内故障率
import afterLossCost from '@/views/target/components/afterLossCost.vue'; // 损失质量成本
import afterCost from '@/views/target/components/afterCost.vue'; // 成本指标
import afterMarketIndicator from '@/views/target/components/afterMarketIndicator.vue'; // 市场指标
import afterMaterialIndicator from '@/views/target/components/afterMaterialIndicator.vue'; // 物料指标
import afterPatent from '@/views/target/components//afterPatent.vue'; // 专利指标
import { selfCheckerColunms, uploadColunms, deliverableColunms } from './components/tableColunms';
import { getProjectMileStonePlan } from '@/api/project';
import { useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const baseInfoRef = ref();
const technical = ref();
const quality = ref();
const duration = ref();
const interior = ref();
const external = ref();
const malfunction = ref();
const lossCost = ref();
const market = ref();
const material = ref();
const cost = ref();
const patent = ref();
const flow = ref();
const product = ref();
const api = window.$api;
const tableList = ref([]);
const Data = reactive({
  selectTableData: [],
  fileSelectData: [],
  selectUserData: [],
  gressRableLoad: false,
  deliveraTableLoad: false,
  loading: false,
  importShow: false,
  // tab数据
  tabValue: 'base_info',
  active: 3,
  // 里程碑计划
  stepList: [],
  // 产品配置
  productList: [],
  // 项目进度
  progessColunms: [
    {
      width: 55,
      title: '序号',
      dataIndex: 'serialNum',
    },
    {
      title: '项目节点',
      width: 200,
      dataIndex: 'projectNodeDisplay',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
  ],
  progessTableData: [],
  deliverableColunms: deliverableColunms,
  deliverableTableData: [],
  // 自检人设置
  selfCheckerColunms: selfCheckerColunms,
  selfCheckerTableData: [],
  factorVisable: false,
  direction: 'rtl',
  activeName: 'first',
  uploadColunms: uploadColunms,
  uploadTableData: [],
  // 会议纪要
  meetForm: {
    meetCode: '',
    meetDate: '',
  },
  deliverablesVisable: false,
  // 折叠效果
  fold: {
    baseInfoVisable: true, // 基本信息
    milestoneVisable: true, // 里程碑计划
    productVisable: true, // 产品配置
    progressVisable: true, // 项目进度
    targetVisable: true, // 目标/指标
    selfCheckerVisable: false, // 自检人设置
    feedbackVisable: true, // 故障反馈
    attachmentVisable: false, // 附件
    meetVisable: false, // 会议纪要
    workflowVisable: true, // 流程设置
    technicalVisable: true, // 技术指标(性能门)
    qualityVisable: true, // 质量
    costVisable: false, // 成本
    marketVisable: false, // 市场
    materialVisable: false, // 物料
    patentVisable: false, // 专利
  },
  baseData: '',
  oid: route.query.projectOid ? JSON.parse(sessionStorage.getItem('taskProject'))?.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  tableLoad: false,
  processType: '转阶段',
  reviewPoint: '',
  reviewType: '',
  userObj: {
    oid: route.query.projectOid ? JSON.parse(sessionStorage.getItem('taskProject'))?.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
    reviewPoint: '转阶段-详细设计转样机',
  },
  parmasObj: {
    reviewPoint: '',
  },
  count: 0,
  updateOid: '',
  fileList: [],
  stepArr: [],
  acceptancePhaseList: [],
  baseParmasObj: {
    oid: '',
    reviewConfKey: '',
    reviewType: '',
    reviewPoint: '',
  },
  orderOid: '', // 订货号
  isEdit: true,
  rolesList: JSON.parse(window.$Cookies.get('userInfo')).roles,
  isShowModule: true,
  WBSVerify: '',
  targetIndicatorInfo: [],
  tableListLength: '',
  reviewPointFlag: false,
});
watch(
  () => tableList,
  (val) => {
    Data.tableListLength = val.value;
  },
  {
    deep: true,
    immediate: true,
  },
);
// 里程碑计划
const getStepData = () => {
  getProjectMileStonePlan({ oid: Data.oid }).then((res) => {
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
  });
};
// 项目进度
const handleProgressData = () => {
  Data.gressRableLoad = true;
  api.reviewApi.getProjectSchedule({ oid: Data.oid }).then((res) => {
    if (res.success) {
      Data.progessTableData = res.data;
      Data.gressRableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.gressRableLoad = false;
    }
  });
};
// 裁剪自检要素
const handleTailor = () => {
  if (Data.selectTableData.length === 0) return window.$message.warning('请选择需要裁剪的数据');
  let canCut = '';
  Data.selectTableData.map((item) => {
    item.canCut === '否' ? (canCut = false) : (canCut = true);
  });
  if (!canCut) return window.$message.warning('当前选择的数据中有不能被裁剪的数据');
  Data.selectTableData.map((item) => {
    item.canCut === '是' ? (item.strikethrough = true) : '';
    item.cuted = item.strikethrough;
  });
  window.$message.success('裁剪成功');
};
// 撤销裁剪
const handleRevocation = () => {
  if (Data.selectTableData.length === 0) return window.$message.warning('请选择需要撤销裁剪的数据');
  Data.selectTableData.map((item) => {
    item.strikethrough ? (item.strikethrough = false) : '';
    item.cuted = item.strikethrough;
  });
  window.$message.success('撤销成功');
};
// 上传交付物
const uploadFlie = () => {
  Data.importShow = true;
};
const submitImport = (fileList) => {
  Data.fileList = fileList;
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  month = month + 1;
  let date = now.getDate();
  let nowDate = year + '-' + month + '-' + date;
  fileList.map((item, index) => {
    Data.uploadTableData.push({
      name: item.name,
      size: item.size + 'KB',
      creator: JSON.parse(window.$Cookies.get('userInfo')).realName,
      updateTime: nowDate,
      index: index,
      oid: index,
      isAddFlag: false,
    });
  });
  window.$message.success('上传成功');
  Data.importShow = false;
};
// 上传-移除
const handleRemoveFile = () => {
  if (Data.fileSelectData.length === 0) return window.$message.warning('请选择需要移除的数据');
  const selectedIds = Data.fileSelectData.map((row) => row.index);
  Data.uploadTableData = Data.uploadTableData.filter((row) => !selectedIds.includes(row.index));
  window.$message.success('删除成功');
};
// 交付物汇总按钮
const handleSetSummary = () => {
  Data.deliverablesVisable = true;
  Data.deliveraTableLoad = true;
  api.reviewApi.getReviewElementDeliverable({ oid: Data.oid }).then((res) => {
    if (res.success) {
      Data.deliverableTableData = res.data;
      Data.deliveraTableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.deliveraTableLoad = false;
    }
  });
};
const handleBaseInform = (data) => {
  Data.baseData = data;
};
// 流程类型
const handleProcessType = (data) => {
  Data.processType = data;
  getStepData();
};
// 技术评审点
const handleReviewPoint = (data) => {
  Data.reviewPointFlag = true;
  Data.targetIndicatorInfo = [];
  Data.reviewPoint = data;
  Data.parmasObj.reviewPoint = Data.processType + '-' + data;
  Data.userObj.reviewPoint = Data.processType + '-' + data;
  let params = {
    oid: Data.oid,
    reviewPoint: Data.processType + '-' + data,
  };
  // 校验WBS
  api.reviewApi.checkPlanAndWbsData(params).then((res) => {
    if (res.success) {
      Data.isShowModule = true;
      Data.WBSVerify = true;
      let technicalData = JSON.parse(sessionStorage.getItem('flowTechnicalData')); // 技术指标
      let costData = JSON.parse(sessionStorage.getItem('costData')); // 成本指标
      let marketData = JSON.parse(sessionStorage.getItem('marketData')); // 市场指标
      let materialData = JSON.parse(sessionStorage.getItem('materialData')); // 物料指标
      let patentData = JSON.parse(sessionStorage.getItem('patentData')); // 专利指标
      let setNumberData = JSON.parse(sessionStorage.getItem('setNumberData')); // 验证台数
      // let setNumberData = JSON.parse(sessionStorage.getItem('setNumberData')); // 验证市时长
      let interiorData = JSON.parse(sessionStorage.getItem('interiorData')); // 内部问题关闭率
      let externalData = JSON.parse(sessionStorage.getItem('externalData')); // 外部问题关闭率
      let malfunctionData = JSON.parse(sessionStorage.getItem('malfunctionData')); // 一年内故障率
      let lossCostData = JSON.parse(sessionStorage.getItem('lossCostData')); // 损失质量成本
      Data.targetIndicatorInfo.push(technicalData, costData, marketData, materialData, patentData, setNumberData, interiorData, externalData, malfunctionData, lossCostData);
      Data.targetIndicatorInfo = Data.targetIndicatorInfo.filter((item) => item !== '');
      handleselfCheckerData();
    } else {
      Data.WBSVerify = false;
      Data.isShowModule = false;
      window.$message.error(res.message);
    }
  });
  getStepData();
};
// 评审类型
const handlerReviewType = (data) => {
  Data.reviewType = data;
  let parmasObj = {
    oid: Data.oid,
    reviewConfKey: 'piproject',
    reviewType: data,
    reviewPoint: baseInfoRef.value.Data.basicForm.processType + '-' + baseInfoRef.value.Data.basicForm.reviewPoint,
  };
  baseInfoRef.value.Data.basicForm.reviewPoint === '' ? window.$message.warning('请选择技术评审点') : flow.value.getUserInfoData(parmasObj);
  Data.fold.meetVisable = false;
};
// 查询自检人设置列表
const handleselfCheckerData = () => {
  Data.tableLoad = true;
  let params = {
    oid: Data.oid,
    reviewPoint: Data.processType + '-' + Data.reviewPoint,
    reviewConfKey: 'piproject',
  };
  api.reviewApi.getSdlgReviewElements(params).then((res) => {
    if (res.success) {
      Data.selfCheckerTableData = res.data.data.reviewElements;
      Data.tableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
  Data.userObj.targetIndicatorInfo = JSON.stringify(Data.targetIndicatorInfo);
  let parmasObj = {
    oid: Data.oid,
    reviewConfKey: 'piproject',
    reviewType: baseInfoRef.value.Data.basicForm.reviewType,
    reviewPoint: baseInfoRef.value.Data.basicForm.processType + '-' + baseInfoRef.value.Data.basicForm.reviewPoint,
  };
  flow.value.getUserInfoData(parmasObj);
};
// 订货号
const handleOrderNumber = (val) => {
  Data.orderOid = val.join(',');
};
// 保存/提交
const handleSave = (saveData) => {
  Data.loading = true;
  let str = JSON.stringify(baseInfoRef.value.Data.basicForm);
  let obj = JSON.parse(str);
  let paramsData = new FormData();
  obj.reviewPoint = Data.processType + '-' + Data.reviewPoint;
  if (saveData === '保存') {
    Data.count++;
    obj.startprocess = false;
    obj.oid = Data.count === 1 ? Data.oid : Data.updateOid;
  } else if (saveData === '提交') {
    obj.startprocess = true;
    obj.oid = Data.count === 0 ? Data.oid : Data.updateOid;
  }
  // 附件上传
  if (Data.uploadTableData.length > 0) {
    Data.fileList.forEach((item) => {
      paramsData.append('file', item.raw);
    });
  }
  if (obj.processType === '转阶段') {
    paramsData.append('attributes', JSON.stringify(obj)); // 基本信息
    paramsData.append('projectSchedule', JSON.stringify(Data.progessTableData)); // 项目进度
    paramsData.append('elements', JSON.stringify(Data.selfCheckerTableData)); // 自检信息
    paramsData.append('processUsers', JSON.stringify(Data.selectUserData)); // 工作流用户选人
    paramsData.append('attachments', JSON.stringify(Data.uploadTableData)); // 附件
    paramsData.append('technical_index', JSON.stringify(technical.value.Data.tableData)); // 技术指标
    paramsData.append('number_of_verification', JSON.stringify(quality.value.Data.setNumberData)); // 验证台数
    paramsData.append('duration_of_verification', JSON.stringify(duration.value.Data.setNumberData)); // 验证时长
    paramsData.append('external_question', JSON.stringify(external.value.Data.setNumberData)); // 外部问题
    paramsData.append('domestic_question', JSON.stringify(interior.value.Data.setNumberData)); // 内部问题
    paramsData.append('failure_rate', JSON.stringify(malfunction.value.Data.setNumberData)); // 1年内故障率
    paramsData.append('quality_loss_cost', JSON.stringify(lossCost.value.Data.setNumberData)); // 质量损失成本
    paramsData.append('cost_index', JSON.stringify(cost.value.Data.tableData)); // 成本指标
    paramsData.append('market_index', JSON.stringify(market.value.Data.tableData)); // 市场指标
    paramsData.append('parts_index', JSON.stringify(material.value.Data.tableData)); // 物料指标
    paramsData.append('patent', JSON.stringify(patent.value.Data.tableData)); // 专利
    // 技术指标上传文件
    technical.value.Data.technicalFile.forEach((item) => {
      item.forEach((row) => {
        paramsData.append('file', row.raw);
      });
    });
    // 成本指标上传文件
    cost.value.Data.technicalFile.forEach((item) => {
      item.forEach((row) => {
        paramsData.append('file', row.raw);
      });
    });
    // 市场指标上传文件
    market.value.Data.technicalFile.forEach((item) => {
      item.forEach((row) => {
        paramsData.append('file', row.raw);
      });
    });
    // 专利上传文件
    patent.value.Data.technicalFile.forEach((item) => {
      item.forEach((row) => {
        paramsData.append('file', row.raw);
      });
    });
  } else {
    paramsData.append('attributes', JSON.stringify(obj)); // 基本信息
    paramsData.append('elements', JSON.stringify(Data.selfCheckerTableData)); // 自检信息
    paramsData.append('attachments', JSON.stringify(Data.uploadTableData)); // 附件
    paramsData.append('processUsers', JSON.stringify(Data.selectUserData)); // 工作流用户选人
  }
  api.reviewApi.sdlgSubmitReview(paramsData).then((res) => {
    if (res.success) {
      if (saveData === '保存') {
        window.$message.success('保存成功');
      } else {
        window.$message.success('创建成功');
        router.push({ name: 'projectReview' });
      }
      Data.loading = false;
      Data.updateOid = res.data;
    } else {
      window.$message.error(res.message);
      Data.loading = false;
      Data.count = 0;
    }
  });
};
/**tab切换 */
const handleTabClick = (tab) => {
  const id = tab.props.name;
  document.querySelector('#' + id).scrollIntoView({
    behavior: 'smooth',
  });
};
// 复选框选择
const selectionChange = (val) => {
  Data.selectTableData = val;
};
// 附件复选框
const fileSelectionChange = (val) => {
  Data.fileSelectData = val;
};
onMounted(() => {
  handleProgressData(); // 项目进度
});
</script>

<style lang="less" scoped>
.create_evaluate {
  .top_area {
    margin-bottom: 20px;
    padding: 16px 16px 0 16px;
    background: #fff;
    max-height: 147px;
    .tab_box {
      :deep(.el-tabs__header) {
        margin-bottom: 0px;
      }
    }
  }

  .bot_area {
    padding: 0 8px 0 16px;
    height: calc(100vh - 250px);
    overflow-y: scroll;
    margin-top: 20px;
    .depart {
      background: #fff;
      margin-bottom: 20px;

      .title_box {
        display: flex;
        align-items: center;
        height: 40px;
        border-bottom: 1px solid #dddddd;
        padding: 0 16px;

        .hand_icon {
          width: 16px;
          height: 16px;
          display: flex;
          border: 1px solid #000;
          color: #333333;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-right: 10px;
          font-weight: 700;

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
          width: 16px;
          height: 16px;
          display: flex;
          border: 1px solid #000;
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
        .project-node {
          font-weight: 700;
          color: #000;
        }
      }
      .target-content {
        padding: 8px;
        .content-title {
          margin-bottom: 10px;
          margin-top: 10px;
          font-size: 16px;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: 500;
          color: #333333;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #dddddd;
          padding: 0 16px;
          .hand_icon {
            width: 16px;
            height: 16px;
            display: flex;
            border: 1px solid #000;
            color: #333333;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-right: 10px;
            font-weight: 700;

            &:hover {
              border: 1px solid #2664f6;
            }
          }
        }
        .content-title-sublevel {
          margin-bottom: 10px;
          margin-top: 10px;
          font-size: 16px;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: 500;
          color: #333333;
          margin-bottom: 10px;
          margin-top: 15px;
          img {
            width: 15px;
            height: 15px;
            vertical-align: middle;
            margin-right: 5px;
          }
        }
      }
      .self_checker-content {
        padding: 5px 15px 15px 15px;
        .strikethrough {
          text-decoration: line-through;
        }
      }
      .meet-content {
        padding: 15px;
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
          :deep(.el-icon) {
            // color: #fff !import;
          }
        }
      }
    }
  }

  .descriptionTime {
    font-size: 14px;
    // padding-left: 29px;
    padding-top: 5px;
    color: #999;
  }

  .descriptionTime1 {
    margin-top: 10px;
  }
  .drawerSelf {
    .el-drawer__header {
      margin-bottom: 5px;
    }
  }
  .table-upload {
    width: 98px;
    height: 32px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #dddddd;
    font-size: 14px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    color: #666666;
    :deep(.el-icon) {
      margin-right: 8px;
    }
  }
}
:deep(.el-affix) {
  width: 100% !important;
  height: 56px;
  line-height: 56px;
}
:deep(.el-affix--fixed) {
  z-index: 100;
  height: 56px;
  background: #ffffff;
  box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.2);
  border-radius: 1px;
  padding-right: 13px;
  text-align: right;
  bottom: 0 !important;
}
:deep(.el-input-number) {
  width: 80px;
  height: 32px;
  background: #ffffff;
  border-radius: 4px;
  border: 0px solid #d9d9d9;
  :deep(.el-input-number__increase) {
    width: 21px;
    height: 15px;
    box-shadow:
      inset 1px 0px 0px 0px #d9d9d9,
      inset 0px 0px 0px 0px #d9d9d9;
    border-radius: 0px 2px 0px 0px;
    border-left: 0;
  }
}
:deep(.el-input-number.is-controls-right .el-input-number__increase) {
  width: 21px;
  height: 15px;
  box-shadow:
    inset 1px 0px 0px 0px #d9d9d9,
    inset 0px 0px 0px 0px #d9d9d9;
  border-radius: 0px 2px 0px 0px;
  border-left: 0;
}
:deep(.el-input-number.is-controls-right .el-input-number__decrease) {
  width: 21px;
  height: 15px;
  box-shadow:
    inset 1px 0px 0px 0px #d9d9d9,
    inset 0px 0px 0px 0px #d9d9d9;
  border-radius: 0px 2px 0px 0px;
  border-left: 0;
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
