<template>
  <div class="payPacket page_common" v-loading="Data.pageLoading">
    <h3>{{ route.meta.tagTitle }}</h3>
    <div class="header">
      <div class="btnList">
        <el-button type="primary" v-permission="'/plmProject/EAI'" @click="add(false)">新增</el-button>
        <el-button v-permission="'/plmProject/EAI'" @click="add(true)">编辑</el-button>
        <el-popconfirm title="是否要删除选择的数据？" @confirm="del">
          <template #reference>
            <el-button v-permission="'/plmProject/DAI'">删除</el-button>
          </template>
        </el-popconfirm>
        <el-button @click="changeRecord">变更记录</el-button>
      </div>
      <el-input v-model="Data.searchValue" @change="searchHandler" style="width: 224px" placeholder="请输入搜索关键词" clearable>
        <template #suffix>
          <el-icon class="el-input__icon"><Search /></el-icon>
        </template>
      </el-input>
    </div>
    <div class="content">
      <PiTable
        :columns="Data.colunms"
        :data="Data.tableData"
        :selectable="true"
        @selectionChange="changeSelect"
        :isShowSetting="false"
        rowKey="index"
        :tableLoad="Data.tableLoad"
        :pagination="true"
        :total="Data.tableData.length"
        ref="projectTable"
        @updateTableData="updateTableData"
      >
        <template #fileInfo="scope">
          <el-link v-if="scope.row.fileInfo.length > 0" :underline="false" type="primary" @click="handleExport(scope.row.fileInfo[0])">
            {{ scope.row.fileInfo[0].fileName }}
          </el-link>
          <span v-else></span>
        </template>
        <template #phaseName="scope">
          <span>{{ scope.row.phaseName.value }}</span>
        </template>
      </PiTable>
    </div>
    <pisx-dialog :isShow="Data.isShowAdd" :title="Data.title" :width="800" @close="close" @submit="submit(Data.title)" v-model:loading="Data.loading">
      <template #content>
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
            <el-input-number v-model="Data.formList.incentive" />
          </el-form-item>
          <el-form-item label="成员:" :required="false" style="width: 50%">
            <el-select v-if="Data.title === '新增'" v-model="Data.formList.member" placeholder="请选择成员" filterable multiple>
              <el-option v-for="(item, index) in Data.memberList" :key="index" :label="item.pdcUserRealName" :value="item.pdcUserName"></el-option>
            </el-select>
            <el-select v-else v-model="Data.formList.member" :disabled="true">
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
      </template>
    </pisx-dialog>
    <pisx-dialog :title="'变更记录'" :width="1000" :isShow="Data.isShowChangeRecord" @close="Data.isShowChangeRecord = false" @submit="Data.isShowChangeRecord = false">
      <template #content>
        <div class="changeTop">
          <span>共3个对象</span>
          <div style="margin-left: 10px">
            <el-input v-model="Data.changeSearchVal" placeholder="请输入你需要搜索的内容">
              <template #suffix>
                <el-icon class="el-input__icon"><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
        <PiTable
          :columns="Data.changeRecordColumn"
          :data="Data.changeRecordTableData"
          :selectable="false"
          :isShowSetting="false"
          rowKey="index"
          :tableLoad="Data.tableLoad"
          :pagination="true"
          :total="Data.tableData.length"
          ref="projectTable"
          @updateTableData="updateTableData"
        ></PiTable>
      </template>
    </pisx-dialog>
  </div>
</template>

<script setup name="examineIncentive">
import { listMember } from '@/api/team';
import * as _ from 'lodash';
import { useCommonHandler } from '@/hooks';
import Cookies from 'js-cookie';
const api = window.$api;
const route = useRoute();
const userInfo = JSON.parse(Cookies.get('userInfo'));

const Data = reactive({
  loading: false,
  pageLoading: false,
  oid: '',
  assessmentIncentiveOid: '', //考核激励的oid
  title: '',
  formList: {
    description: '', //描述
    state: '', // 阶段
    evaluation: '', //评价维度
    incentive: 0, // 激励
    member: '', //成员
    fileList: [],
  },
  stateList: [], // 阶段列表
  evaluationList: [], // 评价列表
  isShowAdd: false, // 显示新增
  isShowChangeRecord: false, // 控制变更记录显示
  tableLoad: false, // 表格加载状态
  searchValue: '',
  changeSearchVal: '', // 变更记录搜索关键字
  colunms: [
    {
      title: '描述',
      dataIndex: 'description',
      width: 220,
    },
    {
      title: '阶段',
      dataIndex: 'phaseName',
    },
    {
      title: '激励',
      dataIndex: 'incentive',
    },
    {
      title: '成员',
      dataIndex: 'pdcUserRealName',
    },
    {
      title: '附件',
      dataIndex: 'fileInfo',
    },
    {
      title: '创建者',
      dataIndex: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      width: 180,
      filters: 'date',
    },
  ],
  tableData: [],
  tableDataCopy: [],
  // 变更记录表头
  changeRecordColumn: [
    {
      title: '时间',
      dataIndex: 'createDate',
      width: 150,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
    },
    {
      title: '操作说明',
      dataIndex: 'operateDesc',
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 220,
    },
    {
      title: '阶段',
      dataIndex: 'phaseName',
    },
    {
      title: '激励',
      dataIndex: 'incentive',
    },
    {
      title: '成员',
      dataIndex: 'pdcUserRealName',
    },
  ],
  // 变更记录表格
  changeRecordTableData: [],
  changeRecordTableDataCopy: [],
  memberList: [], // 项目激励成员列表
  selectRow: [],
});

watch(
  () => Data.changeSearchVal,
  (newVal) => {
    Data.changeRecordTableData = onSearch(newVal, Data.changeRecordTableDataCopy);
  },
  {
    deep: true,
  },
);

// watch(
//   () => Data.searchValue,
//   (newVal) => {
//     Data.tableData = onSearch(newVal, Data.tableDataCopy);
//   },
//   {
//     deep: true,
//   },
// );

onMounted(() => {
  Data.oid = JSON.parse(sessionStorage.getItem('currentProject')).oid;
  _queryAssessmentIncentives(); // 查询考核激励
  _getUnCompletedPhaseNames(); // 查询阶段下拉
  _queryRewardsUsers(); // 查询薪酬包用户
  // _listMember(); // 获取成员信息
});

// 查询变更记录
const _queryRecords = () => {
  let params = {
    oid: Data.oid,
  };
  api.assessmentIncentivesApi.queryRecords(params).then((res) => {
    if (res.success) {
      Data.changeRecordTableData = res.data;
      Data.changeRecordTableDataCopy = JSON.parse(JSON.stringify(res.data));
    } else {
      window.$message.error(res.message);
    }
  });
};

// 搜索方法
const searchHandler = (val) => {
  let handSearchTable = [];
  if (val) {
    Data.tableDataCopy.filter((item) => {
      let count = 0;
      for (let k in item) {
        if (item[k]) {
          let nowValue = item[k].toString();
          if (nowValue.includes(val)) {
            count++;
          } else if (item[k].label && item[k].label.includes(val)) {
            count++;
          } else if (k === 'fileInfo') {
            if (item.fileInfo.length > 0 && item.fileInfo[0].fileName.includes(val)) {
              count++;
            }
          }
        }
      }
      if (count) {
        handSearchTable.push(item);
      }
    });
    Data.tableData = handSearchTable;
  } else {
    Data.tableData = Data.tableDataCopy;
  }
};

// 查询考核激励
const _queryAssessmentIncentives = () => {
  Data.pageLoading = true;
  let params = {
    oid: Data.oid,
  };
  api.assessmentIncentivesApi.queryAssessmentIncentives(params).then((res) => {
    if (res.success) {
      Data.tableData = res.data;
      Data.tableDataCopy = _.cloneDeep(res.data);
      Data.pageLoading = false;
    } else {
      window.$message.error(res.message);
      Data.pageLoading = false;
    }
  });
};

// 获取项目评价模板
const _getUnCompletedPhaseNames = () => {
  Data.stateList = [];
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

// 选择评价阶段
const selectState = (e) => {
  _getEvaluationPointNames(e.condition);
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

// 数组去重
const uniqueArray = (array) => {
  return [...new Set(array)];
};

// 新增或者编辑
const add = (e) => {
  if (e) {
    // 编辑
    if (Data.selectRow.length !== 1) return window.$message.warning('请选择一条数据!');
    let phaseNames = Data.selectRow[0].phaseName.label;
    let paramsObj = new FormData();
    paramsObj.append('oid', Data.oid);
    paramsObj.append('phaseName', phaseNames);
    // 先判断有没有编辑的权限
    api.assessmentIncentivesApi.checkOperateAssessmentIncentive(paramsObj).then((result) => {
      if (result.success) {
        let obj = Data.selectRow[0];
        Data.title = '编辑';
        Data.isShowAdd = true;
        let phaseNameObj = Data.stateList.filter((e) => {
          return e.label === obj.phaseName.label;
        });
        Data.assessmentIncentiveOid = obj.assessmentIncentiveOid;
        Data.formList = {
          description: obj.description, //描述
          state: phaseNameObj[0], // 阶段
          evaluation: obj.evaluationDimension, //评价维度
          incentive: obj.incentive, // 激励
          member: obj.pdcUserRealName, //成员
        };
        if (obj.fileInfo && obj.fileInfo.length > 0) {
          Data.formList.fileList = [
            {
              name: obj.fileInfo[0].fileName,
            },
          ];
        } else {
          Data.formList.fileList = [];
        }
        _getEvaluationPointNames(phaseNameObj[0].condition);
      } else {
        window.$message.error(result.message);
      }
    });
  } else {
    let paramsObj = new FormData();
    paramsObj.append('oid', Data.oid);
    api.assessmentIncentivesApi.checkAddAssessmentIncentive(paramsObj).then((res) => {
      if (res.success) {
        // 新增
        Data.title = '新增';
        Data.formList = {
          description: '', //描述
          state: '', // 阶段
          evaluation: '', //评价维度
          incentive: 0, // 激励
          member: '', //成员
          fileList: [],
        };
        Data.isShowAdd = true;
      } else {
        window.$message.error(res.message);
      }
    });
  }
};

// 删除
const del = () => {
  if (Data.selectRow.length === 0) return window.$message.warning('请选择数据!');
  let oids = '';
  let phaseNames = [];
  Data.selectRow.forEach((e, index) => {
    phaseNames.push(e.phaseName.label);
    oids = index === Data.selectRow.length - 1 ? oids + e.assessmentIncentiveOid : oids + e.assessmentIncentiveOid + ',';
  });
  phaseNames = uniqueArray(phaseNames);
  console.log(phaseNames, 446);
  let realName = userInfo.realName;
  let paramsObj = new FormData();
  paramsObj.append('oid', Data.oid);
  paramsObj.append('phaseName', phaseNames.join(','));
  api.assessmentIncentivesApi.checkOperateAssessmentIncentive(paramsObj).then((result) => {
    if (result.success) {
      let params = new FormData();
      params.append('oid', Data.oid);
      params.append('oids', oids);
      params.append('pdcRealName', realName);
      api.assessmentIncentivesApi.deleteAssessmentIncentives(params).then((res) => {
        if (res.success) {
          window.$message.success('删除成功！');
          _queryAssessmentIncentives();
        } else {
          window.$message.error(res.message);
        }
      });
    } else {
      window.$message.error(result.message);
    }
  });
};

// 变更记录
const changeRecord = () => {
  Data.isShowChangeRecord = true;
  _queryRecords(); //
};

//关闭新增/编辑弹窗
const close = () => {
  Data.isShowAdd = false;
  Data.loading = false;
  Data.formList = {
    description: '', //描述
    state: '', // 阶段
    evaluation: '', //评价维度
    incentive: 0, // 激励
    member: '', //成员
    fileList: [],
  };
};

// 新增/编辑弹窗提交按钮
const submit = (e) => {
  if (e === '新增') {
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
        _queryAssessmentIncentives();
        Data.isShowAdd = false;
        Data.loading = false;
      } else {
        Data.loading = false;
        window.$message.error(res.message);
      }
    });
  } else {
    if (Data.formList.description === '' || Data.formList.incentive === null) return window.$message.warning('请填写必填项!');
    let assessmentIncentives = {
      oid: Data.oid,
      assessmentIncentiveOid: Data.assessmentIncentiveOid,
      phaseName: Data.formList.state.label,
      description: Data.formList.description,
      incentive: Data.formList.incentive,
      evaluationDimension: Data.formList.evaluation,
    };
    let params = new FormData();
    params.append('assessmentIncentives', JSON.stringify(assessmentIncentives));
    params.append('creator', userInfo.realName);
    if (Data.formList.fileList.length > 0 && Data.formList.fileList[0].raw) {
      params.append('file', Data.formList.fileList[0].raw);
    }
    params.append('isDelete ', Data.formList.fileList.length === 0 ? 1 : 2);
    api.assessmentIncentivesApi.editAssessmentIncentives(params).then((res) => {
      if (res.success) {
        window.$message.success('编辑成功！');
        Data.assessmentIncentiveOid = '';
        _queryAssessmentIncentives();
        Data.isShowAdd = false;
        Data.loading = false;
      } else {
        window.$message.error(res.message);
        Data.loading = false;
      }
    });
  }
};

//选择的数据
const changeSelect = (rowKey, row) => {
  Data.selectRow = row;
};

const upload = ref('');

const form = ref('');
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

// 点击下载
const handleExport = (e) => {
  let params = new FormData();
  params.append('oid', e.fileOid);
  api.commonApi.downloadContent(params).then((res) => {
    if (!res) return window.$message.error('下载失败');
    useCommonHandler.download(res, e.fileName);
  });
};

// 分页
const updateTableData = (e) => {
  console.log(e);
};

// 所有表头模糊搜索
const onSearch = (searchVal, tableData) => {
  let handSearchTable = [];
  if (searchVal) {
    tableData.filter((item) => {
      let count = 0;
      for (let k in item) {
        if (item[k]) {
          let nowValue = item[k].toString();
          if (nowValue.includes(searchVal)) {
            count++;
          }
        }
      }
      if (count) {
        handSearchTable.push(item);
      }
    });
    return handSearchTable;
  } else {
    return tableData;
  }
};
</script>

<style lang="less" scoped>
.payPacket {
  height: calc(100vh - 120px);
  padding: 16px;
  background-color: #fff;
  .header {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  .content {
    margin-top: 10px;
  }
  .file-number {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: inline-block;
    background: #386bd7;
    color: #fff;
    text-align: center;
    margin-left: 10px;
    line-height: 16px;
  }
}
.changeTop {
  display: flex;
  justify-content: end;
  line-height: 30px;
  margin-bottom: 10px;
}
:deep(.el-date-range-picker) {
  position: absolute;
  right: 10px;
}
:deep(.el-form-item__content) {
  display: block;
}
</style>
