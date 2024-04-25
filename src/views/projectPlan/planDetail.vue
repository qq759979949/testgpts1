<template>
  <div class="plan-detail" v-if="info">
    <section class="title">
      {{ info.taskName }}
      <el-icon class="float-btn" @click="goBack" v-if="id !== activeId"><Back /></el-icon>
    </section>
    <section class="main-box">
      <div class="sub-title">基本信息</div>
      <el-descriptions :column="2">
        <el-descriptions-item v-for="item in layout" :label="item.label" :span="item.span">
          <span v-if="item.key === 'project'">{{ projectName }}</span>
          <span v-else-if="item.key === 'leader'">
            {{ getLeaderVal(info[item.key]) }}
          </span>
          <span v-else-if="item.key === 'activityType'">
            {{ getActivityTypeVal(info[item.key]) }}
          </span>
          <span v-else-if="item.key === 'actualReviewer'">
            {{ getReviewerVal(info[item.key]) }}
          </span>
          <span v-else-if="item.key === 'editor'">
            {{ getReviewerVal(info[item.key]) }}
          </span>
          <span v-else-if="item.key === 'fatherNode'">
            <el-tag v-if="info[item.key]" class="tag-btn" @click="goTask(info.father)">{{ info[item.key] }}</el-tag>
            <span v-else>/</span>
          </span>
          <span v-else-if="item.key === 'previous'" class="task-box">
            <el-space v-if="info[item.key] && info[item.key].length > 0">
              <el-tag v-for="task in info[item.key]" class="tag-btn" @click="goTask(task.id)">{{ task.name }}</el-tag>
            </el-space>
            <span v-else>/</span>
          </span>
          <span v-else-if="item.key === 'next'" class="task-box">
            <el-space v-if="info[item.key] && info[item.key].length > 0">
              <el-tag v-for="task in info[item.key]" class="tag-btn" @click="goTask(task.id)">{{ task.name }}</el-tag>
            </el-space>
            <span v-else>/</span>
          </span>
          <span v-else-if="item.key === 'healthStatus'" class="task-box">
            <div
              class="health-wrapper"
              :style="{
                backgroundColor: getHealthColor(info[item.key]),
              }"
            />
          </span>
          <span v-else>
            {{ info[item.key] }}
          </span>
        </el-descriptions-item>
      </el-descriptions>
    </section>
    <section class="main-box">
      <div class="sub-title">交付物</div>
      <el-table :scroll="false" :data="tableData" style="width: calc(100% - 20px)">
        <el-table-column prop="name" label="交付物要求" />
        <el-table-column prop="deliverableType" label="类型" width="80">
          <template #default="scope">
            {{ getType(scope.row.deliverableType) }}
          </template>
        </el-table-column>
        <el-table-column prop="subjectName" label="交付物">
          <template #default="scope">
            <el-link type="primary" :underline="false" @click="checkDeteil(scope.row)">{{ scope.row.subjectName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="isCut" label="是否裁剪" width="80">
          <template #default="scope">
            {{ getIsCut(scope.row.isCut) }}
          </template>
        </el-table-column>
        <el-table-column prop="subjectState" label="状态" width="80" />
      </el-table>
    </section>
  </div>
</template>

<script>
import planApi from '@/api/plan';
export default {
  props: {
    id: String,
    list: Array,
    leaderList: Array,
    reviewerList: Array,
  },
  data() {
    return {
      projectName: JSON.parse(sessionStorage.getItem('currentProject'))?.projectName, // 项目名称
      activeId: '',
      info: {},
      tableData: [
        // {
        //   name: '产品类/产品需求书(PRD)',
        //   file: '产品需求书',
        //   id: '1',
        // },
      ],
      layout: [
        {
          label: '所属项目',
          key: 'project',
          span: 2,
        },
        {
          label: '执行人',
          key: 'leader',
          span: 1,
        },
        {
          label: '审核人',
          key: 'actualReviewer',
          span: 1,
        },
        {
          label: '编辑人',
          key: 'editor',
          span: 1,
        },
        {
          label: '目标开始时间',
          key: 'start',
          span: 1,
        },
        {
          label: '目标完成时间',
          key: 'deadline',
          span: 1,
        },
        {
          label: '实际开始时间',
          key: 'actualStartTime',
          span: 1,
        },
        {
          label: '实际完成时间',
          key: 'actualEndTime',
          span: 1,
        },
        {
          label: '工期',
          key: 'duration',
          span: 1,
        },
        {
          label: '任务状态',
          key: 'planStatus',
          span: 1,
        },
        {
          label: '上级任务',
          key: 'fatherNode',
          span: 1,
        },
        {
          label: '活动类别',
          key: 'activityType',
          span: 1,
        },
        {
          label: '前置任务',
          key: 'previous',
          span: 2,
        },
        {
          label: '后置任务',
          key: 'next',
          span: 2,
        },
        {
          label: '健康状态',
          key: 'healthStatus',
          span: 1,
        },
        {
          label: '实际创建者',
          key: 'actualCreateUser',
          span: 1,
        },
        {
          label: '创建时间',
          key: 'createStamp',
          span: 1,
        },

        {
          label: '发布人',
          key: 'releasedBy',
          span: 1,
        },
        {
          label: '发布时间',
          key: 'releaseTime',
          span: 1,
        },
        {
          label: '暂停时间',
          key: 'pauseTime',
          span: 1,
        },
        {
          label: '重启时间',
          key: 'restartTime',
          span: 1,
        },
        {
          label: '重新完成时间',
          key: 'refinishTime',
          span: 1,
        },
        {
          label: '上次修改时间',
          key: 'lastModifiedTime',
          span: 1,
        },
        {
          label: '任务代号',
          key: 'taskCode',
          span: 1,
        },
        {
          label: '活动状态',
          key: 'planStatus',
          span: 1,
        },
      ],
    };
  },
  watch: {
    id: {
      handler(val) {
        this.activeId = val;
        this.info = this.list.find((item) => item.uid === val);
        console.log(this.info, 190);
        planApi.getDeliverableByObject({ oid: this.info.taskOid }).then((res) => {
          if (res.success) {
            this.tableData = res.data;
          }
        });
      },
      immediate: true,
    },
    activeId: {
      handler(val) {
        planApi.getDeliverableByObject({ oid: this.info.taskOid }).then((res) => {
          if (res.success) {
            this.tableData = res.data;
          }
        });
      },
      immediate: true,
    },
  },
  methods: {
    getType(val) {
      switch (val) {
        case 'wt.doc.WTDocument': {
          return '文档';
        }
        case 'wt.part.WTPart': {
          return '部件';
        }
        case 'wt.epm.EPMDocument': {
          return '图纸';
        }
        case 'wt.change2.WTChangeOrder2': {
          return '更改通告';
        }
        default: {
          return '';
        }
      }
    },
    getIsCut(val) {
      if (val === 'false') {
        return '否';
      } else if (val === 'true') {
        return '是';
      } else {
        return val;
      }
    },
    getActivityTypeVal(val) {
      if (val === 'Task') {
        return '任务';
      } else if (val === 'Milestone') {
        return '里程碑';
      } else {
        return val;
      }
    },
    goTask(id) {
      this.activeId = id;
      this.info = this.list.find((item) => item.uid === id);
    },
    goBack() {
      this.activeId = this.id;
      this.info = this.list.find((item) => item.uid === this.activeId);
    },
    checkDeteil(obj) {
      const aim = this.$router.resolve({ name: 'fileDetail', query: { oid: obj.subjectOid, foldOid: obj.foldOid } });
      window.open(aim.href, '_blank');
    },
    getLeaderVal(id) {
      let res = this.leaderList.find((item) => item.value === id);
      if (res) {
        return res.label;
      } else {
        return '';
      }
    },
    getReviewerVal(id) {
      let res = this.reviewerList.find((item) => item.value === id);
      if (res) {
        return res.data.realname;
      } else {
        return '';
      }
    },
    // 健康状态
    getHealthColor(key) {
      let healthColor = [
        {
          key: 'UNAVAILABLE',
          value: '#D9D9D9',
        },
        {
          key: 'GREEN',
          value: '#72C040 ',
        },
        {
          key: 'RED',
          value: '#E23C39',
        },
        {
          key: 'YELLOW',
          value: '#F0AE41',
        },
      ];
      const color = healthColor.find((i) => i.key === key)?.value;
      return color;
    },
  },
};
</script>

<style lang="scss" scoped>
.plan-detail {
  padding-left: 8px;
  .title {
    font-size: var(--el-font-size-large);
    color: #333;
    font-weight: bold;
    margin-bottom: 20px;
    .float-btn {
      float: right;
      cursor: pointer;
      margin-right: 10px;
    }
  }
  .tag-btn {
    cursor: pointer;
  }
  .sub-title {
    font-size: var(--el-font-size-medium);
    color: #333;
    font-weight: bold;
    padding: 4px 12px;
    margin: 16px 0;
    position: relative;
    background: var(--el-border-color-extra-light);
  }
  .sub-title::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--el-color-primary-light-3);
  }
  :deep(.el-descriptions__label) {
    width: 108px;
    display: inline-block;
  }
  .main-box {
    .el-descriptions {
      padding: 0 12px;
      margin-bottom: 24px;
      :deep(.el-descriptions__body) {
        .el-descriptions__table {
          .el-descriptions__cell {
            padding-bottom: 8px;
            font-size: var(--el-font-size-base);
          }
          .task-box {
            width: calc(100% - 140px);
            display: inline-block;
          }
        }
        .health-wrapper {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }
      }
    }
    .el-table {
      margin-left: 8px;
    }
  }
}
</style>