<template>
  <div class="fileApprove" v-loading="Data.processLoading">
    <div class="content" :class="isCompleted ? 'create_content' : !workitemOid ? 'create_content' : 'pocess_content'">
      <!-- 创建流程 -->
      <div class="hand_box" v-if="workitemOid" :style="{ width: 'calc(100% - ' + handBoxWidth + 'px)' }">
        <div class="topTitle">
          <!--v-if="!workitemOid"-->
          <el-select v-model="Data.dropDefaultValue" class="m-2" default="操作" style="width: 110px" v-if="!true">
            <el-option
              v-for="item in Data.dropOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click="changeOptions(item.value)"
              :popper-append-to-body="false"
              @visible-change="visibleChange"
              popper-class="hand_select"
            ></el-option>
          </el-select>
          <div class="title">
            <span v-if="workitemOid">{{ '【' + nodeName + '】' }}</span>
            <span v-if="!workitemOid">{{ Data.docType + '-' + Data.docNumber + '-' + Data.docName + ' ' + Data.version }}</span>
            <span v-else>{{ processTitle }}</span>
          </div>
        </div>

        <div class="right_box">
          <el-button type="primary" v-for="(item, index) in handButton" :key="index" @click="handSubmit(item)">{{ item.label }}</el-button>
        </div>
      </div>

      <div class="top_area" :class="workitemOid ? 'process_bot_area' : ''">
        <div class="topTitle" v-if="!workitemOid">
          <!--v-if="!workitemOid"-->
          <el-select v-model="Data.dropDefaultValue" class="m-2" default="操作" style="width: 110px" v-if="!true">
            <el-option
              v-for="item in Data.dropOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click="changeOptions(item.value)"
              :popper-append-to-body="false"
              @visible-change="visibleChange"
              popper-class="hand_select"
            ></el-option>
          </el-select>
          <div class="title">
            <span v-if="workitemOid">{{ '【' + nodeName + '】' }}</span>
            <span v-if="!workitemOid">{{ Data.docType + '-' + Data.docNumber + '-' + Data.docName + ' ' + Data.version }}</span>
            <span v-else>{{ processTitle }}</span>
          </div>
        </div>
        <section class="sectionBox" v-loading="Data.infoLoad">
          <div class="title">
            {{ $intl('baseInfo').d('基本信息') }}
          </div>
          <div class="baseInfoImg">
            <img src="" class="img" />
            <!-- 模块基本信息 -->
            <ModuleDetail class="detail" :detailLayout="Data.formList" :column="3" infoTitle="" v-if="!workitemOid" @clickFun="detailInfoClick"></ModuleDetail>
            <!-- 流程基本信息 -->
            <ProcessDetail class="detail" :detailLayout="Data.processDetailData" :column="3" v-else infoTitle="" @clickFun="detailInfoClick"></ProcessDetail>
          </div>
        </section>
        <!-- tab -->
        <el-tabs v-model="tabValue" @tab-click="handleTabClick">
          <el-tab-pane :label="$intl('Tagged object').d('随签对象')" name="object"></el-tab-pane>
          <el-tab-pane v-if="processName === '重新提交'" :label="$intl('select User').d('流程选人')" name="select_user"></el-tab-pane>
          <el-tab-pane :label="$intl('Process settings').d('流程设置')" name="process"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="bot_area" :class="!workitemOid ? 'create_bot_area' : ''">
        <div class="object" id="object">
          <div class="title title_box">
            <span>{{ $intl('Tagged object').d('随签对象') }}</span>
            <div class="btn_style" v-if="!workitemOid || processName === '重新提交'">
              <!-- <div class="btn_style"> -->
              <el-button type="primary" @click="addObject">{{ $intl('add').d('添加') }}</el-button>
              <el-button @click="removeObject">{{ $intl('remove').d('移除') }}</el-button>
            </div>
          </div>
          <div class="table_box">
            <newPiTable :columns="Data.objectColunms" :data="Data.objectTableData" :selectable="true" @selectionChange="dataSelect" :tableHeight="'auto'">
              <template #docName="scope">
                <el-link type="primary" @click="goDetail(scope.row)" :underline="false">
                  {{ scope.row.docName }}
                </el-link>
              </template>
              <template #contentName="scope">
                <span>{{ scope.row.contentName }}</span>
                <el-tooltip content="预览" placement="top">
                  <el-link type="primary" v-prview="{ id: scope.row.oidOrVid, name: scope.row.docName }" style="margin-left: 10px">
                    <el-icon><View /></el-icon>
                  </el-link>
                </el-tooltip>
              </template>
            </newPiTable>
          </div>
        </div>

        <!-- 重新提交--选人 -->
        <div class="select_user" id="select_user" v-if="processName === '重新提交'">
          <div class="title">
            {{ $intl('Process settings').d('流程选人') }}
          </div>
          <div class="process_hand">
            <SelectUser ref="selectUser" :workitemOid="workitemOid" :parmasObj="parmasObj" v-model:selectUserData="selectUserData"></SelectUser>
          </div>
        </div>
        <!-- 新建提交 -->
        <div class="process" id="process" v-if="!workitemOid">
          <div class="title">
            {{ $intl('Process settings').d('流程设置') }}
          </div>
          <div class="process_hand">
            <SelectUser ref="selectUser" :parmasObj="parmasObj" v-model:selectUserData="selectUserData"></SelectUser>
          </div>
        </div>

        <!-- 流程提交 -->
        <div class="process" id="process" v-else>
          <div class="title">
            {{ $intl('Process settings').d('流程处理') }}
          </div>
          <ProcessRecord :oid="workitemOid"></ProcessRecord>
          <ProcessSubmit
            ref="prcess_submit"
            :oid="workitemOid"
            :processName="processName"
            :processOID="processOid"
            :radioList="radioList"
            :isTask="false"
            :isHandVisible="false"
            v-model:handButton="handButton"
            @processSubmit="submitFun"
          />
        </div>
      </div>
    </div>

    <div class="footer" v-if="!workitemOid">
      <div class="actionRow">
        <el-button @click="goback">
          {{ $intl('cancel').d('取消') }}
        </el-button>
        <el-button @click="onSubmit" type="primary">
          {{ $intl('submit').d('提交') }}
        </el-button>
      </div>
    </div>
    <!-- <el-affix position="bottom" :offset="0" v-else>
      <div class="bottomConfirm" v-if="!isCompleted">
        <ProcessSubmit :oid="workitemOid" :processName="processName" :processOID="processOid" :radioList="radioList" :isTask="false" @processSubmit="submitFun" />
      </div>
    </el-affix> -->
  </div>

  <!-- 添加随签对象弹框 -->
  <addObjectDialog
    :title="'添加随签对象'"
    :moduleType="'file'"
    :isShow="Data.addObjectDialog"
    v-model:close="Data.addObjectDialog"
    @confirm="addObjectDialogConfirm"
  ></addObjectDialog>
</template>

<script setup>
import addObjectDialog from './modules/addObjectDialog.vue';
import { uniqueFunc } from '@/utils/utils';
import { useCommonHandler } from '@/hooks';
import { useMenuStore } from '@/stores/modules/menu';
const menuStore = useMenuStore();
const handBoxWidth = computed(() => {
  return Number(menuStore.leftMenuWidth) + 39.5;
});
//  ref(Number(menuStore.leftMenuWidth) + 39.5);

const Data = reactive({
  processLoading: false,
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
    { label: '发起文档签审', value: 'approve' },
  ],
  // 基本信息
  docName: '',
  docNumber: '',
  docType: '',
  version: '',
  infoLoad: false,
  formList: [],

  // 随签对象
  addObjectDialog: false,
  objectColunms: [
    { title: '名称', dataIndex: 'docName' },
    { title: '内容', dataIndex: 'contentName' },
    { title: '版本', dataIndex: 'version' },
    { title: '状态', dataIndex: 'state' },
    { title: '修改者', dataIndex: 'editor' },
    { title: '修改时间', dataIndex: 'updateTime' },
    { title: '创建人', dataIndex: 'creator' },
    { title: '创建时间', dataIndex: 'createTime' },
  ],
  objectTableData: [],

  // 选人参数

  /**流程 */
  processDetailData: [],
  /**用户 */
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),
});
const api = window.$api;
const route = useRoute();
const router = useRouter();

const processTitle = ref('');

const workitemOid = ref(route.query.workitemOID);
const processOid = ref(route.query.processOID);
const processName = ref(route.query.workItemName);
const fileOid = ref(route.query.oid);
const isCompleted = ref(route.query.isCompleted);

const parmasObj = reactive({
  processTemplate: 'SDLG_DocWF',
  oid: route.query.oid,
});
/**
 * 获取详情数据
 */
onMounted(() => {
  if (workitemOid.value) {
    // 流程接口
    getProcessInfoData();
  } else {
    getDetailData();
  }
  getImg();
});

const getImg = () => {
  api.commonApi.viewDocJpg({ oid: fileOid.value }).then((res) => {
    console.log(res);
  });
};

/**下拉框显示隐藏 */
const visibleChange = (val) => {
  if (!val) {
    Data.dropDefaultValue = '操作';
  }
};
/**操作方法 */
const changeOptions = async (type) => {
  console.log(type);
};
// 详情
const getDetailData = () => {
  Data.infoLoad = true;
  let parmas = {
    serviceKey: 'wt.doc.WTDocument',
    oid: route.query.oid,
    queryHistory: 'false',
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
        let data = window.$formatData(res.data.attrGroups);
        data.forEach((v) => {
          v.items.forEach((m) => {
            if (m.name === 'lifeCycleState') {
              let index = res.data.allLifeStates.findIndex((v) => v === m.displayValue);
              res.data.allLifeStates[index] = '<b>' + res.data.allLifeStates[index] + '</b>';
              m.displayValue = res.data.allLifeStates.join('-'); // stateData.value;
            }
            Data.formList.push(m);
          });
        });
      } else {
        window.$message.error(res.message);
      }
      Data.infoLoad = false;
    })
    .catch((err) => {
      window.$message.error(err);
    });
};
/**tab切换方法 */
const tabValue = ref('object');
const handleTabClick = (tab) => {
  const id = tab.props.name;
  document.querySelector('#' + id).scrollIntoView({
    behavior: 'smooth', // 定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"
  });
};

/**
 * 随签对象
 * @addObject 添加
 * @removeObject
 * @signTableSelect 随签表格选中数据
 */
const addObject = () => {
  Data.addObjectDialog = true;
};
const signTableSelect = ref([]);
const dataSelect = (val) => {
  signTableSelect.value = val;
};
const removeObject = () => {
  window.$ElMessageBox
    .confirm('请确认是否移除选中数据！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      Data.objectTableData = Data.objectTableData.filter((v) => signTableSelect.value.every((e) => e.id !== v.id));
    })
    .catch(() => {});
};
// 弹框确认
const addObjectDialogConfirm = (val) => {
  val.forEach((v) => {
    v.id = v.oidOrVid;
  });
  let arr = JSON.parse(JSON.stringify(val));
  Data.addObjectDialog = false;
  Data.objectTableData = [...Data.objectTableData, ...arr];
  Data.objectTableData = uniqueFunc(Data.objectTableData, 'oidOrVid');
};

/**取消 */
const goback = () => {
  window.$navTagStore.removeTag(route, router, null, true);
  window.$navTagStore.removeCacheTag(route.name);
  history.go(-1);
  // router.push({ name: workitemOid.value ? 'toDoPage' : 'projectFiles' });
};
/**
 * 选人
 */
const selectUserData = ref([]);
const selectUser = ref(null);
/**流程新建提交 */
const onSubmit = () => {
  selectUser.value.validate(async (valid, fields) => {
    if (valid) {
      Data.processLoading = true;
      let objectOids = Data.objectTableData && Data.objectTableData.map((v) => v.id).join(',');
      let parmas = {
        oid: route.query.oid,
        processTemplate: 'SDLG_DocWF',
        processUsers: JSON.stringify(selectUserData.value),
        actualUser: Data.userInfo.username,
        wfconfigOid: 'OR:ext.generic.workflow.configuration.model.WFConfiguration:303534',
        processReviewOids: objectOids || '',
      };
      api.commonApi.startWfProcess(parmas).then((res) => {
        if (res.success) {
          window.$message.success('启动成功！');
          goback();
        } else {
          window.$message.error(res.message);
        }
        Data.processLoading = false;
      });
    } else {
      selectUser.value.checkForm(valid, fields);
    }
  });
};

/**操作按钮 */
const handButton = ref([]);
const prcess_submit = ref(null);
const handSubmit = (item) => {
  prcess_submit.value.submitClick(item);
};
/**流程节点提交 */
const submitFun = (val, callback) => {
  Data.processLoading = true;
  let objectOids = Data.objectTableData && Data.objectTableData.map((v) => v.oidOrVid).join(',');
  callback(workitemOid.value ? { processUsers: JSON.stringify(selectUserData.value), custActVar: objectOids } : {});
};

/**获取流程信息 */
const nodeName = ref('');
const radioList = ref([]);
const getProcessInfoData = () => {
  api.processApi.getProcessInfo({ oid: workitemOid.value }).then((res) => {
    if (res.success) {
      // 随签表格数据
      Data.objectTableData = res.data.reviewObjectDetail;
      // 基本信息数据
      processTitle.value = res.data.workItemDetail.filter((e) => e.name === 'pboLink')[0].value;
      Data.processDetailData = res.data.workItemDetail;
      res.data.workItemDetail.forEach((v) => {
        if (v.name === 'activityName') {
          nodeName.value = v.value;
        }
      });
      // 操作路由数据
      // for (let key in res.data.routingDetail) {
      //   radioList.value.push({
      //     routing: key,
      //     label: res.data.routingDetail[key],
      //   });
      // }
    } else {
      window.$message.error(res.message);
    }
  });
};

/**点击详细信息下载 */
const detailInfoClick = (item) => {
  api.fileApi.downloadContent({ oid: workitemOid ? item.fileOid : item.value }).then((res) => {
    useCommonHandler.download(res, workitemOid ? item.value : item.displayValue);
  });
};

/**跳转详情 */
const goDetail = (record) => {
  router.push({ name: 'fileDetail', query: { oid: record.oidOrVid, folderId: '' } });
};
</script>

<style lang="less" scoped>
.fileApprove {
  width: 100%;
  // margin-bottom: 16px;
  // position: relative;
  .content {
    width: 100%;
    overflow-y: scroll;
  }
  .create_content {
    height: calc(100vh - 104px);
  }
  .pocess_content {
    // height: calc(100vh - 328px);
  }
  .hand_box {
    // width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #fff;
    padding-top: 16px;
    position: fixed;
    z-index: 1000;
    margin: 0 8px 0 16px;
    padding-bottom: 12px;
    .topTitle {
      display: inline-block;
      .m-2 {
        margin-right: 20px;
      }
      .title {
        font-size: 20px;
        font-weight: 550;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
      }
    }
    .right_box {
      margin-right: 20px;
    }
    :deep(.el-button) {
      // margin-right: 20px;
    }
  }

  .top_area {
    background: #fff;
    padding: 16px 16px 0 16px;
    border-radius: 2px;
    // margin-bottom: 16px;
    // margin-left: 16px;
    margin: 0 8px 16px 16px;
    // margin-top: 40px;
    .topTitle {
      display: inline-block;
      .m-2 {
        margin-right: 20px;
      }
      .title {
        font-size: 20px;
        font-weight: 550;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
      }
    }
    .sectionBox {
      .title {
        font-size: 16px;
        font-weight: 600;
        height: 24px;
        line-height: 24px;
        margin-bottom: 16px;
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
        }
      }
    }
  }
  .process_bot_area {
    margin-top: 56px;
    padding-top: 0px;
  }
  .bot_area {
    .process,
    .select_user,
    .object {
      background: #ffffff;
      padding: 0 0 16px 0;
      .title {
        height: 60px;
        line-height: 60px;
        font-size: 16px;
        font-family: 'PingFangSC, PingFang SC';
        font-weight: 600;
        color: #333333;
        border-bottom: 1px solid #dddddd;
        margin-bottom: 16px;
        padding: 0 16px;
      }
      .title_box {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .table_box {
        padding: 0 16px;
      }
      .process_hand {
        padding: 0 16px;
      }
      .reSubmit {
        margin: 16px 0;
      }
    }
    .object {
      // margin-bottom: 20px;
      margin: 0 8px 16px 16px;
    }
    .select_user {
      margin: 0 8px 16px 16px;
    }
    .process {
      margin: 0 8px 0 16px;
      :deep(.processRecord) {
        .processList {
          padding: 0 16px;
        }
      }
      :deep(.processSubmit) {
        padding: 0 16px;
      }
    }
  }
  .create_bot_area {
    margin-bottom: 52px;
  }
  :deep(.el-tabs__header) {
    margin-bottom: 0px;
  }

  .footer {
    position: fixed;
    z-index: 10;
    width: 100%;
    left: 0px;
    // bottom: 108px;
    bottom: 0px;
    box-shadow: 0px -1px 5px 0 rgba(0, 0, 0, 0.08);
    .actionRow {
      text-align: right;
      background: #fff;
      // border-top: 1px solid var(--el-border-color-light);
      padding: 16px 20px 16px 0;
    }
  }

  .bottomConfirm {
    width: 100%;
    background: #fff;
    box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.2);
    border-radius: 1px;
    position: absolute;
    bottom: 0;
    padding: 0 16px;
  }
}
</style>
