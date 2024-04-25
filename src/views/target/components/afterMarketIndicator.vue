<template>
  <div>
    <levelTable
      :columns="Data.afterColums"
      :tableData="Data.tableData"
      :tableLoad="Data.tableLoad"
      :border="true"
      :isCheckBox="false"
      :columnIndex="0"
      :isAddColumn="true"
      class="special-tabel"
    >
      <template #[item.dataIndex]="scope" v-for="(item, index) in Data.newChildren" :key="index">
        <!-- 评审页面可编辑 -->
        <div v-if="props.isEdit">
          <span v-if="item.isCurrentPhase">
            <!-- 实际值 -->
            <span v-if="item.identification === 'ActuallyValue'">
              <span v-if="scope.row.roleFlag && scope.row[Data.phaseName + 'IsEdit']">
                <el-input v-model="scope.row[item.dataIndex]" placeholder="请输入" controls-position="right" size="small" />
              </span>
              <span v-else>{{ scope.row[item.dataIndex] }}</span>
            </span>
            <!-- 是否达标 -->
            <span v-if="item.identification === 'IsCompliance'">
              <span v-if="scope.row.roleFlag && scope.row[Data.phaseName + 'IsEdit']">
                <el-select v-model="scope.row[item.dataIndex]" style="width: 100%">
                  <el-option key="yes" :label="'是'" :value="'是'" />
                  <el-option key="no" :label="'否'" :value="'否'" />
                </el-select>
              </span>
              <span v-if="item.identification === 'IsCompliance'">
                <el-select v-model="scope.row[item.dataIndex]" style="width: 100%" :disabled="true" v-if="scope.row[item.dataIndex] === ''">
                  <el-option key="yes" :label="'是'" :value="'是'" />
                  <el-option key="no" :label="'否'" :value="'否'" />
                </el-select>
                <span v-else :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">{{ scope.row[item.dataIndex] }}</span>
              </span>
              <span v-else :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">{{ scope.row[item.dataIndex] }}</span>
            </span>
            <!-- 证明文件 -->
            <span v-if="item.identification === 'FileName'">
              <span v-if="scope.row.roleFlag && scope.row[Data.phaseName + 'IsEdit']" class="uploadTitle">
                <span v-if="scope.row[item.dataIndex] === '' || scope.row[item.dataIndex] === undefined">
                  <el-button @click="uploadFlie(scope.row, item.dataIndex, item.filePath)">
                    <i class="iconfont icon-shangchuan" style="margin-right: 5px"></i>
                    上传文件
                  </el-button>
                </span>
                <span v-else>
                  <span class="upload-icon" @click="handleDeleteFile(scope.row, item.dataIndex)">
                    <el-icon><CloseBold /></el-icon>
                  </span>
                  <el-link type="primary" :underline="true" @click="uploadFlie(scope.row, item.dataIndex, item.filePath)">
                    <el-tooltip :content="scope.row[item.dataIndex]" placement="top">
                      <div class="columnTitle">
                        {{ scope.row[item.dataIndex] }}
                      </div>
                    </el-tooltip>
                  </el-link>
                </span>
              </span>
              <span v-else>
                <el-link type="primary" :underline="true" @click="handleDown(scope.row, scope.row[item.dataIndex], item.dataIndex)">
                  <el-tooltip :content="scope.row[item.dataIndex]" placement="top">
                    <div class="columnTitle">
                      {{ scope.row[item.dataIndex] }}
                    </div>
                  </el-tooltip>
                </el-link>
                <el-button v-if="scope.row[item.dataIndex] === '' || scope.row[item.dataIndex] === undefined" :disabled="true">
                  <i class="iconfont icon-shangchuan" style="margin-right: 5px"></i>
                  上传文件
                </el-button>
              </span>
            </span>
          </span>
          <span v-else>
            <span v-if="item.identification === 'ActuallyValue'">{{ scope.row[item.dataIndex] }}</span>
            <!-- 是否达标 -->
            <!-- <span v-if="item.identification === 'IsCompliance'" :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">{{ scope.row[item.dataIndex] }}</span> -->
            <span v-if="item.identification === 'IsCompliance'">
              <el-select v-model="scope.row[item.dataIndex]" style="width: 100%" :disabled="true" v-if="scope.row[item.dataIndex] === ''">
                <el-option key="yes" :label="'是'" :value="'是'" />
                <el-option key="no" :label="'否'" :value="'否'" />
              </el-select>
              <span v-else :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">{{ scope.row[item.dataIndex] }}</span>
            </span>
            <!-- 证明文件 -->
            <span v-if="item.identification === 'FileName'">
              <el-button v-if="scope.row[item.dataIndex] === '' || scope.row[item.dataIndex] === undefined" :disabled="true">
                <i class="iconfont icon-shangchuan" style="margin-right: 5px"></i>
                上传文件
              </el-button>
              <el-link type="primary" :underline="true" @click="handleDown(scope.row, scope.row[item.dataIndex], item.dataIndex)">
                <el-tooltip :content="scope.row[item.dataIndex]" placement="top">
                  <div class="columnTitle">
                    {{ scope.row[item.dataIndex] }}
                  </div>
                </el-tooltip>
              </el-link>
            </span>
          </span>
        </div>
        <!-- 其他页面只读 -->
        <div v-else>
          <span v-if="item.identification === 'IsCompliance'" :class="scope.row[item.dataIndex] === '否' ? 'prototype' : ''">{{ scope.row[item.dataIndex] }}</span>
          <el-link v-if="item.identification === 'FileName'" type="primary" :underline="true" @click="handleDown(scope.row, scope.row[item.dataIndex], item.dataIndex)">
            <el-tooltip :content="scope.row[item.dataIndex]" placement="top">
              <div class="columnTitle">
                <span>
                  {{ scope.row[item.dataIndex] }}
                </span>
              </div>
            </el-tooltip>
          </el-link>
          <span v-else-if="item.identification === 'ActuallyValue'">{{ scope.row[item.dataIndex] }}</span>
        </div>
      </template>
      <template #acceptancePhase="scope">
        <el-tooltip :content="scope.row.acceptancePhase" placement="top">
          <div class="columnTitle">
            <span>{{ scope.row.acceptancePhase }}</span>
          </div>
        </el-tooltip>
      </template>
      <template #indicatorName="scope">
        <el-tooltip :content="scope.row.indicatorName" placement="top">
          <div class="columnTitle">
            <span>{{ scope.row.indicatorName }}</span>
          </div>
        </el-tooltip>
      </template>
      <template #actualValueProvided="scope">
        <el-tooltip :content="scope.row.actualValueProvided" placement="top">
          <div class="columnTitle">
            <span>{{ scope.row.actualValueProvided }}</span>
          </div>
        </el-tooltip>
      </template>
    </levelTable>
  </div>
  <!-- 上传文件 -->
  <upload-dialog v-model:isShow="Data.importShow" :isSingle="false" title="上传文件" @submit="submitImport"></upload-dialog>
</template>

<script setup>
import levelTable from '@/views/projectInitiation/components/levelTable.vue';
import { useCommonHandler } from '@/hooks';
const api = window.$api;
const route = useRoute();
import { set } from 'lodash';
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  // 基本信息-技术评审点
  reviewPoint: {
    type: String,
    default: '',
  },
  WBSVerify: {
    type: Boolean,
    default: true,
  },
});
watch(
  () => props.reviewPoint,
  (val) => {
    Data.conutNumber = 1;
    Data.reviewPoint = val;
    getTargetType();
    if (Data.checkoutWBS) {
      getRoleNameData();
    }
  },
);
watch(
  () => props.WBSVerify,
  (val) => {
    Data.checkoutWBS = val;
  },
  {
    deep: true,
  },
);
const Data = reactive({
  importShow: false,
  projectType: '',
  afterColums: [
    {
      label: '指标名称',
      dataIndex: 'indicatorName',
      children: [],
      width: 120,
      fixed: true,
    },
    {
      label: '单位',
      dataIndex: 'unit',
      width: 60,
      children: [],
      fixed: true,
    },
    {
      label: '本项目目标值',
      dataIndex: 'projectTargetValue',
      width: 130,
      children: [],
      fixed: true,
    },
    {
      label: '验收阶段',
      dataIndex: 'acceptancePhase',
      width: 100,
      children: [],
    },
    {
      label: '实际值提供者',
      dataIndex: 'actualValueProvided',
      width: 120,
      children: [],
    },
    {
      label: '内部竞品目标值',
      dataIndex: 'inCompetitorsTargetVal',
      width: 130,
      children: [],
    },
    {
      label: '外部竞品目标值',
      dataIndex: 'exCompetitorsTargetVal',
      width: 130,
      children: [],
    },
    {
      label: '备注',
      dataIndex: 'remark',
      children: [],
    },
    {
      label: '计算说明',
      dataIndex: 'formula',
      children: [],
      width: 90,
    },
  ],
  tableData: [],
  oid: route.query.processOID ? JSON.parse(sessionStorage.getItem('taskProject'))?.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  acceptancePhaseList: [],
  type: '',
  upLoadIndex: '',
  newChildren: [],
  rowIndex: '',
  upLoadName: '',
  dataFilePath: '',
  technicalFile: [],
  phaseList: [],
  reviewPoint: '',
  conutNumber: 0,
  phaseName: '',
  phaseNumber: '',
  checkoutWBS: true,
});
// 查询目标指标
const getTargetType = () => {
  Data.tableLoad = true;
  let params = {
    oid: route.name === 'examineReview' ? route.query.projectOid : Data.oid,
    targetIndicatorsType: '市场指标',
    orderNumbers: '',
    phaseName: props.reviewPoint,
  };
  api.targetApi.queryTargetIndicators(params).then((res) => {
    if (res.success) {
      Data.tableData = res.data;
      Data.tableData.map((item, index) => {
        item.index = index + 1;
        item.phaseInfoList.map((row) => {
          row.index = item.index;
        });
      });
      acceptancePhase();
      Data.tableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
};
// 验收阶段
const acceptancePhase = () => {
  api.payPacketApi.queryReviewPhaseByProjectType({ oid: route.name === 'examineReview' ? route.query.projectOid : Data.oid, phaseName: props.reviewPoint }).then((res) => {
    if (res.success) {
      Data.phaseList = res.data;
      if (Data.checkoutWBS) {
        Data.phaseList.map((item, index) => {
          item.phaseIndex = index + 1;
          if (item.name === props.reviewPoint) {
            // Data.phaseName = item.label;
            Data.phaseName = `phase${item.phaseIndex}`;
          }
        });
        // 评审页面,获取当前技术评审点阶段
        Data.phaseNumber = Data.phaseName ? Data.phaseName.match(/\d+/)[0] : '';
      }
      if (res.data.length > 0) {
        let phaseColums = res.data.map((item, index) => {
          let obj = {
            label: item.name,
            dataIndex: item.label,
            orderIndex: index + 1,
            children: [
              { label: '实际值', dataIndex: '' },
              { label: '是否达标', dataIndex: '' },
              { label: '证明文件', dataIndex: '' },
            ],
          };
          return obj;
        });
        if (Data.conutNumber === 0) {
          Data.afterColums.splice(3, 0, ...phaseColums);
        } else {
          Data.afterColums.splice(3, 4, ...phaseColums);
        }
      }
      Data.tableData.forEach((itm) => {
        if (itm.phaseInfoList.length > 0) {
          itm.phaseInfoList.forEach((ele, index) => {
            Data.afterColums = Data.afterColums.map((item) => {
              if (item.label === ele.phaseKey) {
                item.children.map((chil) => {
                  if (chil.label === '实际值') {
                    chil.dataIndex = `phase${item.orderIndex}ActuallyValue`;
                    chil.ident = `phase${item.orderIndex}-ActuallyValue`;
                  } else if (chil.label === '是否达标') {
                    chil.dataIndex = `phase${item.orderIndex}IsCompliance`;
                    chil.ident = `phase${item.orderIndex}-IsCompliance`;
                  } else if (chil.label === '证明文件') {
                    chil.filePath = `phase${item.orderIndex}FilePath`;
                    chil.identPath = `phase${item.orderIndex}-FilePath`;
                    chil.dataIndex = `phase${item.orderIndex}FileName`;
                    chil.ident = `phase${item.orderIndex}-FileName`;
                  }
                });
              }
              return item;
            });
            if (ele.hasOwnProperty('actuallyValue') || ele.hasOwnProperty('isCompliance') || ele.hasOwnProperty('fileName')) {
              ele[`phase${index + 1}ActuallyValue`] = ele['actuallyValue'];
              ele[`phase${index + 1}IsCompliance`] = ele['isCompliance'];
              ele[`phase${index + 1}FileName`] = ele['fileName'];
            }
          });
        }
      });
      Data.newChildren = [];
      Data.afterColums.forEach((item) => {
        if (item.children.length > 0) {
          item.children.forEach((row) => {
            Data.newChildren.push(row);
          });
        }
      });
      Data.newChildren.map((item) => {
        item.identification = item.ident ? item.ident.split('-')[1] : '';
        if (item.identification === 'FileName') {
          item.width = 150;
        } else if (item.identification === 'ActuallyValue') {
          item.width = 230;
        } else {
          item.width = 90;
        }
        Data.tableData.map((data) => {
          if (item.identification === 'ActuallyValue') {
            set(data, item.dataIndex, '');
          } else if (item.identification === 'IsCompliance') {
            set(data, item.dataIndex, '');
          } else if (item.identification === 'FileName') {
            set(data, item.dataIndex, '');
            set(data, item.filePath, '');
          }
        });
        if (Data.checkoutWBS) {
          // 评审页面,选择技术评审点维护列表对应的阶段
          let dataNumber = item.dataIndex ? item.dataIndex.match(/\d+/)[0] : '';
          item.dataIndex.includes(Data.phaseName) && dataNumber === Data.phaseNumber ? (item.isCurrentPhase = true) : (item.isCurrentPhase = false);
        }
      });
      Data.tableData.map((item) => {
        item.phaseInfoList.forEach((ids) => {
          if (item.index === ids.index) {
            for (let key in item) {
              // 评审页面,选择技术评审点对应的某一条数据
              if (item.hasOwnProperty('acceptancePhase')) {
                if (Data.checkoutWBS) {
                  if (key.includes(Data.phaseName) && item.acceptancePhase.includes(Data.reviewPoint)) {
                    set(item, Data.phaseName + 'IsEdit', true);
                  }
                }
              }
              for (let key1 in ids) {
                if (key === key1) {
                  set(item, key, ids[key1]);
                }
              }
            }
          }
        });
      });
    }
  });
  // if (Data.checkoutWBS) {
  //   getRoleNameData();
  // }
};
// 评审页面,项目经理和项目助理编辑
const getRoleNameData = () => {
  if (route.name === 'createReview' || route.name === 'editReview') {
    let params = {
      projectOid: route.name === 'examineReview' ? route.query.projectOid : Data.oid,
      userName: JSON.parse(window.$Cookies.get('userInfo')).username,
    };
    api.commonApi.getRoleNamesByUserName(params).then((res) => {
      if (res.success) {
        let currentProjectRole = res?.data;
        currentProjectRole.forEach((role) => {
          Data.tableData.map((data) => {
            if (role.includes('项目经理') || role.includes('项目助理')) {
              if (data.actualValueProvided.includes('项目经理') || data.actualValueProvided.includes('项目助理')) {
                data.roleFlag = true;
              } else {
                data.roleFlag = false;
              }
            }
            // else {
            //   data.roleFlag = false;
            // }
          });
        });
        let flowTechnicalData = Data.tableData.filter((item) => {
          if (!item.roleFlag && item.acceptancePhase.includes(Data.reviewPoint)) {
            return item;
          }
        });
        let newArr = flowTechnicalData.map((item) => {
          return item.actualValueProvided;
        });
        sessionStorage.setItem('marketData', JSON.stringify(newArr.length > 0 ? newArr.join(',') : ''));
      } else {
        window.$message.error(res.message);
      }
    });
  }
};
// 上传
const uploadFlie = (row, name, filePath) => {
  Data.importShow = true;
  Data.rowIndex = row.index;
  Data.upLoadName = name;
  Data.dataFilePath = filePath;
};
const submitImport = (fileList) => {
  Data.tableData.map((item) => {
    for (let key in item) {
      if (Data.upLoadName === key && Data.rowIndex === item.index) {
        set(item, Data.upLoadName, fileList[0].name);
      }
      if (Data.dataFilePath === key && Data.rowIndex === item.index) {
        set(item, Data.dataFilePath, fileList[0].raw);
      }
    }
  });
  Data.technicalFile.push(fileList);
  Data.importShow = false;
};
// 删除证明文件
const handleDeleteFile = (row, name) => {
  let downloadOid = '';
  const match = name.match(/\d+/);
  if (match) {
    const number = match[0];
    downloadOid = row.phaseInfoList[number - 1].appDataOid;
  }
  api.targetApi.deleteObject({ oid: downloadOid }).then((res) => {
    if (res.success) {
      window.$message.success('删除成功');
      Data.tableData.map((item) => {
        if (item.targetIndicatorOid === row.targetIndicatorOid) {
          for (let key in item) {
            if (key === name) {
              item[key] = '';
            }
          }
        }
      });
    } else {
      window.$message.error('删除失败');
    }
  });
};
// 下载
const handleDown = (row, upLoadName, name) => {
  let downloadOid = '';
  const match = name.match(/\d+/); // \d+ 匹配一个或多个数字
  if (match) {
    const number = match[0];
    downloadOid = row.phaseInfoList[number - 1].appDataOid;
  }
  api.targetApi.downloadContent({ oid: downloadOid }).then((result) => {
    if (result) {
      if (!result) return window.$message.error('下载失败');
      useCommonHandler.download(result, upLoadName);
    }
  });
};
onMounted(() => {
  getTargetType();
});
defineExpose({ Data });
</script>

<style lang="less" scoped>
.prototype {
  font-size: 14px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
}
.uploadTitle {
  position: relative;
  .upload-icon {
    position: absolute;
    right: -8%;
    cursor: pointer;
    top: 8%;
    color: #386bda;
  }
  .columnTitle {
    max-width: 100px;
    word-wrap: break-word;
  }
}
:deep(.el-input-number.is-controls-right .el-input-number__decrease) {
  height: 15px;
  background: #fff;
}
:deep(.el-input-number.is-controls-right .el-input-number__increase) {
  height: 15px;
  background: #fff;
}
:deep(.el-input--large .el-input__inner) {
  width: 45px;
}
:deep(.el-input__wrapper) {
  height: 30px;
}
:deep(.el-table td.el-table__cell div) {
  width: 100%;
  height: 32px;
  border-radius: 4px;
  border: 0px solid #d9d9d9;
}
.special-tabel {
  :deep(.el-table) {
    border: 1px solid #000;
  }
  :deep(.el-table tr td:first-child) {
    border-right: 1px solid #000;
  }
  :deep(.el-table thead.is-group th.el-table__cell) {
    border-right: 1px solid #000;
    border-color: #000 !important;
  }
  :deep(.el-table--enable-row-transition .el-table__body td.el-table__cell) {
    border-color: #000 !important;
  }
  :deep(.el-table.is-scrolling-none th.el-table-fixed-column--left, .el-table.is-scrolling-none th.el-table-fixed-column--right) {
    border-color: #000;
  }
  :deep(.el-table th.el-table__cell.is-leaf) {
    border-color: #000;
  }
}
</style>
