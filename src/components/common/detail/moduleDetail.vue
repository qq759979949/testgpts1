<template>
  <div class="detailInfo">
    <el-descriptions :title="infoTitle" direction="horizontal" :column="column">
      <el-descriptions-item v-for="item in detailLayout" :width="width" label-class-name="desc-label" class-name="desc-row" :key="item.key">
        <template #label>
          <span class="desc-label" v-show-tip>
            <el-tooltip :content="item.label" placement="top-start">
              <span>{{ item.label + '：' }}</span>
            </el-tooltip>
          </span>
        </template>
        <span class="row-text" v-show-tip="{ hideAfter: 0 }">
          <el-tooltip :content="item.displayValue" placement="top-start">
            <el-link style="color: #386bd7" @click="clickFun(item)" v-if="item.textType === 'link'">
              <span v-html="item.displayValue"></span>
            </el-link>
            <span v-else-if="item.label === '生命周期状态'" v-html="item.displayValue" class="templateStyle"></span>
            <span v-else v-html="item.displayValue"></span>
          </el-tooltip>
        </span>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
const props = defineProps({
  infoTitle: {
    type: String,
    default: '详细信息',
  },
  detailLayout: {
    type: Array,
    default: () => [],
  },
  column: {
    type: Number,
    default: 4,
  },
});
const width = computed(() => {
  let arr = 100 / props.column;
  return arr + '%';
});
const clickFun = (val) => {
  emit('clickFun', val);
};
const emit = defineEmits(['clickFun']);
</script>

<style lang="less" scoped>
.detailInfo {
  .title {
    font-size: 16px;
    font-weight: 600;
    height: 24px;
    line-height: 24px;
    margin-bottom: 16px;
  }
  :deep(.desc-label) {
    // display: flex;
    display: inline-block;
    width: 7vw;
    margin-right: 0px;
    color: #666666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // min-width: 100px;
    align-items: center;
    .el-tooltip__trigger {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  :deep(.el-descriptions) {
    width: 100%;
    .el-descriptions__body {
      width: 100%;
    }
  }

  :deep(.el-descriptions__body .el-descriptions__table:not(.is-bordered) .el-descriptions__cell) {
    padding-bottom: 0px;
    // display: flex;
  }
  :deep(.el-descriptions__table) {
    width: 100%;
    display: inline-block;
    tbody {
      width: 100%;
      display: inline-block;
    }
    tr {
      display: flex;
      height: 30px;
    }
  }
  :deep(.el-descriptions__cell) {
    // display: flex;
    // align-items: center;
  }
  :deep(.desc-row) {
    // display: flex;
    display: inline-block;
    color: #333;
    width: calc(100% - 7vw);
    font-weight: 400;
    vertical-align: top;
    .row-text {
      // max-width: 10vw;
      max-width: 100%;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .el-tooltip__trigger {
        width: 100%;
      }
      .templateStyle {
        color: #999;
        b {
          color: #386bd7;
        }
      }
      .el-link {
        display: inline-block;
        .el-link__inner {
          display: inline-block;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
.el-popper {
  white-space: pre-line;
}
</style>
