<template>
  <div class="depart" id="main_package">
    <div class="title_box">
      <span class="hand_icon" @click="Data.fold.mainPackage = !Data.fold.mainPackage">{{ Data.fold.mainPackage ? '-' : '+' }}</span>
      <span class="title">主包成员表格</span>
    </div>
    <div class="area-content" v-if="Data.fold.mainPackage">
      <!-- <div v-if="projectType === '产品开发类项目'"> -->
      <div>
        <div class="btnList">
          <el-button v-if="route.name !== 'detailEvaluate' ? saveBtn : false" type="primary" @click="save(3)">保存</el-button>
          <el-button @click="lookData(2)">变更记录</el-button>
        </div>
        <levelTable :columns="Data.mainMemberColumn" :tableData="Data.mainMemberTableData" :border="true">
          <!-- 成员角色 -->
          <template #userName="scope">
            <p v-if="scope.row.userName">{{ scope.row.userName }}</p>
            <p v-if="scope.row.userName">{{ scope.row.userRole ? scope.row.userRole : '用户未加组' }}</p>
          </template>
          <template v-for="(item, index) of Data.templateList" :key="index" #[item]="scope">
            <!-- 是权重，只能填百分比 v-if="scope.row[item].canEdit === true && Data.templateList2.includes(item) && route.name !== 'detailEvaluate'"-->
            <!-- <el-input
              v-if="scope.row[item].canEdit === true && Data.templateList2.includes(item) && route.name !== 'detailEvaluate'"
              v-model.number="scope.row[item].value"
              oninput="if(value > 100) value = 100;value=value.replace(/[^0-9.]/g,'').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
              @change="changeHandler($event, scope, 2)"
              @blur="getBlur"
            >
              <template #prefix>
                <div class="input-triangle" v-if="scope.row[item].isSame === false"></div>
              </template>
            </el-input> -->
            <!-- 不是权重，随便填数字 -->
            <span>
              <el-input
                v-if="scope.row[item].canEdit && Data.templateList3.includes(item) && (route.name !== 'detailEvaluate' ? saveBtn : false) && projectType !== '产品开发类项目'"
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
            </span>
          </template>
        </levelTable>
      </div>
    </div>
  </div>
  <div class="depart" id="sub_package" v-if="projectType === '产品开发类项目'">
    <div class="title_box">
      <span class="hand_icon" @click="Data.fold.subPackage = !Data.fold.subPackage">{{ Data.fold.subPackage ? '-' : '+' }}</span>
      <span class="title">配包成员表格</span>
    </div>
    <div class="area-content" v-if="Data.fold.subPackage">
      <!-- <div v-if="projectType === '产品开发类项目'"> -->
      <div>
        <div class="btnList">
          <el-button v-if="route.name !== 'detailEvaluate' ? saveBtn : false" type="primary" @click="save(5)">保存</el-button>
          <el-button @click="lookData(4)">变更记录</el-button>
        </div>
        <levelTable :columns="Data.packageMemberColumn" :tableData="Data.packageMemberTableData" :border="true">
          <template #depart="scope">
            <span>{{ scope.row?.department.value }}</span>
          </template>
          <template v-for="(item, index) of Data.templateList" :key="index" #[item]="scope">
            <!-- 是权重，只能填百分比 -->
            <!-- <el-input
              v-if="scope.row[item].canEdit === true && Data.templateList2.includes(item) && (route.name !== 'detailEvaluate' ? saveBtn : false)"
              v-model.number="scope.row[item].value"
              oninput="if(value > 100) value = 100;value=value.replace(/[^0-9.]/g,'').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
              @change="changeHandler($event, scope, 4)"
              @blur="getBlur"
            >
              <template #prefix>
                <div class="input-triangle" v-if="scope.row[item].isSame === false"></div>
              </template>
            </el-input> -->
            <!-- 不是权重，随便填数字 -->
            <span>
              <el-input
                v-if="scope.row[item].canEdit && Data.templateList3.includes(item) && route.name !== 'detailEvaluate'"
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
            </span>
          </template>
        </levelTable>
      </div>
    </div>
  </div>

  <!-- 变更 / 替换记录 -->
  <pisx-dialog :title="Data.tableTitle" :width="1000" :isShow="Data.isShowChangeRecord" @close="Data.isShowChangeRecord = false" @submit="Data.isShowChangeRecord = false">
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
          <span v-html="scope.row.changeInfo.replace(/\n/g, '<br/>')"></span>
        </template>
      </PiTable>
    </template>
  </pisx-dialog>
</template>

<script setup>
import { changeRecordColumn } from '@/views/payPacket/tableData';
import levelTable from '@/views/projectInitiation/components/levelTable.vue';
const props = defineProps({
  phaseObjData: {
    type: Object,
    default: () => {},
  },
  detailOid: {
    type: String,
    default: '',
  },
  detailProjectType: {
    type: String,
    default: '',
  },
});
const phaseObj = ref({});
watch(
  () => props.phaseObjData,
  (val) => {
    phaseObj.value = val;
  },
);
const Data = reactive({
  fold: {
    mainPackage: true,
    subPackage: true,
  },

  mainMemberColumn: [], // 主包成员 表头
  mainMemberTableData: [], // 主包成员 表格数据
  mainMemberTableDataCopy: [], // 克隆数据
  packageMemberColumn: [], // 配包成员 表头
  packageMemberTableData: [], //  配包成员 表格数据
  packageMemberTableDataCopy: [], // 克隆数据
  templateList: [], // 成员表格渲染的所有插槽
  templateList2: [], // 每个阶段的权重插槽
  templateList3: [], // 每个阶段的个人打分插槽

  /**变更记录 */
  isShowChangeRecord: false,
  tableTitle: '',
  searchVal: '',
  columns: [],
  tableDatas: [],

  // oid: route.query.projectOid,
});
const route = useRoute();
const oid = ref(route.query.projectOid ? route.query.projectOid : props.detailOid);
const projectType = ref(route.query.projectType ? route.query.projectType : props.detailProjectType);

const saveBtn = computed(() => {
  let visible = true;
  if (route.query.workItemName === '成员打分审核' || route.query.workItemName === '通知') {
    visible = false;
  }
  return visible;
});

const api = window.$api;
onMounted(async () => {
  await _getPhaseNames();
  getMainPackage();
  projectType.value === '产品开发类项目' && getSecondPackage();
});

// 查询阶段名称   配置表头
const phaseNameData = ref([]);
const _getPhaseNames = async () => {
  await api.payPacketApi.getPhaseNames({ oid: oid.value }).then((res) => {
    if (res.success) {
      phaseNameData.value = res.data;
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

        // console.log(Data.templateList3, 397);
        // console.log(Data.templateList, 398);
        // 主包成员 表头
        columnList.mainMemberColumn.push({
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
      Data.mainMemberColumn = columnList.mainMemberColumn;
      Data.packageMemberColumn = columnList.packageMemberColumn;
    }
  });
};
/**拆分数据 */
const getSplitData = (label) => {
  let phaseHearder = label?.substring(0, label.length - 1);
  let phaseIndex = label?.substring(label.length - 1, label.length);
  return { phaseHearder, phaseIndex };
};

/**主包 */
const mainTimer = ref();
let mainCount = ref(0); // 倒计时
const getMainPackage = async () => {
  let res = await api.payPacketApi.queryMemberInfoBuilderData({ oid: oid.value, primary: 1 });
  if (res.success) {
    /**拆分赋值 */
    if (route.name !== 'detailEvaluate') {
      const { phaseIndex } = getSplitData(phaseObj.value?.label);
      phaseNameData.value.forEach((e) => {
        let eLabel = getSplitData(e.label);
        res.data.forEach((v) => {
          if (phaseIndex > eLabel.phaseIndex) {
            v[`${e.label}Score`].canEdit = false;
          } else {
            v[`${e.label}Score`].canEdit = true;
          }
        });
      });
    }

    Data.mainMemberTableData = res.data; // 主包成员表格
    Data.mainMemberTableDataCopy = JSON.parse(JSON.stringify(res.data));
    mainCount.value = 10; //成功时设置count.value = 10;并调用wsGetData 新一轮的倒计时
    // mainUpdate();
  }
};
const mainUpdate = () => {
  mainTimer.value = setInterval(() => {
    if (mainCount.value > 0 && mainCount.value <= 10) {
      mainCount.value--;
    } else if (mainCount.value === 0) {
      getMainPackage();
      clearInterval(mainTimer.value);
      mainTimer.value = null;
    }
  }, 1000);
};

/**配包 */
const secondTimer = ref();
let secondCount = ref(0); // 倒计时
const getSecondPackage = async () => {
  let res = await api.payPacketApi.queryMemberInfoBuilderData({ oid: oid.value, primary: 2 });
  if (res.success) {
    Data.packageMemberTableData = res.data;
    Data.packageMemberTableDataCopy = JSON.parse(JSON.stringify(res.data));
    secondCount.value = 10; //成功时设置count.value = 10;并调用wsGetData 新一轮的倒计时
    secondUpdate();
  }
};
const secondUpdate = () => {
  secondTimer.value = setInterval(() => {
    if (secondCount.value > 0 && secondCount.value <= 10) {
      secondCount.value--;
    } else if (secondCount.value === 0) {
      getSecondPackage();
      clearInterval(secondTimer.value);
      secondTimer.value = null;
    }
  }, 1000);
};
onUnmounted(() => {
  clearInterval(mainTimer.value);
  mainTimer.value = null;
  clearInterval(secondTimer.value);
  secondTimer.value = null;
});

/**保存 */
const save = (type) => {
  switch (type) {
    // case 1:
    //   saveProjectEvaluate(); // 保存 项目评价与主包金额
    //   break;
    // case 2:
    //   saveMainPackageWeight(); // 保存 主包阶段占比、扣减金额与阶段得分
    // break;
    case 3:
      saveMainMemberTable(); // 保存 主包成员表格
      break;
    // case 4:
    //   savePackageDepartWeight(); // 保存 配包各部门权重与金额
    // break;
    case 5:
      packageMemberTable(); // 保存 配包成员表格
      break;
  }
};

// 保存 主包成员表格       √
const saveMainMemberTable = () => {
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
    projectOid: oid.value,
    primary: 1,
    memberInfos: arr,
  };
  api.payPacketApi.saveMemberUserRewards(params).then((res) => {
    if (res.success) {
      window.$message.success('保存成功');
      getMainPackage();
      emit('update:checkHand', true);
    } else {
      window.$message.error(res.message);
    }
  });
};

// 保存 配包成员表格      √
const packageMemberTable = () => {
  let isNull = Data.packageMemberTableData.filter((e) => {
    return e.department === undefined || e.department === '';
  });
  if (isNull.length > 0) return window.$message.warning('必须选择部门');
  let arr = [];
  Data.packageMemberTableData.forEach((e) => {
    let item = {};
    for (var key in e) {
      if (Data.templateList.includes(key)) {
        item[key] = parseFloat(e[key].value);
      } else if (key === 'memberOid' || key === 'department') {
        item[key] = e[key];
      }
    }
    arr.push(item);
  });
  let params = {
    projectOid: oid.value,
    primary: 2,
    memberInfos: arr,
  };
  api.payPacketApi.saveMemberUserRewards(params).then((res) => {
    if (res.success) {
      window.$message.success('保存成功');
      getSecondPackage();
      emit('update:checkHand', true);
    } else {
      window.$message.error(res.message);
    }
  });
};

/**查看变更 */
const lookData = (type) => {
  _queryRewardsChangeRecord(type);
};
// 获取变更记录
const _queryRewardsChangeRecord = (type) => {
  Data.tableTitle = '变更记录';
  Data.isShowChangeRecord = true;
  Data.columns = changeRecordColumn;
  api.payPacketApi.queryRewardsChangeRecord({ oid: oid.value, changeType: type }).then((res) => {
    if (res.success) {
      Data.tableDatas = res.data;
      Data.tableDataCopy = JSON.parse(JSON.stringify(res.data));
    } else {
      window.$message.error(res.message);
    }
  });
};

const onSearch = () => {};

// 失焦，让它必填或者默认转换为0
const getBlur = (e, type) => {
  if (e.target.value == '') {
    e.target.value = 0;
  }
  if (type === '主包' && (projectType.value === '信息技术类项目' || projectType.value === '制造技术类项目')) {
    if (e.target.value > 120) {
      window.$ElMessageBox
        .alert('个人得分不能小于0 或者大于 120', '注意', {
          confirmButtonText: '确定',
          type: 'warning',
        })
        .then(() => {
          e.target.value = 0;
        })
        .catch(() => {
          e.target.value = 0;
        });
    }
  }

  /**校验是否一致 */
  let flag = true;
  if (projectType.value === '产品开发类项目') {
    // 主包
    let mainNewData = JSON.stringify(Data.mainMemberTableData);
    let mainOldData = JSON.stringify(Data.mainMemberTableDataCopy);
    // 配包
    let packageNewData = JSON.stringify(Data.packageMemberTableData);
    let packageOldData = JSON.stringify(Data.packageMemberTableDataCopy);
    flag = mainNewData === mainOldData && packageNewData === packageOldData;
    emit('update:checkHand', flag);
  } else {
    // 主包
    let mainNewData = JSON.stringify(Data.mainMemberTableData);
    let mainOldData = JSON.stringify(Data.mainMemberTableDataCopy);
    flag = mainNewData === mainOldData;
    emit('update:checkHand', flag);
  }
};

const emit = defineEmits(['update:checkHand']);
// 判断修改的数据是否和原始数据一样
const changeHandler = (e, scope, type) => {
  switch (type) {
    case 2:
      Data.mainMemberTableDataCopy.forEach((item, index) => {
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
};
</script>

<style lang="less" scoped>
.depart {
  background: #fff;
  margin-bottom: 10px;
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
  .area-content {
    padding: 10px 15px 15px 15px;
    .base-title {
      font-size: 20px;
      font-family: 'PingFangSC, PingFang SC';
      font-weight: 700;
      color: rgba(0, 0, 0, 0.85);
    }
    .base {
      margin: 15px 0;
    }
    .base-title-left {
      font-size: 14px;
      font-family: 'PingFangSC, PingFang SC';
      font-weight: 400;
      color: #666666;
      display: inline-block;
      margin-right: 25px;
    }
    .score-title-left {
      margin-right: 50px;
      font-size: 14px;
      font-family: 'PingFangSC, PingFang SC';
      font-weight: 400;
      color: #666666;
    }
    .base-item {
      font-size: 14px;
      font-family: 'PingFangSC, PingFang SC';
      font-weight: 400;
      color: #333333;
      margin-bottom: 5px;
    }
    .statement {
      display: flex;
      margin: 15px 0 -10px 0;
    }
    :deep(.el-overlay) {
      .drawerSelf {
        .el-drawer__header {
          margin-bottom: 0;
        }
      }
    }
    :deep(.levelTable) {
      // border: 1px solid #d3d3d3;
      :deep(.el-table) {
        .el-table__header {
          .is-group {
            tr {
              th {
                border-right: 1px solid #d3d3d3;
                border-bottom: 1px solid #d3d3d3;
              }
              &:first-child {
                th {
                  border-bottom: 1px solid #dedede;
                }
              }
            }
          }
        }
        .el-table__inner-wrapper {
          .el-table__body-wrapper {
            .el-scrollbar {
              .el-scrollbar__wrap {
                .el-scrollbar__view {
                  table tbody tr td {
                    border-right: 1px solid #d3d3d3;
                    border-bottom: 1px solid #d3d3d3;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  &:nth-last-child(1) {
    padding: 0 15px;
  }
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
</style>
