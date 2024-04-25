<template>
  <el-container class="projectFiles page_common bg_css" v-loading="filesData.tableLoading">
    <el-aside class="asideTree" :style="{ width: filesData.isBack ? '300px' : '40px' }">
      <div class="treeBox">
        <transition-group name="disappear-fade">
          <div class="title" v-if="filesData.isBack">文件结构树</div>
          <div class="tree" v-if="filesData.isBack">
            <el-scrollbar>
              <el-tree
                ref="fileTree"
                :data="filesData.fileTree"
                :props="filesData.defaultProps"
                node-key="oid"
                default-expand-all
                check-strictly
                show-checkbox
                :expand-on-click-node="false"
                :highlight-current="true"
                @node-click="handleNodeClick"
                @check="treeSelect"
              >
                <template #default="{ node }">{{ node.data.name }}</template>
              </el-tree>
            </el-scrollbar>
          </div>
        </transition-group>
      </div>
      <div :class="filesData.isBack ? 'rightIcon' : 'rightIcon backIcon'" @click="isBackRight">
        <el-icon v-if="filesData.isBack"><Back /></el-icon>
        <el-icon v-if="!filesData.isBack"><Right /></el-icon>
      </div>
    </el-aside>
    <el-main>
      <div class="TableBox">
        <div class="title">
          {{ filesData.curFolder.name }}
        </div>
        <div class="actionRow clearfix mb16">
          <div class="btnCol fl">
            <el-button type="primary" @click="downloadFun">{{ $intl('btn.download').d('下载') }}</el-button>
            <el-button :disabled="dropMenuDisabledFun('startApprove') || projectType === '信息技术类项目'" @click="approveFun">
              {{ $intl('startFileApprove').d('启动文档签审') }}
            </el-button>
            <el-button @click="createFileFun">{{ $intl('btn.add').d('新建') }}</el-button>
            <el-button :disabled="dropMenuDisabledFun('delete')" @click="deleteFun">{{ $intl('delete').d('删除') }}</el-button>
            <el-dropdown class="ml12" trigger="click">
              <el-button>
                {{ $intl('btn.more').d('更多') }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="revise" :disabled="dropMenuDisabledFun('revise')" @click="reviseFun(true)">{{ $intl('btn.revise').d('修订') }}</el-dropdown-item>
                  <el-dropdown-item command="edit" :disabled="dropMenuDisabledFun('edit')" @click="editFile">
                    {{ $intl('btn.edit').d('编辑') }}
                  </el-dropdown-item>
                  <el-dropdown-item :disabled="dropMenuDisabledFun('rename')" command="rename" @click="renameFun">
                    {{ $intl('btn.rename').d('重命名') }}
                  </el-dropdown-item>
                  <!-- <el-dropdown-item command="copy" :disabled="dropMenuDisabledFun('copy')">{{ $intl('btn.copy').d('复制') }}</el-dropdown-item>
                  <el-dropdown-item command="paste" :disabled="dropMenuDisabledFun('paste')">{{ $intl('btn.paste').d('粘贴') }}</el-dropdown-item> -->
                  <el-dropdown-item command="remove" @click="moveFun">{{ $intl('btn.remove').d('移动') }}</el-dropdown-item>
                  <el-dropdown-item :disabled="dropMenuDisabledFun('CheckIn')" command="CheckIn" @click="checkFun('CheckIn')">
                    {{ $intl('btn.CheckIn').d('检入') }}
                  </el-dropdown-item>
                  <el-dropdown-item :disabled="dropMenuDisabledFun('CheckOut')" command="CheckOut" @click="checkFun('CheckOut')">
                    {{ $intl('btn.CheckOut').d('检出') }}
                  </el-dropdown-item>
                  <el-dropdown-item :disabled="dropMenuDisabledFun('setStatus')" command="setStatus" @click="setStatusFun">
                    {{ $intl('btn.setStatus').d('设置状态') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="fr">
            <el-input v-model="filesData.searchValue" @change="searchChange" style="width: 224px" placeholder="请输入搜索关键词" clearable>
              <template #suffix>
                <el-icon class="el-input__icon" style="cursor: pointer"><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
        <div class="table">
          <NewPiTable
            :columns="filesData.colunms"
            :data="filesData.tableData"
            :isShowSetting="false"
            :selectable="true"
            :isrightClick="true"
            :pagination="filesData.tableData?.length > 10"
            :isWebPagination="filesData.tableData?.length > 10"
            :page-size="10"
            :tableHeight="'68vh'"
            @selectionChange="changeSelect"
            @rightClick="rightClick"
          >
            <template #name="scope">
              <el-tooltip
                v-if="scope.row.isCheckout"
                :content="'该数据已由' + (filesData.userInfo.username === scope.row.actualLockUser ? '您' : scope.row.actualLockUser) + '检出'"
                placement="top"
              >
                <el-icon style="position: absolute; top: 0; left: 0">
                  <svg><use xlink:href="#icon-checkIn"></use></svg>
                  <!-- <i class="iconfont icon-checkIn"></i> -->
                </el-icon>
              </el-tooltip>

              <el-link type="primary" @click="goDetail(scope.row)">
                {{ scope.row.name }}
              </el-link>
            </template>
            <!-- 状态展示 -->
            <template #state="scope">
              <div class="state-wrapper" type="primary" :style="useCommonHandler.getColor(scope.row.state)">
                {{ scope.row.state }}
              </div>
            </template>
            <template #setting="scope">
              <el-tooltip content="预览" placement="top">
                <el-link type="primary" v-prview="scope.row.oid" style="margin-right: 10px">
                  <el-icon><View /></el-icon>
                </el-link>
              </el-tooltip>
              <el-tooltip content="下载" placement="top">
                <el-link type="primary" @click="downloadFile(scope.row)">
                  <el-icon><Download /></el-icon>
                </el-link>
              </el-tooltip>
            </template>
          </NewPiTable>
        </div>
      </div>
    </el-main>
    <div
      class="context-menu"
      v-click-outside="onClickOutside"
      v-show="filesData.showMenu"
      :style="{
        top: filesData.menuPosition.top,
        left: filesData.menuPosition.left,
      }"
    >
      <el-menu class="el-menu-vertical-demo">
        <template v-for="item in rightMenuData.menuData" :key="item.key">
          <el-menu-item class="menu-row" v-if="!item.isConfirm" :disabled="menuDisabledFun(item.key)" @click="rightClickFun(item.key)">
            <span class="item_span">{{ item.name }}</span>
          </el-menu-item>
          <el-popconfirm
            v-else
            :title="item.confirmTitle"
            :disabled="menuDisabledFun(item.key)"
            confirm-button-text="确认"
            cancel-button-text="取消"
            placement="right"
            @confirm="rightClickFun(item.key)"
          >
            <template #reference>
              <el-menu-item :disabled="menuDisabledFun(item.key)" class="menu-row">
                <span class="item_span">{{ item.name }}</span>
              </el-menu-item>
            </template>
          </el-popconfirm>
        </template>
      </el-menu>
    </div>
    <!-- 新建&编辑弹框 -->
    <createFile
      ref="createDialog"
      :isEdit="filesData.isEdit"
      :fileTree="filesData.fileTree"
      :editData="filesData.selectedData"
      v-model:isShow="filesData.createShow"
      @createSubmit="createSubmit"
    ></createFile>

    <!-- 检入弹框 -->
    <checkIn :isShow="filesData.checkInDialog" :checkInData="checkData" v-model:close="filesData.checkInDialog" @confirm="checkInDialogConfirm"></checkIn>
    <!-- 重命名弹框 -->
    <renameDialog
      :isShow="filesData.renameDialog"
      :renameData="filesData.selectedData[0]"
      v-model:close="filesData.renameDialog"
      :formObj="renameForm"
      @confirm="renameDialogConfirm"
    ></renameDialog>
    <!-- 设置状态弹框 -->
    <setState :isShow="filesData.setStatusVisible" :setStateData="setStateData" v-model:close="filesData.setStatusVisible" @confirm="setStatusDialogConfirm"></setState>
    <!-- 移动弹框 -->
    <moveDialog :isShow="filesData.moveVisible" v-model:close="filesData.moveVisible" :moveData="moveData" :treeData="filesData.fileTree" @confirm="moveDialogConfirm"></moveDialog>
  </el-container>
</template>

<script setup>
import renameDialog from './modules/renameDialog.vue';
import checkIn from './modules/checkIn.vue';
import setState from './modules/setState.vue';
import moveDialog from './modules/moveDialog.vue';
import createFile from './modules/createFile.vue';
import { useCommonHandler, useDetailHandler } from '@/hooks';
import _ from 'lodash';
const router = useRouter();
const api = window.$api;
const filesData = reactive({
  fileTree: [],
  defaultProps: {
    children: 'children',
    label: 'displayName',
  },
  searchValue: '',
  tableLoading: false,
  colunms: [
    {
      title: '文件名称',
      dataIndex: 'name',
    },
    {
      title: '编号',
      dataIndex: 'number',
    },
    {
      title: '状态',
      dataIndex: 'state',
    },
    // {
    //   title: '创建者',
    //   dataIndex: 'actualCreator',
    // },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createStamp',
    // },
    {
      title: '修改者',
      dataIndex: 'actualModifier',
    },
    {
      title: '版本',
      dataIndex: 'version',
    },
    // {
    //   title: '类型',
    //   dataIndex: 'type',
    // },
    {
      title: '上次修改时间',
      dataIndex: 'modifyStamp',
    },
    {
      title: '操作',
      dataIndex: 'setting',
      width: 80,
    },
  ],
  tableData: [],
  page: 1,
  range: 10,
  total: 0,
  selectedData: [],
  projectOid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  curFolder: {},

  isBack: true,
  menuPosition: {
    top: 0,
    left: 0,
  },
  showMenu: false,
  // 创建表数据
  createShow: false,
  /**编辑 */
  isEdit: false,
  // editfileData: [],
  /**检入检出 */
  checkInDialog: false,
  isLoading: false,
  checkDesc: '',
  /**重命名 */
  renameDialog: false,
  /**设置状态 */
  setStatusVisible: false,
  newStatus: '',
  statusOptions: [],
  /**移动参数 */
  moveVisible: false,
  /**用户 */
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),
});

const projectType = ref(JSON.parse(sessionStorage.getItem('currentProject')).type);

// 初始化
const isManage = ref(null);
onBeforeMount(async () => {
  isManage.value = await useDetailHandler.checkUser(filesData.userInfo.username);
});
onMounted(() => {
  getFileTree();
});

// 搜索
const searchTable = ref([]);
const copyData = ref([]);
const searchChange = () => {
  // debugger;/
  let columnData = filesData.colunms.filter((v) => v.dataIndex !== 'setting');
  console.log(copyData.value, 303);
  searchTable.value = [];
  if (filesData.searchValue) {
    copyData.value.forEach((e) => {
      columnData.forEach((v) => {
        let count = 0;
        let nowValue = e[v.dataIndex] && e[v.dataIndex].toString().toLocaleLowerCase();
        let searching = filesData.searchValue.toLocaleLowerCase();
        if (nowValue?.includes(searching)) {
          count++;
        }
        if (count) {
          searchTable.value.push(e);
        }
      });
    });
    filesData.tableData = searchTable.value;
  } else {
    filesData.tableData = copyData.value;
  }
};

// 获取文件树结构
const getFileTree = async () => {
  filesData.tableLoading = true;
  let param = {
    oid: filesData.projectOid,
  };
  await api.fileApi.getFolderTree(param).then((res) => {
    if (!res.success) return window.$message.error(res.message);
    filesData.fileTree = res.data;
    // 处理新建的时候树状数据
    filesData.fileTree.forEach((v) => {
      v.displayName = v.name;
      handCreateTree(v);
    });
    filesData.curFolder = res.data[0];
    fileTree.value.setCheckedKeys([res.data[0].oid]);
    getTableData();
  });
};
const handCreateTree = (item) => {
  if (item.children === 0) return;
  item.children.forEach((e) => {
    e.displayName = item.displayName + '/' + e.name;
    handCreateTree(e);
  });
};
/**左边树状显隐 */
const isBackRight = () => {
  filesData.isBack = !filesData.isBack;
};
/**
 * 树状操作
 */
const fileTree = ref(null);
const handleNodeClick = (record, node) => {
  node.checked = !node.checked;
  filesData.curFolder = record;
  createDialog.value.Data.uploadParam.position = record.oid;
  fileTree.value.setCheckedKeys([record.oid]);
  getTableData();
};
const treeSelect = (checkedNodes) => {
  filesData.curFolder = checkedNodes;
  createDialog.value.Data.uploadParam.position = checkedNodes.oid;
  fileTree.value.setCheckedKeys([checkedNodes.oid]);
  getTableData();
};

/** 获取文档列表数据 */
const getTableData = () => {
  filesData.tableLoading = true;
  filesData.tableData = [];
  filesData.selectedData = [];
  let param = {
    oid: filesData.curFolder.oid,
  };
  api.fileApi
    .getFolderContents(param)
    .then((res) => {
      if (!res.success) return window.$message.error(res.message);
      filesData.tableData = res.data;
      copyData.value = _.cloneDeep(filesData.tableData);
    })
    .finally(() => {
      filesData.tableLoading = false;
    });
};
/**表格选择 */
const changeSelect = (data) => {
  filesData.selectedData = data;
};

/**跳转详情 */
const goDetail = (record) => {
  sessionStorage.setItem('fileDetail', JSON.stringify(record));
  router.push({ name: 'fileDetail', query: { oid: record.oid, folderId: record.typeInner } });
};

/**新建方法 */
const createFileFun = () => {
  filesData.createShow = true;
  filesData.isEdit = false;
};
/**创建确定 */
const createSubmit = (value) => {
  if (projectType.value === '信息技术类项目') {
    window.$message.success(filesData.isEdit ? '编辑成功' : '新建成功');
    filesData.createShow = false;
    getTableData();
  } else {
    window.$ElMessageBox
      .confirm(`文档已经${filesData.isEdit ? '编辑' : '新建'}成功，是否启动文档签审`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        router.push({ name: 'fileApprove', query: { oid: value.data.oidOrVid } });
      })
      .catch(() => {
        window.$message.success(filesData.isEdit ? '编辑成功' : '新建成功');
        filesData.createShow = false;
        getTableData();
      });
  }
};

/** 编辑文件 */
const createDialog = ref(null);
const editFile = async () => {
  filesData.isEdit = true;
  filesData.createShow = true;
  let fileObj = filesData.selectedData[0];
  // 检出
  await api.fileApi.checkoutObj({ oids: fileObj.oid, actualLockUser: filesData.userInfo.username }).then((res) => {
    if (!res?.success) return window.$message.error(res.message);
    // window.$message.success('检出成功！');
  });

  // 获取编辑文件的内容
  let arr = await getContentOidFun(fileObj, 'PRIMARY');
  createDialog.value.Data.editfileData = arr;

  // 将内容回显
  createDialog.value.Data.uploadParam.type = fileObj.type;
  createDialog.value.Data.uploadParam.fileName = fileObj.name;

  // 获取编辑布局
  let params = {
    serviceKey: 'wt.doc.WTDocument',
    oid: filesData.selectedData[0].oid,
  };
  let layoutObj = await window.$commonApisFun.getEditLayoutData(params, 'getFileEditLayout');
  createDialog.value.Data.uploadParam.fileSmalltype = layoutObj.submitData.SmallDocType;
  createDialog.value.handleDataFun(layoutObj); // 文档小类
};

/** 下载 */
const downloadFun = async () => {
  if (!filesData.selectedData.length > 0) return window.$message.error('请选择下载内容');
  if (filesData.selectedData.length === 1) {
    // 单个下载
    // 获取主内容oid
    let fileObj = filesData.selectedData[0];
    let content = await getContentOidFun(fileObj, 'PRIMARY');
    await api.fileApi.downloadContent({ oid: content[0].oid }).then((res) => {
      useCommonHandler.download(res, content[0].name);
    });
  } else {
    let oidsStr = filesData.selectedData.map((v) => v.oid).join(',');
    api.fileApi.downloadDocContents({ oids: oidsStr }).then((res) => {
      useCommonHandler.download(res, '压缩文件.zip');
    });
  }
};
/**获取主内容oid */
const getContentOidFun = async (record, type) => {
  return await api.fileApi.getContentHolderContents({ oid: record.oid, type: type }).then((res) => {
    if (!res?.success) return window.$message.error('下载失败！');
    return res.data;
  });
};
/**表格内部下载 */
const downloadFile = async (record) => {
  // 获取主内容oid
  let content = await getContentOidFun(record, 'PRIMARY');
  await api.fileApi.downloadContent({ oid: content[0].oid }).then((res) => {
    useCommonHandler.download(res, content[0].name);
  });
};

/** 删除 */
const deleteFun = async () => {
  if (!filesData.selectedData.length > 0) return window.$message.error('请选择删除内容');
  let isDelete = isManage.value
    ? filesData.selectedData.filter((e) => e.state !== '正在工作' && e.state !== '重新工作' && e.state !== '已发布' && e.state !== '废止')
    : filesData.selectedData.filter((e) => e.state !== '正在工作' && e.state !== '重新工作');
  if (isDelete.length > 0) return window.$message.warning('请选择正确状态的数据！');
  let deleteData = filesData.selectedData;

  filesData.tableLoading = true;
  await useDetailHandler.delete(deleteData, getTableData);
  filesData.tableLoading = false;
};

/**
 * 检出&检入
 */
const checkData = ref([]);
const checkFun = async (type) => {
  checkData.value = [];
  if (filesData.showMenu) {
    checkData.value.push(rightRowObj.value);
  } else {
    checkData.value = filesData.selectedData;
  }
  if (!checkData.value.length > 0) return window.$message.error('请选择' + type === 'CheckIn' ? '检入' : '检出' + '内容');
  let isDelete = checkData.value.filter((e) => e.state !== '正在工作' && e.state !== '重新工作');
  if (isDelete.length > 0) return window.$message.warning('请选择正确状态的数据！');

  if (type === 'CheckIn') {
    if (checkData.value[0].actualLockUser !== filesData.userInfo.username) return window.$message.warning('此文档由其他人检出，你无权检入！');
    filesData.checkInDialog = true;
  } else if (type === 'CheckOut') {
    filesData.tableLoading = true;
    await useDetailHandler.checkOutFun(checkData.value, getTableData, loadFun);
    filesData.showMenu = false;
  }
};
// 采用函数模式关闭load
const loadFun = () => {
  filesData.tableLoading = false;
};
/**检入弹框确认 */
const checkInDialogConfirm = () => {
  getTableData();
};
/**撤销检出 */
const revokeCheck = (oid) => {
  filesData.tableLoading = true;
  api.fileApi.undoCheckoutObj({ oids: oid }).then((res) => {
    if (res?.success) {
      !filesData.isEdit && getTableData();
    } else {
      window.$message.error(res.message);
    }
    filesData.tableLoading = false;
  });
};

/**重命名 */
const renameForm = ref({});
const renameFun = () => {
  if (!filesData.selectedData.length > 0) return window.$message.error('请选择重命名内容');
  renameForm.value.name = filesData.selectedData[0].name;
  renameForm.value.number = filesData.selectedData[0].number;
  filesData.renameDialog = true;
};
const renameDialogConfirm = () => {
  getTableData();
};

/**
 * 修订
 */
const reviseData = ref([]);
const reviseFun = async (isBox) => {
  if (filesData.showMenu) {
    reviseData.value.push(rightRowObj.value);
  } else {
    if (!filesData.selectedData.length > 0) return window.$message.error('请选择修订内容');
    let isRevise = filesData.selectedData.filter((e) => e.state !== '已发布');
    if (isRevise.length > 0) return window.$message.warning('请选择正确状态的数据！');
    reviseData.value = filesData.selectedData;
  }
  await useDetailHandler.revise(reviseData.value, isBox, getTableData);
  reviseData.value = [];
};

/**
 * 设置状态
 */
const setStateData = ref({});
const setStatusFun = () => {
  if (filesData.showMenu) {
    setStateData.value = { ...rightRowObj.value };
  } else {
    if (!filesData.selectedData.length > 0) return window.$message.error('请选择设置内容');
    setStateData.value = filesData.selectedData[0];
  }
  filesData.setStatusVisible = true;
};
// 设置状态弹框确认
const setStatusDialogConfirm = () => {
  getTableData();
};

/** 启动文档签审 */
const approveFun = () => {
  // api.commonApi.checkStarProcess({ oid: filesData.selectedData[0].oid, processTemplate: 'SDLG_DocWF' }).then((res) => {
  //   if (res.success) {
  useDetailHandler.goApprove(filesData.selectedData[0]);
  //   } else {
  //     window.$message.error(res.message);
  //   }
  // });
};

/**移动 */
const moveData = ref([]);
const moveFun = () => {
  if (filesData.showMenu) {
    moveData.value.push(rightRowObj.value);
  } else {
    if (!filesData.selectedData.length > 0) return window.$message.error('请选择设置内容');
    moveData.value = filesData.selectedData;
  }
  filesData.moveVisible = true;
};
// 移动弹框确认
const moveDialogConfirm = () => {
  getTableData();
};

/**
 * 右键
 */
const rightMenuData = reactive({
  menuData: [
    { key: 'download', name: '下载', isConfirm: false },
    { key: 'startApprove', name: '启动文档签审', isConfirm: false },
    { key: 'delete', name: '删除', isConfirm: true, confirmTitle: '请确认是否删除？' },
    { key: 'revise', name: '修订', isConfirm: true, confirmTitle: '请确认是否修订该数据？' },
    // { key: 'copy', name: '复制', isConfirm: false },
    // { key: 'move', name: '移动', isConfirm: false },
    { key: 'checkIn', name: '检入', isConfirm: false },
    { key: 'checkOut', name: '检出', isConfirm: false },
    // { key: 'checkOut', name: '检出', isConfirm: true, confirmTitle: '请确认是否检出该数据？' },
    { key: 'revokeCheckout', name: '撤销检出', isConfirm: true, confirmTitle: '请确认是否撤销检出？' },
    { key: 'setState', name: '设置状态', isConfirm: false },
    // { key: 'revokeTask', name: '撤销任务', isConfirm: true, confirmTitle: '撤销会一并删除子任务，确认？' },
  ],
});
// 右键选中那一行数据
const rightRowObj = ref({});
const rightClick = (rows, e) => {
  filesData.tableData.forEach((e) => {
    if (e.oid === rows.oid) {
      e.noPassFlag = true;
    } else {
      e.noPassFlag = false;
    }
  });
  rightRowObj.value = { ...rows, displayState: rows.state };
  openMenu(e);
};
const openMenu = (event) => {
  if (event.pageY < 560) {
    filesData.menuPosition.top = event.pageY - event.offsetY + 32 + 'px';
    filesData.menuPosition.left = event.pageX + 'px';
  } else {
    filesData.menuPosition.top = event.pageY - event.offsetY - 292 + 'px';
    filesData.menuPosition.left = event.pageX + 'px';
  }
  filesData.showMenu = true;
  // menuDisabledFun();
};
const onClickOutside = () => {
  filesData.showMenu = false;
};

watch(
  () => filesData.showMenu,
  (val) => {
    !val &&
      filesData.tableData.forEach((e) => {
        e.noPassFlag = false;
      });
  },
);
/**
 * 右键事件
 */
const rightClickFun = (type) => {
  // menuDisabledFun();
  switch (type) {
    case 'download':
      downloadFile(rightRowObj.value);
      break;
    case 'startApprove':
      useDetailHandler.goApprove(rightRowObj.value);
      break;
    case 'delete':
      filesData.tableLoading = true;
      api.fileApi.deleteDocument({ oids: rightRowObj.value.oid }).then((res) => {
        if (!res?.success) return window.$message.error(res.message);
        window.$message.success('删除成功！');
        getTableData();
      });
      break;
    case 'revise':
      reviseFun();
      break;
    case 'copy':
      break;
    case 'move':
      moveFun();
      break;
    case 'checkIn':
      checkFun('CheckIn');
      break;
    case 'checkOut':
      checkFun('CheckOut');
      break;
    case 'revokeCheckout':
      // filesData.tableLoading = true;
      revokeCheck(rightRowObj.value.oid);
      break;
    case 'setState':
      setStatusFun();
      break;
    case 'revokeTask':
      break;

    default:
      break;
  }
};

/**
 * 右键禁用事件
 */
const menuDisabledFun = (type) => {
  return useDetailHandler.actionMenuDisabledFun(type, rightRowObj.value, isManage.value, filesData.userInfo.username, projectType.value === '信息技术类项目');
};

/**
 * 下拉框禁用
 */
const dropMenuDisabledFun = (type) => {
  switch (type) {
    case 'startApprove':
      if (
        filesData.selectedData.length !== 1 ||
        filesData.selectedData[0]?.isCheckout ||
        (filesData.selectedData[0]?.state !== '正在工作' && filesData.selectedData[0]?.state !== '重新工作')
      ) {
        return true;
      }
      break;
    case 'delete':
      // 正在工作和重新工作以外的状态以及检出情况下不能删除 isDelete true不能删除 false能删除
      var isDelete = isManage.value
        ? filesData.selectedData.some((v) => (v.state !== '正在工作' && v.state !== '重新工作' && v.state !== '已发布' && v.state !== '废止') || v.isCheckout)
        : filesData.selectedData.some((v) => (v.state !== '正在工作' && v.state !== '重新工作') || v.isCheckout);
      if (!(filesData.selectedData.length > 0 && !isDelete)) {
        return true;
      }
      break;
    case 'revise':
      var isPermisson = filesData.selectedData.some((e) => e.state !== '已发布');
      if (isPermisson) {
        return true;
      }
      break;
    case 'edit':
      if (
        filesData.selectedData.length !== 1 ||
        filesData.selectedData[0]?.isCheckout ||
        (filesData.selectedData[0]?.state !== '正在工作' && filesData.selectedData[0]?.state !== '重新工作')
      ) {
        return true;
      }
      break;
    case 'rename':
      if (filesData.selectedData.length !== 1 || filesData.selectedData[0]?.isCheckout) {
        return true;
      }
      break;
    case 'copy':
      return true;
      break;
    case 'paste':
      return true;
      break;
    case 'remove':
      break;
    case 'CheckIn':
      var isCheckIn = filesData.selectedData.some((v) => !v.isCheckout);
      if (isCheckIn) {
        return true;
      }
      break;
    case 'CheckOut':
      if (
        filesData.selectedData.length !== 1 ||
        filesData.selectedData[0]?.isCheckout ||
        (filesData.selectedData[0]?.state !== '正在工作' && filesData.selectedData[0]?.state !== '重新工作')
      ) {
        return true;
      }
      break;
    case 'setStatus':
      if (filesData.selectedData.length !== 1 || filesData.selectedData[0]?.isCheckout) {
        return true;
      }
      break;

    default:
      break;
  }
};
</script>

<style scoped lang="scss">
.projectFiles {
  .asideTree {
    display: flex;
    justify-content: space-between;
    transition: width 0.3s ease;
    .rightIcon {
      width: 20px;
      height: 20px;
      color: #999999;
      background: #f8f8f8;
      border-radius: 4px 0px 0px 4px;
      border: 1px solid #eeeeee;
      position: relative;
      left: -19px;
      text-align: center;
      cursor: pointer;
    }
    .backIcon {
      width: 35px;
      height: 20px;
    }
  }
  .treeBox {
    width: 100%;
    height: 100%;
    border-right: 1px solid var(--el-border-color);
    .title {
      font-size: var(--el-font-size-large);
      height: 30px;
      line-height: 30px;
      font-weight: bold;
      color: #333;
      margin-bottom: 6px;
    }
    .tree {
      height: calc(100% - 36px);
      // :deep(.el-tree) {
      //   .is-checked {
      //     background-color: var(--el-color-primary-light-9);
      //   }
      // }
    }
    :deep(.is-current > .el-tree-node__content) {
      color: var(--el-color-primary);
    }
  }
  .TableBox {
    .title {
      font-size: var(--el-font-size-large);
      height: 30px;
      line-height: 30px;
      font-weight: bold;
      color: #333;
      margin-bottom: 6px;
    }
  }
  :deep(.el-main) {
    padding: 0 16px;
  }
  .context-menu {
    position: fixed;
    z-index: 11;
    width: 120px;
    padding: 8px 0;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
    font-size: 13px;
    .menu-row {
      height: 32px;
      margin-top: 2px;
    }
    // .menu-row:hover {
    //   color: var(--el-color-primary);
    //   background-color: var(--el-menu-hover-bg-color);
    // }
    .menu-row:active {
      color: var(--el-color-primary);
      background-color: var(--el-menu-hover-bg-color);
    }
    .menu-row:focus {
      color: var(--el-color-primary);
      background-color: var(--el-menu-hover-bg-color);
    }
    .menu-row:last-child {
      margin-bottom: 0;
    }
    .item_span {
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
