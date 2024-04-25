<template>
  <div>
    <section class="form-box">
      <el-collapse v-model="collapseVal">
        <el-collapse-item title="基本信息" name="base">
          <div class="form-row">
            <div class="form-label">
              {{ (type === 'add' && !info) || (type === 'edit' && info?.level === 0) ? '计划名称' : '任务名称' }}
            </div>
            <div class="form-content">
              <el-input style="width: 260px" v-model="formData.taskName"></el-input>
            </div>
          </div>
          <div class="form-row" v-if="!hasChild || type === 'add'">
            <div class="form-label">活动类别</div>
            <div class="form-content">
              <el-select style="width: 260px" v-model="formData.activityType" clearable>
                <el-option value="Task" label="任务"></el-option>
                <el-option value="Milestone" label="里程碑"></el-option>
              </el-select>
            </div>
          </div>
          <div class="form-row" v-if="!hasChild || type === 'add'">
            <div class="form-label">任务执行人</div>
            <div class="form-content">
              <el-select filterable style="width: 260px" v-model="formData.leader" clearable>
                <el-option v-for="item in leaderList" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
          <div class="form-row" v-if="!hasChild || type === 'add'">
            <div class="form-label">任务审核人</div>
            <div class="form-content">
              <el-select filterable style="width: 260px" v-model="formData.actualReviewer" clearable>
                <el-option v-for="item in reviewerList" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
          <div class="form-row" v-if="!hasChild || type === 'add'">
            <div class="form-label">编辑人</div>
            <div class="form-content">
              <el-select filterable style="width: 260px" v-model="formData.editor" clearable>
                <el-option v-for="item in reviewerList" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-label">目标开始时间</div>
            <div class="form-content">
              <el-date-picker
                v-if="preList.length === 0"
                v-model="formData.start"
                type="date"
                value-format="YYYY-MM-DD"
                :disabled="hasChild && type === 'edit'"
                style="width: 260px"
                :clearable="false"
                @blur="onEditStartConfirm"
                @keyup.enter="onEditStartConfirm"
              />
              <template v-else>受前置任务影响</template>
            </div>
          </div>
          <div class="form-row">
            <div class="form-label">工期</div>
            <div class="form-content">
              <el-input
                v-model="formData.duration"
                style="width: 260px"
                :disabled="hasChild && type === 'edit'"
                type="number"
                :min="1"
                @blur="onEditDurationConfirm"
                @keyup.enter="onEditDurationConfirm"
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-label">目标完成时间</div>
            <div class="form-content">
              <el-date-picker
                v-model="formData.deadline"
                type="date"
                value-format="YYYY-MM-DD"
                :disabled="hasChild && type === 'edit'"
                style="width: 260px"
                :clearable="false"
                @blur="onEditDeadlineConfirm"
                @keyup.enter="onEditDeadlineConfirm"
              />
            </div>
          </div>
          <div class="form-row" v-if="type === 'add' && info && info.uid && info.level !== 0">
            <div class="form-label">子任务</div>
            <div class="form-content">
              <el-switch v-model="level" size="small"></el-switch>
              <span class="text">{{ level ? '子任务' : '平行任务' }}</span>
            </div>
          </div>
          <div class="form-row" v-if="info && info.uid">
            <div class="form-label">父任务</div>
            <div class="form-content">
              {{ level ? insertObj?.taskName : insertObj?.fatherNode }}
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="前置任务" name="pre" v-if="(!hasChild || type === 'add') && info">
          <div v-for="(item, index) in preList" class="list-row">
            <template v-if="item.isNew || (previousFlag !== true && index === previousFlag)">
              <el-row>
                <el-col :span="7">
                  <el-select placeholder="任务" filterable v-model="tempObj.name" @change="changeTask($event, tempObj)" style="width: 190px">
                    <el-option v-for="item in filterList" :label="item.taskName" :value="item.taskName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select placeholder="规则" style="width: 160px" v-model="tempObj.type">
                    <el-option v-for="item in typeOptions" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="tempObj.days" type="number" />
                </el-col>
                <el-col :offset="1" :span="5">
                  <el-space class="btn-sapce-box" v-if="nextFlag === false && (item.isNew || (previousFlag !== true && index === previousFlag))">
                    <el-link :icon="Check" :underline="false" @click="previousConfirm(item)">确定</el-link>
                    <el-link :icon="Close" :underline="false" @click="previousCancel">取消</el-link>
                  </el-space>
                </el-col>
              </el-row>
            </template>
            <template v-else>
              <el-row>
                <el-col :span="7" class="text-col">{{ item.name }}</el-col>
                <el-col :span="6" class="text-col">{{ item.type }}</el-col>
                <el-col :span="3" class="text-col">{{ item.days }}</el-col>
                <el-col :offset="1" :span="5">
                  <el-space v-if="nextFlag === false && !item.isNew && !previousFlag">
                    <el-link :icon="Edit" :underline="false" @click="previousEdit(item, index)">编辑</el-link>
                    <el-link :icon="Delete" :underline="false" @click="previousDelete(item, index)">删除</el-link>
                  </el-space>
                </el-col>
              </el-row>
            </template>
          </div>
          <div class="btn-box">
            <el-link v-if="previousFlag === false && nextFlag === false" :icon="Plus" :underline="false" @click="addPrevious">新增</el-link>
          </div>
        </el-collapse-item>
        <el-collapse-item title="后置任务" name="post" v-if="(!hasChild || type === 'add') && info">
          <div v-for="(item, index) in postList" class="list-row">
            <template v-if="item.isNew || (nextFlag !== true && index === nextFlag)">
              <el-row>
                <el-col :span="7">
                  <el-select placeholder="任务" filterable v-model="tempObj.name" @change="changeTask($event, tempObj)" style="width: 190px">
                    <el-option v-for="item in filterList" :label="item.taskName" :value="item.taskName"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select placeholder="规则" style="width: 160px" v-model="tempObj.type">
                    <el-option v-for="item in typeOptions" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="tempObj.days" type="number" />
                </el-col>
                <el-col :offset="1" :span="5">
                  <el-space class="btn-sapce-box" v-if="item.isNew || (nextFlag !== true && index === nextFlag)">
                    <el-link :icon="Check" :underline="false" @click="nextConfirm(item)">确定</el-link>
                    <el-link :icon="Close" :underline="false" @click="nextCancel">取消</el-link>
                  </el-space>
                </el-col>
              </el-row>
            </template>
            <template v-else>
              <el-row>
                <el-col :span="7" class="text-col">{{ item.name }}</el-col>
                <el-col :span="6" class="text-col">{{ item.type }}</el-col>
                <el-col :span="3" class="text-col">{{ item.days }}</el-col>
                <el-col :offset="1" :span="5">
                  <el-space v-if="previousFlag === false && !item.isNew && !nextFlag">
                    <el-link :icon="Edit" :underline="false" @click="nextEdit(item, index)">编辑</el-link>
                    <el-link :icon="Delete" :underline="false" @click="nextDelete(item, index)">删除</el-link>
                  </el-space>
                </el-col>
              </el-row>
            </template>
          </div>
          <div class="btn-box">
            <el-link v-if="previousFlag === false && nextFlag === false" :icon="Plus" :underline="false" @click="addNext">新增</el-link>
          </div>
        </el-collapse-item>
        <el-collapse-item title="交付物" name="file" v-if="info && info.level !== 0 && info.activityType !== 'WBS' && info.taskOid && type !== 'add'">
          <deliverable-comp ref="deliverableCompRef" :oid="info.taskOid" @updateDeliver="updateDeliverInfo"></deliverable-comp>
        </el-collapse-item>
      </el-collapse>
    </section>
    <div style="flex: auto; margintop: 12px">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" v-if="!previousFlag && !nextFlag && !fileFlag" @click="onConfirm">确认</el-button>
    </div>
  </div>
</template>

<script>
import { shallowRef } from 'vue';
import { Plus, Check, Close, Edit, Delete } from '@element-plus/icons-vue';
import { randomString } from '@/utils/utils.js';
import * as _ from 'lodash';
import dayjs from 'dayjs';
import deliverableComp from './deliverableComp.vue'
export default {
  props: {
    info: {
      type: Object,
      default: () => {},
    },
    leaderList: Array,
    reviewerList: Array,
    type: String,
    taskList: Array,
    update: Boolean,
    hasChild: {
      type: Boolean,
      default: false,
    },
    workday: Array,
    holiday: Array,
  },
  components: {
    deliverableComp
  },
  data() {
    return {
      Plus: shallowRef(Plus),
      Check: shallowRef(Check),
      Close: shallowRef(Close),
      Edit: shallowRef(Edit),
      Delete: shallowRef(Delete),
      formData: {},
      level: false,
      insertObj: {},
      collapseVal: ['base', 'pre', 'post', 'file'],
      preList: [],
      postList: [],
      fileList: [],
      tempObj: {},
      typeOptions: [
        {
          label: '结束到开始(FS)',
          value: 'FS',
        },
        {
          label: '开始到开始(SS)',
          value: 'SS',
        },
        {
          label: '结束到结束(FF)',
          value: 'FF',
        },
        {
          label: '开始到结束(SF)',
          value: 'SF',
        },
      ],
      previousFlag: false,
      nextFlag: false,
      newFileName: '',
      fileFlag: false,
    };
  },
  mounted() {},
  watch: {
    update: {
      handler(val) {
        if (val) {
          this.insertObj = _.cloneDeep(this.info);
          this.previousFlag = false;
          this.nextFlag = false;
          if (this.type === 'add') {
            if (this.insertObj && this.insertObj.start) {
              this.formData = {
                start: this.insertObj.start,
                duration: 1,
                deadline: this.insertObj.start,
                leader: '',
                actualReviewer: '',
                editor: '',
                activityType: 'Task'
              };
            } else {
              this.formData = {
                start: dayjs().format('YYYY-MM-DD'),
                duration: 1,
                deadline: dayjs().format('YYYY-MM-DD'),
                leader: '',
                actualReviewer: '',
                editor: '',
                activityType: 'Task'
              };
            }
            this.preList = [];
            this.postList = [];
            this.fileList = [];
            this.level = true;
          } else if (this.type === 'edit') {
            this.preList = this.insertObj.previous ? this.insertObj.previous : [];
            this.postList = this.insertObj.next ? this.insertObj.next : [];
            this.fileList = this.insertObj.deliverable;
            this.formData = this.insertObj;
            this.level = false
          }
        }
      },
      immediate: true,
    },
  },
  computed: {
    filterList() {
      // 只有没有子任务的才能关联前后置任务
      let res = this.taskList.filter((item) => {
        // 过滤已经选了的
        let obj = this.preList.findIndex((pre) => pre.id === item.id);
        let obj2 = this.postList.findIndex((post) => post.id === item.id);
        let hasChild = this.checkChild(item);
        // 剔除已经选了的、自己以及有子任务的
        return ((obj === -1 && obj2 === -1) || item.id === this.tempObj.id) && !hasChild && (this.type !== 'edit' || this.info.id !== item.id);
      });
      return res;
    },
  },
  methods: {
    checkChild(obj) {
      // 检测元素是否下挂children 只要看下一个元素是不是他的子
      if (!obj) return false;
      let index = this.taskList.findIndex((item) => item.uid === obj.uid);
      let temp = this.taskList[index + 1] ? this.taskList[index + 1] : null;
      if (temp && temp.father === obj.uid) {
        return true;
      } else {
        return false;
      }
    },
    getType (val) {
      switch (val) {
        case 'wt.doc.WTDocument': {
          return '文档'
        }
        case 'wt.part.WTPart': {
          return '部件'
        }
        case 'wt.epm.EPMDocument': {
          return '图纸'
        }
        case 'wt.change2.WTChangeOrder2': {
          return '更改通告'
        }
        default: {
          return ''
        }
      }
    },
    getIsCut (val) {
      if (val === 'false') {
        return '否'
      } else if (val === 'true') {
        return '是'
      } else {
        return val
      }
    },
    checkDeteil(obj) {
      const aim = this.$router.resolve({ name: 'fileDetail', query: { oid: obj.subjectOid, foldOid: obj.foldOid } });
      window.open(aim.href, '_blank')
    },
    onCancel() {
      this.$emit('propCancel');
    },
    updateDeliverInfo (val) {
      this.fileList = val
    },
    onConfirm() {
      if (!this.formData.taskName) return this.$message.warning('请填写任务名称');
      if (this.nextFlag || this.previousFlag || this.fileFlag) return;
      let obj = {};
      if (this.type === 'add') {
        if (this.info && this.info.uid) {
          // 插入任务
          obj = {
            leader: this.formData.leader,
            taskName: this.formData.taskName,
            deliverable: this.fileList,
            start: this.formData.start,
            duration: this.formData.duration,
            deadline: this.formData.deadline,
            actualReviewer: this.formData.actualReviewer,
            editor: this.formData.editor,
            activityType: this.formData.activityType,
            fold: false,
            hide: false,
            planStatus: '',
            planOid: this.info.planOid,
            fatherNode: this.level ? this.info.taskName : this.info.fatherNode,
            father: this.level ? this.info.uid : this.info.father,
            level: this.level ? this.info.level + 1 : this.info.level,
            uid: randomString(16),
            id: '',
            next: this.postList,
            previous: this.preList,
            index: 0,
          };
        } else {
          // 创建任务
          obj = {
            leader: this.formData.leader,
            taskName: this.formData.taskName,
            deliverable: this.fileList,
            start: this.formData.start,
            duration: this.formData.duration,
            deadline: this.formData.deadline,
            actualReviewer: this.formData.actualReviewer,
            editor: this.formData.editor,
            activityType: this.formData.activityType,
            fold: false,
            hide: false,
            planStatus: '',
            planOid: 'new_' + randomString(8),
            fatherNode: '',
            father: '',
            level: 0,
            uid: randomString(16),
            id: '',
            next: this.postList,
            previous: this.preList,
            index: 0,
          };
        }
      } else { // 编辑
        obj = {
          leader: this.formData.leader,
          taskName: this.formData.taskName,
          deliverable: this.fileList,
          start: this.formData.start,
          editor: this.formData.editor,
          duration: this.formData.duration,
          deadline: this.formData.deadline,
          actualReviewer: this.formData.actualReviewer,
          editor: this.formData.editor,
          fold: false,
          hide: false,
          activityType: this.formData.activityType,
          taskOid: this.info.taskOid,
          planStatus: this.formData.planStatus,
          planOid: this.info.planOid,
          fatherNode: this.level ? this.info.taskName : this.info.fatherNode,
          father: this.level ? this.info.uid : this.info.father,
          level: this.level ? this.info.level + 1 : this.info.level,
          id: this.info.id,
          uid: this.info.uid,
          next: this.postList,
          previous: this.preList,
          index: this.info.index,
        };
      }
      this.$emit('propConfirm', obj);
    },
    changeTask(val, obj) {
      let taskObj = this.taskList.find((item) => item.taskName === val);
      obj.id = taskObj.uid;
    },
    addPrevious() {
      this.tempObj = {
        name: '',
        id: '',
        type: 'FS',
        days: 0,
        isNew: true,
      };
      this.preList.push(this.tempObj);
      this.previousFlag = true;
    },
    previousConfirm(obj) {
      if (this.tempObj.isNew) {
        if (!this.tempObj.name) return this.$message.warning('请选择任务');
        delete this.tempObj.isNew;
        this.previousFlag = false;
      } else {
        this.previousFlag = false;
        obj.name = this.tempObj.name;
        obj.id = this.tempObj.uid;
        obj.type = this.tempObj.type;
        obj.days = this.tempObj.days;
        this.tempObj = {};
      }
    },
    previousCancel() {
      if (this.tempObj.isNew) {
        this.preList.pop();
        this.previousFlag = false;
      } else {
        this.tempObj = {};
        this.previousFlag = false;
      }
    },
    previousEdit(obj, index) {
      this.tempObj = _.cloneDeep(obj);
      this.previousFlag = index;
    },
    previousDelete(obj, index) {
      this.preList.splice(index - 1, 1);
    },
    addNext() {
      this.tempObj = {
        name: '',
        id: '',
        type: 'FS',
        days: 0,
        isNew: true,
      };
      this.postList.push(this.tempObj);
      this.nextFlag = true;
    },
    nextConfirm(obj) {
      if (this.tempObj.isNew) {
        if (!this.tempObj.name) return this.$message.warning('请选择任务');
        delete this.tempObj.isNew;
        this.nextFlag = false;
      } else {
        this.nextFlag = false;
        obj.name = this.tempObj.name;
        obj.id = this.tempObj.uid;
        obj.type = this.tempObj.type;
        obj.days = this.tempObj.days;
        this.tempObj = {};
      }
    },
    nextCancel() {
      if (this.tempObj.isNew) {
        this.postList.pop();
        this.nextFlag = false;
      } else {
        this.tempObj = {};
        this.nextFlag = false;
      }
    },
    nextEdit(obj, index) {
      this.tempObj = _.cloneDeep(obj);
      this.nextFlag = index;
    },
    nextDelete(obj, index) {
      this.postList.splice(index - 1, 1);
    },
    handleClose(val) {
      this.fileList.splice(this.fileList.indexOf(val), 1);
    },
    inputConfirm() {
      if (this.newFileName) {
        this.fileList.push(this.newFileName);
      }
      this.newFileName = '';
      this.fileFlag = false;
    },
    addFile() {
      this.fileFlag = true;
      this.$nextTick(() => {
        this.$refs.fileInput.focus();
      });
    },
    onEditStartConfirm() {
      if (dayjs(this.formData.start).isAfter(this.formData.deadline)) {
        // 如果大于了 计划完成时间要跟着顺延
        this.formData.duration - 1;
        this.formData.deadline = this.formData.start;
      } else {
        // 如果开始时间不大于完成时间 只改工期
        this.formData.duration = this.calcDuration(this.formData.start, this.formData.deadline);
      }
    },
    onEditDurationConfirm() {
      if (this.formData.duration < 1) {
        this.formData.duration = 1;
      }
      this.formData.deadline = this.calcDate(this.formData.start, this.formData.duration);
    },
    onEditDeadlineConfirm() {
      if (dayjs(this.formData.deadline).isBefore(this.formData.start)) {
        // 完成时间早于开始时间要往前推
        this.formData.duration = 1;
        this.formData.start = this.formData.deadline;
      } else {
        // 如果完成时间不早于开始时间 只改工期
        this.formData.duration = this.calcDuration(this.formData.start, this.formData.deadline);
      }
    },
    calcDuration(start, end) {
      // 计算时间范围内工作日
      start = dayjs(start);
      end = dayjs(end);
      let duration = end.diff(start, 'day') + 1; // 需要加一天
      let val = 0;
      if (duration > 0) {
        for (let i = 0; i < duration; i++) {
          if (
            (start.add(i, 'day').weekday() !== 6 || this.workday.includes(start.add(i, 'day').format('YYYY-MM-DD'))) &&
            (start.add(i, 'day').weekday() !== 0 || this.workday.includes(start.add(i, 'day').format('YYYY-MM-DD'))) &&
            !this.holiday.includes(start.add(i, 'day').format('YYYY-MM-DD'))
          ) {
            val++;
          }
        }
        return val;
      } else {
        duration = -duration;
        for (let i = 0; i < duration; i++) {
          if (
            (start.subtract(i, 'day').weekday() !== 6 || this.workday.includes(start.subtract(i, 'day').format('YYYY-MM-DD'))) &&
            (start.subtract(i, 'day').weekday() !== 0 || this.workday.includes(start.subtract(i, 'day').format('YYYY-MM-DD'))) &&
            !this.holiday.includes(start.subtract(i, 'day').format('YYYY-MM-DD'))
          ) {
            val++;
          }
        }
        return -val;
      }
    },
    calcDate(date, count) {
      // 返回指定日期经过count工作日后的日期moment对象
      count = count - 1; // 1天算同一天
      let res = dayjs(date);
      for (let i = 0; i < count; i++) {
        res = dayjs(res).add(this.calcWorkday(res, 1), 'day');
      }
      return res;
    },
    calcWorkday(date, val) {
      // 计算延后工作日
      // (不是周六 或者 那天是工作日 )(不是周天 或者那天是工作日 )或者那天不是节假日
      if (
        (date.add(val, 'day').weekday() !== 6 || this.workday.includes(date.add(val, 'day').format('YYYY-MM-DD'))) &&
        (date.add(val, 'day').weekday() !== 0 || this.workday.includes(date.add(val, 'day').format('YYYY-MM-DD'))) &&
        !this.holiday.includes(date.add(val, 'day').format('YYYY-MM-DD'))
      ) {
        return val;
      } else {
        // 非工作日+1
        return this.calcWorkday(date, ++val);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-box {
  padding: 12px 16px 12px 20px;
  font-size: var(--el-font-size-base);
  .form-row {
    width: 100%;
    margin-bottom: 10px;
    .form-label {
      width: 120px;
      font-size: var(--el-font-size-base);
      display: inline-block;
      color: #333;
      line-height: 32px;
    }
    .form-content {
      width: calc(100% - 140px);
      height: 32px;
      display: inline-block;
      vertical-align: top;
      color: #666;
      line-height: 32px;
      font-size: var(--el-font-size-base);
      .text {
        margin-left: 8px;
      }
    }
  }
  :deep(.el-collapse) {
    margin-left: -8px;
    .el-collapse-item {
      .el-collapse-item__header {
        background-color: var(--el-fill-color-extra-light);
        font-size: var(--el-font-size-base);
        height: 40px;
        padding-left: 8px;
        font-weight: bold;
      }
      .el-collapse-item__content {
        padding: 12px 8px;
        min-height: 56px;
        .list-row {
          margin-bottom: 6px;
          .text-col {
            padding-left: 6px;
          }
        }
      }
      .btn-sapce-box {
        transform: translateY(4px);
      }
    }
  }
}
</style>