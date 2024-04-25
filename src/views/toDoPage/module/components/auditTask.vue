<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-11-13 09:21:42
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-16 15:39:55
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\toDoPage\module\auditTask.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="auditTask">
    <div class="title">【活动】-{{ activeName }}</div>
    <section class="section-container">
      <objectInfo :detailLayout="detailLayout" :column="3"></objectInfo>
    </section>
    <section class="section-container">
      <div class="title">
        <el-button type="primary" v-if="state !== '待审核'" @click="startProcess">启动签审</el-button>
      </div>
      <NewPiTable :isShowSetting="false" :columns="columns" :data="data" @selectionChange="changeSelect" :selectable="true">
        <template #subjectName="scope">
          <div v-if="scope.row.subjectName">
            {{ scope.row.subjectName }}
            <el-tooltip content="预览" placement="top">
              <el-icon v-prview="{ id: scope.row.subjectOid, name: scope.row.fileName }" class="iconClose"><View /></el-icon>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-icon @click="deleteSubject(scope)" class="iconClose"><CircleClose /></el-icon>
            </el-tooltip>
          </div>
          <div v-else><el-button type="primary" @click="uploadFile(scope)">上传</el-button></div>
        </template>
      </NewPiTable>
    </section>
    <section class="section-container">
      <div class="title">工时汇报</div>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="state === '待审核' ? '' : rules" label-width="180px" label-position="right" class="demo-ruleForm" status-icon>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="汇报日期：" prop="reportDate">
              <el-date-picker v-model="ruleForm.reportDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择日期" style="width: 100%" :disabled="state === '待审核'">
                <template #default="cell">
                  <div class="cell" :class="{ current: cell.isCurrent }">
                    <span v-if="isHoliday(cell)" class="holiday" />
                    <span class="text">{{ cell.text }}</span>
                  </div>
                </template>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="完成率（%）：" prop="percent_workcomplete">
              <!-- <el-input v-model="ruleForm.percent_workcomplete" /> -->
              <el-input-number v-model="ruleForm.percent_workcomplete" :min="0" :max="100" controls-position="right" :disabled="state === '待审核'" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="正常工时：" prop="normalWorkHour">
              <!-- <el-input v-model="ruleForm.normalWorkHour" /> -->
              <el-input-number v-model="ruleForm.normalWorkHour" :min="0" :max="8" controls-position="right" :disabled="state === '待审核'" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="完成百分比：">
              <el-input v-model="completePercent" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="额外工时：" prop="extraWorkHour">
              <!-- <el-input v-model="ruleForm.extraWorkHour" /> -->
              <el-input-number v-model="ruleForm.extraWorkHour" :min="0" :max="4" controls-position="right" :disabled="state === '待审核'" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="工作内容：" prop="comment">
              <el-input v-model="ruleForm.comment" placeholder="请输入" type="textarea" style="width: 400px" :disabled="state === '待审核'" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <div class="title">
        申请完成
      </div>
      <div class="label">
        完成百分比：
      </div>
      <el-input v-model="value1" placeholder="请输入" style="width: 200px"/>
      <div class="label">
        计划评审时间：
      </div>
      <el-input v-model="input" placeholder="请输入" style="width: 200px"/>
      <div class="label">
        完成情况说明：
      </div>
      <el-input v-model="value2" placeholder="请输入" type="textarea" style="width: 400px"/> -->
    </section>
    <!-- 上传文件弹框 -->
    <addObjectDialog
      :title="'上传交付物'"
      ref="addObjectUpload"
      :isShow="addObjectDialog"
      :moduleType="'planDeliver'"
      :isDefaultPosition="isDefaultPosition"
      :isDefaultType="isDefaultType"
      v-model:close="addObjectDialog"
      @confirm="addObjectDialogConfirm"
      :simpleOid="simpleOid"
      :isTask="true"
      :oid="projectOid"
    ></addObjectDialog>
  </div>
</template>
<script>
import objectInfo from '@/components/objectInfo/objectInfo.vue';
import NewPiTable from '@/components/common/table/newPiTable.vue';
import addObjectDialog from '@/views/projectFiles/modules/addObjectDialog.vue';
import { useDetailHandler } from '@/hooks';
export default {
  components: { objectInfo, NewPiTable, addObjectDialog },
  props: {
    oid: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    holidays: {
      type: Array,
      default: () => ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04'],
    },
    projectOid: {
      type: String,
      default: '',
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
      data: [
        // {
        //   name: '1111',
        // },
      ],
      selectArr: [],
      ruleForm: {
        reportDate: '',
      },
      completePercent: 0,
      rules: {
        percent_workcomplete: [
          { required: true, message: '请输入', trigger: 'blur' },
          // { type: 'number', message: '请输入数字' },
        ],
        normalWorkHour: [
          { required: true, message: '请输入', trigger: 'blur' },
          // { type: 'number', message: '请输入数字' },
        ],
        extraWorkHour: [
          { required: false, message: '请输入', trigger: 'blur' },
          // { type: 'number', message: '请输入数字' },
        ],
        comment: [{ required: true, message: '请输入', trigger: 'blur' }],
        reportDate: [{ required: true, message: '请输入', trigger: 'change' }],
        holidays: [],
      },
      addObjectDialog: false,
      userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),
      currentObjName: '',
      currentObjOid: '',
      isDefaultPosition: '',
      isDefaultType: '',
      simpleOid: '',
    };
  },
  mounted() {
    // this.getTaskBaseInfo();
    // this.getDeliverable();
    this.ruleForm.reportDate = this.getNowTime();
    // this.getApproveResourceTime();
  },
  watch: {
    'ruleForm.reportDate': {
      handler(n) {
        if (n) {
          this.getPlanActivityHours();
        } else {
          this.completePercent = 0;
        }
      },
    },
  },
  methods: {
    changeSelect(val) {
      this.selectArr = val;
    },
    // 删除交付物文档
    deleteSubject(scope) {
      window.$ElMessageBox
        .confirm(`请确认是否删除交付物`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          let datas = {
            deliverableOid: scope.row.oid,
            deliverableName: scope.row.name,
            deliverableType: scope.row.deliverableType,
            objectOid: '',
            operateUser: this.userInfo.username,
          };
          window.$api.planApi.updateDeliverable(datas).then((res) => {
            if (res.success) {
              this.getDeliverable();
            } else {
              window.$message.error(res.message);
            }
          });
        })
        .catch(() => {});
    },
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
          this.$success.error(res.message);
        }
      });
    },
    // 获取交付物
    getDeliverable() {
      window.$api.toDoApi.getDeliverableByObject({ oid: this.oid }).then((res) => {
        if (res.success) {
          this.data = res.data;
        } else {
          this.$success.error(res.message);
        }
      });
    },
    // 查询资源分配汇报工时
    getPlanActivityHours() {
      window.$api.toDoApi.getPlanActivityResourceHours({ oid: this.oid, reportDate: this.ruleForm.reportDate }).then((res) => {
        if (res.success) {
          res.data.forEach((item) => {
            if (item.label === '完成百分比') {
              this.completePercent = Number(item.displayValue);
            } else if (item.label === '汇报日期') {
              this.ruleForm.reportDate = item.displayValue;
            } else if (item.label === '完成率') {
              this.ruleForm.percent_workcomplete = Number(item.displayValue);
            } else if (item.label === '正常工时') {
              this.ruleForm.normalWorkHour = Number(item.displayValue);
            } else if (item.label === '额外工时') {
              this.ruleForm.extraWorkHour = Number(item.displayValue);
            } else if (item.label === '工作内容') {
              this.ruleForm.comment = item.displayValue.trim();
            }
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getNowTime() {
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      month = month + 1;
      month = month.toString().padStart(2, '0');
      date = date.toString().padStart(2, '0');
      var defaultDate = `${year}-${month}-${date}`;
      return defaultDate;
    },
    // 判断是否是已填报任务
    isHoliday({ dayjs }) {
      return this.holidays.includes(dayjs.format('YYYY-MM-DD'));
    },
    // 上传文件
    addObjectDialogConfirm(val, type, uploadData) {
      this.$refs.addObjectUpload.Data.isLoading = true;
      if (type === 'linkFile') {
        let deliverableType = '';
        if (val[0].type === 'WTDocument') {
          deliverableType = 'wt.doc.WTDocument';
        } else if (val[0].type === 'WTPart') {
          deliverableType = 'wt.part.WTPart';
        } else if (val[0].type === 'EPMDocument') {
          deliverableType = 'wt.epm.EPMDocument';
        } else if (val[0].type === 'WTChangeOrder2') {
          deliverableType = 'wt.change2.WTChangeOrder2';
        }
        let datas = {
          deliverableOid: this.currentObjOid,
          deliverableName: this.currentObjName,
          deliverableType: deliverableType,
          objectOid: val[0].oidOrVid,
          operateUser: this.userInfo.username,
        };
        window.$api.planApi.updateDeliverable(datas).then((res) => {
          if (res.success) {
            this.$refs.addObjectUpload.Data.isLoading = false;
            window.$message.success('上传成功');
            this.addObjectDialog = false;
            this.getDeliverable();
          } else {
            this.$refs.addObjectUpload.Data.isLoading = false;
            window.$message.error(res.message);
          }
        });
      } else if (type === 'uploadFile') {
        let datas = {
          deliverableOid: this.currentObjOid,
          deliverableName: this.currentObjName,
          docType: uploadData.value.type,
          folderOid: val['attributes']['folder.id'],
          operateUser: this.userInfo.username,
          file: val['files'],
          deliverableType: 'wt.doc.WTDocument',
          fileName: val['attributes']['name'],
          smallDocType: val['attributes']['SmallDocType'],
        };
        window.$api.planApi.updateDeliverableAndDoc(datas).then((res) => {
          if (res.success) {
            this.$refs.addObjectUpload.Data.isLoading = false;
            window.$message.success('上传成功');
            this.addObjectDialog = false;
            this.getDeliverable();
          } else {
            this.$refs.addObjectUpload.Data.isLoading = false;
            this.addObjectDialog = false;
            window.$message.error(res.message);
          }
        });
      }
      // this.addObjectDialog = false;
      // this.getDeliverable();
    },
    uploadFile(scope) {
      window.$api.planApi.getParentActivity({ oid: scope.row.activityOid }).then((res) => {
        if (res.success) {
          this.isDefaultPosition = res.data.activityName;
          this.isDefaultType = scope.row.deliverableType ? scope.row.deliverableType : '';
          this.currentObjOid = scope.row.oid;
          this.currentObjName = scope.row.name;
          this.addObjectDialog = true;
          this.simpleOid = scope.row.templateNumber;
        } else {
          window.$message.error(res.message);
        }
      });
    },
    // 启动签审
    startProcess() {
      if (this.selectArr.length === 1) {
        if (this.selectArr[0].subjectOid) {
          if (this.selectArr[0].subjectOid.includes('WTDocument')) {
            this.selectArr[0].oid = this.selectArr[0].subjectOid;
            useDetailHandler.goApprove(this.selectArr[0]);
          } else {
            window.$message.error('该条交付物不可启动签审');
          }
        } else {
          window.$message.error('请先上传交付物');
        }
      } else {
        window.$message.error('请选择一条交付物启动签审');
      }
    },
  },
};
</script>
<style scoped lang="scss">
.auditTask {
  .title {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    margin-bottom: 10px;
    font-weight: 550;
  }
  .section-container {
    .title {
      font-size: 16px;
      font-weight: 550;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      margin-top: 10px;
    }
    .label {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
      padding: 20px 0 10px 0;
    }
    .iconClose {
      font-size: 14px;
      color: #626aef;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  :deep(.el-tabs__content) {
    margin-top: 20px;
  }
}
.cell {
  height: 30px;
  padding: 3px 0;
  box-sizing: border-box;
}
.cell .text {
  width: 24px;
  height: 24px;
  display: block;
  margin: 0 auto;
  line-height: 24px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
}
.cell.current .text {
  background: #626aef;
  color: #fff;
}
.cell .holiday {
  position: absolute;
  width: 6px;
  height: 6px;
  background: red;
  border-radius: 50%;
  // top: 0px;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
