<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-11-08 09:48:55
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-28 11:48:28
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\homePage\components\taskCenter.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="taskCenter">
    <div class="title">
      任务中心
      <el-tooltip content="查看更多" effect="light" placement="top">
        <el-button @click="lookMore">
          <el-icon><Notification /></el-icon>
        </el-button>
      </el-tooltip>
      <!-- <el-icon class="iconEdit" @click="editMessage"><Edit /></el-icon> -->
    </div>
    <toDoPage isHomePage="isHomePage"></toDoPage>
    <el-dialog v-model="dialogVisible" title="编辑任务中心" width="400px" :before-close="handleClose">
      <EditMes LabelName="分类" :isClassic="true"></EditMes>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 查看更多 -->
    <div class="taskModel">
      <el-dialog v-model="moreVisible" top="5vh" title="任务中心" width="60%" height="50vh" @close="moreVisible = false">
        <toDoPage isHomePage="isHomePage"></toDoPage>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue';
import toDoPage from '@/views/toDoPage/index.vue';
import EditMes from '../smallComp/editMes.vue';
export default defineComponent({
  components: { toDoPage, EditMes },
  setup() {
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
    return {
      ...toRefs(Data),
      handleClose,
      editMessage,
      lookMore,
    };
  },
});
</script>
<style scoped lang="less">
.taskCenter {
  :deep(.page_common) {
    .custom-item-wrapper {
      padding-top: 0px;
    }
  }
}
</style>

<style scoped lang="scss">
.taskCenter {
  // overflow-y: scroll;
  padding: 16px 20px 0 20px;
  .title {
    display: flex;
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
  // :deep(.todo-task-wrapper .custom-item-wrapper) {
  //   height: calc(34vh - 80px);
  //   // overflow-y: scroll!important;
  // }
  :deep(.el-table--border .el-table__inner-wrapper) {
    // height: calc(29vh - 20px);
    height: calc(38vh - 109px) !important;
  }
  :deep(.todo-task-wrapper) {
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
}
</style>
<style lang="scss">
.taskModel {
  .content-item-table .pi-table .el-table--border .el-table__inner-wrapper {
    height: 500px !important;
  }
  .todo-task-wrapper {
    height: auto !important;
    padding: 0px !important;
  }
}
</style>
