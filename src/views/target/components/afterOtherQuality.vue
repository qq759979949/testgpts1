<template>
  <div>
    <div class="btn" v-if="Data.prototype !== '产品类开发项目' && Data.state === '工作进行中'">
      <div style="text-align: right" v-if="(Data.state === '工作进行中' && route.name === 'target' && Data.groupFlag && Data.roleFlag) || Data.allRoleName">
        <el-button type="primary" @click="handlePresent">{{ $intl('submit').d('保存') }}</el-button>
      </div>
    </div>
    <levelTable :columns="Data.afterColums" :tableData="Data.tableData" :tableLoad="Data.tableLoad" :border="true" :isCheckBox="false" :columnIndex="0" :isAddColumn="true">
      <template #formula="scope">
        <el-tooltip :content="scope.row.formula" placement="top">
          <div class="columnTitle">
            {{ scope.row.formula }}
          </div>
        </el-tooltip>
      </template>
      <template #fileName="scope">
        <el-link type="primary" :underline="true" @click="handleDown(scope.row)">
          {{ scope.row.fileName }}
        </el-link>
      </template>
      <template #actuallyValue="scope">
        <span v-if="Data.state === '工作进行中' && route.name === 'target'">
          <el-input v-model="scope.row.actuallyValue" placeholder="请输入" controls-position="right" size="small" v-if="Data.roleFlag || Data.groupFlag || Data.allRoleName" />
        </span>
        <span v-else>{{ scope.row.actuallyValue }}</span>
      </template>
      <template #targetIsCompliance="scope">
        <span v-if="Data.state === '工作进行中' && route.name === 'target'">
          <el-select v-model="scope.row.targetIsCompliance" style="width: 100%" v-if="Data.roleFlag || Data.groupFlag || Data.allRoleName">
            <el-option key="yes" :label="'是'" :value="'是'" />
            <el-option key="no" :label="'否'" :value="'否'" />
          </el-select>
        </span>
        <span v-else :class="scope.row.targetIsCompliance === '否' ? 'compliance' : ''">{{ scope.row.targetIsCompliance }}</span>
      </template>
      <template #targetFileName="scope">
        <span v-if="Data.state === '工作进行中' && route.name === 'target'">
          <span v-if="Data.roleFlag || Data.groupFlag || Data.allRoleName">
            <el-button @click="targetUploadFlie(scope.row)" v-if="scope.row.targetFileName === '' || scope.row.targetFileName === undefined">
              <i class="iconfont icon-shangchuan" style="margin-right: 5px"></i>
              上传文件
            </el-button>
            <div v-else class="uploadTitle">
              <el-popconfirm title="确定删除?" confirm-button-text="确认" cancel-button-text="取消" placement="right" @confirm="targetDeleteFile(scope.row)">
                <template #reference>
                  <span class="upload-icon">
                    <el-icon><CloseBold /></el-icon>
                  </span>
                </template>
              </el-popconfirm>
              <el-link type="primary" :underline="true" @click="handleTargetDown(scope.row)">
                <el-tooltip :content="scope.row.targetFileName" placement="top">
                  <div class="columnTitle">
                    {{ scope.row.targetFileName }}
                  </div>
                </el-tooltip>
              </el-link>
            </div>
          </span>
        </span>
        <span v-else>
          <el-link type="primary" :underline="true" @click="handleTargetDown(scope.row)">
            <el-tooltip :content="scope.row.targetFileName" placement="top">
              <div class="columnTitle">
                {{ scope.row.targetFileName }}
              </div>
            </el-tooltip>
          </el-link>
        </span>
      </template>
      <template #isCompliance="scope">
        <span :class="scope.row.isCompliance === '否' ? 'prototype' : ''">{{ scope.row.isCompliance }}</span>
      </template>
    </levelTable>
  </div>
  <!-- 上传文件 -->
  <upload-dialog v-model:isShow="Data.importShow" :isSingle="true" title="上传文件" @submit="submitImport"></upload-dialog>
</template>

<script setup>
import levelTable from '@/views/projectInitiation/components/levelTable.vue';
import { useCommonHandler } from '@/hooks';
import { getGroupNamesByUserName } from '@/api/team';
const api = window.$api;
const route = useRoute();
const Data = reactive({
  tableLoad: false,
  importShow: false,
  afterColums: [
    {
      label: '指标名称',
      dataIndex: 'indicatorName',
    },
    {
      label: '指标小类',
      dataIndex: 'indicatorSmallType',
    },
    {
      label: '单位',
      dataIndex: 'unit',
    },
    {
      label: '权重',
      dataIndex: 'weight',
    },
    {
      label: '公式',
      dataIndex: 'formula',
    },
    {
      label: '本项目目标值',
      dataIndex: 'projectTargetValue',
    },
    {
      label: '实际值',
      dataIndex: 'actuallyValue',
    },
    {
      label: '是否达标',
      dataIndex: 'targetIsCompliance',
    },
    {
      label: '证明文件',
      dataIndex: 'targetFileName',
    },
    {
      label: '备注',
      dataIndex: 'remark',
    },
  ],
  tableData: [],
  oid: route.query.processOID ? JSON.parse(sessionStorage.getItem('taskProject'))?.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  acceptancePhaseList: [],
  phaseInfoList: [],
  uploadFlieRow: '',
  state: route.query.processOID ? JSON.parse(sessionStorage.getItem('taskProject'))?.state : JSON.parse(sessionStorage.getItem('currentProject'))?.state,
  userName: JSON.parse(window.$Cookies.get('userInfo'))?.username,
  type: route.query.processOID ? JSON.parse(sessionStorage.getItem('taskProject'))?.type : JSON.parse(sessionStorage.getItem('currentProject'))?.type,
  allRoleName: false,
});
// 查询目标指标
const getTargetType = () => {
  Data.tableLoad = true;
  let params = {
    oid: Data.oid,
    targetIndicatorsType: '质量指标',
    orderNumbers: '',
  };
  api.targetApi.queryTargetIndicators(params).then((res) => {
    if (res.success) {
      Data.tableData = res.data;
      Data.tableData.length > 0 &&
        Data.tableData.forEach((item) => {
          item.phaseInfoList.forEach((row) => {
            item.actuallyValue = row.actuallyValue;
            item.fileName = row.fileName;
            item.isCompliance = row.isCompliance;
            item.appDataOid = row.appDataOid;
          });
        });
      Data.tableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
};
// 验收阶段
const acceptancePhase = () => {
  api.payPacketApi.queryReviewPhaseByProjectType({ oid: Data.oid }).then((res) => {
    if (res.success) {
      Data.acceptancePhaseList = res.data.map((item) => {
        return {
          label: item.name,
          value: item.label,
        };
      });
      Data.acceptancePhaseList.forEach((item) => {
        Data.afterColums.push({
          label: item.label,
          dataIndex: '',
          children: [
            {
              label: '实际值',
              dataIndex: 'actuallyValue',
            },
            {
              label: '是否达标',
              dataIndex: 'isCompliance',
            },
            {
              label: '证明文件',
              dataIndex: 'fileName',
            },
          ],
        });
      });
    }
  });
};
const handlePresent = () => {
  let repetition = Data.tableData.some((item, index) => {
    return Data.tableData.slice(index + 1).some((item2) => item.indicatorName === item2.indicatorName);
  });
  if (repetition) return window.$message.warning('指标名称不能重复');
  Data.tableLoad = true;
  let params = {
    oid: Data.oid,
    indicatorType: '质量指标',
    targetIndicatorsInfos: JSON.stringify(Data.tableData),
  };
  api.targetApi.saveTargetIndicators(params).then((res) => {
    if (res.success) {
      window.$message.success('保存成功');
      getTargetType();
      Data.tableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
};
// 上传
const targetUploadFlie = (row) => {
  Data.importShow = true;
  Data.uploadFlieRow = row;
};
// 删除
const targetDeleteFile = (row) => {
  let params = new FormData();
  params.append('fileOid', row.fileOid);
  api.targetApi.deleteTargetIndicatorFile(params).then((res) => {
    if (res.success) {
      window.$message.success('删除成功');
      // getTargetType();
      Data.tableData.map((item) => {
        if (item.targetIndicatorOid === row.targetIndicatorOid) {
          item.fileOid = '';
          item.targetFileName = '';
        }
      });
    } else {
      window.$message.error(res.message);
    }
  });
};
// 上传确定
const submitImport = (fileList) => {
  let newParmas = new FormData();
  newParmas.append('oid', Data.uploadFlieRow.targetIndicatorOid);
  newParmas.append('fileName', fileList[0].raw);
  api.targetApi.uploadTargetIndicatorFile(newParmas).then((res) => {
    if (res.success) {
      Data.uploadFlieRow.targetFileName = fileList[0].name;
      Data.tableData.map((item) => {
        if (item.projectOid === Data.uploadFlieRow.projectOid) {
          item = Data.uploadFlieRow;
        }
      });
      Data.importShow = false;
      window.$message.success('上传成功');
      Data.tableData.map((item) => {
        if (item.targetIndicatorOid === Data.uploadFlieRow.targetIndicatorOid) {
          item.fileOid = res.data.appDataOid;
          item.targetFileName = res.data.fileName;
        }
      });
    } else {
      Data.importShow = false;
      window.$message.error(res.message);
    }
  });
};
// 下载
const handleDown = ({ appDataOid, fileName }) => {
  api.targetApi.downloadContent({ oid: appDataOid }).then((result) => {
    if (result) {
      if (!result) return window.$message.error('下载失败');
      useCommonHandler.download(result, fileName);
    }
  });
};
const handleTargetDown = (row) => {
  api.targetApi.downloadContent({ oid: row.fileOid }).then((result) => {
    if (result) {
      if (!result) return window.$message.error('下载失败');
      useCommonHandler.download(result, row.targetFileName);
    }
  });
};
// 查询用户组
const userGroups = () => {
  getGroupNamesByUserName({ userName: Data.userName }).then((res) => {
    if (res.code === 200) {
      let newData = res.data;
      let rolesToCheck = ['制造技术类项目创建组', '信息技术类项目创建组'];
      const containsRole = rolesToCheck.some((role) => newData.includes(role));
      // 当前用户在组里,并且与当前项目类型一致,可以编辑
      const filteredRoles = newData.filter((item) => {
        const regex = new RegExp(Data.type, 'i');
        return regex.test(item);
      });
      if (filteredRoles.length > 0 && containsRole) {
        Data.groupFlag = true;
      } else if (filteredRoles.length > 0 && !containsRole) {
        Data.groupFlag = false;
      } else if (filteredRoles.length === 0 && containsRole) {
        Data.groupFlag = false;
      } else if (filteredRoles.length === 0 && !containsRole) {
        Data.groupFlag = false;
      }
    } else {
      window.$message.error(res.message);
    }
  });
};
// 查询团队
const getRoleData = () => {
  let params = {
    projectOid: Data.oid,
    userName: JSON.parse(window.$Cookies.get('userInfo')).username,
  };
  api.commonApi.getRoleNamesByUserName(params).then((res) => {
    if (res.success) {
      let currentRole = res?.data;
      let rolesToCheck = ['项目经理', '项目助理'];
      const roleObj = rolesToCheck.some((role) => currentRole.includes(role));
      roleObj ? (Data.roleFlag = true) : (Data.roleFlag = false);
    } else {
      window.$message.error(res.message);
    }
  });
};
onMounted(() => {
  getTargetType();
  acceptancePhase();
  if ((route.name === 'target' && Data.type === '信息技术类项目') || Data.type === '制造技术类项目') {
    let roleName = JSON.parse(window.$Cookies.get('userInfo'))?.roles;
    let roleObj = roleName.some((item) => item.roleName === '管理员' && item.roleId === '1');
    roleObj ? (Data.allRoleName = true) : (Data.allRoleName = false);
    userGroups();
    getRoleData();
  }
});
</script>

<style lang="less" scoped>
.btn {
  margin-bottom: 10px;
}
.uploadTitle {
  position: relative;
  .upload-icon {
    position: absolute;
    right: -8%;
    cursor: pointer;
    top: 8%;
    color: #386bda;
  }
  .columnTitle {
    max-width: 100px;
    word-wrap: break-word;
  }
}
.compliance {
  font-size: 14px;
  font-family: 'PingFangSC, PingFang SC';
  font-weight: 400;
  background: rgb(247, 211, 2);
  width: 65px;
  height: 32px;
  line-height: 32px;
  display: inline-block;
  border-radius: 3px;
}
:deep(.el-input--large .el-input__inner) {
  width: 45px;
}
:deep(.el-input__wrapper) {
  height: 30px;
}
</style>
