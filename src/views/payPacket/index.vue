<!-- 薪酬包页面 -->
<template>
  <div class="payPacket page_common">
    <Anthor class="anthor_css" :offset="100" :target="'.info_box'" :tabList="Data.anthorList" :actived="Data.tabValue"></Anthor>
    <div class="info_box">
      <!-- 项目评价与主包金额 -->
      <div class="depart" id="projectEvaluate">
        <h3>{{ $intl('projectEvaluate').d('项目评价与主包金额') }}</h3>
        <div class="btnList">
          <el-button type="primary" @click="save(1)" :loading="Data.loadingBtns.save1">保存</el-button>
          <el-button @click="lookData(1)">{{ $intl('changeRecord').d('变更记录') }}</el-button>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目评级: " :required="true" :label-width="120">
              <el-select v-model="Data.projectTate" style="width: 80%" :disabled="!Data.projectTateCanEdit">
                <el-option v-for="(item, index) of Data.projectTateList" :key="index" :value="item" :label="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主包金额  (元) : " :required="true" :label-width="150">
              <el-input-number v-model="Data.mainPackageMoney" :min="0" :precision="2" :disabled="!Data.projectAmountCanEdit" style="width: 200px"></el-input-number>
              <span style="margin-left: 20px">(配包比例: &nbsp;{{ Data.perCenter }}%)</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="定级时间:" :required="true" :label-width="120">
              <el-date-picker
                v-model="Data.levelDate"
                type="date"
                :size="'default'"
                value-format="YYYY-MM-DD"
                style="width: 80%"
                :disabled="!Data.projectRankDateCanEdit"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 主包阶段占比、扣减金额与阶段得分 -->
      <div class="depart" id="mainPackageWeight">
        <h3>主包阶段占比、扣减金额与阶段得分</h3>
        <div class="btnList">
          <el-button type="primary" @click="save(2)" :disabled="Data.btnRole2.save" :loading="Data.loadingBtns.save2">保存</el-button>
          <el-button @click="lookData(5)" :disabled="Data.btnRole2.changeRecord">变更记录</el-button>
        </div>
        <oneLevelTable :columns="Data.mainPackageColumn" :tableData="Data.mainPackageStageTableData" :tableHeight="260" :border="true">
          <template #attr="scope">
            <span v-if="scope.$index === 0">阶段占比 (%)</span>
            <span v-if="scope.$index === 1">变更次数</span>
            <span v-if="scope.$index === 2">扣减金额</span>
            <span v-if="scope.$index === 3">阶段得分</span>
            <span v-if="scope.$index === 4">阶段主包薪酬 (元)</span>
          </template>
          <template #phase1="scope">
            <el-input
              v-if="scope.$index === 1 && scope.row.phase1.canEdit"
              v-model.number="scope.row.phase1.value"
              style="width: 150px"
              placeholder="请输入数字"
              oninput="value=value.replace(/[^0-9]/g,'')"
              @change="changeHandler($event, scope, 1)"
              @blur="getBlur"
            >
              <template #prefix>
                <div class="input-triangle" v-if="scope.row.phase1.isSame === false"></div>
              </template>
            </el-input>
            <el-input
              v-else-if="scope.$index === 2 && scope.row.phase1.canEdit"
              v-model.number="scope.row.phase1.value"
              style="width: 150px"
              placeholder="请输入数字或小数"
              oninput="value=value.replace(/[^0-9.]/g,'').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
              @change="changeHandler($event, scope, 1)"
              @blur="getBlur"
            >
              <template #prefix>
                <div class="input-triangle" v-if="scope.row.phase1.isSame === false"></div>
              </template>
            </el-input>
            <span v-else-if="scope.row.phase1.canEdit === false">{{ scope.row.phase2.value }}</span>
            <span v-else>{{ scope.row.phase1 }}</span>
          </template>
          <template #phase2="scope">
            <el-input
              v-if="scope.$index === 1 && scope.row.phase2.canEdit"
              v-model.number="scope.row.phase2.value"
              style="width: 150px"
              placeholder="请输入数字"
              oninput="value=value.replace(/[^0-9]/g,'')"
              @change="changeHandler($event, scope, 1)"
              @blur="getBlur"
            >
              <template #prefix>
                <div class="input-triangle" v-if="scope.row.phase2.isSame === false"></div>
              </template>
            </el-input>
            <el-input
              v-else-if="scope.$index === 2 && scope.row.phase2.canEdit"
              v-model.number="scope.row.phase2.value"
              style="width: 150px"
              placeholder="请输入数字或小数"
              oninput="value=value.replace(/[^0-9.]/g,'').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
              @change="changeHandler($event, scope, 1)"
              @blur="getBlur"
            >
              <template #prefix>
                <div class="input-triangle" v-if="scope.row.phase2.isSame === false"></div>
              </template>
            </el-input>
            <span v-else-if="scope.row.phase2.canEdit === false">{{ scope.row.phase2.value }}</span>
            <span v-else>{{ scope.row.phase2 }}</span>
          </template>
          <template #phase3="scope">
            <el-input
              v-if="scope.$index === 1 && scope.row.phase3.canEdit"
              v-model.number="scope.row.phase3.value"
              style="width: 150px"
              placeholder="请输入数字"
              oninput="value=value.replace(/[^0-9]/g,'')"
              @change="changeHandler($event, scope, 1)"
              @blur="getBlur"
            >
              <template #prefix>
                <div class="input-triangle" v-if="scope.row.phase3.isSame === false"></div>
              </template>
            </el-input>
            <el-input
              v-else-if="scope.$index === 2 && scope.row.phase3.canEdit"
              v-model.number="scope.row.phase3.value"
              style="width: 150px"
              placeholder="请输入数字或小数"
              oninput="value=value.replace(/[^0-9.]/g,'').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
              @change="changeHandler($event, scope, 1)"
              @blur="getBlur"
            >
              <template #prefix>
                <div class="input-triangle" v-if="scope.row.phase3.isSame === false"></div>
              </template>
            </el-input>
            <span v-else-if="scope.row.phase3.canEdit === false">{{ scope.row.phase3.value }}</span>
            <span v-else>{{ scope.row.phase3 }}</span>
          </template>
        </oneLevelTable>
      </div>
      <!-- 主包成员表格 -->
      <div class="depart" id="mainMemberTable">
        <h3>主包成员表格</h3>
        <div class="btnList">
          <el-button type="primary" @click="save(3)" :disabled="Data.btnRole.save" :loading="Data.loadingBtns.save3">保存</el-button>
          <el-button type="primary" @click="syncTeam(1)" :disabled="Data.btnRole.same">同步</el-button>
          <el-button @click="add(1)" :disabled="Data.btnRole.add">添加</el-button>
          <el-button @click="remove(1)" :disabled="Data.btnRole.remove">移除</el-button>
          <el-button @click="exportTable(1, 'exportUserRewardsInfo')" :disabled="Data.btnRole.export">导出</el-button>
          <el-button @click="importTable(1)" :disabled="Data.btnRole.import">导入</el-button>
          <el-button @click="lookData(2)" :disabled="Data.btnRole.change">变更记录</el-button>
          <el-button @click="_queryRewardsReplaceRecord(1)" :disabled="Data.btnRole.replace">替换记录</el-button>
        </div>
        <levelTable
          :columns="Data.mainMemberColumn"
          :tableData="Data.mainMemberTableData"
          :border="true"
          :sumText="'总'"
          :isShowSummary="true"
          isCheckBox
          @selectHandler="selectHandlerMain"
        >
          <!-- 成员角色 -->
          <template #userName="scope">
            <p v-if="scope.row.userName" style="text-align: left">{{ scope.row.userName }}</p>
            <p v-if="scope.row.userName" style="text-align: left">{{ scope.row.userRole ? scope.row.userRole : '' }}</p>
          </template>
          <template v-for="(item, index) of Data.templateList" :key="index" #[item]="scope">
            <!-- 是权重，只能填百分比 -->
            <el-input
              v-if="scope.row[item].canEdit === true && Data.templateList2.includes(item)"
              :disabled="Data.state === '待处理' ? false : true"
              v-model="scope.row[item].value"
              oninput="if(value > 100) value = 100;value = value.replace(/[^\d.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/,'$1$2.$3')"
              @change="changeHandler($event, scope, 2)"
              @blur="getBlur($event, '主包权重', scope)"
            >
              <template #prefix>
                <div class="input-triangle" v-if="scope.row[item].isSame === false"></div>
              </template>
            </el-input>
            <!-- 不是权重，随便填数字 -->
            <el-input
              v-else-if="scope.row[item].canEdit === true && Data.templateList3.includes(item) && Data.projectType !== '产品开发类项目'"
              v-model.number="scope.row[item].value"
              oninput="if(value > 120) value = 0;value=value.replace(/[^0-9.]/g,'').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
              @change="changeHandler($event, scope, 2)"
              @blur="getBlur($event, '主包')"
            >
              <template #prefix>
                <div class="input-triangle" v-if="scope.row[item].isSame === false"></div>
              </template>
            </el-input>
            <span v-else>{{ scope.row[item].displayValue }}</span>
          </template>
        </levelTable>
      </div>
      <!-- 配包各部门权重与金额 -->
      <div class="depart" id="packageDepartWeight" v-if="Data.projectType === '产品开发类项目'">
        <h3>配包各部门权重与金额</h3>
        <div class="btnList">
          <el-button type="primary" @click="save(4)" :disabled="Data.btnRole.save" :loading="Data.loadingBtns.save4">保存</el-button>
          <el-button @click="exportTable(3, 'exportDeptInfo')" :disabled="Data.btnRole.export">导出</el-button>
          <el-button @click="importTable(3)" :disabled="Data.btnRole.import">导入</el-button>
          <el-button @click="lookData(3)" :disabled="Data.btnRole.change">变更记录</el-button>
        </div>
        <levelTable :columns="Data.packageDepartWeightColumn" :tableData="Data.packageDepartWeightTableData" :border="true">
          <template v-for="(item, index) of Data.templateList2" :key="index" #[item]="scope">
            <el-input
              v-if="scope.row[item].canEdit === true"
              v-model.number="scope.row[item].value"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              :placeholder="scope.row[`phase${index + 1}Reserve1`]"
              @change="changeHandler($event, scope, 3)"
              @blur="getBlur($event, '配包各部门权重')"
            >
              <template #prefix>
                <div class="input-triangle" v-if="scope.row[item].isSame === false"></div>
              </template>
            </el-input>
            <span v-else>{{ scope.row[item].value }}</span>
          </template>
        </levelTable>
      </div>
      <!-- 配包成员表格 -->
      <div class="depart" id="packageMemberTable" v-if="Data.projectType === '产品开发类项目'">
        <h3>配包成员表格</h3>
        <div class="btnList">
          <el-button type="primary" @click="save(5)" :disabled="Data.btnRole.save" :loading="Data.loadingBtns.save5">保存</el-button>
          <el-button type="primary" @click="syncTeam(2)" :disabled="Data.btnRole.same">同步</el-button>
          <el-button @click="add(2)" :disabled="Data.btnRole.add">添加</el-button>
          <el-button @click="remove(2)" :disabled="Data.btnRole.remove">移除</el-button>
          <el-button @click="exportTable(2, 'exportUserRewardsInfo')" :disabled="Data.btnRole.export">导出</el-button>
          <el-button @click="importTable(2)" :disabled="Data.btnRole.import">导入</el-button>
          <el-button @click="lookData(4)" :disabled="Data.btnRole.change">变更记录</el-button>
          <el-button @click="_queryRewardsReplaceRecord(2)" :disabled="Data.btnRole.replace">替换记录</el-button>
        </div>
        <levelTable :columns="Data.packageMemberColumn" :tableData="Data.packageMemberTableData" :border="true" isCheckBox @selectHandler="selectHandlerPackaging">
          <template #depart="scope">
            <el-select v-model="scope.row.department.value" :disabled="!scope.row.department.canEdit">
              <el-option v-for="(item, index) of Data.departList" :key="index" :value="item">{{ item }}</el-option>
            </el-select>
          </template>
          <template v-for="(item, index) of Data.templateList" :key="index" #[item]="scope">
            <!-- 是权重，只能填百分比 -->
            <el-input
              :disabled="Data.state === '待处理' ? false : true"
              v-if="scope.row[item].canEdit === true && Data.templateList2.includes(item)"
              v-model="scope.row[item].value"
              oninput="if(value > 100) value = 100;value = value.replace(/[^\d.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/,'$1$2.$3')"
              @change="changeHandler($event, scope, 4)"
              @blur="getBlur"
            >
              <template #prefix>
                <div class="input-triangle" v-if="scope.row[item].isSame === false"></div>
              </template>
            </el-input>
            <!-- 不是权重，随便填数字 -->
            <el-input
              v-else-if="scope.row[item].canEdit === true && Data.templateList3.includes(item) && Data.projectType !== '产品开发类项目'"
              v-model.number="scope.row[item].value"
              oninput="if(value > 120) value = 0;value=value.replace(/[^0-9.]/g,'').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
              @change="changeHandler($event, scope, 4)"
              @blur="getBlur"
            >
              <template #prefix>
                <div class="input-triangle" v-if="scope.row[item].isSame === false"></div>
              </template>
            </el-input>
            <span v-else>{{ scope.row[item].displayValue }}</span>
          </template>
        </levelTable>
      </div>
    </div>
    <!-- 选择用户 -->
    <selectUser
      v-model:isShow="Data.isShow"
      :title="'添加成员'"
      :defaultProps="Data.defaultProps"
      :searchList="Data.userList"
      :allText="'近期使用'"
      :contentLoading="Data.contentLoading"
      :loading="Data.loading"
      @submit="submitSelected"
    ></selectUser>
    <!-- 变更 / 替换记录 -->
    <pisx-dialog :title="Data.tableTitle" :width="'60vw'" :isShow="Data.isShowChangeRecord" @close="Data.isShowChangeRecord = false" @submit="Data.isShowChangeRecord = false">
      <template #content>
        <div class="changeTop">
          <span>共{{ Data.tableDatas.length }}个对象</span>
          <div style="margin-left: 10px">
            <el-input v-model="Data.searchVal" placeholder="请输入你需要搜索的内容" @change="onSearch" clearable>
              <template #suffix>
                <el-icon class="el-input__icon"><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
        <PiTable
          :height="'400px'"
          :columns="Data.columns"
          :data="Data.tableDatas"
          :selectable="false"
          :isShowSetting="false"
          rowKey="index"
          :tableLoad="false"
          :pagination="true"
          :total="Data.tableDatas.length"
          ref="projectTable"
        >
          <template #operateRealName="scope">
            <span v-if="scope.row.operateRealName">{{ scope.row.operateRealName }}({{ scope.row.operateUser }})</span>
          </template>
          <template #changeInfo="scope">
            <span v-html="scope.row.changeInfo"></span>
          </template>
        </PiTable>
      </template>
    </pisx-dialog>
    <!-- 导入 -->
    <upload-dialog v-model:isShow="Data.importShow" :isSingle="true" :title="Data.importTitle" @submit="submitImport"></upload-dialog>
  </div>
</template>

<script setup>
import {
  mainPackageColumn,
  replaceColumn,
  changeRecordColumn,
  // modelData,
} from './tableData.js';
import { useCommonHandler } from '@/hooks';
import { getAllUser } from '@/api/team.js';
// import { dataChange } from '@/utils/utils';
import levelTable from '@/views/projectInitiation/components/levelTable.vue';
import oneLevelTable from '@/views/projectInitiation/components/oneLevelTable.vue';
import selectUser from './components/selectUser.vue';
import { ElMessage } from 'element-plus';
import { h } from 'vue';
import { useCommonApi } from '@/stores';
import Cookies from 'js-cookie';

const useCommon = useCommonApi();

const api = window.$api;
const userInfo = JSON.parse(Cookies.get('userInfo'));
const Data = reactive({
  loading: false,
  loadingBtns: {
    save1: false,
    save2: false,
    save3: false,
    save4: false,
    save5: false,
  },
  contentLoading: false,
  anthorList: [
    { label: '项目评价与主包金额', id: 'projectEvaluate' },
    { label: '主包阶段占比、扣减金额与阶段得分', id: 'mainPackageWeight' },
    { label: '主包成员表格', id: 'mainMemberTable' },
  ], //tab列表
  importShow: false, // 导入
  importTitle: '', // 上传组件标题
  isShow: false, //选择成员
  isShowChangeRecord: false, // 替换记录表格弹窗控制
  tabValue: 'projectEvaluate',

  //  项目评价与主包金额的属性
  projectTateList: [], //           项目评级列表
  projectTate: '', //               项目评级
  projectTateCanEdit: false, //     项目评价等级是否能编辑
  projectAmountCanEdit: false, //   项目金额是否能编辑
  projectRankDateCanEdit: false, // 项目时间是否能编辑
  mainPackageMoney: null, //        主包金额
  perCenter: '',
  levelDate: '', //                 定级日期

  // 表头集合
  mainPackageColumn: [], //         主包阶段占比、扣减金额与阶段得分 表头
  mainPackageStageColumn: [], //    主包阶段 表头
  mainMemberColumn: [], //          主包成员 表头
  packageDepartWeightColumn: [], // 配包各部门权重与金额 表头
  packageMemberColumn: [], //       配包成员 表头

  // 表格数据集合
  mainPackageStageTableData: [], //             主包阶段 表格数据
  mainPackageStageTableDataCopy: [],
  mainMemberTableData: [], //                    主包成员 表格数据
  mainMemberTableDataCopy: [],
  packageDepartWeightTableData: [], //  配包各部门权重与金额 表格数据
  packageDepartWeightTableDataCopy: [],
  packageMemberTableData: [], //              配包成员 表格数据
  packageMemberTableDataCopy: [],

  // 变更 / 替换记录
  tableTitle: '', // 弹窗标题
  columns: [], //     表头
  tableDatas: [], //  表格数据
  tableDataCopy: [], //模糊搜索的数据
  searchVal: '', //    搜索的值

  selectedRowMain: [], // 主包勾选
  selectedRowPackaging: [], // 配包勾选
  userList: [], //全量用户数据
  // 用户列表的属性格式
  defaultProps: {
    key: 'id',
    label: 'pdcRealName',
    depart: 'department',
  },
  memberTableType: null, // 主配包的勾选用户类型
  oid: '', // 项目的oid
  state: '', // 项目状态
  rewardsOid: '', // 项目评价与主包金额的oid
  mainPackageStageRewardsOid: '', // 主包阶段占比、扣减金额与阶段得分

  departList: [], // 部门列表
  keyNameList: ['Percent', 'Change', 'Cut', 'Score', 'Reward'], // 主包阶段占比、扣减金额与阶段得分的表格数据拼接属性名
  // 主包成员渲染模板
  templateList: [], // 成员表格渲染的所有插槽
  // 配包各部门权重与金额 插槽
  templateList2: [], // 每个阶段的权重插槽
  templateList3: [], // 每个阶段的个人打分插槽
  projectType: '',
  btnRole: {
    save: true, // 保存
    same: true, // 同步
    add: true, // 添加
    remove: true, // 移除
    export: true, // 导出
    import: true, // 导入
    change: true, // 变更记录
    replace: true, // 替换记录
  }, // 当前用户拥有的角色列表
  currentProjectRole: [], // 用户在当前项目中的角色
  tip: false, // 其他类型的主包打分超出提示
  btnRole2: {
    save: false,
    changeRecord: false,
  },
});

onBeforeMount(async () => {
  Data.oid = JSON.parse(sessionStorage.getItem('currentProject')).oid;
  Data.state = JSON.parse(sessionStorage.getItem('currentProject')).state;
  Data.projectType = JSON.parse(sessionStorage.getItem('currentProject')).type;
  Data.currentProjectRole = JSON.parse(localStorage.getItem('currentProjectRole'));
  if (Data.projectType === '产品开发类项目') {
    Data.anthorList.push({ label: '配包各部门权重与金额', id: 'packageDepartWeight' }, { label: '配包成员表格', id: 'packageMemberTable' });
  }
  if (userInfo.isAdmin === true) {
    // 管理员上帝权限，无视任何判断
    for (let keys in Data.btnRole) {
      Data.btnRole[keys] = false;
    }
  } else {
    if (Data.state === '待处理') {
      // 待处理状态 ，只有项目经理和项目助理有权限，其他都没有权限
      if (Data.currentProjectRole.includes('项目经理') || Data.currentProjectRole.includes('项目助理')) {
        for (let keys in Data.btnRole) {
          Data.btnRole[keys] = false;
        }
      } else {
        for (let keys in Data.btnRole) {
          Data.btnRole[keys] = true;
        }
      }
    } else {
      if (Data.currentProjectRole.includes('项目经理') || Data.currentProjectRole.includes('项目助理')) {
        // 非待处理状态，只有3个按钮校验角色
        Data.btnRole.save = false; // 保存
        Data.btnRole.change = false; // 变更记录
        Data.btnRole.replace = false; // 替换记录
      }
      //  非待处理状态，并且也不是项目经理和助理的角色，有5个按钮不可用
      Data.btnRole.same = true; // 同步
      Data.btnRole.add = true; // 添加
      Data.btnRole.remove = true; // 移除
      Data.btnRole.import = true; // 导入
      Data.btnRole.export = true; // 导出
    }
  }

  // 管理员有所有权限
  if (userInfo.isAdmin === true) {
    Data.btnRole2.save = false; // 保存
    Data.btnRole2.changeRecord = false; // 变更记录
  } else if (Data.currentProjectRole.includes('项目过程管控组')) {
    // 管控组有两个按钮所有权限
    Data.btnRole2.save = false;
    Data.btnRole2.changeRecord = false;
  } else if (Data.currentProjectRole.includes('项目经理') || Data.currentProjectRole.includes('项目助理')) {
    Data.btnRole2.changeRecord = false;
  } else {
    // 没权限
    Data.btnRole2.save = true;
    Data.btnRole2.changeRecord = true;
  }

  _getAllUser();
  await _getPhaseNames(); // 查询阶段名称
  _getProjectRewardsByOid(); // 获取项目评价与主包金额
  _getProjectGradeList(); // 获取项目评级下拉值
  _queryProjectRewardsMainInfo(); // 获取主包阶段占比、扣减金额与阶段得分
  _queryMemberInfoBuilderData(1); // 获取主包表格数据
  if (Data.projectType === '产品开发类项目') {
    _getProjectDepartments(); // 获取配包部门列表
    _getSecondPackageWeightAndAmount(); // 获取配包各部门权重与金额
    _queryMemberInfoBuilderData(2); // 获取配包表格数据
  }
});

onMounted(() => {});

// 获取项目评价与主包金额  √
const _getProjectRewardsByOid = () => {
  api.payPacketApi.getProjectRewardsByOid({ oid: Data.oid }).then((res) => {
    if (res.success) {
      Data.projectTate = res.data.projectLevel.value;

      Data.projectTateCanEdit = res.data.projectLevel.canEdit;
      Data.projectAmountCanEdit = res.data.amount.canEdit;
      Data.projectRankDateCanEdit = res.data.rankingDate.canEdit;

      Data.mainPackageMoney = res.data.amount.value;
      Data.perCenter = res.data.secondaryPercent.value;
      Data.levelDate = res.data.rankingDate.value;
      Data.rewardsOid = res.data.rewardsOid;
    }
  });
};

// 失焦，让它必填或者默认转换为0
const getBlur = (e, type, scope) => {
  if (type === '配包各部门权重') {
    if (e.target.value === '' || e.target.value === 0) {
      e.target.value = '';
    }
  } else {
    if (e.target.value === '') {
      e.target.value = 0;
    }
  }
  if (type === '主包' && (Data.projectType === '信息技术类项目' || Data.projectType === '制造技术类项目')) {
    if (e.target.value > 120) {
      window.$ElMessageBox
        .alert('个人得分不能小于0 或者大于 120', '注意', {
          confirmButtonText: '确定',
          type: 'warning',
        })
        .then(() => {
          e.target.value = 0;
        })
        .catch(() => {});
    }
  }

  if (type === '主包权重') {
    let sum = null;
    Data.mainMemberTableData.forEach((e) => {
      sum += Number(e[`${scope.column.property}`].value);
    });
    if (sum > 100) {
      scope.row[`${scope.column.property}`].value = 0;
      window.$ElMessageBox
        .alert(`当前阶段的权重和不能超过100，当前为${sum}`, '注意', {
          confirmButtonText: '确定',
          type: 'warning',
        })
        .then(() => {})
        .catch(() => {});
    }
  }
};

// 获取主包阶段占比、扣减金额与阶段得分
const _queryProjectRewardsMainInfo = () => {
  api.payPacketApi.queryProjectRewardsMainInfo({ oid: Data.oid }).then((res) => {
    if (res.success) {
      let arr = [];
      res.data.phaseInfo.forEach((e) => {
        let strObj = {};
        for (var key in e) {
          let str = key.substring(0, 6);
          strObj[str] = e[key];
          key = str;
        }
        arr.push(strObj);
      });
      // console.log(arr, '获取主包阶段占比、扣减金额与阶段得分');
      Data.mainPackageStageTableData = arr;
      Data.mainPackageStageTableDataCopy = JSON.parse(JSON.stringify(arr));
      Data.mainPackageStageRewardsOid = res.data.rewardsOid;
    }
  });
};

//  获取主包、配包表格数据
const _queryMemberInfoBuilderData = (type) => {
  api.payPacketApi.queryMemberInfoBuilderData({ oid: Data.oid, primary: type }).then((res) => {
    if (res.success) {
      if (type === 1) {
        Data.mainMemberTableData = res.data; // 主包成员表格
        Data.mainMemberTableDataCopy = JSON.parse(JSON.stringify(res.data));
      } else if (type === 2) {
        Data.packageMemberTableData = res.data.sort((a, b) => {
          const aIsEmpty = a.department.value == undefined;
          const bIsEmpty = b.department.value == undefined;
          if (aIsEmpty && !bIsEmpty) {
            return -1; // a在b之后
          } else if (!aIsEmpty && bIsEmpty) {
            return 1; // a在b之前
          }
          // 如果age属性有值，则正常比较
          return a.department.value - b.department.value;
        });
        Data.packageMemberTableDataCopy = JSON.parse(JSON.stringify(res.data));
      }
      // console.log(Data.packageMemberTableData, 430);
    }
  });
};

// 获取配包各部门权重与金额
const _getSecondPackageWeightAndAmount = () => {
  api.payPacketApi.getSecondPackageWeightAndAmount({ oid: Data.oid }).then((res) => {
    if (res.success) {
      let arr = [];
      arr = JSON.parse(JSON.stringify(res.data));
      arr.forEach((e) => {
        for (var key in e) {
          if (Data.templateList2.includes(key)) {
            if (e[key].value && e[key].value === -1) {
              e[key].value = null;
            }
          }
        }
      });
      Data.packageDepartWeightTableData = arr;
      Data.packageDepartWeightTableDataCopy = JSON.parse(JSON.stringify(arr));
    }
  });
};

// 获取配包部门列表
const _getProjectDepartments = () => {
  api.payPacketApi.getProjectDepartments({ oid: Data.oid }).then((res) => {
    if (res.success) {
      Data.departList = res.data;
    } else {
      window.$message.error(res.message);
    }
  });
};

// 获取项目评级下拉值  √
const _getProjectGradeList = () => {
  api.payPacketApi.getProjectGradeList({ oid: Data.oid }).then((res) => {
    if (res.success) {
      Data.projectTateList = res.data;
    }
  });
};

// 查询阶段名称   配置表头
const _getPhaseNames = async () => {
  await api.payPacketApi.getPhaseNames({ oid: Data.oid }).then((res) => {
    if (res.success) {
      let columnList = {
        // 主包阶段占比、扣减金额与阶段得分表头
        mainPackageColumn: [
          {
            label: '',
            dataIndex: 'attr',
            width: 160,
          },
        ],
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
                dataIndex: 'depart',
                sortable: true,
                sortableType: true,
                width: 160,
              },
            ],
          },
        ],
      };
      res.data.forEach((e, index) => {
        Data.templateList2.push(`${e.label}Percent`); // 每个阶段的权重
        Data.templateList3.push(`${e.label}Score`); //   每个阶段的个人打分
        Data.templateList.push(...[`${e.label}Percent`, `${e.label}Score`, `${e.label}Reward`, `${e.label}WeightedScore`]); // 每个阶段的所有插槽
        // 主包阶段占比、扣减金额与阶段得分 表头
        columnList.mainPackageColumn.push({
          label: e.name,
          dataIndex: e.label,
        });
        // 主包成员 表头
        columnList.mainMemberColumn.push({
          label: e.name,
          dataIndex: e.label,
          children: [
            {
              label: '权重 (%)',
              dataIndex: `phase${index + 1}Percent`,
              sortable: true,
            },
            {
              label: '个人打分',
              dataIndex: `phase${index + 1}Score`,
            },
            {
              label: '个人加权得分',
              dataIndex: `phase${index + 1}WeightedScore`,
              width: 110,
            },
            {
              label: '个人薪酬 (元)',
              dataIndex: `phase${index + 1}Reward`,
              sortable: true,
              width: 140,
            },
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
            {
              label: '配包金额 (元)',
              dataIndex: `phase${index + 1}Reward`,
            },
            {
              label: '权重范围',
              dataIndex: `phase${index + 1}Desc`,
            },
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
            {
              label: '个人打分',
              dataIndex: `phase${index + 1}Score`,
            },
            {
              label: '个人加权得分',
              dataIndex: `phase${index + 1}WeightedScore`,
              width: 110,
            },
            {
              label: '个人薪酬 (元)',
              dataIndex: `phase${index + 1}Reward`,
              sortable: true,
              width: 140,
            },
          ],
        });
      });
      Data.mainPackageColumn = columnList.mainPackageColumn;
      Data.mainMemberColumn = columnList.mainMemberColumn;
      Data.packageDepartWeightColumn = columnList.packageDepartWeightColumn;
      Data.packageMemberColumn = columnList.packageMemberColumn;
      // console.log(Data.mainPackageColumn, '主包阶段占比、扣减金额与阶段得分表头');
      // console.log(Data.mainMemberColumn, '主包成员表格');
      // console.log(Data.packageDepartWeightColumn, '配包各部门权重与金额 表头');
      // console.log(columnList.packageMemberColumn, '配包成员  表头');
    }
  });
};

//获取全量用户  √
const _getAllUser = () => {
  Data.contentLoading = true;
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
          pdcRealName: e.realname + `(${e.username})`, // 中文名
          wcUser: e.thirdSystemName, // windChill账号
          department: e.departmentName, // 部门  配包成员表格需要
          id: e.id,
          roleIdList: e.roleIdList, // 权限
        };
      });
      Data.contentLoading = false;
    } else {
      window.$message.error(res.message);
    }
  });
};

// tab跳转
const handleTabClick = (tab) => {
  const id = tab.props.name;
  document.querySelector('#' + id).scrollIntoView({
    behavior: 'smooth',
  });
};

// 查看变更记录
const lookData = (type) => {
  _queryRewardsChangeRecord(type);
};

// 获取变更记录
const _queryRewardsChangeRecord = (type) => {
  Data.tableTitle = '变更记录';
  Data.isShowChangeRecord = true;
  Data.columns = changeRecordColumn;
  Data.columns.forEach((e) => {
    if (e.label === '操作时间' || e.label === '操作人') {
      e.width = 180;
    }
  });
  api.payPacketApi.queryRewardsChangeRecord({ oid: Data.oid, changeType: type }).then((res) => {
    if (res.success) {
      let arr = [];
      res.data.forEach((e) => {
        if (e.changeInfo && e.changeInfo.includes('\n')) {
          e.changeInfo = e.changeInfo.replace(/\n/g, '<br/>');
        }
        arr.push(e);
      });
      Data.tableDatas = arr;
      Data.tableDataCopy = JSON.parse(JSON.stringify(res.data));
    } else {
      window.$message.error(res.message);
    }
  });
};

// 查询主包-配包替换记录
const _queryRewardsReplaceRecord = (type) => {
  Data.tableTitle = '替换记录';
  Data.isShowChangeRecord = true;
  Data.columns = replaceColumn;
  api.payPacketApi.queryRewardsReplaceRecord({ oid: Data.oid, changeType: type }).then((res) => {
    if (res.success) {
      Data.tableDatas = res.data;
    } else {
      window.$message.error(res.message);
    }
  });
};

// 添加 主包成员表格
const add = (type) => {
  Data.isShow = true;
  Data.memberTableType = type;
};

// 主包成员表格勾选
const selectHandlerMain = (row) => {
  Data.selectedRowMain = row;
};

// 配包成员表格勾选
const selectHandlerPackaging = (row) => {
  Data.selectedRowPackaging = row;
};

//移除
const remove = (type) => {
  let oids = [];
  if (type === 1) {
    if (Data.selectedRowMain.length === 0) return window.$message.warning('请选择主包成员数据!');
    oids = Data.selectedRowMain.map((e) => {
      return e.memberOid;
    });
  } else if (type === 2) {
    if (Data.selectedRowPackaging.length === 0) return window.$message.warning('请选择配包成员数据!');
    oids = Data.selectedRowPackaging.map((e) => {
      return e.memberOid;
    });
  }
  let params = {
    oid: Data.oid,
    userRewardsOid: oids,
  };

  api.payPacketApi.removeUserRewards(params).then((res) => {
    if (res.success) {
      window.$message.success('移除成功');
      // _queryMemberInfoBuilderData(type);
      if (type === 1) {
        Data.mainMemberTableData = Data.mainMemberTableData.filter((e) => {
          return !oids.includes(e.memberOid);
        });
      } else if (type === 2) {
        Data.packageMemberTableData = Data.packageMemberTableData.filter((e) => {
          return !oids.includes(e.memberOid);
        });
      }
    } else {
      window.$message.error(res.message);
    }
  });
};

// 同步主包 和 配包成员
const syncTeam = (type) => {
  api.payPacketApi.syncProjectTeam({ oid: Data.oid, type: type }).then((res) => {
    if (res.success) {
      window.$message.success('已同步!');
      _queryMemberInfoBuilderData(type);
    } else {
      window.$message.error(res.message);
    }
  });
};

// 提交选择的用户
const submitSelected = (userList) => {
  if (userList.length === 0) return window.$message.warning('请选择人员！');
  Data.loading = true;
  let list = userList.map((e) => {
    return {
      pdcUser: e.pdcUser,
      pdcRealName: e.pdcRealName,
      wcUser: e.wcUser,
      department: '',
      isPrimary: Data.memberTableType,
    };
  });
  let params = new FormData();
  params.append('userInfos', JSON.stringify(list));
  params.append('oid', Data.oid);
  api.payPacketApi.batchAddUserRewards(params).then((res) => {
    if (res.success && res.data && res.data.length > 0) {
      window.$message.success('添加成功');
      if (Data.memberTableType === 1) {
        Data.mainMemberTableData.unshift(...res.data);
      } else if (Data.memberTableType === 2) {
        Data.packageMemberTableData.unshift(...res.data);
      }
      // _queryMemberInfoBuilderData(Data.memberTableType);
      Data.isShow = false;
      Data.loading = false;
    } else {
      window.$message.error(res.message);
      Data.isShow = false;
      Data.loading = false;
    }
  });
};

// 导出表格
const exportTable = (type, url) => {
  sessionStorage.removeItem('downloadName');
  let params = {
    oid: Data.oid,
  };
  if (type === 1 || type === 2) {
    params.isPrimary = type;
  }
  api.payPacketApi[url](params).then((res) => {
    let str = decodeURIComponent(sessionStorage.getItem('downloadName'));
    useCommonHandler.download(res, str.split('=')[1]);
  });
};

// 导入表格
const importTable = (type) => {
  Data.importShow = true;
  type === 1 ? (Data.importTitle = '导入主包成员') : type === 2 ? (Data.importTitle = '导入配包成员') : (Data.importTitle = '配包各部门权重与金额');
};

// 导入表格
const submitImport = (fileList) => {
  let params = new FormData();
  params.append('oid', Data.oid);
  if (Data.importTitle === '配包各部门权重与金额') {
    params.append('file', fileList[0].raw);
    api.payPacketApi.importDeptInfo(params).then((res) => {
      if (res.success) {
        window.$message.success('导入成功');
        Data.importShow = false;
        _getSecondPackageWeightAndAmount();
      } else {
        window.$message.error(res.message);
        Data.importShow = false;
      }
    });
  } else {
    params.append('primary', Data.importTitle === '导入主包成员' ? 1 : 2);
    params.append('file', fileList[0].raw);
    api.payPacketApi.importUserRewardsInfo(params).then((res) => {
      if (res.success) {
        // console.log(res);
        window.$message.success('导入成功');
        _queryMemberInfoBuilderData(Data.importTitle === '导入主包成员' ? 1 : 2);
        Data.importShow = false;
      } else {
        ElMessage({
          message: h('p', { style: 'line-height: 1; font-size: 18px' }, [h('div', { innerHTML: res.message, style: 'font-size: 18px; color: #f56c6c' })]),
          type: 'error',
        });
        Data.importShow = false;
      }
    });
  }
};

// 判断修改的数据是否和原始数据一样
const changeHandler = (e, scope, type) => {
  switch (type) {
    case 1: // 主包阶段占比、扣减金额与阶段得分
      Data.mainPackageStageTableDataCopy.forEach((item, index) => {
        if (scope.$index === index) {
          if (e == item[scope.column['property']].value) {
            scope.row[scope.column['property']].isSame = true;
          } else {
            scope.row[scope.column['property']].isSame = false;
          }
        }
      });
      break;
    case 2:
      Data.mainMemberTableDataCopy.forEach((item, index) => {
        if (scope.$index === index) {
          if (e == item[scope.column['property']].value) {
            e = Number(e);
            scope.row[scope.column['property']].isSame = true;
          } else {
            scope.row[scope.column['property']].isSame = false;
          }
        }
      });
      break;
    case 3:
      Data.packageDepartWeightTableDataCopy.forEach((item, index) => {
        if (scope.$index === index) {
          if (e == item[scope.column['property']].value) {
            scope.row[scope.column['property']].isSame = true;
          } else {
            scope.row[scope.column['property']].isSame = false;
          }
        }
      });
      break;
    case 4:
      Data.packageMemberTableDataCopy.forEach((item, index) => {
        if (scope.$index === index) {
          if (e == item[scope.column['property']].value) {
            scope.row[scope.column['property']].isSame = true;
          } else {
            scope.row[scope.column['property']].isSame = false;
          }
        }
      });
      break;
  }
  // console.log(scope, '修改后的scope');
};

// 保存一类

// 保存
const save = (type) => {
  switch (type) {
    case 1:
      saveProjectEvaluate(); // 保存 项目评价与主包金额
      break;
    case 2:
      saveMainPackageWeight(); // 保存 主包阶段占比、扣减金额与阶段得分
      break;
    case 3:
      saveMainMemberTable(); // 保存 主包成员表格
      break;
    case 4:
      savePackageDepartWeight(); // 保存 配包各部门权重与金额
      break;
    case 5:
      packageMemberTable(); // 保存 配包成员表格
      break;
  }
};

// 保存 项目评价与主包金额                  √
const saveProjectEvaluate = () => {
  // console.log('项目评级', Data.projectTate, '主包金额', Data.mainPackageMoney, '定级日期', Data.levelDate);
  if (Data.projectTate === '') return window.$message.warning('项目评级不能为空');
  if (Data.mainPackageMoney === null) return window.$message.warning('主包金额不能为空');
  if (Data.levelDate === '') return window.$message.warning('定级日期不能为空');
  Data.loadingBtns.save1 = true;
  let params = {
    oid: Data.oid,
    rewardsOid: Data.rewardsOid,
    projectLevel: Data.projectTate,
    amount: Data.mainPackageMoney,
    secondaryPercent: 0,
    rankingDate: Data.levelDate,
    pdcUserName: userInfo.username,
    pdcRealName: userInfo.realName,
  };
  api.payPacketApi.updateProjectRewards(JSON.stringify(params)).then((res) => {
    if (res.success) {
      window.$message.success('保存成功！');
      let obj = JSON.parse(sessionStorage.getItem('currentProject'));
      obj.comprehensiveGrade = Data.projectTate;
      obj.projectShortName = res.data.projectNumber;
      sessionStorage.setItem('currentProject', JSON.stringify(obj));
      useCommon.projectShortName = res.data.projectNumber;
      _getProjectRewardsByOid();
      Data.loadingBtns.save1 = false;
    } else {
      window.$message.error(res.message);
      Data.loadingBtns.save1 = false;
    }
  });
};

// 保存 主包阶段占比、扣减金额与阶段得分      √
const saveMainPackageWeight = () => {
  Data.loadingBtns.save2 = true;
  let strObj = {};
  // console.log(Data.mainPackageStageTableData, 865);
  Data.mainPackageStageTableData.forEach((e, index) => {
    for (var key in e) {
      let str = key + Data.keyNameList[index];
      strObj[str] = parseFloat(e[key].value) || parseFloat(e[key]);
      key = str;
    }
  });
  strObj['oid'] = Data.oid;
  strObj['pdcRealName'] = userInfo.realName;
  strObj['pdcUserName'] = userInfo.username;
  let params = new FormData();
  params.append('rewardMainInfo', JSON.stringify(strObj));
  api.payPacketApi.updateProjectRewardMainInfo(params).then((res) => {
    if (res.success) {
      window.$message.success('保存成功');
      _queryProjectRewardsMainInfo();
      Data.loadingBtns.save2 = false;
    } else {
      window.$message.error(res.message);
      Data.loadingBtns.save2 = false;
    }
  });
};

// 保存 主包成员表格       √
const saveMainMemberTable = () => {
  Data.loadingBtns.save3 = true;
  let arr = [];
  Data.mainMemberTableData.forEach((e) => {
    let item = {};
    for (var key in e) {
      if (Data.templateList.includes(key)) {
        item[key] = parseFloat(e[key].value);
      } else if (key === 'memberOid') {
        item[key] = e[key];
      } else {
        item[key] = e[key].value;
      }
    }
    arr.push(item);
  });
  let params = {
    projectOid: Data.oid,
    primary: 1,
    memberInfos: arr,
  };
  api.payPacketApi.saveMemberUserRewards(params).then((res) => {
    if (res.success) {
      window.$message.success('保存成功');
      _queryMemberInfoBuilderData(1);
      Data.loadingBtns.save3 = false;
    } else {
      window.$message.error(res.message);
      Data.loadingBtns.save3 = false;
    }
  });
};

//配包各部门权重与金额  校验值是否大于区间的值 后面是否要加弹窗
const checkData = () => {
  let ckeckList = [];
  Data.packageDepartWeightTableData.forEach((e) => {
    let item = {};
    for (var key in e) {
      if (Data.templateList2.includes(key)) {
        if (e[key].canEdit) {
          if (e[key].maxPhaseReserve < e[key].value) {
            item.maxPhaseReserve = e[key].maxPhaseReserve;
            item.value = e[key].value;
          }
        }
      }
      if (key === 'department') item.department = e[key];
    }
    ckeckList.push(item);
  });
  let newArr = [];
  if (ckeckList.length > 0) {
    newArr = ckeckList.filter((e) => {
      return e.maxPhaseReserve;
    });
  }
  return newArr;
};

// 保存 配包各部门权重与金额      √
const savePackageDepartWeight = () => {
  Data.loadingBtns.save4 = true;
  let arr = [];
  Data.packageDepartWeightTableData.forEach((e) => {
    let item = {};
    for (var key in e) {
      if (Data.templateList2.includes(key)) {
        item[key] = parseFloat(e[key].value);
      } else {
        item[key] = e[key];
      }
    }
    arr.push(item);
  });
  let params = {
    oid: Data.oid,
    secondaryRewardsInfo: arr,
  };
  // console.log(params);
  api.payPacketApi.saveSecondaryPacInfo(params).then((res) => {
    if (res.success) {
      window.$message.success('保存成功');
      _getSecondPackageWeightAndAmount();
      _getProjectRewardsByOid();
      Data.loadingBtns.save4 = false;
    } else {
      window.$message.error(res.message);
      Data.loadingBtns.save4 = false;
    }
  });
  // }
};

// 保存 配包成员表格      √
const packageMemberTable = () => {
  let isNull = Data.packageMemberTableData.filter((e) => {
    return e.department === undefined || e.department === '';
  });
  if (isNull.length > 0) return window.$message.warning('必须选择部门');
  Data.loadingBtns.save5 = true;
  let arr = [];
  Data.packageMemberTableData.forEach((e) => {
    let item = {};
    for (var key in e) {
      if (Data.templateList.includes(key)) {
        item[key] = parseFloat(e[key].value);
      } else if (key === 'memberOid') {
        item[key] = e[key];
      } else if (key === 'department') {
        item[key] = e[key].value;
      }
    }
    arr.push(item);
  });
  let params = {
    projectOid: Data.oid,
    primary: 2,
    memberInfos: arr,
  };
  api.payPacketApi.saveMemberUserRewards(params).then((res) => {
    if (res.success) {
      window.$message.success('保存成功');
      _queryMemberInfoBuilderData(2);
      Data.loadingBtns.save5 = false;
    } else {
      window.$message.error(res.message);
      Data.loadingBtns.save5 = false;
    }
  });
};

// 所有表头模糊搜索
const onSearch = () => {
  let handSearchTable = [];
  if (Data.searchVal) {
    Data.tableDataCopy.filter((item) => {
      let count = 0;
      for (let k in item) {
        if (item[k]) {
          let nowValue = item[k].toString();
          if (nowValue.includes(Data.searchVal)) {
            count++;
          }
        }
      }
      if (count) {
        handSearchTable.push(item);
      }
    });
    Data.tableDatas = handSearchTable;
  } else {
    Data.tableDatas = Data.tableDataCopy;
  }
};
</script>

<style lang="less" scoped>
.payPacket {
  background-color: #fff;
  padding-bottom: 20px;
  margin-bottom: 20px;
  .anthor_css {
    padding-right: 16px;
  }
  .info_box {
    display: block;
    height: calc(100vh - 200px);
    position: relative;
    overflow-y: auto;
    padding-right: 8px;
    .depart {
      margin-bottom: 40px;
      padding-left: 20px;
      .title {
        font-size: 18px;
        font-family: 'PingFangSC, PingFang SC';
        font-weight: 500;
        color: #333333;
        margin-bottom: 8px;
      }
    }
  }
  .top_area {
    margin-bottom: 20px;
    padding: 16px;
    background: #fff;
    .tab_box {
      :deep(.el-tabs__header) {
        margin-bottom: 0px;
      }
    }
  }
  :deep(.anthor .tabBox .el-tabs__header) {
    padding-left: 20px;
  }
  .depart {
    margin: 20px 0 10px;
    .btnList {
      margin: 10px 0;
    }
    // 橙色三角形
    .input-triangle {
      position: absolute;
      top: 3%;
      left: 0px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0px 1px 8px 11px;
      border-color: transparent transparent #f68800 transparent;
      transform: rotate(180deg);
      border-radius: 30%;
    }
    :deep(.el-input-group--prepend > .el-input__wrapper) {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
  }
  .changeTop {
    display: flex;
    justify-content: end;
    line-height: 30px;
    margin-bottom: 10px;
  }
  .footer {
    height: 50px;
    border-top: solid 1px #dedede;
    position: fixed;
    width: calc(100vw - 225px);
    bottom: 1px;
    background-color: #fff;
    padding: 10px 20px;
    display: flex;
    align-content: center;
    justify-content: end;
    z-index: 999999;
  }
}
</style>
