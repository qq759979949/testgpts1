<template>
  <div class="common_grading">
    <el-affix :target="targrtGrading" :offset="100">
      <div class="top_area" ref="topArea">
        <div class="topBtnTitle">
          <p class="processName" v-if="route.query.workItemName">
            <span v-if="route.query.workItemName !== '' && route.query.workItemName">{{ '【' + route.query.workItemName + '】' }}</span>
            <span>{{ route.query.projectShortName + '-' + route.query.projectName + '-' + route.query.processName }}</span>
          </p>
          <slot name="routingList"></slot>
        </div>
        <div>
          <el-button type="primary" @click="clickDetail">项目详情</el-button>
        </div>
        <!-- <div :class="Data.isExpandRetract ? 'expand' : 'retract'"> -->
        <!-- <ObjectInfo :detailLayout="item.items" :column="4" :infoTitle="item.groupName" v-for="(item, index) in Data.infoDatas" :key="index"></ObjectInfo> -->
        <!-- <FormDetail ref="form" labelWidth="200px" :formList="Data.infoDatas" v-model:submitData="Data.submitData"></FormDetail>
        </div> -->
        <!-- <div class="isExpand">
          <el-icon v-if="Data.isExpandRetract" class="icon" @click="isExpandOrRetract"><ArrowUpBold /></el-icon>
          <el-icon v-else class="icon" @click="isExpandOrRetract"><ArrowDownBold /></el-icon>
          <span @click="isExpandOrRetract">{{ Data.isExpandRetract ? '收起' : '展开' }}</span>
        </div> -->
        <!-- tab -->
        <div class="tab_box">
          <el-tabs v-model="Data.tabValue" @tab-click="handleTabClick">
            <el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) in props.tabList" :key="index"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-affix>
    <div class="bot_area" :style="{ height: `calc(100vh - 208px - ${Data.computedHeight}px)`, overflowY: 'scroll' }">
      <div class="depart" id="milestone_plan">
        <div class="title_box">
          <span class="hand_icon" @click="expandFunc('arrow1')" v-if="Data.arrowList.arrow1">-</span>
          <span class="hand_icon" @click="expandFunc('arrow1')" v-else>+</span>
          <span class="title">里程碑计划</span>
        </div>
        <section class="section-container" v-show="Data.arrowList.arrow1">
          <Steps :stepList="Data.stepList" :active="Data.active"></Steps>
        </section>
      </div>
      <div class="depart" id="goals_indicators">
        <div class="title_box">
          <span class="hand_icon" @click="expandFunc('arrow2')" v-if="Data.arrowList.arrow2">-</span>
          <span class="hand_icon" @click="expandFunc('arrow2')" v-else>+</span>
          <span class="title">目标/指标</span>
        </div>
        <section class="section-container" v-show="Data.arrowList.arrow2">
          <div class="depart" :id="item.name" v-for="(item, index) in Data.afterProjectEstablishment" :key="index">
            <div class="title_box">
              <span class="hand_icon" @click="item.switchover = !item.switchover">{{ item.switchover ? '-' : '+' }}</span>
              <span class="title">{{ item.label }}</span>
            </div>
            <!-- <div class="title_box">
              <span class="title">{{ item.label }}</span>
            </div> -->
            <div class="content">
              <component :ref="item.refTarget" :is="item.component" v-if="item.switchover"></component>
            </div>
          </div>
        </section>
      </div>
      <div class="depart" id="report_materials">
        <div class="title_box">
          <span class="hand_icon" @click="expandFunc('arrow3')" v-if="Data.arrowList.arrow3">-</span>
          <span class="hand_icon" @click="expandFunc('arrow3')" v-else>+</span>
          <span class="title">定级汇报材料</span>
        </div>
        <section class="section-container" v-show="Data.arrowList.arrow3">
          <el-form-item
            label="定级汇报材料："
            :required="false"
            style="width: 100%"
            v-if="$router.currentRoute.value.name !== 'maintenanceGrading' && $router.currentRoute.value.name !== 'gradingDetail'"
          >
            <el-upload ref="upload" class="upload-demo" action="/" :auto-upload="false" v-model:file-list="Data.fileList" :limit="1" :on-exceed="handleExceed">
              <template #trigger>
                <el-button :icon="'upload'">上传文件</el-button>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="定级汇报材料：" v-else :required="false" style="width: 100%">
            <el-link type="primary" @click="handlePreview(Data.fileObj)">{{ Data.fileObj.fileName }}</el-link>
          </el-form-item>
          <!-- <div>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div> -->
        </section>
      </div>
      <div class="depart" id="process_settings" v-if="$router.currentRoute.value.name !== 'maintenanceGrading' && $router.currentRoute.value.name !== 'gradingDetail'">
        <div class="title_box">
          <span class="hand_icon" @click="expandFunc('arrow4')" v-if="Data.arrowList.arrow4">-</span>
          <span class="hand_icon" @click="expandFunc('arrow4')" v-else>+</span>
          <span class="title">流程设置</span>
        </div>
        <section class="section-container" v-show="Data.arrowList.arrow4">
          <select-user ref="selectUserGrading" :parmasObj="Data.parmasObj" v-model:selectUserData="Data.selectUserData"></select-user>
        </section>
      </div>
      <div class="depart" id="evaluation_main" v-if="$router.currentRoute.value.name === 'maintenanceGrading' || $router.currentRoute.value.name === 'gradingDetail'">
        <div class="title_box">
          <span class="hand_icon" @click="expandFunc('arrow5')" v-if="Data.arrowList.arrow5">-</span>
          <span class="hand_icon" @click="expandFunc('arrow5')" v-else>+</span>
          <span class="title">项目评价与主包金额</span>
        </div>
        <section class="section-container" v-show="Data.arrowList.arrow5">
          <el-form ref="ruleFormRef" :model="Data.ruleForm" :rules="Data.rules" class="demo-form-inline" label-position="right">
            <el-row>
              <el-col :span="8">
                <el-form-item label="项目评级：" prop="projectLevel">
                  <el-select v-model="Data.ruleForm.projectLevel" class="m-2" style="width: 200px" clearable v-if="$router.currentRoute.value.name !== 'gradingDetail'">
                    <el-option v-for="item in Data.options" :key="item" :label="item" :value="item" />
                  </el-select>
                  <el-input
                    v-model="Data.ruleForm.projectLevel"
                    clearable
                    style="width: 300px"
                    v-if="$router.currentRoute.value.name === 'gradingDetail'"
                    :disabled="$router.currentRoute.value.name === 'gradingDetail'"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="主包金额（元）：" prop="amount">
                  <el-input v-model="Data.ruleForm.amount" clearable style="width: 200px" :disabled="$router.currentRoute.value.name === 'gradingDetail'" />
                  （配包比例：{{ Data.ruleForm.secondaryPercent }}%）
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="定级时间：" prop="rankingDate">
                  <el-date-picker
                    v-model="Data.ruleForm.rankingDate"
                    type="date"
                    clearable
                    style="width: 200px"
                    :disabled="$router.currentRoute.value.name === 'gradingDetail'"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- <select-user :parmasObj="Data.parmasObj"></select-user> -->
        </section>
      </div>
      <div class="depart" id="process_dealt" v-if="$router.currentRoute.value.name !== 'createProjectGrading'">
        <div class="title_box">
          <span class="hand_icon" @click="expandFunc('arrow6')" v-if="Data.arrowList.arrow6">-</span>
          <span class="hand_icon" @click="expandFunc('arrow6')" v-else>+</span>
          <span class="title">流程处理</span>
        </div>
        <section class="section-container" v-show="Data.arrowList.arrow6">
          <process-record :oid="Data.workitemOID" :isDetail="isDetail"></process-record>
        </section>
      </div>
      <slot name="processAdvice"></slot>
      <el-drawer v-model="Data.drawer" :show-close="false" title="项目详情" size="50%">
        <FormDetail ref="form" labelWidth="200px" :formList="Data.infoDatas" v-model:submitData="Data.submitData"></FormDetail>
      </el-drawer>
    </div>
  </div>
</template>

<script setup>
import { markRaw } from 'vue';
import { getProjectInfoLayout, getProjectMileStonePlan } from '@/api/project';
import { useResizeObserver } from '@vueuse/core';
import { useCommonHandler } from '@/hooks';
// 立项后
import afterTechnical from '@/views/target/components/afterTechnical.vue'; // 技术指标
import afterQuality from '@/views/target/components/afterQuality.vue'; // 质量指标
import afterCost from '@/views/target/components/afterCost.vue'; // 成本指标
import afterMarketIndicator from '@/views/target/components/afterMarketIndicator.vue'; // 市场指标
import afterMaterialIndicator from '@/views/target/components/afterMaterialIndicator.vue'; // 物料指标
import afterPatent from '@/views/target/components/afterPatent.vue'; // 专利指标
import afterEconomic from '@/views/target/components/afterEconomic.vue'; // 经济效益指标
import afterOtherIndicator from '@/views/target/components/afterOtherIndicator.vue'; // 其他指标
import afterOtherQuality from '@/views/target/components/afterOtherQuality.vue'; // 质量指标 ---非产品类
import afterOtherCost from '@/views/target/components/afterOtherCost.vue'; // 成本指标---非产品类
const { proxy: that } = getCurrentInstance();
const topArea = ref();
const route = useRoute();
const router = useRouter();
const props = defineProps({
  tabList: {
    type: Array,
    default: () => [
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
        label: '流程设置',
        name: 'process_settings',
      },
    ],
  },
  targrtGrading: {
    type: String,
  },
  isDetail: {
    type: Boolean,
    default: false,
  },
});
/** 校验规则 */
const ruleFormRef = ref();
const AfterTechnical = ref(markRaw(afterTechnical));
const AfterQuality = ref(markRaw(afterQuality));
const AfterCost = ref(markRaw(afterCost));
const AfterMarketIndicator = ref(markRaw(afterMarketIndicator));
const AfterMaterialIndicator = ref(markRaw(afterMaterialIndicator));
const AfterPatent = ref(markRaw(afterPatent));
const AfterEconomic = ref(markRaw(afterEconomic));
const AfterOtherIndicator = ref(markRaw(afterOtherIndicator));
const AfterOtherQuality = ref(markRaw(afterOtherQuality));
const AfterOtherCost = ref(markRaw(afterOtherCost));
const Data = reactive({
  // tab数据
  tabValue: 'milestone_plan',
  infoDatas: [],
  submitData: [],
  stepList: [],
  active: 0,
  isExpandRetract: false,
  computedHeight: null,
  projectOid: route.query.oid,
  parmasObj: {
    processTemplate: 'SDLG_ProjectRankingWF',
    oid: route.query.oid,
  },
  workitemOID: route.query.workitemOID,
  fileObj: {},
  fileList: [],
  ruleForm: {},
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),
  options: [],
  rules: {
    projectLevel: [{ required: true, message: '请选择等级', trigger: 'change' }],
    amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
    rankingDate: [{ required: true, message: '请选择时间', trigger: 'blur' }],
  },
  arrowList: {
    arrow1: true,
    arrow2: false,
    arrow3: true,
    arrow4: true,
    arrow5: true,
    arrow6: true,
  },
  selectUserData: [],
  afterProjectEstablishment: [],
  productCategoryList: [],
  acceptancePhaseList: [],
  projectType: route.query.projectType ? route.query.projectType : JSON.parse(sessionStorage.getItem('currentProject')).type,
  drawer: false,
});
const selectUserGrading = ref(null);
onMounted(() => {
  getMilestonePlan();
  // getSelectData();
  getType();
  if (that.$router.currentRoute.value.name !== 'createProjectGrading') {
    getGradingFile();
  }
  if (that.$router.currentRoute.value.name === 'maintenanceGrading' || that.$router.currentRoute.value.name === 'gradingDetail') {
    getGradingList();
    getGradingMoney();
  }
});
useResizeObserver(topArea, (entries) => {
  const entry = entries[0];
  const { height } = entry.contentRect;
  if (that.$router.currentRoute.value.name === 'createProjectGrading') {
    Data.computedHeight = `${height}`;
  } else if (that.$router.currentRoute.value.name === 'gradingDetail') {
    Data.computedHeight = `${height - 50}`;
  } else {
    Data.computedHeight = `${height - 50}`;
  }
});
/**tab切换 */
const handleTabClick = (tab) => {
  const id = tab.props.name;
  document.querySelector('#' + id).scrollIntoView({
    behavior: 'smooth', // 定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"
  });
};
// const getSelectData = () => {
//   // 产品类别
//   window.$api.targetApi.getProductTypes().then((res) => {
//     if (res.success) {
//       if (res.data) {
//         Data.productCategoryList = res.data.map((item) => {
//           return { label: item, value: item };
//         });
//       } else {
//         Data.productCategoryList = [];
//       }
//     }
//   });
//   // 验收阶段
//   window.$api.payPacketApi.getPhaseNames({ oid: Data.projectOid }).then((res) => {
//     if (res.success) {
//       Data.acceptancePhaseList = res.data.map((item) => {
//         return {
//           label: item.name,
//           value: item.label,
//         };
//       });
//     }
//   });
// };
// 获取目标/指标类型
const getType = () => {
  if (Data.projectType === '产品开发类项目') {
    // 立项后
    Data.afterProjectEstablishment = [
      {
        name: 'technical_index',
        label: '技术指标（性能门）',
        enName: 'technical_index',
        component: AfterTechnical,
        refTarget: 'technica',
        switchover: true,
      },
      {
        name: 'quality_index',
        label: '质量指标（质量门）',
        enName: 'quality_index',
        component: AfterQuality,
        refTarget: 'quality',
        switchover: true,
      },
      {
        name: 'cost_index',
        label: '成本指标（成本门）',
        enName: 'cost_index',
        component: AfterCost,
        refTarget: 'cost',
        switchover: true,
      },
      {
        name: 'market',
        label: '市场指标',
        enName: 'market',
        component: AfterMarketIndicator,
        refTarget: 'market',
        switchover: true,
      },
      {
        name: 'material_specification',
        label: '物料指标',
        enName: 'material_specification',
        component: AfterMaterialIndicator,
        refTarget: 'material',
        switchover: true,
      },
      {
        name: 'patent',
        label: '专利',
        enName: 'patent',
        component: AfterPatent,
        refTarget: 'patent',
        switchover: true,
      },
    ];
  } else {
    // 立项后
    Data.afterProjectEstablishment = [
      {
        name: 'economic',
        label: '经济效益',
        enName: 'economic',
        component: AfterEconomic,
        refTarget: 'afterEconomic',
        switchover: true,
      },
      {
        name: 'quality_index',
        label: '质量指标（质量门）',
        enName: 'quality_index',
        component: AfterOtherQuality,
        refTarget: 'quality',
        switchover: true,
      },
      {
        name: 'cost_index',
        label: '成本指标（成本门）',
        enName: 'cost_index',
        component: AfterOtherCost,
        refTarget: 'cost',
        switchover: true,
      },
      {
        name: 'otherIndicator',
        label: '其他指标',
        enName: 'otherIndicator',
        component: AfterOtherIndicator,
        refTarget: 'otherIndicator',
        switchover: true,
      },
    ];
  }
};
// 获取详细信息
const getInfoData = () => {
  let obj = {
    serviceKey: 'com.pisx.pmgt.project.PIProject',
    oid: Data.projectOid,
  };
  getProjectInfoLayout(obj).then((res) => {
    if (res.success) {
      let datas = res.data
        // .filter((v) => v.groupName === '基本属性' || v.groupName === '项目需求')
        .map((item) => {
          item.items = item.items.map((i) => {
            i.label = i.label + '：';
            i.value = i.displayValue;
            i.filedType = 'DISPLAY';
            i.required = false;
            if (i.name === 'ObjectivesAndDeliverables') {
              i.displayValue = i.displayValue.map((it, index) => {
                it.number = index + 1;
                return it;
              });
            }
            return i;
          });
          return item;
        });
      // let datas = res.data;
      datas.forEach((v) => {
        v.items.forEach((e) => {
          Data.submitData[e.name] = '';
        });
      });
      Data.infoDatas = that.$formatData(datas, Data.submitData);
      Data.infoDatas.forEach((item) => {
        item.list = item.list.map((el) => {
          el.maxSpan = el.length;
          return el;
        });
      });
    } else {
      that.$message.error(res.message);
    }
  });
};
// 获取里程碑计划
const getMilestonePlan = () => {
  getProjectMileStonePlan({ oid: Data.projectOid }).then((res) => {
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
      that.$message.error(res.message);
    }
  });
};
// 收起/展开
const isExpandOrRetract = () => {
  Data.isExpandRetract = !Data.isExpandRetract;
};
const handleExceed = (file) => {
  Data.fileList = [];
  let fileList = [];
  fileList = file;
  if (fileList[0].status) {
    delete fileList[0].status;
  }
  Data.fileList = fileList;
};
// 创建和编辑时提交
const onSubmit = () => {
  selectUserGrading.value.validate(async (valid, fields) => {
    if (valid) {
      let parmas = {
        oid: Data.projectOid,
        processTemplate: 'SDLG_ProjectRankingWF',
        processUsers: JSON.stringify(Data.selectUserData),
        actualUser: Data.userInfo.username,
        secondFiles: Data.fileList.length > 0 ? Data.fileList[0].raw : [],
      };
      window.$api.commonApi.startWfProcess(parmas).then((res) => {
        if (res.success) {
          emit('submitSuccess');
          window.$message.success('启动成功！');
          window.$navTagStore.removeTag(route, router);
          window.$navTagStore.removeCacheTag(route.name);
          router.push({ name: 'projectDetail' });
        } else {
          emit('submitSuccess');
          window.$message.error(res.message);
        }
      });
    } else {
      emit('submitSuccess');
      selectUserGrading.value.checkForm(valid, fields);
    }
  });
};
// 获取定级材料
const getGradingFile = () => {
  window.$api.projectGradingApi.getGradedMaterialsInfo({ oid: route.query.workitemOID }).then((res) => {
    if (res.success) {
      Data.fileObj = res.data;
    } else {
      that.$message.error(res.message);
    }
  });
};
// 查看定级材料
const handlePreview = (value) => {
  window.$api.fileApi.downloadContent({ oid: value.appDataOid }).then((res) => {
    useCommonHandler.download(res, value.fileName);
  });
};
// 获取评级的列表
const getGradingList = () => {
  window.$api.projectGradingApi.getProjectGradeList({ oid: Data.projectOid }).then((res) => {
    if (res.success) {
      Data.options = res.data;
    } else {
      that.$message.error(res.message);
    }
  });
};
// 获取主包金额
const getGradingMoney = () => {
  window.$api.projectGradingApi.getProjectRewardsByOid({ oid: Data.projectOid }).then((res) => {
    if (res.success) {
      Data.ruleForm.amount = res.data.amount.value;
      Data.ruleForm.projectLevel = res.data.projectLevel.value;
      Data.ruleForm.rankingDate = res.data.rankingDate.value;
      Data.ruleForm.secondaryPercent = res.data.secondaryPercent.value;
      Data.ruleForm.rewardsOid = res.data.rewardsOid;
    } else {
      that.$message.error(res.message);
    }
  });
};
const validate = (valid, fields) => {
  return ruleFormRef.value.validate(valid, fields);
};
const checkForm = () => {
  ruleFormRef.value.validate((valid, fields) => {
    for (let v in fields) {
      fields[v].forEach((v) => {
        window.$message.warning(v.message);
      });
    }
  });
};
// 维护等级提交
const submitProtectGrad = (opera, submitProcess, resolution) => {
  if (opera === '定级通过') {
    validate(async (valid, fields) => {
      if (valid) {
        const params = {
          oid: route.query.workitemOID,
          route: opera,
          comment: resolution,
          actualCompleteUser: Data.userInfo.username,
          userName: Data.userInfo.thirdPartUser,
          attrParams: Data.ruleForm,
        };
        const obj = new FormData();
        obj.append('formData', JSON.stringify(params));
        window.$api.projectGradingApi.completeMaintainProjectLevelTask(obj).then((res) => {
          if (res.success) {
            emit('submitSuccess');
            window.$navTagStore.removeTag(route, router);
            window.$navTagStore.removeCacheTag(route.name);
            router.push({ name: 'toDoPage' });
          } else {
            emit('submitSuccess');
            that.$message.error(res.message);
          }
        });
      } else {
        emit('submitSuccess');
        checkForm(valid, fields);
      }
    });
  } else if (opera === '定级未通过') {
    submitProcess();
    emit('submitSuccess');
    window.$navTagStore.removeTag(route, router);
    window.$navTagStore.removeCacheTag(route.name);
    router.push({ name: 'toDoPage' });
  }
};
// 展开缩起
const expandFunc = (index) => {
  Data.arrowList[index] = !Data.arrowList[index];
};
const clickDetail = () => {
  Data.drawer = true;
  getInfoData();
};
// const shrinkFunc = (index) => {
//   Data.arrowList[index] = !Data.arrowList[index];
// };
defineExpose({ onSubmit, submitProtectGrad });
const emit = defineEmits(['submitSuccess']);
</script>

<style lang="less" scoped>
.common_grading {
  // padding: 16px;
  // background: #fff;
  margin-bottom: 20px;
  .top_area {
    margin-bottom: 20px;
    padding: 16px 16px 0 16px;
    background: #fff;
    .topBtnTitle {
      display: flex;
      justify-content: space-between;
    }
    .tab_box {
      background: #fff;
      // margin-top: 10px;
      :deep(.el-tabs__header) {
        margin-bottom: 0px;
      }
    }
    .processName {
      font-size: 20px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
    .isExpand {
      display: inline-block;
      font-size: 14px;
      position: absolute;
      right: 20px;
      color: green;
      cursor: pointer;
      z-index: 10000;
      .icon {
        margin-right: 10px;
        margin-top: 5px;
      }
    }
    .expand {
      height: calc(100vh - 395px);
      overflow-y: scroll;
      transition: all 0.3s ease;
    }
    .retract {
      height: 164px;
      overflow: scroll;
      transition: all 0.3s ease;
    }
  }
  .bot_area {
    margin: 0 16px;
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
      }
      .section-container {
        padding: 20px 10px;
      }
    }
    .bottomForm {
      margin-top: 18px;
    }
  }
}
:deep(.el-step__icon.is-icon) {
  max-width: 200px;
  width: auto;
}
:deep(.isLast) {
  // &:nth-of-type(5) {
  .el-step__line {
    display: block;
  }
  // }
}
:deep(.el-form--label-left .el-form-item__label) {
  width: 170px !important;
}
:deep(.el-form-item) {
  margin-bottom: 0px;
}
:deep(.el-drawer__header) {
  margin-bottom: 0px;
}
</style>
