<!--
  报表工具
-->
<template>
  <div class="reportsTools page_common" v-loading="Data.dataLoading">
    <el-tabs v-model="Data.activeName" class="demo-tabs" @tab-change="tabHandler">
      <el-tab-pane v-for="(item, index) of Data.tabList" :key="index" :label="item.label" :name="item.id">
        <h2>{{ item.label }}报表</h2>
        <div class="filterTitle">
          筛选条件
          <el-icon><RefreshLeft /></el-icon>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div>
      <!-- 筛选条件 -->
      <div class="formBox">
        <FormLayout1 ref="formFilter" :formList="Data.formList" v-model:submitData="Data.submitData" :isInfo="false"></FormLayout1>
        <div class="btn">
          <el-button type="primary" @click="searchHandler">查询</el-button>
        </div>
      </div>
      <div v-if="Data.activeName === 'payPackeyMemberReplace'">
        <!-- 主包所属项目报表 -->
        <div class="mainPagbacket">
          <h2>主包所属项目报表</h2>
          <div class="search">
            <div>
              <el-button @click="setMember" type="primary">批量设置多人</el-button>
              <el-button @click="setSingleMember">批量设置单人</el-button>
            </div>
            <el-input v-model="Data.searchValue" style="width: 224px" placeholder="请输入搜索关键词" clearable>
              <template #suffix>
                <el-icon class="el-input__icon"><Search /></el-icon>
              </template>
            </el-input>
          </div>
          <levelTable
            :columns="reportsColumns.mainPayPackeyMemberReplace"
            :tableData="Data.mainPayPackeyMemberReplaceData"
            :border="false"
            isCheckBox
            @selectHandler="selectHandler"
          >
            <template #pdUserFullName="scope">
              <span>{{ scope.row.pdUserFullName }}({{ scope.row.pdUserName }})</span>
            </template>
          </levelTable>
        </div>
        <!-- 配包所属项目报表 -->
        <div class="mainPagbacket">
          <h2>配包所属项目报表</h2>
          <div class="search">
            <div>
              <el-button type="primary">批量设置多人</el-button>
              <el-button>批量设置单人</el-button>
            </div>
            <el-input v-model="Data.searchValue2" style="width: 224px" placeholder="请输入搜索关键词" clearable>
              <template #suffix>
                <el-icon class="el-input__icon"><Search /></el-icon>
              </template>
            </el-input>
          </div>
          <levelTable
            :columns="reportsColumns.payPackeyMemberReplace"
            :tableData="Data.payPackeyMemberReplaceData"
            :border="false"
            isCheckBox
            @selectHandler="selectHandler"
          ></levelTable>
        </div>
      </div>
      <div v-else>
        <div class="content">
          <h3 style="margin-bottom: 10px">搜索列表</h3>
          <div style="display: flex">
            <div v-if="Data.activeName === 'projectReport'">
              <el-button v-for="(item, index) of Data.btnList" :key="index" :type="item.type ? item.type : ''" @click="clickHanler(item.clickName)">
                {{ item.label }}
              </el-button>
            </div>
            <el-button @click="clickHanler('multiprojectProcess')" v-if="Data.activeName === 'multiprojectProcess'">导出流程详情报表</el-button>
            <el-button @click="clickHanler('setIssueDate')" v-if="Data.activeName === 'projectReport'">批量设置发放日期</el-button>
            <el-button type="primary" @click="clickHanler('save')" v-if="Data.activeName === 'projectReport'">保存</el-button>
          </div>
        </div>
        <!-- 一级表头 -->
        <div v-if="Data.isOneColumn === true">
          <oneLevelTable
            v-if="Data.activeName === 'projectReport'"
            :columns="Data.columns"
            :tableData="Data.tableData"
            :border="false"
            isCheckBox
            @selectHandler="selectHandler"
            :isWebPagination="true"
            :pageSize="10"
            :total="Data.tableData.length"
            :tableHeight="300"
          >
            <template #issueDate="scope">
              <el-date-picker
                v-if="scope.row.type === 'Evaluation'"
                style="width: 100%"
                v-model="scope.row.givenDate"
                type="date"
                placeholder="请选择"
                format="YYYY/MM/DD"
                value-format="YYYY/MM/DD"
                @change="changeInput(scope)"
              ></el-date-picker>
            </template>
          </oneLevelTable>
          <oneLevelTable
            v-else
            :columns="Data.columns"
            :tableData="Data.tableData2"
            :border="false"
            :isCheckBox="Data.activeName === 'multiprojectProcess' ? true : false"
            @selectHandler="selectHandler"
            :isWebPagination="true"
            :pageSize="10"
            :total="Data.tableData.length"
            :tableHeight="300"
          ></oneLevelTable>
        </div>
        <!-- 二级表头 -->
        <div v-else>
          <levelTable :columns="Data.columns" :tableData="Data.tableData2" :border="false" :isArrayCheckBox="false" @selectHandler="selectHandler" :pagination="true"></levelTable>
        </div>
      </div>
    </div>
  </div>
  <batchSetMultiple v-model:isShow="Data.isShowMember"></batchSetMultiple>
  <pisx-dialog v-model:isShow="Data.isShow" :title="'批量设置发放日期'" @submit="submitDate">
    <template #content>
      <el-date-picker style="width: 100%" v-model="Data.issueDate" type="date" placeholder="选择日期" value-format="YYYY/MM/DD" @change="selectDate"></el-date-picker>
    </template>
  </pisx-dialog>
  <selected-dialog
    v-model:isShow="Data.isShowMemberReplace"
    :searchList="Data.userList"
    :isSingle="true"
    :defaultProps="Data.defaultProps"
    :title="'设置单人'"
    @submit="submitSelectSingle"
  ></selected-dialog>
</template>

<script setup>
import FormLayout1 from './components/formLayout.vue';
import { replaceTabList, filterList, reportsColumns } from './data.js';
import levelTable from '../projectInitiation/components/levelTable.vue';
import oneLevelTable from '../projectInitiation/components/oneLevelTable.vue';
import batchSetMultiple from './components/batchSetMultiple.vue';
import { getAllUser } from '@/api/team.js';
import { listDictItem } from '@/api/homePage.js'; // 获取数据字典的类型
import { useCommonHandler } from '@/hooks';
const api = window.$api;
const hostname = location.hostname;

const Data = reactive({
  isShowMember: false,
  isResource: true,
  dataLoading: false, // 加载状态
  isShow: false, //批量设置发放日期
  issueDate: '', //发放日期
  tabList: replaceTabList,
  activeName: replaceTabList[0].id,
  submitData: {},
  formList: [],

  // 各种下拉的值
  projectTypeOptions: [], // 项目类型下拉
  projectLevelOptions: {}, // 项目等级下拉
  projectPhaseOptions: [], // 项目阶段

  btnList: [
    {
      label: '薪酬包报表',
      clickName: 'payPacketTable',
    },
    {
      label: '研发项目进度报表',
      clickName: 'projectProgressTable',
    },
    {
      label: '信息技术项目进度报表',
      clickName: 'informationProjectProgressTable',
    },
    {
      label: '制造技术项目进度报表',
      clickName: 'manufactureProjectProgressTable',
    },
    // {
    //   label: '批量设置发放日期',
    //   clickName: 'setIssueDate',
    // },
    // {
    //   label: '保存',
    //   clickName: 'setIssueDate',
    //   type: 'primary',
    // },
  ],
  tableData: [],
  tableData2: [], // 二级表头数据

  mainPayPackeyMemberReplaceData: [], // 主包表格数据
  payPackeyMemberReplaceData: [], // 配包表格数据
  columns: [],
  searchValue: '', // 主包表格搜索
  searchValue2: '', // 配包表格搜索
  isOneColumn: true, // 是否是一级表头
  isShowMemberReplace: false, // 显示担任成员替换的弹窗
  userList: [], // 用户组
  // 用户列表的属性格式
  defaultProps: {
    key: 'id',
    label: 'pdcRealName',
    depart: 'department',
  },
  projectStatusOptions: [
    {
      label: '未完成',
      value: '未完成',
    },
    {
      label: '已完成',
      value: '已完成',
    },
    {
      label: '空',
      value: '',
    },
  ], // 评价状态下拉
  evaluationList: [], // 设置的发放日期的数组
  batchGivenDate: '', // 发放日期
  paramsObj: {}, // 查询列表的参数
  selectedRowMain: [], // 勾选的数据
  memberList: [], //中台用户成员
  secondaryDepartmenOptions: [], // 二级部门
});

// 监听tab选项卡，切换表头列和 筛选条件
watch(
  () => Data.activeName,
  (e) => {
    if (e) {
      Data.columns = [];
      Data.tableData = [];
      Data.tableData2 = [];
      initData(filterList[e] || []);
      for (var key in Data.submitData) {
        Data.submitData[key] = '';
      }
      Data.columns = reportsColumns[e] || [];
      let levelColumn = ['projectPhaseCheck', 'reviewMeetingMinutesInfo', 'projectWarningQuery'];
      if (levelColumn.includes(e)) {
        Data.isOneColumn = false;
      } else {
        Data.isOneColumn = true;
      }
    }
  },
  {
    deep: true,
  },
);

watch(
  //  监听项目类型，如果只是类型改变，则重置项目等级的值，并匹配赋值相应的项目等级的下拉列表
  () => Data.submitData.projectType,
  (val) => {
    if (val) {
      // 如果是项目整体报表
      if (Data.activeName === 'projectReport') {
        let isSelect = '';
        for (var key in Data.projectLevelOptions) {
          if (val.includes(key)) {
            isSelect = key;
          }
        }
        _changeFormListOptions(Data.formList, 'projectLevel', isSelect === '' ? [] : Data.projectLevelOptions[isSelect]);
        Data.submitData.projectLevel = '';
      } else {
        // 多项目质量报表
        _queryKeyWBSByProjectType(val);
      }
    }
  },
  {
    deep: true,
  },
);

watch(
  //  监听一级部门，并请求二级部门
  () => Data.submitData.primaryDepartment,
  (val) => {
    if (val) {
      _getSecondaryDepartments(val);
    }
  },
  {
    deep: true,
  },
);

onMounted(() => {
  initData(filterList.projectReport); // 获取表单搜索条件
  Data.columns = reportsColumns.projectReport;
  tabHandler(replaceTabList[0].id);
});

/**
 *
 * @param {*} paramsObj
 *
 * 所有筛选条件的获取接口
 */

// 获取项目等级
const _getProjectLevelConfigJson = () => {
  api.reportToolsApi.getProjectLevelConfigJson().then((res) => {
    if (res.success) {
      let options = JSON.parse(res.data);
      for (var key in options) {
        Data.projectLevelOptions[key] = [];
        options[key].forEach((e) => {
          let obj = {
            label: e,
            value: e,
          };
          Data.projectLevelOptions[key].push(obj);
        });
      }
    }
  });
};

// 获取一级部门      查询联动的下拉用完整的oid,   查询表格用中文
const _searchPrimaryDepartment1 = () => {
  api.reportToolsApi.searchPrimaryDepartment1().then((res) => {
    if (res.success) {
      let obj = res.data.map((e) => {
        return {
          label: e.name,
          value: e.oid,
        };
      });
      Data.primaryDepartmentOptions = obj;
      _changeFormListOptions(Data.formList, 'primaryDepartment', obj);
    }
  });
};

// 获取二级部门
const _getSecondaryDepartments = (e) => {
  Data.secondaryDepartmenOptions = [];
  let params = new FormData();
  params.append('oid', e);
  api.reportToolsApi.getSecondaryDepartments(params).then((res) => {
    if (res.success) {
      let arr = res.data.options;
      let obj = [];
      for (var key in arr) {
        obj.push({
          label: arr[key],
          value: arr[key],
        });
        Data.secondaryDepartmenOptions.push({
          label: key,
          value: arr[key],
        });
      }
      _changeFormListOptions(Data.formList, 'secondaryDepartment', obj);
      Data.submitData.secondaryDepartment = '';
    }
  });
};

// 查询项目状态
const _queryStatesByLifeCycleTemplate = (attributeName) => {
  let params = new FormData();
  params.append('lifeCycleTemplateName', 'EvaluationLC');
  api.reportToolsApi.queryStatesByLifeCycleTemplate(params).then((res) => {
    if (res.success) {
      let obj = res.data.map((e) => {
        return {
          label: e.display,
          value: e.innerName,
        };
      });
      obj.unshift({
        label: '全部',
        value: 'ALL',
      });
      // 替换表单下拉的方法，   表单数据，     要替换的属性名， 替换后的下拉数据
      _changeFormListOptions(Data.formList, attributeName, obj);
    }
  });
};

// 获取项目类型下拉   参数：   赋值给表单下拉option的属性名，是否设置label为值
const _getProjectType = (attributeName) => {
  listDictItem({ dictCode: 'projectType' }).then((res) => {
    if (res.success) {
      let arr = JSON.parse(res.data[0].itemValue);
      let obj = [];
      // label 当值
      arr.forEach((e) => {
        obj.push({
          label: e.label,
          value: e.value,
        });
      });
      Data.projectTypeOptions = obj;
      _changeFormListOptions(Data.formList, attributeName, obj);
    } else {
      window.$message.error(res.message);
    }
  });
};

// 获取指标类型
const _getIndicatorTypes = () => {
  api.targetApi.getIndicatorTypes().then((res) => {
    if (res.success) {
      let arr = res.data.map((item) => {
        return { label: item, value: item };
      });
      _changeFormListOptions(Data.formList, 'indicatorType', arr);
    }
  });
};

// 根据项目类型获取项目阶段  参数： 接口传参的值，项目类型
const _queryKeyWBSByProjectType = (obj) => {
  Data.projectPhaseOptions = [];
  let params = new FormData();
  params.append('projectType', _changeOptionsLabel(obj, Data.projectTypeOptions, false));
  api.reportToolsApi.queryKeyWBSByProjectType(params).then((res) => {
    if (res.success) {
      let arr = res.data;
      let objArr = [];
      arr.forEach((e) => {
        objArr.push({
          label: e.display,
          value: e.innerName,
        });
      });
      Data.projectPhaseOptions = objArr;
      _changeFormListOptions(Data.formList, 'projectPhase', Data.projectPhaseOptions);
    }
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
          pdcRealName: e.realname, // 中文名
          wcUser: e.thirdSystemName, // windChill账号
          department: e.departmentName, // 部门  配包成员表格需要
          id: e.id,
          roleIdList: e.roleIdList, // 权限
        };
      });
      Data.memberList = res.data.contents.map((e) => {
        return {
          label: e.realname,
          value: e.username,
        };
      });
      _changeFormListOptions(Data.formList, 'rewardUser', Data.memberList);
    }
  });
};

// 查询项目整体报表数据
const _searchProjectEvaluationReport = (paramsObj) => {
  Data.dataLoading = true;
  let params = new FormData();
  for (var key in paramsObj) {
    if (key === 'projectType') {
      params.append(key, Data.submitData.projectType);
    } else if (key === 'primaryDepartment') {
      let primaryDepartmentStr = '';
      primaryDepartmentStr = _changeOptionsLabel(paramsObj[key], Data.primaryDepartmentOptions, true);
      params.append(key, primaryDepartmentStr.split('WTGroup:')[1] || '');
    } else {
      params.append(key, paramsObj[key] || '');
    }
  }
  api.reportToolsApi.searchProjectEvaluationReport(params).then((res) => {
    if (res.success) {
      let arr = [];
      arr = res.data;
      arr.forEach((e, index) => {
        e['id'] = index;
      });
      Data.tableData = arr;
      Data.dataLoading = false;
    } else {
      Data.dataLoading = false;
      window.$message.error(res.message);
    }
  });
};

// 动态接口查询各个报表的数据
const _getTableData = (interfaceName, paramsObj) => {
  Data.dataLoading = true;
  Data.tableData2 = [];
  let params = new FormData();
  for (var key in paramsObj) {
    params.append(key, paramsObj[key] || '');
  }
  api.reportToolsApi[`${interfaceName}`](params).then((res) => {
    if (res.success) {
      if (interfaceName === 'queryRewardOwnerReplaceInfo') {
        Data.mainPayPackeyMemberReplaceData = res.data.true;
        Data.payPackeyMemberReplaceData = res.data.false;
        Data.dataLoading = false;
      } else {
        Data.tableData2 = res.data;
        Data.dataLoading = false;
      }
    } else {
      window.$message.error(res.message);
      Data.dataLoading = false;
      Data.tableData2 = [];
    }
  });
};

// 设置发放日期    如果已经设置过了，就覆盖，如果没有设置过，就添加进发放日期数组里面
const changeInput = (e) => {
  let evaluationOids = Data.evaluationList.map((e1) => {
    return e1.evaluationOid;
  });
  let obj = {
    evaluationOid: e.row.evaluationOid,
    givenDate: e.row.givenDate,
  };
  if (evaluationOids.includes(e.row.evaluationOid)) {
    Data.evaluationList.forEach((e2) => {
      if (e2.evaluationOid === e.row.evaluationOid) {
        e2.givenDate = e.row.givenDate;
      }
    });
  } else {
    Data.evaluationList.push(obj);
  }
};

// 筛选表单的数据 筛选表单转换成 表单组件可用的格式
const initData = (list) => {
  let data = list;
  data.forEach((v) => {
    v.items.forEach((e) => {
      Data.submitData[e.name] = '';
    });
  });
  Data.formList = window.$formatData(data, Data.submitData);
};

// 替换表单下拉的option数据方法
const _changeFormListOptions = (formList, name, optionList) => {
  if (formList.length > 0) {
    formList[0].list.forEach((e) => {
      e.forEach((e2) => {
        if (e2.options && e2.name == name) {
          e2.options = optionList;
        }
      });
    });
  } else {
    return [];
  }
};

// 下拉框根据特殊属性的值去取对应的label     name: 属性名     value2  被替换的值     options 替换列表
const _changeOptionsLabel = (value2, options, isValue) => {
  let val = '';
  if (options.length > 0) {
    options.forEach((e) => {
      if (e.value == value2 || e.label == value2) {
        if (isValue === true) {
          val = e.value;
        } else {
          val = e.label;
        }
      }
    });
  }
  return val;
};

// 选项卡点击事件
const tabHandler = (e) => {
  Data.activeName = e;
  Data.selectedRowMain = [];
  for (var key in Data.submitData) {
    Data.submitData[key] = '';
  }
  switch (e) {
    case 'projectReport': // 项目整体报表
      Data.submitData.evaluationState = 'ALL';
      _getProjectType('projectType'); // 获取项目类型
      _getAllUser(); // 获取全量用户
      _getProjectLevelConfigJson(); // 获取项目等级
      _searchPrimaryDepartment1(); // 获取一级部门下拉
      _queryStatesByLifeCycleTemplate('evaluationState'); // 获取项目状态列表
      break;
    case 'projectQuality': // 多项目质量
      _getProjectType('projectType'); // 获取项目类型
      _queryStatesByLifeCycleTemplate('projectState'); // 获取项目状态列表
      _searchPrimaryDepartment1();
      break;
    case 'projectIndex': // 项目指标
      _getProjectType('projectType'); // 获取项目类型
      _queryStatesByLifeCycleTemplate('projectState'); // 获取项目状态列表
      _searchPrimaryDepartment1();
      _getIndicatorTypes(); // 获取指标类别
      break;
    case 'payPackeyMemberReplace': // 薪酬包成员替换
      _getProjectType('projectType'); // 获取项目类型
      nextTick(() => {
        _changeFormListOptions(Data.formList, 'rewardUser', Data.memberList);
      });
      break;
    case 'projectMemberAndTotal': // 项目成员参与项目统计
      _getProjectType('projectType'); // 获取项目类型
      _searchPrimaryDepartment1(); // 获取一级部门下拉
      _queryStatesByLifeCycleTemplate('projectState'); // 获取项目状态列表
      break;
    case 'multiprojectProcess': //多项目流程
      _getProjectType('projectType'); // 获取项目类型
      _getEnumeratedSetByName(); // 获取产品类型
      _searchPrimaryDepartment1(); // 获取一级部门下拉
      _queryStatesByLifeCycleTemplate('projectState'); // 获取项目状态列表
      break;
    case 'reportWorkHourTracking': // 汇报工时
      _searchPrimaryDepartment1(); // 获取一级部门下拉
      break;
    case 'projectWarningQuery':
      _getProjectType('projectType'); // 获取项目类型
      _queryStatesByLifeCycleTemplate('projectState'); // 获取项目状态列表
      _searchPrimaryDepartment1(); // 获取一级部门下拉
      _getEnumeratedSetByName(); // 获取产品类型
      break;
  }
};

const formFilter = ref(null);

//查询按钮
const searchHandler = () => {
  console.log(formFilter.value, 635);
  formFilter.value.$refs.ruleForm.validate((e) => {
    if (e) {
      let params = {};
      switch (Data.activeName) {
        case 'projectReport': // 项目整体报表
          params = getTableDataParams('projectReport');
          _searchProjectEvaluationReport(params); // 项目整体报表
          break;
        case 'projectQuality': // 多项目质量
          params = getTableDataParams('projectQuality');
          _getTableData('queryMultiProjectQualityReport', params);
          break;
        case 'projectIndex': //项目指标
          params = getTableDataParams('projectIndex');
          _getTableData('queryTargetIndicators', params);
          break;
        case 'projectMemberAndTotal': // 项目成员参与项目统计报表
          params = getTableDataParams('projectMemberAndTotal');
          _getTableData('queryProjectMemberParticipationReport', params);
          break;
        case 'reportWorkHourTracking': // 汇报工时报表
          params = getTableDataParams('reportWorkHourTracking'); // 传case里面的东西
          _getTableData('queryReportingHourTrackingReport', params);
          break;
        case 'multiprojectProcess': // 多项目流程
          params = getTableDataParams('multiprojectProcess');
          _getTableData('queryMultiProjectWrokflowReport', params);
          break;
        case 'payPackeyMemberReplace': // 薪酬包成员替换
          params = getTableDataParams('payPackeyMemberReplace');
          _getTableData('queryRewardOwnerReplaceInfo', params);
          break;
        case 'projectWarningQuery':
          params = getTableDataParams('projectWarningQuery');
          _getTableData('queryProjectWarnData', params);
          break;
      }
    }
  });
};

// 获取信息技术类项目进度报表
const _exportITProject = (paramsStr) => {
  sessionStorage.removeItem('downloadName');
  let params = {
    oids: paramsStr,
  };
  api.reportToolsApi.exportITProject(params).then((res) => {
    let str = decodeURIComponent(sessionStorage.getItem('downloadName'));
    useCommonHandler.download(res, str.split('=')[1]);
    Data.selectedRowMain = [];
  });
};

// 技术开发类项目进度报表
const _exportTecProject = (paramsStr) => {
  sessionStorage.removeItem('downloadName');
  let params = {
    oids: paramsStr,
  };
  api.reportToolsApi.exportTecProject(params).then((res) => {
    let str = decodeURIComponent(sessionStorage.getItem('downloadName'));
    useCommonHandler.download(res, str.split('=')[1]);
    Data.selectedRowMain = [];
  });
};

// 产品开发类项目进度报表
const _exportDevProject = (paramsStr) => {
  sessionStorage.removeItem('downloadName');
  let params = {
    oids: paramsStr,
  };
  api.reportToolsApi.exportDevProject(params).then((res) => {
    let str = decodeURIComponent(sessionStorage.getItem('downloadName'));
    useCommonHandler.download(res, str.split('=')[1]);
    Data.selectedRowMain = [];
  });
};

// 薪酬包导出
const _exportProjectRewardsReport = (paramsStr) => {
  sessionStorage.removeItem('downloadName');
  let params = {
    oids: paramsStr,
  };
  api.reportToolsApi.exportProjectRewardsReport(params).then((res) => {
    let str = decodeURIComponent(sessionStorage.getItem('downloadName'));
    useCommonHandler.download(res, str.split('=')[1]);
    Data.selectedRowMain = [];
  });
};

// 导出流程详情报表
const _exportProcessDetail = (paramsStr) => {
  sessionStorage.removeItem('downloadName');
  let params = {
    formData: JSON.stringify(paramsStr),
  };
  api.reportToolsApi.exportProcessDetail(params).then((res) => {
    let str = decodeURIComponent(sessionStorage.getItem('downloadName'));
    useCommonHandler.download(res, str.split('=')[1]);
    Data.selectedRowMain = [];
  });
};

// 获取全局枚举
const _getEnumeratedSetByName = () => {
  api.commonApi.getEnumeratedSetByName({ enumName: hostname === '192.168.3.230' ? 'productCategory' : 'ProductCategory' }).then((res) => {
    if (res.success) {
      let arr = res.data.map((item) => {
        return { label: item.display, value: item.innerName };
      });
      _changeFormListOptions(Data.formList, 'productCategory', arr);
    } else {
      window.$message.error(res.message);
    }
  });
};
/*
  操作功能性方法

  数据格式转换类方法


*/

// 提交选择单选
const submitSelectSingle = (list) => {
  // console.log(list, 772);
  if (list.length === 0) return window.$message.warning('请选择一条数据');
  let params = new FormData();
  params.append('primary', true);
  params.append('wcUserName', list[0].wcUser);
  params.append('pdUserName', list[0].pdcUser);
  params.append('pdUserFullName', list[0].pdcRealName);
  api.reportToolsApi.batchSetSingleUser(params).then((res) => {
    if (res.success) {
      console.log(res.data);
    }
  });
};

// 按钮功能
const clickHanler = (type) => {
  let params = new FormData();
  let oids = [];
  let projectOids = [];
  if (Data.selectedRowMain.length > 0) {
    oids = Data.selectedRowMain.map((e2) => {
      return e2.type;
    });
  }
  switch (type) {
    // 批量设置发放日期
    case 'setIssueDate':
      Data.issueDate = '';
      if (oids.length === 0) return window.$message.warning('请选择数据！');
      if (oids.includes('Project')) return window.$message.warning('只能选择项目评价类型的数据，请去掉多余的勾选！');
      Data.isShow = true;
      break;
    // 保存
    case 'save':
      if (Data.evaluationList.length === 0) return window.$message.warning('请先设置发放日期！');
      params.append('formdata', JSON.stringify(Data.evaluationList));
      api.reportToolsApi.batchSaveGivenDate(params).then((res) => {
        if (res.success) {
          window.$message.success('保存成功！');
          Data.evaluationList = [];
          Data.batchGivenDate = '';
          Data.selectedRowMain = [];
        }
      });
      break;
    case 'payPacketTable':
      if (Data.selectedRowMain.length === 0) return window.$message.warning('请先勾选数据');
      Data.selectedRowMain.forEach((e) => {
        projectOids.push(e.projectOid);
      });
      _exportProjectRewardsReport(projectOids.join());
      break;
    case 'projectProgressTable':
      if (Data.selectedRowMain.length === 0) return window.$message.warning('请先勾选数据');
      Data.selectedRowMain.forEach((e) => {
        projectOids.push(e.projectOid);
      });
      _exportDevProject(projectOids.join());
      break;
    // 信息技术项目进度报表
    case 'informationProjectProgressTable':
      if (Data.selectedRowMain.length === 0) return window.$message.warning('请先勾选数据');
      Data.selectedRowMain.forEach((e) => {
        projectOids.push(e.projectOid);
      });
      _exportITProject(projectOids.join());
      break;
    case 'manufactureProjectProgressTable':
      if (Data.selectedRowMain.length === 0) return window.$message.warning('请先勾选数据');
      Data.selectedRowMain.forEach((e) => {
        projectOids.push(e.projectOid);
      });
      _exportTecProject(projectOids.join());
      break;
    case 'multiprojectProcess':
      if (Data.tableData2.length === 0) return window.$message.warning('请先查询报表数据，再勾选要导出的数据');
      Data.selectedRowMain.forEach((e) => {
        projectOids.push({ projectOid: e.projectOid, processOid: e.processOid });
      });
      _exportProcessDetail(projectOids);
      break;
  }
};

// 批量发放日期
const selectDate = (e) => {
  Data.batchGivenDate = e;
};

//批量发放日期弹窗确认按钮
const submitDate = () => {
  let selectRows = Data.selectedRowMain.map((e) => {
    return {
      evaluationOid: e.evaluationOid,
      givenDate: Data.batchGivenDate,
    };
  });
  if (Data.evaluationList.length > 0) {
    selectRows.forEach((e) => {
      Data.evaluationList.forEach((e2) => {
        if (e.evaluationOid === e2.evaluationOid) {
          e2.givenDate = e.givenDate;
        } else {
          Data.evaluationList.push(e);
        }
      });
    });
  } else {
    Data.evaluationList = selectRows;
  }
  // 表格赋值
  Data.tableData.forEach((e) => {
    selectRows.forEach((e2) => {
      if (e.evaluationOid === e2.evaluationOid) {
        e.givenDate = Data.batchGivenDate;
      }
    });
  });
  Data.isShow = false;
};

// 勾选的数据
const selectHandler = (row) => {
  Data.selectedRowMain = row;
};

// 批量设置单人
const setSingleMember = () => {
  Data.isShowMemberReplace = true;
};

//批量设置多人
const setMember = () => {
  Data.isShowMember = true;
};

// 传入报表类型 来获取表格数据的传参
const getTableDataParams = (type) => {
  let obj = {};
  filterList[type][0].items.forEach((e) => {
    if (e.filedType === 'DATERANGE') {
      // 这个日期字段是个特殊字段， 是汇报工时里面的汇报时间，其他的都是from和to
      if (e.name === 'submit') {
        obj[`${e.name}StartDate`] = Data.submitData[`${e.name}`][0];
        obj[`${e.name}EndDate`] = Data.submitData[`${e.name}`][1];
      } else if (Data.submitData[`${e.name}`] && Data.submitData[`${e.name}`].length > 0) {
        obj[`${e.name}From`] = Data.submitData[`${e.name}`][0];
        obj[`${e.name}To`] = Data.submitData[`${e.name}`][1];
      } else {
        obj[`${e.name}From`] = '';
        obj[`${e.name}To`] = '';
      }
    } else {
      if (e.name === 'primaryDepartment') {
        let str = Data.submitData[`${e.name}`];
        obj[e.name] = str.split('WTGroup:')[1];
      } else {
        obj[e.name] = Data.submitData[`${e.name}`];
      }
    }
  });
  return obj;
};
</script>

<style lang="less" scoped>
.reportsTools {
  // height: calc(100vh - 115px);
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  :deep(.el-table tr td:first-child) {
    background-color: #fff !important;
  }
  :deep(.el-table tr td:first-child:hover) {
    background-color: #f5f7fa !important;
  }
  .filterTitle {
    margin: 5px 0 0;
    line-height: 25px;
    font-weight: bold;
  }
  .formBox {
    //表单盒子
    flex: 1;
    :deep(.el-form-item) {
      margin-bottom: 15px;
    }
  }

  .mainPagbacket {
    margin-top: 50px;
    margin-bottom: 20px;
    h2 {
      margin: 10px 0;
    }
    .search {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }

  .content {
    margin: 30px 0 10px;
  }
  .btn {
    margin-top: 10px;
    float: right;
  }
}
:deep(.el-tabs__header) {
  margin: 0 0 5px;
}
// :deep(.el-table) {
//   min-height: 300px;
//   max-height: 500px;
//   overflow: scroll;
// }
</style>
