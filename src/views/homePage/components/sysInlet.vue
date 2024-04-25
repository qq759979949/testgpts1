<template>
  <div class="sysInlet-container">
    <div class="title">
      系统快速入口
      <el-icon class="iconEdit" @click="editMessage"><Edit /></el-icon>
    </div>
    <div class="sysContent">
      <el-row :gutter="20">
        <el-col :span="8" v-for="(item, index) in funcList" :key="index">
          <div class="content" @click="goDetail(item)">
            <img :src="item.imageUrl" class="img" />
            <div class="bottomTitle">{{ item.functionName }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog v-model="dialogVisible" title="编辑系统快速入口" width="20%" :before-close="handleClose">
      <EditMes LabelName="快速入口" :isClassic="true" :isNum="true" :options="funcListAll" ref="editMes"></EditMes>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFunc" :loading="loading">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
 <script>
import { defineComponent, reactive, toRefs, getCurrentInstance, onMounted } from 'vue';
import EditMes from '../smallComp/editMes.vue';
import { getFuncList, setupFunc, listDictItem, getAll } from '@/api/homePage.js';
export default defineComponent({
  components: { EditMes },
  setup() {
    const { proxy: that } = getCurrentInstance();
    const Data = reactive({
      funcList: [],
      dialogVisible: false,
      funcListAll: [],
      loading: false,
    });
    const handleClose = () => {
      Data.dialogVisible = false;
    };
    const editMessage = () => {
      Data.dialogVisible = true;
      funcListAll();
    };
    const funcList = async () => {
      await getFuncList({ functionType: '2' }).then((res) => {
        if (res.code === 200) {
          Data.funcList = res.data ? res.data : [];
        } else {
          Data.funcList = [];
          that.$message.error(res.message);
        }
      });
    };
    const funcListAll = async () => {
      await getAll().then((res) => {
        if (res.code === 200) {
          that.$refs.editMes.checkList = Data.funcList.map((item) => {
            that.$refs.editMes.number = item.maxSize;
            return item.functionName;
          });
          Data.funcList.map((item) => {
            item.description = item.functionName;
            item.itemValue = `${item.imageUrl},${item.functionUrl}`;
            return item;
          });
          const newData = res.data.content.filter((i) => !that.$refs.editMes.checkList.includes(i.name));
          Data.funcListAll = [...Data.funcList, ...newData];
        } else {
          that.$message.error(res.message);
        }
      });
    };
    const createFunc = () => {
      const userFunctionAreaList = [];
      that.$refs.editMes.optionList.forEach((item) => {
        if (that.$refs.editMes.checkList.includes(item.description)) {
          userFunctionAreaList.push({
            quickEntryId: item.quickEntryId ? item.quickEntryId : item.id,
            // functionName: item.description,
            // functionUrl: item.itemValue.split(',')[1],
            // imageUrl: item.itemValue.split(',')[0],
          });
        }
      });
      const params = {
        userFunctionAreaList,
        userFunctionType: '2',
        maxSize: that.$refs.editMes.number,
      };
      setupFunc(params).then((res) => {
        if (res.success) {
          Data.dialogVisible = false;
          Data.loading = false;
          funcList();
        } else {
          Data.loading = false;
          that.$message.error(res.message);
        }
      });
    };
    const submitFunc = () => {
      Data.loading = true;
      createFunc();
      // const optionsL = that.$refs.editMes.optionList.map(item => {
      //   item.isShow = that.$refs.editMes.checkList.includes(item.name) ? 1 : 0
      //   return item
      // })
    };
    const goDetail = (val) => {
      window.open(val.functionUrl, '_blank');
    };
    onMounted(() => {
      funcList();
    });
    return {
      ...toRefs(Data),
      handleClose,
      editMessage,
      submitFunc,
      createFunc,
      goDetail,
    };
  },
});
</script>
<style scoped lang="scss">
.sysInlet-container {
  padding: 10px 20px;
  height: 270px;
  .title {
    font-size: var(--el-font-size-medium);
    color: #333;
    font-weight: 600;
    margin-bottom: 10px;
    .iconEdit {
      margin-left: 10px;
      color: #999;
      font-size: var(--el-font-size-base);
      cursor: pointer;
    }
  }
  .sysContent {
    height: calc(100% - 33px);
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .content {
    text-align: center;
    padding: 10px;
    cursor: pointer;
    .img {
      width: 35px;
      height: 35px;
      border-radius: 4px;
    }
    .bottomTitle {
      font-size: var(--el-font-size-base);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
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
