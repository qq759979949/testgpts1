<template>
  <div class="create_evaluate_examine" v-loading="Data.processLoading">
    <el-affix position="top" :offset="100">
      <div class="top_area">
        <div class="tab_box">
          <div>
            <div class="examine-title">
              <p>
                <span v-if="!Data.workItemName"><i class="iconfont icon-xingzhuang"></i></span>
                <span v-if="Data.workItemName !== '' && Data.workItemName">{{ '【' + Data.workItemName + '】' }}</span>
                <span>
                  <span>{{ Data.projectShortName + '-' + Data.projectName + '-' }}</span>
                  <span class="review-point">{{ Data.basicForm.projectInfromation + '评审' }}</span>
                </span>
                <el-link v-if="Data.workItemName === 'PMO审核'" type="primary" :underline="true" @click="handleEvaluate" style="margin-left: 20px">
                  {{ Data.basicForm.evaluatePhaseName }}
                </el-link>
              </p>
              <process-radio
                v-if="Data.goFlag === 'true' && Data.workCompletedDate === ''"
                ref="processSubmit"
                @processSubmit="submitFun"
                :oid="Data.workitemOID"
                :processOID="Data.processOID"
                :resolute="Data.resolution"
              ></process-radio>
            </div>
            <p class="base-title">
              <span class="hand_icon" @click="Data.fold.baseInfoVisable = !Data.fold.baseInfoVisable">
                {{ Data.fold.baseInfoVisable ? '-' : '+' }}
              </span>
              <span class="title">基本信息</span>
            </p>
            <baseInfoForm :isEdit="true" :editFlag="false" :examFlag="true" ref="baseInfoRef" @reviewType="handlerReviewType" v-show="Data.fold.baseInfoVisable"></baseInfoForm>
          </div>

          <el-tabs v-model="Data.tabValue" @tab-click="handleTabClick">
            <el-tab-pane :label="$intl('Milestone plan').d('里程碑计划')" name="milestone_plan"></el-tab-pane>
            <el-tab-pane
              :label="$intl('Product configuration').d('产品配置')"
              name="product_configuration"
              v-if="Data.processTypeAlive === '转阶段' && Data.tableListLength.length > 0"
            ></el-tab-pane>
            <el-tab-pane :label="$intl('Project progress').d('项目进度')" name="progress" v-if="Data.processTypeAlive === '转阶段'"></el-tab-pane>
            <el-tab-pane :label="$intl('Target').d('目标/指标')" name="target" v-if="Data.processTypeAlive === '转阶段'"></el-tab-pane>
            <el-tab-pane :label="$intl('Self checker').d('自检表')" name="self_checker"></el-tab-pane>
            <el-tab-pane :label="$intl('Attachment').d('附件')" name="attachment"></el-tab-pane>
            <el-tab-pane :label="$intl('Workflow setting').d('流程设置')" name="workflow_setting" v-if="Data.workItemName === '重新提交'"></el-tab-pane>
            <el-tab-pane :label="$intl('Meet minutes').d('会议记要')" name="meet-minutes" v-if="Data.reviewType === '会议评审'"></el-tab-pane>
            <el-tab-pane :label="$intl('Workflow dispose').d('流程处理')" name="workflow_dispose"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-affix>
    <div class="bot_area">
      <div class="depart" id="milestone_plan">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.milestoneVisable = !Data.fold.milestoneVisable">{{ Data.fold.milestoneVisable ? '-' : '+' }}</span>
          <span class="title">里程碑计划</span>
        </div>
        <div class="milestone-content" v-show="Data.fold.milestoneVisable">
          <steps :stepList="Data.stepList" :active="Data.active"></steps>
        </div>
      </div>
      <div class="depart" id="product_configuration" v-show="Data.processTypeAlive === '转阶段' && Data.tableListLength.length > 0">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.productVisable = !Data.fold.productVisable">{{ Data.fold.productVisable ? '-' : '+' }}</span>
          <span class="title">产品配置</span>
        </div>
        <div class="product-content" v-show="Data.fold.productVisable">
          <productConfigComponent v-model:tableList="tableList"></productConfigComponent>
        </div>
      </div>
      <div class="depart" id="progress" v-if="Data.processTypeAlive === '转阶段'">
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
              <el-input
                v-if="Data.workItemName === '重新提交' && Data.fromTabName !== '已完成流程' && Data.workCompletedDate === ''"
                v-model="scope.row.description"
                placeholder="请输入"
              >
                {{ scope.row.description }}
              </el-input>
              <span v-else>{{ scope.row.description }}</span>
            </template>
          </newPiTable>
        </div>
      </div>
      <div class="depart" id="target" v-if="Data.processTypeAlive === '转阶段'">
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
            <afterTechnical :isEdit="Data.workItemName === '自检' ? true : false" ref="technical" :reviewPoint="Data.reviewPoint"></afterTechnical>
          </div>
          <div class="content-title">
            <span class="hand_icon" @click="Data.fold.qualityVisable = !Data.fold.qualityVisable">{{ Data.fold.qualityVisable ? '-' : '+' }}</span>
            <span class="title">质量指标（质量门）</span>
          </div>
          <div class="product-content" v-show="Data.fold.qualityVisable">
            <afterSetNumber :isEdit="Data.workItemName === '自检' ? true : false" ref="quality" :orderOid="Data.orderOid" :reviewPoint="Data.reviewPoint"></afterSetNumber>
            <afterDuration :isEdit="Data.workItemName === '自检' ? true : false" :orderOid="Data.orderOid" ref="duration" :reviewPoint="Data.reviewPoint"></afterDuration>
            <afterInterior :isEdit="Data.workItemName === '自检' ? true : false" :orderOid="Data.orderOid" ref="interior" :reviewPoint="Data.reviewPoint"></afterInterior>
            <afterExternal :isEdit="Data.workItemName === '自检' ? true : false" :orderOid="Data.orderOid" ref="external" :reviewPoint="Data.reviewPoint"></afterExternal>
            <afterMalfunction :isEdit="Data.workItemName === '自检' ? true : false" :orderOid="Data.orderOid" ref="malfunction" :reviewPoint="Data.reviewPoint"></afterMalfunction>
            <afterLossCost :isEdit="Data.workItemName === '自检' ? true : false" :orderOid="Data.orderOid" ref="lossCost"></afterLossCost>
          </div>
          <div class="content-title">
            <span class="hand_icon" @click="Data.fold.costVisable = !Data.fold.costVisable">{{ Data.fold.costVisable ? '-' : '+' }}</span>
            <span class="title">成本指标（成本门）</span>
          </div>
          <div class="product-content" v-show="Data.fold.costVisable">
            <afterCost :isEdit="Data.workItemName === '自检' ? true : false" ref="cost" :reviewPoint="Data.reviewPoint"></afterCost>
          </div>
          <div class="content-title">
            <span class="hand_icon" @click="Data.fold.marketVisable = !Data.fold.marketVisable">{{ Data.fold.marketVisable ? '-' : '+' }}</span>
            <span class="title">市场指标</span>
          </div>
          <div class="product-content" v-show="Data.fold.marketVisable">
            <afterMarketIndicator :isEdit="false" ref="market" :reviewPoint="Data.reviewPoint"></afterMarketIndicator>
          </div>
          <div class="content-title">
            <span class="hand_icon" @click="Data.fold.materialVisable = !Data.fold.materialVisable">{{ Data.fold.materialVisable ? '-' : '+' }}</span>
            <span class="title">物料指标</span>
          </div>
          <div class="product-content" v-show="Data.fold.materialVisable">
            <afterMaterialIndicator :isEdit="Data.workItemName === '自检' ? true : false" ref="material" :reviewPoint="Data.reviewPoint"></afterMaterialIndicator>
          </div>
          <div class="content-title">
            <span class="hand_icon" @click="Data.fold.patentVisable = !Data.fold.patentVisable">{{ Data.fold.patentVisable ? '-' : '+' }}</span>
            <span class="title">专利指标</span>
          </div>
          <div class="product-content" v-show="Data.fold.patentVisable">
            <afterPatent :isEdit="Data.workItemName === '自检' ? true : false" ref="patent" :reviewPoint="Data.reviewPoint"></afterPatent>
          </div>
        </div>
      </div>
      <div class="depart" id="self_checker">
        <div class="self-checker-setting">
          <span class="hand_icon" @click="Data.fold.selfCheckerVisable = !Data.fold.selfCheckerVisable">{{ Data.fold.selfCheckerVisable ? '-' : '+' }}</span>
          <span class="title">自检表</span>
          <div v-if="Data.workItemName === 'PMO审核'">
            <el-button @click="handleSetSummary">交付物汇总</el-button>
          </div>
        </div>
        <div class="formBox" v-show="Data.fold.selfCheckerVisable">
          <div class="btnMake" v-if="(Data.workItemName === '重新提交' && Data.fromTabName === '代办流程') || Data.workCompletedDate === ''">
            <el-button @click="handleTailor" type="primary">裁剪自检要素</el-button>
            <el-button @click="handleRevocation">撤销裁剪</el-button>
          </div>
          <div class="self_checker-content">
            <newPiTable
              :columns="Data.selfCheckerColunms"
              :data="Data.selfCheckerTableData"
              :selectable="Data.workItemName === '重新提交' ? true : false"
              rowKey="oid"
              :pagination="false"
              :border="true"
              :isShowSetting="false"
              :tableLoad="Data.tableLoad"
              @selectionChange="selfSelectionChange"
            >
              <template #elementResult="scope">
                <el-select
                  v-model="scope.row.elementResult"
                  placeholder="请选择"
                  style="width: 100%"
                  v-if="scope.row.sameFlag && Data.workItemName === '自检' && Data.fromTabName === '代办流程'"
                >
                  <el-option key="通过" :label="'通过'" :value="'通过'" />
                  <el-option key="不通过" :label="'不通过'" :value="'不通过'" />
                </el-select>
                <span v-else>{{ scope.row.elementResult ? scope.row.elementResult : '-' }}</span>
              </template>
              <template #elementResultDesc="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.elementResultDesc"
                  v-if="scope.row.sameFlag && Data.workItemName === '自检' && Data.fromTabName === '代办流程'"
                  style="margin-top: 10px"
                ></el-input>
                <span v-else>{{ scope.row.elementResultDesc ? scope.row.elementResultDesc : '-' }}</span>
              </template>
              <template #fileBeanList="scope">
                <el-button
                  @click="uploadFlie(scope.row)"
                  v-if="scope.row.fileBeanList === '' && scope.row.sameFlag && Data.workItemName === '自检' && Data.fromTabName === '代办流程'"
                >
                  <i class="iconfont icon-shangchuan" style="margin-right: 5px"></i>
                  上传文件
                </el-button>
                <el-link
                  v-if="scope.row.fileBeanList !== '' && scope.row.fileBeanList"
                  type="primary"
                  :underline="true"
                  @click="Data.workItemName === '自检' && scope.row.selfCheck_CN === Data.userInfo ? uploadFlie(scope.row) : handleDown('自检表下载', scope.row)"
                >
                  <el-tooltip :content="scope.row.fileBeanList" placement="top">
                    <div class="columnTitle">
                      <span>{{ scope.row.fileBeanList }}</span>
                    </div>
                  </el-tooltip>
                </el-link>
                <span v-if="!scope.row.sameFlag && scope.row.fileBeanList === ''">-</span>
              </template>
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
          <div class="btnMake" v-if="Data.isShowFileBtn">
            <el-button type="primary" @click="attachmentUpload">
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
              :tableLoad="Data.uploadTableLoad"
              @selectionChange="fileSelectionChange"
            >
              <template #name="scope">
                <el-row :gutter="20">
                  <el-col :span="22">
                    <el-link type="primary" :underline="true" @click="handleDown(1, scope.row)">
                      {{ scope.row.name }}
                    </el-link>
                  </el-col>
                  <el-col :span="2">
                    <el-icon style="margin-left: 0px; top: 5px; color: #999999; cursor: pointer" v-if="scope.row.isAddFlag" v-prview="{ id: scope.row.id, name: scope.row.name }">
                      <svg><use xlink:href="#icon-yanjing"></use></svg>
                    </el-icon>
                  </el-col>
                </el-row>
              </template>
            </newPiTable>
          </div>
        </div>
      </div>
      <div class="depart" id="meet-minutes" v-if="Data.reviewType === '会议评审'">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.meetVisable = !Data.fold.meetVisable">{{ Data.fold.meetVisable ? '-' : '+' }}</span>
          <span class="title">会议纪要</span>
        </div>
        <div class="meet-content" v-show="Data.fold.meetVisable" v-loading="Data.meetLoading">
          <el-form :model="Data.meetForm" label-width="160px">
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="会议纪要编号:">
                  <el-input
                    v-model="Data.meetForm.docNumber"
                    placeholder="自动获取默认值"
                    @blur="handleMeetingMinutesDoc"
                    v-if="Data.workItemName === 'PMO审核' && Data.fromTabName === '代办流程'"
                  />
                  <span v-else>{{ Data.meetForm.docNumber }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item label="线下会议评审时间:">
                  <el-date-picker
                    v-model="Data.meetForm.docReviewTime"
                    type="date"
                    placeholder=""
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                    v-if="Data.workItemName === 'PMO审核' && Data.fromTabName === '代办流程'"
                  />
                  <span v-else>{{ Data.meetForm.docReviewTime }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="10">
                <el-form-item label="会议纪要文件:">
                  <el-link type="primary" :underline="true" @click="handleDown(2, '')">
                    {{ Data.meetForm.fileName }}
                  </el-link>
                  <el-col :span="2" v-if="Data.meetForm.fileName">
                    <el-icon style="margin-left: 0px; top: 5px; color: #999999; cursor: pointer" v-prview="{ id: Data.applicationDataOid, name: Data.meetForm.fileName }">
                      <svg><use xlink:href="#icon-yanjing"></use></svg>
                    </el-icon>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="depart" id="workflow_setting" v-if="Data.workItemName === '重新提交' && Data.fromTabName === '代办流程'">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.workflowVisable = !Data.fold.workflowVisable">{{ Data.fold.workflowVisable ? '-' : '+' }}</span>
          <span class="title">流程设置</span>
        </div>
        <div class="workflow-content" v-show="Data.fold.workflowVisable">
          <workflowForm :parmasObj="Data.parmasObj" :userObj="Data.userObj" v-model:selectUserData="Data.selectUserData" v-model:stepArr="Data.stepArr" ref="flow"></workflowForm>
        </div>
      </div>
      <div class="depart" id="workflow_dispose">
        <div class="title_box">
          <span class="hand_icon" @click="Data.fold.workflowVisable = !Data.fold.workflowVisable">{{ Data.fold.workflowVisable ? '-' : '+' }}</span>
          <span class="title">流程处理</span>
        </div>
        <div class="workflow-content" v-show="Data.fold.workflowVisable">
          <ProcessRecord
            :oid="Data.queryOid"
            :colunms="flowColunms"
            :isOpenProcessRecordHandler="Data.isOpenProcessRecordHandler"
            @processRecordHandler="processRecordHandler"
          ></ProcessRecord>
          <process-advice @processResolution="processResolution" v-if="Data.goFlag === 'true'"></process-advice>
        </div>
      </div>
    </div>
    <!-- 上传文件 -->
    <upload-dialog v-model:isShow="Data.uploadShow" :isSingle="Data.uploadFileName === '自检表' ? true : fasle" title="上传文件" @submit="submitImport"></upload-dialog>
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
      >
        <template #temppath="scope">
          <el-link type="primary" :underline="true" @click="handleDown(3, scope.row)">
            <el-tooltip :content="scope.row.temppath" placement="top">
              <div class="columnTitle">
                <span>{{ scope.row.temppath }}</span>
              </div>
            </el-tooltip>
          </el-link>
        </template>
      </NewPiTable>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="Data.deliverablesVisable = false">取消</el-button>
          <el-button type="primary" @click="Data.deliverablesVisable = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="examineReview">
import baseInfoForm from './components/baseInfoForm.vue';
import productConfigComponent from './components/productConfigComponent.vue'; // 产品配置
import workflowForm from './components/workflowForm.vue'; // 流程处理
import afterTechnical from '@/views/target/components/afterTechnical.vue'; // 技术指标
import afterSetNumber from '@/views/target/components/afterSetNumber.vue'; // 验证台数
import afterDuration from '@/views/target/components/afterDuration.vue'; // 验证时长
import afterMalfunction from '@/views/target/components/afterMalfunction.vue'; // 1年内故障率
import afterInterior from '@/views/target/components/afterInterior.vue'; // 内部问题关闭率
import afterExternal from '@/views/target/components/afterExternal.vue'; // 外部问题关闭率
import afterLossCost from '@/views/target/components/afterLossCost.vue'; // 损失质量成本
import afterCost from '@/views/target/components/afterCost.vue'; // 成本指标
import afterMarketIndicator from '@/views/target/components/afterMarketIndicator.vue'; // 市场指标
import afterMaterialIndicator from '@/views/target/components/afterMaterialIndicator.vue'; // 物料指标
import afterPatent from '@/views/target/components//afterPatent.vue'; // 专利指标
import { selfCheckerColunms, selfStageColums, uploadColunms, deliverableColunms } from './components/tableColunms';
import { getProjectMileStonePlan } from '@/api/project';
import { useRouter } from 'vue-router';
import { useCommonHandler } from '@/hooks';
import { before, set } from 'lodash';
const route = useRoute();
const router = useRouter();
const technical = ref();
const quality = ref();
const duration = ref();
const interior = ref();
const malfunction = ref();
const external = ref();
const lossCost = ref();
const market = ref();
const material = ref();
const cost = ref();
const patent = ref();
const baseInfoRef = ref();
const flow = ref();
const tableList = ref([]);
const api = window.$api;
const Data = reactive({
  selectTableData: [],
  fileSelectData: [],
  selectUserData: [],
  gressRableLoad: false,
  deliveraTableLoad: false,
  loading: false,
  uploadShow: false,
  basicForm: {
    description: '',
    projectType: '',
    projectShortName: '',
    baseReviewType: '',
    projectInfromation: '',
    evaluatePhaseName: '',
    evaluatePhaseOid: '',
  },
  projectName: route.query.processOID ? JSON.parse(sessionStorage.getItem('taskProject'))?.projectName : JSON.parse(sessionStorage.getItem('currentProject'))?.projectName, // 项目名称
  projectShortName: route.query.processOID
    ? JSON.parse(sessionStorage.getItem('taskProject'))?.projectShortName
    : JSON.parse(sessionStorage.getItem('currentProject'))?.projectShortName, // 项目编号
  // tab数据
  tabValue: 'milestone_plan',
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
  selfCheckerColunms: route.name === 'examineReview' || route.name === 'examineProcess' ? selfStageColums : selfCheckerColunms,
  selfCheckerTableData: [],
  factorVisable: false,
  direction: 'rtl',
  activeName: 'first',
  uploadColunms: uploadColunms,
  uploadTableData: [],
  // 会议纪要
  meetForm: {
    docNumber: '',
    docReviewTime: '',
    fileName: '',
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
    meetVisable: true, // 会议纪要
    workflowVisable: true, // 流程设置
    technicalVisable: true, // 技术指标(性能门)
    qualityVisable: true, // 质量
    costVisable: false, // 成本
    marketVisable: false, // 市场
    materialVisable: false, // 物料
    patentVisable: false, // 专利
  },
  baseData: '',
  oid: route.query.processOID ? JSON.parse(sessionStorage.getItem('taskProject'))?.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  tableLoad: false,
  processType: '转阶段',
  reviewPoint: '',
  userObj: {
    oid: route.query.oid,
    reviewPoint: '转阶段-详细设计转样机',
  },
  parmasObj: {
    reviewPoint: '',
  },
  workitemOID: '',
  processLoading: false,
  selectRow: '',
  // 评审流程处理表头
  flowColunms: [
    { title: '时间', dataIndex: '', width: '180px' },
    { title: '节点名称', dataIndex: '', width: '180px' },
    { title: '操作者', dataIndex: '', width: '180px' },
    { title: '操作', dataIndex: '', width: '180px' },
  ],
  selfChecker: '',
  updateTarget: '',
  applicationDataOid: '',
  rules: {
    docNumber: [{ required: true, message: '请输入会议纪要编号', trigger: 'blur' }],
    docReviewTime: [{ required: true, message: '请输入线下会议评审时间', trigger: 'blur' }],
  },
  selfCheckerFileList: [],
  orderOid: '',
  userInfo: JSON.parse(window.$Cookies.get('userInfo')).realName,
  meetLoading: false,
  uploadFileName: '',
  fileList: [],
  selfSelectTableData: [],
  isShowFileBtn: false, // 附件上传按钮显示
  workItemName: '',
  processTypeAlive: '',
  reviewType: '',
  fromTabName: '',
  queryOid: '',
  goFlag: '',
  resolution: '',
  tableListLength: '',
  isOpenProcessRecordHandler: route.query.processOID ? false : true, // 处理状况能否跳转标识
  workCompletedDate: '', // 通过完成时间判断流程能否操作
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
// 获取基本信息部分数据
const handleQuerayData = () => {
  Data.loading = true;
  api.reviewApi.getSdlgReviewConfig({ oid: Data.oid, reviewConfKey: 'piproject' }).then((res) => {
    let data = JSON.parse(res.data);
    if (res.success) {
      Data.basicForm = data;
      Data.loading = false;
    } else {
      window.$message.error(res.message);
      Data.loading = false;
    }
  });
  api.reviewApi.getSdlgReviewData({ oid: route.query.oid }).then((res) => {
    if (res.success) {
      Data.basicForm.projectInfromation = res.data.reviewPoint;
      Data.basicForm.evaluatePhaseName = res.data.evaluatePhaseName;
      Data.basicForm.evaluatePhaseOid = res.data.evaluatePhaseOid;
    }
  });
  selfCheckInfo();
};
//  获取流程自检表数据
const selfCheckInfo = () => {
  Data.tableLoad = true;
  api.reviewApi.getSelfCheckInfo({ oid: route.query.workitemOID }).then((res) => {
    if (res.success) {
      Data.selfCheckerTableData = res.data;
      Data.selfCheckerTableData.map((item) => {
        item.selfCheck_CN === JSON.parse(window.$Cookies.get('userInfo')).realName ? (item.sameFlag = true) : (item.sameFlag = false);
        item.fileBeanList = item.fileName;
        item.elementResult === '不通过' ? (item.noPassFlag = true) : (item.noPassFlag = false);
        Data.selfCheckerTableData.map((item) => {
          item.cuted === 'true' ? (item.strikethrough = true) : (item.strikethrough = false);
        });
      });
      Data.tableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
};
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
      Data.progessTableData = res.data.filter((item) => item.description !== '');
      Data.gressRableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.gressRableLoad = false;
    }
  });
};
// 附件查询
const reviewAttachments = () => {
  api.reviewApi.getReviewAttachments({ oid: route.query.oid }).then((res) => {
    if (res.success) {
      Data.uploadTableData = res.data;
      Data.uploadTableData.length > 0
        ? Data.uploadTableData.map((item) => {
            item.isAddFlag = true;
          })
        : '';
    }
  });
};
// 评审类型选择
const handlerReviewType = (data) => {
  Data.reviewType = data;
  let parmasObj = {
    oid: route.query.projectOid,
    reviewConfKey: 'piproject',
    reviewType: data,
    reviewPoint: baseInfoRef.value.Data.basicForm.processType + '-' + baseInfoRef.value.Data.basicForm.reviewPoint,
  };
  flow.value.getUserInfoData(parmasObj);
};
// 获取自检人数据
const getFlowSelfCheck = () => {
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
};
// 自检表上传
const uploadFlie = (row) => {
  Data.uploadFileName = '自检表';
  Data.uploadShow = true;
  Data.selectRow = JSON.stringify(row);
  let str = JSON.stringify(row);
  let obj = JSON.parse(str);
  Data.selectRow = obj;
};
// 自检表上传确定
const submitImport = (fileList) => {
  if (Data.uploadFileName === '自检表') {
    Data.selfCheckerTableData.map((item) => {
      if (Data.selectRow.deliverableObjOid === item.deliverableObjOid) {
        item.fileBeanList = fileList[0].name;
        item.fileList = fileList;
      }
    });
    Data.selfCheckerFileList.push(fileList);
  } else if (Data.uploadFileName === '附件') {
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
        file: item,
        index: index,
        isAddFlag: false,
      });
    });
  }
  window.$message.success('上传成功');
  Data.uploadShow = false;
};
// 自检表选择
const selfSelectionChange = (val) => {
  Data.selfSelectTableData = val;
};
// 交付物汇总按钮
const handleSetSummary = () => {
  Data.deliverablesVisable = true;
  Data.deliveraTableLoad = true;
  api.reviewApi.getReviewElementDeliverable({ oid: route.query.oid }).then((res) => {
    if (res.success) {
      Data.deliverableTableData = res.data;
      Data.deliveraTableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.deliveraTableLoad = false;
    }
  });
};
// 裁剪自检要素
const handleTailor = () => {
  if (Data.selfSelectTableData.length === 0) return window.$message.warning('请选择需要裁剪的数据');
  let canCut = '';
  Data.selfSelectTableData.map((item) => {
    item.canCut === '否' ? (canCut = false) : (canCut = true);
  });
  if (!canCut) return window.$message.warning('当前选择的数据中有不能被裁剪的数据');
  Data.selfSelectTableData.map((item) => {
    item.canCut === '是' ? (item.strikethrough = true) : '';
    item.cuted = item.strikethrough;
  });
  window.$message.success('裁剪成功');
};
// 撤销裁剪
const handleRevocation = () => {
  if (Data.selfSelectTableData.length === 0) return window.$message.warning('请选择需要撤销裁剪的数据');
  Data.selfSelectTableData.map((item) => {
    item.strikethrough ? (item.strikethrough = false) : '';
    item.cuted = item.strikethrough;
  });
  window.$message.success('撤销成功');
};
// 会议纪要获取会议纪要文件
const handleMeetingMinutesDoc = () => {
  Data.meetLoading = true;
  api.reviewApi.getMeetingMinutesDoc({ number: Data.meetForm.docNumber }).then((res) => {
    if (res.success) {
      Data.meetForm.fileName = res.data.fileName;
      Data.applicationDataOid = res.data.applicationDataOid;
      Data.meetLoading = false;
    } else {
      window.$message.error(res.message);
      Data.meetLoading = false;
    }
  });
};
// 其他节点获取会议纪要文档
const getDefaultMeet = () => {
  api.reviewApi.getMeetingMinutesDocByReview({ oid: route.query.oid }).then((res) => {
    if (res.success) {
      Data.meetForm = res.data;
      Data.applicationDataOid = res.data.applicationDataOid;
    }
  });
};
// 获取意见
const processResolution = (value) => {
  Data.resolution = value;
};
// 节点提交校验
const submitFun = (val, callback) => {
  // Data.processLoading = true;
  let paramsData = new FormData();
  if (Data.uploadTableData.length > 0) {
    Data.fileList.forEach((item) => {
      paramsData.append('file', item.raw);
    });
  }
  if (val === '通过') {
    if (route.query.workItemName === '自检') {
      let uploadParamsData = new FormData();
      if (Data.selfCheckerFileList.length > 0) {
        Data.selfCheckerFileList.forEach((item) => {
          uploadParamsData.append('file', item[0].raw);
        });
      }
      uploadParamsData.append('form', JSON.stringify(Data.selfCheckerTableData));
      api.reviewApi.submitSelfCheck(uploadParamsData).then((res) => {
        if (res.success) {
          if (route.query.processType === '转阶段') {
            let paramsDataPhase = new FormData();
            paramsDataPhase.append('technical_index', JSON.stringify(technical.value.Data.tableData)); // 技术指标
            paramsDataPhase.append('cost_index', JSON.stringify(cost.value.Data.tableData)); // 成本指标
            paramsDataPhase.append('market_index', JSON.stringify(market.value.Data.tableData)); // 市场指标
            paramsDataPhase.append('parts_index', JSON.stringify(material.value.Data.tableData)); // 物料指标
            paramsDataPhase.append('patent', JSON.stringify(patent.value.Data.tableData)); // 专利
            // 更新目标指标
            api.reviewApi.updateTargetIndicator(paramsDataPhase).then((res) => {
              if (res.success) {
                Data.processLoading = false;
                // callback();
                router.push({ name: 'toDoPage' });
              } else {
                window.$message.error(res.message);
                Data.processLoading = false;
              }
            });
          }
          // 附件上传
          let fileParamsData = new FormData();
          fileParamsData.append('oid', route.query.oid);
          fileParamsData.append('attachments', JSON.stringify(Data.uploadTableData));
          if (Data.uploadTableData.length > 0) {
            Data.fileList.forEach((item) => {
              fileParamsData.append('file', item.raw);
            });
          }
          api.reviewApi.uploadReviewAttachments(fileParamsData).then((res) => {
            if (res.success) {
              Data.processLoading = false;
              callback();
            } else {
              window.$message.error(res.message);
              Data.processLoading = false;
            }
          });
        } else {
          window.$message.error(res.message);
          Data.processLoading = false;
        }
      });
      if (route.query.processType === '技术评审') {
        Data.processLoading = false;
        callback();
      }
    } else if (route.query.workItemName === '修改完善') {
      paramsData.append('technical_index', JSON.stringify(technical.value.Data.tableData)); // 技术指标
      paramsData.append('number_of_verification', JSON.stringify(quality.value.Data.setNumberData)); // 验证台数
      paramsData.append('duration_of_verification', JSON.stringify(duration.value.Data.setNumberData)); // 验证时长
      paramsData.append('external_question', JSON.stringify(external.value.Data.setNumberData)); // 外部问题
      paramsData.append('parts_index', JSON.stringify(material.value.Data.tableData)); // 物料指标
      paramsData.append('patent', JSON.stringify(patent.value.Data.tableData)); // 专利
      paramsData.append('domestic_question', JSON.stringify(interior.value.Data.setNumberData)); // 内部问题
      paramsData.append('failure_rate', JSON.stringify(malfunction.value.Data.setNumberData)); // 1年内故障率
      paramsData.append('quality_loss_cost', JSON.stringify(lossCost.value.Data.setNumberData)); // 质量损失成本
      paramsData.append('cost_index', JSON.stringify(cost.value.Data.tableData)); // 成本指标
      paramsData.append('market_index', JSON.stringify(market.value.Data.tableData)); // 市场指标
      api.reviewApi.checkTargetIndicatorAndSelfCheck(paramsData).then((res) => {
        if (res.success) {
          let uploadParamsData = new FormData();
          uploadParamsData.append('oid', route.query.oid);
          uploadParamsData.append('attachments', JSON.stringify(Data.uploadTableData));
          if (Data.uploadTableData.length > 0) {
            Data.fileList.forEach((item) => {
              uploadParamsData.append('file', item.raw);
            });
          }
          // 附件上传
          api.reviewApi.uploadReviewAttachments(uploadParamsData).then((res) => {
            if (res.success) {
              Data.processLoading = false;
              callback();
            } else {
              window.$message.error(res.message);
              Data.processLoading = false;
            }
          });
        } else {
          window.$message.error(res.message);
          Data.processLoading = false;
        }
      });
    } else if (route.query.workItemName === 'PMO审核') {
      if (route.query.reviewType === '会议评审') {
        if (Data.meetForm.docNumber === '') {
          window.$message.error('会议纪要编号不能为空');
          Data.processLoading = false;
        } else if (Data.meetForm.docReviewTime === '' || Data.meetForm.docReviewTime === null) {
          window.$message.error('线下会议评审时间不能为空');
          Data.processLoading = false;
        } else {
          let paramsData = new FormData();
          paramsData.append('oid', route.query.oid);
          paramsData.append('docNumber', Data.meetForm.docNumber);
          paramsData.append('docReviewTime', Data.meetForm.docReviewTime);
          api.reviewApi.updateReviewDoc(paramsData).then((res) => {
            if (res.success) {
              callback();
              Data.processLoading = false;
            } else {
              window.$message.error(res.message);
              Data.processLoading = false;
            }
          });
        }
      } else {
        callback();
        Data.processLoading = false;
      }
    } else {
      callback();
    }
  } else if (val === '提交') {
    if (route.query.workItemName === '重新提交') {
      let str = JSON.stringify(baseInfoRef.value.Data.basicForm);
      let obj = JSON.parse(str);
      obj.startprocess = false;
      obj.oid = route.query.oid;
      obj.reviewPoint = obj.processType + '-' + obj.reviewPoint;
      paramsData.append('attributes', JSON.stringify(obj)); // 基本信息
      paramsData.append('projectSchedule', JSON.stringify(Data.progessTableData)); // 项目进度
      paramsData.append('elements', JSON.stringify(Data.selfCheckerTableData)); // 自检表
      paramsData.append('attachments', JSON.stringify(Data.uploadTableData)); // 附件
      paramsData.append('processUsers', JSON.stringify(Data.selectUserData)); // 工作流用户选人
      api.reviewApi.sdlgSubmitReview(paramsData).then((res) => {
        if (res.success) {
          window.$message.success('保存成功');
          Data.processLoading = false;
          callback();
        } else {
          window.$message.error(res.message);
          Data.processLoading = false;
        }
      });
    }
  } else {
    callback();
  }
};
// 附件上传
const attachmentUpload = () => {
  Data.uploadFileName = '附件';
  Data.uploadShow = true;
};
// 附件移除
const handleRemoveFile = () => {
  if (Data.fileSelectData.length === 0) return window.$message.warning('请选择需要移除的数据');
  const selectedIds = Data.fileSelectData.map((row) => row.index);
  Data.uploadTableData = Data.uploadTableData.filter((row) => !selectedIds.includes(row.index));
  window.$message.success('删除成功');
};
// 附件复选框
const fileSelectionChange = (val) => {
  Data.fileSelectData = val;
};
// PMO审核下跳转到评价详情
const handleEvaluate = () => {
  router.push({ name: 'detailEvaluate', query: { oid: Data.basicForm.evaluatePhaseOid } });
};
// 文件下载
const handleDown = (type, row) => {
  let oid = '';
  let name = '';
  if (type === '自检表下载') {
    oid = row.fileOid;
    name = row.fileName;
  } else if (type !== 2) {
    oid = row.id;
    name = row.name;
  } else {
    oid = Data.applicationDataOid;
    name = Data.meetForm.fileName;
  }
  api.targetApi.downloadContent({ oid: oid }).then((result) => {
    if (result) {
      if (!result) return window.$message.error('下载失败');
      useCommonHandler.download(result, name);
    }
  });
};
// 处理状况跳转
const processRecordHandler = (row) => {
  console.log(row, 'row');
  Data.workCompletedDate = row.workCompletedDate;
  router.push({
    name: 'examineProcess',
    query: {
      oid: row.pboOid, // 评审ID
      workitemOID: row.id,
      processOID: row.processOid, // 进程Oid
      workItemName: row.workItemName, // 当前阶段
      goFlag: row.workName === '通知' ? false : true,
      projectOid: row.projectOid, // 项目ID
      processType: row.processType, // 流程类型
      reviewType: row.reviewType, // 评审类型
      meetFlag: true,
      fromTabName: '代办流程',
      reviewPoint: row.reviewPoint, // 技术评审点
    },
  });
};
/**tab切换 */
const handleTabClick = (tab) => {
  const id = tab.props.name;
  document.querySelector('#' + id).scrollIntoView({
    behavior: 'smooth',
  });
};
onBeforeMount(() => {});
onMounted(() => {
  handleQuerayData(); // 基本信息
  handleProgressData(); // 项目进度
  getStepData(); // 里程碑计划
  reviewAttachments(); // 附件
  getDefaultMeet(); // 会议纪要
  // getFlowSelfCheck();
  nextTick(() => {
    let base = JSON.parse(sessionStorage.getItem('basicForm'));
    Data.orderOid = base.orderNumber.join(',');
    Data.reviewPoint = base.reviewPoint;
  });
  if (route.query.fromTabName === '代办流程') {
    if (route.query.workItemName === '自检' || route.query.workItemName === '修改完善' || route.query.workItemName === '重新提交') {
      Data.isShowFileBtn = true;
    }
  } else {
    Data.isShowFileBtn = false;
  }
  Data.workItemName = route.query.workItemName;
  Data.processTypeAlive = route.query.processType;
  Data.reviewType = route.query.reviewType;
  Data.fromTabName = route.query.fromTabName;
  Data.queryOid = route.query.oid;
  Data.goFlag = route.query.goFlag;
  Data.workitemOID = route.query.workitemOID;
  Data.processOID = route.query.processOID;
});
</script>

<style lang="less" scoped>
.create_evaluate_examine {
  .top_area {
    margin-bottom: 20px;
    padding: 16px 16px 0 16px;
    background: #fff;
    .tab_box {
      :deep(.el-tabs__header) {
        margin-bottom: 0px;
      }
      .examine-title {
        display: flex;
        //align-items: center;
        margin-bottom: 15px;
        p {
          margin-left: 5px;
          font-size: 20px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.85);
          flex: 1;
        }
        .review-point {
          background: #386bd7;
          color: #fff;
          padding: 0 6px;
        }
      }
      .base-title {
        display: flex;
        align-items: center;
        height: 40px;
        border-bottom: 1px solid #dddddd;
        padding: 0 16px;
        margin-bottom: 10px;
        padding-left: 0;
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
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 600;
          color: #333333;
        }
      }
      .development-title {
        margin: 15px 0 10px 0;
        display: flex;
        align-items: center;
        .development-item {
          flex: 0.5;
          display: flex;
        }
        .development-content {
          font-size: 14px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 400;
          color: #666666;
          display: inline-block;
          margin-right: 35px;
        }
        .development-ident {
          font-size: 14px;
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }

  .bot_area {
    // margin: 0 16px;
    padding: 0 8px 0 16px;
    height: calc(100vh - 300px);
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
:deep(.el-form-item__label) {
  padding-right: 40px;
}
</style>
