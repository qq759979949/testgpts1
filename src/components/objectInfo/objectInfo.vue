<template>
  <div class="detailInfo">
    <el-descriptions :title="infoTitle" direction="horizontal" :column="column">
      <el-descriptions-item v-for="item in detailLayout" :width="width" label-class-name="desc-label" class-name="desc-row" :label="item.label" :key="item.key">
        <div class="row-textFile" v-show-tip v-if="item.filedType === 'FILE'">
          <el-tooltip :content="item.displayValue.toString()" placement="top-start">
            <div>{{ item.displayValue }}</div>
          </el-tooltip>
          <el-button @click="downLoad(item.value, item.displayValue)">下载附件</el-button>
        </div>
        <div class="row-text" v-show-tip v-else>
          <el-tooltip :content="item.value.toString()" placement="top-start" :html-content="true">
            <div v-html="item.value"></div>
          </el-tooltip>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'objectInfo',
  props: {
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
    width: {
      type: String || Number,
      default: '25%',
    },
  },
  methods: {
    downLoad(e, fileName) {
      this.$emit('downLoad', e, fileName);
    },
  },
});
</script>

<style lang="scss" scoped>
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
    min-width: 6vw;
    // width: 10vw;
    white-space: pre-wrap;
    margin-right: 0px;
    color: #999 !important;
  }
  :deep(.el-descriptions__body .el-descriptions__table:not(.is-bordered) .el-descriptions__cell) {
    padding-bottom: 0px;
  }
  :deep(.desc-row) {
    color: #000;
    .row-text {
      max-width: calc(100% - 6vw);
      display: inline-block;
      vertical-align: middle;
      .el-tooltip__trigger {
        // width: 100%;
        // display: inline-block;
        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
        max-width: 100%;
        display: inline-block;
        white-space: pre-wrap;
      }
    }
    .row-textFile {
      max-width: calc(100% - 6vw);
      display: inline-block;
      vertical-align: middle;
      white-space: pre;
      .el-tooltip__trigger {
        width: 100%;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
<style lang="scss">
.el-popper {
  white-space: pre-line;
}
</style>