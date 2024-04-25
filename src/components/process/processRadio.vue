<template>
  <div class="processSubmit">
    <slot v-if="processName === '重新提交'"></slot>
    <div class="actionBox">
      <div class="mb12">
        <el-button type="primary" v-for="(item, index) in Data.radioArr" :key="index" @click="submitClick(item)">{{ item.label }}</el-button>
      </div>
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
  resolute: {
    type: String,
  },
  // 项目的oid
  projectOid: {
    type: String,
    default: '',
  },
  // 是否批准节点
  isRatify: {
    type: Boolean,
    default: false,
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
watch(
  () => props.resolute,
  (val) => {
    console.log(val);
    Data.resolution = val;
  },
);

onMounted(() => {
  if (props.radioList.length === 0) {
    nextTick(() => {
      getRoutingData();
    });
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
  resolution: props.resolute,
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
onMounted(() => {});
// 获取操作菜单按钮接口，临工项目无特定接口，从父组件传回
const getRoutingData = () => {
  Data.radioArr = [];
  if (props.oid) {
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
    });
  }
  /**调用接口 */
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
const submit = (param) => {
  completeWorkItem(param);
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

/**
 * @outParam 外部参数
 * 流程提交接口
 */
const completeWorkItem = (outParam) => {
  if (Data.operation === '驳回' && Data.resolution === '') {
    emit('callback', 'error');
    return window.$message.warning('驳回必须填处理意见');
  }
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

  api.processApi.completeTask(param).then((res) => {
    if (res.success) {
      if (props.isRatify) {
        // 最后再用接口阻塞8S去等流程处理完之后的状态
        api.processApi.getByOid({ oid: props.projectOid }).then((res) => {
          if (res.success) {
            let projectInfo = res.data;
            projectInfo.state = '工作进行中';
            sessionStorage.setItem('currentProject', JSON.stringify(projectInfo));
            window.$message.success('操作成功');
            emit('callback', 'success');
            goback();
          } else {
            window.$message.error(res.message);
            emit('callback', 'error');
          }
        });
      } else {
        window.$message.success('操作成功');
        emit('callback', 'error');
        goback();
      }
    } else {
      window.$message.error(res.message);
      emit('callback', 'error');
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
const emit = defineEmits(['processSubmit', 'goBack', 'callback']);
defineExpose({
  Data,
});
</script>

<style scoped lang="less">
.processSubmit {
  .actionBox {
    // margin-top: 20px;
    // padding-bottom: 20px;
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
