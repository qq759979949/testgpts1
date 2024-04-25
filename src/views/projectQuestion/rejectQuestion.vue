<template>
  <div class="rejectQuestion" v-loading="Data.isLoading">
    <div class="Topping">
      <el-affix target=".rejectQuestion" :offset="100">
        <div class="topTitle">
          <p class="processName">
            <span v-if="route.query.workItemName !== '' && route.query.workItemName">{{ '【' + route.query.workItemName + '】' }}</span>
            <span>{{ route.query.projectShortName + '-' + route.query.context + '-' + route.query.processName }}</span>
          </p>
          <process-radio
            ref="processSubmit"
            @processSubmit="submit"
            :oid="route.query.workitemOID"
            @goBack="goBack"
            :processOID="route.query.processOID"
            :resolute="Data.resolution"
            @callback="callback"
          ></process-radio>
        </div>
      </el-affix>
      <div class="bottom-content">
        <div class="form-box">
          <FormLayout ref="form" labelWidth="auto" :formList="Data.formList" :submitData="Data.submitData">
            <template #identifiedByReference="{ option }">
              <SelectedDialog
                title="选择识别人"
                :allText="$intl('userList').d('用户列表')"
                v-model:isShow="option.showDialog"
                :searchList="Data.userList"
                isSingle
                :defaultProps="Data.defaultProps"
                @submit="changeSubmitData($event, option)"
              ></SelectedDialog>
            </template>
            <template #riskRespondant="{ option }">
              <SelectedDialog
                title="选择负责人"
                :allText="$intl('userList').d('用户列表')"
                v-model:isShow="option.showDialog"
                :searchList="Data.userList"
                isSingle
                :defaultProps="Data.defaultProps"
                @submit="changeSubmitData($event, option)"
              ></SelectedDialog>
            </template>
          </FormLayout>
        </div>
        <!-- 附件 -->
        <section class="section-container" v-if="!Data.isLoading">
          <!-- <div class="title">附件</div> -->
          <div class="file">
            <span class="labelCss">附件：</span>
            <el-upload ref="upload" class="upload-demo" action="/" :auto-upload="false" v-model:file-list="Data.fileList" :on-exceed="handleExceed">
              <template #trigger>
                <el-button :icon="'upload'">上传</el-button>
              </template>
            </el-upload>
          </div>
          <div class="file">
            <span class="labelCss"></span>
            <el-form-item :required="false" style="width: 100%">
              <div v-for="(item, index) in Data.fileArray" :key="index" class="uploadFile">
                <el-link type="primary" @click="handlePreview(item)">{{ item.fileName }}</el-link>
                <el-icon @click="deleteFile(item)" class="deleteIcon"><CircleClose /></el-icon>
              </div>
            </el-form-item>
          </div>
        </section>
        <section class="section-container">
          <div class="title">流程设置</div>
          <section class="section-container">
            <select-user ref="selectUserGrading" :parmasObj="Data.parmasObj" v-model:selectUserData="Data.selectUserData" :workitemOid="Data.workitemOID"></select-user>
          </section>
        </section>
        <div class="bottomProcess">
          <div class="line-title" v-if="Data.workItemName === '解决风险'">风险处理</div>
          <div class="sub-box" v-if="Data.workItemName === '解决风险'">
            <el-form :model="Data.form" label-width="auto" :rules="Data.rules" ref="ruleForm">
              <el-form-item label="处理措施：" prop="desc">
                <el-input v-model="Data.form.desc" type="textarea" />
              </el-form-item>
              <el-form-item label="附件：" prop="fileList">
                <el-upload ref="upload" class="upload-demo" action="/" :auto-upload="false" v-model:file-list="Data.form.fileList" :on-exceed="handleExceed">
                  <template #trigger>
                    <el-button :icon="'upload'">上传附件</el-button>
                  </template>
                </el-upload>
              </el-form-item>
            </el-form>
            <div class="fileArr">
              <el-form-item :required="false" style="width: 100%">
                <div v-for="(item, index) in Data.fileArr" :key="index" class="uploadFile">
                  <el-link type="primary" @click="handlePreview(item)">{{ item.fileName }}</el-link>
                  <el-icon @click="deleteFile(item)" class="deleteIcon"><CircleClose /></el-icon>
                </div>
              </el-form-item>
            </div>
            <!-- <ProcessRecord :oid="route.query.processOID"></ProcessRecord> -->
          </div>
          <div class="line-title">流程处理</div>
          <div class="sub-box">
            <ProcessRecord :oid="route.query.processOID"></ProcessRecord>
            <process-advice @processResolution="processResolution"></process-advice>
          </div>
        </div>
      </div>
    </div>
    <!-- <el-affix position="bottom" :offset="0">
      <div class="bottomConfirm">
        <ProcessSubmit ref="processSubmit" @processSubmit="submit" :oid="route.query.workitemOID" @goBack="goBack" :processOID="route.query.processOID"></ProcessSubmit>
      </div>
    </el-affix> -->
  </div>
</template>

<script setup name="editRisk">
import FormLayout from '@/components/formLayout/index.vue';
import SelectedDialog from '@/components/selectedDialog.vue';
import { getAllUser } from '@/api/team.js';
import { useCommonHandler } from '@/hooks';
const { proxy: that } = getCurrentInstance();
const selectUserGrading = ref(null);
const router = useRouter();
const route = useRoute();
// const props = defineProps({
//   riskOid: {
//     type: String,
//   },
// });
const Data = reactive({
  submitData: {},
  processData: {},
  formList: [],
  isLoading: false,
  defaultProps: {
    key: 'id',
    label: 'realname',
  },
  processForm: [],
  userList: [],
  processingSelectData: [],
  rules: {},
  // 附件
  fileList: [],
  riskType: [],
  parmasObj: {
    oid: route.query.oid,
    // typeName: 'com.pisx.pmgt.change.PIProjectIssue',
    processTemplate: 'PIProjectIssueWf',
  },
  issueOid: route.query.oid,
  workitemOID: route.query.workitemOID ? route.query.workitemOID : '',
  workItemName: route.query.workItemName ? route.query.workItemName : '',
  // projectObj: JSON.parse(sessionStorage.getItem('currentProject')),
  projectOid: route.query.projectOid,
  selectUserData: [],
  phaseList: [],
  userInfo: JSON.parse(window.$Cookies.get('userInfo')),
  // riskOid: that.$route.query.riskOid,
  fileArray: [],
  secondaryFileOids: [], // 之前上传的附件oid
  resolution: '',
});

const changeSubmitData = (select, option) => {
  let sel = select[0];
  option.displayValue = sel.realname;
  // if (option.name === 'ActualIdentifier') {
  //   Data.submitData[option.name] = sel.realname;
  //   Data.submitData['identifiedByReference'] = sel.pdcUser;
  // } else if (option.name === 'ActualRespondant') {
  //   Data.submitData[option.name] = sel.realname;
  //   Data.submitData['riskRespondant'] = sel.pdcUser;
  // } else
  if (option.name === 'addedBy') {
    Data.submitData[option.name] = sel.wcUser;
    Data.submitData['ActualAddedBy'] = sel.pdcUser;
  } else if (option.name === 'responsibleUserReference') {
    Data.submitData[option.name] = sel.wcUser;
    Data.submitData['ActualRespondant'] = sel.pdcUser;
  } else {
    Data.submitData[option.name] = sel.pdcUser;
  }
  option.showDialog = false;
};
// 提交审核
const submit = (opera, submit) => {
  Data.isLoading = true;
  that.$refs.form.$refs.ruleForm.validate((valid) => {
    if (valid) {
      selectUserGrading.value.validate(async (valid1, fields) => {
        if (valid1) {
          const obj = new FormData();
          obj.append('actualModifier', `${Data.userInfo.realName}(${Data.userInfo.username})`);
          obj.append('modifier', Data.userInfo.thirdPartUser);
          obj.append('attributes', JSON.stringify(Data.submitData));
          obj.append('issueOid', Data.issueOid);
          Data.fileList.forEach((el) => {
            obj.append('files', el.raw);
          });
          obj.append('secondaryOids', Data.secondaryFileOids);
          window.$api.projectQuestionApi.updateProjectIssue(obj).then((res) => {
            if (res.success) {
              submit({ processUsers: JSON.stringify(Data.selectUserData) });
            } else {
              Data.isLoading = false;
              window.$message.error(res.message);
            }
          });
        } else {
          Data.isLoading = false;
          selectUserGrading.value.checkForm(valid1, fields);
        }
      });
    } else {
      Data.isLoading = false;
    }
  });
  // submit();
};
// // 处理文件
// const handFile = () => {
//   const datas = Data.fileList.map((e) => {
//     return e.raw;
//   });
//   return datas;
// };
// 提交审核后跳转
const goBack = () => {
  router.push({ name: 'toDoPage' });
};
// 上传附件
const handleExceed = (file) => {
  Data.fileList = [];
  let fileList = [];
  fileList = file;
  if (fileList[0].status) {
    delete fileList[0].status;
  }
  Data.fileList = fileList;
};
// 删除文件
const deleteFile = (item) => {
  Data.secondaryFileOids = Data.secondaryFileOids.filter((i) => i !== item.oid);
  Data.fileArray = Data.fileArray.filter((i) => i.oid !== item.oid);
};
// 获取编辑布局
const _getEditLayout = () => {
  let params = {
    serviceKey: 'com.pisx.pmgt.change.PIProjectIssue',
    oid: Data.issueOid,
  };
  window.$api.projectQuestionApi.getEditLayout(params).then((res) => {
    if (res.success) {
      let datas = res.data;
      datas.forEach((v) => {
        v.items.forEach((e) => {
          if (e.name === 'addedBy') {
            e.filedType = 'BUTTON';
          } else if (e.name === 'stage') {
            e.filedType = 'SELECT';
            e.options = Data.phaseList;
          }
        });
      });
      Data.formList = that.$formatData(datas, Data.submitData);
      Data.isLoading = false;
    } else {
      Data.formList = [];
      that.$message.error(res.message);
      Data.isLoading = false;
    }
  });
};
// 获取风险类别
// const getRiskType = () => {
//   window.$api.projectRiskApi.getAllRiskTypes({}).then((res) => {
//     if (res.success) {
//       Data.riskType = res.data;
//     } else {
//       that.$message.error(res.message);
//     }
//   });
// };
// 获取文件集
const getFileList = () => {
  window.$api.projectQuestionApi.queryIssueDetails({ oid: Data.issueOid }).then((res) => {
    if (res.success) {
      Data.fileArray = res.data.secondaryFileNames.map((item, index) => {
        const obj = {};
        obj.oid = res.data.secondaryContentOids[index];
        obj.fileName = item;
        return obj;
      });
      Data.secondaryFileOids = res.data.secondaryContentOids;
    } else {
      window.$message.error(res.message);
    }
  });
};
// 获取意见
const processResolution = (value) => {
  Data.resolution = value;
};
const callback = (type) => {
  if (type === 'error') {
    Data.isLoading = false;
  }
};
// 获取项目阶段列表
const getPhaseColumns = () => {
  window.$api.commonApi.getProjectCurrentWBSPhases({ oid: Data.projectOid }).then((res) => {
    if (res.success) {
      Data.phaseList = res.data.map((item) => {
        const obj = {};
        obj[item.activityOid] = item.innerName;
        return obj;
      });
    } else {
      window.$message.error(res.message);
    }
  });
};
// 查看附件
const handlePreview = (item) => {
  window.$api.fileApi.downloadContent({ oid: item.oid }).then((res) => {
    useCommonHandler.download(res, item.fileName);
  });
};
//获取全量用户  √
const _getAllUser = () => {
  let params = {
    id: '',
    pageNo: 1,
    pageSize: 9999,
    thirdPartySystemId: 1,
  };
  getAllUser(params).then((res) => {
    if (res.success && res.data) {
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
    }
  });
};
onMounted(async () => {
  Data.isLoading = true;
  await getPhaseColumns();
  // await getRiskType();
  await getFileList();
  setTimeout(() => {
    _getEditLayout();
  }, 100);
  _getAllUser();
  // Data.isLoading = false;

  // pagingSearchUser({ page: 1, range: 9999 }).then((res) => {
  //   Data.userList = res.data.rows;
  // });
});
</script>

<style lang="scss" scoped>
.rejectQuestion {
  // height: 100%;
  // min-height: calc(100vh - 168px);
  .bottom-content {
    max-height: calc(100vh - 188px);
    overflow-y: scroll;
  }
  .Topping {
    margin: 0 16px;
    padding: 16px;
    background: #fff;
    // max-height: 210px;
    // height: calc(100vh - 165px);
    // overflow-y: scroll;
  }
  .main-title {
    font-weight: bold;
  }
  .topTitle {
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 20px;
      font-weight: 550;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      padding-bottom: 10px;
      // padding-left: 20px;
    }
    .processName {
      font-size: 20px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  :deep(.mb30) {
    margin-bottom: 20px;
  }
  .section-container {
    .file {
      display: flex;
      .labelCss {
        width: 120px;
        display: inline-block;
        text-align: right;
        color: #666;
        margin-left: 24px;
        padding: 0 12px 0 20px;
      }
      .upload-demo {
        display: inline-block;
        width: calc(50% - 212px);
        .upload-file {
          margin-right: 10px;
        }
      }
    }
    .deleteIcon {
      color: #333;
      font-size: 16px;
      margin-left: 10px;
      cursor: pointer;
      position: relative;
      top: 3px;
    }
    .uploadFile {
      margin-right: 20px;
    }
  }
  // .actionRow {
  //   text-align: right;
  //   background: #fff;
  //   border-top: 1px solid var(--el-border-color-light);
  //   padding: 16px 20px 16px 0;
  // }
  .bottomConfirm {
    width: 100%;
    background: #fff;
    box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.2);
    border-radius: 1px;
    position: absolute;
    bottom: 0px;
  }
  .title {
    //标题
    font-size: 16px;
    font-weight: bolder;
    margin: 20px 0;
  }
}
</style>
