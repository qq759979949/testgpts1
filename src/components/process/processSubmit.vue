<template>
  <div class="processSubmit">
    <slot v-if="processName === '重新提交'"></slot>
    <div class="actionBox">
      <table class="table">
        <tr class="row clearfix" v-if="isTask">
          <td class="col1">{{ $intl('operation').d('操作') }}</td>
          <td class="col2">
            <el-radio-group v-model="Data.operation" @change="changeResolution" :disabled="isHandDetail">
              <el-radio v-for="(item, index) in Data.radioArr" :label="item.routing" :key="index">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr class="row clearfix" v-if="isTask && Data.operation">
          <td class="col1"></td>
          <td class="col2 colSelect">
            <el-form
              ref="ruleFormRef"
              :model="Data.ruleForm"
              :rules="Data.rules"
              label-width="120px"
              class="demo-ruleForm"
              label-position="left"
              status-icon
              :disabled="isHandDetail"
            >
              <el-form-item label="正常工时：" prop="normalWorkHour" v-if="Data.operation === '通过'">
                <el-input-number v-model="Data.ruleForm.normalWorkHour" controls-position="right" style="width: 200px" />
              </el-form-item>
              <el-form-item label="额外工时：" prop="extraWorkHour" v-if="Data.operation === '通过'">
                <el-input-number v-model="Data.ruleForm.extraWorkHour" controls-position="right" style="width: 200px" />
              </el-form-item>
              <el-form-item label="完工率" prop="percent_workcomplete" v-if="Data.operation === '驳回'">
                <el-input-number v-model="Data.ruleForm.percent_workcomplete" controls-position="right" style="width: 200px" />
              </el-form-item>
            </el-form>
          </td>
        </tr>
        <tr class="row clearfix" v-if="Data.operation === 'TRANSFER' && isTask">
          <td class="col1">{{ $intl('reassign').d('转办') }}</td>
          <td class="col2">
            <el-input style="width: 200px; padding-bottom: 4px" v-model="Data.reassignUserName" disabled />
            <el-button class="ml8" size="small" type="primary" @click="Data.isReassignDialog = true">{{ $intl('add').d('添加') }}</el-button>
          </td>
        </tr>
        <tr class="row clearfix">
          <td class="col1">{{ $intl('resolution').d('处理意见') }}</td>
          <td class="col2">
            <div class="mb12 mt12" v-if="!isHandDetail">
              {{ $intl('commonOpinions').d('常用意见') }}：
              <el-select v-model="Data.opinion" @change="changeResolution">
                <el-option v-for="item in Data.commonOpinions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <span class="customize" @click="Data.dialogVisible = true">自定义</span>
            </div>
            <div class="mb12">
              <el-input v-model="Data.resolution" :rows="2" type="textarea" :disabled="isHandDetail" />
            </div>
            <div class="mb12" v-if="!isHandDetail && isHandVisible">
              <template v-if="!isTask">
                <el-button type="primary" v-for="(item, index) in Data.radioArr" :key="index" @click="submitClick(item)">{{ item.label }}</el-button>
              </template>
              <el-button type="primary" v-else @click="submitTask" :loading="Data.isLoading">提交</el-button>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <SelectedDialog
      :title="$intl('reassignUser').d('转办人员')"
      :allText="$intl('userList').d('用户列表')"
      v-model:isShow="Data.isReassignDialog"
      :searchList="Data.userList"
      isSingle
      :defaultProps="{
        key: 'id',
        label: 'realname',
      }"
      :loading="Data.loading"
      :isContentLoading="Data.isContentLoading"
      @submit="selectReassignUser"
    ></SelectedDialog>
    <el-dialog v-model="Data.dialogVisible" title="自定义处理意见" width="30%">
      <div>自定义常用处理意见（每行一个）</div>
      <el-input type="textarea" :rows="4" v-model="Data.textValue"></el-input>
      <div>说明：自定义意见配置好后，下次将可在常用意见下拉选择项中引用</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="Data.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAdvice">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { getAllUser } from '@/api/team.js';
const props = defineProps({
  oid: {
    type: String,
  },
  // 是否显示操作行 --true任务使用，--false流程使用
  isTask: {
    type: Boolean,
    default: false,
  },
  // 任务以及流程查看使用 true--查看，false--编辑
  isHandDetail: {
    type: Boolean,
    default: false,
  },
  operationVal: {
    type: String,
    default: '通过',
  },
  /**按钮路由处理 */
  radioList: {
    type: Array,
    default: () => [],
  },
  processOID: {
    type: String,
  },
  processName: {
    type: String,
  },

  /**操作按钮显示隐藏 */
  isHandVisible: {
    type: Boolean,
    default: true,
  },
  // isLoading: {
  //   type: Boolean,
  //   default: false,
  // },
});

/**获取处理路由数据 */
watch(
  () => props.radioList,
  (val) => {
    if (val.length > 0) {
      Data.radioArr = val;
    } else {
      getRoutingData();
    }
  },
  { deep: true },
);

onMounted(() => {
  if (props.radioList.length === 0) {
    nextTick(() => {
      getRoutingData();
    });
  }
  if (props.isTask) {
    Data.radioArr = props.radioList;
  }
});

const api = window.$api;
const route = useRoute();
const router = useRouter();
const Data = reactive({
  /**操作菜单数据 -- 临工项目不显示 */
  radioArr: [],
  /**操作菜单选中后的数据 */
  operation: props.operationVal,
  /**转办人员 */
  reassignUser: '',
  reassignUserName: '',
  commonOpinions: [],
  opinion: '',
  // 意见
  resolution: '',
  /**转办人员弹框 */
  isReassignDialog: false,
  /**搜索框数据 */
  userList: [],

  /**表单 */
  ruleForm: {},
  rules: {
    percent_workcomplete: [{ required: true, message: '请输入', trigger: 'blur' }],
    extraWorkHour: [{ required: true, message: '请输入', trigger: 'blur' }],
    normalWorkHour: [{ required: true, message: '请输入', trigger: 'blur' }],
  },
  dialogVisible: false,
  textValue: '',

  /**用户 */
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),
  transferData: {},
  loading: false,
  isContentLoading: false,
  isLoading: false,
});
onMounted(() => {
  getAdviceList();
});
// 获取操作菜单按钮接口，临工项目无特定接口，从父组件传回
const getRoutingData = () => {
  Data.radioArr = [];
  window.$api.processApi.getRoutingDetail({ oid: props.oid }).then((res) => {
    if (res.success) {
      for (let i in res.data) {
        const obj = {};
        obj.label = res.data[i];
        obj.routing = i;
        Data.radioArr.push(obj);
      }
    } else {
      window.$message.error(res.message);
    }
    emit('update:handButton', Data.radioArr);
  });
  /**调用接口 */
};
const changeResolution = (value) => {
  Data.resolution = value === 'TRANSFER' ? '转办' : value;
};
const selectReassignUser = (data) => {
  Data.loading = true;
  Data.transferData = {
    processorOid: props.processOID,
    transferUserId: data[0].id,
    workItemOid: props.oid,
  };
  reassignWorkItem();
};
/**提交 */
const submitClick = (item) => {
  // Data.resolution = item.routing === 'TRANSFER' ? '转办' : item.label;
  Data.operation = item.routing;

  // if (Data.operation === 'TRANSFER' && !Data.reassignUser) {
  //   return window.$message.error('请选择转办人员！')
  // } else if (!Data.resolution) {
  //   return window.$message.error('请填写处理意见！')
  // }

  if (item.routing === 'TRANSFER') {
    Data.isReassignDialog = true;
    _getAllUser();
  }
  if (item.routing !== 'TRANSFER') {
    window.$ElMessageBox
      .confirm(`请确认是否${item.label}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        emit('processSubmit', Data.operation, submit, Data.resolution);
      })
      .catch(() => {});
  }
};
const submitTask = () => {
  window.$ElMessageBox
    .confirm(`请确认是否${Data.operation}?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      emit('processSubmit', Data.operation, submit, Data.resolution);
    })
    .catch(() => {});
};
const submit = async (param) => {
  await completeWorkItem(param);
};
//获取全量用户  √
const _getAllUser = () => {
  Data.isContentLoading = true;
  let params = {
    id: '',
    pageNo: 1,
    pageSize: 9999,
    thirdPartySystemId: 1,
  };
  getAllUser(params).then((res) => {
    if (res.success && res.data) {
      Data.isContentLoading = false;
      Data.userList = res.data.contents.map((e) => {
        return {
          pdcUser: e.username, // 中台账号
          realname: e.realname, // 中文名
          wcUser: e.thirdSystemName, // windChill账号
          department: e.departmentName, // 部门  配包成员表格需要
          id: e.id,
          roleIdList: e.roleIdList, // 权限
        };
      });
    } else {
      window.$message.error(res.message);
      Data.isContentLoading = false;
    }
  });
};
// 批量设置建议
const submitAdvice = () => {
  const params = Data.textValue.split('\n').filter((it) => it !== '');
  window.$api.toDoApi.batchAddUserOpinion(params).then((res) => {
    if (res.success) {
      Data.dialogVisible = false;
      getAdviceList();
    } else {
      window.$message.error(res.message);
    }
  });
};
// 获取批量意见
const getAdviceList = () => {
  window.$api.toDoApi.listUserOpinion().then((res) => {
    if (res.success) {
      Data.commonOpinions = res.data.map((item) => {
        const obj = {};
        obj.label = item;
        obj.value = item;
        return obj;
      });
      Data.textValue = res.data.join('\n');
    } else {
      window.$message.error(res.message);
    }
  });
};

/**
 * @outParam 外部参数
 * 流程提交接口
 */
const completeWorkItem = async (outParam) => {
  let param = {
    oid: props.oid,
    route: Data.operation,
    comment: Data.resolution,
    actualCompleteUser: Data.userInfo.username,
    userName: Data.userInfo.thirdPartUser,
  };
  if (outParam) {
    param = {
      ...param,
      ...outParam,
    };
  }
  await api.processApi.completeTask(param).then((res) => {
    if (res.success) {
      window.$message.success('操作成功');
      goback();
    } else {
      window.$message.error(res.message);
    }
  });
};
/**转办提交接口 */
const reassignWorkItem = () => {
  // if (outParam) {
  //   param = {
  //     ...param,
  //     ...outParam,
  //   };
  // }
  window.$api.toDoApi.transferTask(Data.transferData).then((res) => {
    if (res.success) {
      Data.loading = false;
      window.$message.success('转办成功');
      goback();
    } else {
      Data.loading = false;
      window.$message.error(res.message);
    }
  });
};
const goback = () => {
  // this.$navTagStore.removeTag(this.$route, this.$router, 'toDoPage');
  window.$navTagStore.removeTag(route, router);
  window.$navTagStore.removeCacheTag(route.name);
  router.push({ name: 'toDoPage' });
  emit('goBack');
};
const emit = defineEmits(['processSubmit', 'goBack', 'update:handButton']);
defineExpose({
  Data,
  submitClick,
});
</script>

<style scoped lang="less">
.processSubmit {
  .actionBox {
    margin-top: 20px;
    padding-bottom: 20px;
    > table {
      width: 100%;
      border: 1px solid var(--el-border-color);
      border-collapse: collapse;
    }
    .row {
      min-height: 40px;
      line-height: 40px;
      border-bottom: 1px solid var(--el-border-color);
      .col1 {
        width: 160px;
        height: 100%;
        padding-left: 30px;
        background: #f6f6f6;
        border-right: 1px solid var(--el-border-color);
      }
      .col2 {
        width: calc(100% - 160px);
        padding-left: 30px;
        :deep(.el-radio) {
          top: 2px;
        }
        .mb12 {
          :deep(.el-button) {
            height: 24px;
            background: #386bd7;
            border-radius: 2px;
            padding: 0 9px;
          }
        }
      }
      .colSelect {
        padding-top: 20px;
      }
    }
  }
  .customize {
    font-size: 14px;
    font-weight: 400;
    color: #999;
    border: 1px solid #dcdfe6;
    padding: 5px 10px;
    margin-left: 20px;
    border-radius: 4px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
  :deep(.el-dialog__footer) {
    border-top: solid 1px #dedede;
  }
}
</style>
