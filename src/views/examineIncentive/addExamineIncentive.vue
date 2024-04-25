<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-11-07 15:19:27
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-08 11:35:44
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\homePage\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="addExamineIncentive">
    <el-dialog v-model="Data.isShowAdd" :title="Data.title" @close="close" destroy-on-close :close-on-click-modal="false">
      <el-form ref="form" class="demo-form-inline">
        <el-col :span="24">
          <el-form-item label="描述:" :required="true" style="width: 100%">
            <el-input type="textarea" v-model="Data.formList.description" clearable />
          </el-form-item>
        </el-col>
        <el-row>
          <el-col :span="12">
            <el-form-item label="阶段:" :required="true">
              <el-select v-model="Data.formList.state" @change="selectState">
                <el-option v-for="(item, index) of Data.stateList" :key="index" :value="item" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评价维度:" :required="false">
              <el-select v-model="Data.formList.evaluation">
                <el-option v-for="(item, index) of Data.evaluationList" :key="index" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="激励:" :required="true" style="width: 100%">
          <el-input-number v-model="Data.formList.incentive" :max="120" />
        </el-form-item>
        <el-form-item label="成员:" :required="false" style="width: 50%">
          <el-select v-model="Data.formList.member" placeholder="请选择成员" filterable multiple>
            <el-option v-for="(item, index) in Data.memberList" :key="index" :label="item.pdcUserRealName" :value="item.pdcUserName"></el-option>
          </el-select>
        </el-form-item>
        <el-col :span="24">
          <el-form-item label="附件:" :required="false" style="width: 100%">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="/"
              :auto-upload="false"
              v-model:file-list="Data.formList.fileList"
              :limit="1"
              :on-exceed="handleExceed"
              :on-change="handleChange"
            >
              <template #trigger>
                <el-button :icon="'upload'">上传</el-button>
                <span></span>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit" :loading="Data.loading">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { listMember } from '@/api/team';
import Cookies from 'js-cookie';
const api = window.$api;
const userInfo = JSON.parse(Cookies.get('userInfo'));
const emit = defineEmits(['update:isShowExamin']);
const props = defineProps({
  //弹窗显示控制
  isShowExamin: {
    type: Boolean,
    default: false,
  },
});
const Data = reactive({
  loading: false,
  isShowAdd: false,
  title: '新增考核激励',
  formList: {
    description: '', //描述
    state: '', // 阶段
    evaluation: '', //评价维度
    incentive: 0, // 激励
    member: '', //成员
    fileList: [],
  },
  memberList: [],
  oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
});

watch(
  () => props.isShowExamin,
  (val) => {
    Data.isShowAdd = val;
    if (val === true) {
      Data.formList.description = '';
      Data.formList.state = '';
      Data.formList.evaluation = '';
      Data.formList.incentive = 0;
      Data.formList.member = '';
      Data.formList.fileList = [];
    }
  },
  {
    deep: true,
  },
);

onMounted(() => {
  // _listMember();
  _queryRewardsUsers();
  _getUnCompletedPhaseNames();
});

const selectState = (e) => {
  _getEvaluationPointNames(e.condition);
};

// 查询项目团队下的项目激励成员组 下面的成员
const _listMember = () => {
  let params = {
    projectId: JSON.parse(sessionStorage.getItem('currentProject'))?.id,
  };
  api.assessmentIncentivesApi.listPureMember(params).then((res) => {
    if (res.success) {
      Data.memberList = res.data.map((e) => {
        return {
          pdcUserName: e.username,
          pdcUserRealName: e.realname,
          wcUserName: e.thirdUsername,
        };
      });
    } else {
      window.$message.error(res.message);
    }
  });
};

// 查询薪酬包用户
const _queryRewardsUsers = () => {
  let params = {
    oid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
  };
  api.payPacketApi.queryRewardsUsers(params).then((res) => {
    if (res.success) {
      Data.memberList = res.data.map((e) => {
        return {
          pdcUserName: e.pdcUser,
          pdcUserRealName: e.pdcRealName,
          // wcUserName: e.thirdUsername || '',
        };
      });
    } else {
      window.$message.error(res.message);
    }
  });
};

// 获取项目评价模板
const _getUnCompletedPhaseNames = () => {
  let params = new FormData();
  params.append('oid', Data.oid);
  api.assessmentIncentivesApi.getUnCompletedPhaseNames(params).then((res) => {
    if (res.success) {
      Data.stateList = res.data;
    } else {
      window.$message.error(res.message);
    }
  });
};

// 获取项目阶段评价
const _getEvaluationPointNames = (e) => {
  let params = new FormData();
  params.append('oid', e);
  api.assessmentIncentivesApi.getEvaluationPointNames(params).then((res) => {
    if (res.success) {
      Data.evaluationList = res.data.map((e) => {
        return {
          label: e,
          value: e,
        };
      });
    } else {
      window.$message.error(res.message);
    }
  });
};

// 上传限制
const handleExceed = (file) => {
  Data.formList.fileList = [];
  let fileList = [
    {
      name: file[0].name,
      raw: file[0],
      percentage: 0,
      size: file[0].size,
      status: 'ready',
      uid: file.uid,
    },
  ];
  Data.formList.fileList = fileList;
};

// 文件改变时的钩子
const handleChange = (file, fileList) => {
  Data.formList.fileList = fileList;
};

const close = () => {
  Data.isShowAdd = false;
  Data.loading = false;
  emit('update:isShowExamin');
};

const submit = () => {
  if (Data.formList.description === '' || Data.formList.state === '' || Data.formList.incentive === null) return window.$message.warning('请填写必填项!');
  Data.loading = true;
  let members = Data.memberList.filter((e) => {
    return Data.formList.member.includes(e.pdcUserName);
  });
  let assessmentIncentives = {
    oid: Data.oid,
    phaseName: Data.formList.state.label,
    description: Data.formList.description,
    incentive: Data.formList.incentive,
    evaluationDimension: Data.formList.evaluation,
    userInfoList: members,
  };
  let params = new FormData();
  params.append('assessmentIncentives', JSON.stringify(assessmentIncentives));
  params.append('creator', userInfo.realName);
  params.append('file', Data.formList.fileList.length > 0 ? Data.formList.fileList[0].raw : []);
  api.assessmentIncentivesApi.createAssessmentIncentives(params).then((res) => {
    if (res.success) {
      window.$message.success('新增成功！');
      Data.isShowAdd = false;
      Data.loading = false;
      emit('update:isShowExamin');
    } else {
      window.$message.error(res.message);
      Data.loading = false;
    }
  });
};
</script>

<style lang="scss" scoped>
.addExamineIncentive {
  .upload-demo {
    width: 600px;
  }
}
</style>
