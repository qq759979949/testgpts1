<!-- 项目立项流程页面，查完成查看详情页面 -->
<template>
  <div class="detail_initiation" v-loading="Data.processLoading">
    <anthor class="anthor_css" :offset="100" :tabList="Data.tabList" :actived="Data.actived">
      <template #title>
        <div class="header_title">
          <div>
            <h3>【{{ route.query.workItemName }}】{{ route.query.projectShortName }} - {{ route.query.projectName }} - {{ route.query.processName }}</h3>
          </div>
          <div v-if="!Data.isDetail">
            <process-radio
              :isRatify="route.query.workItemName === '批准' ? true : false"
              :projectOid="Data.oid"
              @processSubmit="processSubmit"
              @callback="callback"
              :oid="Data.workitemOID"
              @goBack="goback"
              :processOID="Data.processOID"
              :resolute="Data.resolution"
            ></process-radio>
          </div>
        </div>
      </template>
    </anthor>
    <div class="info_box">
      <!-- <el-button type="primary" @click="allHide">一键收起</el-button> -->
      <div v-for="(item, index) of Data.tabList" :key="index" class="depart" :id="item.id">
        <div class="depart_title">
          <div>
            <i class="iconfont ExpendIcon icon-yihangyige1" @click="item.isExpand = !item.isExpand" v-if="item.isExpand"></i>
            <i class="iconfont ExpendIcon icon-yihangyige" @click="item.isExpand = !item.isExpand" v-if="!item.isExpand"></i>
            <span style="font-weight: bold; margin-left: 5px">{{ item.label }}</span>
          </div>
          <div v-if="route.query.workItemName === '重新提交'">
            <el-button type="primary" v-if="item.isShowEditBtn && item.label === '薪酬包'" @click="gotoEdit(item.id)">跳转薪酬包</el-button>
            <el-button type="primary" v-else-if="item.label !== '流程设置'" @click="gotoEdit(item.id)">跳转编辑</el-button>
          </div>
        </div>
        <div class="depart_content" v-if="item.isExpand">
          <div class="section-container" v-if="item.label === '详细信息'">
            <FormDetail ref="formInfo" labelWidth="200px" :formList="Data.infoDatas" v-model:submitData="Data.baseInfoData"></FormDetail>
            <!-- <objectInfo v-for="(item2, index) in Data.infoDatas" :key="index" :detailLayout="item2.items" :column="3" :infoTitle="item2.groupName"></objectInfo> -->
          </div>
          <div class="section-container" v-if="item.label === '团队'">
            <projectTeam :isActionVisible="false" :isShowSearch="true" :isComponents="true"></projectTeam>
          </div>
          <div class="section-container" v-if="item.label === '里程碑计划'" style="margin-top: 10px">
            <steps :stepList="Data.stepList" :active="Data.active"></steps>
          </div>
          <div class="section-container" v-if="item.label === '目标/指标'" style="margin-top: 10px">
            <div class="depart" :id="item.name" v-for="(item, index) in Data.beforeProjectEstablishment" :key="index">
              <div class="title_box">
                <span class="hand_icon" @click="item.switchover = !item.switchover">{{ item.switchover ? '-' : '+' }}</span>
                <span class="title">{{ item.label }}</span>
              </div>
              <div class="content" v-if="item.switchover">
                <newPiTable :columns="item.colunms" :data="item.tableData" :isShowSetting="false" rowKey="index" :pagination="false" :tableLoad="item.tableLoad"></newPiTable>
              </div>
            </div>
          </div>
          <div class="section-container" v-if="item.label === '薪酬包'" style="margin-top: 10px">
            <div class="section-title2">主包成员表格</div>
            <levelTable :columns="Data.mainMemberColumn" :tableData="Data.mainMemberTableData">
              <!-- 成员角色 -->
              <template #userName="scope">
                <p v-if="scope.row.userName" style="text-align: left">{{ scope.row.userName }}</p>
                <p v-if="scope.row.userName" style="text-align: left">{{ scope.row.userRole ? scope.row.userRole : '' }}</p>
              </template>
            </levelTable>
            <div class="section-title2" v-if="Data.projectType === '产品开发类项目'">配包各部门权重与金额</div>
            <levelTable :columns="Data.packageDepartWeightColumn" :tableData="Data.packageDepartWeightTableData" v-if="Data.projectType === '产品开发类项目'"></levelTable>
            <div class="section-title2" v-if="Data.projectType === '产品开发类项目'">配包成员表格</div>
            <levelTable :columns="Data.packageMemberColumn" :tableData="Data.packageMemberTableData" v-if="Data.projectType === '产品开发类项目'">
              <template v-for="(item, index) of Data.templateList2" :key="index" #[item]="scope">
                <span v-if="scope.row[`${item}`] === -1">-</span>
                <span v-else>{{ scope.row[item] }}</span>
              </template>
            </levelTable>
          </div>
          <!-- <div class="section-container" v-if="item.label === '配包各部门权重与金额'" style="margin-top: 10px">
            <levelTable :columns="Data.packageDepartWeightColumn" :tableData="Data.packageDepartWeightTableData"></levelTable>
          </div>
          <div class="section-container" v-if="item.label === '配包成员表格'" style="margin-top: 10px">
            <levelTable :columns="Data.packageMemberColumn" :tableData="Data.packageMemberTableData"></levelTable>
          </div> -->
          <div class="section-container" v-if="item.label === '产品规划评审'" style="margin-top: 10px">
            <FormList style="width: 70%" ref="form" :formList="Data.formList2.ProductPlanReview" v-model:submitData="Data.submitData.ProductPlanReview" :isInfo="false"></FormList>
          </div>
          <div class="section-container" v-if="item.label === '国际营销评审'" style="margin-top: 10px">
            <FormList
              style="width: 70%"
              ref="form"
              :formList="Data.formList2.InternationalMarketingReview"
              v-model:submitData="Data.submitData.InternationalMarketingReview"
              :isInfo="false"
            ></FormList>
          </div>
          <div class="section-container" v-if="item.label === '营销评审'" style="margin-top: 10px">
            <FormList style="width: 70%" ref="form" :formList="Data.formList2.MarketingReview" v-model:submitData="Data.submitData.MarketingReview" :isInfo="false"></FormList>
          </div>
          <div class="section-container" v-if="item.label === '战略评审'" style="margin-top: 10px">
            <FormList style="width: 70%" ref="form" :formList="Data.formList2.StrategicReview" v-model:submitData="Data.submitData.StrategicReview" :isInfo="false"></FormList>
          </div>
          <div class="section-container" v-if="item.label === '质量成本评审'" style="margin-top: 10px">
            <el-button type="primary" @click="openFinanceInfo">财务信息</el-button>
            <FormList style="width: 70%" ref="form" :formList="Data.formList2.QualityCostReview" v-model:submitData="Data.submitData.QualityCostReview" :isInfo="false"></FormList>
          </div>
          <div class="section-container" v-if="item.label === '财务评审'" style="margin-top: 10px">
            <el-button type="primary" @click="openFinanceInfo">财务信息</el-button>
            <FormList style="width: 70%" ref="form" :formList="Data.formList2.FinancialReview" v-model:submitData="Data.submitData.FinancialReview" :isInfo="false"></FormList>
          </div>
          <div class="section-container" v-if="item.label === '流程处理'" style="margin-top: 10px">
            <ProcessRecord :oid="Data.workitemOID"></ProcessRecord>
          </div>
          <div class="section-container" v-if="item.label === '流程设置'" style="margin-top: 10px">
            <SelectUser ref="selectUser" :workitemOid="Data.workitemOID" :parmasObj="Data.parmasObj" v-model:selectUserData="Data.selectUserData"></SelectUser>
            <!-- <SelectUser ref="selectUser" :parmasObj="Data.parmasObj" v-model:selectUserData="Data.selectUserData"></SelectUser> -->
          </div>
        </div>
      </div>
      <!-- 底部提交 -->
      <div class="footer" v-if="!Data.isDetail">
        <!-- <ProcessSubmit :oid="workitemOID" :processOID="Data.processOID" :radioList="[]" @processSubmit="processSubmit"></ProcessSubmit> -->
        <process-advice @processResolution="processResolution"></process-advice>
      </div>
    </div>
    <financeDesk :size="'40%'" v-model:isShow="Data.isShowFinance" :title="'财务信息'" :info="Data.info" @downLoad="downLoad"></financeDesk>
  </div>
</template>

<script setup name="detail_initiation">
import financeDesk from './components/financeDesk.vue';
import { columnList, targetColumn } from './data.js';
import { getProjectInfoLayout, getProjectMileStonePlan } from '@/api/project';
import FormList from './formLayout/index.vue';
import projectTeam from '@/views/projectTeam/index.vue';
import {
  productColunms, //立项前 技术指标
  qualityColums, // 质量指标
  costColums, //成本指标
  marketColums, //市场指标
  materialIndicatorColums, //物料指标
  patentColums, // 专利
  economicsColums, //立项前-制造技术类项目和信息技术类项目-经济效益
  otherQualityColums, // 立项前-制造技术类项目和信息技术类项目-质量指标
  maunInfomCostColums, // 立项前-制造技术类项目和信息技术类项目-成本指标
  otherColums, // 立项前-制造技术类项目和信息技术类项目-其他指标
} from '../target/tableColunms.js';
import levelTable from './components/levelTable.vue';
import { ElMessage } from 'element-plus';
import { useCommonHandler } from '@/hooks';
import Cookies from 'js-cookie';

const api = window.$api;
const route = useRoute();
const router = useRouter();
const userInfo = JSON.parse(Cookies.get('userInfo'));
const form = ref(null);
const Data = reactive({
  processLoading: false, // 项目立项的loadding
  tabList: JSON.parse(JSON.stringify(columnList.tabList)),
  selectUserData: [], //流程选择人的数据
  parmasObj: {
    processTemplate: 'PIProjectStartWf',
    oid: '',
  }, // 获取流程选人的传参
  actived: 'baseInfo',
  infoDatas: [],
  loading: false,
  formList: [],

  baseInfoData: {},

  formList2: {}, // 表单绑定
  submitData: {}, // 表单数据

  targetColumn: targetColumn, // 目标/指标 表头
  targetTableData: [], // 目标/指标 表格数据

  processName: '', // 流程名称
  processOID: '', // 转办的oid
  workitemOID: '', // 流程的oid
  oid: '', // 项目oid

  mainMemberColumn: [], // 主包成员表头
  packageMemberColumn: [], // 配包成员表头
  packageDepartWeightColumn: [],

  mainMemberTableData: [], // 主包成员表格
  packageMemberTableData: [], // 配包成员表格
  packageDepartWeightTableData: [],

  isShowFinance: false, // 财务信息弹窗
  info: [], // 财务审核信息
  reviewList: [], // 审核角色集合，看用户在哪个审核角色里面

  isDetail: true,
  radioArr: [],

  // 目标指标
  projectType: '',
  beforeProjectEstablishment: [],
  templateList2: [],

  // 项目计划
  stepList: [],
  active: 3,

  resolution: '', //意见
});

const workitemOID = ref(route.query.workitemOID);
onMounted(() => {
  Data.oid = route.query.oid;
  Data.parmasObj.oid = route.query.oid;
  Data.workitemOID = route.query.workitemOID;
  Data.processOID = route.query.processOID;
  Data.processName = route.query.processName;
  Data.projectType = route.query.projectType;
  if (route.query.isDetail && route.query.isDetail === 'true') {
    Data.isDetail = true;
  } else {
    Data.isDetail = false;
  }
  getInfoData(); // 详细信息
  getType(); // 获取目标指标
  _getPhaseNames(); //获取阶段
  _queryMemberInfoBuilderData(1); // 主包成员表格
  initFun(); // 项目计划

  if (Data.projectType === '产品开发类项目') {
    _getSecondPackageWeightAndAmount(); //配包各部门权重与金额
    _queryMemberInfoBuilderData(2); // 配包成员表格
  }

  if (route.query.workItemName === '评审' || route.query.workItemName === '财务审核') {
    _belongToCostReview(route.query.workItemName); // 获取评审类型
  } else {
    Data.tabList.push({
      label: '流程处理',
      id: 'processOperate',
      isExpand: true,
      isShowEditBtn: false,
    });
  }
  if (route.query.workItemName === '重新提交') {
    Data.tabList.push({
      label: '流程设置',
      id: 'processSet',
      isExpand: true,
      isShowEditBtn: false,
    });
  }
});

//一键收起
const allHide = () => {
  Data.tabList.forEach((e) => {
    e.isExpand = false;
  });
};

const selectUser = ref(null);

// 提交审核
const processSubmit = (operation, submit, resolution) => {
  let confirmboole = false;
  if (route.query.workItemName === '评审') {
    if (operation === '通过') {
      if (form.value && form.value.length > 0) {
        form.value.forEach((val) => {
          if (val.validate) {
            val.validate(() => {});
          }
        });
      }
    }
    for (let item in Data.submitData) {
      let e = Data.submitData[item];
      for (let key in e) {
        if (key === 'fileInfo') {
          if (e[key].length === 0) confirmboole = true;
        } else if (key !== 'targetInfo' && key !== 'salesVolume' && key !== 'bottomLine' && e[key] === '') {
          confirmboole = true;
        }
      }
    }
    if (confirmboole === true && operation === '通过') {
      let msg = '';
      for (let i in Data.formList2) {
        if (Data.formList2[i].length > 0) {
          Data.formList2[i].forEach((e2) => {
            msg += `${e2.groupName}<br />`;
            if (e2.items && e2.items.length > 0) {
              e2.items.forEach((e3) => {
                if (Data.submitData[e2.id][e3.name] === '' || Data.submitData[e2.id][e3.name].length === 0) {
                  msg += `${e3.label} 未填写，请尽快填写<br />`;
                }
              });
            }
          });
        }
      }
      ElMessage({
        message: h('p', { style: 'line-height: 1.5; font-size: 18px' }, [h('div', { innerHTML: msg, style: 'font-size: 18px; color: #e6a23c' })]),
        type: 'warning',
      });
    } else {
      if (confirmboole === true && operation === '驳回' && resolution === '') return window.$message.warning('驳回必须填处理意见');
      console.log('必填属性全部填写完毕');
      let formList = []; // 表单数据
      let fileList = []; // 上传的文件集合
      for (let item in Data.submitData) {
        let e = Data.submitData[item];
        let obj = {};
        for (let key in e) {
          if (key !== 'fileInfo' && key !== 'title') {
            obj[key] = e[key];
          }
        }
        obj.roleName = e.title;
        // obj.fileName = e.title + '_' + e.fileInfo[0].name;
        // console.log(e.fileInfo, 205);
        // fileList.push(e.fileInfo[0].raw);
        let fileNameStr = [];
        e.fileInfo.forEach((e2) => {
          fileList.push(e2.raw);
          // fileNameStr.push(e.title + '_' + e2.name);
          fileNameStr.push(e2.uid);
        });
        obj.fileName = fileNameStr.join(',');
        formList.push(obj);
      }
      let params = new FormData();
      let objs = {
        oid: Data.workitemOID,
        route: operation,
        comment: Data.resolution,
        actualCompleteUser: userInfo.username,
        userName: userInfo.thirdPartUser,
        financialParams: formList,
      };
      params.append('taskFormData', JSON.stringify(objs));
      fileList.forEach((e) => {
        // params.append('fileInfo', e);
        params.append(e.uid, e);
      });
      Data.processLoading = true;
      completeReviewTask(params);
    }
  } else if (route.query.workItemName === '财务审核') {
    if (operation === '通过') {
      form.value[0].validate(() => {});
    }
    let formList = {};
    for (let item in Data.submitData) {
      let e = Data.submitData[item];
      for (var key in e) {
        if (e[key] === '') {
          confirmboole = true;
        } else if (key !== 'title') {
          formList[key] = e[key];
        }
      }
    }
    if (confirmboole === true && operation === '通过') {
      window.$message.warning('请填写表单');
    } else {
      let params = {
        custActVar: JSON.stringify(formList),
      };
      submit(params);
    }
  } else if (route.query.workItemName === '重新提交') {
    if (operation === '提交') {
      selectUser.value[0].validate(async (valid, fields) => {
        if (valid) {
          Data.processLoading = true;
          let parmas = {
            processUsers: JSON.stringify(Data.selectUserData),
          };
          submit(parmas);
        } else {
          selectUser.value[0].checkForm(valid, fields);
        }
      });
    } else {
      submit();
    }
  } else {
    submit();
  }
};

//提交接口成功的回调函数
const callback = (e) => {
  Data.processLoading = false;
};

// 评审节点的提交方法
const completeReviewTask = (params) => {
  api.projectInitiationApi.completeReviewTask(params).then((res) => {
    if (res.success) {
      window.$message.success('流程操作成功！');
      goback();
    } else {
      window.$message.error(res.message);
    }
  });
};

/** 跳转路由 */
const goback = () => {
  router.push({ name: 'toDoPage' });
  window.$navTagStore.removeTag(route, router);
  window.$navTagStore.removeCacheTag(route.name);
};

// 获取该审核人是否属于评审角色
const _belongToCostReview = (type) => {
  let params = new FormData();
  params.append('oid', Data.workitemOID);
  api.projectInitiationApi.belongToCostReview(params).then((res) => {
    if (res.success) {
      let arr = res.data;
      let list = [];
      for (var key in arr) {
        if (['产品规划评审', '国际营销评审', '营销评审', '战略评审', '质量成本评审'].includes(arr[key])) {
          list.push({
            label: res.data[key],
            id: key,
            isExpand: true,
            isShowEditBtn: true,
          });
        }
      }
      if (type === '评审') {
        Data.tabList.push(...list); // 选项卡
        Data.reviewList = list; // 拥有的评审数组
      }
      // let reviewList = list;
      // reviewList.forEach((e) => {
      //   Data.reviewList.push(e); // 用户拥有哪些评审角色
      // });
      if (type === '财务审核') {
        Data.tabList.push({
          label: '财务评审',
          id: 'FinancialReview',
          isExpand: true,
          isShowEditBtn: false,
        });
      }
      Data.tabList.push({
        label: '流程处理',
        id: 'processOperate',
        isExpand: true,
        isShowEditBtn: false,
      });
      let paramsList = route.query.workItemName === '财务审核' ? [{ label: '财务审核', id: 'FinancialReview' }] : Data.reviewList;
      _getCreateFinancialLayout(paramsList);
    } else {
      window.$message.error(res.message);
    }
  });
};

// 打开财务信息
const openFinanceInfo = () => {
  _getFinancialInfo([]);
  Data.isShowFinance = true;
};

// 获取财务信息
const _getFinancialInfo = () => {
  let params = new FormData();
  params.append('workItemOid', Data.workitemOID);
  params.append('role', JSON.stringify([]));
  api.projectInitiationApi.getFinancialInfo(params).then((res) => {
    if (res.success) {
      let arr = res.data; // 相关评审的布局
      let newArr = [];
      // console.log(list, 'list', arr, 'arr');
      for (var key in arr) {
        newArr.push({
          groupName: key,
          items: arr[key],
        });
      }
      Data.info = newArr; // 查看财务信息的抽屉
    } else {
      window.$message.error(res.message);
    }
  });
};

// 获取项目立项流程中评审节点财务信息布局
const _getCreateFinancialLayout = (list) => {
  let reviewList = list.map((e) => {
    return e.label;
  });
  let params = new FormData();
  params.append('workItemOid', Data.workitemOID);
  params.append('role', JSON.stringify({ roleName: reviewList }));
  api.projectInitiationApi.getCreateFinancialLayout(params).then((res) => {
    if (res.success) {
      let arr = res.data; // 相关评审的布局
      let newArr = [];
      for (var key in arr) {
        let ss = list.filter((e) => {
          return key === e.label;
        });
        newArr.push({
          groupName: key,
          id: ss[0].id,
          items: arr[key],
        });
      }
      newArr.forEach((v) => {
        let arr = {};
        v.items.forEach((e, index2) => {
          arr[e.name] = '';
          arr['title'] = v.groupName;
          e.row = index2;
          if (e.name === 'fileInfo') {
            // e.value = [];
            e.filedType = 'UPLOAD';
          }
        });
        Data.submitData[v.id] = arr; // 表单绑定的数据    0 "产品规划评审"  1"国际营销评审"  2"营销评审"  3"战略评审"  4"质量成本评审"
        Data.formList2[`${v.id}`] = window.$formatData([v], Data.submitData[v.id]);
        // Data.formList2[`formData${index}`] = window.$formatData([v], Data.submitData[index]);
      });
      // console.log(Data.submitData, Data.formList2, 1111111111);
    } else {
      window.$message.error(res.message);
    }
  });
};

// 获取配包各部门权重与金额
const _getSecondPackageWeightAndAmount = () => {
  api.payPacketApi.getSecondPackageWeightAndAmount({ oid: Data.oid }).then((res) => {
    if (res.success) {
      Data.packageDepartWeightTableData = tableDataChange(res.data);
    }
  });
};

// 获取主包、配包表格数据
const _queryMemberInfoBuilderData = (type) => {
  api.projectInitiationApi.queryProjectStartMemberInfoBuilderData({ oid: Data.oid, primary: type }).then((res) => {
    if (res.success) {
      if (type === 1) {
        Data.mainMemberTableData = tableDataChange(res.data); // 主包成员表格
      } else if (type === 2) {
        Data.packageMemberTableData = tableDataChange(res.data); // 配包成员表格
      }
    }
  });
};

// 获取意见
const processResolution = (value) => {
  Data.resolution = value;
};

// 主包配包表格数据格式修改
const tableDataChange = (data) => {
  let arr = [];
  if (data.length > 0) {
    data.forEach((e) => {
      let item = {};
      for (var key in e) {
        if (e[key].value || e[key].value === 0) {
          item[key] = e[key].value;
        } else {
          item[key] = e[key];
        }
      }
      arr.push(item);
    });
    return arr;
  } else {
    return [];
  }
};

// 获取详细信息
const getInfoData = () => {
  Data.loading = true;
  let obj = {
    serviceKey: 'com.pisx.pmgt.project.PIProject',
    oid: Data.oid,
  };
  getProjectInfoLayout(obj).then((res) => {
    if (res.success) {
      Data.loading = false;
      let datas = res.data.map((item) => {
        item.items = item.items.map((i) => {
          i.label = i.label + '：';
          i.value = i.displayValue;
          i.filedType = 'DISPLAY';
          i.required = false;
          if (i.name === 'ObjectivesAndDeliverables') {
            i.displayValue = i.displayValue.map((it, index) => {
              it.number = index + 1;
              return it;
            });
          }
          return i;
        });
        return item;
      });
      Data.infoDatas = window.$formatData(datas, Data.baseInfoData);
      Data.infoDatas.forEach((item) => {
        item.list = item.list.map((el) => {
          el.maxSpan = el.length;
          return el;
        });
      });
    } else {
      Data.formList = [];
      window.$message.error(res.message);
    }
  });
};

// 查询阶段名称   配置表头
const _getPhaseNames = () => {
  api.payPacketApi.getPhaseNames({ oid: Data.oid }).then((res) => {
    if (res.success) {
      let columnList = {
        // 主包成员表格
        mainMemberColumn: [
          {
            label: '',
            dataIndex: '',
            children: [
              {
                label: '成员 (角色)',
                dataIndex: 'userName',
                width: 140,
              },
            ],
          },
          {
            label: '',
            dataIndex: '',
            children: [
              {
                label: '账号',
                dataIndex: 'centerUser',
                width: 120,
              },
              {
                label: '分工',
                dataIndex: 'memberLabor',
                width: 120,
              },
              {
                label: '部门',
                dataIndex: 'pdDepartment',
                width: 120,
              },
              {
                label: '成员属性',
                dataIndex: 'memberProp',
                width: 120,
              },
            ],
          },
        ],
        // 配包各部门权重与金额 表头
        packageDepartWeightColumn: [
          {
            label: '',
            dataIndex: '',
            children: [
              {
                label: '部门',
                dataIndex: 'department',
                width: 140,
              },
            ],
          },
        ],
        // 配包成员表格
        packageMemberColumn: [
          {
            label: '',
            dataIndex: '',
            children: [
              {
                label: '成员',
                dataIndex: 'userName',
                width: 80,
              },
              {
                label: '部门',
                dataIndex: 'pdDepartment',
                width: 160,
              },
            ],
          },
        ],
      };
      res.data.forEach((e, index) => {
        Data.templateList2.push(`${e.label}Percent`); // 每个阶段的权重
        // 主包成员 表头
        columnList.mainMemberColumn.push({
          label: e.name,
          dataIndex: e.label,
          children: [
            {
              label: '权重 (%)',
              dataIndex: `phase${index + 1}Percent`,
            },
            // {
            //   label: '个人打分',
            //   dataIndex: `phase${index + 1}Score`,
            // },
            // {
            //   label: '个人加权得分',
            //   dataIndex: `phase${index + 1}WeightedScore`,
            //   width: 110,
            // },
            // {
            //   label: '个人薪酬 (元)',
            //   dataIndex: `phase${index + 1}Reward`,
            //   sortable: true,
            //   width: 140,
            // },
          ],
        });
        // 配包各部门权重与金额 表头
        columnList.packageDepartWeightColumn.push({
          label: e.name,
          dataIndex: e.label,
          children: [
            {
              label: '阶段占比 (%)',
              dataIndex: `phase${index + 1}Percent`,
            },
            // {
            //   label: '配包金额 (元)',
            //   dataIndex: `phase${index + 1}Reward`,
            // },
          ],
        });
        // 配包成员  表头
        columnList.packageMemberColumn.push({
          label: e.name,
          dataIndex: e.label,
          children: [
            {
              label: '权重 (%)',
              dataIndex: `phase${index + 1}Percent`,
            },
            // {
            //   label: '个人打分',
            //   dataIndex: `phase${index + 1}Score`,
            // },
            // {
            //   label: '个人加权得分',
            //   dataIndex: `phase${index + 1}WeightedScore`,
            //   width: 110,
            // },
            // {
            //   label: '个人薪酬 (元)',
            //   dataIndex: `phase${index + 1}Reward`,
            //   sortable: true,
            //   width: 140,
            // },
          ],
        });
      });
      Data.mainMemberColumn = columnList.mainMemberColumn;
      Data.packageDepartWeightColumn = columnList.packageDepartWeightColumn;
      Data.packageMemberColumn = columnList.packageMemberColumn;
    }
  });
};

// 财务信息下载接口
const downLoad = (e, fileName) => {
  let params = new FormData();
  params.append('oid', e);
  api.commonApi.downloadContent(params).then((res) => {
    if (!res) return window.$message.error('下载失败');
    useCommonHandler.download(res, fileName);
  });
};

// 获取目标/指标类型
const getType = async () => {
  if (Data.projectType === '产品开发类项目') {
    // 立项前
    Data.beforeProjectEstablishment = [
      {
        name: 'technical_index',
        label: '技术指标',
        ref: 'technical',
        switchover: true,
        colunms: productColunms,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'quality_index',
        label: '质量指标',
        ref: 'quality',
        switchover: true,
        colunms: qualityColums,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'cost_index',
        label: '成本指标',
        ref: 'cost',
        switchover: true,
        colunms: costColums,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'market',
        label: '市场指标',
        enName: 'market',
        ref: 'market',
        switchover: true,
        colunms: marketColums,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'material_specification',
        label: '物料指标',
        enName: 'material_specification',
        ref: 'material',
        switchover: true,
        colunms: materialIndicatorColums,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'patent',
        label: '专利指标',
        enName: 'patent',
        ref: 'patent',
        switchover: true,
        colunms: patentColums,
        tableData: [],
        tableLoad: false,
      },
    ];
  } else {
    // 立项前
    Data.beforeProjectEstablishment = [
      {
        name: 'economic',
        label: '经济效益指标',
        enName: 'economic benefit index',
        ref: 'economic',
        switchover: true,
        colunms: economicsColums,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'quality_index',
        label: '质量指标',
        ref: 'quality',
        switchover: true,
        colunms: otherQualityColums,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'cost_index',
        label: '成本指标',
        ref: 'cost',
        switchover: true,
        colunms: maunInfomCostColums,
        tableData: [],
        tableLoad: false,
      },
      {
        name: 'others_index',
        label: '其他指标',
        ref: 'othersIndicator',
        switchover: true,
        colunms: otherColums,
        tableData: [],
        tableLoad: false,
      },
    ];
  }
  Data.beforeProjectEstablishment.forEach(async (e) => {
    e.tableLoad = true;
    await api.targetApi.queryTargetIndicators({ oid: Data.oid, targetIndicatorsType: e.label }).then((res) => {
      if (res.success) {
        e.tableData = res.data;
        e.tableLoad = false;
      } else {
        window.$message.error(res.message);
        e.tableLoad = false;
      }
    });
  });
};

// 跳转编辑
const gotoEdit = (e) => {
  let btnRole = [];
  let params = {
    projectOid: Data.oid,
    userName: userInfo.username,
  };
  api.commonApi.getPermissionByProjectldAndUserName(params).then((res) => {
    if (res.data && res.data.length > 0) {
      btnRole = res?.data.map((e) => {
        return e.path;
      });
      localStorage.setItem('singleProjectRole', JSON.stringify(btnRole));
    } else {
      localStorage.setItem('singleProjectRole', JSON.stringify(['a:a:a']));
    }
    switch (e) {
      case 'baseInfo': // 基本信息
        router.push({ name: 'updateProject' });
        break;
      case 'team': // 项目团队
        router.push({ name: 'projectTeam' });
        break;
      case 'plan': // 项目计划
        router.push({ name: 'updateProject' });
        break;
      case 'target': // 目标指标
        router.push({ name: 'target' });
        break;
      case 'payPacket': // 薪酬包  主包成员  权重金额  配包成员
        router.push({ name: 'payPacket' });
        break;
      case 'packageDepart': // 权重金额
        router.push({ name: 'payPacket' });
        break;
      case 'packageMemberTable': // 配包成员
        router.push({ name: 'payPacket' });
        break;
    }
  });
};

// 项目导航
const initFun = () => {
  if (Data.projectType === '产品开发类项目' || Data.projectType === '信息技术类项目' || Data.projectType === '制造技术类项目') {
    getProjectMileStonePlan({ oid: Data.oid }).then((res) => {
      if (res.success) {
        const newArr = res.data.filter((item) => {
          return item.actEndValue;
        });
        Data.active = newArr.length;
        Data.stepList = res.data.map((item, index) => {
          if (index === Data.active) {
            item.status = '进行中';
          } else if (index < Data.active) {
            item.status = '已完成';
          } else if (index > Data.active) {
            item.status = '未开始';
          }
          item.number = index + 1;
          return item;
        });
      } else {
        window.$message.error(res.message);
      }
    });
  }
};
</script>

<style lang="less" scoped>
@import '@/assets/commonCss/common.less';
.detail_initiation {
  // height: calc(100vh - 10px);
  overflow-y: scroll;
  position: relative;
  padding-bottom: 0px;
  margin-bottom: 20px;
  padding-left: 20px;
  padding-bottom: 0px;

  .section-title2 {
    font-size: var(--el-font-size-medium);
    font-weight: 600;
    height: 14px;
    line-height: 14px;
    margin: 12px 0;
  }

  .anthor_css {
    .header_title {
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      margin-bottom: 10px;
    }
    h3 {
      background-color: #fff;
    }
  }
  .info_box {
    display: block;
    height: calc(100vh - 240px);
    position: relative;
    overflow-y: scroll;
    overflow-y: auto;
    padding-right: 8px;
    .depart {
      margin-bottom: 20px;
      .title {
        font-size: 18px;
        font-family: 'PingFangSC, PingFang SC';
        font-weight: 500;
        color: #333333;
        margin-bottom: 8px;
      }
    }
  }
  :deep(.el-tabs__nav-scroll) {
    padding-left: 20px;
  }
  .depart {
    background-color: #fff;
    margin-bottom: 10px;
    .depart_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #dddddd;
      padding: 0 16px;
    }
    .hand_icon {
      width: 14px;
      height: 14px;
      display: flex;
      border: 1px solid rgba(0, 0, 0, 0.06);
      color: #333333;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-right: 10px;
      &:hover {
        border: 1px solid #2664f6;
      }
    }
    .depart_content {
      padding: 20px;
    }
    .title_box {
      display: flex;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #dddddd;
      padding: 0 16px;
      .hand_icon {
        width: 14px;
        height: 14px;
        display: flex;
        border: 1px solid rgba(0, 0, 0, 0.06);
        color: #333333;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-right: 10px;
        &:hover {
          border: 1px solid #2664f6;
        }
      }
      .title {
        font-size: 16px;
        font-family: 'PingFangSC, PingFang SC';
        font-weight: 500;
        color: #333333;
      }
    }
  }
  .footer {
    bottom: 1px;
    background-color: #fff;
    padding: 0 20px;
    padding-top: 10px;
  }

  // 详细信息
  .section-container {
    margin-bottom: 40px;
    padding-left: 20px;
    .section-title {
      font-size: var(--el-font-size-medium);
      font-weight: 600;
      height: 24px;
      line-height: 24px;
      margin-bottom: 12px;
    }

    .section-main {
      padding-top: 12px;
      .row-label {
        display: inline-block;
        width: 100px;
        vertical-align: top;
      }
      .row-content {
        display: inline-block;
        height: 80px;
        width: 800px;
        border-radius: 4px;
        border: 1px solid #ccc;
        padding: 4px 6px;
        .tag-item {
          margin-right: 6px;
          width: 2;
          margin-bottom: 4px;
        }
      }
    }
  }
  :deep(.page_common) {
    padding: 0 1px;
  }
}
:deep(.page_common) {
  padding: 0 0;
  padding-left: 0 !important;
}
</style>
