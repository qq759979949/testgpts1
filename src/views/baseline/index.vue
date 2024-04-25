<template>
  <div class="base_line page_common bg_css" v-loading="Data.pageLoad">
    <div class="title">{{ $intl('Baseline List').d('基线列表') }}</div>
    <div class="btn_search">
      <div class="btn_box">
        <el-button type="primary" @click="createBaseline" v-permission="'/plmProject/cb'">{{ $intl('Create Baseline').d('创建基线') }}</el-button>
        <el-button @click="deleteBaseLine" v-permission="'/plmProject/cb'">{{ $intl('delete').d('删除') }}</el-button>
      </div>
      <div class="input_search">
        <el-input v-model="Data.searchValue" style="width: 224px" placeholder="请输入搜索关键词">
          <template #suffix>
            <el-icon class="el-input__icon"><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>
    <div class="table_box">
      <NewPiTable :columns="Data.baselineColumns" :data="Data.baselineTableData" :tableLoad="Data.tableLoading" @selectionChange="selectFun" :selectable="true" :pagination="true">
        <template #baseLineName="scope">
          <el-link type="primary" :underline="true" @click="goDetailFun(scope)">
            {{ scope.row.baseLineName }}
          </el-link>
        </template>
      </NewPiTable>
    </div>
  </div>

  <!-- 创建基线弹框 -->
  <el-dialog title="创建基线" v-model="Data.baseLineVisible" @close="createDialogClose" :destroy-on-close="true" :close-on-click-modal="false">
    <div class="create_dialog_content">
      <el-form ref="createDialogForm" :model="Data.createRuleForm" :rules="Data.createRules" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="编码: " prop="number">
              <el-input v-model="Data.createRuleForm.number" disabled placeholder="请输入编码" :suffix-icon="Search" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="基线名称: " prop="name">
              <el-input v-model="Data.createRuleForm.name" placeholder="请输入基线名称" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="Data.baseLineVisible = false">{{ $intl('cancel').d('取消') }}</el-button>
        <el-button type="primary" :loading="Data.btnLoading" @click="createDialogConfirm">{{ $intl('confirm').d('确认') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';
const Data = reactive({
  pageLoad: false,
  searchValue: '',

  // 项目oid
  projectOid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,

  // 表格数据
  tableLoading: false,
  baselineColumns: [
    { title: '基线名称', dataIndex: 'baseLineName' },
    { title: '项目名称', dataIndex: 'projectName' },
    { title: '创建者', dataIndex: 'creator' },
    { title: '计划时间', dataIndex: 'planStartDate' },
  ],
  baselineTableData: [],

  // 弹框数据
  baseLineVisible: false,
  btnLoading: false,
  createRuleForm: {
    number: JSON.parse(sessionStorage.getItem('currentProject'))?.projectShortName,
    name: '',
  },
  createRules: {
    number: [{ required: true, message: '请输入编码', trigger: 'change' }],
    name: [{ required: true, message: '请输入基线名称', trigger: 'change' }],
  },
  /**用户 */
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),
});
const router = useRouter();
const api = window.$api;

/**创建基线 */
const createBaseline = () => {
  Data.baseLineVisible = true;
};
const createDialogClose = () => {
  Data.baseLineVisible = false;
};

/**点击进入详情 */
const goDetailFun = (record) => {
  console.log(record);
  router.push({ name: 'baselineDetail' });
};

/**初始化数据 */
onMounted(() => {
  getBaseLineData();
});

/**查询基线数据 */
const getBaseLineData = () => {
  Data.tableLoading = true;
  api.baseLineApi.queryBaselines({ oid: Data.projectOid }).then((res) => {
    if (res.success) {
      Data.baselineTableData = res.data;
    } else {
      window.$message.error(res.message);
    }
    Data.tableLoading = false;
  });
};

/**创建 */
const createDialogForm = ref(null);
const createDialogConfirm = () => {
  createDialogForm.value.validate((valid) => {
    if (valid) {
      Data.btnLoading = true;
      let obj = {
        projectOid: Data.projectOid,
        baseLineName: Data.createRuleForm.name,
        baseLineType: 'OR:com.pisx.pmgt.project.PIPmgtBaselineType:26582798',
        creator: Data.userInfo.username,
      };
      api.baseLineApi.createBaseline(obj).then((res) => {
        if (res.success) {
          window.$message.success('创建成功！');
          getBaseLineData();
        } else {
          window.$message.error('创建失败！');
        }
        Data.baseLineVisible = false;
        Data.btnLoading = false;
      });
    }
  });
};

/**选择 */
const selectData = ref([]);
const selectFun = (val) => {
  selectData.value = val;
};
/**批量删除 */
const deleteBaseLine = () => {
  if (selectData.value.length === 0) return window.$message.warning('请选择需要删除的数据');
  Data.pageLoad = true;
  let oidStr = selectData.value.map((v) => v.baseLineOid).join(',');
  api.baseLineApi.deleteBaselines({ oids: oidStr }).then((res) => {
    if (res.success) {
      window.$message.success('删除成功');
      getBaseLineData();
    } else {
      window.$message.error(res.message);
    }
    Data.pageLoad = false;
  });
};
</script>

<style lang="less" scoped>
.base_line {
  .title {
    font-size: 18px;
    font-family: 'PingFangSC, PingFang SC';
    font-weight: 500;
    color: #333333;
    margin-bottom: 8px;
  }
  .btn_search {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
}
</style>
