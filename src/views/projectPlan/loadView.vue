<template>
  <div class="main-container" ref="mainContainer" v-loading="pageLoad">
    <div class="header-section">
      <div class="header-item">
        <span>时间：</span>
        <!-- <el-date-picker v-model="startTime" type="date" value-format="YYYY-MM-DD" :clearable="false" :shortcuts="shortcuts" /> -->

        <el-date-picker
          v-model="searchTime"
          @change="rangePickerChange"
          type="daterange"
          clearable
          value-format="YYYY-MM-DD"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </div>
      <!-- <div class="header-item">
        <span>结束时间：</span>
        <el-date-picker v-model="endTime" type="date" value-format="YYYY-MM-DD" :clearable="false" :shortcuts="shortcuts" />
      </div> -->
      <el-input v-model="searchVal" @input="changeSearch" :suffix-icon="Search" style="width: 220px" placeholder="请输入资源名称" />
      <div class="item-right">
        <span>资源显示：</span>
        <el-select v-model="showType">
          <el-option v-for="item in showTypeList" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
    </div>
    <div class="main-section" id="main-section">
      <!-- :wrap-style="{ scrollBehavior: 'smooth' }" -->
      <el-scrollbar v-loading="isLoading" :height="containerHeight" ref="loadViewScrollbar" @contextmenu.prevent="() => false" @scroll="scrollListener">
        <div class="table-container" id="table-container">
          <div class="table-header">
            <div class="table-header-left" :style="{ top: tableScrollTop + 'px', left: tableScrollLeft + 'px' }">
              <div v-for="(item, index) in headerItems" :key="index" :style="{ width: item.width + 'px' }" class="header-item">
                {{ item.label }}
              </div>
            </div>
            <div class="table-header-right" :style="{ width: duration * itemWidth + 'px', top: tableScrollTop + 'px', left: ganttLeftWidth + 'px' }">
              <div v-for="(item, index) in duration" :key="index" :style="{ width: itemWidth + 'px' }" class="header-item">
                <div class="header-top" :class="{ 'go-center': start.add(index, 'days').weekday() === 1, 'show-line': start.add(index, 'days').weekday() === 0 }">
                  <span>{{ start.add(index, 'days').weekday() === 1 ? start.add(index, 'days').format('YY年MM月DD日') : '' }}</span>
                </div>
                <!-- (start.add(index, 'days').weekday() === 6 && !workday.includes(start.add(index, 'days').format('YYYY-MM-DD'))) || -->
                <div
                  class="header-date"
                  :class="{
                    'is-sunday': start.add(index, 'days').weekday() === 0,
                    'is-holiday':
                      (start.add(index, 'days').weekday() === 0 && !workday.includes(start.add(index, 'days').format('YYYY-MM-DD'))) ||
                      holiday.includes(start.add(index, 'days').format('YYYY-MM-DD')),
                  }"
                >
                  {{ getWeekText(start.add(index, 'days').weekday()) }}
                </div>
              </div>
            </div>
          </div>
          <!-- 把容器撑起来 -->
          <div :style="{ height: totalHeight }"></div>
          <div class="show-container" :style="{ top: startIndex * this.lineHeight + 'px' }">
            <div class="container-left">
              <div
                v-for="(row, index) in showData"
                :key="index"
                class="gantt-item"
                :class="{ 'show-zebra': showType === '工作时段' }"
                :style="{
                  height: lineHeight + 'px',
                  lineHeight: lineHeight + 'px',
                  left: tableScrollLeft + 'px',
                }"
              >
                <div class="table-item" v-show-tip>
                  <el-tooltip :content="row.name" placement="left">
                    <span>{{ row.name }}</span>
                  </el-tooltip>
                </div>
                <div class="table-item item-time" v-show="showType !== '工作时段'">
                  <div class="tick tick1">12</div>
                  <div class="tick tick2">8</div>
                  <div class="tick tick3">4</div>
                </div>
              </div>
            </div>
            <div class="container-right">
              <div
                v-for="(row, count) in showData"
                :key="count"
                class="data-row"
                :class="{ 'show-zebra': showType === '工作时段', 'show-line': showType !== '工作时段' }"
                :style="{
                  height: lineHeight + 'px',
                  width: itemWidth * duration + 'px',
                }"
              >
                <div
                  v-for="(item, index) in duration"
                  :key="index"
                  :style="{
                    width: itemWidth + 'px',
                    height: lineHeight + 'px',
                  }"
                  :class="{
                    'is-sunday': start.add(item - 1, 'days').weekday() === 0,
                    'is-short': showType === '工作时段',
                  }"
                  class="row-item"
                >
                  <!-- 工作时段 -->
                  <div class="item-content" v-if="showType === '工作时段'" :style="{ color: getColor(row.listData[item - 1]?.hour) }">
                    <el-popover placement="top-start" title="所在项目：" trigger="hover" v-if="row.listData[item - 1]?.hour > 0">
                      <template #reference>
                        <span style="cursor: pointer">{{ row.listData[item - 1]?.hour }}</span>
                      </template>
                      <template #default>
                        <div v-for="(item, index) in getRenderVal(row, item - 1)" :key="index">{{ item }}</div>
                      </template>
                    </el-popover>
                    <span v-else>{{ row.listData[item - 1]?.hour }}</span>
                    <!-- {{ row.listData[item - 1]?.hour }} -->
                  </div>
                  <!-- 项目名称 -->
                  <div
                    v-else-if="showType === '项目名称'"
                    class="bar-content"
                    :style="{
                      height: getHeight(row.listData[item - 1]?.hour),
                      background: getColor(row.listData[item - 1]?.hour),
                    }"
                  >
                    <span
                      class="text"
                      :class="{ is_top: !!getRenderVal(row, item - 1) }"
                      :style="{
                        fontSize: '12px',
                        top: '0px',
                      }"
                      :title="getRenderVal(row, item - 1)"
                    >
                      {{ getRenderVal(row, item - 1) }}
                    </span>
                  </div>
                  <!-- 其他 -->
                  <div
                    v-else
                    class="bar-content"
                    :style="{
                      height: getHeight(row.listData[item - 1]?.hour),
                      background: getColor(row.listData[item - 1]?.hour),
                    }"
                  >
                    <el-popover placement="top-start" title="所在项目：" trigger="hover" v-if="row.listData[item - 1]?.hour > 0">
                      <template #reference>
                        <span
                          :style="{
                            transform: `translateX(${-getTransShift(row, item - 1) * 15}px)`,
                            cursor: 'pointer',
                          }"
                        >
                          {{ getRenderVal(row, item - 1) }}
                        </span>
                      </template>
                      <template #default v-if="row">
                        <div v-for="(item, index) in handListData(row)[item - 1].project" :key="index">{{ item }}</div>
                      </template>
                    </el-popover>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import { shallowRef } from 'vue';
import { Search } from '@element-plus/icons-vue';
dayjs.extend(weekday);
import * as _ from 'lodash';
import { arrSortByDate } from '@/utils/utils.js';
export default {
  name: 'loadView',
  props: {
    oid: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      Search: shallowRef(Search),
      searchTime: [],
      startTime: '2023-10-30',
      endTime: '2023-12-29',
      start: null,
      end: null,
      searchVal: '',
      showType: '百分比',
      // showTypeList: ['百分比', '工作负载', '项目名称', '工作时段'],
      showTypeList: ['百分比', '工作负载', '工作时段'],
      sourceData: [],
      isLoading: false,
      containerHeight: 0,
      itemWidth: 30,
      duration: 0,
      tableScrollTop: 0,
      tableScrollLeft: 0,
      startIndex: 0,
      filterData: [],
      holiday: [],
      workday: [],
      shortcuts: [
        {
          text: '今天',
          value: new Date(),
        },
      ],

      pageLoad: false,
      projectName: JSON.parse(sessionStorage.getItem('currentProject'))?.projectName, // 项目名称

      resourceProjectData: {},
    };
  },
  computed: {
    headerItems() {
      if (this.showType === '工作时段') {
        return [
          {
            label: '资源名称',
            width: 160,
          },
        ];
      } else {
        return [
          {
            label: '资源名称',
            width: 160,
          },
          {
            label: '工时',
            width: 56,
          },
        ];
      }
    },
    lineHeight() {
      if (this.showType === '工作时段') {
        return 36;
      } else {
        return 48;
      }
    },
    limitCount() {
      return this.containerHeight / this.lineHeight;
    },
    showData() {
      let endCount = 0;
      const showLength = Math.floor(this.limitCount);
      let res = [];
      let arr;
      if (this.searchVal) {
        arr = this.filterData;
      } else {
        arr = this.sourceData;
      }
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
    ganttLeftWidth() {
      let count = 0;
      this.headerItems.forEach((item) => {
        count += item.width;
      });
      return count;
    },
    totalHeight() {
      // 容器内容高度
      let count = 0;
      this.sourceData.forEach((item) => {
        if (!item.hide) {
          count++;
        }
      });
      return count * this.lineHeight + 10 + 'px';
    },
  },
  async mounted() {
    /**----处理时间---- */
    this.startTime = dayjs().format('YYYY-MM-DD');
    this.endTime = dayjs().add(3, 'month').format('YYYY-MM-DD');

    this.searchTime = [this.startTime, this.endTime];

    // 计算开始时间，开始时间为周一
    let now = new Date();
    let nowTime = now.getTime();
    let day = now.getDay();
    let oneDayTime = 24 * 60 * 60 * 1000;
    // 计算开始时间，开始时间为周一
    let MondayTime = nowTime - (day - 1) * oneDayTime;
    let monday = dayjs(new Date(MondayTime)).format('YYYY-MM-DD');
    // 计算结束时间，结束时间为周日
    let endDateTime = dayjs(this.endTime).valueOf();
    let SundayTime = endDateTime + (7 - (day + 1)) * oneDayTime;
    let Sunday = dayjs(SundayTime).format('YYYY-MM-DD');
    let timeObj = {
      startTime: monday,
      endTime: Sunday,
    };

    // 获取资源负载--项目维度数据
    await this.getProjectData();

    /**请求数据 */
    this.pageLoad = true;
    let soruceArr = await this.getResourceAllData(timeObj);

    let handArr = [];
    soruceArr.forEach((v) => {
      let obj = {};
      let keysArr = Object.keys(v).filter((m) => m.includes('PIResource'));
      let activeKeys = Object.keys(v[keysArr[0]]);
      this.duration = activeKeys.length;

      let activeObj = v[keysArr[0]][activeKeys[0]];
      obj.name = activeObj.resourceName + ' (' + activeObj.resourceShortName + ')';
      obj.id = activeObj.resourceOid;
      obj.listData = [];
      for (let dataKey in v[keysArr[0]]) {
        let dataObj = { date: '', hour: 0, project: '', percent: '' };
        dataObj.date = dataKey;
        dataObj.hour = v[keysArr[0]][dataKey].planHourQty;
        dataObj.project = this.projectName;
        dataObj.percent = Math.round((dataObj.hour * 100) / v[keysArr[0]][dataKey].normalHourQty) + '%';
        obj.listData.push(dataObj);
      }
      obj.listData.sort(arrSortByDate('date', true));
      handArr.push(obj);
    });
    this.pageLoad = false;
    /**赋值时间 */
    this.start = dayjs(monday);
    this.end = dayjs(Sunday);
    // this.initData();
    this.$nextTick(() => {
      this.containerHeight = this.$refs.mainContainer.offsetHeight - 50;
      this.sourceData = handArr;

      /**动态计算宽度 */
      let dom = document.getElementById('main-section');
      if (this.duration * 30 >= dom.offsetWidth - 216) {
        this.itemWidth = 30;
      } else {
        this.itemWidth = (dom.offsetWidth - 216) / this.duration;
      }
    });

    
  },
  methods: {
    // 鼠标滚轮事件横向滚动
    // changeScroll(e) {
    // let wrap = this.$refs.loadViewScrollbar;
    // const wheelDelta = e.wheelDelta || -e.deltaY * 40;
    // wrap.setScrollLeft(wrap.wrapRef.scrollLeft - wheelDelta);
    // },

    // 获取资源负载数据
    async getProjectData() {
      let obj = {
        oid: this.oid,
        startTime: this.searchTime[0],
        endTime: this.searchTime[1],
      };
      await window.$api.planApi.getResourceLoading({ form: JSON.stringify(obj) }).then((res) => {
        if (res.success) {
          this.resourceProjectData = res.data;
        } else {
          window.$message.error(res.message);
        }
      });
    },

    /**处理数据 */
    handProjectData(row) {
      let arr = this.resourceProjectData[row.id];
      return arr;
    },

    /**当前任务距离开始时间距离天数 */
    getRangeTime(item) {
      return dayjs(item.targetStartDate).diff(this.start, 'days');
    },
    /**当前任务天数 */
    getDays(item) {
      return dayjs(item.targetEndDate).diff(dayjs(item.targetStartDate), 'days') + 1;
    },

    /**获取总数据 */
    async getResourceAllData(timeObj) {
      let arr = [];
      let obj = {
        oid: this.oid,
        startTime: timeObj.startTime,
        endTime: timeObj.endTime,
      };
      await window.$api.planApi.getResourceLoadingAllInfo({ form: JSON.stringify(obj) }).then((res) => {
        if (!res.success) return window.$message.error('查询失败');
        arr = res.data;
      });
      return arr;
    },

    scrollListener(obj) {
      const scrollTop = obj.scrollTop;
      const scrollLeft = obj.scrollLeft;
      if (scrollLeft > 0) {
        this.tableScrollLeft = scrollLeft;
      } else {
        this.tableScrollLeft = 0;
      }
      this.tableScrollTop = scrollTop;
      this.startIndex = Math.floor(scrollTop / this.lineHeight);
    },
    // initData() {
    //   // 天数
    //   this.duration = this.end.diff(this.start, 'days') + 1;
    // },
    getWeekText(val) {
      switch (val) {
        case 1: {
          return '一';
        }
        case 2: {
          return '二';
        }
        case 3: {
          return '三';
        }
        case 4: {
          return '四';
        }
        case 5: {
          return '五';
        }
        case 6: {
          return '六';
        }
        case 0: {
          return '日';
        }
        default: {
          return '';
        }
      }
    },
    getColor(val) {
      if (val <= 8) {
        return '#3DBD7D';
      } else if (val <= 12) {
        return '#F68800';
      } else {
        return '#F02323';
      }
    },
    getHeight(val) {
      let percent = Math.round((val * 100) / 16);
      if (percent > 100) {
        return `calc(100% - 1px)`;
      } else {
        return `calc(${Math.round((val * 100) / 16)}% - 1px)`;
      }
    },

    /**处理数据 */
    handListData(list) {
      let arr = this.resourceProjectData[list.id];
      if (arr.length === 0) return;
      let dateArr = [];
      arr.forEach((e) => {
        dateArr.push(dayjs(e.targetStartDate));
        dateArr.push(dayjs(e.targetEndDate));
      });
      let minDate = Math.min(...dateArr);
      let maxDate = Math.min(...dateArr);
      let copyArr = _.cloneDeep(list.listData);
      copyArr.forEach((v) => {
        v.projectName = [];
        arr.forEach((el) => {
          if (v.hour > 8 && (minDate >= dayjs(v.date).valueOf() || maxDate <= dayjs(v.date).valueOf())) {
            v.projectName.push(el.projectName);
          }
        });
        v.project = v.projectName.length > 0 ? this.uniqueArray(v.projectName) : [v.project];
      });
      return copyArr;
    },
    // 数组去重
    uniqueArray(array) {
      return [...new Set(array)];
    },

    getRenderVal(list, index) {
      let data = this.handListData(list);
      if (data[index + 1]) {
        if (data[index].hour > 0) {
          if (this.showType === '百分比') {
            if (data[index].percent === data[index + 1].percent) {
              return '';
            } else {
              // 不同才展示
              return data[index].percent;
            }
          } else if (this.showType === '工作负载') {
            if (data[index].hour === data[index + 1].hour) {
              return '';
            } else {
              // 不同才展示
              return data[index].hour + 'h';
            }
          } else if (this.showType === '项目名称') {
            let data = this.handListData(list);
            if (data[index].hour > 0 && data[index].hour !== data[index - 1].hour) {
              return data[index].project;
            }
            // if (data[index].hour > 0 || data[index].project !== data[index - 1].project) {
            //   return data[index].project;
            // }
            // if (data[index].project === data[index + 1].project) {
            //   return '';
            // } else {
            //   // 不同才展示
            //   return data[index].project;
            // }
          } else if (this.showType === '工作时段') {
            if (data[index].hour > 0) {
              return data[index].project;
            }
          }
        } else {
          return '';
        }
      } else {
        // 最后一个了
        if (list.listData[index].hour > 0) {
          if (this.showType === '百分比') {
            return list.listData[index].percent;
          } else if (this.showType === '工作负载') {
            return list.listData[index].hour + 'h';
          } else if (this.showType === '项目名称') {
            let data = this.handListData(list);
            return data[index].project;
          }
        } else {
          return '';
        }
      }
    },

    getTextWidth(obj, index) {
      if (obj.listData[index].hour > 0) {
        if (this.showType === '项目名称') {
          let arr = [];
          this.resourceProjectData[obj.id].forEach((el) => {
            arr.push(el.targetStartDate);
            arr.push(el.targetEndDate);
          });
          arr.sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf());
        }
      }
    },

    getTransShift(obj, index) {
      let data = [];
      if (this.showType === '项目名称') {
        data = this.handListData(obj);
      }
      let newData = this.showType === '项目名称' ? data : obj.listData;
      let count = 0;
      let val = '';
      let key = '';
      if (this.showType === '百分比') {
        val = newData[index].percent;
        key = 'percent';
      } else if (this.showType === '工作负载') {
        val = newData[index].hour;
        key = 'hour';
      } else if (this.showType === '项目名称') {
        val = newData[index].project;
        key = 'project';
      }
      const checkSame = (idx) => {
        if (newData[idx] && newData[idx][key] === val) {
          count++;
          checkSame(idx - 1);
        }
      };
      checkSame(index - 1);
      return count;
    },

    /**表头input过滤 */
    changeSearch(val) {
      let arr = _.cloneDeep(this.sourceData);
      this.filterData = [];
      this.filterData = arr.filter((v) => v.name.includes(val));
    },
    /**表头时间过滤 */
    rangePickerChange(val) {
      let arr = _.cloneDeep(this.sourceData);
      if (val && val?.length > 0) {
        this.filterData = arr.map((el) => {
          el.listData = el.listData.filter((v) => dayjs(v['date']).isSameOrAfter(val[0]) && dayjs(v['date']).isSameOrBefore(val[1]));
          return el;
        });
        if (this.filterData.length > 0) {
          this.duration = this.filterData[0].listData.length;
        }
      } else {
        this.filterData = arr;
      }

      let dom = document.getElementById('main-section');
      if (this.duration * 30 >= dom.offsetWidth - 216) {
        this.itemWidth = 30;
      } else {
        this.itemWidth = (dom.offsetWidth - 216) / this.duration;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .header-section {
    margin-bottom: 16px;
    .header-item {
      display: inline-block;
      margin-right: 12px;
    }
    .item-right {
      float: right;
    }
  }
  .main-section {
    position: relative;
    width: 100%;
    .table-container {
      user-select: none;
      width: 100%;
      position: relative;
      .table-header {
        position: relative;
        width: 100%;
        .table-header-left {
          height: 50px;
          line-height: 50px;
          background: #f6f6f6;
          color: #1f1f1f;
          z-index: 8;
          font-size: var(--el-font-size-base);
          display: inline-block;
          position: relative;
          .header-item {
            display: block;
            height: 100%;
            float: left;
            padding: 0 6px;
            text-align: center;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #ddd;
            border-right: 1px solid #eee;
            overflow: hidden;
          }
        }
        .table-header-right {
          z-index: 7;
          position: absolute;
          background: #fff;
          .header-item {
            display: inline-block;
            height: 50px;
            .header-top {
              white-space: nowrap;
              height: 25px;
              line-height: 24px;
              font-size: var(--el-font-size-small);
              border-top: 1px solid #eee;
              text-align: center;
            }
            .show-line {
              border-right: 1px solid #dcdcdc;
            }
            .go-center {
              span {
                display: block;
                transform: translateX(62px);
              }
            }
            .header-date {
              height: 25px;
              line-height: 24px;
              width: 100%;
              text-align: center;
              font-size: var(--el-font-size-small);
              border-top: 1px solid #eee;
              border-right: 1px solid #eee;
              border-bottom: 1px solid #eee;
              position: relative;
            }
            .is-sunday {
              border-right: 1px solid #dcdcdc;
            }
            .is-holiday {
              background: #e8f0fd;
            }
          }
          .header-item:last-child {
            .header-top {
              border-right: 1px solid #eee;
            }
          }
        }
      }
      .show-container {
        position: absolute;
        width: 100%;
        white-space: nowrap;
        padding-top: 50px;
        vertical-align: top;
        .container-left {
          display: inline-block;
          vertical-align: top;
          .gantt-item {
            position: relative;
            z-index: 5;
            top: 0;
            left: 0;
            background: #fff;
            transition: height ease-in 0.3s, background-color ease-in 0.3s;
            .table-item {
              height: 100%;
              width: 160px;
              float: left;
              padding: 0 12px;
              overflow: hidden;
              border-right: 1px solid #eee;
              border-bottom: 1px solid #eee;
            }
            .item-time {
              width: 56px;
              position: relative;
              .tick {
                position: absolute;
                height: 12px;
                padding-right: 10px;
                text-align: right;
                line-height: 12px;
                right: 0;
                font-size: var(--el-font-size-extra-small);
              }
              .tick1 {
                top: 6px;
              }
              .tick::before {
                content: '';
                display: block;
                position: absolute;
                width: 8px;
                height: 1px;
                right: 0;
                top: 5px;
                background: #ccc;
              }
              .tick2 {
                top: 18px;
              }
              .tick3 {
                top: 30px;
              }
            }
            .table-item:first-child {
              border-left: 1px solid #eee;
            }
          }
          .show-zebra:nth-child(2n) {
            background: #f6f9fe;
          }
        }
        .container-right {
          white-space: nowrap;
          display: inline-block;
          .data-row {
            border-bottom: 1px solid #eee;
            position: relative;
            .row-item {
              display: inline-block;
              transition: height ease-in 0.3s;
              position: relative;
              .item-content {
                text-align: center;
                line-height: 35px;
              }
              .bar-content {
                position: absolute;
                bottom: 1px;
                left: 0;
                width: 100%;
                color: #fff;
                font-size: var(--el-font-size-small);
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                text-align: center;
                max-height: 100%;
                .text {
                  z-index: 100;
                  color: #000;
                }
                .is_top {
                  position: absolute;
                  // top: 0;
                  overflow: hidden;
                  display: inline-block;
                }
              }
            }
            .row-item:last-child {
              border-right: 1px solid #eee;
            }
            .projcet_bar:last-child {
              border-right: 0;
            }
            .projcet_bar {
              position: absolute;
            }
            // .show-line::after {
            //   content: '';
            //   position: absolute;
            //   left: 0;
            //   width: 100%;
            //   top: 23px;
            //   height: 1px;
            //   background: #386bd7;
            // }
            .is-short {
              border-right: 1px solid #eee;
            }
            .is-sunday {
              border-right: 1px solid #dcdcdc;
            }
          }
          .show-line::after {
            content: '';
            position: absolute;
            left: 0;
            width: 100%;
            top: 23px;
            height: 1px;
            background: #386bd7;
          }
          .show-zebra:nth-child(2n) {
            background: #f6f9fe;
            transition: background-color ease-in 0.3s;
          }
        }
      }
    }
  }
}
</style>
