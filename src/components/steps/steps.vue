<template>
  <div :class="!isProject ? 'projectStep1' : ''" class="projectSteps">
    <div class="LeftArrow" v-if="leftArrowVisible" @click="leftArrow">
      <el-icon><ArrowLeft /></el-icon>
    </div>
    <el-steps class="stepContent">
      <el-step
        :class="classFun(index)"
        v-for="(item, index) in viewStepList"
        :key="index"
        :status="item.status === '已完成' ? 'finish' : item.status === '未开始' ? '' : 'process'"
      >
        <template v-slot:icon>
          <el-icon v-if="item.status === '已完成'" class="iconName"><CircleCheck /></el-icon>
          <div class="iconNumberActive" v-if="item.status === '进行中'">{{ item.number }}</div>
          <div class="iconNumber" v-if="item.status === '未开始'">{{ item.number }}</div>
          <div :class="isProject ? 'stepNameActive' : 'stepNameActive1'" v-if="item.status === '已完成'">
            {{ item.activityName }}
          </div>
          <div :class="isProject ? 'stepNameStart' : 'stepNameStart1'" v-if="item.status === '未开始'">
            {{ item.activityName }}
          </div>
          <div :class="isProject ? 'stepName' : 'stepName1'" v-if="item.status === '进行中'">
            {{ item.activityName }}
          </div>
        </template>
        <template v-slot:description v-if="!isProject">
          <div class="descriptionTime descriptionTime1">计划完成: {{ item.actStartValue }}</div>
          <div class="descriptionTime">
            实际完成:
            <span :class="compareTime(item.actStartValue, item.actEndValue) ? 'redTime' : ''">{{ item.actEndValue }}</span>
          </div>
        </template>
      </el-step>
    </el-steps>
    <div class="rightArrow" v-if="rightArrowVisible" @click="rightArrow">
      <el-icon><ArrowRight /></el-icon>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    stepList: {
      type: Array,
      default: () => [],
    },
    active: {
      type: Number,
      default: 0,
    },
    isProject: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      viewStepList: [],
      isArrow: false,
      leftArrowVisible: false,
      rightArrowVisible: false,
    };
  },
  watch: {
    stepList: {
      handler(val) {
        if (this.isProject) {
          this.viewStepList = val;
        } else {
          this.init(val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    classFun(index) {
      let i = Math.floor(this.stepList.length / 7);
      if (index + 1 === i * 7 && i * 7 !== this.stepList.length) {
        return 'isLast';
      }
    },
    // 初始进来定位到当前正在进行的步骤
    init() {
      if (!this.stepList.length) return;
      // let a = Math.floor(this.active / 5);
      let a = this.active / 7;
      /**
       * a > 1说明当前位置在第二页；a = 1或者a < 1,位置在第一页
       */
      if (a > 1) {
        let aa = Math.floor(a);
        // 展示数据
        this.viewStepList = this.stepList.slice(aa * 7, (aa + 1) * 7);
        this.leftArrowVisible = true;
        if (this.stepList.length > (a + 1) * 7) {
          this.rightArrowVisible = true;
        }
      } else {
        let aa = Math.floor(a);
        // 展示数据
        this.viewStepList = this.stepList.slice(0, 7);
        if (this.stepList.length > (aa + 1) * 7) {
          this.rightArrowVisible = true;
        }
      }
    },
    rightArrow() {
      this.viewStepList = [];
      let nowIndex = null;
      let a = Math.floor(this.active / 7);
      a === 0 ? (nowIndex = a + 1) : nowIndex++;
      let i = Math.floor(this.stepList.length / 7);
      if (nowIndex < i) {
        this.rightArrowVisible = true;
        this.leftArrowVisible = true;
      } else if (nowIndex == i) {
        this.rightArrowVisible = false;
        this.leftArrowVisible = true;
      }
      this.viewStepList = this.stepList.slice(nowIndex * 7, (nowIndex + 1) * 7);
    },
    leftArrow() {
      this.viewStepList = [];
      let i = Math.floor(this.stepList.length / 7);
      let nowIndex = i;
      let a = Math.floor(this.active / 7);
      a > 0 ? (nowIndex = a - 1) : nowIndex--;
      if (nowIndex > 0) {
        this.rightArrowVisible = true;
        this.leftArrowVisible = true;
      } else if (nowIndex === 0) {
        this.rightArrowVisible = true;
        this.leftArrowVisible = false;
      }
      this.viewStepList = this.stepList.slice(nowIndex * 7, (nowIndex + 1) * 7);
    },
    compareTime(time1, time2) {
      var date1 = new Date(time1);
      var date2 = new Date(time2);
      if (date2 > date1) {
        return true;
      } else if (date1 >= date2) {
        return false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.projectSteps {
  // display: flex;
  // justify-content: flex-start;
  .LeftArrow {
    float: left;
    width: 16px;
    height: 32px;
    margin-top: 20px;
    background: #ccc;
    line-height: 32px;
    color: #fff;
    cursor: pointer;
  }
  .stepContent {
    padding-right: 20px;
  }
  .rightArrow {
    width: 16px;
    height: 32px;
    float: right;
    margin-top: -60px;
    background: #ccc;
    line-height: 32px;
    color: #fff;
    cursor: pointer;
  }
  .iconName {
    font-size: 22px;
    margin-left: 10px;
  }
  .iconNumber {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid;
    text-align: center;
    margin-left: 10px;
    line-height: 20px;
    color: #ccc;
    // color: #666;
  }
  .iconNumberActive {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--el-color-primary);
    text-align: center;
    color: #fff;
    margin-left: 10px;
    line-height: 20px;
    // color: #666;
  }
  .stepName {
    color: #333;
    font-size: 12px;
    padding: 0 10px 0 5px;
  }
  .stepNameActive {
    color: #666;
    font-size: 12px;
    padding: 0 10px 0 5px;
  }
  .stepNameStart {
    color: #999;
    font-size: 14px;
    padding: 0 10px 0 5px;
  }
  .stepName1 {
    color: #333;
    font-size: 14px;
    padding: 0 10px 0 5px;
  }
  .stepNameActive1 {
    color: #666;
    font-size: 14px;
    padding: 0 10px 0 5px;
  }
  .stepNameStart1 {
    color: #999;
    font-size: 14px;
    padding: 0 10px 0 5px;
  }
  .descriptionTime {
    font-size: 14px;
    padding-left: 20px;
    padding-top: 5px;
    color: #999;
    .redTime {
      color: red;
    }
  }
  .descriptionTime1 {
    margin-top: 10px;
  }
  :deep(.el-step.is-horizontal) {
    flex-basis: 20% !important;
  }
  :deep(.el-step__description.is-finish) {
    margin-top: -11px;
  }
}
.projectStep1 {
  width: 100%;
  overflow-x: scroll;
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
