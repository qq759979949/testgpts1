<template>
  <div class="fileDetail" v-loading="Data.detailLoad">
    <div class="top_area">
      <div class="topTitle">
        <el-select
          v-if="route.query.folderId && !isHistoryVision"
          v-model="Data.dropDefaultValue"
          default="操作"
          style="width: 110px; padding-right: 20px"
          @change="changeOptions"
          :popper-append-to-body="false"
          @visible-change="visibleChange"
          popper-class="hand_select"
        >
          <el-option v-for="item in Data.dropOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="handMenuDisabledFun(item.value)"></el-option>
        </el-select>
        <div class="title">
          <span>{{ Data.docType + '-' + Data.docNumber + '-' + Data.docName + ' ' + Data.version }}</span>
          <el-tooltip
            placement="top"
            v-if="Data.isCheckOut"
            :content="'该数据已由' + (Data.userInfo.username === detailArr[0]?.ActualLockUser ? '您' : detailArr[0]?.ActualLockUser) + '检出'"
          >
            <el-icon style="cursor: pointer">
              <svg><use xlink:href="#icon-checkIn-detail"></use></svg>
            </el-icon>
          </el-tooltip>
        </div>
      </div>
      <section class="sectionBox" v-loading="Data.infoLoad">
        <div class="title">
          {{ $intl('baseInfo').d('基本信息') }}
        </div>
        <div class="baseInfoImg">
          <img src="" class="img" />
          <ModuleDetail class="detail" :detailLayout="Data.formList" :column="3" infoTitle="" @clickFun="detailInfoClick"></ModuleDetail>
        </div>
      </section>
      <!-- tab -->
      <el-tabs v-model="tabValue" @tab-click="handleTabClick">
        <el-tab-pane :label="$intl('Process processing').d('流程处理')" name="process"></el-tab-pane>
        <el-tab-pane :label="$intl('Historical Version').d('历史版本')" name="history"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="bot_area">
      <div class="process" id="process">
        <div class="title">
          {{ $intl('Process processing').d('流程处理') }}
        </div>
        <!-- <ProcessRecord :oid="processOid" :pageType="'detail'" :stepList="Data.stepList"></ProcessRecord> -->
        <ProcessRecord :oid="processOid"></ProcessRecord>
      </div>
      <div class="history" id="history">
        <div class="title">
          {{ $intl('Historical Version').d('历史版本') }}
        </div>
        <newPiTable :columns="Data.historyColunms" :data="Data.historyTableData" :tableHeight="'auto'">
          <template #[`versionInfo.identifier.versionId`]="scope">
            <el-link :underline="false" type="primary" @click="goVersion(scope.row)">
              {{ scope.row['versionInfo.identifier.versionId'] }}
            </el-link>
          </template>
        </newPiTable>
      </div>
    </div>
  </div>

  <!-- 编辑弹框 -->
  <createFile ref="editDialog" :isEdit="true" :fileTree="Data.fileTree" :editData="detailArr" v-model:isShow="Data.editShow" @createSubmit="editSubmit"></createFile>
  <!-- 重命名弹框 -->
  <renameDialog :isShow="Data.renameDialog" :renameData="renameForm" v-model:close="Data.renameDialog" :formObj="renameForm" @confirm="renameDialogConfirm"></renameDialog>
  <!-- 检入弹框 -->
  <checkIn :isShow="Data.checkInDialog" :checkInData="detailArr" v-model:close="Data.checkInDialog" @confirm="checkInDialogConfirm"></checkIn>
  <!-- 设置状态弹框 -->
  <setState :isShow="Data.setStatusVisible" :setStateData="detailArr[0]" v-model:close="Data.setStatusVisible" @confirm="setStatusDialogConfirm"></setState>
  <!-- 移动弹框 -->
  <moveDialog :isShow="Data.moveVisible" v-model:close="Data.moveVisible" :moveData="detailArr" :treeData="Data.fileTree" @confirm="moveDialogConfirm"></moveDialog>
</template>

<script setup>
import renameDialog from './modules/renameDialog.vue';
import checkIn from './modules/checkIn.vue';
import createFile from './modules/createFile.vue';
import setState from './modules/setState.vue';
import moveDialog from './modules/moveDialog.vue';
import { useCommonHandler, useDetailHandler } from '@/hooks';

const Data = reactive({
  detailLoad: false,
  // 操作
  dropDefaultValue: '操作',
  dropOptions: [
    { label: '修改', value: 'edit' },
    { label: '修订', value: 'revise' },
    { label: '删除', value: 'delete' },
    { label: '重命名', value: 'rename' },
    { label: '检入', value: 'checkIn' },
    { label: '检出', value: 'checkOut' },
    { label: '设置状态', value: 'setState' },
    { label: '移动', value: 'move' },
    // { label: '复制', value: 'copy' },
    { label: '发起文档签审', value: 'startApprove' },
  ],

  // 基本信息
  isCheckOut: false,
  docName: '',
  docNumber: '',
  docType: '',
  version: '',
  infoLoad: false,
  formList: [],

  // 信息
  // fileRows: JSON.parse(sessionStorage.getItem('fileDetail')) || {},
  // stepList: [],

  // 历史版本
  historyColunms: [
    { title: '版本', dataIndex: 'versionInfo.identifier.versionId' },
    { title: '文件名', dataIndex: 'FILE_NAME' },
    { title: '大小', dataIndex: 'FILE_SIZE' },
    { title: '交付状态', dataIndex: 'state.state' },
    { title: '备注', dataIndex: 'iterationInfo.note' },
    { title: '修改者', dataIndex: 'iterationInfo.modifier' },
    { title: '上次修改时间', dataIndex: 'thePersistInfo.modifyStamp' },
  ],
  historyTableData: [],

  /**编辑 */
  editShow: false,
  // editData: [],

  /**重命名 */
  renameDialog: false,
  /**检入 */
  checkInDialog: false,
  /**设置状态 */
  setStatusVisible: false,
  /**移动 */
  moveVisible: false,
  fileTree: [],

  /**用户 */
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),

  projectOid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
});

const api = window.$api;
const route = useRoute();
const router = useRouter();
const fileOid = ref(route.query.oid);

const isHistoryVision = ref(false);

// 初始化
const isManage = ref(null);
onBeforeMount(async () => {
  isManage.value = await useDetailHandler.checkUser(Data.userInfo.username);
});

onMounted(() => {
  isHistoryVision.value = false;
  getInit();
});
const getInit = () => {
  getFileTree();
  getDetailData(isHistoryVision.value ? 'true' : 'false');
  // 获取流程oid
  getProcessOid();
  // 获取历史记录
  !isHistoryVision.value && getHistoryData();
};

// 获取文件树结构
const getFileTree = async () => {
  let param = {
    oid: Data.projectOid,
  };
  await api.fileApi.getFolderTree(param).then((res) => {
    if (!res.success) return window.$message.error(res.message);
    Data.fileTree = res.data;
    // 处理新建的时候树状数据
    Data.fileTree.forEach((v) => {
      v.displayName = v.name;
      handCreateTree(v);
    });
  });
};
const handCreateTree = (item) => {
  if (item.children === 0) return;
  item.children.forEach((e) => {
    e.displayName = item.displayName + '/' + e.name;
    handCreateTree(e);
  });
};
/**
 * 获取详情数据
 */
const detailArr = ref([]);
const getDetailData = (val) => {
  Data.formList = [];
  detailArr.value = [];
  Data.infoLoad = true;
  let parmas = {
    serviceKey: 'wt.doc.WTDocument',
    oid: fileOid.value,
    queryHistory: val ? val : false,
  };
  api.fileApi
    .getInfoLayout(parmas)
    .then((res) => {
      if (res.success) {
        Data.docName = res.data.docName;
        Data.docNumber = res.data.docNumber;
        Data.docType = res.data.docTypeCN;
        let arr = res.data.displayIdentifier.split(',');
        Data.version = arr[arr.length - 1];
        Data.isCheckOut = res.data.isCheckOut;
        // stateData.value = res.data.allLifeStates.join('-');
        let data = window.$formatData(res.data.attrGroups);
        let fileType = '';
        data.forEach((v) => {
          v.items.forEach((m) => {
            if (m.name === 'lifeCycleState') {
              let index = res.data.allLifeStates.findIndex((v) => v === m.displayValue);
              res.data.allLifeStates[index] = '<b>' + res.data.allLifeStates[index] + '</b>';
              m.displayState = m.displayValue;
              m.displayValue = res.data.allLifeStates.join('-'); // stateData.value;
            }
            Data.formList.push(m);
          });
          fileType = v.objType;
        });
        // 操作详情数据
        let newObj = {};
        Data.formList.forEach((v) => {
          if (v.name === 'lifeCycleState') {
            newObj['state'] = v.displayValue;
            newObj['displayState'] = v.displayState;
          } else {
            newObj[v.name] = v.displayValue;
          }

          if (v.name === 'primaryAttachmentProperties') {
            v.textType = 'link';
          } else {
            v.textType = 'text';
          }
        });

        // // 添加文档主内容
        // let ibaObj = {
        //   label: '文档主内容',
        //   displayValue: res.data.primaryFileName,
        //   textType: 'link',
        // };
        // Data.formList.unshift(ibaObj);

        newObj.isCheckout = Data.isCheckOut;
        newObj.oid = fileOid.value;
        newObj.fileType = fileType;
        newObj.typeInner = route.query.folderId;
        detailArr.value.push(newObj);
      } else {
        window.$message.error(res.message);
      }
      Data.infoLoad = false;
      Data.detailLoad = false;
    })
    .catch((err) => {
      Data.infoLoad = false;
      Data.detailLoad = false;
      window.$message.error(err);
    });
};

const projectType = ref(JSON.parse(sessionStorage.getItem('currentProject')).type);
/**操作权限 */
const handMenuDisabledFun = (type) => {
  return useDetailHandler.actionMenuDisabledFun(type, detailArr.value[0], isManage.value, Data.userInfo.username, projectType.value === '信息技术类项目');
};

/**重命名 */
const renameForm = ref({});
const renameDialogConfirm = () => {
  getDetailData();
};
/**检入 */
const checkInDialogConfirm = () => {
  getDetailData();
};
/**设置状态 */
const setStatusDialogConfirm = () => {
  getDetailData();
};
/**编辑弹框提交 */
const editSubmit = () => {
  window.$message.success('编辑成功');
  Data.editShow = false;
  getDetailData();
};

/**获取主内容oid */
const getContentOidFun = async (record, type) => {
  return await api.fileApi.getContentHolderContents({ oid: record.oid, type: type }).then((res) => {
    if (!res?.success) return window.$message.error('下载失败！');
    return res.data;
  });
};
/**编辑 */
const editDialog = ref(null);
const editFun = async () => {
  Data.editShow = true;

  let fileObj = detailArr.value[0];
  // 检出
  await api.fileApi.checkoutObj({ oids: fileObj.oid, actualLockUser: Data.userInfo.username }).then((res) => {
    if (!res?.success) return window.$message.error(res.message);
    // window.$message.success('检出成功！');
  });

  // 获取编辑文件的内容
  let arr = await getContentOidFun(fileObj, 'PRIMARY');
  editDialog.value.Data.editfileData = arr;

  // 将内容回显
  editDialog.value.Data.uploadParam.type = fileObj.fileType;
  editDialog.value.Data.uploadParam.fileName = Data.docName;
  editDialog.value.Data.uploadParam.fileSmalltype = fileObj.SmallDocType;

  // 获取编辑布局
  let params = {
    serviceKey: 'wt.doc.WTDocument',
    oid: fileObj.oid,
  };
  let layoutObj = await window.$commonApisFun.getEditLayoutData(params, 'getFileEditLayout');
  editDialog.value.handleDataFun(layoutObj); // 文档小类
};

/**下拉框显示隐藏 */
const visibleChange = (val) => {
  if (!val) {
    Data.dropDefaultValue = '操作';
  }
};

/**撤销检出 */
const revokeCheckoutFun = () => {
  Data.detailLoad = true;
  api.fileApi.undoCheckoutObj({ oids: detailArr.value[0].oid }).then((res) => {
    if (res?.success) {
      Data.detailLoad = false;
      getDetailData();
    } else {
      window.$message.error(res.message);
    }
  });
};

/**删除确认和取消后关闭load */
const loadFun = (val) => {
  Data.detailLoad = false;
  if (val !== 'cancel') {
    goback();
  }
};
/**操作方法 */
const changeOptions = async (type) => {
  switch (type) {
    case 'edit':
      editFun();
      break;
    case 'revise':
      await useDetailHandler.revise(detailArr.value, true, getDetailData);
      break;
    case 'delete':
      Data.detailLoad = true;
      await useDetailHandler.delete(detailArr.value, loadFun);
      Data.detailLoad = false;
      break;
    case 'rename':
      renameForm.value.oid = detailArr.value[0].oid;
      renameForm.value.name = Data.docName;
      renameForm.value.number = Data.docNumber;
      Data.renameDialog = true;
      break;
    case 'checkIn':
      Data.checkInDialog = true;
      break;
    case 'checkOut':
      await useDetailHandler.checkOutFun(detailArr.value, getDetailData);
      break;
    case 'revokeCheckout':
      revokeCheckoutFun();
      break;
    case 'setState':
      Data.setStatusVisible = true;
      break;
    case 'move':
      Data.moveVisible = true;
      break;
    case 'copy':
      break;
    case 'startApprove':
      // api.commonApi.checkStarProcess({ oid: detailArr.value[0].oid, processTemplate: 'SDLG_DocWF' }).then((res) => {
      //   if (res.success) {
      useDetailHandler.goApprove(detailArr.value[0]);
      //   } else {
      //     window.$message.error(res.message);
      //   }
      // });

      break;
    default:
      break;
  }
};

/**取消 */
const goback = () => {
  window.$navTagStore.removeTag(route, router);
  window.$navTagStore.removeCacheTag(route.name);
};

/**tab切换方法 */
const tabValue = ref('process');
const handleTabClick = (tab) => {
  const id = tab.props.name;
  document.querySelector('#' + id).scrollIntoView({
    behavior: 'smooth', // 定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"
  });
};

/**获取流程Oid */
const processOid = ref('');
const getProcessOid = () => {
  api.processApi.queryProcessHistory({ oid: fileOid.value, queryAll: false }).then((res) => {
    if (res.success) {
      processOid.value = res.data.length > 0 ? res.data[0].processOid : '';
    }
  });
};

/**获取历史记录 */
const getHistoryData = () => {
  api.commonApi.getObjVersionHistory({ oid: fileOid.value }).then((res) => {
    if (res.success) {
      Data.historyTableData = res.data.rows;
    }
  });
};
/**跳转不同的版本 */
const goVersion = (item) => {
  Data.detailLoad = true;
  isHistoryVision.value = true;
  fileOid.value = item.oid;
  getInit();
};

/**移动 */
const moveDialogConfirm = () => {};

/**点击详细信息下载 */
const detailInfoClick = (item) => {
  api.fileApi.downloadContent({ oid: item.value }).then((res) => {
    useCommonHandler.download(res, item.displayValue);
  });
};
</script>

<style scoped lang="less">
// @import '@/assets/commonCss/common.less';
.fileDetail {
  // margin: 0 16px;
  .top_area {
    background: #fff;
    padding: 20px 20px 0 20px;
    border-radius: 2px;
    margin-bottom: 20px;
  }
  .topTitle {
    display: flex;
    justify-content: flex-start;
    .title {
      font-size: 20px;
      font-weight: 550;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      padding-bottom: 10px;
      // padding-left: 20px;
    }
  }
  .sectionBox {
    .title {
      font-size: 16px;
      font-weight: 600;
      height: 24px;
      line-height: 24px;
      margin: 8px 0 16px 0;
    }
    :deep(.descLabel) {
      display: inline-block;
      width: 98px;
      text-align: right;
    }
    .baseInfoImg {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 20px;
      .img {
        width: 280px;
        height: 160px;
        background: #efefef;
        border: 1px solid #979797;
        margin-right: 50px;
      }
      .detail {
        flex: 1;
        width: calc(100% - 280px);
      }
    }
  }
  :deep(.el-tabs__header) {
    margin-bottom: 0px;
  }

  .bot_area {
    background: #fff;
    // padding: 20px;
    padding: 0 20px 20px 20px;
    margin: 0 20px 20px 20px;
    .process,
    .history {
      .title {
        height: 60px;
        line-height: 60px;
        font-size: 16px;
        font-family: 'PingFangSC, PingFang SC';
        font-weight: 500;
        color: #333333;
        border-bottom: 1px solid #dddddd;
        margin-bottom: 20px;
      }
    }
  }

  :deep(.el-dialog__header) {
    margin-bottom: 0px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f3f6f9;
    margin-right: 0;
  }
}
</style>
