<template>
  <div class="target" v-loading="Data.loading">
    <div class="btn">
      <div>
        <el-button type="primary" @click="handleCreated">{{ $intl('created').d('新增') }}</el-button>
        <el-button type="" @click="handleDelete">{{ $intl('delete').d('删除') }}</el-button>
        <el-button type="" @click="handleSave">{{ $intl('Save').d('保存') }}</el-button>
        <el-button type="" @click="handleImport">{{ $intl('import').d('导入') }}</el-button>
        <el-button type="" @click="handleExport">{{ $intl('export').d('导出') }}</el-button>
      </div>
      <div>
        <div class="project-type">
          <span>项目类别:</span>
          <el-select v-model="Data.projectTypeValue" @change="projectTypeChange">
            <el-option v-for="item in Data.projectTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <!-- 搜索框 -->
          <el-input v-model="Data.searchValue" style="width: 224px; margin-left: 20px" placeholder="请输入搜索关键词" clearable @keyup.enter="handleSearch">
            <template #suffix>
              <el-icon class="el-input__icon" @click="handleSearch"><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </div>
    <newPiTable
      :columns="Data.colunms"
      :data="Data.tableData"
      :selectable="true"
      @selectionChange="selectionChange"
      :tableHeight="'75vh'"
      :isShowSetting="false"
      :total="Data.total"
      :pagination="Data.tableData?.length > 10"
      :isWebPagination="Data.tableData?.length > 10"
      :page-size="10"
      :isDeep="true"
    >
      <template #productType="scope">
        <el-select v-model="scope.row.productType" placeholder="请选择" style="width: 100%" v-if="Data.projectTypeValue === 'productDevelopProject'" multiple>
          <el-option v-for="item in Data.productCategoryList" :key="item" :label="item" :value="item" />
        </el-select>
        <span v-else>-</span>
      </template>
      <template #indicatorType="scope">
        <div class="hand_style">
          <el-select v-model="scope.row.indicatorType" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in Data.pointerTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </template>
      <template #indicatorName="scope">
        <div class="hand_style">
          <el-input v-model="scope.row.indicatorName" placeholder="请输入">{{ scope.row.indicatorName }}</el-input>
        </div>
      </template>
      <template #indicatorSmallType="scope">
        <el-input v-model="scope.row.indicatorSmallType" placeholder="请输入">{{ scope.row.indicatorSmallType }}</el-input>
      </template>
      <template #unit="scope">
        <el-input v-model="scope.row.unit" placeholder="请输入">{{ scope.row.unit }}</el-input>
      </template>
      <template #acceptancePhase="scope">
        <el-select v-model="scope.row.acceptancePhase" placeholder="请选择" style="width: 100%" multiple v-if="Data.projectTypeValue === 'productDevelopProject'">
          <el-option v-for="item in Data.acceptancePhaseList" :key="item.name" :label="item.name" :value="item.name" />
        </el-select>
        <span v-else>-</span>
      </template>
      <template #actualValueProvided="scope">
        <el-select v-model="scope.row.actualValueProvided" placeholder="请选择" style="width: 100%" multiple>
          <el-option v-for="item in Data.roleList" :key="item.label" :label="item.label" :value="item.label" />
        </el-select>
      </template>
      <template #isCanChange="scope">
        <el-select v-model="scope.row.isCanChange" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in Data.alterationList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </template>
      <template #formula="scope">
        <el-input v-model="scope.row.formula" placeholder="请输入">{{ scope.row.formula }}</el-input>
      </template>
    </newPiTable>
  </div>
  <!-- 导入 -->
  <upload-dialog v-model:isShow="Data.importShow" :isSingle="true" title="导入指标模板" @submit="submitImport"></upload-dialog>
</template>

<script setup>
import { listDictItem } from '@/api/homePage.js';
import { useCommonHandler } from '@/hooks';
import { pageFind } from '@/api/team';
const api = window.$api;
const Data = reactive({
  loading: false,
  tableData: [],
  colunms: [
    { title: '序号', dataIndex: 'id', width: 60 },
    { title: '产品类别', dataIndex: 'productType', filters: 'select', multiple: true, selectList: [] },
    { title: '指标类型', dataIndex: 'indicatorType', filters: 'select', required: true },
    { title: '指标名称', dataIndex: 'indicatorName', filters: 'select', required: true },
    { title: '指标小类', dataIndex: 'indicatorSmallType', filters: 'select' },
    { title: '单位', dataIndex: 'unit', filters: 'select' },
    { title: '验收阶段', dataIndex: 'acceptancePhase', filters: 'select', multiple: true, selectList: [] },
    { title: '实际值提供', dataIndex: 'actualValueProvided', filters: 'select', multiple: true, selectList: [] },
    { title: '是否可变更', dataIndex: 'isCanChange', filters: 'select' },
    { title: '公式', dataIndex: 'formula', filters: 'select' },
  ],
  projectTypeValue: '',
  // 项目类别
  projectTypeOptions: [],
  // 产品类型
  productCategoryList: [],
  // 指标类型
  pointerTypeList: [],
  // 验收阶段
  acceptancePhaseList: [],
  // 是否可变更
  alterationList: [
    {
      label: '是',
      value: '是',
    },
    {
      label: '否',
      value: '否',
    },
  ],
  // 是否必须
  needList: [
    {
      label: '是',
      value: '是',
    },
    {
      label: '否',
      value: '否',
    },
  ],
  selectTableData: [],
  importShow: false,
  page: 1,
  range: 5,
  total: 0,
  roleList: [],
  changeFlag: false,
  searchValue: '',
  tableDataCopy: [],
  defalutTableData: [],
  count: 0,
});
const setColumn = () => {
  const slotList = Data.colunms.map((item) => item.dataIndex).filter((v) => v && v.trim());
  return slotList;
};
// 新增
const handleCreated = () => {
  Data.count++;
  if (Data.projectTypeValue !== '') {
    const slotList = setColumn();
    const obj = {};
    for (const i in slotList) {
      obj[slotList[i]] = '';
      obj.isAdd = true;
      obj.orderIndex = Data.count;
    }
    Data.tableData.unshift(obj);
    window.$message.success('新增成功');
  } else {
    window.$message.warning('请选择项目类别');
  }
};
// 项目类别
const initFun = () => {
  listDictItem({ dictCode: 'projectType' }).then((res) => {
    if (res.success) {
      Data.projectTypeOptions = JSON.parse(res.data[0].itemValue);
      Data.projectTypeValue = Data.projectTypeOptions[0].value;
      getPhaseBy(Data.projectTypeValue);
      getSelectData(Data.projectTypeValue);
      handleQuearyData(Data.projectTypeValue);
    } else {
      window.$message.error(res.message);
    }
  });
};
// 获取产品类别和指标类型下拉
const getSelectData = (val) => {
  // 产品类别
  api.targetApi.getProductTypes({ projectType: val }).then((res) => {
    if (res.success) {
      Data.productCategoryList = res.data;
      Data.colunms.map((item) => {
        if (item.dataIndex === 'productType') {
          item.selectList = Data.productCategoryList;
        }
      });
    } else {
      window.$message.error(res.message);
    }
  });
  // 指标类型
  api.targetApi.getIndicatorTypes().then((res) => {
    if (res.success) {
      if (res.data.length > 0) {
        Data.pointerTypeList = res.data.map((item) => {
          return { label: item, value: item };
        });
      }
    }
  });
};
// 项目类别change
const projectTypeChange = (val) => {
  Data.changeFlag = true;
  Data.projectTypeValue = val;
  handleQuearyData(val);
  getPhaseBy(val);
  getSelectData(val);
};
// 列表查询
const handleQuearyData = (val) => {
  Data.loading = true;
  api.targetApi.queryTargetTemplatess({ projectType: val }).then((res) => {
    if (res.success) {
      if (res.data.length > 0) {
        let jsonStringify = JSON.stringify(res.data);
        let array = JSON.parse(jsonStringify);
        array.map((element) => {
          if (element.productType) {
            element.productType = element.productType ? element.productType.split(',') : '';
          }
          if (element.acceptancePhase) {
            element.acceptancePhase = element.acceptancePhase ? element.acceptancePhase.split(',') : '';
          }
          if (element.actualValueProvided) {
            element.actualValueProvided = element.actualValueProvided ? element.actualValueProvided.split(',') : '';
          }
          element.formula = element.formula ? element.formula : '';
          element.indicatorType = element.indicatorType ? element.indicatorType : '';
          element.indicatorName = element.indicatorName ? element.indicatorName : '';
          element.indicatorSmallType = element.indicatorSmallType ? element.indicatorSmallType : '';
          element.unit = element.unit ? element.unit : '';
          element.isCanChange = element.isCanChange ? element.isCanChange : '';
        });
        Data.tableData = array;
        Data.tableDataCopy = [...Data.tableData];
        Data.defalutTableData = array;
        Data.total = Data.tableData.length;
      } else {
        Data.tableData = [];
      }
      Data.loading = false;
    } else {
      window.$message.error(res.message);
    }
  });
};
// 获取验收阶段
const getPhaseBy = (val) => {
  api.payPacketApi.queryReviewPhaseByProjectType({ projectType: val }).then((res) => {
    if (res.success) {
      Data.acceptancePhaseList = res.data;
      let newArr = Data.acceptancePhaseList.map((item) => {
        return item.name;
      });
      Data.colunms.map((item) => {
        if (item.dataIndex === 'acceptancePhase') {
          item.selectList = newArr;
        }
      });
    }
  });
};
// 获取角色
const projectUser = () => {
  pageFind({ pageSize: 10000, pageNo: 1, id: null }).then((res) => {
    if (res.code === 200) {
      Data.roleList = res.data.contents;
      Data.roleList.map((item) => {
        item.label = item.roleName;
        item.value = item.roleCode;
      });
      let newArr = Data.roleList.map((item) => {
        return item.label;
      });
      Data.colunms.map((item) => {
        if (item.dataIndex === 'actualValueProvided') {
          item.selectList = newArr;
        }
      });
    } else {
      window.$message.error(res.message);
    }
  });
};
// 删除
const handleDelete = () => {
  if (Data.selectTableData.length === 0) return window.$message.warning('请选择需要删除的数据');
  let deleteAddData = Data.selectTableData.filter((v) => v.isAdd);
  let deleteOldData = Data.selectTableData.filter((v) => !v.isAdd);
  let oids = deleteOldData.map((v) => v.targetTemplateOid).join(',');
  window.$ElMessageBox
    .confirm('确定要删除勾选的数据？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      // 1.删除新增数据
      if (deleteAddData.length && !oids) {
        Data.tableData = Data.tableData.filter((el) => deleteAddData.every((item) => item.orderIndex !== el.orderIndex));
        window.$message.success('删除成功');
      }
      // 2.删除已保存数据
      else if (deleteOldData.length && !deleteAddData.length) {
        deleteSaveData();
      }
      // 3.删除新增和已保存数据
      else if (deleteOldData.length && deleteAddData.length) {
        Data.tableData = Data.tableData.filter((el) => deleteAddData.every((item) => item.orderIndex !== el.orderIndex));
        deleteSaveData();
      }
    });
};
const deleteSaveData = () => {
  let targetTemplateOids = [];
  let jsonString = JSON.stringify(Data.selectTableData);
  let array = JSON.parse(jsonString);
  targetTemplateOids = array.map((obj) => obj.targetTemplateOid).join(',');
  api.targetApi.deleteTargetObjs({ oids: targetTemplateOids }).then((res) => {
    if (res.success) {
      window.$message.success('删除成功');
      handleQuearyData(Data.projectTypeValue);
    } else {
      window.$message.error(res.message);
    }
  });
};
// 导入弹框
const handleImport = () => {
  Data.importShow = true;
}; // 导入
const submitImport = (fileList) => {
  api.targetApi.importTargetTemplate({ projectType: Data.projectTypeValue, file: fileList[0].raw }).then((res) => {
    if (res.success) {
      window.$message.success('导入成功');
      handleQuearyData(Data.projectTypeValue);
      Data.importShow = false;
    } else {
      window.$message.error(res.message);
      Data.importShow = false;
    }
  });
};
// 导出
const handleExport = () => {
  sessionStorage.removeItem('downloadName');
  api.targetApi.exportTargetTemplate({ projectType: Data.projectTypeValue }).then((result) => {
    if (result) {
      if (!result) return window.$message.error('下载失败');
      let str = decodeURIComponent(sessionStorage.getItem('downloadName'));
      useCommonHandler.download(result, str.split('=')[1]);
    }
  });
};
// 保存
const handleSave = () => {
  let isRequire = Data.tableData.filter((item) => item.indicatorType === '' || item.indicatorName === '');
  if (isRequire.length > 0) {
    return window.$message.warning('请填写必填内容！');
  } else {
    let jsonString = JSON.stringify(Data.tableData);
    let array = JSON.parse(jsonString);
    array.map((obj) => {
      obj.productType = obj.productType ? obj.productType.join(',') : '';
      obj.acceptancePhase = obj.acceptancePhase ? obj.acceptancePhase.join(',') : '';
      obj.actualValueProvided = obj.actualValueProvided ? obj.actualValueProvided.join(',') : '';
    });
    Data.loading = true;
    let params = {
      projectType: Data.projectTypeValue,
      targetTemplateInfos: JSON.stringify(array),
    };
    api.targetApi.saveTargetTemplate(params).then((res) => {
      if (res.success) {
        window.$message.success('创建成功');
        Data.loading = false;
      } else {
        window.$message.error(res.message);
        Data.loading = false;
      }
    });
  }
};
// 复选框选择
const selectionChange = (val) => {
  Data.selectTableData = val;
};
// 搜索
const handleSearch = () => {
  const searchTerm = Data.searchValue.toLowerCase();
  Data.tableData = Data.tableDataCopy.filter((row) => {
    return Object.keys(row).some((key) => {
      return String(row[key]).toLowerCase().includes(searchTerm);
    });
  });
};
watch(
  () => Data.searchValue,
  (val) => {
    if (val === '') {
      Data.tableData = [...Data.defalutTableData];
    }
  },
);
onMounted(() => {
  initFun();
  projectUser();
});
</script>

<style lang="less" scoped>
.target {
  // width: calc(100% - 32px);
  // min-height: calc(100vh - 80px - 36px - 56px);
  margin: 0 16px;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  color: #333333;
  .title {
    font-size: 18px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    color: #333333;
  }
  .project-type {
    // margin: 10px 0;
    margin-bottom: 10px;
    span {
      font-size: 14px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 400;
      color: #666666;
      display: inline-block;
      margin-right: 20px;
    }
    .el-input__icon {
      cursor: pointer;
    }
  }
  .btn {
    margin-bottom: 10px;
    display: flex;
    :nth-child(1) {
      flex: 1;
    }
  }
}
.hand_style {
  display: flex;
  align-items: center;
  .is_reqire {
    margin-right: 2px;
    color: red;
  }
  .el-icon {
    cursor: pointer;
    margin-left: 4px;
  }
}
:deep(.el-affix) {
  width: 100% !important;
  height: 56px !important;
  line-height: 56px !important;
  text-align: right;
}
:deep(.el-affix--fixed) {
  z-index: 100;
  height: 56px !important;
  line-height: 56px !important;
  background: #ffffff;
  box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.2);
  border-radius: 1px;
  padding-right: 13px;
  bottom: 0 !important;
}
:deep(.el-form-item__content) {
  margin-left: 0 !important;
  width: 100%;
  margin-top: 15px;
}
</style>
