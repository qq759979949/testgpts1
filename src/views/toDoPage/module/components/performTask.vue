<template>
  <div class="performTask" v-loading="loading">
    <div class="title">【活动】-{{ activeName }}</div>
    <section class="section-container">
      <objectInfo :detailLayout="detailLayout" :column="3"></objectInfo>
    </section>
    <section class="section-container">
      <div class="title">交付物</div>
      <PiTable :isShowSetting="false" :columns="columns" :data="data">
        <template #subjectName="scope">
          <div v-if="scope.row.subjectName">
            {{ scope.row.subjectName }}
            <el-tooltip content="预览" placement="top">
              <el-icon v-prview="{ id: scope.row.subjectOid, name: scope.row.name }" class="iconClose"><View /></el-icon>
            </el-tooltip>
          </div>
        </template>
      </PiTable>
    </section>
    <section class="section-container">
      <div class="title">资源工时</div>
      <PiTable :isShowSetting="false" :columns="columns1" :data="data1"></PiTable>
    </section>
    <section class="section-container" v-if="tableName !== 'activedTaskTable'">
      <div class="title">流程处理</div>
      <ProcessSubmit
        :isTask="true"
        ref="processSubmitComp"
        @processSubmit="submit"
        :operationVal="operationVal"
        :radioList="radioList"
        :isHandDetail="tableName === 'excutedTaskTable' ? true : false"
      ></ProcessSubmit>
    </section>
  </div>
</template>
<script>
import objectInfo from '@/components/objectInfo/objectInfo.vue';
import PiTable from '@/components/pdcCustom/PiTable.vue';
import ProcessSubmit from '@/components/process/processSubmit.vue';
export default {
  components: { objectInfo, PiTable, ProcessSubmit },
  props: {
    oid: {
      type: String,
      default: '',
    },
    tableName: {
      type: String,
      default: '',
    },
    operationVal: {
      type: String,
      default: '通过',
    },
    activeName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      detailLayout: [],
      columns: [
        {
          title: '交付物要求',
          dataIndex: 'name',
        },
        {
          title: '交付物',
          dataIndex: 'subjectName',
        },
        {
          title: '是否最新版',
          dataIndex: 'isLatestVersion',
          width: 100,
        },
        {
          title: '交付物状态',
          dataIndex: 'subjectState',
          width: 100,
        },
      ],
      data: [],
      columns1: [
        {
          title: '汇报者',
          dataIndex: 'user',
        },
        {
          title: '资源',
          dataIndex: 'rsrc',
        },
        {
          title: '暂时的常规工时',
          dataIndex: 'pendingHourCount',
          width: 150,
        },
        {
          title: '暂时的加班工时',
          dataIndex: 'pendingOvertimeHourCount',
          width: 150,
        },
        {
          title: '常规工时',
          dataIndex: 'hourCount',
        },
        {
          title: '加班工时',
          dataIndex: 'overtimeHourCount',
        },
        {
          title: '完成百分比',
          dataIndex: 'workCompletePercent',
          width: 150,
        },
        {
          title: '工作内容',
          dataIndex: 'comments',
          width: 150,
        },
        {
          title: '工作日期',
          dataIndex: 'workDate',
        },
        {
          title: '状态',
          dataIndex: 'status',
        },
        {
          title: '创建时间',
          dataIndex: 'createTimestamp',
          width: 150,
        },
      ],
      data1: [],
      radioList: [
        {
          routing: '通过',
          label: '通过',
        },
        {
          routing: '驳回',
          label: '驳回',
        },
      ],
      loading: false,
    };
  },
  // mounted() {
  //   // this.getTaskBaseInfo();
  //   // this.getDeliverable();
  // },
  methods: {
    // 获取基本属性
    getTaskBaseInfo() {
      window.$api.toDoApi.getTaskBaseInfo({ oid: this.oid }).then((res) => {
        if (res.success) {
          this.detailLayout = res.data.map((item) => {
            item.label = `${item.label}：`;
            item.value = item.displayValue;
            return item;
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取交付物
    getDeliverable() {
      window.$api.toDoApi.getDeliverableByObject({ oid: this.oid }).then((res) => {
        if (res.success) {
          this.data = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 审核任务资源工时
    getApproveResourceTime() {
      window.$api.toDoApi.getResourceHours({ oid: this.oid }).then((res) => {
        if (res.success) {
          this.data1 = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 审核任务资源工时
    getApproveResourceAssignmentsPage() {
      window.$api.toDoApi.getApproveResourceAssignmentsPage({ oid: this.oid }).then((res) => {
        if (res.success) {
          res.data.forEach((item) => {
            if (item.label === '正常工时') {
              this.$refs.processSubmitComp.Data.ruleForm.normalWorkHour = item.value ? Number(item.value) : 0;
            } else if (item.label === '额外工时') {
              this.$refs.processSubmitComp.Data.ruleForm.extraWorkHour = item.value ? Number(item.value) : 0;
            } else if (item.label === '审批意见') {
              this.$refs.processSubmitComp.Data.resolution = item.value ? item.value : '';
            }
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 提交任务
    submit(opera) {
      // this.$refs.processSubmitComp.Data.isLoading = true;
      this.loading = true;
      // if (opera === '通过' && (!this.$refs.processSubmit.ruleForm.normalWorkHour || !this.$refs.processSubmit.ruleForm.extraWorkHour)) {
      //   return false;
      // }
      if (opera === '驳回' && !this.$refs.processSubmitComp.Data.ruleForm.percent_workcomplete) {
        this.$message.error('请填写完工率');
        return false;
      }
      const params = {
        oid: this.oid,
        reviewResults: opera === '通过' ? 'PASS' : 'REJECT',
        percentage: opera === '通过' ? '' : this.$refs.processSubmitComp.Data.ruleForm.percent_workcomplete,
        normalWorkHour: opera === '通过' ? this.$refs.processSubmitComp.Data.ruleForm.normalWorkHour : '',
        extraWorkHour: opera === '通过' ? this.$refs.processSubmitComp.Data.ruleForm.extraWorkHour : '',
        description: this.$refs.processSubmitComp.Data.resolution,
      };
      window.$api.toDoApi.approveResourceAssignments(params).then((res) => {
        if (res.success) {
          this.loading = false;
          // this.$refs.processSubmitComp.Data.isLoading = false;
          this.$emit('submitProcess');
        } else {
          this.loading = false;
          // this.$refs.processSubmitComp.Data.isLoading = false;
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.performTask {
  .title {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    margin-bottom: 10px;
    font-weight: 550;
  }
  .iconClose {
    font-size: 14px;
    color: #626aef;
    margin-left: 10px;
    cursor: pointer;
  }
  .section-container {
    .title {
      font-size: 16px;
      font-weight: 550;
      margin-top: 10px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
    }
  }
}
</style>
