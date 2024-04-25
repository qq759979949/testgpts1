<template>
  <div>
    <div class="btn">
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
      :isShowSetting="false"
      rowKey="targetTemplateOid"
      :pagination="false"
      ref="projectTable"
      :tableLoad="Data.tableLoad"
      @selectionChange="technologySelectChange"
    >
      <template #formula="scope">
        <el-input v-model="scope.row.formula" placeholder="请输入" v-if="scope.row.editFlag || scope.row.addFlag === 'true'" />
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
      <template #acceptancePhase="scope">
        <el-select v-model="scope.row.acceptancePhase" placeholder="请选择" style="width: 100%" v-if="scope.row.editFlag && route.name !== 'target'">
          <el-option v-for="item in acceptancePhaseList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <span v-else>{{ scope.row.acceptancePhase ? scope.row.acceptancePhase : '-' }}</span>
      </template>
      <template #weight="scope">
        <el-input v-model="scope.row.weight" placeholder="请输入" v-if="scope.row.editFlag || scope.row.addFlag === 'true'" />
        <span v-else>{{ scope.row.weight }}</span>
      </template>
      <template #exCompetitorsTargetVal="scope">
        <el-input v-model="scope.row.exCompetitorsTargetVal" placeholder="请输入" v-if="scope.row.editFlag || scope.row.addFlag === 'true'" />
        <span v-else>{{ scope.row.exCompetitorsTargetVal }}</span>
      </template>
      <template #inCompetitorsTargetVal="scope">
        <el-input v-model="scope.row.inCompetitorsTargetVal" placeholder="请输入" v-if="scope.row.editFlag || scope.row.addFlag === 'true'" />
        <span v-else>{{ scope.row.inCompetitorsTargetVal }}</span>
      </template>
      <template #projectTargetValue="scope">
        <el-input v-model="scope.row.projectTargetValue" placeholder="请输入" v-if="scope.row.editFlag || scope.row.queryFlag" />
        <span v-else>{{ scope.row.projectTargetValue }}</span>
      </template>
      <template #projectTargetValueChange="scope">
        <el-input
          v-model="scope.row.projectTargetValueChange"
          placeholder="请输入"
          v-if="scope.row.targetCanChange === '是' && isEdit && scope.row.afterChangeEdit"
          @change="changeInput(scope.row)"
        >
          <template #prefix v-if="scope.row.isChange">
            <div class="input-triangle"></div>
          </template>
        </el-input>
        <div v-else>
          <div class="noChange" v-if="!scope.row.isChange">{{ scope.row.projectTargetValueChange }}</div>
          <div class="noChange hasChange" v-else>{{ scope.row.projectTargetValueChange }}</div>
        </div>
      </template>
      <template #remark="scope">
        <el-input v-model="scope.row.remark" placeholder="请输入" v-if="scope.row.editFlag || scope.row.queryFlag" />
        <span v-else>{{ scope.row.remark }}</span>
      </template>
      <template #actualValueProvided="scope">
        <el-select v-model="scope.row.actualValueProvided" placeholder="请选择" style="width: 100%" v-if="scope.row.editFlag || scope.row.addFlag === 'true'" multiple>
          <el-option v-for="item in Data.roleList" :key="item.label" :label="item.label" :value="item.label" />
        </el-select>
        <span v-else>{{ scope.row.actualValueProvided }}</span>
      </template>
    </newPiTable>
  </div>
  <!-- 插入指标模板 -->
  <el-dialog v-model="Data.dialogVisible" title="插入指标模板" width="60%" class="uploadFileName">
    <el-form :model="Data.form" label-width="100px" ref="formEl">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="产品类别:">
            <el-select v-model="Data.form.projectType" placeholder="请选择" style="width: 100%" disabled>
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
import { productColunms } from '../tableColunms';
import { pageFind } from '@/api/team';
const formEl = ref();
const api = window.$api;
const route = useRoute();
const props = defineProps({
  // 表格是否可编辑
  isChange: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  otherColumns: {
    type: Array,
    default: () => productColunms,
  },
  // 产品类别
  productCategoryList: {
    type: Array,
    default: () => [],
  },
  // 验收阶段
  acceptancePhaseList: {
    type: Array,
    default: () => [],
  },
  // 数据
  tableDataOther: {
    type: Array,
    default: () => [],
  },
});
const Data = reactive({
  targetTableLoad: false,
  tableLoad: false,
  dialogVisible: false, // 插入指标模板弹框
  tableData: [],
  colunms: props.otherColumns,
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
  templateTableData: [],
  form: {
    projectType: '',
    indicatorType: '其他指标',
    indicatorSmallType: '',
    indicatorName: '',
  },
  // 立项后
  afterTableData: [],
  selectTableData: [],
  technologyData: [],
  oid: '',
  relevance: false, // 关联标识
  indicator: true, // 目标/指标标识
  roleList: [],
  nestedArray: [],
});
// 查询目标指标
const getTargetType = () => {
  Data.tableLoad = true;
  let params = {
    oid: Data.oid,
    targetIndicatorsType: '其他指标',
  };
  api.targetApi.queryTargetIndicators(params).then((res) => {
    if (res.success) {
      Data.tableData = res.data;
      if (res.data.length > 0) {
        let jsonStringify = JSON.stringify(res.data);
        let array = JSON.parse(jsonStringify);
        array.forEach((element) => {
          element.queryFlag = true;
          element.afterChangeEdit = true;
          if (element.addFlag === 'true') {
            element.actualValueProvided = element.actualValueProvided ? element.actualValueProvided.split(',') : '';
          }
        });
        Data.tableData = array;
        Data.nestedArray = Data.tableData;
        Data.tableLoad = false;
      } else {
        Data.tableData = [];
        Data.tableLoad = false;
      }
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
};
// 插入指标模板
const handleInsert = () => {
  Data.dialogVisible = true;
  Data.templateTableData = [];
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
  obj.indicatorType = '其他指标';
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
      targetIndicatorsType: '其他指标',
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
// 更改变更后的目标值
const changeInput = (scope) => {
  scope.isEdit = true;
  scope.isChange = true;
};
// 重置
const handleReset = () => {
  Data.form.projectType = '';
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
// 技术指标复选框
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
// 获取角色
const projectUser = () => {
  pageFind({ pageSize: 10000, pageNo: 1, id: null }).then((res) => {
    if (res.code === 200) {
      Data.roleList = res.data.contents;
      Data.roleList.map((item) => {
        item.label = item.roleName;
        item.value = item.roleCode;
      });
    } else {
      window.$message.error(res.message);
    }
  });
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
    if (Array.isArray(obj.actualValueProvided) && obj.actualValueProvided.length > 0) {
      obj.actualValueProvided = obj.actualValueProvided.join(',');
    }
  });
  let params = {
    oid: Data.oid,
    indicatorType: '其他指标',
    targetIndicatorsInfos: JSON.stringify(array),
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
watch(
  () => props.tableDataOther,
  (val) => {
    Data.tableData = val;
  },
);
onMounted(() => {
  Data.indicator = true;
  Data.relevance = false;
  Data.oid = JSON.parse(sessionStorage.getItem('currentProject')).oid;
  projectUser();
  if (!props.isChange) {
    getTargetType();
  }
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
.text-line {
  text-decoration: line-through;
  text-decoration-color: #333;
  text-decoration-skip-ink: auto;
  text-underline-position: line-through;
}
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
.noChange {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  line-height: 22px;
}
.hasChange {
  color: #f02323;
}
</style>
