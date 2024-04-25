<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-16 15:55:08
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectRisk\riskDetail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="questionProcess" v-loading="Data.isLoading">
    <div class="topDetail" ref="topArea">
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
      <div class="description-box">
        <!-- <objectInfo :detailLayout="item.items" :column="3" :infoTitle="item.groupName" v-for="(item, index) in Data.infoDatas" :key="index"></objectInfo> -->
        <FormDetail ref="form" labelWidth="200px" :formList="Data.infoDatas" v-model:submitData="Data.submitData"></FormDetail>
        <div class="file">
          <span class="labelCss">附件：</span>
          <el-form-item :required="false" style="width: 100%">
            <div v-for="(item, index) in Data.fileArray" :key="index" class="uploadFile">
              <el-link type="primary" @click="handlePreview(item)">{{ item.fileName }}</el-link>
            </div>
          </el-form-item>
        </div>
      </div>
    </div>
    <div class="bottomProcess" :style="{ height: `calc(100vh - ${Data.computedHeight}px)`, overflowY: 'scroll' }">
      <div class="line-title" v-if="Data.workItemName === '解决问题' && !route.query.isCompleted">问题处理</div>
      <div class="sub-box" v-if="Data.workItemName === '解决问题' && !route.query.isCompleted">
        <el-form :model="Data.form" label-width="auto" :rules="Data.rules" ref="ruleForm">
          <el-form-item label="处理措施：" prop="desc">
            <el-input v-model="Data.form.desc" type="textarea" />
          </el-form-item>
          <el-form-item label="附件：">
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
    <!-- <el-affix position="bottom" :offset="0" v-if="!route.query.isCompleted">
      <div class="bottomConfirm">
        <ProcessSubmit ref="processSubmit" @processSubmit="submit" :oid="route.query.workitemOID" @goBack="goBack" :processOID="route.query.processOID"></ProcessSubmit>
      </div>
    </el-affix> -->
  </div>
</template>

<script setup>
import ProcessRecord from '@/components/process/processRecord.vue';
import { useCommonHandler } from '@/hooks';
import { useResizeObserver } from '@vueuse/core';
const router = useRouter();
const route = useRoute();
const topArea = ref();
const { proxy: that } = getCurrentInstance();
const Data = reactive({
  isLoading: false,
  infoDatas: [],
  issueOid: route.query.issueOid,
  workItemName: route.query.workItemName ? route.query.workItemName : '',
  // projectObj: JSON.parse(sessionStorage.getItem('currentProject')),
  fileArray: [],
  fileArr: [],
  computedHeight: null,
  submitData: {},
  form: {},
  rules: {
    desc: [{ required: true, message: '请输入', trigger: 'blur' }],
  },
  userInfo: JSON.parse(window.$Cookies.get('userInfo')),
  resolution: '',
});
// 获取文件详情
const getRiskDetail = () => {
  window.$api.projectQuestionApi.queryIssueDetails({ oid: Data.issueOid }).then((res) => {
    if (res.success) {
      Data.fileArray = res.data.secondaryFileNames.map((item, index) => {
        const obj = {};
        obj.oid = res.data.secondaryContentOids[index];
        obj.fileName = item;
        return obj;
      });
    } else {
      window.$message.error(res.message);
    }
  });
};
// 获取解决问题附件详情
const getSolutionDetail = () => {
  window.$api.projectRiskApi.queryContentFiles({ oid: Data.issueOid }).then((res) => {
    if (res.success) {
      Data.form.desc = res.data.solution;
      Data.fileArr = res.data.secondaryFileNames.map((item, index) => {
        const obj = {};
        obj.oid = res.data.secondaryContentOids[index];
        obj.fileName = item;
        return obj;
      });
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
// 获取详情
const getRiskLayout = () => {
  Data.isLoading = true;
  window.$api.projectQuestionApi.getInfoLayout({ oid: Data.issueOid }).then((res) => {
    if (res.success) {
      let datas = res.data.map((item) => {
        item.groupName = '';
        item.items = item.items.map((i) => {
          i.label = i.label + '：';
          i.value = i.displayValue;
          i.filedType = 'DISPLAY';
          i.required = false;
          return i;
        });
        return item;
      });
      datas.forEach((v) => {
        v.items.forEach((e) => {
          Data.submitData[e.name] = '';
        });
      });
      Data.infoDatas = window.$formatData(datas, Data.submitData);
      Data.infoDatas.forEach((item) => {
        item.list = item.list.map((el) => {
          el.maxSpan = el.length;
          return el;
        });
      });
      Data.isLoading = false;
    } else {
      window.$message.error(res.message);
      Data.isLoading = false;
    }
  });
};
// 查看附件
const handlePreview = (item) => {
  window.$api.fileApi.downloadContent({ oid: item.oid }).then((res) => {
    useCommonHandler.download(res, item.fileName);
  });
};
// 提交审核
const submit = (opera, submit) => {
  if (Data.workItemName !== '解决问题') {
    submit();
  } else {
    Data.isLoading = true;
    if (opera === '已解决') {
      that.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const obj = new FormData();
          obj.append('solution', Data.form.desc);
          obj.append('oid', Data.issueOid);
          if (Data.form.fileList && Data.form.fileList.length > 0) {
            Data.form.fileList.forEach((el) => {
              obj.append('files', el.raw);
            });
          }
          window.$api.projectRiskApi.updateContentFiles(obj).then((res) => {
            if (res.success) {
              Data.isLoading = false;
              window.$message.success('保存成功！');
              submit();
            } else {
              Data.isLoading = false;
              window.$message.error(res.message);
            }
          });
        } else {
          window.$message.error('请检查处理措施是否填写');
          Data.isLoading = false;
        }
      });
    } else {
      Data.isLoading = false;
      submit();
    }
  }

  // submit();
};
// 删除文件
const deleteFile = (item) => {
  Data.fileArr = Data.fileArr.filter((i) => i.oid !== item.oid);
  const obj = new FormData();
  obj.append('secondaryOids', item.oid);
  obj.append('oid', Data.issueOid);
  window.$api.projectRiskApi.deleteContentFiles(obj).then((res) => {
    if (res.success) {
      window.$message.success('删除成功！');
    } else {
      window.$message.error(res.message);
    }
  });
};
// 提交审核后跳转
const goBack = () => {
  router.push({ name: 'toDoPage' });
};
// 上传附件
const handleExceed = (file) => {
  Data.form.fileList = [];
  let fileList = [];
  fileList = file;
  if (fileList[0].status) {
    delete fileList[0].status;
  }
  Data.form.fileList = fileList;
};
// // 获取路由
// const queryRoute = () => {
//   window.$api.processApi.queryProcessHistory({ oid: Data.riskOid, queryAll: false }).then((res) => {
//     if (res.success) {
//       Data.processOid = res.data.length > 0 ? res.data[0].processOid : '';
//     } else {
//       window.$message.error(res.message);
//     }
//   });
// };
onMounted(() => {
  getRiskDetail();
  getRiskLayout();
  // queryRoute();
  getSolutionDetail();
  useResizeObserver(topArea, (entries) => {
    const entry = entries[0];
    const { height } = entry.contentRect;
    if (route.query.isCompleted) {
      Data.computedHeight = `${height + 160}`;
    } else {
      Data.computedHeight = `${height + 160}`;
    }
  });
});
</script>

<style lang="scss" scoped>
.questionProcess {
  .topDetail {
    background-color: #fff;
    padding: 16px;
    // max-height: 310px;
    // overflow-y: scroll;
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
  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  .description-box {
    // max-height: 200px;
    // overflow-y: scroll;
    :deep(.desc-row) {
      color: #333;
    }
    :deep(.desc-label) {
      color: #666;
    }
    :deep(.desc-label::after) {
      content: '：';
    }
  }
  .file {
    display: flex;
    .labelCss {
      width: 220px;
      display: inline-block;
      text-align: left;
      color: #666;
      font-weight: 550;
      padding: 0 12px 0 20px;
      font-size: 14px;
      // font-weight: 700;
    }
  }
  .fileArr {
    margin-left: 50px;
    .deleteIcon {
      color: #333;
      font-size: 16px;
      margin-left: 10px;
      cursor: pointer;
      position: relative;
      top: 6px;
    }
  }
  .line-title {
    font-size: 16px;
    font-weight: bold;
    padding: 12px;
    // margin-top: 20px;
    border-bottom: 1px solid #ddd;
  }
  .uploadFile {
    margin-right: 20px;
    margin-top: -6px;
  }
  .sub-box {
    padding: 12px;
  }
  .bottomProcess {
    background-color: #fff;
    margin: 16px 16px 0 16px;
    // padding: 16px;
  }
  .bottomConfirm {
    width: 100%;
    background: #fff;
    box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.2);
    border-radius: 1px;
    position: absolute;
    bottom: 0px;
  }
  :deep(.demo-ruleForm .row-value1) {
    color: #000;
  }
}
</style>
