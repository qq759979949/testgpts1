<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-18 19:13:34
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\toDoPage\module\components\todoTables.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div ref="content-item-wrapper" class="content-item-wrapper">
    <div class="content-item-filters">
      <slot name="filters" />
    </div>
    <!-- <div class="table-nav">
      <el-link
        type="primary"
        :underline="false"
        icon="el-icon-warning-outline"
      ></el-link>
      已选择
      <el-link type="primary" :underline="false">{{ selectArr.length + '项' }}</el-link>
      <el-link type="primary" :underline="false" @click="clearItem">清空</el-link>
    </div> -->
    <div ref="content-item-table" class="content-item-table">
      <!-- <PiTable
        ref="todoTable"
        :total="total"
        row-key="oid"
        :selectable="true"
        :pagination="true"
        :columns="columns"
        :data="tableData"
        :table-name="tableName"
        :table-load="tableLoad"
        :pageLabelName="activeKey"
        @selectionChange="changeSelect"
        @updateTableData="updateTableData"
      > -->
      <NewPiTable
        :columns="columns"
        :data="tableData"
        :isShowSetting="true"
        :selectable="false"
        :pagination="isHomePage === 'isHomePage' ? false : tableData?.length > 10"
        :isWebPagination="isHomePage === 'isHomePage' ? false : tableData?.length > 10"
        :page-size="10"
        :table-name="tableName"
        :taskColumns="taskColumns"
        :stripe="false"
        :tableLoad="tableLoad"
        :allColumns="allColumns"
        :pageLabelName="activeKey"
        @selectionChange="changeSelect"
        @updateTableData="updateTableData"
      >
        <!-- <template #statusFamily_General="scope">
          <img :src="scope.row['statusFamily_General']" alt="" />
        </template>
        <template #type_icon="scope">
          <img :src="scope.row['type_icon']" alt="" />
        </template>  -->
        <!-- @click="appearDrawer(scope)" -->
        <!-- 计划状态弹出任务抽屉 -->
        <template #plannableStatus="scope">
          <div
            class="state-wrapper"
            :style="{
              backgroundColor: getStateColor(scope.row.plannableStatus, plannableStatus, 0.13),
            }"
          >
            <span
              :style="{
                color: getStateColor(scope.row.plannableStatus, plannableStatus),
              }"
            >
              {{ scope.row.plannableStatus }}
            </span>
          </div>
        </template>
        <template #projectName="scope">
          <div class="goClickStyle" @click="goProject(scope.row)">
            {{ scope.row.projectName }}
          </div>
        </template>
        <template #plannableReference="scope">
          <!-- <el-link type="primary" :underline="false" @click="handFun(scope, 'appearDrawer')">
            {{ scope.row.plannableReference }}
          </el-link> -->
          <div class="goClickStyle" @click="handFun(scope, 'appearDrawer')">
            {{ scope.row.plannableReference }}
          </div>
        </template>
        <!-- 状态样式 -->
        <template v-for="item in statusData" :key="item" #[item]="scope">
          <div
            class="state-wrapper"
            :style="{
              backgroundColor: getStateColor(scope.row[item], stateColor, 0.13),
            }"
          >
            <span
              :style="{
                color: getStateColor(scope.row[item], stateColor),
              }"
            >
              {{ scope.row[item] }}
            </span>
          </div>
        </template>
        <!-- 健康状态 -->
        <template #healthStatusType="scope">
          <div
            class="health-wrapper"
            :style="{
              backgroundColor: getHealthColor(scope.row.healthStatusType),
            }"
          ></div>
        </template>
        <!-- 点击流程跳转 @click="goProcess(scope.row)"-->
        <template #workItemName="scope">
          <div class="goClickStyle" @click="handFun(scope.row, 'goProcess')">
            {{ scope.row.workItemName }}
          </div>
        </template>

        <!-- 查看交付物 @click="handApprove(scope.row)"-->
        <template #[clickSlotName(activeKey)]="scope">
          <div class="goClickStyle" @click="handFun(scope.row, 'dilevers')">
            {{ splitStrValue(scope.row[clickSlotName(activeKey)], 'name') }}
            <span class="numberDeliver" v-if="scope.row[clickSlotName(activeKey)]">{{ splitStrValue(scope.row[clickSlotName(activeKey)], 'number') }}</span>
          </div>
        </template>

        <!-- 点击任务跳转 -->
        <!-- <template #rsrcReference="scope" v-if="activeKey === 'AcceptedProjectTaskTable'">
          <el-link type="primary" :underline="false" @click="handApprove(scope.row)">
            {{ scope.row.rsrcReference }}
          </el-link>
        </template> -->
      </NewPiTable>
      <!-- </PiTable> -->
    </div>
    <!-- 交付物-->
    <el-drawer v-model="drawer1" title="查看交付物" :before-close="handleClose1" size="50%">
      <!-- <AuditTask></AuditTask> -->
      <PiTable :isShowSetting="false" :columns="columnsFile" :data="dataFile">
        <template #subjectName="scope">
          <el-link type="primary" :underline="false" @click="goFileDetail(scope)">
            {{ scope.row.subjectName }}
          </el-link>
          <el-icon
            v-if="scope.row.subjectOid && scope.row.subjectOid.includes('WTDocument') && scope.row.subjectName"
            v-prview="{ id: scope.row.subjectOid, name: scope.row.fileName }"
            class="viewStyle"
          >
            <View />
          </el-icon>
        </template>
      </PiTable>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose1">取消</el-button>
          <!-- <el-button type="primary" @click="handleClose1">确认</el-button> -->
        </span>
      </template>
    </el-drawer>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs, getCurrentInstance, watch, onUnmounted } from 'vue';
import NewPiTable from '@/components/common/table/newPiTable.vue';
import { listDictItem } from '@/api/homePage.js';
// import { listSetupColumn } from '@/api/common';
import PiTable from '@/components/pdcCustom/PiTable.vue';
import { addHistory } from '@/api/project.js';
import dayjs from 'dayjs';
export default defineComponent({
  components: { NewPiTable, PiTable },
  props: {
    tableName: {
      type: String,
      default: '',
    },
    types: {
      type: String,
      default: '',
    },
    tableApi: {
      type: Function,
      default: null,
    },
    payload: {
      type: Object,
      default: () => ({}),
    },
    activeKey: {
      type: String,
      default: '',
    },
    isHomePage: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const { proxy: that } = getCurrentInstance();
    const router = useRouter();
    const Data = reactive({
      tableLoad: false,
      page: 1,
      range: 10,
      // total: 0,
      sessionId: '',
      columns: [],
      tableData: [],
      columnsStr: {},
      scrollY: 0,
      selectArr: [],

      // 用户
      userInfo: JSON.parse(window.$Cookies.get('userInfo')),

      /**数据处理 */
      state_state: 'state.state',
      stateColor: [
        {
          label: '新建物料',
          key: 'NEWITEM',
          value: '#5BB73B',
        },
        {
          label: '正在工作',
          key: 'INWORK',
          value: '#51A1FF',
        },
        {
          label: '重新工作',
          key: 'REWORK',
          value: '#FF4D4F',
        },
        {
          label: '正在审阅',
          key: 'UNDERREVIEW',
          value: '#FFD700',
        },
        // {
        //   label: '进行中',
        //   key: 'IN PROGRESS',
        //   value: '#5BB73B',
        // },
        {
          label: '进行中',
          key: '进行中',
          value: '#5BB73B',
        },
        // {
        //   label: '已发布',
        //   key: 'RELEASED',
        //   value: '#00CED1',
        // },
        {
          label: '已关闭',
          key: '已关闭',
          value: '#f5222d',
        },
        {
          label: '废弃',
          key: 'OBSOLESCENCE',
          value: '#D9D9D9',
        },
        {
          label: '开启',
          key: 'OPEN',
          value: '#32CD32',
        },
        {
          label: '待整理',
          key: 'TO_BE_PENDING',
          value: '#FFA500',
        },
      ],
      plannableStatus: [
        {
          label: '已完成',
          key: '已完成',
          // key: 'COMPLETED',
          value: '#52c41a',
        },
        {
          label: '进行中',
          // key: 'INPROCESS',
          key: '进行中',
          value: '#5BB73B',
        },
        {
          label: '已排程',
          key: '已排程',
          // key: 'SCHEDULED',
          value: '#faad14',
        },
        {
          label: '暂停',
          // key: 'SUSPENDED',
          key: '暂停',
          value: '#d9d9d9',
        },
        {
          label: '未开启',
          // key: 'NOTOPEN',
          key: '未开启',
          value: '#f5222d',
        },
        {
          label: '待审核',
          key: '待审核',
          // key: 'PENDINGAPPROVAL',
          value: '#5BB73B',
        },
        {
          label: '审核被驳回',
          key: '审核被驳回',
          // key: 'APPROVAL_REJECTED',
          value: '#f5222d',
        },
        {
          label: '强制终止',
          key: '强制终止',
          // key: 'FORCEDTERMINATION',
          value: '#f5222d',
        },
      ],
      healthColor: [
        {
          key: '灰', // UNAVAILABLE
          value: '#D9D9D9',
        },
        {
          key: '绿', // GREEN
          value: '#72C040 ',
        },
        {
          key: '红', // RED
          value: '#E23C39',
        },
        {
          key: '黄', // YELLOW
          value: '#F0AE41',
        },
      ],
      // 各种状态集合
      statusData: ['status'],
      // 表头数据
      columnsParams: [],
      conditionStatus: '', // 初始进来状态条件
      allColumns: [],
      drawer1: false,
      columnsFile: [
        {
          title: '交付物要求',
          dataIndex: 'name',
        },
        {
          title: '交付物',
          dataIndex: 'subjectName',
        },
        // {
        //   title: '是否最新版',
        //   dataIndex: 'isLatestVersion',
        // },
        {
          title: '交付物状态',
          dataIndex: 'subjectState',
        },
      ],
      dataFile: [],
      tableDataCopy: [],
      taskColumns: {
        healthStatusType: '健康状态',
        plannableStatus: '状态',
        plannableReference: '活动',
        rsrcReference: '资源',
        deliverableNames: '交付物名称',
        targetStartDate: '目标开始时间',
        targetEndDate: '目标完成时间',
        'targetDuration.millis': '目标工期',
        projectReference: '项目',
        workCompletePercent: '完成百分比',
        ActualReviewer: '审核人',
        openTaskDate: '任务发布时间',
      },
      //  [
      //   { title: '健康状态', dataIndex: 'healthStatusType' },
      //   { title: '状态', dataIndex: 'plannableStatus' },
      //   { title: '活动', dataIndex: 'plannableReference' },
      //   { title: '资源', dataIndex: 'rsrcReference' },
      //   { title: '交付物名称', dataIndex: 'deliverableNames' },
      //   { title: '目标开始时间', dataIndex: 'targetStartDate' },
      //   { title: '目标完成时间', dataIndex: 'targetEndDate' },
      //   { title: '目标工期', dataIndex: 'targetDuration.millis' },
      //   { title: '项目', dataIndex: 'projectReference' },
      //   { title: '完成百分比', dataIndex: 'workCompletePercent' },
      //   { title: '审核人', dataIndex: 'ActualReviewer' },
      //   { title: '任务发布时间', dataIndex: 'openTaskDate' },
      // ],
    });

    onMounted(() => {
      getTableHeight();
      initFun();
      window.addEventListener('resize', getTableHeight());
    });

    onUnmounted(() => {
      window.addEventListener('resize', getTableHeight());
    });

    const initFun = async () => {
      Data.tableLoad = true;
      // 获取表头
      let obj = {
        tableName: props.tableName,
        pageLabelName: props.activeKey,
      };
      await window.$api.commonApi.listSetupColumn(obj).then((res) => {
        // Data.tableLoad = false;
        if (res.success) {
          Data.columns = [];
          const newObj = {
            columnIndex: '序号',
            // width: 50,
          };
          if (Object.keys(res.data.column).length === 0) {
            res.data.column = Data.taskColumns;
          }
          Data.columnsStr = Object.assign(newObj, res.data.column);
          for (let key in Data.columnsStr) {
            let obj = {
              title: Data.columnsStr[key],
              dataIndex: key,
              ellipsis: true,
              filters: Data.columnsStr[key].includes('时间') ? 'date' : 'select',
              minWidth: 120,
            };
            if (key === 'columnIndex') {
              obj.width = 80;
            }
            if (key === 'workItemName') {
              obj.width = 100;
            }
            if (key === 'processName') {
              obj.width = 400;
            }
            if (key === 'pboName') {
              obj.width = 300;
            }
            if (Data.columnsStr[key].length > 5) {
              obj.width = 180;
            }
            if (key === 'plannableReference') {
              obj.width = 200;
            }
            if (key === 'targetStartDate' || key === 'targetEndDate') {
              obj.width = 140;
            }
            // console.log(Data.columnsStr[key].length);
            Data.columns.push(obj);
            Data.columnsParams.push(key);
          }
          // projectData.tableLoad = false
        } else {
          // Data.tableLoad = false;
          that.$message.error(res);
        }
      });
      await getDataContentAll();
      if (Data.columns.length > 0 && props.activeKey === 'toDoWorklfowTable') {
        getToDoDataAll('OPEN');
      } else if (Data.columns.length > 0 && props.activeKey === 'activedProcess') {
        getToDoDataAll('CLOSED');
      }
      if (props.activeKey !== 'toDoWorklfowTable' && props.activeKey !== 'activedProcess') {
        getAllColumns();
      } else {
        getAllColumnsToDo();
      }
      // Data.tableLoad = false;
    };
    // 获取数据
    const getDataContentAll = async () => {
      Data.tableLoad = true;
      // 获取数据
      // Data.sessionId = Data.page === 1 ? undefined : Data.sessionId;
      if (Data.columns.length > 0 && props.tableName.includes('TaskTable')) {
        await props
          .tableApi({
            columns: Data.columnsParams.toString(),
            // sessionId: Data.sessionId,
            // page: Data.page,
            // range: Data.range,
            ...props.payload,
          })
          .then((res) => {
            if (res.success) {
              Data.tableLoad = false;
              const arr = res.data.rows;
              arr.sort((a, b) => new Date(b.openTaskDate).getTime() - new Date(a.openTaskDate).getTime());
              // Data.tableDataCopy.sort((a, b) => new Date(b.openTaskDate).getTime() - new Date(a.openTaskDate).getTime());
              Data.tableData = arr.map((item, index) => {
                item.columnIndex = index + 1;
                item.healthStatusType = item.healthStatusType ? getHealthValue(item.healthStatusType.value) : '';
                item.plannableStatus = item.plannableStatus ? item.plannableStatus.display : '';
                item.rsrcReference = item.rsrcReference ? item.rsrcReference.display : '';
                item.plannableReference = item.plannableReference ? item.plannableReference.display : '';
                item.projectReference = item.projectReference ? item.projectReference.display : '';
                item.targetStartDate = item.targetStartDate ? dayjs(item.targetStartDate).format('YYYY/MM/DD') : '';
                item.targetEndDate = item.targetEndDate ? dayjs(item.targetEndDate).format('YYYY/MM/DD') : '';
                item.actualStartDate = item.actualStartDate ? dayjs(item.actualStartDate).format('YYYY/MM/DD') : '';
                item.actualEndDate = item.actualEndDate ? dayjs(item.actualEndDate).format('YYYY/MM/DD') : '';
                return item;
              });
              Data.tableDataCopy = arr.map((item, index) => {
                item.columnIndex = index + 1;
                return item;
              });
              Data.sessionId = res.data.sessionId;
            } else {
              Data.tableLoad = false;
              that.$message.warning(res.message + '失败！');
            }
          });
      }
    };
    // 获取待办流程的全部表头
    const getAllColumnsToDo = () => {
      // Data.tableLoad = true;
      let obj = {
        tableName: 'user_workflow_task_map',
      };
      // 获取表头所有数据
      window.$api.commonApi.getAllColumns(obj).then((res) => {
        if (res.success) {
          // Data.tableLoad = false;
          let temp = res.data;
          Data.allColumns = temp.map((item) => {
            return {
              title: item[3],
              dataIndex: item[1],
              ellipsis: true,
              width: 130,
            };
          });
        } else {
          // Data.tableLoad = false;
          window.$message.error(res.message);
        }
      });
    };
    // 获取待办流程的数据
    const getToDoDataAll = (state) => {
      Data.tableLoad = true;
      const params = {
        status: state,
      };
      window.$api.toDoApi.getWorkflowData(params).then((res) => {
        if (res.success) {
          Data.tableLoad = false;
          Data.tableData = res.data.content.map((item, index) => {
            item.columnIndex = index + 1;
            item.status = item.status === 'OPEN' ? '进行中' : '已关闭';
            return item;
          });
          Data.tableDataCopy = res.data.content.map((item, index) => {
            item.columnIndex = index + 1;
            // item.status = item.status === 'OPEN' ? '进行中' : '已关闭';
            return item;
          });
        } else {
          Data.tableLoad = false;
          that.$message.error(res.message);
        }
      });
    };
    // 获取任务的全部表头
    const getAllColumns = () => {
      // Data.tableLoad = true;
      listDictItem({ dictCode: 'taskCenter' }).then((res) => {
        if (res.success) {
          Data.allColumns = JSON.parse(res.data[0].itemValue);
        } else {
          // Data.tableLoad = false;
          that.$message.error(res.message);
        }
      });
    };
    // 搜索
    const searchData = (it) => {
      Data.tableData = Data.tableDataCopy.filter((item) => {
        for (let key in Data.columnsStr) {
          if (item[key] && item[key].toString().includes(it)) {
            return item;
          }
        }
      });
    };
    // 截取字符串
    const splitStrValue = (str, type) => {
      if (str && type === 'name') {
        var lastIndex = str.lastIndexOf('(');
        var result = str.substring(0, lastIndex);
        return result;
      }
      if (str && type === 'number') {
        var index = str.lastIndexOf('(');
        var res = str.substring(index + 1, str.length - 1);
        return res;
      }
    };
    // 预览文件
    const viewFile = (scope) => {};
    // 跳转到文件详情
    const goFileDetail = (record) => {
      router.push({ name: 'fileDetailTask', query: { oid: record.row.subjectOid } });
    };

    // 分页
    watch(
      () => Data.page,
      () => {
        initFun();
      },
    );
    watch(
      () => Data.range,
      () => {
        Data.pagsplitStrValuee = 1;
        initFun();
      },
    );
    watch(
      () => props.payload,
      () => {
        Data.page = 1;
        initFun();
      },
      { deep: true },
    );

    const changeSelect = (val) => {
      Data.selectArr = val;
    };

    const updateTableData = () => {
      Data.columns = [];
      // Data.page = 1;
      initFun();
    };

    const getStateColor = (key, list, alpha = 1) => {
      const color = list.find((i) => {
        return i.key === key;
      })?.value;
      if (color) {
        return hexToRGB(color, alpha);
      }
    };
    // 将六位数颜色改成reba
    const hexToRGB = (hex, alpha = 1) => {
      // eslint-disable-next-line no-useless-escape
      if (!/(^\#([a-fA-F0-9]{3})$)|(^\#([a-fA-F0-9]{6})$)/g.test(hex)) {
        return null;
      }
      const allNumberStr = '0123456788abcdef'; // 十六进制的所有数字
      const len = hex.slice(1).length;
      const str = len === 6 ? hex.slice(1) : hex.slice(1)[0].repeat(2) + hex.slice(1)[1].repeat(2) + hex.slice(1)[2].repeat(2);
      const arrStr = str.split('');
      const newArrStr = arrStr.map((item) => {
        return allNumberStr.indexOf((item + '').toLowerCase());
      });
      const num1 = newArrStr[0] * 16 + newArrStr[1];
      const num2 = newArrStr[2] * 16 + newArrStr[3];
      const num3 = newArrStr[4] * 16 + newArrStr[5];
      return `rgb(${num1}, ${num2}, ${num3}, ${alpha})`;
    };

    const getHealthColor = (key) => {
      const color = Data.healthColor.find((i) => i.key === key)?.value;
      return color;
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

    // 自适应
    const getTableHeight = () => {
      that.$nextTick(() => {
        const dom = that.$refs['content-item-table'];
        const columnsHeight = 38;
        const paginationHeight = 24 + 5;
        if (dom) {
          const height = dom.offsetHeight - columnsHeight - paginationHeight;
          Data.scrollY = height > 0 ? height : 0;
          dom.style.setProperty('--table-height', Data.scrollY + 'px');
        }
      });
    };

    // 清空选择
    const clearItem = () => {
      let parentNode = that.$refs.todoTable;
      Data.selectArr = [];
      parentNode.$refs['pi-table'].clearSelection();
    };

    // 输出处理方法
    const handApprove = (item) => {
      Data.drawer1 = true;
      window.$api.toDoApi.getDeliverableByObject({ oid: item.oid }).then((res) => {
        if (res.success) {
          Data.dataFile = res.data;
        } else {
          that.$message.error(res.message);
        }
      });
    };

    /**流程&任务处理方法 */
    const handFun = (data, type) => {
      switch (type) {
        case 'appearDrawer': // 抽屉（执行任务， 审核任务)
          emit('appearDrawer', data);
          break;
        case 'goProcess': // 流程方法
          emit('goProcess', data);
          break;
        case 'dilevers': // 查看交付物
          handApprove(data);
          break;
        default:
          break;
      }
    };
    // 跳转单项目首页
    const goProject = async (row) => {
      Data.tableLoad = true;
      const newData = await window.$commonApisFun.getProjectMenuList(row.projectOid, Data.userInfo.username, row.projectType);
      if (newData.length > 0) {
        window.$api.processApi.getByOid({ oid: row.projectOid }).then((res) => {
          if (res.success) {
            Data.tableLoad = false;
            window.$navTagStore.removeAllCache();
            sessionStorage.setItem('editOid', row.projectOid);
            const params = {
              businessType: 'PROJECT',
              businessId: row.projectOid,
            };
            addHistory(params).then((res) => {
              if (res.success) {
              }
            });
            sessionStorage.setItem('currentProject', JSON.stringify(res.data));
            // await _getRoleNamesByUserName(row.oid);
            // await _getPermissionByProjectldAndUserName(row.oid);
            router.push({ name: 'projectDetail' });
          } else {
            Data.tableLoad = false;
          }
        });
        /**清除缓存 */
      } else {
        Data.tableLoad = false;
        window.$message.error('暂无查看该项目的权限');
      }
    };
    // 待办表格点击参数slot
    const clickSlotName = (key) => {
      var slotName = '';
      if (
        key === 'ApproverProjectTaskTable' ||
        key === 'AcceptedProjectTaskTable' ||
        key === 'activedTask' ||
        key === 'excutedTask' ||
        key === 'dueTask' ||
        key === 'overdueTask'
      ) {
        slotName = 'deliverableNames';
      }
      return slotName;
    };
    const handleClose1 = () => {
      Data.drawer1 = false;
    };

    return {
      ...toRefs(Data),
      changeSelect,
      updateTableData,
      getStateColor,
      getHealthColor,
      getHealthValue,
      // handApprove,
      clearItem,
      // appearDrawer,
      getAllColumns,
      getAllColumnsToDo,
      getToDoDataAll,
      getDataContentAll,
      clickSlotName,
      handFun,
      handleClose1,
      searchData,
      splitStrValue,
      viewFile,
      goFileDetail,
      goProject,
    };
  },
});
</script>

<style lang="scss" scoped>
.content-item-wrapper {
  flex: 1;
  height: 0;
  --table-height: 0;
  display: flex;
  flex-direction: column;
  --el-transparent-bg-color: rgba(50, 205, 50, 0.1);
  .table-nav {
    display: flex;
    align-items: baseline;
    height: 36px;
    margin-bottom: 10px;
    line-height: 36px;
    background: var(--el-transparent-bg-color);
    border: 1px solid var(--el-color-primary);
    padding: 0 10px;
    font-size: 14px;
    border-radius: 5px;
    a,
    span {
      font-size: 16px;
      padding: 0 5px;
    }
  }
  .content-item-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
  }
  .content-item-filters {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .content-item-table {
    // margin-top: 10px;
    flex: 1;
    height: 0;
    .goClickStyle {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #386bd7;
      cursor: pointer;
    }
  }
  .state-wrapper {
    // border-radius: 2px;
    // text-align: center;
  }
  .health-wrapper {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  .numberDeliver {
    display: inline-block;
    background: #ccc;
    padding: 0px 5px;
    border-radius: 10px;
    margin-left: 10px;
    color: #fff;
    font-size: 12px;
  }
  .viewStyle {
    margin-left: 10px;
    position: relative;
    top: 3px;
  }
}
</style>
