<template>
  <div class="detailInfo">
    <el-descriptions :title="infoTitle" direction="horizontal" :column="column">
      <el-descriptions-item v-for="item in detailLayout" :width="width" label-class-name="desc-label" class-name="desc-row" :label="item.label + '：'" :key="item.key">
        <div class="row-text" v-show-tip>
          <el-tooltip :content="item.value" placement="top-start">
            <!-- <div>{{ item.value }}</div> -->
            <el-link style="color: #386bd7" @click="clickFun(item)" v-if="item.fileOid">
              <span v-html="item.value"></span>
            </el-link>
            <span v-else v-html="item.value"></span>
          </el-tooltip>
        </div>
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
    display: inline-block;
    width: 7vw;
    margin-right: 0px;
    color: #666666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // min-width: 100px;
  }
  :deep(.el-descriptions__body .el-descriptions__table:not(.is-bordered) .el-descriptions__cell) {
    padding-bottom: 0px;
  }
  :deep(.el-descriptions__table) {
    tr {
      display: flex;
      height: 30px;
    }
  }
  :deep(.el-descriptions__cell) {
    display: flex;
    align-items: center;
  }
  :deep(.desc-row) {
    display: flex;
    color: #333;
    width: calc(100% - 7vw);
    font-weight: 400;
    .row-text {
      // max-width: 10vw;
      max-width: 100%;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .el-tooltip__trigger {
        width: 100%;
        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
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
