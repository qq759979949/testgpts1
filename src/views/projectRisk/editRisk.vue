<template>
  <div class="editRisk" v-loading="Data.isLoading">
    <div class="Topping" :style="{ height: `calc(100vh - 180px)`, overflowY: 'scroll' }">
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
          <select-user
            ref="selectUserGrading"
            :parmasObj="Data.parmasObj"
            v-model:selectUserData="Data.selectUserData"
            apiUrl="getReviewInfoByType"
            :changeOid="Data.riskOid"
          ></select-user>
        </section>
      </section>
    </div>
    <el-affix target=".editRisk" position="bottom" :offset="0">
      <div class="actionRow">
        <el-button @click="onSave">保存</el-button>
        <el-button @click="onSubmit" type="primary">提交</el-button>
      </div>
    </el-affix>
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
    typeName: 'com.pisx.pmgt.risk.PIProjectRisk',
    processTemplate: 'PIProjectRiskWf',
  },
  projectOid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  selectUserData: [],
  phaseList: [],
  userInfo: JSON.parse(window.$Cookies.get('userInfo')),
  riskOid: that.$route.query.riskOid,
  fileArray: [],
  secondaryFileOids: [], // 之前上传的附件oid
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
  if (option.name === 'identifiedByReference') {
    Data.submitData[option.name] = sel.wcUser;
    Data.submitData['ActualIdentifier'] = sel.pdcUser;
  } else if (option.name === 'riskRespondant') {
    Data.submitData[option.name] = sel.wcUser;
    Data.submitData['ActualRespondant'] = sel.pdcUser;
  } else {
    Data.submitData[option.name] = sel.pdcUser;
  }
  option.showDialog = false;
};
const onSave = () => {
  Data.isLoading = true;
  that.$refs.form.$refs.ruleForm.validate((valid) => {
    if (valid) {
      const obj = new FormData();
      obj.append('actualModifier', `${Data.userInfo.realName}(${Data.userInfo.username})`);
      obj.append('modifier', Data.userInfo.thirdPartUser);
      obj.append('attributes', JSON.stringify(Data.submitData));
      obj.append('riskOid', Data.riskOid);
      obj.append('selectUserJson', JSON.stringify(Data.selectUserData));
      Data.fileList.forEach((el) => {
        obj.append('files', el.raw);
      });
      obj.append('secondaryOids', Data.secondaryFileOids);
      window.$api.projectRiskApi.updateProjectRisk(obj).then((res) => {
        if (res.success) {
          Data.isLoading = false;
          window.$message.success('保存成功！');
          window.$navTagStore.removeTag(route, router);
          window.$navTagStore.removeCacheTag(route.name);
          router.push({ name: 'projectRisk' });
        } else {
          Data.isLoading = false;
          window.$message.error(res.message);
        }
      });
    } else {
      Data.isLoading = false;
    }
  });
};
// // 处理文件
// const handFile = () => {
//   const datas = Data.fileList.map((e) => {
//     return e.raw;
//   });
//   return datas;
// };
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
const onSubmit = () => {
  Data.isLoading = true;
  that.$refs.form.$refs.ruleForm.validate((valid) => {
    if (valid) {
      selectUserGrading.value.validate(async (valid1, fields) => {
        if (valid1) {
          const obj = new FormData();
          obj.append('actualModifier', `${Data.userInfo.realName}(${Data.userInfo.username})`);
          obj.append('modifier', Data.userInfo.thirdPartUser);
          obj.append('attributes', JSON.stringify(Data.submitData));
          obj.append('riskOid', Data.riskOid);
          Data.fileList.forEach((el) => {
            obj.append('files', el.raw);
          });
          obj.append('secondaryOids', Data.secondaryFileOids);
          window.$api.projectRiskApi.updateProjectRisk(obj).then((res) => {
            if (res.success) {
              let parmas = {
                oid: res.data,
                processTemplate: 'PIProjectRiskWf',
                processUsers: JSON.stringify(Data.selectUserData),
                actualUser: Data.userInfo.username,
              };
              window.$api.commonApi.startWfProcess(parmas).then((res1) => {
                if (res1.success) {
                  Data.isLoading = false;
                  window.$message.success('启动成功！');
                  window.$navTagStore.removeTag(route, router);
                  window.$navTagStore.removeCacheTag(route.name);
                  router.push({ name: 'projectRisk' });
                } else {
                  Data.isLoading = false;
                  window.$message.error(res1.message);
                }
              });
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
};
// 获取编辑布局
const _getEditLayout = () => {
  let params = {
    serviceKey: 'com.pisx.pmgt.risk.PIProjectRisk',
    oid: Data.riskOid,
  };
  window.$api.projectRiskApi.getEditLayout(params).then((res) => {
    if (res.success) {
      let datas = res.data;
      datas.forEach((v) => {
        v.items.forEach((e) => {
          if (e.name === 'riskTypeReference') {
            e.filedType = 'TREESELECT';
            e.options = Data.riskType;
            e.props = {
              children: 'children',
              label: 'name',
            };
            e.nodeKey = 'oid';
          } else if (e.name === 'riskRespondant') {
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
const getRiskType = () => {
  window.$api.projectRiskApi.getAllRiskTypes({}).then((res) => {
    if (res.success) {
      Data.riskType = res.data;
    } else {
      that.$message.error(res.message);
    }
  });
};
// 获取文件集
const getFileList = () => {
  window.$api.projectRiskApi.getRiskDetails({ oid: Data.riskOid }).then((res) => {
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
  await getRiskType();
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
.editRisk {
  // height: 100%;
  // min-height: calc(100vh - 168px);
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
  .actionRow {
    text-align: right;
    background: #fff;
    border-top: 1px solid var(--el-border-color-light);
    padding: 16px 20px 16px 0;
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .title {
    //标题
    font-size: 16px;
    font-weight: bolder;
    margin: 20px 0;
  }
}
</style>
