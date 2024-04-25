<!--
 * @Descripttion: 
 * @version: 
 * @Author: luhe
 * @Date: 2023-04-24 14:38:00
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-18 19:17:30
-->
<template>
  <div class="projectList page_common">
    <div class="topStyle">
      <div class="title">项目列表</div>
    </div>
    <div class="searchInput">
      <div class="actionRow mb8">
        <!-- <el-button type="primary" v-for="(item, index) in btnList" :key="index" @click="goHandPage(item.actionName)">{{ $intl(item.actionName).d(item.label) }}</el-button> -->
        <el-button type="primary" @click="goCreate()" v-permission="'/plmProject/cp'">{{ $intl('createProject').d('创建项目') }}</el-button>
        <!-- <el-button type="primary" :disabled="selectRow.length !== 1" @click="goEdit()">{{ $intl('editProject').d('编辑项目') }}</el-button> -->
        <el-button @click="exportListMethod" :loading="loadingExport">导出</el-button>
        <el-button @click="attentionProject" v-if="activeKey !== '我关注的'">关注</el-button>
        <el-button @click="cancelAttentionProject" v-if="activeKey === '我关注的'">取消关注</el-button>
        <el-button @click="setCritical" v-permission="'/plmProject/epthreshold'">设置临界值</el-button>
        <el-button @click="handleIndexLibrary" v-permission="'/plmUnify/Target'">指标库</el-button>
        <el-button @click="configDatabase" v-permission="'/plmUnify/Configuration'">配置库</el-button>
        <el-button type="primary" @click="seeProjectPhase">阶段导航</el-button>
        <!-- <el-button type="primary" @click="goWindowProject">打开新窗口</el-button> -->
      </div>
      <el-input style="width: 200px" placeholder="请输入搜索关键词" v-model="projectName" @change="searchProject" clearable />
    </div>
    <div v-loading="tableLoad">
      <el-tabs v-model="activeKey" class="todo-table-header" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabs" :name="item.type" :label="item.title" :key="item.type">
          <template #label v-if="!item.isDel">
            {{ item.title }}
          </template>
          <template #label v-else>
            <div @contextmenu.prevent.native="openMenu($event, item)">{{ item.title }}</div>
          </template>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <span class="custom-tabs-label" @click="addProjectGroup">
              <el-icon><CirclePlus /></el-icon>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <NewPiTable
        :columns="colunms"
        :data="tableData"
        :all-columns="allColumns"
        :selectable="true"
        @selectionChange="changeSelect"
        rowKey="id"
        :tableLoad="tableLoad"
        :pagination="true"
        :isWebPagination="true"
        :page-size="10"
        :isShowSetting="true"
        :total="total"
        :tableHeight="600"
        tableName="plm_project"
        ref="projectTable"
        :isProjectList="true"
        @updateTableData="updateTableData"
        :pageLabelName="activeKey"
        :optionList="optionList"
        @changeType="changeType"
      >
        <template #projectName="scope">
          <el-link
            style="display: inline-block; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
            type="primary"
            @click="goProject(scope.row)"
            @contextmenu.prevent.native="openMenuProject($event, scope.row)"
            :underline="false"
          >
            {{ scope.row.projectName }}
          </el-link>
        </template>
        <template #healthStatus="scope">
          <div
            class="health-wrapper"
            :style="{
              backgroundColor: getHealthColor(scope.row.healthStatus),
            }"
          ></div>
        </template>
      </NewPiTable>
    </div>
    <div
      class="context-menu"
      v-click-outside="onClickOutside"
      v-show="showMenu"
      :style="{
        top: menuPosition.top,
        left: menuPosition.left,
      }"
    >
      <div class="menu-row" @click="editTab">编辑</div>
      <el-popconfirm title="是否删除自定义页签?" confirm-button-text="确认" cancel-button-text="取消" placement="right" @confirm="onRevoke">
        <template #reference>
          <div class="menu-row">删除</div>
        </template>
      </el-popconfirm>
    </div>
    <div
      class="context-menu1"
      v-click-outside="onClickOutside1"
      v-show="showMenu1"
      :style="{
        top: menuPosition.top,
        left: menuPosition.left,
        zIndex: menuPosition.zIndex,
      }"
    >
      <div class="menu-row" @click="goWindowProject">在新窗口打开页面</div>
    </div>
    <el-dialog v-model="dialogVisible" title="设置临界值" width="30%">
      <div class="tabName">
        项目类型：
        <el-select v-model="projectType" class="m-2" placeholder="请输入" style="width: 260px" @change="handleChange">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="endTime">
        <div class="tabName">
          距离任务目标完成时间
          <el-input-number v-model="greenParam" :min="1" :max="10" controls-position="right" style="width: 70px" @change="changeInput('green')" />
          天前（包含）
        </div>
        <div class="tabName">
          健康状态：
          <el-icon class="greenLight"><Opportunity /></el-icon>
        </div>
      </div>
      <div class="endTime">
        <div class="tabName">
          距离任务目标完成时间
          <el-input-number v-model="yellowStartParam" :min="1" :max="10" controls-position="right" style="width: 70px" disabled />
          天至
          <el-input-number v-model="yellowEndParam" :min="0" :max="10" controls-position="right" style="width: 70px" disabled />
          天
        </div>
        <div class="tabName">
          健康状态：
          <el-icon class="yellowLight"><Opportunity /></el-icon>
        </div>
      </div>
      <div class="endTime">
        <div class="tabName">
          距离任务目标完成时间
          <el-input-number v-model="redParam" :min="0" :max="10" controls-position="right" style="width: 70px" @change="changeInput('red')" />
          天内（包含）
        </div>
        <div class="tabName">
          健康状态：
          <el-icon class="redLight"><Opportunity /></el-icon>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" :loading="isLoadingCritical">取消</el-button>
          <el-button type="primary" @click="createCriticalConfig" :loading="isLoadingCritical">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-drawer title="自定义页签" v-model="isProjectGroup" :size="1300" class="drawerCopyOther" @close="cancelProjectTab">
      <addProjectGroup ref="addTab" :oldTabName="oldTabName"></addProjectGroup>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelProjectTab" :loading="isLoading">取消</el-button>
          <el-button type="primary" @click="addProjectTab" :loading="isLoading">确认</el-button>
        </span>
      </template>
    </el-drawer>
    <el-drawer v-model="drawer" title="查看项目阶段导航" :direction="direction" :before-close="handleClose" :size="1300">
      <!-- <steps :stepList="tableDataPhase[0].mileStoneInfo" :active="tableDataPhase[0].active"></steps> -->
      <NewPiTable
        :columns="colunmsPhase"
        :data="tableDataPhase"
        :selectable="false"
        rowKey="id"
        :tableLoad="phaseTableLoad"
        :pagination="true"
        :isWebPagination="true"
        :page-size="10"
        :total="totalPhase"
        class="phaseTableData"
        height="600"
      >
        <template #projectName="scope">
          <el-link
            style="display: inline-block; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
            type="primary"
            @click="goProject(scope.row, 'phase')"
            @contextmenu.prevent.native="openMenuProject($event, scope.row)"
            :underline="false"
          >
            {{ scope.row.projectName }}
          </el-link>
        </template>
        <template #mileStoneInfo="scope">
          <steps :stepList="scope.row.mileStoneInfo" :active="scope.row.active" :isProject="true"></steps>
        </template>
      </NewPiTable>
    </el-drawer>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, getCurrentInstance, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
// import PiTable from '@/components/pdcCustom/PiTable.vue';
import NewPiTable from '@/components/common/table/newPiTable.vue';
import { getProjectList } from '@/api/project';
import { listSetupColumn } from '@/api/common';
import { userHandDataStore } from '@/stores/modules/handData';
import addProjectGroup from './comp/addProjectGroup.vue';
import steps from '@/components/steps/steps.vue';
import {
  getAllProjectCriticalConfig,
  createProjectCriticalConfig,
  updateProjectCriticalConfig,
  followProject,
  followList,
  exportList,
  createCustomerPageLabel,
  listCustomerPageLabel,
  updateCustomerPageLabel,
  batchDeleteCustomerPageLabel,
  addHistory,
  removeFollowProject,
} from '@/api/project.js';
export default defineComponent({
  components: { NewPiTable, addProjectGroup, steps },
  setup() {
    const api = window.$api;
    const { proxy: that } = getCurrentInstance();
    const router = useRouter();
    // 选择表格数据
    const handDataStore = userHandDataStore();
    const { selectData } = storeToRefs(handDataStore);

    // 公共接口
    // const commonApiStore = useCommonApi();
    // // const { btnMenu } = storeToRefs(commonApiStore)
    // const { getBtnMenus } = commonApiStore;

    const projectData = reactive({
      activeKey: '全部',
      tabs: [
        {
          type: '全部',
          title: '全部',
          isDel: false,
        },
        {
          type: '我参与的',
          title: '我参与的',
          isDel: false,
        },
        {
          type: '我负责的',
          title: '我负责的',
          isDel: false,
        },
        {
          type: '我关注的',
          title: '我关注的',
          isDel: false,
        },
      ],
      btnList: [],
      tableLoad: false,
      tableData: [],
      tableDataCopy: [],
      colunms: [],
      columsStr: '',
      total: 0,
      // allColums: [],
      selectRow: [],
      activeTab: 'ALL',
      tabList: [
        { name: '全部', id: 'ALL' },
        // {name: '我负责的', id: 'MANAGER'},
        // {name: '我参与的', id: 'JOIN'},
        // {name: '关注', id: ''},
      ],
      optionList: [],
      userInfo: JSON.parse(window.$Cookies.get('userInfo')),
      sessionId: undefined,
      healthColor: [
        {
          key: '灰',
          value: '#D9D9D9',
        },
        {
          key: '绿',
          value: '#72C040 ',
        },
        {
          key: '红',
          value: '#E23C39',
        },
        {
          key: '黄',
          value: '#F0AE41',
        },
      ],
      dialogVisible: false,
      isProjectGroup: false,
      projectType: '产品开发类项目',
      num: 1,
      projectName: '',
      typeList: [
        {
          value: '产品开发类项目',
          label: '产品开发类项目',
        },
        {
          value: '信息技术类项目',
          label: '信息技术类项目',
        },
        {
          value: '制造技术类项目',
          label: '制造技术类项目',
        },
      ],
      greenParam: null,
      yellowEndParam: null,
      yellowStartParam: null,
      redParam: null,
      projectDisable: {
        isDelelop: true,
        isMake: true,
        isMessage: true,
      },
      selectTableTab: [],
      tabs1: [
        {
          type: '全部',
          title: '全部',
          isDel: false,
        },
        {
          type: '我参与的',
          title: '我参与的',
          isDel: false,
        },
        {
          type: '我负责的',
          title: '我负责的',
          isDel: false,
        },
        {
          type: '我关注的',
          title: '我关注的',
          isDel: false,
        },
      ],
      menuPosition: {
        top: 0,
        left: 0,
      },
      showMenu: false,
      searchUserType: '',
      oldTabName: '',
      allColumns: [],
      activeKeyDel: '',
      isLoading: false,
      searchList: {},
      drawer: false,
      direction: 'rtl',
      colunmsPhase: [
        {
          title: '序号',
          dataIndex: 'columnIndex',
          width: '60px',
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          width: '200px',
          ellipsis: {
            placement: 'right-end',
          },
        },
        {
          title: '项目阶段',
          dataIndex: 'mileStoneInfo',
        },
      ],
      tableDataPhase: [],
      totalPhase: null,
      phaseTableLoad: false,
      isLoadingCritical: false,
      loadingExport: false,
      showMenu1: false,
      selectProject: [],
    });

    // const getBtnMenuData = async () => {
    //   projectData.btnList = await getBtnMenus({
    //     modelName: 'projectListTable toolbar actions',
    //     oid: '',
    //   });
    // };

    const initFun = async () => {
      projectData.tableLoad = true;
      projectData.projectManager = '';
      projectData.searchUserType = '';
      // projectData.activeKey = '全部'
      await getTabList();
      // await getBtnMenuData() // 获取按钮
      // 获取默认表头
      // if (!projectData.colunms.length) {
      await getColumns();
      // }
      // 获取数据
      if (projectData.activeKey === '我关注的') {
        await getFollowList();
      } else if (projectData.activeKey === '全部') {
        await getProject();
      } else if (projectData.activeKey === '我负责的') {
        // projectData.projectManager = projectData.userInfo.username;
        projectData.searchUserType = '2';
        await getProject();
      } else if (projectData.activeKey === '我参与的') {
        projectData.searchUserType = '1';
        await getProject();
      } else {
        await listCustomerPageLabel().then((res) => {
          if (res.success) {
            for (let key in res.data) {
              if (key === projectData.activeKey) {
                projectData.tableData = res.data[key].projectList.map((item, index) => {
                  item.columnIndex = index + 1;
                  item.healthStatus = getHealthValue(item.healthStatus);
                  return item;
                });
                projectData.tableDataCopy = res.data[key].projectList.map((item, index) => {
                  item.columnIndex = index + 1;
                  return item;
                });
                if (projectData.projectName) {
                  searchProject();
                }
              }
            }
            projectData.tableLoad = false;
          } else {
            that.$message.error(res.message);
            projectData.tableLoad = false;
          }
        });
      }
      await getAllColumns();
    };
    // 获取表头
    const getColumns = async () => {
      // 获取默认表头
      let obj = {
        tableName: 'plm_project',
        pageLabelName: projectData.activeKey,
      };
      await listSetupColumn(obj).then((res) => {
        if (res.success) {
          projectData.colunms = [];
          const newObj = {
            columnIndex: '序号',
            // width: 50,
          };
          projectData.columsStr = Object.assign(newObj, res.data.column);
          // projectData.columsStr = res.data.column;
          for (let key in projectData.columsStr) {
            let obj = {
              title: projectData.columsStr[key],
              dataIndex: key,
              ellipsis: {
                placement: 'right-end',
              },
              // minWidth: 130,
              // width: key === 'projectName' || key === 'createBy' ? '' : 130,
              filters: projectData.columsStr[key].includes('时间') ? 'date' : 'select',
            };
            if (key === 'columnIndex') {
              obj.width = 80;
            }
            if (projectData.columsStr[key].length >= 3) {
              obj.width = 120;
            }
            if (projectData.columsStr[key].length >= 6) {
              obj.width = 180;
            }
            if (projectData.columsStr[key].length >= 10) {
              obj.width = 220;
            }
            if (projectData.columsStr[key].length >= 14) {
              obj.width = 260;
            }
            if (key === 'projectName') {
              obj.width = 400;
            }
            projectData.colunms.push(obj);
          }
          // projectData.tableLoad = false
        } else {
          projectData.tableLoad = false;
          that.$message.error(res);
        }
      });
    };
    // 获取全部数据
    const getProject = () => {
      getProjectList({
        // projectName: projectData.projectName,
        projectManager: projectData.projectManager,
        searchUserType: projectData.searchUserType,
        // page: projectData.page,
        // size: projectData.range,
        // sessionId: projectData.page === 1 ? undefined : projectData.sessionId
      }).then((res) => {
        if (res.success) {
          let arr = res.data.length > 0 ? res.data : [];
          projectData.tableData = arr.map((item, index) => {
            item.columnIndex = index + 1;
            item.healthStatus = item.healthStatus ? getHealthValue(item.healthStatus) : '';
            item.secondaryDepartment = item.secondaryDepartment
              ? item.secondaryDepartment.includes('技术研究总院_')
                ? item.secondaryDepartment.split('技术研究总院_')[1]
                : item.secondaryDepartment
              : '';
            return item;
          });
          projectData.tableDataCopy = arr.map((item, index) => {
            item.columnIndex = index + 1;
            return item;
          });
          projectData.total = res.data.length > 0 ? arr.length : 0;
          if (projectData.projectName) {
            searchProject();
          }
          // projectData.sessionId = res.data.sessionId
        } else {
          that.$message.warning(res.message + '失败！');
        }
        projectData.tableLoad = false;
      });
    };
    // 获取健康状态颜色
    const getHealthValue = (val) => {
      let color = '';
      if (val === 'UNAVAILABLE') {
        color = '灰';
      } else if (val === 'RED') {
        color = '红';
      } else if (val === 'YELLOW') {
        color = '黄';
      } else if (val === 'GREEN') {
        color = '绿';
      }
      return color;
    };
    onMounted(() => {
      initFun();
      getProjectType();
    });

    const goCreate = () => {
      router.push({ name: 'createProject' });
    };
    const goEdit = () => {
      router.push({ name: 'updateProject' });
    };
    const goProject = async (row, type) => {
      projectData.tableLoad = true;
      const newData = await window.$commonApisFun.getProjectMenuList(row.oid, projectData.userInfo.username, row.type);
      projectData.tableLoad = false;
      if (newData.length > 0) {
        // return;
        if (type === 'phase') {
          await window.$api.processApi.getByOid({ oid: row.oid }).then((res) => {
            if (res.success) {
              row.id = res.data.id;
            }
          });
        }
        /**清除缓存 */
        window.$navTagStore.removeAllCache();
        sessionStorage.setItem('editOid', row.oid);
        const params = {
          businessType: 'PROJECT',
          businessId: row.id,
        };
        addHistory(params).then((res) => {
          if (res.success) {
          }
        });
        sessionStorage.setItem('currentProject', JSON.stringify(row));
        // await _getRoleNamesByUserName(row.oid);
        // await _getPermissionByProjectldAndUserName(row.oid);
        router.push({ name: 'projectDetail' });
      } else {
        projectData.tableLoad = false;
        window.$message.error('暂无查看该项目的权限');
      }
    };

    // 项目选中
    const changeSelect = (val) => {
      selectData.value = val;
      projectData.selectRow = val;
    };
    // 导出
    const exportListMethod = () => {
      projectData.loadingExport = true;
      let newArr = [];
      if (projectData.selectRow.length === 0) {
        newArr = projectData.tableData.map((item) => {
          return item.id;
        });
      } else {
        newArr = projectData.selectRow.map((item) => {
          return item.id;
        });
      }
      exportList(newArr, projectData.activeKey).then((res) => {
        projectData.loadingExport = false;
        const aLink = document.createElement('a');
        var blob = new Blob([res], { type: 'application/vnd.ms-excel;application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = '项目列表';
        aLink.href = URL.createObjectURL(blob);
        aLink.setAttribute('download', fileName); // 设置下载文件名称
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
      });
    };
    const updateTableData = () => {
      // projectData.colunms = []
      projectData.page = 1;
      initFun();
    };
    // 设置临界值
    const setCritical = () => {
      projectData.dialogVisible = true;
      getCriticalValue();
    };
    // 获取全部表头
    const getAllColumns = (type) => {
      let obj = {
        tableName: 'plm_project',
        condition: type ? type : '',
      };
      // 获取表头所有数据
      window.$api.commonApi.getAllColumns(obj).then((res) => {
        let temp = res.data;
        projectData.allColumns = temp.map((item) => {
          return {
            title: item[3],
            dataIndex: item[1],
            ellipsis: true,
            width: 130,
          };
        });
      });
    };
    // 指标库
    const handleIndexLibrary = () => {
      router.push({ name: 'indexLibrary' });
    };
    // 自定义页签
    const addProjectGroup = () => {
      projectData.isProjectGroup = true;
      that.$nextTick(() => {
        that.$refs.addTab.tabName = '';
        // that.$refs.addTab.clearSectionTable();
      });
    };
    // 临界值切换类型
    const handleChange = () => {
      getCriticalValue();
    };
    const handleClick = async (tab) => {
      projectData.activeKey = tab.props.label;
      projectData.projectManager = '';
      projectData.searchUserType = '';
      if (tab.props.label) {
        initFun();
      } else {
        projectData.tableData = [];
      }
    };
    // 获取临界值
    const getCriticalValue = () => {
      // const params = {
      //   projectType: projectData.projectType
      // }
      getAllProjectCriticalConfig(projectData.projectType).then((res) => {
        if (res.success) {
          projectData.greenParam = res.data[0] ? res.data[0].greenParam : null;
          projectData.yellowEndParam = res.data[0] ? res.data[0].yellowEndParam : null;
          projectData.yellowStartParam = res.data[0] ? res.data[0].yellowStartParam : null;
          projectData.redParam = res.data[0] ? res.data[0].redParam : null;
          if (res.data.length === 0 && projectData.projectType === '产品开发类项目') {
            projectData.projectDisable.isDelelop = false;
          } else if (res.data.length === 0 && projectData.projectType === '信息技术类项目') {
            projectData.projectDisable.isMessage = false;
          } else if (res.data.length === 0 && projectData.projectType === '制造技术类项目') {
            projectData.projectDisable.isMake = false;
          }
        } else {
          that.$message.error(res.message);
        }
      });
    };
    // 创建/编辑临界值
    const createCriticalConfig = () => {
      projectData.isLoadingCritical = true;
      if (projectData.greenParam > projectData.redParam) {
        const apiUrl = {
          urlUpadate: updateProjectCriticalConfig,
          urlCreate: createProjectCriticalConfig,
        };
        let type = '';
        if (
          (projectData.projectType === '产品开发类项目' && !projectData.projectDisable.isDelelop) ||
          (projectData.projectType === '信息技术类项目' && !projectData.projectDisable.isMessage) ||
          (projectData.projectType === '制造技术类项目' && !projectData.projectDisable.isMake)
        ) {
          type = 'urlCreate';
        } else {
          type = 'urlUpadate';
        }
        const params = {
          projectType: projectData.projectType,
          greenParam: projectData.greenParam,
          yellowStartParam: projectData.yellowStartParam,
          yellowEndParam: projectData.yellowEndParam,
          redParam: projectData.redParam,
        };
        apiUrl[type](params).then((res) => {
          if (res.success) {
            projectData.isLoadingCritical = false;
            projectData.dialogVisible = false;
          } else {
            projectData.isLoadingCritical = false;
            that.$message.error(res.message);
          }
        });
      } else {
        projectData.isLoadingCritical = false;
        window.$message.error('红灯天数需小于绿灯天数');
      }
    };
    // 关注项目
    const attentionProject = () => {
      if (projectData.selectRow.length === 0) {
        that.$message.error('请至少选择一个项目');
      } else {
        window.$ElMessageBox
          .confirm('确定要关注勾选的项目？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(async () => {
            let newArr = projectData.selectRow.map((item) => {
              return item.id;
            });
            followProject(newArr).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                selectData.value = [];
                projectData.selectRow = [];
                that.$refs.projectTable.clearSelection();
              } else {
                that.$message.error(res.message);
              }
            });
          })
          .catch(() => {});
      }
    };
    // 取消关注项目
    const cancelAttentionProject = () => {
      if (projectData.selectRow.length === 0) {
        that.$message.error('请至少选择一个项目');
      } else {
        let newArr = projectData.selectRow.map((item) => {
          return item.id;
        });
        removeFollowProject(newArr).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            selectData.value = [];
            projectData.selectRow = [];
            that.$refs.projectTable.clearSelection();
            initFun();
          } else {
            that.$message.error(res.message);
          }
        });
      }
    };
    // 获取关注项目列表
    const getFollowList = () => {
      projectData.tableLoad = true;
      followList({}).then((res) => {
        if (res.success) {
          let arr = res.data.records.length > 0 ? res.data.records : [];
          projectData.tableData = arr.map((item, index) => {
            item.columnIndex = index + 1;
            item.healthStatus = getHealthValue(item.healthStatus);
            return item;
          });
          projectData.tableDataCopy = arr.map((item, index) => {
            item.columnIndex = index + 1;
            return item;
          });
          projectData.total = res.data.records.length > 0 ? arr.length : 0;
          // projectData.sessionId = res.data.sessionId
          projectData.tableLoad = false;
          if (projectData.projectName) {
            searchProject();
          }
        } else {
          projectData.tableLoad = false;
          that.$message.warning(res.message + '失败！');
        }
      });
    };

    // 健康状态
    const getHealthColor = (key) => {
      const color = projectData.healthColor.find((i) => i.key === key)?.value;
      return color;
    };
    // 新增自定义标签
    const addProjectTab = () => {
      if (that.$refs.addTab.tabName === '') {
        window.$message.error('自定义标签名称必填');
        return false;
      }
      projectData.isLoading = true;
      if (projectData.oldTabName === '') {
        const params = {
          customerPageLabelName: that.$refs.addTab.tabName,
          projectSearch: that.$refs.addTab.project,
        };
        params.projectSearch.projectManager = that.$refs.addTab.project.projectManager ? that.$refs.addTab.project.projectManager.toString() : '';
        params.projectSearch.projectAssisant = that.$refs.addTab.project.projectAssisant ? that.$refs.addTab.project.projectAssisant.toString() : '';
        params.projectSearch.projectStatus = that.$refs.addTab.project.projectStatus ? that.$refs.addTab.project.projectStatus.toString() : '';
        params.projectSearch.projectType = that.$refs.addTab.project.projectType ? that.$refs.addTab.project.projectType.toString() : '';
        params.projectSearch.projectGroupReference = that.$refs.addTab.project.projectGroupReference ? that.$refs.addTab.project.projectGroupReference.toString() : '';
        params.projectSearch.comprehensiveGrade = that.$refs.addTab.project.comprehensiveGrade ? that.$refs.addTab.project.comprehensiveGrade.toString() : '';
        createCustomerPageLabel(params).then((res) => {
          if (res.success) {
            projectData.isLoading = false;
            that.$message.success(res.message);
            projectData.activeKey = that.$refs.addTab.tabName;
            projectData.isProjectGroup = false;
            projectData.selectTableTab = [];
            that.$refs.addTab.tabName = '';
            that.$refs.addTab.project = {};
            initFun();
          } else {
            projectData.isLoading = false;
            that.$message.error(res.message);
          }
        });
      } else {
        const params = {
          customerPageLabelName: projectData.oldTabName,
          projectSearch: that.$refs.addTab.project,
          updateCustomerPageLabelName: that.$refs.addTab.tabName,
        };
        params.projectSearch.projectManager = that.$refs.addTab.project.projectManager ? that.$refs.addTab.project.projectManager.toString() : '';
        params.projectSearch.projectAssisant = that.$refs.addTab.project.projectAssisant ? that.$refs.addTab.project.projectAssisant.toString() : '';
        params.projectSearch.projectStatus = that.$refs.addTab.project.projectStatus ? that.$refs.addTab.project.projectStatus.toString() : '';
        params.projectSearch.projectType = that.$refs.addTab.project.projectType ? that.$refs.addTab.project.projectType.toString() : '';
        params.projectSearch.projectGroupReference = that.$refs.addTab.project.projectGroupReference ? that.$refs.addTab.project.projectGroupReference.toString() : '';
        params.projectSearch.comprehensiveGrade = that.$refs.addTab.project.comprehensiveGrade ? that.$refs.addTab.project.comprehensiveGrade.toString() : '';
        updateCustomerPageLabel(params).then((res) => {
          if (res.success) {
            projectData.isLoading = false;
            that.$message.success(res.message);
            projectData.activeKey = that.$refs.addTab.tabName;
            projectData.isProjectGroup = false;
            projectData.selectTableTab = [];
            that.$refs.addTab.tabName = '';
            that.$refs.addTab.project = {};
            projectData.oldTabName = '';
            initFun();
          } else {
            projectData.isLoading = false;
            that.$message.error(res.message);
          }
        });
      }
    };
    // 取消编辑自定义页签
    const cancelProjectTab = () => {
      projectData.isProjectGroup = false;
      onClickOutside();
      // projectData.activeKey = '全部';
      // that.$refs.addTab.clearSectionTable();
      initFun();
    };
    // 编辑自定义标签
    const editTab = () => {
      projectData.isProjectGroup = true;
      setTimeout(() => {
        onClickOutside();
        // that.$refs.addTab.clearSectionTable();
        that.$refs.addTab.tabName = projectData.activeKeyDel;
        that.$refs.addTab.project = projectData.searchList;
        that.$refs.addTab.project.comprehensiveGrade = projectData.searchList.comprehensiveGrade ? projectData.searchList.comprehensiveGrade.split(',') : [];
        that.$refs.addTab.project.projectGroupReference = projectData.searchList.projectGroupReference ? projectData.searchList.projectGroupReference.split(',') : [];
        that.$refs.addTab.project.projectType = projectData.searchList.projectType ? projectData.searchList.projectType.split(',') : [];
        that.$refs.addTab.project.projectStatus = projectData.searchList.projectStatus ? projectData.searchList.projectStatus.split(',') : [];
        that.$refs.addTab.project.projectAssisant = projectData.searchList.projectAssisant ? projectData.searchList.projectAssisant.split(',') : [];
        that.$refs.addTab.project.projectManager = projectData.searchList.projectManager ? projectData.searchList.projectManager.split(',') : [];
        const createTime = `${projectData.searchList?.startCreateTime},${projectData.searchList?.endCreateTime}`;
        that.$refs.addTab.value4 = projectData.searchList.startCreateTime && projectData.searchList.endCreateTime ? createTime.split(',') : [];
        const activedTime = `${projectData.searchList?.startActualProjectStartTime},${projectData.searchList?.endActualProjectStartTime}`;
        that.$refs.addTab.value5 = projectData.searchList.startActualProjectStartTime && projectData.searchList.endActualProjectStartTime ? activedTime.split(',') : [];
        projectData.oldTabName = projectData.activeKeyDel;
      }, 200);
    };
    // 获取自定义标签
    const getTabList = () => {
      listCustomerPageLabel().then((res) => {
        if (res.success) {
          const newTab = [];
          for (let key in res.data) {
            let obj = {};
            obj.type = key;
            obj.title = key;
            obj.isDel = true;
            obj.searchList = res.data[key].searchCondition;
            newTab.push(obj);
          }
          projectData.tabs = [...projectData.tabs1, ...newTab];
        } else {
          that.$message.error(res.message);
        }
      });
    };
    // 右键
    const openMenu = (event, item) => {
      projectData.activeKeyDel = item.title;
      projectData.searchList = item.searchList;
      if (event.pageY < 560) {
        projectData.menuPosition.top = event.pageY - event.offsetY + 32 + 'px';
        projectData.menuPosition.left = event.pageX + 'px';
      } else {
        projectData.menuPosition.top = event.pageY - event.offsetY - 292 + 'px';
        projectData.menuPosition.left = event.pageX + 'px';
      }
      projectData.showMenu = true;
    };
    // 右键项目
    const openMenuProject = (event, item) => {
      projectData.selectProject = [];
      projectData.selectProject.push(item);
      // if (event.pageY < 560) {
      projectData.menuPosition.top = event.pageY - event.offsetY + 32 + 'px';
      projectData.menuPosition.left = event.pageX + 'px';
      projectData.menuPosition.zIndex = 10000;
      // } else {
      // projectData.menuPosition.top = event.pageY - event.offsetY - 292 + 'px';
      // projectData.menuPosition.left = event.pageX + 'px';
      // }
      projectData.showMenu1 = true;
    };
    const onClickOutside = () => {
      projectData.showMenu = false;
    };
    const onClickOutside1 = () => {
      projectData.showMenu1 = false;
    };
    // 删除自定义页签
    const onRevoke = () => {
      batchDeleteCustomerPageLabel([projectData.activeKeyDel]).then((res) => {
        if (res.success) {
          projectData.activeKey = '全部';
          onClickOutside();
          initFun();
        } else {
          this.$message.error(res.message);
        }
      });
    };
    // 搜索
    const searchProject = () => {
      if (projectData.projectName) {
        projectData.tableData = projectData.tableDataCopy.filter((item) => {
          for (let key in projectData.columsStr) {
            if (item[key] && item[key].toString().includes(projectData.projectName)) {
              return item;
            }
          }
        });
      } else {
        projectData.projectManager = '';
        projectData.searchUserType = '';
        if (projectData.activeKey === '我关注的') {
          getFollowList();
        } else if (projectData.activeKey === '全部') {
          getProject();
        } else if (projectData.activeKey === '我负责的') {
          projectData.searchUserType = '2';
          getProject();
        } else if (projectData.activeKey === '我参与的') {
          projectData.searchUserType = '1';
          getProject();
        } else {
          listCustomerPageLabel().then((res) => {
            if (res.success) {
              for (let key in res.data) {
                if (key === projectData.activeKey) {
                  projectData.tableData = res.data[key];
                }
              }
            } else {
              that.$message.error(res.message);
            }
          });
        }
      }
    };
    // 获取表头筛选项目类型
    const getProjectType = () => {
      window.$api.commonApi.getAllConditionByTableName({ tableName: 'plm_project' }).then((res) => {
        if (res.success) {
          projectData.optionList = res.data;
        } else {
          window.$message.error(res.message);
        }
      });
    };
    const changeType = (val) => {
      getAllColumns(val);
    };
    const handleClose = () => {
      projectData.drawer = false;
    };
    const seeProjectPhase = () => {
      projectData.drawer = true;
      getProjectPhaseTable();
    };
    // 批量查询项目导航信息
    const getProjectPhaseTable = () => {
      projectData.phaseTableLoad = true;
      let newOids = projectData.tableData.map((item) => {
        return item.oid;
      });
      const params = {
        oids: newOids.join(','),
      };
      window.$api.projectApi.queryProjectNavInfos(params).then((res) => {
        if (res.success) {
          projectData.phaseTableLoad = false;
          projectData.tableDataPhase = res.data.map((item, index) => {
            item.columnIndex = index + 1;
            if (item.mileStoneInfo) {
              const newArr = item.mileStoneInfo.filter((it) => {
                return it.actEndValue;
              });
              item.active = newArr.length;
              item.mileStoneInfo = item.mileStoneInfo.map((itm, index) => {
                if (index === item.active) {
                  itm.status = '进行中';
                } else if (index < item.active) {
                  itm.status = '已完成';
                } else if (index > item.active) {
                  itm.status = '未开始';
                }
                itm.number = index + 1;
                return itm;
              });
            }
            return item;
          });
        } else {
          projectData.phaseTableLoad = false;
          window.$message.error(res.message);
        }
      });
    };
    // 修改临界值
    const changeInput = (type) => {
      if (type === 'green') {
        projectData.yellowStartParam = projectData.greenParam;
      } else {
        projectData.yellowEndParam = projectData.redParam;
      }
    };
    const goWindowProject = async () => {
      projectData.showMenu1 = false;
      if (projectData.selectProject.length === 1) {
        projectData.tableLoad = true;
        let params = {
          projectOid: projectData.selectProject[0].oid,
          userName: projectData.userInfo.username,
        };
        window.$api.commonApi.getProjectPermission(params).then((res) => {
          if (res.success) {
            projectData.tableLoad = false;
            if (res.data.length > 0) {
              window.open(`http://${window.location.host}/#/project/detail?oid=${projectData.selectProject[0].oid}&isNewWin=true`, '_blank');
            } else {
              projectData.tableLoad = false;
              window.$message.error('暂无该项目的权限');
            }
          }
        });
      } else {
        that.$message.error('请至少选择一个项目');
      }
    };

    /**配置库 */
    const configDatabase = () => {
      router.push({ name: 'productConfig' });
    };
    return {
      ...toRefs(projectData),
      // goHandPage,
      goCreate,
      goEdit,
      changeSelect,
      exportList,
      updateTableData,
      goProject,
      getHealthColor,
      setCritical,
      addProjectGroup,
      handleChange,
      handleClick,
      getCriticalValue,
      createCriticalConfig,
      attentionProject,
      getFollowList,
      getProject,
      exportListMethod,
      addProjectTab,
      getTabList,
      openMenu,
      onClickOutside,
      onRevoke,
      searchProject,
      editTab,
      cancelProjectTab,
      cancelAttentionProject,
      handleIndexLibrary,
      configDatabase,
      getAllColumns,
      getProjectType,
      changeType,
      handleClose,
      seeProjectPhase,
      getProjectPhaseTable,
      changeInput,
      goWindowProject,
      openMenuProject,
      onClickOutside1,
    };
  },
});
</script>

<style scoped lang="scss">
.projectList {
  padding: 16px;
  background: #fff;
  min-height: calc(100vh - 116px);
  .topStyle {
    display: flex;
    justify-content: space-between;
  }
  .searchInput {
    display: flex;
    justify-content: space-between;
  }
  .title {
    font-size: 16px;
    line-height: 24px;
    color: #333;
    font-weight: 550;
    margin-bottom: 10px;
  }
  .tabRow {
    position: relative;
    width: 100%;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: var(--el-border-color-light);
      z-index: 1;
    }
    .tabList {
      white-space: nowrap;
      .tab {
        display: inline-block;
        padding: 0 12px;
        line-height: 40px;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          color: var(--el-color-primary);
        }
        &.actived {
          color: var(--el-color-primary);
          .tabText {
            position: relative;
            display: inline-block;
            &::after {
              content: '';
              position: absolute;
              left: 0;
              bottom: 0;
              width: 100%;
              height: 2px;
              background-color: var(--el-color-primary);
              z-index: 2;
            }
          }
        }
      }
    }
  }
  .custom-tabs-label {
    font-size: 18px;
    cursor: pointer;
  }
  .status1 {
    color: #3dbd7d;
  }
  .status2 {
    color: #f68800;
  }
  .status3 {
    color: #f04134;
  }
  .UNAVAILABLE {
    color: #999;
  }
  .health-wrapper {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  :deep(.el-dialog__body) {
    padding-top: 5px;
  }
  :deep(.el-dialog__header) {
    border-bottom: 1px solid #f3f6f9;
    margin-right: 0px;
  }
  :deep(.el-dialog__footer) {
    border-top: 1px solid #f3f6f9;
  }
  .tabName {
    font-size: 14px;
    padding: 5px 0;
    line-height: 42px;
  }
  .endTime {
    display: flex;
    justify-content: space-between;
  }
  :deep(.el-drawer__header) {
    padding-bottom: 10px;
    margin-bottom: 0;
  }
  .context-menu {
    position: fixed;
    z-index: 11;
    width: 100px;
    padding: 20px 12px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
    font-size: 13px;
    .menu-row {
      margin-bottom: 12px;
      cursor: pointer;
    }
    .menu-row:hover {
      color: var(--el-color-primary);
    }
    .menu-row:last-child {
      margin-bottom: 0;
    }
  }
  .context-menu1 {
    position: fixed;
    z-index: 11;
    width: 160px;
    padding: 20px 12px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
    font-size: 13px;
    .menu-row {
      margin-bottom: 12px;
      cursor: pointer;
    }
    .menu-row:hover {
      color: var(--el-color-primary);
    }
    .menu-row:last-child {
      margin-bottom: 0;
    }
  }
  :deep(.el-link) {
    .el-link__inner {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      display: inline-block;
    }
  }
  .greenLight {
    color: #3dbd7d;
  }
  .yellowLight {
    color: #f68800;
  }
  .redLight {
    color: #f04134;
  }
  :deep(.planTimeStyle) {
    .cell {
      background-color: rgba(91, 183, 59, 0.13);
      margin: 5px;
      text-align: center;
    }
  }
  :deep(.actualTimeStyle) {
    .cell {
      background-color: rgba(255, 252, 153, 0.5);
      margin: 5px;
      text-align: center;
    }
  }
}
</style>
<style lang="scss">
.phaseTableData {
  .el-table .cell {
    height: 26px;
  }
}
</style>
