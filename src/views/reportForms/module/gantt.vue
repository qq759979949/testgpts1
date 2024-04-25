<template>
  <div class="gantt-view">
    <section class="header-box">
      <!-- <div class="layout-box">
        <a-radio-group v-model="foldMode">
          <a-radio-button :value="true">
            <a-icon type="vertical-align-bottom" :rotate="90"/>
          </a-radio-button>
          <a-radio-button :value="false">
            <a-icon type="vertical-align-middle" :rotate="90"/>
          </a-radio-button>
        </a-radio-group>
      </div> -->
      <div class="radio-box">
        <el-radio-group v-model="demension" @change="changeDemension">
          <el-radio label="year">年</el-radio>
          <el-radio label="month">月</el-radio>
          <el-radio label="week">周</el-radio>
          <el-radio label="day">天</el-radio>
        </el-radio-group>
      </div>
      <!-- <div class="legend-box">
        <div
          v-for="item in legendList"
          class="legend-item"
          :key="item.color">
          <i class="dot" :style="{backgroundColor: item.color}"></i>
          {{ item.language ? $t(item.language) : item.label }}
        </div>
      </div> -->
    </section>
    <section ref="mainContainer" @scroll="scrollListener" class="table-container">
      <div class="table-header">
        <div class="gantt-header-left" v-if="!foldMode">
          <div
            v-for="(item, index) in selectHeaderList"
            :style="{
              height: '45px',
              lineHeight: lineHeight + 'px',
              left: tableScrollLeft + 'px',
              width: ganttLeftWidth + 'px',
            }"
            class="header-item header-item1"
            :key="index"
          >
            {{ item.label === '序号' || item.label === '状态' ? '' : item.label }}
          </div>
        </div>
        <div
          class="gantt-header-right"
          :style="{
            width: spendCount * getDemensionWidth() + 'px',
            top: tableScrollTop + 'px',
            left: foldMode ? 0 : ganttLeftWidth + 'px',
          }"
        >
          <template v-if="demension === 'year'">
            <div v-for="(item, index) in spendCount" class="header-item" :style="{ width: getDemensionWidth() + 'px' }" :key="index">
              <div class="header-year">
                {{ start.add(index, 'year').format('YYYY年') }}
              </div>
            </div>
          </template>
          <template v-if="demension === 'month'">
            <div v-for="(item, index) in spendCount" class="header-item" :style="{ width: getDemensionWidth() + 'px' }" :key="index">
              <div
                class="header-top"
                :class="{
                  'top-end': start.add(index + 1, 'month').quarter() !== start.add(index, 'month').quarter(),
                }"
              >
                {{
                  start.add(index - 1, 'month').quarter() === start.add(index, 'month').quarter() && start.add(index + 1, 'month').quarter() === start.add(index, 'month').quarter()
                    ? start.add(index, 'month').format('YYYY年 第') + start.add(index, 'month').quarter() + '季度'
                    : ''
                }}
              </div>
              <div class="header-bottom">
                {{ start.add(index, 'month').format('M月') }}
              </div>
            </div>
          </template>
          <template v-if="demension === 'week'">
            <div v-for="(item, index) in spendCount" class="header-item" :style="{ width: getDemensionWidth() + 'px' }" :key="index">
              <div class="header-top">
                {{ start.add(index - 1, 'week').month() !== start.add(index, 'week').month() ? start.add(index, 'week').format('YYYY年M月') : '' }}
              </div>
              <div class="header-bottom">{{ getWeek(start.add(index, 'week')) }}周</div>
            </div>
          </template>
          <template v-if="demension === 'day'">
            <div v-for="(item, index) in spendCount" class="header-item" :style="{ width: getDemensionWidth() + 'px' }" :key="index">
              <div
                class="header-top"
                :class="{
                  'top-end': start.add(index + 1, 'day').date() === 1,
                }"
              >
                {{ start.add(index, 'day').date() === 15 ? start.add(index, 'day').format('YYYY年M月') : '' }}
              </div>
              <div class="header-bottom">
                {{ start.add(index, 'day').format('D') }}
              </div>
            </div>
          </template>
        </div>
      </div>
      <!-- 把容器撑起来 -->
      <div :style="{ height: totalHeight + 'px' }"></div>
      <div class="show-container">
        <div class="gantt-left" v-if="!foldMode">
          <div
            v-for="(row, index) in showData"
            class="gantt-item"
            v-show="!row.hide"
            :style="{
              height: lineHeight + 'px',
              lineHeight: lineHeight + 'px',
              left: tableScrollLeft + 'px',
              width: ganttLeftWidth + 'px',
            }"
            :key="index"
          >
            <template v-for="(item, index) in selectHeaderList" :key="index">
              <div :style="{ width: item.width + 'px' }" class="table-item">
                {{ row[item.key] }}
              </div>
            </template>
          </div>
        </div>
        <div class="gantt-right">
          <div class="gantt-content" :style="{ width: spendCount * getDemensionWidth() + 'px' }">
            <div ref="containerBox" class="item-container">
              <div v-for="(row, count) in showData" v-show="!row.hide" class="gantt-item" :key="count">
                <div v-for="(item, index) in spendCount" :key="index" class="item-cell" :style="{ width: getDemensionWidth() + 'px' }"></div>
                <el-popover width="200px">
                  <template #default>
                    <div class="title-row">
                      <div class="title">{{ row.name }}</div>
                      <!-- <div class="status">
                        <i :style="{ background: getColor(row.type, row) }"></i>
                        {{ getStatus(row.type) }}
                      </div> -->
                    </div>
                    <!-- </template>
                  <template :v-slot="content"> -->
                    <div class="form-group">
                      <div class="form-row">
                        <div class="form-label">
                          计划开始时间：
                          <span class="form-text">{{ row.targetStartDate }}</span>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-label">
                          计划结束时间：
                          <span class="form-text">{{ row.targetEndDate }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="form-row">
                        <div class="form-label">
                          实际开始时间：
                          <span class="form-text">{{ row.actualStartDate }}</span>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-label">
                          实际结束时间：
                          <span class="form-text">{{ row.actualEndDate }}</span>
                        </div>
                      </div>
                    </div>
                    <!-- <div class="form-group">
                      <div class="form-row">
                        <div class="form-label">预测开始日期</div>
                        <div class="form-text">{{ row.actualStartDate }}</div>
                      </div>
                      <div class="form-row">
                        <div class="form-label">预测结束日期</div>
                        <div class="form-text">{{ row.actualEndDate }}</div>
                      </div>
                    </div> -->
                  </template>
                  <template #reference>
                    <div>
                      <div
                        v-if="row.targetEndDate && row.targetStartDate"
                        :id="row.id + '_' + count"
                        :ref="'item_' + row.id"
                        class="row-item"
                        :class="['level_' + row.level]"
                        :style="{
                          left: row.styleLeftPlan + 'px',
                          width: row.styleWidthPlan + 'px',
                          background: '#3D93F6',
                        }"
                      >
                        {{ row.label }}
                      </div>
                    </div>
                  </template>
                </el-popover>
                <el-popover width="200px">
                  <template #default>
                    <div class="title-row">
                      <div class="title">{{ row.name }}</div>
                      <!-- <div class="status">
                        <i :style="{ background: getColor(row.type, row) }"></i>
                        {{ getStatus(row.type) }}
                      </div> -->
                    </div>
                    <!-- </template>
                  <template :v-slot="content"> -->
                    <div class="form-group">
                      <div class="form-row">
                        <div class="form-label">
                          计划开始时间：
                          <span class="form-text">{{ row.targetStartDate }}</span>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-label">
                          计划结束时间：
                          <span class="form-text">{{ row.targetEndDate }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="form-row">
                        <div class="form-label">
                          实际开始时间：
                          <span class="form-text">{{ row.actualStartDate }}</span>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-label">
                          实际结束时间：
                          <span class="form-text">{{ row.actualEndDate }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template #reference>
                    <div
                      v-if="row.actualEndDate && row.actualStartDate"
                      :id="row.id + '_' + count"
                      :ref="'item_' + row.id"
                      class="row-item2"
                      :class="['level_' + row.level]"
                      :style="{
                        left: row.styleLeftFcast + 'px',
                        width: row.styleWidthFcast + 'px',
                        background: '#8FED9D',
                      }"
                    >
                      {{ row.label }}
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- <TransferBox
      :isShow.sync="showHeaderSetting"
      :allList="headerListAll"
      :checkedList="tempHeaderArr"
      :dataProps="{key: 'key', label: 'label'}"
      @confirm="confirmHeader"
      title="设置表头"
    >
    </TransferBox> -->
  </div>
</template>

<script>
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
dayjs.extend(weekday);
dayjs.extend(quarterOfYear);
let source = [
  {
    // planEndWeek: '2023WK24', //计划完成日期所在周数
    createtime: 1690177711000, //计划生成时间
    phaseId: 1, //关联阶段主键
    // fcastEndWeek: '2023WK24', //预测完成日期所在周数
    createuser: 'danghui', //计划生成用户
    phaseStatus: 0, //计划状态
    version: 1, //计划版本
    planAfterWd: 0, //计划阶段后置工时，单位”天“
    // planStartWeek: '2023WK21', //计划开始日期所在周数
    planPhaseWd: 15, //计划阶段所需工时，单位”天“
    actualEndDate: 1686499200000, //预测完成日期
    actualStartDate: 1684771200000, //预测开始日期
    // fcastStartWeek: '2023WK21', //预测开始日期所在周数
    plant: '2901', //工厂
    company: 'ABB', //公司
    planPreWd: 7, //计划阶段前置工时，单位”天“
    id: 1,
    phaseCode: 'Design', //关联阶段编码
    targetStartDate: 1684771200000, //计划开始日期
    targetEndDate: 1686499200000, //计划完成日期
    projectId: '00142a89-78fb-46ba-a939-898b59c3574d', //项目主键
    name: '先期研究与概念研究', //关联阶段名称
  },
  {
    // planEndWeek: '2023WK24', //计划完成日期所在周数
    createtime: 1690177711000, //计划生成时间
    phaseId: 2, //关联阶段主键
    // fcastEndWeek: '2023WK24', //预测完成日期所在周数
    createuser: 'danghui', //计划生成用户
    phaseStatus: 1, //计划状态
    version: 1, //计划版本
    planAfterWd: 0, //计划阶段后置工时，单位”天“
    // planStartWeek: '2023WK24', //计划开始日期所在周数
    planPhaseWd: 1, //计划阶段所需工时，单位”天“
    actualEndDate: 1686585600000, //预测完成日期
    actualStartDate: 1683585600000, //预测开始日期
    // fcastStartWeek: '2023WK24', //预测开始日期所在周数
    plant: '2901', //工厂
    company: 'ABB', //公司
    planPreWd: 1, //计划阶段前置工时，单位”天“
    id: 2,
    phaseCode: 'BOM', //关联阶段编码
    targetStartDate: 1683585600000, //计划开始日期
    targetEndDate: 1686585600000, //计划完成日期
    projectId: '00142a89-78fb-46ba-a939-898b59c3574d', //项目主键
    name: '详细设计', //关联阶段名称
  },
  {
    // planEndWeek: '2023WK24', //计划完成日期所在周数
    createtime: 1690177711000, //计划生成时间
    phaseId: 3, //关联阶段主键
    // fcastEndWeek: '2023WK24', //预测完成日期所在周数
    createuser: 'danghui', //计划生成用户
    phaseStatus: 4, //计划状态
    version: 1, //计划版本
    planAfterWd: 0, //计划阶段后置工时，单位”天“
    // planStartWeek: '2023WK24', //计划开始日期所在周数
    planPhaseWd: 0, //计划阶段所需工时，单位”天“
    actualEndDate: 1696679000000, //预测完成日期
    actualStartDate: 1686622000000, //预测开始日期
    // fcastStartWeek: '2023WK24', //预测开始日期所在周数
    plant: '2901', //工厂
    company: 'ABB', //公司
    planPreWd: 1, //计划阶段前置工时，单位”天“
    id: 3,
    phaseCode: 'PO', //关联阶段编码
    targetStartDate: 1686170000000, //计划开始日期
    targetEndDate: 1687692000000, //计划完成日期
    projectId: '00142a89-78fb-46ba-a939-898b59c3574d', //项目主键
    name: '样机机制', //关联阶段名称
  },
  {
    // planEndWeek: '2023WK31', //计划完成日期所在周数
    createtime: 1690177711000, //计划生成时间
    phaseId: 4, //关联阶段主键
    // fcastEndWeek: '2023WK31', //预测完成日期所在周数
    createuser: 'danghui', //计划生成用户
    phaseStatus: 3, //计划状态
    version: 1, //计划版本
    planAfterWd: 0, //计划阶段后置工时，单位”天“
    // planStartWeek: '2023WK24', //计划开始日期所在周数
    planPhaseWd: 35, //计划阶段所需工时，单位”天“
    actualEndDate: 1691992000000, //实际完成日期
    actualStartDate: 1686755400000, //预测开始日期
    // fcastStartWeek: '2023WK24', //预测开始日期所在周数
    plant: '2901', //工厂
    company: 'ABB', //公司
    planPreWd: 1, //计划阶段前置工时，单位”天“
    id: 4,
    phaseCode: 'Supplier', //关联阶段编码
    targetStartDate: 1686718400000, //计划开始日期
    targetEndDate: 1692992000000, //计划完成日期
    projectId: '00142a89-78fb-46ba-a939-898b59c3574d', //项目主键
    name: '可靠性验证', //关联阶段名称
  },
  // {
  //   planEndWeek: '2023WK33', //计划完成日期所在周数
  //   createtime: 1690177711000, //计划生成时间
  //   phaseId: 5, //关联阶段主键
  //   fcastEndWeek: '2023WK33', //预测完成日期所在周数
  //   createuser: 'danghui', //计划生成用户
  //   phaseStatus: 0, //计划状态
  //   version: 1, //计划版本
  //   planAfterWd: 0, //计划阶段后置工时，单位”天“
  //   planStartWeek: '2023WK31', //计划开始日期所在周数
  //   planPhaseWd: 9, //计划阶段所需工时，单位”天“
  //   fcastEndDate: 1692115200000, //预测完成日期
  //   fcastStartDate: 1691078400000, //预测开始日期
  //   fcastStartWeek: '2023WK31', //预测开始日期所在周数
  //   plant: '2901', //工厂
  //   company: 'ABB', //公司
  //   planPreWd: 1, //计划阶段前置工时，单位”天“
  //   id: 5,
  //   phaseCode: 'Coil', //关联阶段编码
  //   planStartDate: 1691078400000, //计划开始日期
  //   planEndDate: 1692115200000, //计划完成日期
  //   projectId: '00142a89-78fb-46ba-a939-898b59c3574d', //项目主键
  //   name: '线圈', //关联阶段名称
  // },
];
export default {
  components: {},
  props: {
    ganttData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      demension: 'year', // year month week day
      foldMode: false,
      containerHeight: 0,
      start: null,
      end: null,
      spendCount: 0,
      startIndex: 0,
      tableScrollTop: 0,
      tableScrollLeft: 0,
      lineHeight: 50,
      legendList: [
        {
          value: 1,
          label: '未开工',
          language: 'NotStarted',
          color: '#9FA9B5',
        },
        {
          value: 2,
          label: '完工',
          language: 'CompleteTask',
          color: 'green',
        },
        {
          value: 3,
          label: '正常',
          language: 'Normal',
          color: 'yellow',
        },
        {
          value: 4,
          label: '暂停',
          language: 'Suspend',
          color: 'red',
        },
      ],
      headerListAll: [
        {
          label: '序号',
          key: 'index',
          width: 40,
        },
        {
          label: '状态',
          key: 'phaseStatus',
          width: 32,
        },
        {
          label: '',
          key: 'label',
          width: 80,
        },
        {
          label: 'SAP工单号',
          key: 'mesOrder',
          width: 160,
        },
        {
          label: '',
          key: 'name',
          width: 160,
        },
        {
          label: '预计开始时间',
          key: 'actualStartDate',
          width: 100,
        },
        {
          label: '预计结束时间',
          key: 'actualEndDate',
          width: 100,
        },
        {
          label: '计划工时',
          key: 'planPhaseWd',
          width: 48,
        },
      ],
      selectHeaderList: [
        {
          label: '计划阶段',
          key: 'name',
          width: 150,
        },
      ],
      tempHeaderArr: [],
      tableData: [],
      showHeaderSetting: false,
      source: [],
    };
  },
  computed: {
    totalHeight() {
      // 容器内容高度
      let count = 0;
      this.tableData.forEach((item) => {
        if (!item.hide) {
          count++;
        }
      });
      return count * this.lineHeight + 44;
    },
    ganttLeftWidth() {
      let count = 0;
      this.selectHeaderList.forEach((item) => {
        count += item.width;
      });
      return count;
    },
    limitCount() {
      return this.containerHeight / this.lineHeight;
    },
    showData() {
      let endCount = 0;
      const showLength = Math.floor(this.limitCount);
      let res = [];
      let arr = this.tableData;
      for (let i = this.startIndex; i < arr.length; i++) {
        if (!arr[i].hide) {
          res.push(arr[i]);
          endCount++;
        }
        if (endCount === showLength) {
          break;
        }
      }
      return res;
    },
  },
  mounted() {
    this.getGanList();
    // this.containerHeight = document.body.clientHeight - 460;
  },
  watch: {
    ganttData: {
      handler(data) {
        this.source = data;
        //  source = data
        this.getGanList();
      },
    },
  },
  methods: {
    // 接口获取甘特图
    getGanList() {
      this.initListDate(); // 这里需要初始化一下时间
    },
    initListDate() {
      this.tableData = [];
      let that = this;
      let index = 0;
      // window.$api.instrumentReportApi.queryPhaseGanttReport({ projectOid: JSON.parse(sessionStorage.getItem('currentProject')).oid }).then((res) => {
      //   if (res.success) {
      //     that.source = res.data;
      //     solvedArr(that.source, 1);
      //   } else {
      //     that.$message.error(res.message);
      //   }
      // });
      function solvedArr(arr, level, obj) {
        arr.forEach((item) => {
          index += 1;
          item.actualStartDate = item.actualStartDate && dayjs(item.actualStartDate).format('YYYY/MM/DD');
          item.actualEndDate = item.actualEndDate && dayjs(item.actualEndDate).format('YYYY/MM/DD');
          item.targetStartDate = item.targetStartDate && dayjs(item.targetStartDate).format('YYYY/MM/DD');
          item.targetEndDate = item.targetEndDate && dayjs(item.targetEndDate).format('YYYY/MM/DD');
          item.index = index;
          item.fold = false;
          item.hide = false;
          item.level = level;
          if (obj) {
            item.father = obj.id;
            item.fatherNode = obj.name;
          } else {
            item.father = '';
            item.fatherNode = '';
          }
          that.tableData.push(item);
          // if (item.children) {
          //   solvedArr(item.children, level + 1, item);
          // }
        });
      }
      window.$api.instrumentReportApi.queryPhaseGanttReport({ projectOid: JSON.parse(sessionStorage.getItem('currentProject')).oid }).then((res) => {
        if (res.success) {
          that.source = res.data;
          // setTimeout(() => {
          solvedArr(that.source, 1);
          // }, 1000);
        } else {
          that.$message.error(res.message);
        }
      });
      // solvedArr(this.source, 1);
      setTimeout(() => {
        this.initData();
      }, 500);
    },
    initData() {
      this.start = this.getEarliestDate(this.tableData);
      this.end = this.getFarestDate(this.tableData);
      this.spendCount = this.end.diff(this.start, this.demension) + 1;
      this.tableData.forEach((item) => {
        item.fold = false;
        item.hide = false;
        item.styleLeft = (dayjs(item.targetStartDate).diff(this.start, 'day') * this.getDemensionWidth()) / this.getScale();
        item.styleLeftPlan = (dayjs(item.targetStartDate).diff(this.start, 'day') * this.getDemensionWidth()) / this.getScale();
        item.styleLeftFcast = (dayjs(item.actualStartDate).diff(this.start, 'day') * this.getDemensionWidth()) / this.getScale();
        item.styleWidth = ((dayjs(item.targetEndDate).diff(item.targetStartDate, 'day') + 1) * this.getDemensionWidth()) / this.getScale();
        item.styleWidthPlan = ((dayjs(item.targetEndDate).diff(item.targetStartDate, 'day') + 1) * this.getDemensionWidth()) / this.getScale();
        item.styleWidthFcast = ((dayjs(item.actualEndDate).diff(item.actualStartDate, 'day') + 1) * this.getDemensionWidth()) / this.getScale();
      });
    },
    formatData() {
      this.start = this.getEarliestDate(this.tableData);
      this.end = this.getFarestDate(this.tableData);
      this.spendCount = this.end.diff(this.start, this.demension) + 1;
      this.tableData.forEach((item) => {
        item.styleLeft = (dayjs(item.targetStartDate).diff(this.start, 'day') * this.getDemensionWidth()) / this.getScale();
        item.styleWidth = ((dayjs(item.targetEndDate).diff(item.targetStartDate, 'day') + 1) * this.getDemensionWidth()) / this.getScale();
        item.styleLeftPlan = (dayjs(item.targetStartDate).diff(this.start, 'day') * this.getDemensionWidth()) / this.getScale();
        item.styleLeftFcast = (dayjs(item.actualStartDate).diff(this.start, 'day') * this.getDemensionWidth()) / this.getScale();
        item.styleWidthPlan = ((dayjs(item.targetEndDate).diff(item.targetStartDate, 'day') + 1) * this.getDemensionWidth()) / this.getScale();
        item.styleWidthFcast = ((dayjs(item.actualEndDate).diff(item.actualStartDate, 'day') + 1) * this.getDemensionWidth()) / this.getScale();
      });
    },
    getScale() {
      switch (this.demension) {
        case 'year': {
          return 365;
        }
        case 'month': {
          return 30;
        }
        case 'week': {
          return 7;
        }
        case 'day': {
          return 1;
        }
      }
    },
    getDemensionWidth() {
      switch (this.demension) {
        case 'year': {
          return 1800;
        }
        case 'month': {
          return 400;
        }
        case 'week': {
          return 100;
        }
        case 'day': {
          return 40;
        }
      }
    },
    changeDemension() {
      this.spendCount = this.end.diff(this.start, this.demension) + 1;
      this.formatData();
    },
    getFarestDate(list) {
      let date;
      if (list && list.length > 0) {
        let planDate = list[0].targetEndDate && dayjs(list[0].targetEndDate);
        let fcastDate = list[0].actualEndDate && dayjs(list[0].actualEndDate);
        if (planDate || fcastDate) {
          if (!planDate) {
            date = fcastDate;
          } else if (!fcastDate) {
            date = planDate;
          } else {
            date = planDate.isBefore(fcastDate) ? fcastDate : planDate; //
          }
        }
        list.forEach((item) => {
          if (item.actualEndDate || item.targetEndDate) {
            let maxDate;
            if (!item.actualEndDate) {
              maxDate = item.targetEndDate;
            } else if (!item.targetEndDate) {
              maxDate = item.actualEndDate;
            } else {
              maxDate = dayjs(item.targetEndDate).isBefore(item.actualEndDate) ? item.actualEndDate : item.targetEndDate;
            }
            if (maxDate && date.isBefore(maxDate)) {
              date = dayjs(maxDate).startOf('day');
            }
          }
        });
      }
      return dayjs(date).endOf(this.demension);
    },
    getEarliestDate(list) {
      let date;
      if (list && list.length > 0) {
        let planDate = list[0].targetStartDate && dayjs(list[0].targetStartDate);
        let fcastDate = list[0].actualStartDate && dayjs(list[0].actualStartDate);
        if (planDate || fcastDate) {
          if (!planDate) {
            date = fcastDate;
          } else if (!fcastDate) {
            date = planDate;
          } else {
            date = planDate.isAfter(fcastDate) ? fcastDate : planDate;
          }
        }
        list.forEach((item) => {
          let minDate;
          if (item.actualStartDate || item.targetStartDate) {
            if (!item.actualStartDate) {
              minDate = item.targetStartDate;
            } else if (!item.targetStartDate) {
              minDate = item.actualStartDate;
            } else {
              minDate = dayjs(item.targetStartDate).isAfter(item.actualStartDate) ? item.actualStartDate : item.targetStartDate;
            }
          }
          if (minDate && date.isAfter(minDate)) {
            date = dayjs(minDate).startOf('day');
          }
        });
      }
      return dayjs(date).startOf(this.demension);
    },
    scrollListener() {
      const scrollLeft = this.$refs.mainContainer.scrollLeft;
      const scrollTop = this.$refs.mainContainer.scrollTop;
      if (scrollLeft > 0) {
        this.tableScrollLeft = scrollLeft;
      } else {
        this.tableScrollLeft = 0;
      }
      this.tableScrollTop = scrollTop;
      this.startIndex = Math.floor(scrollTop / this.lineHeight);
    },
    getColor(val, row) {
      if (row && (row.process || row.process === 0)) {
        return 'rgba(50, 102, 255, .2)';
      } else {
        let obj = this.legendList.find((item) => item.value === val);
        return obj?.color || '#1F1F1F';
      }
    },
    getStatus(val) {
      let obj = this.legendList.find((item) => item.value === val);
      return obj?.label || '未知';
    },
    checkChild(obj) {
      // 检测元素是否下挂children 只要看下一个元素是不是他的子
      if (!obj) return false;
      let index = this.tableData.findIndex((item) => item.id === obj.id);
      let temp = this.tableData[index + 1] ? this.tableData[index + 1] : null;
      if (temp && temp.father === obj.id) {
        return true;
      } else {
        return false;
      }
    },
    // foldRow(obj) {
    //   // 收起是收起下面所有
    //   obj.fold = true;
    //   let foldArr = [obj.id];
    //   let indexFlag = obj.index;
    //   for (let i = indexFlag; i < this.tableData.length; i++) {
    //     if (foldArr.includes(this.tableData[i].father)) {
    //       this.tableData[i].fold = true;
    //       this.tableData[i].hide = true;
    //       if (!foldArr.includes(this.tableData[i].id)) {
    //         foldArr.push(this.tableData[i].id);
    //       }
    //     } else {
    //       break;
    //     }
    //   }
    // },
    // expandRow(obj) {
    //   // 展开只展开第一级
    //   obj.fold = false;
    //   let foldVal = obj.id;
    //   let fatherVal = obj.father ? obj.father : null;
    //   let indexFlag = this.tableData.findIndex((item) => item.id === obj.id);
    //   for (let i = indexFlag + 1; i < this.tableData.length; i++) {
    //     if (foldVal === this.tableData[i].father) {
    //       this.tableData[i].fold = true;
    //       this.tableData[i].hide = false;
    //     }
    //     if (fatherVal && fatherVal === this.tableData[i].father) {
    //       break;
    //     }
    //   }
    // },
    // setHeader() {
    //   this.showHeaderSetting = true;
    //   this.tempHeaderArr = _.cloneDeep(this.selectHeaderList);
    // },
    // confirmHeader(arr) {
    //   this.selectHeaderList = arr;
    //   this.showHeaderSetting = false;
    // },
    getWeek(date) {
      if (date.startOf('year').weekday() === 0 || date.startOf('year').weekday() === 6) {
        return date.week();
      } else if (date.week() === date.endOf('year').week()) {
        return 1;
      } else {
        return date.week() + 1;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.gantt-view {
  height: calc(100% - 120px);
  padding: 12px;
  margin: 12px 0;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  background: #fff;
  .header-box {
    user-select: none;
    padding: 12px 20px;
    .layout-box {
      display: inline-block;
      padding-left: 10px;
      position: relative;
      margin-right: 32px;
    }
    .radio-box {
      display: inline-block;
      padding-left: 10px;
      position: relative;
    }
    // .layout-box::before,
    // .radio-box::before {
    //   content: '';
    //   position: absolute;
    //   top: 4px;
    //   left: 0;
    //   width: 1px;
    //   height: 24px;
    //   background-color: #d9d9d9;
    // }
    .ant-radio-button-wrapper {
      background: #fff;
    }
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
      background: #1f1f1f;
      border-color: #dbdbdb;
      color: #fff;
      box-shadow: none;
    }
    .legend-box {
      float: right;
      margin-top: 6px;
      .legend-item {
        margin-right: 20px;
        display: inline-block;
        i {
          display: inline-block;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          vertical-align: middle;
        }
      }
    }
  }
  .table-container {
    user-select: none;
    text-align: center;
    width: 100%;
    display: flex;
    overflow-y: hidden;
    display: flex;
    position: relative;
    height: 100%;
    .table-header {
      position: relative;
      width: 100%;
      .gantt-header-left {
        height: 44px;
        line-height: 44px;
        position: absolute;
        background: #f6f7f8;
        color: #1f1f1f;
        font-weight: bold;
        z-index: 3;
        .header-item {
          display: block;
          height: 100%;
          float: left;
          padding: 0 6px;
          position: relative;
          color: #1f1f1f;
          border-top: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
          border-right: 1px solid #e5e5e5;
          overflow: hidden;
        }
        .header-item1 {
          position: relative;
          z-index: 2;
          top: 0;
          left: 0;
          background: #f6f7f8;
          text-align: center;
          box-shadow: 3px 0px 3px -2px #ccc;
        }
        .header-item:last-child {
          box-shadow: 3px 0px 3px -1px #ccc;
        }
        .icon-btn {
          position: absolute;
          right: -20px;
          top: 1px;
          width: 20px;
          line-height: 18px;
          cursor: pointer;
          border: 1px solid #ddd;
          border-radius: 3px;
          text-align: center;
          display: none;
        }
        .icon-btn:hover {
          color: #1f1f1f;
        }
      }
      .gantt-header-left:hover {
        .icon-btn {
          display: block;
        }
      }
      .gantt-header-right {
        z-index: 2;
        position: absolute;
        background: #fff;
        font-size: 13px;
        width: 100%;
        .header-item {
          display: inline-block;
          height: 44px;
          line-height: 44px;
          color: #1f1f1f;
          border-top: 1px solid #d9dce1;
          .header-year {
            height: 44px;
            line-height: 44px;
            border-right: 1px solid #d9dce1;
            border-bottom: 1px solid #d9dce1;
          }
          .header-top {
            height: 22px;
            line-height: 22px;
            white-space: nowrap;
          }
          .header-top.top-end {
            visibility: visible;
            background: transparent;
            border-right: 1px solid #d9dce1;
          }
          .header-bottom {
            height: 22px;
            line-height: 22px;
            width: 100%;
            border-top: 1px solid #d9dce1;
            border-right: 1px solid #d9dce1;
            border-bottom: 1px solid #d9dce1;
          }
        }
        .header-item:last-child {
          border-right: 1px solid #d9dce1;
        }
      }
    }
    .show-container {
      position: absolute;
      display: flex;
      width: 100%;
      font-size: 13px;
      padding-top: 44px;
    }
    .gantt-left {
      flex-grow: 0;
      flex-shrink: 0;
      .gantt-item {
        position: relative;
        z-index: 2;
        top: 0;
        left: 0;
        background: #f6f7f8;
        text-align: center;
        box-shadow: 3px 0px 3px -2px #ccc;
        .table-item {
          display: block;
          height: 100%;
          float: left;
          padding: 0 6px;
          overflow: hidden;
          border-right: 1px solid #eee;
          border-bottom: 1px solid #eee;
          i {
            display: inline-block;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            vertical-align: middle;
          }
        }
        .item-name {
          text-align: left;
          padding-left: 48px;
          .space {
            width: 16px;
            height: 100%;
            display: inline-block;
            vertical-align: top;
            font-size: 13px;
          }
          .item-text {
            width: 136px;
            vertical-align: middle;
          }
        }
        .table-item.level_1 {
          padding-left: 6px;
          .item-text {
            width: 178px;
          }
        }
        .table-item.level_2 {
          padding-left: 20px;
          .item-text {
            width: 164px;
          }
        }
        .table-item.level_3 {
          padding-left: 34px;
          .item-text {
            width: 150px;
          }
        }
        .table-item.level_4 {
          padding-left: 48px;
          .item-text {
            width: 136px;
          }
        }
      }
    }
    .gantt-right {
      flex-grow: 1;
      display: inline-block;
      white-space: nowrap;
      .gantt-content {
        position: relative;
        .item-container {
          position: relative;
          top: 0;
          .gantt-item {
            height: 50px;
            line-height: 50px;
            position: relative;
            .row-item {
              position: absolute;
              top: 10px;
              height: 10px;
              line-height: 20px;
              border-radius: 15px;
              z-index: 1;
              color: #fff;
              text-shadow: 1px 1px 2px #0f0f0f;
            }
            // .row-item1 {
            //   position: absolute;
            //   top: 28px;
            //   height: 10px;
            //   line-height: 20px;
            //   border-radius: 15px;
            //   z-index: 1;
            //   color: #fff;
            //   text-shadow: 1px 1px 2px #0f0f0f;
            // }
            .row-item2 {
              position: absolute;
              top: 26px;
              height: 10px;
              line-height: 20px;
              border-radius: 15px;
              z-index: 1;
              color: #fff;
              text-shadow: 1px 1px 2px #0f0f0f;
            }
            // .row-item3 {
            //   position: absolute;
            //   top: 32px;
            //   height: 20px;
            //   line-height: 20px;
            //   border-radius: 15px;
            //   z-index: 1;
            //   color: #fff;
            //   text-shadow: 1px 1px 2px #0f0f0f;
            // }
            .item-cell {
              display: inline-block;
              border-right: 1px solid #eee;
              height: 50px;
              border-bottom: 1px solid #eee;
            }
          }
        }
      }
    }
  }
}
.time {
  height: 25px;
  line-height: 25px;
}
</style>
<style lang="less">
.ant-popover-title {
  .title-row {
    font-size: 14px;
    color: #0f0f0f;
    line-height: 40px;
    .title {
      font-weight: 600;
      display: inline-block;
    }
    .status {
      i {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        transform: translateY(-1px);
        margin-right: 6px;
      }
      float: right;
    }
  }
}
.ant-popover-inner-content {
  .form-row {
    margin-bottom: 6px;
    width: 220px;
    font-size: 12px;
    .form-label {
      color: #696969;
      width: 120px;
      display: inline-block;
    }
    .form-text {
      color: #0f0f0f;
      width: calc(100% - 120px);
      display: inline-block;
    }
  }
  .form-group {
    margin-bottom: 16px;
  }
  .form-group:last-child {
    margin-bottom: 0;
  }
}
</style>