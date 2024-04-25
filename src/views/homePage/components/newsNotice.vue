<template>
  <div class="newsNotice">
    <el-scrollbar>
      <div class="title">公告</div>
      <div>
        <el-row>
          <el-col :span="24" v-for="(item, index) in funcList" :key="index">
            <div class="content">
              <div class="bottomTitle" @click="editMessage(item)" v-if="item.articleType === 1">
                <span class="bottomTitle1">【通知】</span>
                {{ item.title }}
                <span v-if="!item.hasRead" class="seeStyle">
                  <el-icon><View /></el-icon>
                </span>
              </div>
              <div class="bottomTitle" @click="editMessage(item)" v-if="item.articleType === 2">
                <span class="bottomTitle2">【通报】</span>
                {{ item.title }}
                <span v-if="!item.hasRead" class="seeStyle">
                  <el-icon><View /></el-icon>
                </span>
              </div>
              <div class="bottomTitle" @click="editMessage(item)" v-if="item.articleType === 3">
                <span class="bottomTitle3">【表彰】</span>
                {{ item.title }}
                <span v-if="!item.hasRead" class="seeStyle">
                  <el-icon><View /></el-icon>
                </span>
              </div>
              <div class="bottomTitle" @click="editMessage(item)" v-if="item.articleType === 4">
                <span class="bottomTitle4">【预警】</span>
                {{ item.title }}
                <span v-if="!item.hasRead" class="seeStyle">
                  <el-icon><View /></el-icon>
                </span>
              </div>
              <div class="bottomTitle" @click="editMessage(item)" v-if="item.articleType === 5">
                <span class="bottomTitle5">【会议】</span>
                {{ item.title }}
                <span v-if="!item.hasRead" class="seeStyle">
                  <el-icon><View /></el-icon>
                </span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-pagination
        class="paginationStyle"
        :total="totals"
        background
        small
        layout="prev, pager, next"
        v-model:current-page.sync="page"
        v-model:page-size.sync="size"
        @current-change="handCurrentChange"
      ></el-pagination>
    </el-scrollbar>
    <el-dialog v-model="dialogVisible" title="公告" width="50%" :before-close="handleClose">
      <div v-html="newsDetail" class="newsContent"></div>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
        </span>
      </template> -->
    </el-dialog>
  </div>
</template>
 <script>
import { defineComponent, reactive, toRefs, getCurrentInstance, onMounted, watch } from 'vue';
import EditMes from '../smallComp/editMes.vue';
import { getList, getNewsDetail } from '@/api/homePage.js';
export default defineComponent({
  components: { EditMes },
  setup() {
    const { proxy: that } = getCurrentInstance();
    const Data = reactive({
      funcList: [],
      dialogVisible: false,
      page: 1,
      size: 10,
      newsDetail: '',
      totals: 0,
    });
    onMounted(() => {
      getFuncList();
    });
    const handleClose = () => {
      Data.dialogVisible = false;
      getFuncList();
    };
    const editMessage = (item) => {
      Data.dialogVisible = true;
      getNewsDetail(item.tenantId, item.id).then((res) => {
        if (res.success) {
          Data.newsDetail = res.data.content;
        } else {
          that.$message.error(res.message);
        }
      });
    };
    const getFuncList = async () => {
      const params = {
        page: Data.page,
        size: Data.size,
      };
      await getList(params).then((res) => {
        if (res.success) {
          Data.funcList = res.data.records ? res.data.records : [];
          Data.totals = Number(res.data.total);
        } else {
          that.$message.error(res.message);
        }
      });
    };
    const handCurrentChange = (value) => {
      Data.page = value;
      getFuncList();
    };
    return {
      ...toRefs(Data),
      handleClose,
      editMessage,
      getFuncList,
      handCurrentChange,
    };
  },
});
</script>

<style scoped lang="less">
.newsNotice {
  padding: 10px 20px;
  // height: calc(100vh - 70px - 270px - 40px - 22px);
  height: calc(100vh - 374px);
  .title {
    font-size: var(--el-font-size-medium);
    color: #333;
    font-weight: 600;
    padding: 10px 0;
    .iconEdit {
      margin-left: 10px;
      color: #999;
      font-size: var(--el-font-size-base);
      cursor: pointer;
    }
  }
  .content {
    text-align: left;
    .bottomTitle {
      padding: 10px 0;
      font-size: var(--el-font-size-base);
      border-bottom: 1px solid #ddd;
      cursor: pointer;
      color: #000;
      .seeStyle {
        color: #999;
        margin-left: 10px;
        margin-top: 5px;
      }
    }
    .bottomTitle1 {
      color: #000;
      font-weight: 550;
    }
    .bottomTitle2 {
      color: #fe2c2c;
      font-weight: 550;
    }
    .bottomTitle3 {
      color: #386d15;
      font-weight: 550;
    }
    .bottomTitle4 {
      color: #ffd556;
      font-weight: 550;
    }
    .bottomTitle5 {
      color: #237fc7;
      font-weight: 550;
    }
    .el-divider--horizontal {
      margin: 0px;
    }
  }
  .newsContent {
    font-size: var(--el-font-size-base);
    height: 500px;
    overflow-y: scroll;
  }
  .paginationStyle {
    margin-top: 10px;
    float: right;
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
