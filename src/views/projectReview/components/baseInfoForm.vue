<template>
  <div v-loading="Data.loading">
    <el-form
      :model="Data.basicForm"
      label-width="140px"
      :rules="Data.rules"
      ref="formRef"
      v-if="route.name === 'createReview' || route.name === 'editReview' || route.query.workItemName === '重新提交'"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="评审名称:">
            <el-input v-model="Data.basicForm.reviewName" :disabled="true" placeholder="自动获取默认值" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="评审编号:">
            <el-input v-model="Data.basicForm.reviewNumber" :disabled="true" placeholder="自动获取默认值" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="流程类型:" prop="processType">
            <el-radio-group
              v-model="Data.basicForm.processType"
              @change="handleProcessType"
              :disabled="route.query.workItemName === '重新提交' && route.query.fromTabName !== '代办流程'"
            >
              <el-radio :label="item.label" v-for="(item, index) in Data.processPointList" :key="index" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="完成标准:">
            <el-input v-model="Data.basicForm.exitStandard" :disabled="true" placeholder="自动获取默认值" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="技术评审点:" prop="reviewPoint">
            <el-radio-group v-model="Data.basicForm.reviewPoint" @change="handleReviewPoint" :disabled="route.query.workItemName === '重新提交'">
              <el-radio :label="item" v-for="(item, index) in Data.reviewPointList" :key="index" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划评审时间:">
            <el-date-picker
              v-model="Data.basicForm.planReviewTime"
              type="date"
              placeholder=""
              style="width: 100%"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :disabled="route.query.fromTabName === '已完成流程' ? true : false"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="评审类型:" prop="reviewType">
            <el-radio-group v-model="Data.basicForm.reviewType" @change="handleReviewType" :disabled="route.query.fromTabName === '已完成流程' ? true : false">
              <el-radio label="会议评审" />
              <el-radio label="流程评审" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="启动条件:">
            <el-input v-model="Data.basicForm.precondition" :disabled="true" placeholder="自动获取默认值" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="订货号:" prop="orderNumber">
            <el-select
              v-model="Data.basicForm.orderNumber"
              placeholder=""
              style="width: 100%"
              clearable
              :fit-input-width="true"
              multiple
              @change="handleOrder"
              :disabled="route.query.fromTabName === '已完成流程' ? true : false"
            >
              <el-option :label="item.label" :value="item.value" v-for="(item, index) in Data.orderNumberList" :key="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目名称:">
            <el-input v-model="Data.basicForm.projectName" :disabled="true" placeholder="自动获取默认值" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目类型:">
            <el-input v-model="Data.basicForm.projectType" :disabled="true" placeholder="自动获取默认值" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开发背景:">
            <el-input v-model="Data.basicForm.developmentReason" :disabled="true" placeholder="自动获取默认值" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 查看或者走流程 -->
    <el-form :model="Data.basicForm" ref="formRef" v-else label-width="120px">
      <el-row :gutter="20" style="margin-bottom: -12px; margin-left: -28px">
        <el-col :span="12">
          <el-form-item label="项目类型:">
            <span>{{ Data.basicForm.projectType }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开发背景:">
            <span>{{ Data.basicForm.description }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        style="margin-bottom: -12px; margin-left: -28px"
        :gutter="20"
        v-if="route.query.workItemName === '评审' || route.query.workItemName === '审阅' || route.query.workItemName === '批准' || route.query.workItemName === '通知'"
      >
        <el-form-item label="评审类型:" style="margin-left: 10px">
          <span>{{ Data.basicForm.reviewType }}</span>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { defineExpose } from 'vue';

const api = window.$api;
const formRef = ref();
const route = useRoute();
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  editFlag: {
    type: Boolean,
    default: true,
  },
  examFlag: {
    type: Boolean,
    default: false,
  },
});
const Data = reactive({
  loading: false,
  oid: route.query.processOID ? JSON.parse(sessionStorage.getItem('taskProject'))?.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  basicForm: {
    reviewName: '',
    reviewNumber: '',
    processType: '',
    exitStandard: '',
    reviewPoint: '',
    planReviewTime: '',
    reviewType: '会议评审',
    precondition: '',
    orderNumber: [],
    projectName: '',
    projectType: '',
    developmentReason: '',
    oid: route.query.processOID ? JSON.parse(sessionStorage.getItem('taskProject'))?.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  },
  rules: {
    processType: [{ required: true, message: '请选择流程类型', trigger: 'blur' }],
    reviewPoint: [{ required: true, message: '请选择技术评审点', trigger: 'blur' }],
    // planReviewTime: [{ required: true, message: '请选择计划评审时间', trigger: 'blur' }],
    reviewType: [{ required: true, message: '请选择评审类型', trigger: 'blur' }],
    orderNumber: [{ required: true, message: '请选择订货号', trigger: 'blur' }],
  },
  orderNumberList: [], //订货号
  reviewPointList: [], // 技术评审点
  processPointList: [], // 流程类型
});
onMounted(() => {
  props.isEdit ? getBaseInform() : '';
  nextTick(() => {
    handleQuerayData();
  });
});
// 编辑-获取基本信息
const getBaseInform = () => {
  api.reviewApi.getSdlgReviewData({ oid: route.query.oid }).then((res) => {
    if (res.success) {
      Data.basicForm = Object.assign({}, res.data);
      Data.basicForm.orderNumber = Data.basicForm.orderNumber.split(',');
      sessionStorage.setItem('basicForm', JSON.stringify(Data.basicForm));
    }
  });
};
// 获取基本信息部分数据
const handleQuerayData = () => {
  Data.loading = true;
  Data.orderNumberList = [];
  // 获取订货号
  api.reviewApi.getOrderNumberList({ oid: Data.oid }).then((res) => {
    if (res.success) {
      res.data.forEach((item) => {
        let obj = {
          id: item.id,
          label: item.name,
          value: item.number,
        };
        Data.orderNumberList.push(obj);
        if (route.name === 'createReview') {
          // 创建评审默认全选
          Data.basicForm.orderNumber.push(item.number);
          sessionStorage.setItem('orderNumber', JSON.stringify(Data.basicForm.orderNumber));
        }
        // 编辑评审选中已存
        Data.orderNumberList.forEach((item) => {
          if (item.value === Data.basicForm.orderNumber) {
            Data.basicForm.orderNumber = [item.value];
          }
        });
      });
    } else {
      Data.loading = false;
    }
  });
  //流程类型
  api.reviewApi.getSdlgReviewConfig({ oid: Data.oid, reviewConfKey: 'piproject' }).then((res) => {
    let data = JSON.parse(res.data);
    if (res.success) {
      data.processType.forEach((item) => {
        let obj = {
          name: item.name,
          label: item.label,
          value: item.label,
        };
        Data.processPointList.push(obj);
        route.name === 'createReview'
          ? (Data.basicForm.processType = Data.processPointList[0].label)
          : (Data.basicForm.processType = JSON.parse(sessionStorage.getItem('basicForm')).processType);
        Data.basicForm.projectName = data.projectName;
        Data.basicForm.projectType = data.projectType;
        Data.basicForm.developmentReason = data.description;
        handleProcessType(Data.basicForm.processType);
        Data.loading = false;
      });
    } else {
      window.$message.error(res.message);
      Data.loading = false;
    }
  });
};
// 流程类型选择
const handleProcessType = (val) => {
  let params = {
    oid: Data.oid,
    reviewConfKey: 'piproject',
    reviewType: val,
  };
  api.reviewApi.getSdlgReviewPoint(params).then((res) => {
    let data = JSON.parse(res.data);
    res.success ? (Data.reviewPointList = data.reviewPoint) : (Data.reviewPointList = []);
  });
  emit('processType', Data.basicForm.processType);
};
// 技术评审点选择
const handleReviewPoint = () => {
  let params = {
    oid: Data.oid,
    reviewConfKey: 'piproject',
    reviewPoint: Data.basicForm.processType + '-' + Data.basicForm.reviewPoint,
  };
  api.reviewApi.getSdlgReviewByPoint(params).then((res) => {
    let data = JSON.parse(res.data);
    if (res.success) {
      Data.basicForm.exitStandard = data.exitStandard;
      Data.basicForm.precondition = data.precondition;
      Data.basicForm.reviewName = data.reviewName;
    }
  });
  emit('reviewPoint', Data.basicForm.reviewPoint);
};
// 评审类型选择
const handleReviewType = () => {
  emit('reviewType', Data.basicForm.reviewType);
};
// 订货号选择
const handleOrder = () => {
  emit('order', Data.basicForm.orderNumber);
  sessionStorage.setItem('orderNumber', JSON.stringify(Data.basicForm.orderNumber));
};
// 暴露Data和方法
defineExpose({ Data });
const emit = defineEmits(['processType', 'reviewPoint', 'reviewType']);
</script>

<style lang="less" scoped>
:deep(.el-select-dropdown) {
  width: 500px;
  color: #333;
}
</style>
