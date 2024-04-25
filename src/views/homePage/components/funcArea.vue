<template>
  <div class="funcArea1">
    <div class="title">
      功能区
      <el-icon class="iconEdit" @click="editMessage"><Edit /></el-icon>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :span="3" v-for="(item, index) in funcList" @click="goRouter(item)" :key="index">
          <div class="content">
            <img src="@/assets/img/pic2.png" class="img" />
            <div class="bottomTitle">{{ item.functionName }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog v-model="dialogVisible" title="编辑功能区" width="20%" :before-close="handleClose">
      <EditMes LabelName="分类" :isFunc="true" :options="funcListAll" ref="editMes"></EditMes>
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
import { getFuncList, setupFunc, listDictItem } from '@/api/homePage.js';
export default defineComponent({
  setup() {
    const { proxy: that } = getCurrentInstance();
    const router = useRouter();
    const Data = reactive({
      funcList: [],
      dialogVisible: false,
      funcListAll: [],
      funcId: '',
      loading: false,
    });
    const handleClose = () => {
      Data.dialogVisible = false;
    };
    const editMessage = async () => {
      Data.dialogVisible = true;
      await funcListAll();
    };
    const funcList = async () => {
      await getFuncList({ functionType: '1' }).then((res) => {
        if (res.code === 200) {
          Data.funcList = res.data ? res.data : [];
        } else {
          that.$message.error(res.message);
        }
      });
    };
    const funcListAll = async () => {
      await listDictItem({ dictCode: 'functionArea' }).then((res) => {
        if (res.code === 200) {
          that.$refs.editMes.checkList = Data.funcList.map((item) => {
            return item.functionName;
          });
          Data.funcList.map((item) => {
            item.description = item.functionName;
            item.itemValue = `${item.imageUrl},${item.functionUrl}`;
            return item;
          });
          const newData = res.data.filter((i) => !that.$refs.editMes.checkList.includes(i.description));
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
            functionName: item.description,
            functionUrl: item.itemValue.split(',')[1],
            imageUrl: item.itemValue.split(',')[0],
          });
        }
      });
      const params = {
        userFunctionAreaList,
        userFunctionType: '1',
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
    // 跳转
    const goRouter = (item) => {
      router.push({ path: item.functionUrl });
    };
    onMounted(() => {
      funcList();
      // funcListAll()
    });
    return {
      ...toRefs(Data),
      handleClose,
      editMessage,
      submitFunc,
      createFunc,
      goRouter,
    };
  },
  components: { EditMes },
});
</script>

<style scoped lang='scss'>
.funcArea1 {
  padding: 10px 20px;
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
  .content {
    text-align: center;
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
