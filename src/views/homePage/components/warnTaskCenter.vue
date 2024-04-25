<template>
  <div class="warnTaskCenter">
    <div class="title">
      任务预警中心
      <el-tooltip content="查看更多" effect="light" placement="top">
        <el-button @click="lookMore">
          <el-icon><Notification /></el-icon>
        </el-button>
      </el-tooltip>

      <!-- <el-icon class="iconEdit" @click="editMessage"><Edit /></el-icon> -->
    </div>
    <warningTask isHomePage="isHomePage"></warningTask>
    <el-dialog v-model="Data.dialogVisible" title="编辑任务预警中心" width="400px" :before-close="handleClose">
      <EditMes LabelName="分类" :isClassic="true"></EditMes>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="Data.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="Data.dialogVisible = false">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看更多 -->
    <div class="more_dialog">
      <el-dialog v-model="Data.moreVisible" top="5vh" title="任务预警中心" width="60%" height="50vh" @close="Data.moreVisible = false">
        <warningTask isHomePage="isHomePage" class="warnTaskTable"></warningTask>
      </el-dialog>
    </div>
  </div>
</template>
<script setup>
import { defineComponent, reactive, toRefs } from 'vue';
import warningTask from '@/views/warningTask/index.vue';
import EditMes from '../smallComp/editMes.vue';
const Data = reactive({
  dialogVisible: false,
  moreVisible: false,
});
const handleClose = () => {
  Data.dialogVisible = false;
};
const editMessage = () => {
  Data.dialogVisible = true;
};

/**查看更多 */
const lookMore = () => {
  Data.moreVisible = true;
};
</script>
<style scoped lang="less">
.warnTaskCenter {
  :deep(.page_common) {
    .custom-item-wrapper {
      padding-top: 0px;
    }
  }
}
</style>
<style scoped lang="scss">
.warnTaskCenter {
  // overflow-y: scroll;
  padding: 16px 20px 0 20px;
  .title {
    font-size: var(--el-font-size-medium);
    color: #333;
    font-weight: 600;
    // margin-bottom: 20px;
    .iconEdit {
      margin-left: 10px;
      color: #999;
      font-size: var(--el-font-size-base);
      cursor: pointer;
    }
    :deep(.el-button) {
      padding: 0;
      width: 24px;
      height: 24px;
      margin-left: 10px;
    }
  }
  :deep(.el-table--border .el-table__inner-wrapper) {
    // height: calc(58vh - 150px - 70px - 100px);
    height: calc(62vh - 340px) !important;
  }
  :deep(.todo-task-wrapper-call) {
    height: auto !important;
    padding: 0px !important;
  }
  :deep(.el-dialog__header) {
    margin-right: 0;
    border-bottom: 1px solid #00000017;
  }
  :deep(.el-dialog__body) {
    padding: 10px 20px;
  }
  :deep(.el-dialog__footer) {
    border-top: 1px solid #00000017;
  }
  .more_dialog {
    :deep(.todo-task-wrapper-call) {
      width: auto;
    }
  }
}
</style>
<style lang="scss">
.more_dialog {
  .content-item-table .pi-table .el-table--border .el-table__inner-wrapper {
    height: 500px !important;
  }
  .todo-task-wrapper-call {
    height: auto !important;
    padding: 0px !important;
  }
}
</style>
