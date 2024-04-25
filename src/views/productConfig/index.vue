<template>
  <div class="config page_common bg_css" v-loading="Data.tableLoading">
    <div class="btn_search">
      <div class="btn_box">
        <el-button type="primary" @click="addConfig">{{ $intl('Add configuration').d('新增') }}</el-button>
        <el-button @click="deleteConfig">{{ $intl('Delete Configuration').d('删除') }}</el-button>
        <el-button @click="saveConfig">{{ $intl('Save').d('保存') }}</el-button>
        <el-button @click="importFile">{{ $intl('Import').d('导入') }}</el-button>

        <!-- <el-upload ref="upload" class="upload-demo" action="" :limit="1" :on-change="fileChange" :show-file-list="false" :auto-upload="false">
          <template #trigger>
            <el-button>{{ $intl('Import').d('导入') }}</el-button>
          </template>
        </el-upload> -->
        <el-button @click="exportFile">{{ $intl('Export').d('导出') }}</el-button>
      </div>
      <div class="input_search">
        <el-input v-model="Data.searchValue" style="width: 224px" placeholder="请输入搜索关键词" clearable @keyup.enter="handleSearch">
          <template #suffix>
            <el-icon class="el-input__icon" @click="handleSearch"><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>
    <div class="table_box">
      <NewPiTable
        :rowKey="'configLibraryOid'"
        :columns="Data.configColumns"
        :data="Data.configTableData"
        :tableHeight="'73vh'"
        :selectable="true"
        @selectionChange="selectFun"
        :isShowSetting="false"
        :total="Data.total"
        :pagination="Data.configTableData?.length > 10"
        :isWebPagination="Data.configTableData?.length > 10"
        :page-size="10"
        :isDeep="true"
      >
        <!-- 配置名称 -->
        <template #configName="scoped">
          <span v-if="!scoped.row.isAdd">{{ scoped.row.configName }}</span>
          <div class="hand_style" v-else>
            <!-- <span class="is_reqire">*</span> -->
            <el-input v-model="scoped.row.configName" placeholder="请输入内容" />
          </div>
        </template>
        <!-- 产品类别 -->
        <template #productCategory="scoped">
          <!-- <span v-if="scoped.row.productCategory.length > 0 && !scoped.row.isAdd">{{ scoped.row.productCategory }}</span> -->
          <div class="hand_style">
            <!-- <span class="is_reqire">*</span> -->
            <el-select
              v-model="scoped.row.productCategory"
              @change="valueChnage(scoped.row)"
              clearable
              style="width: 100%"
              :popper-append-to-body="false"
              popper-class="select_class"
              :multiple="true"
            >
              <el-option v-for="item in Data.productCategoryOption" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </div>
        </template>
        <!-- 项目类型 -->
        <template #projectType="scoped">
          <!-- <span v-if="!scoped.row.isAdd">{{ scoped.row.projectType }}</span> -->
          <div class="hand_style">
            <!-- <span class="is_reqire">*</span> -->
            <el-select v-model="scoped.row.projectType" :clearable="true" style="width: 100%" @change="valueChnage(scoped.row)">
              <el-option v-for="item in Data.projectTypeOption" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </div>
        </template>
        <!-- 项目等级 -->
        <template #projectLevel="scoped">
          <!-- <span v-if="!scoped.row.isAdd">{{ scoped.row.projectLevel }}</span> -->
          <el-select v-model="scoped.row.projectLevel" :clearable="true" style="width: 100%" @change="valueChnage(scoped.row)">
            <el-option v-for="item in Data.projectLevelOption" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </template>
        <!-- 填写模式 -->
        <template #writeMode="scoped">
          <!-- <span v-if="!scoped.row.isAdd">{{ scoped.row.writeMode }}</span> -->
          <el-select v-model="scoped.row.writeMode" :clearable="true" style="width: 100%" @change="valueChnage(scoped.row)">
            <el-option v-for="item in Data.writeModeOption" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </template>
        <!-- 是否必须 -->
        <template #required="scoped">
          <!-- <span v-if="!scoped.row.isAdd">{{ scoped.row.required }}</span> -->
          <div class="hand_style">
            <!-- <span class="is_reqire">*</span> -->
            <el-select v-model="scoped.row.required" :clearable="true" @change="valueChnage(scoped.row)" style="width: 100%">
              <el-option key="yes" :label="'是'" :value="'是'" />
              <el-option key="no" :label="'否'" :value="'否'" />
            </el-select>
          </div>
        </template>
        <!-- 枚举值 @blur="enumBlur(scoped.row)"-->
        <template #enumValue="scoped">
          <div v-if="!scoped.row.isAdd">
            <span class="enum_span" @click="enumClick(scoped.row)" v-if="!scoped.row.isBlur">{{ scoped.row.enumValue }}</span>
            <el-input v-else v-model="scoped.row.enumValue" @change="valueChnage(scoped.row)" placeholder="请输入内容" />
          </div>
          <div class="hand_style" v-else>
            <el-input v-model="scoped.row.enumValue" placeholder="请输入内容" />
            <el-tooltip :content="'各枚举值请用逗号隔开'" placement="top">
              <el-icon size="18"><Warning /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <!-- 顺序 -->
        <template #configOrder="scoped">
          <span v-if="!scoped.row.isAdd">{{ scoped.row.configOrder }}</span>
          <div class="hand_style" v-else>
            <span class="is_reqire">*</span>
            <el-input v-model="scoped.row.configOrder" placeholder="请输入内容" />
          </div>
        </template>
        <!-- 说明 -->
        <template #description="scoped">
          <span v-if="!scoped.row.isAdd">{{ scoped.row.description }}</span>
          <el-input v-else v-model="scoped.row.description" placeholder="请输入内容" />
        </template>
      </NewPiTable>
    </div>
  </div>
  <!-- 导入 -->
  <upload-dialog v-model:isShow="Data.importShow" :isSingle="true" title="导入产品配置" @submit="submitImport"></upload-dialog>
</template>

<script setup>
import { uniqueFunc } from '@/utils/utils';
import { useCommonHandler } from '@/hooks';
const Data = reactive({
  /**搜索 */
  searchValue: '',
  /**表格数据 */
  tableLoading: false,
  importShow: false,
  total: 0,
  configColumns: [
    { title: '序号', dataIndex: 'orderIndex', ellipsis: true, isRequire: true, multiple: false, width: 60 },
    { title: '配置名称(必填)', dataIndex: 'configName', ellipsis: true, isRequire: true, multiple: false, width: 200, filters: 'input' },
    { title: '产品类别', dataIndex: 'productCategory', ellipsis: true, required: true, multiple: true, width: 260, filters: 'select', selectList: [] },
    { title: '项目类型', dataIndex: 'projectType', ellipsis: true, required: true, multiple: false, width: 160, filters: 'select' },
    { title: '项目等级', dataIndex: 'projectLevel', ellipsis: true, isRequire: false, multiple: false, width: 100, filters: 'select' },
    { title: '填写模式', dataIndex: 'writeMode', ellipsis: true, isRequire: false, multiple: false, width: 140, filters: 'select' },
    { title: '是否必须', dataIndex: 'required', ellipsis: true, required: true, multiple: false, width: 110, filters: 'select' },
    { title: '枚举值', dataIndex: 'enumValue', ellipsis: true, isRequire: false, multiple: false, filters: 'input' },
    { title: '顺序', dataIndex: 'configOrder', ellipsis: true, isRequire: true, multiple: false, width: 90, filters: 'number' },
    { title: '说明', dataIndex: 'description', ellipsis: true, isRequire: false, multiple: false },
  ],
  configTableData: [],

  // 产品类别
  productCategoryOption: [
    // { key: '装载机', label: '装载机' },
    // { key: '中大挖', label: '中大挖' },
    // { key: '小挖', label: '小挖' },
    // { key: '压路机', label: '压路机' },
    // { key: '平地机', label: '平地机' },
  ],
  //项目类别
  projectTypeOption: [
    { key: '产品开发类项目', label: '产品开发类项目' },
    { key: '信息技术类项目', label: '信息技术类项目' },
    { key: '制造技术类项目', label: '制造技术类项目' },
  ],
  // 项目等级
  projectLevelOption: [
    { key: 'A', label: 'A' },
    { key: 'B', label: 'B' },
    { key: 'C', label: 'C' },
  ],
  // 填写模式
  writeModeOption: [
    // { key: '上传图片', label: '上传图片' },
    { key: '下拉选择', label: '下拉选择' },
    { key: '手工填写', label: '手工填写' },
  ],

  /**用户 */
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),
  defalutTableData: [],
  tableDataCopy: [],
});
const api = window.$api;

/**选择数据 */
const selectData = ref([]);
const selectFun = (val) => {
  selectData.value = val;
};

onMounted(() => {
  initData();
});
watch(
  () => Data.searchValue,
  (val) => {
    if (val === '') {
      Data.configTableData = [...Data.defalutTableData];
    } else {
      handleSearch();
    }
  },
);
const initData = async () => {
  await getPorductType();
  getConfigTableData();
};

// 获取产品类别枚举
const getPorductType = async () => {
  // const { MODE } = import.meta.env;
  const hostname = location.hostname;
  Data.tableLoading = true;
  // 230小写，231大写
  let parmas = {
    enumName: hostname === '192.168.3.230' ? 'productCategory' : 'ProductCategory',
  };
  await api.commonApi.getEnumeratedSetByName(parmas).then((res) => {
    if (res.success) {
      Data.productCategoryOption = res.data.map((v) => {
        v.label = v.display;
        v.key = v.display;
        return v;
      });
      Data.configColumns.forEach((v) => {
        if (v.dataIndex === 'productCategory') {
          // v.selectList = Data.productCategoryOption.map((e) => e.label);
          Data.productCategoryOption.forEach((e) => {
            v.selectList.push(e.label);
          });
        }
      });
    }
  });
};

const enumClick = (val) => {
  val.isBlur = true;
};
// const enumBlur = (val) => {
//   val.isBlur = false;
// };

/**获取表格数据 */
const getConfigTableData = (val) => {
  api.configApi.queryAllConfigLibrary().then((res) => {
    if (res.success) {
      Data.configTableData = res.data.map((el, index) => {
        el.orderIndex = index + 1;
        el.productCategory = el.productCategory.length > 0 && el.productCategory.split(',');
        return el;
      });
      if (Data.configTableData.length > 0) tableOrder.value = Data.configTableData.length + 1;
      if (val === 'isDelete') {
        addData.value.forEach((v, i) => {
          v.orderIndex = tableOrder.value + i;
        });
        Data.configTableData = Data.configTableData.concat(addData.value);
      }
      Data.total = Data.configTableData.length;
      Data.defalutTableData = Data.configTableData;
      Data.tableDataCopy = Data.configTableData;
    } else {
      window.$message.error(res.message);
    }
    Data.tableLoading = false;
  });
};

/**增加配置 */
const tableOrder = ref(null);
const addData = ref([]);
const addConfig = () => {
  if (Data.configTableData.length === 0) tableOrder.value = 1;
  Data.configTableData.unshift({
    // orderIndex: tableOrder.value++,
    configName: '',
    productCategory: '',
    projectType: '',
    projectLevel: '',
    writeMode: '',
    required: '',
    enumValue: '',
    configOrder: '',
    description: '',
    isAdd: true,
  });
  addData.value = Data.configTableData.filter((v) => v.isAdd);
  window.$message.success('新增成功');
};

const editData = ref([]);
const valueChnage = (row) => {
  if (row.isAdd) return;
  editData.value.push(row);
};

// 保存配置
const saveConfig = async () => {
  let isPassed = true;
  let rulesData = Data.configColumns.filter((v) => v.isRequire && v.dataIndex !== 'orderIndex');
  // 新增数据
  if (addData.value.length > 0) {
    let isRules = addData.value.some((e) => rulesData.every((m) => e[m['dataIndex']]));
    if (!isRules) return window.$message.warning('请填写必填内容！');
    // 将数组转化为字符串
    let isMultipleData = Data.configColumns.filter((v) => v.multiple);
    addData.value.forEach((el) => {
      isMultipleData.forEach((m) => {
        el[m.dataIndex] = el[m.dataIndex].join(',');
      });
    });
    Data.tableLoading = true;
    let parmas = {
      actualCreator: Data.userInfo.username,
      creator: Data.userInfo.thirdPartUser,
      formData: JSON.stringify(addData.value),
    };
    await api.configApi.saveConfigLibrary(parmas).then((res) => {
      if (!res.success) {
        window.$message.error(res.message);
        isPassed = false;
        Data.tableLoading = false;
      } else {
        Data.tableLoading = false;
      }
    });
    addData.value = [];
  }

  // 编辑的数据
  let arr = uniqueFunc(editData.value, 'configLibraryOid');
  if (arr.length > 0 && isPassed) {
    let isRules = arr.some((e) => rulesData.every((m) => e[m['dataIndex']]));
    if (!isRules) return window.$message.warning('请填写必填内容！');

    // 将数组转化为字符串
    let isMultipleData = Data.configColumns.filter((v) => v.multiple);
    arr.forEach((el) => {
      isMultipleData.forEach((m) => {
        el[m.dataIndex] = el[m.dataIndex].join(',');
      });
      el.modifier = Data.userInfo.thirdPartUser;
      el.actualModifier = Data.userInfo.username;
    });
    // arr.forEach((el) => {
    //   el.modifier = Data.userInfo.thirdPartUser;
    //   el.actualModifier = Data.userInfo.username;
    // });
    let parmas = {
      formData: JSON.stringify(arr),
    };
    await api.configApi.updateConfigLibraries(parmas).then((res) => {
      if (!res.success) {
        window.$message.error(res.message);
        isPassed = false;
      }
    });
  }
  if (isPassed) {
    window.$message.success('操作成功！');
    getConfigTableData();
  }
};

/**删除配置 */
const deleteConfig = () => {
  if (selectData.value.length === 0) return window.$message.warning('请选择需要删除的数据');
  // 过滤新增的数据
  let deleteAddData = selectData.value.filter((v) => v.isAdd);
  // 过滤线上数据
  let deleteOldData = selectData.value.filter((v) => !v.isAdd);
  let oids = deleteOldData.map((v) => v.configLibraryOid).join(',');
  window.$ElMessageBox
    .confirm('确定要删除勾选的数据？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      // 删除本地新增 --- 仅选择本地新增数据
      if (deleteAddData.length > 0 && !oids) {
        addData.value = addData.value.filter((el) => deleteAddData.every((item) => item.orderIndex !== el.orderIndex));
        getConfigTableData('isDelete');
      }
      // 删除线上数据 --- 仅选择线上数据
      if (oids && deleteAddData.length === 0) {
        api.configApi.deleteConfigLibraries({ oids }).then((res) => {
          if (res.success) {
            getConfigTableData();
            window.$message.success(res.message || '删除成功！');
          } else {
            window.$message.error(res.message);
          }
        });
      }
      // 同时删除本地和线上数据
      if (deleteAddData.length > 0 && oids) {
        api.configApi.deleteConfigLibraries({ oids }).then((res) => {
          if (res.success) {
            addData.value = addData.value.filter((el) => deleteAddData.every((item) => item.orderIndex !== el.orderIndex));
            getConfigTableData('isDelete');
            window.$message.success(res.message || '删除成功！');
          } else {
            window.$message.error(res.message);
          }
        });
      }
    })
    .catch(() => {});
};

/**导入 */
// const fileChange = (files) => {
//   let parmas = new FormData();
//   parmas.append('actualUser', Data.userInfo.username);
//   parmas.append('wcUser', Data.userInfo.thirdPartUser);
//   let fileData = files.raw ? files.raw : files;
//   parmas.append('file', fileData);

//   api.configApi.importConfigLibrary(parmas).then((res) => {
//     if (res.success) {
//       window.$message.success('导入成功！');
//       initData();
//     } else {
//       window.$message.success('导入失败！');
//     }
//   });
// };
// 导入弹框
const importFile = () => {
  Data.importShow = true;
};
// 导入确定
const submitImport = (fileList) => {
  let parmas = new FormData();
  parmas.append('actualUser', Data.userInfo.username);
  parmas.append('wcUser', Data.userInfo.thirdPartUser);
  parmas.append('file', fileList[0].raw);
  api.configApi.importConfigLibrary(parmas).then((res) => {
    if (res.success) {
      window.$message.success('导入成功');
      initData();
      Data.importShow = false;
    } else {
      window.$message.error(res.message);
      Data.importShow = false;
    }
  });
};

/**导出 */
const exportFile = () => {
  api.configApi.exportConfigLibrary().then((res) => {
    useCommonHandler.download(res, '产品配置.xlsx');
  });
};
// 搜索
const handleSearch = () => {
  const searchTerm = Data.searchValue.toLowerCase();
  Data.configTableData = Data.tableDataCopy.filter((row) => {
    return Object.keys(row).some((key) => {
      return String(row[key]).toLowerCase().includes(searchTerm);
    });
  });
};
</script>

<style lang="less" scoped>
.config {
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
    .btn_box {
      display: flex;
      .upload-demo {
        margin: 0 12px;
      }
    }
  }
  :deep(.pi-table) {
    .el-table {
      .el-table__cell {
        .cell {
          .hand_style {
            display: flex;
            align-items: center;
            // padding: 8px 0px;
            .is_reqire {
              margin-right: 2px;
              color: red;
            }
            .el-icon {
              cursor: pointer;
              margin-left: 4px;
            }
          }
          .enum_span {
            display: inline-block;
            width: 100%;
            min-height: 20px;
          }
          .el-input {
            .el-input__wrapper {
              padding: 0 8px;
            }
          }
        }
      }
    }
  }
  .el-input__icon {
    cursor: pointer;
  }
}
</style>
