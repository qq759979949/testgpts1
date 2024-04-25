<template>
  <div>
    <div class="btn" v-if="route.name === 'target' && (Data.projectType === '信息技术类项目' || Data.projectType === '制造技术类项目')">
      <div style="text-align: right">
        <el-button type="primary" @click="handlePresent">{{ $intl('submit').d('保存') }}</el-button>
      </div>
    </div>
    <levelTable :columns="Data.afterColums" :tableData="Data.tableData" :tableLoad="Data.tableLoad" :border="true" :isCheckBox="false" :columnIndex="0" :isAddColumn="true">
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
      <template #projectTargetValue="scope">
        <span v-if="route.name === 'target' && Data.projectType === '产品开发类项目'">{{ scope.row.viewFlag ? scope.row.projectTargetValue : '***' }}</span>
        <span v-else>{{ scope.row.projectTargetValue }}</span>
      </template>
      <template #actuallyValue="scope">
        <el-input v-model="scope.row.actuallyValue" placeholder="请输入" controls-position="right" size="small" />
      </template>
      <template #targetIsCompliance="scope">
        <el-select v-model="scope.row.targetIsCompliance" style="width: 100%">
          <el-option key="yes" :label="'是'" :value="'是'" />
          <el-option key="no" :label="'否'" :value="'否'" />
        </el-select>
      </template>
      <template #targetFileName="scope">
        <el-button @click="targetUploadFlie(scope.row)" v-if="scope.row.targetFileName === '' || scope.row.targetFileName === undefined">
          <i class="iconfont icon-shangchuan" style="margin-right: 5px"></i>
          上传文件
        </el-button>
        <div v-else class="uploadTitle">
          <el-popconfirm title="确定删除?" confirm-button-text="确认" cancel-button-text="取消" placement="right" @confirm="targetDeleteFile(scope.row)">
            <template #reference>
              <span class="upload-icon">
                <el-icon><CloseBold /></el-icon>
              </span>
            </template>
          </el-popconfirm>
          <el-link type="primary" :underline="true" @click="targetUploadFlie(scope.row)">
            <el-tooltip :content="scope.row.targetFileName" placement="top">
              <div class="columnTitle">
                {{ scope.row.targetFileName }}
              </div>
            </el-tooltip>
          </el-link>
        </div>
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
import { set } from 'lodash';
import { getGroupNamesByUserName } from '@/api/team';
const api = window.$api;
const route = useRoute();
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
  // WBS是否通过
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
  checkoutWBS: true,
  projectType: '',
  importShow: false,
  tableLoad: false,
  afterColums: [],
  // 产品开发类
  productTypeColums: [
    {
      label: '指标名称',
      dataIndex: 'indicatorName',
      children: [],
      fixed: true,
      width: route.name === 'target' ? '' : 85,
    },
    {
      label: '指标小类',
      dataIndex: 'indicatorSmallType',
      children: [],
      fixed: true,
      width: route.name === 'target' ? '' : 85,
    },
    {
      label: '单位',
      dataIndex: 'unit',
      children: [],
      fixed: true,
      width: route.name === 'target' ? '' : 55,
    },
    {
      label: '本项目目标值',
      dataIndex: 'projectTargetValue',
      children: [],
      fixed: true,
      width: route.name === 'target' ? '' : 125,
    },
    {
      label: '外部竞品目标值',
      dataIndex: 'exCompetitorsTargetVal',
      children: [],
      width: route.name === 'target' ? '' : 125,
    },
    {
      label: '内部竞品目标值',
      dataIndex: 'inCompetitorsTargetVal',
      children: [],
      width: route.name === 'target' ? '' : 125,
    },
    {
      label: '验收阶段',
      dataIndex: 'acceptancePhase',
      children: [],
      width: route.name === 'target' ? '' : 85,
    },
    {
      label: '实际值提供者',
      dataIndex: 'actualValueProvided',
      children: [],
      width: route.name === 'target' ? '' : 110,
    },
    {
      label: '计算说明',
      dataIndex: 'formula',
      children: [],
      width: route.name === 'target' ? '' : 85,
    },
  ],
  // 其他类开发
  otherTypeColums: [
    {
      label: '指标名称',
      dataIndex: 'indicatorName',
    },
    {
      label: '指标小类',
      dataIndex: 'indicatorSmallType',
    },
    {
      label: '单位',
      dataIndex: 'unit',
    },
    {
      label: '权重',
      dataIndex: 'weight',
    },
    {
      label: '公式',
      dataIndex: 'formula',
    },
    {
      label: '本项目目标值',
      dataIndex: 'projectTargetValue',
    },
    {
      label: '实际值',
      dataIndex: 'actuallyValue',
    },
    {
      label: '是否达标',
      dataIndex: 'targetIsCompliance',
    },
    {
      label: '证明文件',
      dataIndex: 'targetFileName',
    },
    {
      label: '备注',
      dataIndex: 'remark',
    },
  ],
  tableData: [],
  oid: route.query.processOID ? JSON.parse(sessionStorage.getItem('taskProject'))?.oid : JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  rowIndex: '',
  dataFilePath: '',
  upLoadName: '',
  newChildren: [],
  technicalFile: [],
  userName: JSON.parse(window.$Cookies.get('userInfo'))?.username,
  uploadFlieRow: '',
  phaseList: [],
  conutNumber: 0,
  reviewPoint: '',
  phaseName: '',
  phaseNumber: '',
});
// 查询目标指标
const getTargetType = () => {
  Data.projectType === '产品开发类项目' ? (Data.afterColums = Data.productTypeColums) : (Data.afterColums = Data.otherTypeColums);
  Data.tableLoad = true;
  let params = {
    oid: route.name === 'examineReview' ? route.query.projectOid : Data.oid,
    targetIndicatorsType: '成本指标',
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
      route.name !== 'target' ? acceptancePhase() : '';
      if (route.name === 'target') {
        userGroups();
      }
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
          Data.afterColums.splice(4, 0, ...phaseColums);
        } else {
          Data.afterColums.splice(4, 4, ...phaseColums);
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
        if (item.children && item.children.length > 0) {
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
                  if (key.includes(Data.phaseName) && item.acceptancePhase.includes(props.reviewPoint)) {
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
            } else {
              data.roleFlag = false;
            }
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
        sessionStorage.setItem('costData', JSON.stringify(newArr.length > 0 ? newArr.join(',') : ''));
      } else {
        window.$message.error(res.message);
      }
    });
  }
};
// 查询用户组
const userGroups = () => {
  getGroupNamesByUserName({ userName: Data.userName }).then((res) => {
    if (res.code === 200) {
      Data.tableData.map((item) => {
        res.data.forEach((role) => {
          role === '财务管理组' ? (item.viewFlag = true) : (item.viewFlag = false);
        });
      });
    }
  });
};
// 查询
const queryData = () => {
  Data.projectType === '产品开发类项目' ? Data.productTypeColums : Data.otherTypeColums;
  Data.tableLoad = true;
  let params = {
    oid: route.name === 'examineReview' ? route.query.projectOid : Data.oid,
    targetIndicatorsType: '成本指标',
    orderNumbers: '',
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
      Data.tableLoad = false;
    } else {
      window.$message.error(res.message);
      Data.tableLoad = false;
    }
  });
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
      Data.tableData.map((item) => {
        if (item.targetIndicatorOid === row.targetIndicatorOid) {
          for (let key in item) {
            if (key === name) {
              item[key] = '';
            }
          }
        }
      });
      window.$message.success('删除成功');
    } else {
      window.$message.error('删除失败');
    }
  });
};
// 提交
const handlePresent = () => {
  let repetition = Data.tableData.some((item, index) => {
    return Data.tableData.slice(index + 1).some((item2) => item.indicatorName === item2.indicatorName);
  });
  if (repetition) return window.$message.warning('指标名称不能重复');
  Data.tableLoad = true;
  let params = {
    oid: Data.oid,
    indicatorType: '成本指标',
    targetIndicatorsInfos: JSON.stringify(Data.tableData),
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
// 目标指标上传
const targetUploadFlie = (row) => {
  Data.importShow = true;
  Data.uploadFlieRow = row;
};
//
// 上传
const uploadFlie = (row, name, filePath) => {
  Data.importShow = true;
  Data.rowIndex = row.index;
  Data.upLoadName = name;
  Data.dataFilePath = filePath;
};
// 上传确定
const submitImport = (fileList) => {
  if (route.name === 'target') {
    let newParmas = new FormData();
    newParmas.append('oid', Data.uploadFlieRow.targetIndicatorOid);
    newParmas.append('fileName', fileList[0].raw);
    api.targetApi.uploadTargetIndicatorFile(newParmas).then((res) => {
      if (res.success) {
        Data.uploadFlieRow.targetFileName = fileList[0].name;
        Data.tableData.map((item) => {
          if (item.projectOid === Data.uploadFlieRow.projectOid) {
            item = Data.uploadFlieRow;
          }
        });
        Data.importShow = false;
        window.$message.success('上传成功');
        queryData();
      } else {
        Data.importShow = false;
        window.$message.error(res.message);
      }
    });
  } else {
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
  }
  Data.technicalFile.push(fileList);
  Data.importShow = false;
  window.$message.success('上传成功');
};
// 目标/指标删除
// 删除
const targetDeleteFile = (row) => {
  let params = new FormData();
  params.append('fileOid', row.fileOid);
  api.targetApi.deleteTargetIndicatorFile(params).then((res) => {
    if (res.success) {
      window.$message.success('删除成功');
      queryData();
    } else {
      window.$message.error(res.message);
    }
  });
};
onMounted(() => {
  Data.projectType = route.query.projectOid ? JSON.parse(sessionStorage.getItem('taskProject'))?.type : JSON.parse(sessionStorage.getItem('currentProject'))?.type;
  getTargetType();
});
defineExpose({ Data });
</script>

<style lang="less" scoped>
.btn {
  margin-bottom: 10px;
}
.prototype {
  font-size: 14px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  background: rgb(247, 211, 2);
  width: 65px;
  height: 32px;
  line-height: 32px;
  display: inline-block;
  border-radius: 3px;
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
:deep(.el-table) {
  border: 1px solid #000;
}
:deep(.el-table tr td:first-child) {
  border-right: 1px solid #000 !important;
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
:deep(.el-table th.el-table__cell.is-leaf) {
  border-right: 1px solid #000 !important;
}
</style>
