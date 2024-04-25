<template>
  <div class="processRecord">
    <!-- 流程参与者 -->
    <div class="process_user" v-if="Data.isUserVisible">
      <div class="title">流程参与者</div>
      <div class="select_user">
        <el-form ref="form" :model="Data.userForm" label-position="top">
          <el-form-item v-for="(item, index) in Data.userFormData" :key="index" :label="item.name + ':'" :required="item.required">
            <el-select :key="index" v-model="item.checkSelsectData" show-search="true" placeholder="请选择处理人" style="width: 672px" :multiple="true" filterable clearable>
              <el-option v-for="(itm, indx) in item.selectData" :key="indx" :value="itm.id" :label="itm.fullname" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 流程指引 -->
    <div class="process_box" v-if="isProcessVisible">
      <div class="step_process">
        <div class="stepsBox" v-if="Data.stepArr && Data.stepArr.length > 0">
          <el-steps :active="Data.stepActive" align-center>
            <el-step v-for="(item, index) in Data.stepArr" :key="index">
              <!-- 正在运行 -->
              <template v-if="item.state && item.state.indexOf('RUNNING') !== -1" #icon>
                <el-tooltip placement="top">
                  <template #content>
                    {{ '耗时：' + item.runningTime }}
                  </template>
                  <span class="textIcon">
                    {{ index + 1 }}
                  </span>
                </el-tooltip>
              </template>
              <!-- 以完成 -->
              <template v-if="item.state && item.state.indexOf('CLOSED') !== -1" #icon>
                <span class="textIcon1">
                  <el-icon><Select /></el-icon>
                </span>
              </template>
              <!-- 审核节点信息 -->
              <template #title>
                <div class="runningWord" v-if="item.state && item.state.indexOf('RUNNING') !== -1">{{ item.name }}</div>
                <div class="closedWord" v-else-if="item.state && item.state.indexOf('CLOSED') !== -1">{{ item.name }}</div>
                <div v-else>{{ item.name }}</div>
              </template>
              <!-- 用户 -->
              <template #description>
                <div class="runningWord userList" v-if="item.state && item.state.indexOf('RUNNING') !== -1">{{ item.userFullName }}</div>
                <div class="closedWord userList" v-else-if="item.state && item.state.indexOf('CLOSED') !== -1">{{ item.userFullName }}</div>
                <!-- <div v-else>{{ item.name }}</div> -->
                <div class="userList" v-else>{{ item.userFullName }}</div>
                <div v-if="isDetail && item.state && item.state.indexOf('RUNNING') !== -1 && index !== 0" class="urge" @click="goUrge(item)">催一下</div>
              </template>
            </el-step>
          </el-steps>
        </div>
        <div v-else>
          <el-empty :image-size="50" description="暂无数据" />
        </div>
      </div>
      <div class="processList">
        <div class="title" id="process">处理状况</div>
        <NewPiTable :tableHeight="'auto'" :columns="Data.colunms" :data="Data.tableData" rowKey="oid" :isShowSetting="false" :tableLoad="Data.tableLoad">
          <template #workName="scope">
            <el-link
              v-if="
                isOpenProcessRecordHandler &&
                ((scope.row.actualWorkAssignee && scope.row.actualWorkAssignee.includes(userInfo.username)) || userInfo.isAdmin) &&
                scope.row.workName !== '提交'
              "
              type="primary"
              :underline="false"
              @click="togoProcessDetail(scope.row)"
            >
              {{ scope.row.workName }}
            </el-link>
            <span v-else>{{ scope.row.workName }}</span>
          </template>
        </NewPiTable>
      </div>
    </div>
    <el-dialog v-model="Data.isVisible" width="30%" title="催一下">
      <el-form label-width="120px">
        <el-form-item label="催办方式">
          <el-checkbox-group v-model="Data.form.type">
            <el-checkbox label="企业微信" name="type" />
            <el-checkbox label="邮件" name="type" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="催办描述">
          <el-input v-model="Data.form.content" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelUrge">取消</el-button>
          <el-button type="primary" @click="confirmUrge">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Cookies from 'js-cookie';
const userInfo = JSON.parse(Cookies.get('userInfo'));
const route = useRoute();
const api = window.$api;
const props = defineProps({
  oid: {
    type: String,
  },
  stepList: {
    type: Array,
    default: () => [],
  },
  tableList: {
    type: Array,
  },
  step: {
    type: Number,
  },
  pageType: {
    default: '',
    type: String,
  },
  isProcessVisible: {
    default: true,
    type: Boolean,
  },
  exposeStepArr: {
    type: Array,
    default: () => [],
  },
  // 判断是否为详情中的流程指引
  isDetail: {
    default: false,
    type: Boolean,
  },
  // 是否打开流程处理记录的点击方法
  isOpenProcessRecordHandler: {
    type: Boolean,
    default: false,
  },
});
const Data = reactive({
  // 流程选人
  isUserVisible: false,
  userForm: {},
  userFormData: [],

  // 流程步骤
  stepArr: [],
  stepActive: 0,
  colunms: [],
  tableData: [],
  isVisible: false,
  urgePeople: '',
  form: {},
  tableLoad: false,
});
watch(
  () => Data.stepArr,
  (val) => {
    if (Data.pageType === 'Edit') {
      Data.isUserVisible = val[0].name === ('编制' || '修改') && val[0].state === ('OPEN_RUNNING' || 'CLOSED_COMPLETED_EXECUTED');
      // 这个流程步骤接口有问题，修改节点的时候，获取的还是正常的流程步骤节点。导致无法判断修改节点的state是什么，暂时留着
    } else {
      Data.isUserVisible = false;
    }
  },
);
watch(
  () => props.stepList,
  (val) => {
    Data.stepArr = val;
  },
);
watch(
  () => props.tableList,
  (val) => {
    Data.tableData = val;
  },
);
watch(
  () => props.step,
  (val) => {
    Data.stepActive = val;
  },
);
watch(
  () => Data.userFormData,
  (val) => {
    emit('selectUserList', val);
  },
  { deep: true },
);
watch(
  () => Data.isUserVisible,
  () => {
    getProcessUser();
  },
);
watch(
  () => props.oid,
  (val) => {
    getProcessSteps(val);
    if (route.name !== 'examineReview') {
      getDisposeStatusData(val);
    } else {
      getProcessStatus(val);
    }
  },
);

const emit = defineEmits(['selectUserList', 'update:exposeStepArr', 'processRecordHandler']);

onBeforeMount(() => {
  if (props.oid && !props.stepList.length) {
    getProcessSteps(props.oid);
    getDisposeStatusData(props.oid);
    if (route.name === 'examineReview') {
      getProcessStatus(props.oid);
    }
  }
});
onMounted(() => {
  if (route.name !== 'examineReview') {
    Data.colunms = [
      { title: '名称', dataIndex: 'workName', width: '180px' },
      { title: '工作负责人', dataIndex: 'actualWorkAssignee', width: '150px' },
      { title: '角色', dataIndex: 'workRole', width: '180px' },
      { title: '投票', dataIndex: 'workVote', width: '120px' },
      { title: '完成者', dataIndex: 'actualWorkCompletedBy', width: '150px' },
      { title: '截止日期', dataIndex: 'workDeadline', width: '180px' },
      // { title: '操作者', dataIndex: 'workAssignee', width: '200px' }, // 临工项目是actualWorkAssignee，其他项目看情况
      { title: '完成日期', dataIndex: 'workCompletedDate' },
      { title: '备注', dataIndex: 'workComments', width: '300px' },
    ];
  } else {
    Data.colunms = [
      { title: '节点名称', dataIndex: 'workName' },
      { title: '完成时间', dataIndex: 'workCompletedDate' },
      { title: '操作者', dataIndex: 'actualWorkCompletedBy' },
      { title: '操作', dataIndex: 'workVote' },
      { title: '处理意见', dataIndex: 'workComments' },
    ];
  }
});
/**获取审批用户 */
const getProcessUser = () => {
  // let params = {
  //   oid: props.oid,
  // };
  // getWFSelectPrincipal(params).then((res) => {
  //   if (res.success) {
  //     let arr = [];
  //     res.data.forEach((e) => {
  //       if (e.initUsers) {
  //         arr.push({
  //           name: e.name,
  //           oid: e.oid,
  //           required: e.required,
  //           selectData: res.data[0].selectedUsers,
  //           checkSelsectData: e.initUsers,
  //           roleName: e.roleName,
  //         });
  //       }
  //     });
  //     that.userFormData = arr;
  //   }
  // });
};

/**获取审批节点 */
const getProcessSteps = (id) => {
  let param = {
    oid: id,
  };
  api.processApi.getProcessSteps(param).then((res) => {
    if (res.success) {
      Data.stepArr = res.data;
      Data.stepArr.forEach((el, i) => {
        if (el.state && el.state.indexOf('RUNNING') !== -1) {
          Data.stepActive = i;
        }
      });
      emit('update:exposeStepArr', Data.stepArr);
    } else {
      window.$message.error(res);
    }
  });
};

/**获取审批记录 */
const getDisposeStatusData = (id) => {
  let param = {
    oid: id,
  };
  api.processApi.getDisposeStatus(param).then((res) => {
    if (res.success) {
      Data.tableData = res.data;
    }
  });
};
// 获取评审审批记录
const getProcessStatus = (id) => {
  Data.tableLoad = true;
  let param = {
    oid: id,
  };
  api.processApi.queryProcessStatus(param).then((res) => {
    if (res.success) {
      Data.tableData = res.data;
      Data.tableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
};
// 确认催一下
const confirmUrge = () => {
  // console.log(props.oid);
  let params = {
    processorOid: props.oid,
    title: Data.form.content,
    userName: Data.urgePeople,
    workItemOid: '',
  };
  if (Data.form.type.includes('企业微信')) {
    // Data.isVisible = false;
    window.$api.processApi.emailNotice(params).then((res) => {
      if (res.success) {
      } else {
        window.$message.error(res.message);
      }
    });
  }
  if (Data.form.type.includes('邮件')) {
    // Data.isVisible = false;
    window.$api.processApi.wxNotice(params).then((res) => {
      if (res.success) {
      } else {
        window.$message.error(res.message);
      }
    });
  }
};
// 取消催一下
const cancelUrge = () => {
  Data.isVisible = false;
};
const goUrge = (item) => {
  Data.isVisible = true;
  Data.urgePeople = item.userFullName;
};
// 流程处理记录的跳转
const togoProcessDetail = (row) => {
  emit('processRecordHandler', row);
};
</script>

<style scoped lang="less">
.processRecord {
  .process_user {
    // margin-bottom: 24px;
    padding-bottom: 24px;
    .title {
      font-size: 16px;
      font-weight: bolder;
      padding-bottom: 12px;
    }
    .select_user {
      margin: 12px 0px;
      :deep(.el-form) {
        .el-form-item {
          margin-bottom: 12px;
          display: flex;
          .el-form-item__label {
            padding-right: 30px;
            text-align: right;
            width: 7vw;
            font-size: 14px;
            font-weight: 400;
            box-sizing: border-box;
            & > label {
              color: #666666;
            }
          }
        }
      }
    }
  }
  .step_process {
    margin-top: 20px;
    padding-bottom: 12px;
    overflow: scroll;
    .title {
      font-size: 16px;
      font-weight: bolder;
      margin-bottom: 12px;
    }
    .stepsBox {
      margin-top: 20px;
      // padding: 0 50px;
      min-height: 80px;
      margin-bottom: 20px;
      .textIcon {
        display: inline-block;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        line-height: 24px;
        border: 1px solid;
        text-align: center;
        cursor: pointer;
        background-color: #386bd7;
        color: #fff;
      }
      .urge {
        color: #386bd7;
        font-size: 16px;
        cursor: pointer;
      }
      .runningWord {
        color: #333;
      }
      .closedWord {
        color: #386bd7;
      }
      .textIcon1 {
        display: inline-block;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        line-height: 24px;
        border: 1px solid;
        text-align: center;
        cursor: pointer;
        color: #386bd7;
      }
      .textIcon_background {
        width: 35px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background-color: rgba(5, 100, 251, 0.15);
        .textIcon_Num {
          display: inline-block;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          border: 2px solid;
          text-align: center;
          cursor: pointer;
          border: none;
          background-color: rgba(15, 102, 242, 0.9);
          color: rgba(255, 255, 255, 0.8);
        }
      }
      .userList {
        max-width: 210px;
        word-wrap: break-word;
        display: inline-block;
      }
    }
  }
  .processList {
    margin-top: 20px;
    .title {
      font-size: 18px;
      font-family: 'PingFangSC, PingFang SC';
      font-weight: 500;
      color: #333333;
      margin-bottom: 8px;
    }
  }
  :deep(.el-step) {
    .is-process,
    .is-finish {
      .is-icon {
        width: 24px;
      }
    }
    .is-process {
      .textIcon {
        background: #386bd7;
        border: 1px solid #386bd7;
        color: #fff;
      }
    }
    .is-finish {
      .textIcon {
        border: 1px solid #386bd7;
      }
    }
    .is-wait {
      .is-text {
        border: 1px solid;
      }
    }
    .el-step__line {
      height: 1px;
    }
    .el-step__line-inner {
      height: 1px;
      border-style: none;
      background: #386bd7;
    }
    .el-step__description {
      padding: 0;
    }
  }
  :deep(.el-step__icon.is-text) {
    // border: 1px solid;
  }
  :deep(.el-step__title.is-wait) {
    // font-weight: bold;
    // color: rgba(0, 0, 0, 0.6);
  }
  :deep(.el-step__title.is-finish) {
    // font-weight: bold;
    // color: #0f3269;
    // opacity: 0.85;
  }
  :deep(.el-step__description) {
    // padding-right: 0;
    // color: #000;
    // opacity: 0.3;
    // font-weight: bold;
  }
}
</style>
