<template>
  <div>
    <div class="btn" v-if="route.name === 'target' && Data.projectType !== '产品开发类项目'">
      <div>
        <el-button type="primary" @click="handleInsert" v-permission="'/plmProject/EditIndex'">{{ $intl('InsertIndicatorTemplate').d('插入指标模板') }}</el-button>
        <el-button type="" @click="handleAdd" v-permission="'/plmProject/EditIndex'">{{ $intl('add').d('添加') }}</el-button>
        <el-button type="" @click="handleDelete" v-permission="'/plmProject/EditIndex'">{{ $intl('remove').d('移除') }}</el-button>
      </div>
      <div>
        <el-button type="primary" @click="handlePresent" v-show="!props.isChange">{{ $intl('submit').d('保存') }}</el-button>
      </div>
    </div>
    <newPiTable
      :columns="Data.colunms"
      :data="Data.tableData"
      :selectable="true"
      rowKey=""
      :pagination="false"
      :isShowSetting="false"
      :tableLoad="Data.tableLoad"
      @selectionChange="technologySelectChange"
    >
      <template #formula="scope">
        <el-input v-model="scope.row.formula" placeholder="请输入" v-if="scope.row.editFlag || scope.row.queryFlag" />
        <span v-else>{{ scope.row.formula }}</span>
      </template>
      <template #indicatorName="scope">
        <el-input v-model="scope.row.indicatorName" placeholder="请输入" v-if="scope.row.editFlag || scope.row.addFlag === 'true'" />
        <div v-if="scope.row.isDelete" class="text-line">{{ scope.row.indicatorName }}</div>
        <span v-if="!scope.row.isDelete && !scope.row.editFlag && scope.row.addFlag === 'false'">{{ scope.row.indicatorName }}</span>
      </template>
      <template #indicatorSmallType="scope">
        <el-input v-model="scope.row.indicatorSmallType" placeholder="请输入" v-if="scope.row.editFlag || scope.row.addFlag === 'true'" />
        <span v-else>{{ scope.row.indicatorSmallType }}</span>
      </template>
      <template #unit="scope">
        <el-input v-model="scope.row.unit" placeholder="请输入" v-if="scope.row.editFlag || scope.row.addFlag === 'true'" />
        <span v-else>{{ scope.row.unit }}</span>
      </template>
      <template #projectTargetValue="scope">
        <el-input v-if="route.name === 'target' && Data.projectType !== '产品开发类项目'" v-model="scope.row.projectTargetValue" placeholder="请输入"></el-input>
        <span v-else>{{ scope.row.projectTargetValue }}</span>
      </template>
      <template #remark="scope">
        <el-input v-model="scope.row.remark" placeholder="请输入" v-if="scope.row.editFlag || scope.row.queryFlag" />
        <span v-else>{{ scope.row.remark }}</span>
      </template>
    </newPiTable>
  </div>
  <!-- 插入指标模板 -->
  <el-dialog v-model="Data.dialogVisible" title="插入指标模板" width="60%" class="uploadFileName">
    <el-form :model="Data.form" label-width="100px" ref="formEl">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="产品类别:">
            <el-select v-model="Data.form.projectType" placeholder="" style="width: 100%" disabled>
              <el-option v-for="item in props.productCategoryList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="指标类别:">
            <el-input v-model="Data.form.indicatorType" placeholder="请输入" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="指标小类:">
            <el-input v-model="Data.form.indicatorSmallType" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="指标名称:">
            <el-input v-model="Data.form.indicatorName" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn-dialog">
      <el-button type="primary" @click="handleSearch">{{ $intl('search').d('搜索') }}</el-button>
      <el-button type="" @click="handleReset">{{ $intl('reset').d('重置') }}</el-button>
    </div>
    <newPiTable
      :columns="Data.templateColunms"
      :data="Data.templateTableData"
      :selectable="true"
      @selectionChange="selectionChange"
      rowKey="targetTemplateOid"
      :tableHeight="400"
      :pagination="false"
      :isShowSetting="false"
      :tableLoad="Data.targetTableLoad"
    ></newPiTable>
    <template #footer>
      <el-button @click="Data.dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { costColums, maunInfomCostColums } from '../tableColunms';
const route = useRoute();
const api = window.$api;
const props = defineProps({
  // 是否为变更模块
  isChange: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  costColumns: {
    type: Array,
    default: () => costColums,
  },
  // 数据
  tableDataCost: {
    type: Array,
    default: () => [],
  },
});
const Data = reactive({
  projectType: '',
  tableLoad: false,
  tableData: [],
  oid: '',
  colunms: props.costColumns,
  dialogVisible: false,
  templateTableData: [],
  templateColunms: [
    {
      title: '名称',
      dataIndex: 'indicatorName',
    },
    {
      title: '指标类型',
      dataIndex: 'indicatorType',
    },
    {
      title: '计量单位',
      dataIndex: 'unit',
    },
    {
      title: '验收阶段',
      dataIndex: 'acceptancePhase',
    },
    {
      title: '指标小类',
      dataIndex: 'indicatorSmallType',
    },
  ],
  form: {
    projectType: '',
    indicatorType: '成本指标',
    indicatorSmallType: '',
    indicatorName: '',
  },
  technologyData: [],
  selectTableData: [],
  relevance: false, // 关联标识
  indicator: true, // 目标/指标标识
});
watch(
  () => props.tableDataCost,
  (val) => {
    Data.tableData = val;
  },
);
const handleQuearyData = () => {
  Data.tableLoad = true;
  api.targetApi.queryTargetIndicators({ oid: Data.oid, targetIndicatorsType: '成本指标' }).then((res) => {
    if (res.success) {
      Data.tableData = res.data;
      Data.tableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
};
const setColumn = () => {
  const slotList = Data.colunms.map((item) => item.dataIndex).filter((v) => v && v.trim());
  return slotList;
};
// 添加
const handleAdd = () => {
  const slotList = setColumn();
  const obj = {};
  for (const i in slotList) {
    obj[slotList[i]] = '';
  }
  if (props.isChange) {
    obj.isAdd = true;
    obj.afterChangeEdit = true;
    obj.targetCanChange = '是';
    obj.isCanChange = '是';
  }
  obj.editFlag = true;
  obj.addFlag = 'true';
  obj.indicatorType = '成本指标';
  Data.tableData.length <= 7 ? Data.tableData.unshift(obj) : window.$message.warning('最多只能添加8条');
  window.$message.success('添加成功');
  Data.relevance = false;
};
// 移除
const handleDelete = () => {
  if (Data.technologyData.length === 0) return window.$message.warning('请选择需要删除的数据');
  if (props.isChange) {
    Data.technologyData.forEach((it) => {
      if (it.targetIndicatorOid) {
        Data.tableData = Data.tableData.map((item) => {
          if (item.targetIndicatorOid === it.targetIndicatorOid) {
            item.isDelete = true;
            item.afterChangeEdit = false;
          }
          return item;
        });
      } else if (it.targetTemplateOid) {
        Data.tableData = Data.tableData.filter((e) => e.targetTemplateOid !== it.targetTemplateOid);
      } else {
        Data.tableData = Data.tableData.filter((e) => e.index !== it.index);
      }
    });
  } else {
    let targetTemplateOids = [];
    let jsonString = JSON.stringify(Data.technologyData);
    let array = JSON.parse(jsonString);
    targetTemplateOids = array.map((obj) => obj.targetIndicatorOid).join(',');
    let params = {
      oid: Data.oid,
      targetIndicatorsType: '成本指标',
      oids: targetTemplateOids,
    };
    // 已保存的数据;
    if (Data.indicator) {
      api.targetApi.deleteTargetObjs(params).then((res) => {
        if (res.success) {
          Data.deleteFlag = true;
          window.$message.success('删除成功');
          Data.tableData = res.data;
          Data.nestedArray = res.data;
        } else {
          window.$message.error(res.message);
          Data.deleteFlag = false;
        }
      });
    }
    // 插入的数据
    if (Data.templateRelevance) {
      const selectedIds = Data.technologyData.map((row) => row.targetTemplateOid);
      Data.tableData = Data.tableData.filter((row) => !selectedIds.includes(row.targetTemplateOid));
      Data.cloneTemplateData = Data.tableData;
      window.$message.success('删除成功');
    }
  }
};
// 插入指标模板
const handleInsert = () => {
  Data.dialogVisible = true;
  Data.templateTableData = [];
};
// 提交
const handlePresent = () => {
  let hasName = Data.tableData.some((item) => item.indicatorName === '');
  if (hasName) return window.$message.warning('指标名称不能为空');
  let repetition = Data.tableData.some((item, index) => {
    return Data.tableData.slice(index + 1).some((item2) => item.indicatorName === item2.indicatorName);
  });
  if (repetition) return window.$message.warning('指标名称不能重复');
  Data.tableLoad = true;
  let jsonString = JSON.stringify(Data.tableData);
  let array = JSON.parse(jsonString);
  array.map((obj) => {
    obj.editFlag = false;
  });
  let params = {
    oid: Data.oid,
    indicatorType: '成本指标',
    targetIndicatorsInfos: JSON.stringify(array),
  };
  api.targetApi.saveTargetIndicators(params).then((res) => {
    if (res.success) {
      window.$message.success('保存成功');
      handleQuearyData();
      Data.tableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
};
// 重置
const handleReset = () => {
  Data.form.indicatorSmallType = '';
  Data.form.indicatorName = '';
};
//  搜索
const handleSearch = () => {
  Data.targetTableLoad = true;
  let params = {
    oid: Data.oid,
    projectType: Data.form.projectType,
    indicatorType: Data.form.indicatorType,
    indicatorSmallType: Data.form.indicatorSmallType,
    indicatorName: Data.form.indicatorName,
  };
  api.targetApi.searchTargetTemplates(params).then((res) => {
    if (res.success) {
      Data.templateTableData = res.data;
      let str = JSON.stringify(Data.templateTableData);
      let newArr = JSON.parse(str);
      Data.templateTableData = newArr.map((item) => {
        item.projectTargetValue = '';
        item.remark = '';
        return item;
      });
      Data.targetTableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.targetTableLoad = false;
    }
  });
};
// 确定
const handleSubmit = () => {
  Data.dialogVisible = false;
  Data.selectTableData.forEach((item) => {
    item.targetCanChange = '是';
    item.isAdd = true;
    Data.tableData.push(item);
  });
  Data.tableData.filter((item) => (item.targetIndicatorOid ? (Data.templateRelevance = true) : (Data.templateRelevance = false)));
  window.$message.success('添加成功');
  Data.templateRelevance = true;
  Data.indicator = false;
  Data.selectTableData = [];
};
// 成本指标复选框
const technologySelectChange = (val) => {
  Data.technologyData = val;
};
// 复选框选择
const selectionChange = (val) => {
  Data.selectTableData = val;
  Data.selectTableData.map((item) => {
    item.queryFlag = true;
  });
};
onMounted(() => {
  Data.indicator = true;
  Data.relevance = false;
  Data.projectType = JSON.parse(sessionStorage.getItem('currentProject')).type;
  Data.oid = JSON.parse(sessionStorage.getItem('currentProject')).oid;
  Data.colunms = Data.projectType === '产品开发类项目' ? costColums : maunInfomCostColums;
  handleQuearyData();
});
</script>

<style lang="less" scoped>
.btn {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.btn-dialog {
  text-align: right;
  margin: 10px 0;
}
.prototype {
  font-size: 14px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  color: #f02323;
}
</style>
