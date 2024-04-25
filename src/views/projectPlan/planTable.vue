<template>
  <div class="main-container page_common" ref="mainContainer">
    <!-- 左侧展开收缩箭头 -->
    <!-- <div
      class="fold-btn"
      :class="{
        'to-center': showResourceLoad,
      }"
      :style="{
        left: ganttLeftWidth + 10 + 'px',
      }"
      v-if="isBaseLineDetail && showGantt"
    >
      <el-tooltip v-if="!leftFold" content="收起" placement="top">
        <el-icon @click="foldLeft(true)"><CaretLeft /></el-icon>
      </el-tooltip>
      <el-tooltip v-else content="展开" placement="top">
        <el-icon @click="foldLeft(false)"><CaretRight /></el-icon>
      </el-tooltip>
    </div> -->
    <!-- 按钮&搜索 -->
    <section class="header-box" v-if="isBaseLineDetail">
      <el-row>
        <el-col :span="24">
          <div class="title">{{ projectName }}</div>
        </el-col>
        <el-col :span="12">
          <el-space>
            <el-button @click="onSave">保存</el-button>
            <el-button @click="onFoldAll">{{ flodStatus ? '收起计划' : '展开计划' }}</el-button>
            <el-button @click="onUrge">催办</el-button>
            <el-button @click="onUpdate" v-permission="'/plmProject/UP'">更新进度</el-button>
            <el-button @click="onResourceLoad" :type="showResourceLoad ? 'primary' : ''">资源负载</el-button>
            <el-button @click="pubTask">发布任务</el-button>
            <el-button @click="deleteTask">删除任务</el-button>
            <el-dropdown>
              <el-button>
                更多
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <!-- <el-dropdown-item @click="createTask">创建新计划</el-dropdown-item> -->
                  <el-button class="permissionBtnCss" v-permission="'/plmProject/EditPlan'" @click="onCreatePlan">创建计划</el-button>
                  <el-button class="permissionBtnCss" v-permission="'/plmProject/EditPlan'" @click="showImportDialog">导入计划</el-button>
                  <el-button class="permissionBtnCss" @click="onExport">导出计划</el-button>
                  <el-button class="permissionBtnCss" v-permission="'/plmProject/EditPlan'" @click="copyPlan">从其他项目复制</el-button>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-space>
        </el-col>
        <el-col :span="12" style="display: flex; justify-content: flex-end">
          <el-space class="right_button">
            <el-radio-group v-model="demension" @change="changeDemension" v-if="showGantt">
              <el-radio-button label="day">日</el-radio-button>
              <el-radio-button label="week">周</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
            </el-radio-group>
            <span v-if="showGantt">
              <el-tooltip :content="leftFold ? '展开甘特图' : '收起甘特图'" placement="top">
                <el-button @click="foldLeft(!leftFold)">
                  <el-icon>
                    <DArrowLeft v-if="leftFold" />
                    <DArrowRight v-else />
                  </el-icon>
                </el-button>
              </el-tooltip>
            </span>
            <el-button :type="showGantt ? 'primary' : 'default'" @click="toggleGantt"><i class="iconfont icon-gantetu"></i></el-button>
            <el-button @click="summaryDeliverables">交付结果</el-button>
            <!-- v-if="!leftFold && isBaseLineDetail" -->
            <el-tooltip content="设置表头" placement="top" v-if="!showGantt">
              <el-button style="adding: 0px; width: 34px" @click="setHeader">
                <el-icon size="18"><Setting /></el-icon>
              </el-button>
            </el-tooltip>
          </el-space>
        </el-col>
      </el-row>
    </section>
    <!-- 表格主体 :wrap-style="{
        scrollBehavior: 'smooth',
      }"-->
    <el-scrollbar v-loading="isLoading" :height="containerHeight" ref="scrollbarRef" @contextmenu.prevent="() => false" @scroll="scrollListener">
      <div class="table-container" id="table-container">
        <!-- 表头 -->
        <div class="table-header">
          <div
            class="gantt-header-left"
            :class="{ 'is-fold': leftFold, 'table-mode': !showGantt }"
            :style="{
              width: showGantt ? ganttLeftWidth + 'px' : tableWidth,
              left: tableWidth === '100%' ? tableScrollLeft + 'px' : '',
              top: tableScrollTop + 'px',
            }"
          >
            <div class="header-item item-tiny">
              <el-checkbox @change="onCheckAll" v-model="checkAll" :indeterminate="indeterminateFlag" />
            </div>
            <div v-for="(item, idx) in headerShowList" :key="idx" :style="{ width: item.width + 'px' }" class="header-item">
              {{ item.label }}
              <el-popover placement="bottom" :width="item.filterType === 'input' ? 260 : 380" trigger="click" :visible="activeFilterKey === item.key">
                <span>
                  <el-date-picker
                    v-model="item.rangeVal"
                    @change="(val) => rangePickerChange(val, item)"
                    type="daterange"
                    v-if="item.filterType === 'date'"
                    clearable
                    value-format="YYYY-MM-DD"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                  />
                </span>
                <span>
                  <el-input
                    placeholder="请输入搜索关键词"
                    :suffix-icon="Search"
                    @input="(val) => changeSearch(val, item)"
                    @blur="searchConfirm"
                    clearable
                    v-model="item.searchVal"
                    v-if="item.filterType === 'input'"
                  ></el-input>
                </span>
                <template #reference>
                  <span>
                    <el-icon class="icon-filter" v-if="item.filter">
                      <Filter @click="showFilter(item)" :color="getIconColor(item)" />
                    </el-icon>
                  </span>
                </template>
              </el-popover>
            </div>
            <!-- <div class="icon-btn" @click="setHeader" v-if="!leftFold && isBaseLineDetail">
              <el-icon size="18"><Setting /></el-icon>
            </div> -->
          </div>
          <!-- 甘特图头部 -->
          <div
            class="gantt-header-right"
            v-if="showGantt"
            :style="{
              width: spendCount * getDemensionWidth() + 'px',
              top: tableScrollTop + 'px',
              left: ganttLeftWidth + 'px',
            }"
          >
            <template v-if="demension === 'day'">
              <div v-for="(item, index) in spendCount" :key="index" :style="{ width: getDemensionWidth() + 'px' }" class="header-item">
                <div
                  class="header-top"
                  :class="{
                    monthEnd: start.add(index + 1, 'days').date() === 1 || start.add(index, 'days').format('YYYY-MM-DD') === end.format('YYYY-MM-DD'),
                  }"
                >
                  {{ start.add(index, 'days').date() === 15 ? start.add(index, 'days').format('YYYY-MM') : '' }}
                </div>
                <div class="header-date">
                  {{ start.add(index, 'days').format('DD') === '01' ? start.add(index, 'days').format('MM/DD') : start.add(index, 'days').format('DD') }}
                </div>
              </div>
            </template>
            <template v-if="demension === 'week'">
              <div v-for="(item, index) in spendCount" :key="index" class="header-item" :style="{ width: getDemensionWidth() + 'px' }">
                <div
                  class="header-top"
                  :class="{
                    monthEnd: start.add(index - 1, 'week').month() !== start.add(index, 'week').month(),
                  }"
                >
                  {{
                    start.add(index - 3, 'week').month() !== start.add(index, 'week').month() &&
                    start.add(index - 2, 'week').month() === start.add(index, 'week').month() &&
                    start.add(index - 1, 'week').month() === start.add(index, 'week').month()
                      ? start.add(index, 'week').format('YYYY年M月')
                      : ''
                  }}
                </div>
                <div class="header-date">{{ getWeek(start.add(index, 'week')) }}周</div>
              </div>
            </template>
            <template v-if="demension === 'month'">
              <div v-for="(item, index) in spendCount" :key="index" class="header-item" :style="{ width: getDemensionWidth() + 'px' }">
                <div
                  class="header-top"
                  :class="{
                    monthEnd: start.add(index + 1, 'month').quarter() !== start.add(index, 'month').quarter(),
                  }"
                >
                  {{
                    start.add(index - 1, 'month').quarter() === start.add(index, 'month').quarter() &&
                    start.add(index + 1, 'month').quarter() === start.add(index, 'month').quarter()
                      ? start.add(index, 'month').format('YYYY年 第') + start.add(index, 'month').quarter() + '季度'
                      : ''
                  }}
                </div>
                <div class="header-date">
                  {{ start.add(index, 'month').format('M月') }}
                </div>
              </div>
            </template>
          </div>
        </div>
        <!-- 表内容--把容器撑起来 -->
        <div :style="{ height: totalHeight }"></div>
        <!-- 表格数据内容 -->
        <div class="show-container" :style="{ top: startIndex * lineHeight + 'px', width: tableWidth }">
          <div class="gantt-left" :style="{ width: showGantt ? ganttLeftWidth + 'px' : tableWidth }">
            <div
              v-for="(row, index) in showData"
              :key="index"
              class="gantt-item"
              :class="{
                'table-mode': !showGantt,
                divider: checkDivider(row, index),
                is_acive: !row.check ? (showMenu ? checkActive(row, index) : '') : true,
              }"
              :style="{
                height: lineHeight + 'px',
                lineHeight: lineHeight + 'px',
                left: tableWidth === '100%' ? tableScrollLeft + 'px' : '',
                width: showGantt ? ganttLeftWidth + 'px' : tableWidth,
              }"
              @contextmenu.prevent="openMenu($event, row)"
            >
              <div class="table-item item-tiny">
                <el-checkbox v-model="row.check" @change="onCheckItem($event, row)" />
              </div>
              <template v-for="item in headerShowList" :key="item.key">
                <div v-if="item.key === 'index' && !leftFold" :style="{ width: item.width + 'px' }" class="table-item">
                  {{ row.lineNumber }}
                </div>
                <div
                  class="table-item table-name"
                  :class="['level_' + row.level, !row.taskOid ? 'is-new' : '']"
                  @click="scrollAim(row)"
                  v-else-if="item.key === 'taskName'"
                  :style="{ width: item.width + 'px' }"
                >
                  <el-icon class="table-btn" @click="foldRow(row)" v-if="!row.fold && checkChild(row)"><ArrowDown /></el-icon>
                  <el-icon class="table-btn" @click="expandRow(row)" v-else-if="row.fold && checkChild(row)"><ArrowRight /></el-icon>
                  <span v-else class="space"></span>
                  <span class="item-text" :class="{ isParent: checkChild(row) }" v-show-tip>
                    <el-icon class="flag-icon" v-if="row.activityType === 'Milestone'"><Flag /></el-icon>
                    <el-tooltip placement="top" effect="light" :content="row.taskName">
                      {{ row.taskName }}
                    </el-tooltip>
                  </span>
                </div>
                <div v-else-if="item.key === 'leader' && !leftFold" :style="{ width: item.width + 'px' }" class="table-item">
                  <template v-if="activeObj && row.uid === activeObj.uid && editFlag === 'leader'">
                    <el-select v-model="row.leader" size="small" style="width: 85%" filterable :ref="'leaderSelect' + row.uid" @change="editInfoConfirm" @blur="editInfoConfirm">
                      <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </template>
                  <template v-else>
                    <span>{{ getLeaderVal(row.leader) }}</span>
                    <el-icon v-permission="'/plmProject/EditPlan'" class="hover-icon" v-if="!checkChild(row) && isBaseLineDetail && checkBtnAuth(row)" @click="onEditLeader(row)">
                      <Edit />
                    </el-icon>
                  </template>
                </div>
                <div v-else-if="item.key === 'actualReviewer' && !leftFold" :style="{ width: item.width + 'px' }" class="table-item">
                  <template v-if="activeObj && row.uid === activeObj.uid && editFlag === 'actualReviewer'">
                    <el-select
                      v-model="row.actualReviewer"
                      size="small"
                      style="width: 85%"
                      filterable
                      :ref="'leaderSelect' + row.uid"
                      @change="editInfoConfirm"
                      @blur="editInfoConfirm"
                    >
                      <el-option v-for="item in reviewerList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </template>
                  <template v-else>
                    <span>{{ getReviewerVal(row.actualReviewer) }}</span>
                    <el-icon v-permission="'/plmProject/EditPlan'" v-if="!checkChild(row) && isBaseLineDetail && checkBtnAuth(row)" class="hover-icon" @click="onEditReviewer(row)">
                      <Edit />
                    </el-icon>
                  </template>
                </div>
                <div v-else-if="item.key === 'editor' && !leftFold" :style="{ width: item.width + 'px' }" class="table-item">
                  <template v-if="activeObj && row.uid === activeObj.uid && editFlag === 'editor'">
                    <el-select
                      v-model="row.editor"
                      size="small"
                      style="width: 85%"
                      filterable
                      :ref="'editorSelect' + row.uid"
                      @change="editorChangeConfirm"
                      @blur="editorChangeConfirm"
                    >
                      <el-option v-for="item in reviewerList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </template>
                  <template v-else>
                    <span>{{ getReviewerVal(row.editor) }}</span>
                    <el-icon v-permission="'/plmProject/EditPlan'" v-if="isBaseLineDetail && checkBtnAuth(row)" class="hover-icon" @click="onEditEditor(row)"><Edit /></el-icon>
                  </template>
                </div>
                <div
                  v-else-if="item.key === 'deliverable' && !leftFold"
                  :style="{ width: item.width + 'px' }"
                  :class="{ 'long-item': !showGantt }"
                  class="table-item item-deliverable hover-item"
                >
                  <el-popover placement="top-start" :width="220" trigger="hover" popper-class="deliverable-popper" v-if="row.deliverable.length > 1">
                    <template #reference>
                      <span class="text-left">{{ row.deliverable ? (row.deliverable[0] ? row.deliverable[0] : '') : '' }}</span>
                    </template>
                    <template #default>
                      <div class="deliverable-item" v-for="(item, index) in row.deliverable" :key="index">
                        {{ item }}
                      </div>
                    </template>
                  </el-popover>
                  <span class="text-left" v-else v-show-tip>
                    <el-tooltip placement="top" effect="light" :content="row.deliverable ? row.deliverable.join() : ''">
                      <span>{{ row.deliverable ? row.deliverable.join() : '' }}</span>
                    </el-tooltip>
                    <span>{{ row.deliverable.length > 1 ? row.deliverable : '' }}</span>
                  </span>
                  <span :class="row.deliverable.length > 1 ? 'number_count' : ''">{{ row.deliverable.length > 1 ? row.deliverable.length : '' }}</span>
                  <el-icon class="hover-hide" v-if="row.deliverable.length > 1"><MoreFilled /></el-icon>
                  <i
                    :class="[row.deliverable.length > 1 ? 'icon-duowenjian' : 'icon-danwenjian']"
                    @click="editDeliverable(row)"
                    v-if="row.activityType !== 'WBS'"
                    class="iconfont icon-btn"
                  ></i>
                </div>
                <div v-else-if="item.key === 'start' && !leftFold" :style="{ width: item.width + 'px' }" class="table-item">
                  <template v-if="activeObj && row.uid === activeObj.uid && editFlag === 'start'">
                    <el-date-picker
                      v-model="row.start"
                      type="date"
                      size="small"
                      style="width: 85%"
                      :ref="'dateInput' + row.uid"
                      value-format="YYYY-MM-DD"
                      :prefix-icon="null"
                      :clearable="false"
                      :shortcuts="shortcuts"
                      @blur="onEditStartConfirm"
                      @keyup.enter="onEditStartConfirm"
                    />
                  </template>
                  <template v-else>
                    {{ row.start }}
                    <el-icon
                      v-permission="'/plmProject/EditPlan'"
                      v-if="checkBtnAuth(row)"
                      v-show="!checkChild(row) && (!row.previous || row.previous.length === 0) && isBaseLineDetail"
                      class="hover-icon"
                      @click="onEditStart(row)"
                    >
                      <Edit />
                    </el-icon>
                  </template>
                </div>
                <div v-else-if="item.key === 'duration' && !leftFold" :style="{ width: item.width + 'px' }" class="table-item">
                  <template v-if="activeObj && row.uid === activeObj.uid && editFlag === 'duration'">
                    <el-input-number
                      :controls="false"
                      style="width: 46px"
                      v-model="row.duration"
                      @blur="onEditDurationConfirm"
                      @keyup.enter="onEditDurationConfirm"
                      :ref="'numberInput' + row.uid"
                      size="small"
                    ></el-input-number>
                  </template>
                  <template v-else>
                    {{ row.duration }}
                    <el-icon
                      v-permission="'/plmProject/EditPlan'"
                      v-if="checkBtnAuth(row)"
                      v-show="!checkChild(row) && isBaseLineDetail"
                      class="hover-icon"
                      @click="onEditDuration(row)"
                    >
                      <Edit />
                    </el-icon>
                  </template>
                </div>
                <div v-else-if="item.key === 'deadline'" :style="{ width: item.width + 'px' }" class="table-item">
                  <template v-if="activeObj && row.uid === activeObj.uid && editFlag === 'end'">
                    <el-date-picker
                      v-model="row.deadline"
                      type="date"
                      size="small"
                      style="width: 85%"
                      :ref="'dateInput' + row.uid"
                      value-format="YYYY-MM-DD"
                      :prefix-icon="null"
                      :clearable="false"
                      :shortcuts="shortcuts"
                      @blur="onEditDeadlineConfirm"
                      @keyup.enter="onEditDeadlineConfirm"
                    />
                  </template>
                  <template v-else>
                    {{ row.deadline }}
                    <el-icon
                      v-permission="'/plmProject/EditPlan'"
                      v-if="checkBtnAuth(row)"
                      v-show="!checkChild(row) && (!row.previous || row.previous.length === 0) && isBaseLineDetail"
                      class="hover-icon"
                      @click="onEditEnd(row)"
                    >
                      <Edit />
                    </el-icon>
                  </template>
                </div>
                <div v-else-if="item.key === 'previous'" class="table-item" :style="{ width: item.width + 'px' }">
                  <el-popover placement="top-start" :width="200" trigger="hover" popper-class="deliverable-popper">
                    <template #reference>
                      <span class="text-previous">{{ row.previous ? (row.previous[0] ? getTaskVal(row.previous[0].id) : '') : '' }}</span>
                    </template>
                    <template #default>
                      <div class="deliverable-item" v-for="(item, index) in row.previous" :key="index">
                        {{ getTaskVal(item.id) }}
                      </div>
                    </template>
                  </el-popover>
                </div>
                <div v-else-if="item.key === 'healthStatus'" class="table-item" :style="{ width: item.width + 'px' }">
                  <div
                    class="health-wrapper"
                    :style="{
                      backgroundColor: getHealthColor(row.healthStatus),
                    }"
                  />
                </div>
                <div :style="{ width: item.width + 'px' }" class="table-item" v-else>
                  {{ Array.isArray(row[item.key]) ? row[item.key].join() : row[item.key] }}
                </div>
              </template>
            </div>
            <el-empty v-if="tableData.length === 0" :style="{ position: 'relative', left: tableScrollLeft + 'px' }">
              <el-button size="small" :icon="Plus" @click="onCreatePlan">创建计划</el-button>
            </el-empty>
          </div>
          <!-- </div> -->
          <!-- 甘特图内容 -->
          <div class="gantt-right" v-if="showGantt">
            <div class="gantt-contaner" :style="{ width: spendCount * getDemensionWidth() + 'px' }">
              <svg :width="svgCfg.width" :height="svgCfg.height" class="gantt-svg">
                <defs>
                  <marker id="arrow1" markerUnits="strokeWidth" markerWidth="5" markerHeight="4" refX="0" refY="2" orient="auto">
                    <path d="M 0 0 L 5 2 L 0 4 z" />
                  </marker>
                </defs>
                <path
                  v-for="(item, index) in arrowArr"
                  :key="index"
                  :d="item.path"
                  stroke="#FF8C00"
                  stroke-width="1.6"
                  class="arrow-path"
                  fill="none"
                  style="marker-end: url(#arrow1)"
                />
              </svg>
              <div ref="containerBox" class="item-container">
                <!-- ((start.add(index, 'days').weekday() === 6 && !workday.includes(start.add(index, 'days').format('YYYY-MM-DD'))) ||
                        (start.add(index, 'days').weekday() === 0 && !workday.includes(start.add(index, 'days').format('YYYY-MM-DD'))) || -->
                <div
                  v-for="(item, index) in spendCount"
                  :key="index"
                  :style="{
                    width: getDemensionWidth() + 'px',
                    left: index * getDemensionWidth() + 'px',
                  }"
                  class="divider"
                  :class="{
                    weekend: demension === 'day' && holiday.includes(start.add(index, 'days').format('YYYY-MM-DD')),
                    current:
                      (demension === 'day' && start.add(index, 'days').format('YYYY-MM-DD') === currentDay.format('YYYY-MM-DD')) ||
                      (demension === 'week' && start.add(index, 'week').week() === currentDay.week()) ||
                      (demension === 'month' && start.add(index, 'month').month() === currentDay.month()),
                  }"
                ></div>
                <div
                  v-for="(row, count) in showData"
                  :key="count"
                  v-show="!row.hide"
                  class="gantt-item"
                  :class="{
                    'row-divider': checkDivider(row, count),
                  }"
                  :style="{
                    height: lineHeight + 'px',
                  }"
                >
                  <div
                    :id="row.uid + '_' + count"
                    :ref="'item_' + row.uid"
                    class="row-item"
                    @dblclick="onEditTask(row)"
                    :title="row.taskName"
                    :class="['level_' + row.level]"
                    :style="{ left: row.styleLeft + 'px', width: row.styleWidth + 'px' }"
                  >
                    <el-icon class="flag-icon" v-if="row.activityType === 'Milestone'"><Flag /></el-icon>
                    {{ row.taskName }}({{ row.duration }}天)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <!-- 资源负载 -->
    <transition name="up-fade">
      <div
        :style="{
          height: loadViewHeight + 'px',
        }"
        class="bottom-container"
        v-if="showResourceLoad"
      >
        <load-view :oid="resourceOid"></load-view>
      </div>
    </transition>
    <div
      class="context-menu"
      v-click-outside="onClickOutside1"
      v-show="showMenu1"
      :style="{
        top: menuPosition1.top,
        left: menuPosition1.left,
        zIndex: menuPosition1.zIndex,
      }"
    >
      <div class="menu-row" @click="goWindowProject">在新窗口打开页面</div>
    </div>
    <!-- 右键 -->
    <div
      class="context-menu"
      v-click-outside="onClickOutside"
      v-if="isBaseLineDetail"
      v-show="showMenu"
      :style="{
        top: menuPosition.top,
        left: menuPosition.left,
      }"
    >
      <div class="menu-row" v-if="checkMenuAuth()" @click="onEditTask(activeObj)">编辑</div>
      <div class="menu-row" @click="onShowDetail">查看信息</div>
      <div class="menu-row" v-if="checkMenuAuth() && activeObj && activeObj.planStatus === '已排程' && activeObj.actualReviewer && activeObj.leader" @click="onRelease">
        发布任务
      </div>
      <div class="menu-row" v-if="checkMenuAuth() && activeObj && (activeObj.planStatus === '未开启' || activeObj.planStatus === '进行中')" @click="onRevoke">撤销发布</div>
      <div class="menu-row" v-if="checkMenuAuth() && activeObj && (activeObj.planStatus === '已完成' || activeObj.planStatus === '暂停')" @click="onReopen">重新开启</div>
      <div class="menu-row" v-if="checkMenuAuth()" @click="onInsertTask">插入任务</div>
      <div class="menu-row" v-if="checkMenuAuth()" @click="onUpgrade">升级</div>
      <div class="menu-row" v-if="checkMenuAuth()" @click="onDegrade">降级</div>
      <div class="menu-row" v-if="checkMenuAuth()" @click="moveUp">上移</div>
      <div class="menu-row" v-if="checkMenuAuth()" @click="moveDown">下移</div>
      <el-popconfirm title="删除会一并删除子任务，确认?" confirm-button-text="确认" cancel-button-text="取消" placement="right" @confirm="onDelete">
        <template #reference>
          <div class="menu-row">删除</div>
        </template>
      </el-popconfirm>
    </div>
    <!-- 从其他项目复制 -->
    <el-drawer v-model="showCopyPlan" title="从其他项目复制" size="60%">
      <div class="projectSearch">
        <div class="projectList">项目列表</div>
        <el-input style="width: 224px" v-model="projectSearchVal" :suffix-icon="Search" placeholder="请输入搜索关键词" />
      </div>
      <div class="form-row">
        <span class="form-label pi-is-required">目标开始时间：</span>
        <el-date-picker value-format="YYYY-MM-DD" style="width: 220px" :prefix-icon="null" :clearable="false" :shortcuts="shortcuts" v-model="planStartDate" />
      </div>
      <div class="table-container short-height">
        <NewPiTable
          :selectable="true"
          :isSingleSelect="true"
          :columns="projectColumns"
          :data="project_filter"
          :isWebPagination="true"
          :page-size="10"
          :pagination="true"
          :isShowSetting="false"
          @selectionChange="changeSelect"
        >
          <template #projectName="scope">
            <el-link
              style="display: inline-block; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
              type="primary"
              @contextmenu.prevent.native="openMenuProject($event, scope.row)"
              :underline="false"
            >
              {{ scope.row.projectName }}
            </el-link>
          </template>
        </NewPiTable>
      </div>
      <template #footer>
        <el-button @click="showCopyPlan = false">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="confirmImportPlan">确 定</el-button>
      </template>
    </el-drawer>
    <el-dialog v-model="showSummaryDeliverables" title="交付物汇总" top="50px" width="80%">
      <deliverablesSummary></deliverablesSummary>
    </el-dialog>
    <TransferBox
      v-model:isShow="showHeaderSetting"
      :allList="headerListAll"
      :defaultList="defaultHeaderList"
      :checkedList="tempHeaderArr"
      :dataProps="{ key: 'key', label: 'label' }"
      @confirm="confirmHeader"
      @reset="resetDefault"
      title="设置表头"
    ></TransferBox>
    <el-dialog v-model="showUrge" title="项目任务催办" width="600">
      <el-form :model="urgeForm" label-width="100px">
        <el-form-item label="催办方式">
          <el-checkbox-group v-model="urgeForm.way">
            <el-checkbox label="企业微信" />
            <el-checkbox label="邮件" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="催办内容">
          <el-input type="textarea" :rows="3" v-model="urgeForm.content"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showUrge = false">取 消</el-button>
        <el-button type="primary" @click="confirmUrge">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 创建计划弹框 -->
    <el-dialog v-model="showCreatePlan" title="创建计划" width="60vw" class="create-dialog">
      <el-row class="input-row">
        <el-col :span="4">
          <span class="pi-is-required label-text">计划名称：</span>
        </el-col>
        <el-col :span="12">
          <el-input style="width: 14vw" v-model="createPlanName"></el-input>
        </el-col>
      </el-row>
      <el-row class="input-row">
        <el-col :span="4">
          <span class="pi-is-required label-text">目标开始时间：</span>
        </el-col>
        <el-col :span="12">
          <el-date-picker value-format="YYYY-MM-DD" style="width: 14vw" :prefix-icon="null" :clearable="false" :shortcuts="shortcuts" v-model="createPlanStart" />
        </el-col>
      </el-row>
      <el-table height="280" :data="planTemplateList" style="width: 100%" highlight-current-row @current-change="selectPlanTemplate">
        <el-table-column prop="planName" label="模板名称" />
        <el-table-column prop="projectName" label="项目" />
        <el-table-column prop="targetStartTime" width="110" label="目标开始时间" />
        <el-table-column prop="targetEndTime" width="110" label="目标完成时间" />
      </el-table>
      <template #footer>
        <el-button class="fl" type="primary" link @click="createTask">自定义计划</el-button>
        <el-button @click="showCreatePlan = false">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="confirmCreatePlan">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 查看信息抽屉 -->
    <el-drawer title="查看信息" v-model="showDetail" :size="800">
      <planDetail :id="activeObj && activeObj.uid" :list="tableData" :leaderList="userList" :reviewerList="reviewerList"></planDetail>
    </el-drawer>
    <!-- 新建&编辑计划抽屉 -->
    <el-drawer :title="editType === 'add' ? (activeObj ? '新建任务' : '新建计划') : '编辑任务'" v-model="showEdit" :size="800">
      <planEditor
        :info="activeObj"
        :type="editType"
        :taskList="tableData"
        :leaderList="userList"
        :reviewerList="reviewerList"
        :update="showEdit"
        :holiday="holiday"
        :workday="workday"
        :hasChild="checkChild(activeObj)"
        @propCancel="onEditCancel"
        @propConfirm="onEditConfirm"
      ></planEditor>
    </el-drawer>
    <!-- <el-drawer title="交付物操作" v-model="showDeliverableDetail" :size="1200"> -->
    <!-- 交付物抽屉 -->
    <planDeliverable
      :drawerShow="showDeliverableDetail"
      :oid="deliverTaskId"
      v-model:closeFun="showDeliverableDetail"
      :isBaseLineDetail="isBaseLineDetail"
      @updateDeliver="updateDeliverInfo"
    ></planDeliverable>
    <!-- </el-drawer> -->
    <UploadDialog title="导入计划" v-model:isShow="importDialogFlag" :isSingle="true" :singleFile="true" :closeLoading="closeLoading" @submit="uploadSubmit"></UploadDialog>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { useCommonHandler } from '@/hooks';
import { shallowRef } from 'vue';
import { Search, Plus } from '@element-plus/icons-vue';
import planDetail from '@/views/projectPlan/planDetail.vue';
import planEditor from '@/views/projectPlan/planEditor.vue';
import planDeliverable from '@/views/projectPlan/planDeliverable.vue';
// import SelectedDialog from '@/components/DialogSelect/index.vue';
import deliverablesSummary from '@/views/projectPlan/deliverablesSummary.vue';
import UploadDialog from '@/components/uploadDialog.vue';
import PiTable from '@/components/pdcCustom/PiTable.vue';
// import sourceData from './data.json';
import TransferBox from './transferBox.vue';
import loadView from './loadView.vue';
import { getProjectList } from '@/api/project';
import { getProjectUser } from '@/api/team';
import {
  unReleaseActivity,
  releaseActivity,
  reopenTask,
  getAllByProjectId,
  savePlanActivity,
  queryProjectResource,
  getAllTemplePlans,
  createPlanByTemplate,
  copyPlanActivityByProject,
  emailNotice,
  wxNotice,
  updateProjectProgress,
  importPlanActivities,
  exportPlanActivities,
} from '@/api/plan';
import * as _ from 'lodash';
dayjs.extend(weekday);
dayjs.extend(quarterOfYear);
export default {
  props: {
    isBaseLineDetail: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    planDetail,
    planEditor,
    planDeliverable,
    // SelectedDialog,
    deliverablesSummary,
    TransferBox,
    loadView,
    UploadDialog,
    PiTable,
  },
  data() {
    return {
      flodStatus: true, // 展开收缩数据

      /**图标 */
      Search: shallowRef(Search),
      Plus: shallowRef(Plus),
      projectName: JSON.parse(sessionStorage.getItem('currentProject'))?.projectName, // 项目名称
      tableData: [], // 表格数据
      filterData: [],
      searchVal: '',
      duration: 0,
      spendCount: 0, //表头渲染用
      startIndex: 0,
      tableScrollTop: 0,
      tableScrollLeft: 0,
      containerHeight: 0,
      lineHeight: 36,
      start: null,
      end: null,
      demension: 'day', // day week month
      selectedArr: [], // 记录选择的数据处理业务 后台用taskOid 中台用id
      workday: [],
      // holiday: ['2024-01-01'],
      holiday: [],
      svgCfg: {
        width: 0,
        height: 0,
      },
      startRange: [],
      rangeVal: [],
      deadlineRange: [],
      activeFilterKey: '',

      dateFilterKey: '', // 时间--当前删选key
      dataFilterObj: {}, // 对象

      shortcuts: [
        {
          text: '今天',
          value: new Date(),
        },
      ],
      showResourceLoad: false,
      headerListAll: [
        { label: '行号', key: 'lineNumber', width: 46, filter: false },
        { label: '任务名称', key: 'taskName', width: 200, filter: true, filterType: 'input', searchVal: '' },
        { label: '目标开始时间', key: 'start', width: 116, filter: true, filterType: 'date', rangeVal: [] },
        { label: '工期', key: 'duration', width: 54, filter: true, filterType: 'input', searchVal: '' },
        { label: '目标完成时间', key: 'deadline', width: 116, filter: true, filterType: 'date', rangeVal: [] },
        { label: '交付物', key: 'deliverable', width: 180, filter: true, filterType: 'input', searchVal: '' },
        { label: '执行人', key: 'leader', width: 100, filter: true, filterType: 'input', searchVal: '' },
        { label: '审核人', key: 'actualReviewer', width: 80, filter: true, filterType: 'input', searchVal: '' },
        { label: '编辑者', key: 'editor', width: 100, filter: true, filterType: 'input', searchVal: '' },
        { label: '前置任务', key: 'previous', width: 120, filter: true, filterType: 'input', searchVal: '' },
        { label: '实际开始时间', key: 'actualStartTime', width: 120, filter: true, filterType: 'date', rangeVal: [] },
        { label: '实际完成时间', key: 'actualEndTime', width: 120, filter: true, filterType: 'date', rangeVal: [] },
        { label: '完成百分比', key: 'physicalCompletePercent', width: 80, filter: true, filterType: 'input', searchVal: '' },
        { label: '健康状态', key: 'healthStatus', width: 100, filter: true, filterType: 'input', searchVal: '' },
        { label: '审核完成时间', key: 'reviewEndDate', width: 120, filter: true, filterType: 'date', rangeVal: [] },
        { label: '创建者', key: 'actualCreateUser', width: 110, filter: true, filterType: 'input', searchVal: '' },
        { label: '创建时间', key: 'createStamp', width: 120, filter: true, filterType: 'date', searchVal: '' },
        { label: '发布人', key: 'releasedBy', width: 100, filter: true, filterType: 'input', searchVal: '' },
        { label: '发布时间', key: 'releaseTime', width: 120, filter: true, filterType: 'date', rangeVal: [] },
        { label: '暂停时间', key: 'pauseTime', width: 120, filter: true, filterType: 'date', rangeVal: [] },
        { label: '重启时间', key: 'restartTime', width: 120, filter: true, filterType: 'date', rangeVal: [] },
        { label: '重新完成时间', key: 'refinishTime', width: 120, filter: true, filterType: 'date', rangeVal: [] },
        { label: '上次修改时间', key: 'lastModifiedTime', width: 120, filter: true, filterType: 'date', rangeVal: [] },
        { label: '任务代号', key: 'taskCode', width: 120, filter: true, filterType: 'input', searchVal: '' },
        { label: '活动状态', key: 'planStatus', width: 120, filter: true, filterType: 'input', searchVal: '' },
      ],
      selectHeaderList: [
        { label: '健康状态', key: 'healthStatus', width: 100, filter: true, filterType: 'input', searchVal: '' },
        { label: '活动状态', key: 'planStatus', width: 120, filter: true, filterType: 'input', searchVal: '' },
        { label: '行号', key: 'lineNumber', width: 46, filter: false },
        { label: '任务名称', key: 'taskName', width: 200, filter: true, filterType: 'input', searchVal: '' },
        { label: '执行人', key: 'leader', width: 100, filter: true, filterType: 'input', searchVal: '' },
        { label: '审核人', key: 'actualReviewer', width: 100, filter: true, filterType: 'input', searchVal: '' },
        { label: '交付物', key: 'deliverable', width: 180, filter: true, filterType: 'input', searchVal: '' },
        { label: '目标开始时间', key: 'start', width: 116, filter: true, filterType: 'date', rangeVal: [] },
        { label: '目标完成时间', key: 'deadline', width: 116, filter: true, filterType: 'date', rangeVal: [] },
        { label: '工期', key: 'duration', width: 54, filter: true, filterType: 'input', searchVal: '' },
        { label: '前置任务', key: 'previous', width: 120, filter: true, filterType: 'input', searchVal: '' },
        { label: '实际开始时间', key: 'actualStartTime', width: 120, filter: true, filterType: 'date', rangeVal: [] },
        { label: '实际完成时间', key: 'actualEndTime', width: 120, filter: true, filterType: 'date', rangeVal: [] },
      ],
      defaultHeaderList: [
        { label: '健康状态', key: 'healthStatus', width: 100, filter: true, filterType: 'input', searchVal: '' },
        { label: '活动状态', key: 'planStatus', width: 120, filter: true, filterType: 'input', searchVal: '' },
        { label: '行号', key: 'lineNumber', width: 46, filter: false },
        { label: '任务名称', key: 'taskName', width: 200, filter: true, filterType: 'input', searchVal: '' },
        { label: '执行人', key: 'leader', width: 100, filter: true, filterType: 'input', searchVal: '' },
        { label: '审核人', key: 'actualReviewer', width: 100, filter: true, filterType: 'input', searchVal: '' },
        { label: '交付物', key: 'deliverable', width: 180, filter: true, filterType: 'input', searchVal: '' },
        { label: '目标开始时间', key: 'start', width: 116, filter: true, filterType: 'date', rangeVal: [] },
        { label: '目标完成时间', key: 'deadline', width: 116, filter: true, filterType: 'date', rangeVal: [] },
        { label: '工期', key: 'duration', width: 54, filter: true, filterType: 'input', searchVal: '' },
        { label: '前置任务', key: 'previous', width: 120, filter: true, filterType: 'input', searchVal: '' },
        { label: '实际开始时间', key: 'actualStartTime', width: 120, filter: true, filterType: 'date', rangeVal: [] },
        { label: '实际完成时间', key: 'actualEndTime', width: 120, filter: true, filterType: 'date', rangeVal: [] },
      ],
      tempHeaderArr: [],
      arrowArr: [],
      menuPosition: {
        top: 0,
        left: 0,
      },
      limitDate: [
        // {
        //   name: '1-先期研究阶段',
        //   date: '2023-11-24',
        // },
        // {
        //   name: '2-详细开发阶段',
        //   date: '2023-11-28',
        // },
        // {
        //   name: '全新产品C类',
        //   date: '2023-11-28',
        // },
      ],
      checkError: [],
      saveTemp: null, //暂存修改前的数据方便回退
      isLoading: false,
      leftFold: false,
      checkAll: false,
      checkVal: [],
      indeterminateFlag: false,
      showHeaderSetting: false,
      showMenu: false,
      activeObj: {},
      showDetail: false,
      showEdit: false,
      editType: 'add', // add edit
      showDeliverableDetail: false,
      editFlag: '',
      userList: [],
      leaderVal: [],
      showUrge: false,
      urgeForm: {
        way: [],
        content: '',
      },
      showCopyPlan: false,
      planStartDate: null,
      showSummaryDeliverables: false,
      projectList: [],
      reviewerList: [],
      projectSelect: '',
      showGantt: false,
      loadViewHeight: 0,
      isShowUpload: false,
      importDialogFlag: false,
      showCreatePlan: false,
      createPlanName: '',
      planTemplateList: [],
      selectPlan: '',
      userInfo: {},
      createPlanStart: null,
      projectColumns: [
        { title: '项目名称', dataIndex: 'projectName' },
        { title: '项目级别', dataIndex: 'importantLevel', width: 100 },
        { title: '项目经理', dataIndex: 'projectManager', width: 140 },
        { title: '所属研究所', dataIndex: 'projectGroupReference', width: 120 },
        { title: '产品大类', dataIndex: 'type', width: 140 },
        { title: '细分类型', dataIndex: 'projectType', width: 160 },
      ],
      projectSearchVal: '',

      resourceOid: '', // 资源负载oid
      deliverTaskId: '',
      currentRole: [],
      currentDay: null,
      closeLoading: true,

      // 发布任务
      selectTaskArr: [],
      menuPosition1: {
        top: 0,
        left: 0,
      },
      selectProject: [],
      showMenu1: false,
    };
  },
  async mounted() {
    await this.getLimiteDate();
    this.getResouce();
    this.currentDay = dayjs();
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.currentRole = JSON.parse(localStorage.getItem('currentProjectRole'));
    this.containerHeight = document.body.clientHeight - 228;
    if (localStorage.getItem('planListHeader')) {
      this.selectHeaderList = JSON.parse(localStorage.getItem('planListHeader'));
    }
    this.initSvg = _.debounce(function () {
      // 这里做防抖处理提高性能
      this.renderSvg();
    }, 200);
    // const source = this.initPlanOid(sourceData)
    const params = {
      beProjectOid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
    };
    this.isLoading = true;
    let res = await getAllByProjectId(params);
    if (!res.success) return this.$message.warning(res.message);
    const source = this.initPlanOid(res.data);
    setTimeout(() => {
      this.tableData = source;
      this.isLoading = false;
    }, 80);

    this.onScheduling();
    setTimeout(() => {
      this.getGanttData();
    }, 800);
    // this.getUsers()
    let tempSave = localStorage.getItem('planAutoSave');
    if (tempSave) {
      let obj = JSON.parse(localStorage.getItem('planAutoSave'));
      if (JSON.parse(sessionStorage.getItem('currentProject'))?.oid === obj.project) {
        this.$confirm('检测到有未保存信息，确认恢复？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // 点击确认
            this.tableData = obj.data;
            this.onScheduling();
            this.getGanttData();
          })
          .catch(() => {
            // 点击取消后的回调
            localStorage.setItem('planAutoSave', '');
          });
      }
    }
    window.addEventListener('resize', this.getHeight);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.getHeight);
  },
  watch: {
    checkCount(val) {
      let tableLength = this.tableData.length;
      if (val === 0) {
        this.checkAll = false;
        this.indeterminateFlag = false;
      } else if (val === tableLength) {
        this.checkAll = true;
        this.indeterminateFlag = false;
      } else {
        // 中间状态
        this.checkAll = false;
        this.indeterminateFlag = true;
      }
    },
  },
  computed: {
    totalHeight() {
      // 容器内容高度
      let count = 0;
      this.tableData?.length > 0 &&
        this.tableData.forEach((item) => {
          if (!item.hide) {
            count++;
          }
        });
      return count * this.lineHeight + 60 + 'px';
    },
    checkCount() {
      let count = 0;
      this.tableData?.length > 0 &&
        this.tableData.forEach((item) => {
          if (item.check) {
            count++;
          }
        });
      return count;
    },
    ganttLeftWidth() {
      let count = 30;
      this.headerShowList.forEach((item) => {
        count += item.width;
      });
      return count;
    },
    tableWidth() {
      if (this.headerShowList.length <= 7) {
        return '100%';
      } else {
        const defaultWidth = document.getElementById('table-container')?.offsetWidth;
        let count = 30;
        this.headerShowList.forEach((item) => {
          count += item.width;
        });

        return defaultWidth >= count ? '100%' : count + 'px';
      }
    },
    limitCount() {
      return this.containerHeight / this.lineHeight;
    },
    /**最终展示数据 */
    showData() {
      let endCount = 0;
      const showLength = Math.floor(this.limitCount);
      let res = [];
      let tempArr = [];
      let fatherArr = [];
      let isFilter = false;
      let arr;
      // 校验是否是过滤
      let columnData = JSON.parse(JSON.stringify(this.headerShowList));
      let searchValFlag = columnData.some((v) => {
        if (v?.searchVal || (v?.rangeVal && v?.rangeVal.length > 0)) {
          return true;
        }
      });

      // 过滤input
      if (searchValFlag) {
        isFilter = true;
        arr = this.filterData;
      } else {
        arr = this.tableData.filter((v) => !v.hide);
      }

      // 过滤时间
      // if (this.startRange && this.startRange.length === 2) {
      //   isFilter = true;
      //   let startDate = this.startRange[0];
      //   let endDate = this.startRange[1];
      //   arr = arr.filter((v) => dayjs(v.start).isSameOrAfter(startDate) && dayjs(v.start).isSameOrBefore(endDate));
      // }
      // if (this.deadlineRange && this.deadlineRange.length === 2) {
      //   isFilter = true;
      //   let startDate = this.deadlineRange[0];
      //   let endDate = this.deadlineRange[1];
      //   arr = arr.filter((v) => dayjs(v.deadline).isSameOrAfter(startDate) && dayjs(v.deadline).isSameOrBefore(endDate));
      // }

      arr.forEach((item) => {
        tempArr.push(item.uid);
        fatherArr.push(item.father);
      });
      if (isFilter) {
        // 搜索结果 父子都展示
        arr = this.tableData.filter((v) => tempArr.includes(v.uid) || tempArr.includes(v.father) || fatherArr.includes(v.uid));
      }
      for (let i = this.startIndex; i < arr.length; i++) {
        if (!arr[i].hide || searchValFlag) {
          res.push(arr[i]);
          endCount++;
        }
        if (endCount === showLength) {
          break;
        }
      }
      return res;
    },
    headerShowList() {
      if (this.showGantt) {
        if (!this.leftFold) {
          let arr = [
            { abel: '名称', key: 'taskName', width: 192, filter: true, filterType: 'input' },
            { label: '目标完成时间', key: 'deadline', width: 116, filter: true, filterType: 'date' },
          ];
          return arr;
        } else {
          return this.selectHeaderList;
        }
      } else {
        return this.selectHeaderList;
      }
    },
    length() {
      return this.tableData.length || 0;
    },
    project_filter() {
      // projectColumns: [
      //   { title: '项目计划名称', dataIndex: 'projectName' },
      //   { title: '项目级别', dataIndex: 'importantLevel', width: 100 },
      //   { title: '项目经理', dataIndex: 'projectManager', width: 140 },
      //   { title: '所属研究所', dataIndex: 'projectGroupReference', width: 120 },
      //   { title: '产品大类', dataIndex: 'type', width: 140 },
      //   { title: '细分类型', dataIndex: 'projectType', width: 160 },
      // ],
      return this.projectList.filter(
        (el) => this.projectColumns.some((v) => el[v.dataIndex]?.indexOf(this.projectSearchVal) > -1) && el.id !== JSON.parse(sessionStorage.getItem('currentProject')).id,
      );
    },
  },
  methods: {
    async getLimiteDate() {
      await window.$api.planApi.getTargetCheckTime({ oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid }).then((res) => {
        if (res.success) {
          this.limitDate = res.data.map((v) => {
            let obj = {};
            obj.name = v.name;
            obj.date = v.displayValue;
            return obj;
          });
        } else {
          window.$message.error(res.message);
        }
      });
    },
    setAutoSave() {
      let obj = {
        project: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
        data: this.tableData,
      };
      localStorage.setItem('planAutoSave', JSON.stringify(obj));
    },
    onClickOutside1() {
      this.showMenu1 = false;
    },
    // 右键项目
    openMenuProject(event, item) {
      this.selectProject = [];
      this.selectProject.push(item);
      // if (event.pageY < 560) {
      this.menuPosition1.top = event.pageY - event.offsetY + 32 + 'px';
      this.menuPosition1.left = event.pageX + 'px';
      this.menuPosition1.zIndex = 10000;
      // } else {
      // projectData.menuPosition.top = event.pageY - event.offsetY - 292 + 'px';
      // projectData.menuPosition.left = event.pageX + 'px';
      // }
      this.showMenu1 = true;
    },
    async goWindowProject() {
      if (this.selectProject.length === 1) {
        let params = {
          projectOid: this.selectProject[0].oid,
          userName: this.userInfo.username,
        };
        window.$api.commonApi.getProjectPermission(params).then((res) => {
          if (res.success) {
            if (res.data.length > 0) {
              window.open(`http://${window.location.host}/#/project/detail?oid=${this.selectProject[0].oid}&isNewWin=true`, '_blank');
            } else {
              window.$message.error('暂无该项目的权限');
            }
          }
        });
      } else {
        this.$message.error('请至少选择一个项目');
      }
    },
    /** 初始化处理数据 */
    initPlanOid(arr) {
      let planOid = '';
      arr.forEach((item) => {
        item.fold = false;
        item.hide = false;
        if (item.actualReviewer) {
          const actualReviewer = JSON.parse(item.actualReviewer);
          item.actualReviewer = actualReviewer.userId;
        }
        if (item.editor) {
          const editorJSON = JSON.parse(item.editor);
          item.editor = editorJSON.userId;
        } else {
          item.editor = '';
        }
        item.deliverable = JSON.parse(item.deliverable);
        item.start = dayjs(item.start).format('YYYY-MM-DD');
        item.leader = item.leader;
        item.next = JSON.parse(item.next);
        item.duration = parseInt(item.duration);
        item.level = parseInt(item.level);
        item.previous = JSON.parse(item.previous);
        if (item.next.length > 0) {
          item.next = item.next.map((item) => {
            return JSON.parse(item);
          });
        }
        if (item.previous.length > 0) {
          item.previous = item.previous.map((item) => {
            return JSON.parse(item);
          });
        }
        item.deadline = dayjs(item.deadline).format('YYYY-MM-DD');
        if (item.level === 0) {
          planOid = item.taskOid;
          item.planOid = planOid;
        } else {
          item.planOid = planOid;
        }
        // 将taskcode转化为层级数组
        item.levelArr = item.taskCode?.split('.') || [];
        //uid为空的情况下
        if (!item.uid) {
          item.uid = item.id;
        }
      });
      // 处理数据
      let newArr = this.handFirstData(arr);
      return newArr;
    },
    /**
     * 处理计划导入的时候数据回显
     */
    handFirstData(data) {
      data.forEach((v) => {
        if (v.levelArr.length > 1) {
          // 此时一定是子级，调用函数去查询父级
          let fatherObj = this.findFatherFun(_.cloneDeep(v), _.cloneDeep(data));
          v.father = fatherObj.uid;
          v.fatherNode = fatherObj.taskName;
        }
      });
      return data;
    },
    findFatherFun(obj, arr) {
      // 去往前找father 只要是前一位的taskCode短一位的第一个就是他的father
      let newObj = {};
      let index = arr.findIndex((item) => item.id === obj.id);
      for (let i = index - 1; i >= 0; i--) {
        if (arr[i].levelArr.length < obj.levelArr.length) {
          newObj = arr[i];
          break;
        }
      }
      return newObj;
    },

    refreshTableData() {
      // 单纯刷新数据
      const params = {
        beProjectOid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
      };
      this.isLoading = true;
      getAllByProjectId(params).then((res) => {
        this.isLoading = false;
        if (res.success) {
          this.tableData = this.initPlanOid(res.data);

          this.onScheduling();
          // this.getGanttData();
          this.$nextTick(() => {
            this.getGanttData();
          });
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**查询项目资源 */
    getResouce() {
      const params = {
        oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
      };
      queryProjectResource(params).then((res) => {
        if (res.success) {
          this.userList = [];
          res.data.options.forEach((item) => {
            for (let key in item) {
              const obj = {
                label: item[key],
                value: key,
              };
              this.userList.push(obj);
            }
          });
        }
      });
      const params2 = {
        projectId: JSON.parse(sessionStorage.getItem('currentProject'))?.id,
        includeGroup: true,
      };
      getProjectUser(params2).then((res) => {
        if (res.success) {
          this.reviewerList = [];
          res.data.forEach((item) => {
            const obj = {
              label: `${item.realname}(${item.username})`,
              value: item.userId,
              data: item,
            };
            this.reviewerList.push(obj);
          });
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    getLeaderVal(id) {
      let res = this.userList.find((item) => item.value === id);
      if (res) {
        return res.label;
      } else {
        return '';
      }
    },
    getReviewerVal(id) {
      let res = this.reviewerList.find((item) => item.value === id);
      if (res) {
        // return res.data.realname;
        return res.label;
      } else {
        return '';
      }
    },
    getHeight() {
      this.containerHeight = document.body.clientHeight - 232;
    },
    onSave() {
      this.checkLimitDate();
      if (this.checkError.length === 0) {
        const data = this.formatParamsData(this.tableData);
        let params = {};
        if (data.length > 0) {
          params.formData = JSON.stringify(data);
        } else {
          params.projectOid = JSON.parse(sessionStorage.getItem('currentProject')).oid;
        }
        this.isLoading = true;
        savePlanActivity(params).then(async (res) => {
          this.isLoading = false;
          if (res.success) {
            res.data.forEach((v) => {
              v.deliverable = JSON.stringify(v.deliverable);
              v.next = JSON.stringify(v.next);
              v.previous = JSON.stringify(v.previous);
            });
            this.$message.success('操作成功！');
            localStorage.setItem('planAutoSave', ''); // 成功了就不用存了

            // this.tableData = this.initPlanOid(res.data);
            // const source = this.initPlanOid(res.data);
            // setTimeout(() => {
            //   this.tableData = source;
            // }, 80);
            this.refreshTableData();
            // this.onScheduling();
            // this.$nextTick(() => {
            //   this.getGanttData();
            // });
          } else {
            this.$message.warning(res.message);
          }
        });
      } else {
        let warningText = this.checkError.join('、') + ' 晚于计划时间，无法修改';
        this.$message.warning(warningText);
      }
    },
    checkLimitDate() {
      // 检测数据是否满足计划时间
      this.checkError = [];
      this.tableData.forEach((task) => {
        const limitObj = this.limitDate.find((item) => item.name === task.taskName);
        let limitDate;
        const endDate = dayjs(task.deadline);
        if (limitObj) {
          limitDate = limitObj.date;
        }
        if (limitDate) {
          if (endDate.isAfter(limitDate)) {
            this.checkError.push(limitObj.name);
          }
        }
      });
    },
    getTaskVal(id) {
      let obj = this.tableData.find((item) => item.uid === id);
      if (obj) {
        return `${obj.lineNumber}-${obj.taskName}`;
      } else {
        return '';
      }
    },
    formatParamsData(arr) {
      // 将数据转成后台需要的格式
      arr = _.cloneDeep(arr);
      let res = [];
      arr.forEach((item) => {
        delete item.planOid;
        const tempReviewer = this.reviewerList.find((user) => user.value === item.actualReviewer);
        if (tempReviewer) {
          item.actualReviewer = tempReviewer.data;
        } else {
          item.actualReviewer = '';
        }
        const tempEditor = this.reviewerList.find((user) => user.value === item?.editor);
        if (tempEditor) {
          item.editor = tempEditor.data;
        } else {
          item.editor = '';
        }
        if (item.level === 0) {
          // 新计划
          item.activityData = [];
          item.projectOid = JSON.parse(sessionStorage.getItem('currentProject'))?.oid;
          res.push(item);
        } else {
          // 已有计划插入
          const obj = res[res.length - 1];
          delete item.planOid;
          obj.activityData.push(item);
        }
      });
      return res;
    },
    onUrge() {
      this.getChecked();
      if (this.checkVal.length === 0) {
        this.$message.warning('请选择至少一条记录！');
      } else {
        this.showUrge = true;
        this.selectedArr = [];
        this.tableData.forEach((item) => {
          // 中台业务 用id
          if (item.check) {
            this.selectedArr.push(item.id);
          }
        });
      }
    },
    onFoldAll() {
      this.flodStatus = !this.flodStatus;
      if (this.flodStatus) {
        this.tableData.forEach((item) => {
          this.expandRow(item);
        });
      } else {
        this.tableData.forEach((item) => {
          this.foldRow(item);
        });
      }
    },
    checkDivider(obj, index) {
      const nextObj = this.showData[index + 1];
      if (nextObj && nextObj.level === 0) {
        return true;
      } else {
        return false;
      }
    },
    checkActive(obj, index) {
      return this.activeObj.id === obj.id;
    },
    onUpdate() {
      this.isLoading = true;
      updateProjectProgress({ oid: JSON.parse(sessionStorage.getItem('currentProject')).oid }).then((res) => {
        this.isLoading = false;
        if (res.success) {
          this.$message.success('操作成功');
        } else {
          this.$message.error(res.message);
        }
      });
    },
    onResourceLoad() {
      let checkArrData = [];
      this.tableData.forEach((item) => {
        if (item.check) {
          checkArrData.push(item);
        }
      });
      let arr = this.tableData.filter((v) => v.level === 0);
      if (arr.length > 1) {
        if (checkArrData.length > 0) {
          let handSelect = checkArrData.filter((v) => v.level === 0);
          if (!(handSelect.length === 1)) {
            window.$message.warning('请选择一条计划后点击查看！');
            return;
          }
          this.resourceOid = handSelect[0].taskOid;
        }
      } else {
        this.resourceOid = arr[0].taskOid;
      }
      this.showResourceLoad = !this.showResourceLoad;
      let contentHeight = document.body.clientHeight - 228;
      if (this.showResourceLoad) {
        this.containerHeight = contentHeight / 2 - 12;
        this.loadViewHeight = contentHeight / 2;
      } else {
        this.containerHeight = contentHeight;
        this.loadViewHeight = 0;
      }
    },
    getChecked() {
      // 获取勾选的值
      this.checkVal = [];
      this.tableData.forEach((item) => {
        if (item.check) {
          this.checkVal.push(item.id);
        }
      });
    },
    confirmUrge() {
      let promiseArr = [];
      if (this.urgeForm.way.includes('企业微信')) {
        const params = {
          title: this.urgeForm.content,
          id: this.checkVal,
        };
        let promise1 = wxNotice(params);
        promiseArr.push(promise1);
      }
      if (this.urgeForm.way.includes('邮件')) {
        const params = {
          title: this.urgeForm.content,
          id: this.checkVal,
        };
        let promise2 = emailNotice(params);
        promiseArr.push(promise2);
      }
      Promise.all(promiseArr).then((res) => {
        this.$message.success('催办成功');
        this.onCheckAll(false);
        this.showUrge = false;
      });
    },
    onCreatePlan() {
      this.createPlanName = '';
      this.createPlanStart = null;
      getAllTemplePlans({ type: '' }).then((res) => {
        if (res.success) {
          this.planTemplateList = res.data;
          this.planTemplateList.map((item) => {
            item.targetEndTime = dayjs(item.targetEndTime).format('YYYY-MM-DD');
            item.targetStartTime = dayjs(item.targetStartTime).format('YYYY-MM-DD');
          });
          this.showCreatePlan = true;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    confirmCreatePlan() {
      if (!this.selectPlan) return this.$message.warning('请选择模板！');
      if (!this.createPlanStart) return this.$message.warning('请选择目标开始时间！');
      const params = {
        projectOid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
        planOid: this.selectPlan,
        planName: this.createPlanName,
        targetStartTime: this.createPlanStart,
      };
      this.isLoading = true;
      createPlanByTemplate(params).then((res) => {
        this.isLoading = false;
        if (res.success) {
          setTimeout(() => {
            this.showCreatePlan = false;
            this.refreshTableData();
          }, 200);
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    onExport() {
      exportPlanActivities({ oid: JSON.parse(sessionStorage.getItem('currentProject')).oid }).then((res) => {
        useCommonHandler.download(res, this.projectName + '计划.xlsx');
      });
    },
    copyPlan() {
      this.showCopyPlan = true;
      this.projectSelect = '';
      this.projectSearchVal = '';
      this.planStartDate = null;
      if (this.projectList.length === 0) {
        this._getProjectList();
      }
    },
    changeSelect(val, item) {
      this.projectSelect = item?.oid;
    },
    showImportDialog() {
      this.importDialogFlag = true;
    },
    selectPlanTemplate(val) {
      this.createPlanName = val.planName;
      this.selectPlan = val.planOid;
    },
    uploadSubmit(val) {
      let params = {
        oid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
        file: val[0].raw,
      };
      importPlanActivities(params).then((res) => {
        if (res.success) {
          this.$message.success('导入成功');
          setTimeout(() => {
            this.importDialogFlag = false;
            this.refreshTableData();
          }, 800);
        } else {
          window.$message.error(res.message);
        }
        this.closeLoading = false;
      });
    },
    _getProjectList() {
      getProjectList({}).then((res) => {
        if (res.success) {
          this.projectList = res.data;
        }
      });
    },
    confirmImportPlan() {
      if (!this.projectSelect) return this.$message.warning('请选择项目！');
      if (!this.planStartDate) return this.$message.warning('请选择目标开始时间！');
      // 调接口q
      this.isLoading = true;
      copyPlanActivityByProject({
        oid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
        copyOid: this.projectSelect,
        targetStartTime: this.planStartDate,
      }).then((res) => {
        this.isLoading = false;
        if (res.success) {
          this.$message.success(res.data);
          setTimeout(() => {
            this.refreshTableData();
            this.showCopyPlan = false;
          }, 800);
        } else {
          this.$message.warning(res.message);
        }
      });
      // this.$refs.scrollbarRef.setScrollLeft(0);
      // this.$refs.scrollbarRef.setScrollTop(0);
    },
    /**表头input过滤 */
    changeSearch(val, data) {
      this.filterData = [];
      this.tableData.forEach((item) => {
        if (data.key === 'leader') {
          if (this.getLeaderVal(item.leader).includes(val)) {
            this.filterData.push(item);
          }
        } else if (data.key === 'actualReviewer') {
          if (this.getReviewerVal(item.actualReviewer).includes(val)) {
            this.filterData.push(item);
          }
        } else if (data.key === 'duration') {
          if (item[data.key] === Number(val)) {
            this.filterData.push(item);
          }
        } else {
          if (item[data.key] instanceof Array) {
            let status = item[data.key].some((e) => e.includes(val));
            if (status) {
              this.filterData.push(item);
            }
          } else {
            if (item[data.key].includes(val)) {
              this.filterData.push(item);
            }
          }
        }
      });
    },
    searchConfirm() {
      this.activeFilterKey = '';
    },
    onScheduling(oid, date) {
      // 自动排期 核心方法  //传oid就只排oid的 传入date需要重置起始时间
      this.checkError = [];
      this.tableData.forEach((item, index) => {
        // 第一轮先处理没有子任务的任务
        if ((!oid || oid === item.planOid) && !this.checkChild(item)) {
          if (Array.isArray(item.previous) && item.previous.length > 0) {
            const scheduleDate = this.getScheduleDate(item.previous, item.duration);
            if (scheduleDate) {
              item.start = scheduleDate;
              item.deadline = this.calcDate(item.start, item.duration).format('YYYY-MM-DD');
            } else if (date) {
              // 有日期按照重置日期
              item.start = date;
              item.deadline = this.calcDate(item.start, item.duration).format('YYYY-MM-DD');
            } else {
              const objEndDate = this.calcDate(item.start, item.duration);
              item.deadline = objEndDate.format('YYYY-MM-DD');
            }
          } else {
            // 根据原时间生成完成时间
            if (date) {
              item.start = date;
              item.deadline = this.calcDate(item.start, item.duration).format('YYYY-MM-DD');
            } else {
              const objEndDate = this.calcDate(item.start, item.duration);
              item.deadline = objEndDate.format('YYYY-MM-DD');
            }
          }
          if (this.tableData[index + 1] && this.tableData[index + 1].father !== item.father) {
            // 该父节点的子节点结束了 可以处理了
            this.initFather(item.father);
          }
        }
      });
      // 反向来一次 防止有点后置任务在前面
      for (let i = this.tableData.length - 1; i >= 0; i--) {
        if ((!oid || oid === this.tableData[i].planOid) && !this.checkChild(this.tableData[i])) {
          if (Array.isArray(this.tableData[i].previous) && this.tableData[i].previous.length > 0) {
            const scheduleDate = this.getScheduleDate(this.tableData[i].previous, this.tableData[i].duration);
            if (scheduleDate) {
              this.tableData[i].start = scheduleDate;
              this.tableData[i].deadline = this.calcDate(this.tableData[i].start, this.tableData[i].duration).format('YYYY-MM-DD');
            } else if (date) {
              // 有日期按照重置日期
              this.tableData[i].start = date;
              this.tableData[i].deadline = this.calcDate(this.tableData[i].start, this.tableData[i].duration).format('YYYY-MM-DD');
            } else {
              const objEndDate = this.calcDate(this.tableData[i].start, this.tableData[i].duration);
              this.tableData[i].deadline = objEndDate.format('YYYY-MM-DD');
            }
          }
        } else if (!oid || oid === this.tableData[i].planOid) {
          if (date) {
            this.tableData[i].start = date;
            this.tableData[i].deadline = this.calcDate(this.tableData[i].start, this.tableData[i].duration).format('YYYY-MM-DD');
          } else {
            const objEndDate = this.calcDate(this.tableData[i].start, this.tableData[i].duration);
            this.tableData[i].deadline = objEndDate.format('YYYY-MM-DD');
          }
        }
        if (this.tableData[i - 1] && this.tableData[i - 1].father !== this.tableData[i].father) {
          // 该父节点的子节点结束了 可以处理了
          if (this.tableData[i].father) {
            this.initFather(this.tableData[i].father);
          }
        }
      }
      for (let i = this.tableData.length - 1; i >= 0; i--) {
        //逆向循环处理父任务
        if ((!oid || oid === this.tableData[i].planOid) && !this.checkChild(this.tableData[i])) {
          if (this.tableData[i].father) {
            this.initFather(this.tableData[i].father);
          }
        }
      }
      if (this.checkError.length > 0) {
        this.checkError = _.uniq(this.checkError);
        let warningText = this.checkError.join('、') + ' 晚于计划时间，无法修改';
        this.$message.warning(warningText);
        this.tableData = this.saveTemp;
      }
    },
    initFather(id) {
      // 初始化父节点时间
      let startDate, endDate;
      this.tableData.forEach((item) => {
        if (item.father === id) {
          if (!startDate) {
            startDate = dayjs(item.start);
          } else if (startDate.isAfter(item.start)) {
            startDate = dayjs(item.start);
          }
          if (!endDate) {
            endDate = dayjs(item.deadline);
          } else if (endDate.isBefore(item.deadline)) {
            endDate = dayjs(item.deadline);
          }
        }
      });
      let obj = this.checkObj(this.tableData, id);

      let limitDate;
      const limitObj = this.limitDate.find((item) => item.name === obj.taskName);
      if (limitObj) {
        limitDate = limitObj.date;
      }
      if (limitDate && !obj.planOid.startsWith('new_')) {
        // 新建的不校验
        if (endDate.isAfter(limitDate)) {
          this.checkError.push(limitObj.name);
        }
      }
      obj.start = startDate.format('YYYY-MM-DD');
      obj.deadline = endDate.format('YYYY-MM-DD');
      obj.duration = this.calcDuration(startDate, endDate);
      obj.next = []; // 父节点不允许有前后置任务
      obj.previous = [];
    },
    calcDuration(start, end) {
      // 计算时间范围内工作日
      start = dayjs(start);
      end = dayjs(end);
      let duration = end.diff(start, 'day') + 1; // 需要加一天
      // let duration = end.diff(start, 'day');
      let val = 0;
      if (duration > 0) {
        for (let i = 0; i < duration; i++) {
          if (
            // (start.add(i, 'day').weekday() !== 6 || this.workday.includes(start.add(i, 'day').format('YYYY-MM-DD'))) &&
            // (start.add(i, 'day').weekday() !== 0 || this.workday.includes(start.add(i, 'day').format('YYYY-MM-DD'))) &&
            !this.holiday.includes(start.add(i, 'day').format('YYYY-MM-DD'))
          ) {
            val++;
          }
        }
        return val;
      } else {
        duration = -duration;
        for (let i = 0; i < duration; i++) {
          if (
            // (start.subtract(i, 'day').weekday() !== 6 || this.workday.includes(start.subtract(i, 'day').format('YYYY-MM-DD'))) &&
            // (start.subtract(i, 'day').weekday() !== 0 || this.workday.includes(start.subtract(i, 'day').format('YYYY-MM-DD'))) &&
            !this.holiday.includes(start.subtract(i, 'day').format('YYYY-MM-DD'))
          ) {
            val++;
          }
        }
        return -val;
      }
    },
    getScheduleDate(list, duration) {
      // 前置任务数组 计算返回的时间
      let resDate = null;
      for (let i = 0; i < list.length; i++) {
        const obj = this.tableData.find((task) => task.uid === list[i].id);
        if (obj) {
          let tempDate = '';
          if (list[i].type === 'SS') {
            tempDate = this.calcDate(obj.start, parseInt(list[i].days) + 1); // 计算前后置任务偏移天数逻辑要+1
          } else if (list[i].type === 'FS') {
            tempDate = this.calcDate(obj.deadline, parseInt(list[i].days) + 2); // 计算前后置任务偏移天数逻辑要+2(结束日期算下一天)
          } else if (list[i].type === 'FF') {
            tempDate = this.calcStart(obj.deadline, duration - parseInt(list[i].days));
          } else if (list[i].type === 'SF') {
            tempDate = this.calcStart(obj.start, duration + parseInt(list[i].days) + 1); // 这里是反的
          }
          if (!resDate) {
            resDate = tempDate;
          } else if (dayjs(resDate).isBefore(tempDate)) {
            resDate = tempDate;
          }
        } else {
          // 之前因为什么删掉了找不到对象就直接清空掉
          list.splice(i, 1);
          i--;
        }
      }
      if (resDate) {
        return resDate.format('YYYY-MM-DD');
      } else {
        return null;
      }
    },
    calcStart(date, count) {
      // 根据工期倒退开始时间
      count = count - 1; // 1天算同一天
      let res = dayjs(date);
      if (count > 0) {
        // 把加减分开方便梳理逻辑
        for (let i = 0; i < count; i++) {
          res = res.subtract(this.calcWorkdaySub(res, 1), 'day');
        }
      } else {
        count = -count;
        for (let i = 0; i < count; i++) {
          res = res.add(this.calcWorkday(res, 1), 'day');
        }
      }
      return res;
    },
    calcDate(date, count) {
      // 返回指定日期经过count工作日后的日期moment对象
      let res = dayjs(date);
      // if ((res.weekday() !== 6 || this.workday.includes(res)) && (res.weekday() !== 0 || this.workday.includes(res)) && !this.holiday.includes(res)) {
      // if (this.workday.includes(res) && this.workday.includes(res) && !this.holiday.includes(res)) {
      // 第一天是工作日就少一天
      count = count - 1;
      // }
      if (count > 0) {
        // 把加减分开方便梳理逻辑
        for (let i = 0; i < count; i++) {
          res = dayjs(res).add(this.calcWorkday(res, 1), 'day');
        }
      } else {
        count = -count;
        for (let i = 0; i < count; i++) {
          res = res.subtract(this.calcWorkdaySub(res, 1), 'day');
        }
      }
      return res;
    },
    calcWorkday(date, val) {
      // 计算延后工作日
      // (不是周六 或者 那天是工作日 )(不是周天 或者那天是工作日 )或者那天不是节假日
      if (
        // (date.add(val, 'day').weekday() !== 6 || this.workday.includes(date.add(val, 'day').format('YYYY-MM-DD'))) &&
        // (date.add(val, 'day').weekday() !== 0 || this.workday.includes(date.add(val, 'day').format('YYYY-MM-DD'))) &&
        !this.holiday.includes(date.add(val, 'day').format('YYYY-MM-DD'))
      ) {
        return val;
      } else {
        // 非工作日+1
        return this.calcWorkday(date, ++val);
      }
    },
    calcWorkdaySub(date, val) {
      // 计算提前工作日
      if (
        // (date.subtract(val, 'day').weekday() !== 6 || this.workday.includes(date.subtract(val, 'day').format('YYYY-MM-DD'))) &&
        // (date.subtract(val, 'day').weekday() !== 0 || this.workday.includes(date.subtract(val, 'day').format('YYYY-MM-DD'))) &&
        !this.holiday.includes(date.subtract(val, 'day').format('YYYY-MM-DD'))
      ) {
        return val;
      } else {
        // 非工作日+1
        return this.calcWorkdaySub(date, ++val);
      }
    },
    // calcDuration (start, end) { // 计算两个日期的工期
    //   start = dayjs(start)
    //   end = dayjs(end)
    //   let count = 1
    //   for (let i = 0; i < 999; i++) {
    //     if (start.add(i, 'day').format('YYYY-MM-DD') === end.format('YYYY-MM-DD')) {
    //       break;
    //     } else if (
    //       (start.add(i, 'day').weekday() !== 6 || this.workday.includes(start.add(i , 'day').format('YYYY-MM-DD'))) &&
    //       (start.add(i, 'day').weekday() !== 0 || this.workday.includes(start.add(i, 'day').format('YYYY-MM-DD'))) &&
    //       (!this.holiday.includes(start.add(i, 'day').format('YYYY-MM-DD')))
    //     ) {
    //       count++
    //     }
    //   }
    //   return count
    // },
    scrollListener(obj) {
      const scrollTop = obj.scrollTop;
      const scrollLeft = obj.scrollLeft;
      if (scrollLeft > 0) {
        this.tableScrollLeft = scrollLeft;
      } else {
        this.tableScrollLeft = 0;
      }
      this.showMenu = false;
      this.tableScrollTop = scrollTop;
      this.startIndex = Math.floor(scrollTop / this.lineHeight);
      this.arrowArr = [];
      this.initSvg();
    },
    renderSvg() {
      if (!this.showGantt) return;
      this.$nextTick(() => {
        this.svgCfg.width = this.spendCount * this.getDemensionWidth();
        this.svgCfg.height = this.$refs.containerBox.clientHeight;
        this.initArrow();
      });
    },
    getGanttData() {
      this.start = this.getEarliestDate(this.tableData).subtract(1, this.demension);
      this.end = this.getFarestDate(this.tableData).add(1, this.demension);
      this.duration = this.end.diff(this.start, this.demension) + 1;
      this.spendCount = this.duration; // 初始是day duration spendCount一致
      this.initData();
      this.renderSvg();
    },
    foldLeft(val) {
      this.leftFold = val;
      if (this.leftFold) {
        if (!this.showGantt) {
          this.showGantt = true;
        }
      }
    },
    onCheckAll(val) {
      this.tableData.forEach((item) => {
        item.check = val;
      });
    },
    onCheckItem(val, obj) {
      obj.check = val;
      let checkArr = [obj.uid];
      let indexFlag = obj.lineNumber;
      for (let i = indexFlag; i < this.tableData.length; i++) {
        if (checkArr.includes(this.tableData[i].father)) {
          this.tableData[i].check = val;
          if (!checkArr.includes(this.tableData[i].uid)) {
            checkArr.push(this.tableData[i].uid);
          }
        } else {
          break;
        }
      }
      if (obj.father) {
        this.initFatherCheck(obj.father);
      }
      // this.selectTaskArr = this.tableData.filter((v) => v.check && !this.checkChild(v));
      this.selectTaskArr = this.tableData.filter((v) => v.check);
    },
    setHeader() {
      this.showHeaderSetting = true;
      this.tempHeaderArr = _.cloneDeep(this.selectHeaderList);
    },
    confirmHeader(val) {
      this.selectHeaderList = val;
      localStorage.setItem('planListHeader', JSON.stringify(val));
      this.showHeaderSetting = false;
    },
    resetDefault() {
      // 后面调接口 这里就先用默认值
      this.tempHeaderArr = _.cloneDeep(this.defaultHeaderList);
    },
    initFatherCheck(id) {
      // 勾选子节点检测父节点联动
      let checked = true;
      this.tableData.forEach((item) => {
        // 找的下面所有的子节点
        if (item.father === id && !item.check) {
          checked = false;
        }
      });
      let obj = this.tableData.find((item) => item.uid === id);
      obj.check = checked;
    },
    openMenu(event, obj) {
      if (event.pageY + 350 < document.body.offsetHeight) {
        this.menuPosition.top = event.pageY - event.offsetY + 32 + 'px';
        this.menuPosition.left = event.pageX + 'px';
      } else {
        this.menuPosition.top = event.pageY - event.offsetY - 292 + 'px';
        this.menuPosition.left = event.pageX + 'px';
      }
      this.activeObj = obj;
      this.showMenu = true;
    },
    scrollAim(obj) {
      // 手动更新滚动状态
      // this.$refs.scrollbarRef.setScrollLeft(obj.styleLeft - 46);
      this.$refs.scrollbarRef.setScrollLeft(0);
    },
    onClickOutside() {
      this.showMenu = false;
    },
    changeDemension() {
      this.getGanttData();
    },
    initArrow() {
      // 重新生成前后置箭头
      this.arrowArr = [];
      this.showData.forEach((item) => {
        if (!item.hide) {
          // 不隐藏的连线
          const start = this.$refs['item_' + item.uid];
          if (Array.isArray(item.next) && item.next.length > 0) {
            item.next.forEach((point) => {
              if (this.checkObj(this.showData, point.id) && !this.checkObj(this.showData, point.id).hide) {
                // 不隐藏的连线
                let startX, startY, endX, endY;
                let temp = point.type.split('');
                if (temp[0] === 'F') {
                  startX = start[0].offsetWidth + start[0].offsetLeft + 2;
                  startY = this.countIndex(start[0].id.split('_')[1]) * this.lineHeight + this.lineHeight / 2;
                } else if (temp[0] === 'S') {
                  startX = start[0].offsetLeft - 2;
                  startY = this.countIndex(start[0].id.split('_')[1]) * this.lineHeight + this.lineHeight / 2;
                }
                const end = point.id;
                const endPoint = this.$refs['item_' + end];
                if (temp[1] === 'F') {
                  endX = endPoint[0].offsetLeft + endPoint[0].offsetWidth + 6;
                  endY = this.countIndex(endPoint[0].id.split('_')[1]) * this.lineHeight + this.lineHeight / 2;
                } else if (temp[1] === 'S') {
                  endX = endPoint[0].offsetLeft - 10;
                  endY = this.countIndex(endPoint[0].id.split('_')[1]) * this.lineHeight + this.lineHeight / 2;
                }
                let path;
                if (point.type === 'FS') {
                  if (startX + 30 < endX) {
                    path = `M ${startX},${startY} L${startX + 18},${startY} L${startX + 18},${endY} L${endX},${endY}`;
                  } else {
                    if (startY < endY) {
                      // 下方
                      path = `M ${startX},${startY} L${startX + 18},${startY} L${startX + 18},${startY + this.lineHeight / 2} L${endX - 12},${startY + this.lineHeight / 2} L${
                        endX - 12
                      },${endY} L${endX},${endY}`;
                    } else {
                      // 上方
                      path = `M ${startX},${startY} L${startX + 18},${startY} L${startX + 18},${startY - this.lineHeight / 2} L${endX - 12},${startY - this.lineHeight / 2} L${
                        endX - 12
                      },${endY} L${endX},${endY}`;
                    }
                  }
                } else if (point.type === 'FF') {
                  if (startX > endX) {
                    path = `M ${startX},${startY} L${startX + 14},${startY} L${startX + 14},${endY} L${endX},${endY}`;
                  } else {
                    path = `M ${startX},${startY} L${endX + 14},${startY} L${endX + 14},${endY} L${endX},${endY}`;
                  }
                } else if (point.type === 'SS') {
                  if (startX > endX) {
                    path = `M ${startX},${startY} L${endX - 12},${startY} L${endX - 12},${endY} L${endX},${endY}`;
                  } else {
                    path = `M ${startX},${startY} L${startX - 12},${startY} L${startX - 12},${endY} L${endX},${endY}`;
                  }
                } else if (point.type === 'SF') {
                  if (startX - 30 > endX) {
                    path = `M ${startX},${startY} L${startX - 12},${startY} L${startX - 12},${endY} L${endX},${endY}`;
                  } else {
                    if (startY < endY) {
                      // 下方
                      path = `M ${startX},${startY} L${startX - 12},${startY} L${startX - 12},${startY + this.lineHeight / 2} L${endX + 18},${startY + this.lineHeight / 2} L${
                        endX + 18
                      },${endY} L${endX},${endY}`;
                    } else {
                      // 上方
                      path = `M ${startX},${startY} L${startX - 12},${startY} L${startX - 12},${startY - this.lineHeight / 2} L${endX + 18},${startY - this.lineHeight / 2} L${
                        endX + 18
                      },${endY} L${endX},${endY}`;
                    }
                  }
                }
                this.arrowArr.push({
                  path: path,
                });
              }
            });
          }
        }
      });
    },
    checkObj(list, id) {
      // 返回对应id对象
      let res = list.find((item) => item.uid === id);
      return res;
    },
    countIndex(count) {
      let res = 0;
      this.showData.forEach((item, index) => {
        if (index < count) {
          if (!item.hide) {
            res++;
          }
        }
      });
      return res;
    },
    initData() {
      this.tableData.forEach((item, index) => {
        item.activityType = this.checkChild(item) ? 'WBS' : item.activityType ? item.activityType : 'Task';
        item.leader = this.checkChild(item) ? '' : item.leader;
        item.actualReviewer = this.checkChild(item) ? '' : item.actualReviewer;
        item.lineNumber = index + 1;
        item.check = false;
        item.styleLeft = (dayjs(item.start).diff(this.start, 'day') * this.getDemensionWidth()) / this.getScale();
        item.styleWidth = (dayjs(item.deadline).add(1, 'day').diff(dayjs(item.start), 'day') * this.getDemensionWidth()) / this.getScale();
      });

      // 如果有选择的任务，就回显
      if (this.selectTaskArr.length > 0) {
        this.tableData.forEach((v) => {
          this.selectTaskArr.forEach((e) => {
            if (v.taskOid === e.taskOid) {
              v.check = true;
            }
          });
        });
      }
    },
    getScale() {
      switch (this.demension) {
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
        case 'month': {
          return 120;
        }
        case 'week': {
          return 70;
        }
        case 'day': {
          return 40;
        }
      }
    },
    getWeek(date) {
      if (date.startOf('year').weekday() === 0 || date.startOf('year').weekday() === 6) {
        return date.week();
      } else if (date.week() === date.endOf('year').week()) {
        return 1;
      } else {
        return date.week() + 1;
      }
    },
    getFarestDate(list) {
      let date = dayjs().startOf(this.demension).add(1, this.demension);
      if (list && list.length > 0) {
        date = dayjs(list[0].deadline);
        list.forEach((item) => {
          if (date.isBefore(item.deadline)) {
            date = dayjs(item.deadline).startOf(this.demension);
          }
        });
      }
      return date;
    },
    getEarliestDate(list) {
      let date = dayjs().startOf(this.demension);
      if (list && list.length > 0) {
        date = dayjs(list[0].start);
        list.forEach((item) => {
          if (date.isAfter(item.start)) {
            date = dayjs(item.start).startOf(this.demension);
          }
        });
      }
      return date;
    },
    checkChild(obj) {
      // 检测元素是否下挂children 只要看下一个元素是不是他的子
      if (!obj) return false;
      let index = this.tableData.findIndex((item) => item.uid === obj.uid);
      let temp = this.tableData[index + 1] ? this.tableData[index + 1] : null;
      if (temp && temp.father === obj.uid) {
        return true;
      } else {
        return false;
      }
    },
    foldRow(obj) {
      // this.searchVal = this.headerShowList.some((v) => v.searchVal);
      let filterFlag = this.headerShowList.some((v) => {
        if (v?.searchVal || (v?.rangeVal && v?.rangeVal.length > 0)) {
          return true;
        }
      });
      if (filterFlag) return;
      // 收起是收起下面所有
      obj.fold = true;
      let foldArr = [obj.uid];
      let indexFlag = obj.lineNumber;
      for (let i = indexFlag; i < this.tableData.length; i++) {
        if (foldArr.includes(this.tableData[i].father)) {
          this.tableData[i].fold = true;
          this.tableData[i].hide = true;
          if (!foldArr.includes(this.tableData[i].uid)) {
            foldArr.push(this.tableData[i].uid);
          }
        } else {
          break;
        }
      }
      this.renderSvg();
    },
    expandRow(obj) {
      // this.searchVal = this.headerShowList.some((v) => v.searchVal);
      let filterFlag = this.headerShowList.some((v) => {
        if (v?.searchVal || (v?.rangeVal && v?.rangeVal.length > 0)) {
          return true;
        }
      });
      if (filterFlag) return;
      // 展开只展开第一级
      obj.fold = false;
      let foldVal = obj.uid;
      let fatherVal = obj.father ? obj.father : null;
      let indexFlag = this.tableData.findIndex((item) => item.uid === obj.uid);
      for (let i = indexFlag + 1; i < this.tableData.length; i++) {
        if (foldVal === this.tableData[i].father) {
          this.tableData[i].fold = true;
          this.tableData[i].hide = false;
        }
        if (fatherVal && fatherVal === this.tableData[i].father) {
          break;
        }
      }
      this.renderSvg();
    },
    onShowDetail() {
      this.showDetail = true;
      this.showMenu = false;
    },
    onRelease() {
      // 发布
      let tempSave = localStorage.getItem('planAutoSave');
      if (tempSave) {
        this.$confirm('检测到有未保存信息，请保存后操作，确认保存？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // 点击确认
            this.onSave();
            this.showMenu = false;
          })
          .catch(() => {
            // 点击取消后的回调
            this.showMenu = false;
          });
      } else {
        const ids = JSON.stringify([this.activeObj.taskOid]);
        // 调接口 再刷新
        this.isLoading = true;
        releaseActivity({ oids: ids }).then((res) => {
          this.isLoading = false;
          if (res.success) {
            this.$message.success('操作成功！');
            this.showMenu = false;
            this.refreshTableData();
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    },
    onRevoke() {
      // 撤销
      let tempSave = localStorage.getItem('planAutoSave');
      if (tempSave) {
        this.$confirm('检测到有未保存信息，请保存后操作，确认保存？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // 点击确认
            this.onSave();
            this.showMenu = false;
          })
          .catch(() => {
            // 点击取消后的回调
            this.showMenu = false;
          });
      } else {
        const ids = JSON.stringify([this.activeObj.taskOid]);
        this.isLoading = true;
        unReleaseActivity({ oids: ids }).then((res) => {
          this.isLoading = false;
          if (res.success) {
            this.$message.success('操作成功！');
            this.showMenu = false;
            this.refreshTableData();
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    },
    onReopen() {
      // 重新开启
      let tempSave = localStorage.getItem('planAutoSave');
      if (tempSave) {
        this.$confirm('检测到有未保存信息，请保存后操作，确认保存？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // 点击确认
            this.onSave();
            this.showMenu = false;
          })
          .catch(() => {
            // 点击取消后的回调
            this.showMenu = false;
          });
      } else {
        const ids = JSON.stringify([this.activeObj.taskOid]);
        this.isLoading = true;
        reopenTask({ oids: ids }).then((res) => {
          this.isLoading = false;
          if (res.success) {
            this.$message.success('操作成功！');
            this.showMenu = false;
            this.refreshTableData();
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    },
    onEditTask(obj) {
      if (obj) {
        this.activeObj = obj;
      }
      this.saveTemp = _.cloneDeep(this.tableData);
      this.editType = 'edit';
      this.showEdit = true;
      this.showMenu = false;
    },
    createTask() {
      this.showCreatePlan = false;
      this.activeObj = null;
      this.showEdit = true;
      this.editType = 'add';
    },
    onInsertTask() {
      this.showEdit = true;
      this.showMenu = false;
      this.editType = 'add';
    },
    onEditCancel() {
      this.showEdit = false;
      this.activeObj = null;
    },
    onEditConfirm(obj) {
      if (this.editType === 'add') {
        // 新增
        if (this.activeObj) {
          // 插入任务
          let insert = this.activeObj.lineNumber;
          if (obj.level === this.activeObj.level) {
            // 同级任务需要校验
            let newIndex = insert;
            let checkArr = [this.activeObj.uid];
            if (this.tableData[insert] && checkArr.includes(this.tableData[insert].father)) {
              // 有子任务就不能直接插入到下面
              for (let i = insert; i < this.tableData.length; i++) {
                if (!checkArr.includes(this.tableData[i].father)) {
                  newIndex = i;
                  break;
                } else {
                  if (!checkArr.includes(this.tableData[i].uid)) {
                    checkArr.push(this.tableData[i].uid);
                  }
                }
                if (i === this.tableData.length - 1) {
                  // 遍历到最后一位了
                  newIndex = i + 1;
                }
              }
              this.tableData.splice(newIndex, 0, obj);
              this.initPreAndNext(obj);
            } else {
              // 没有子任务直接插入到下面
              this.tableData.splice(insert, 0, obj);
              this.initPreAndNext(obj);
            }
          } else {
            // 子任务接插入
            this.tableData.splice(insert, 0, obj);
            if (this.activeObj.fold) {
              // 如果是收起这里要展开
              this.expandRow(this.activeObj);
            }
            this.initPreAndNext(obj);
          }
        } else {
          // 创建计划
          this.tableData.push(obj);
        }
      } else {
        // 编辑
        let insert = this.activeObj.lineNumber;
        obj.isEdit = true;
        this.tableData.splice(insert - 1, 1, obj);
        this.initPreAndNext(obj, this.activeObj);
      }
      this.showEdit = false;
      this.activeObj = null;
      this.onScheduling(obj.planOid);
      this.initData();
      this.initSvg();
      this.getGanttData();
      this.setAutoSave();
    },
    initPreAndNext(obj, preObj) {
      // 重置前后置任务
      let that = this;
      function initArr(list, type, obj) {
        // list数组   type前/后置任务
        list.forEach((item) => {
          let temp = that.tableData.find((task) => task.uid === item.id);
          if (type === 'previous') {
            if (!temp.next) {
              temp.next = [];
            }
            temp.next.push({
              id: obj.uid,
              name: obj.taskName,
              type: item.type,
              days: item.days,
            });
          } else if (type === 'next') {
            if (!temp.previous) {
              temp.previous = [];
            }
            temp.previous.push({
              id: obj.uid,
              name: obj.taskName,
              type: item.type,
              days: item.days,
            });
          }
        });
      }
      if (!preObj) {
        // 新建 直接写入
        initArr(obj.previous, 'previous', obj);
        initArr(obj.next, 'next', obj);
      } else {
        // 编辑需要对比
        let beforePrevious = preObj.previous ? preObj.previous : [];
        let beforeNext = preObj.next ? preObj.next : [];
        let currentPrevious = obj.previous ? obj.previous : [];
        let currentNext = obj.next ? obj.next : [];
        function checkDiff(arr1, arr2) {
          // 检查arr2里不包含arr1的元素，同时同步修改的
          let res = [];
          arr2.forEach((item) => {
            let index = arr1.findIndex((task) => task.id === item.id);
            if (index === -1) {
              res.push(item);
            }
          });
          return res;
        }
        function checkChange(arr1, arr2) {
          // 检查没有变化的元素项目 查看是否是type day更改
          let res = [];
          arr2.forEach((item) => {
            let index = arr1.findIndex((task) => task.id === item.id);
            if (index !== -1) {
              res.push(item);
            }
          });
          return res;
        }
        let previousAdd = checkDiff(beforePrevious, currentPrevious);
        let previousReduce = checkDiff(currentPrevious, beforePrevious);
        let nextAdd = checkDiff(beforeNext, currentNext);
        let nextReduce = checkDiff(currentNext, beforeNext);
        let previousChange = checkChange(beforePrevious, currentPrevious);
        let nextChange = checkChange(beforeNext, currentNext);
        initArr(previousAdd, 'previous', obj); // 同步添加
        initArr(nextAdd, 'next', obj);
        previousReduce.forEach((item) => {
          // 删除同步移除
          let temp = this.tableData.find((task) => task.uid === item.id);
          if (!temp.next) {
            temp.next = [];
          }
          let index = temp.next.findIndex((task) => task.id === item.id);
          temp.next.splice(index - 1, 1);
        });
        previousChange.forEach((item) => {
          // 没有增删的需要同步
          let temp = this.tableData.find((task) => task.uid === item.id);
          let tempObj = temp.next.find((next) => next.id === obj.id);
          tempObj.type = item.type;
          tempObj.days = item.days;
        });
        nextChange.forEach((item) => {
          // 没有增删的需要同步
          let temp = this.tableData.find((task) => task.uid === item.id);
          let tempObj = temp.previous.find((prev) => prev.id === obj.uid);
          tempObj.type = item.type;
          tempObj.days = item.days;
        });
        nextReduce.forEach((item) => {
          // 删除同步移除
          let temp = this.tableData.find((task) => task.uid === item.id);
          if (!temp.previous) {
            temp.previous = [];
          }
          let index = temp.previous.findIndex((task) => task.id === item.id);
          temp.previous.splice(index - 1, 1);
        });
      }
    },
    onUpgrade() {
      if (!this.activeObj.father || this.activeObj.level === 1) {
        this.$message.warning('当前任务无法升级');
        this.showMenu = false;
        return;
      }
      let index = this.activeObj.lineNumber;
      let count = 1;
      let insertId = -1; // 记录插入的位置id
      let tempArr = [this.activeObj.uid]; // 存放相关受影响fatherName
      let fatherObj = this.tableData.find((item) => item.uid === this.activeObj.father);
      let fatherArr = [this.activeObj.father, this.activeObj.uid];
      for (let i = index; i < this.tableData.length; i++) {
        if (tempArr.includes(this.tableData[i].father)) {
          count++;
          if (!tempArr.includes(this.tableData[i].uid)) {
            tempArr.push(this.tableData[i].uid);
          }
        }
        if (fatherArr.includes(this.tableData[i].father)) {
          if (!fatherArr.includes(this.tableData[i].uid)) {
            fatherArr.push(this.tableData[i].uid);
          }
        } else {
          insertId = this.tableData[i].uid; // 如果找到最后一个会进不去这里 就直接插入到最后去
          break;
        }
      }
      let moveItem = this.tableData.splice(index - 1, count);
      let moveIndex = this.tableData.findIndex((item) => item.uid === insertId);
      moveItem.forEach((item) => {
        item.level += -1;
      });
      this.activeObj.father = fatherObj.father ? fatherObj.father : '';
      this.activeObj.fatherNode = fatherObj.fatherNode ? fatherObj.fatherNode : '';
      if (moveIndex === -1) {
        moveIndex = this.length; // 如果是最后一个就还是在最后一个不然会是-1
      }
      this.tableData.splice(moveIndex, 0, ...moveItem);
      this.onScheduling(this.activeObj.planOid);
      this.getGanttData();
      this.showMenu = false;
      this.setAutoSave();
    },
    onDegrade() {
      // 降级操作直接针对上一个任务
      if (this.activeObj.lineNumber === 1) {
        this.$message.warning('当前任务无法降级');
        this.showMenu = false;
        return;
      }
      let preNode = this.tableData[this.activeObj.lineNumber - 2];
      if (this.activeObj.father === preNode.uid) {
        this.showMenu = false;
        this.$message.warning('当前任务无法降级');
        return;
      }
      if (this.activeObj.planOid !== preNode.planOid) {
        // 不属于同一个任务不让操作
        this.showMenu = false;
        this.$message.warning('当前任务无法降级');
        return;
      }
      if (preNode.father === this.activeObj.father) {
        // 跟上一个是同级
        this.activeObj.father = preNode.uid;
        this.activeObj.fatherNode = preNode.taskName;
      } else {
        // 跟上一个不是需要找到同级在哪
        for (let i = this.activeObj.lineNumber - 2; i >= 0; i--) {
          // 从前一个往前找
          if (this.tableData[i].father === this.activeObj.father) {
            this.activeObj.father = this.tableData[i].uid;
            this.activeObj.fatherNode = this.tableData[i].taskName;
            break;
          }
        }
      }
      this.activeObj.level += 1;
      let tempArr = [this.activeObj.uid];
      for (let i = this.activeObj.lineNumber; i < this.tableData.length; i++) {
        if (tempArr.includes(this.tableData[i].father)) {
          this.tableData[i].level += 1;
          if (!tempArr.includes(this.tableData[i].uid)) {
            tempArr.push(this.tableData[i].uid);
          }
        } else {
          break;
        }
      }
      this.onScheduling(this.activeObj.planOid);
      this.getGanttData();
      this.showMenu = false;
      this.setAutoSave();
    },
    onDelete() {
      if (this.selectTaskArr.length > 0 && !this.activeObj.planOid) {
        if (this.selectTaskArr.some((el) => el.planStatus !== '已排程')) return window.$message.warning('请选择【已排程】数据进行删除！');
        this.selectTaskArr.forEach((v) => {
          // this.deleteHandData(v, true);
          const newObj = _.cloneDeep(v);
          newObj.next = [];
          newObj.previous = [];
          this.initPreAndNext(newObj, v);
          let ix = this.tableData.findIndex((item) => item.id === v.id);
          this.tableData.splice(ix, 1);
        });

        this.onScheduling();
      } else {
        if (this.activeObj.planStatus !== '已排程') return window.$message.warning('请选择【已排程】数据进行删除！');
        this.deleteHandData(this.activeObj);
        this.onScheduling(this.activeObj.planOid);
      }
      this.selectTaskArr = [];
      // 删除后重新处理数据
      this.getGanttData();
      this.showMenu = false;
      this.setAutoSave();
    },
    // 删除方法处理
    deleteHandData(data) {
      try {
        // 右键删除
        let index = data.lineNumber;
        let count = 1;
        let tempArr = [data.uid]; // 存放相关受影响father
        for (let i = index; i < this.tableData.length; i++) {
          if (tempArr.includes(this.tableData[i].father)) {
            count++;
            if (!tempArr.includes(this.tableData[i].uid)) {
              tempArr.push(this.tableData[i].uid);
            }
          } else {
            break;
          }
        }
        this.tableData.splice(index - 1, count);

        // 断掉前后置任务
        this.tableData.forEach((item) => {
          // 如果有后置任务
          if (Array.isArray(item.next)) {
            for (let i = 0; i < item.next.length; i++) {
              if (tempArr.includes(item.next[i].id)) {
                item.next.splice(i, 1);
                i--;
              }
            }
          }
          // 如果有前置任务
          if (Array.isArray(item.previous)) {
            for (let i = 0; i < item.previous.length; i++) {
              if (tempArr.includes(item.previous[i].id)) {
                item.previous.splice(i, 1);
                i--;
              }
            }
          }
        });
      } catch (error) {
        console.log(error, '2693');
      }
    },

    moveUp() {
      // 往上找一直找到能放置的位置
      let hasMove = false;
      for (let i = this.activeObj.lineNumber - 2; i >= 0; i--) {
        if (this.tableData[i].father === this.activeObj.father) {
          // 目标任务以及下面的子任务一起动
          let moveLength = this.checkMoveLength(this.activeObj);
          let moveArr = this.tableData.splice(this.activeObj.lineNumber - 1, moveLength);
          this.tableData.splice(i, 0, ...moveArr);
          this.onScheduling();
          this.getGanttData();
          hasMove = true;
          break;
        }
      }
      if (!hasMove) {
        this.$message.warning('不支持的操作');
      }
      this.showMenu = false;
      this.setAutoSave();
    },
    moveDown() {
      let hasMove = false;
      for (let i = this.activeObj.lineNumber; i < this.tableData.length; i++) {
        if (this.tableData[i].father === this.activeObj.father) {
          // 目标任务以及下面的子任务一起动
          let moveLength = this.checkMoveLength(this.activeObj); // 选中目标算自己子任务的长度
          let newLength = this.checkMoveLength(this.tableData[i]); // 插入目标算自己子任务的长度插入到其下面
          let moveArr = this.tableData.splice(this.activeObj.lineNumber - 1, moveLength);
          this.tableData.splice(i + newLength - moveLength, 0, ...moveArr);
          this.onScheduling();
          this.getGanttData();
          hasMove = true;
          break;
        }
      }
      if (!hasMove) {
        this.$message.warning('不支持的操作');
      }
      this.showMenu = false;
      this.setAutoSave();
    },
    checkMoveLength(obj) {
      let tempArr = [obj.uid];
      let res = 1; // 算自己
      for (let i = obj.lineNumber; i < this.tableData.length; i++) {
        if (tempArr.includes(this.tableData[i].father)) {
          res++;
          if (!tempArr.includes(this.tableData[i].uid)) {
            tempArr.push(this.tableData[i].uid);
          }
        } else {
          break;
        }
      }
      return res;
    },
    editDeliverable(obj) {
      if (!obj.taskOid) {
        return this.$message.warning('请先保存任务');
      }
      this.deliverTaskId = obj.taskOid;
      this.showDeliverableDetail = true;
      this.activeObj = obj;
    },
    onEditDuration(obj) {
      // 父任务不能直接改
      if (this.checkChild(obj)) return;
      this.activeObj = obj;
      this.editFlag = 'duration';
      this.$nextTick(() => {
        this.$refs['numberInput' + obj.uid][0].focus();
      });
      this.saveTemp = _.cloneDeep(this.tableData);
    },
    onEditCompelete(oid) {
      this.activeObj.isEdit = true;
      this.activeObj = null;
      this.editFlag = '';
      this.onScheduling(oid);
      this.getGanttData();
      this.initData();
      this.setAutoSave();
    },
    onEditDeadlineConfirm() {
      // 修改完成时间是调整工期，开始不变
      if (dayjs(this.activeObj.deadline).isBefore(this.activeObj.start)) {
        // 完成时间早于开始时间要往前推
        this.activeObj.duration = 1;
        this.activeObj.start = this.activeObj.deadline;
      } else {
        // 如果完成时间不早于开始时间 只改工期
        this.activeObj.duration = this.calcDuration(this.activeObj.start, this.activeObj.deadline);
      }

      this.onEditCompelete(this.activeObj.planOid);
    },
    onEditDurationConfirm() {
      // 修改工期是调整完成时间，开始不变
      if (this.activeObj.duration < 1) {
        this.activeObj.duration = 1;
      }
      this.onEditCompelete(this.activeObj.planOid);
    },
    onEditStartConfirm() {
      // if (dayjs(this.activeObj.start).isAfter(this.activeObj.deadline)) {
      //   // 如果大于了 计划完成时间要跟着顺延
      //   this.activeObj.duration - 1;
      //   this.activeObj.deadline = this.activeObj.start;
      // } else {
      //   // 如果开始时间不大于完成时间 只改工期
      //   this.activeObj.duration = this.calcDuration(this.activeObj.start, this.activeObj.deadline);
      // }
      this.activeObj.deadline = this.calcDate(this.activeObj.start, this.activeObj.duration);
      this.onEditCompelete(this.activeObj.planOid);
    },
    onEditStart(obj) {
      if (this.checkChild(obj) || (obj.previous && obj.previous.length > 0)) return;
      this.activeObj = obj;
      this.editFlag = 'start';
      this.$nextTick(() => {
        this.$refs['dateInput' + obj.uid][0].focus();
      });
      this.saveTemp = _.cloneDeep(this.tableData);
    },
    onEditEnd(obj) {
      if (this.checkChild(obj) || (obj.previous && obj.previous.length > 0)) return;
      this.activeObj = obj;
      this.editFlag = 'end';
      this.$nextTick(() => {
        this.$refs['dateInput' + obj.uid][0].focus();
      });
      this.saveTemp = _.cloneDeep(this.tableData);
    },
    onEditLeader(obj) {
      this.activeObj = obj;
      this.editFlag = 'leader';
      this.$nextTick(() => {
        this.$refs['leaderSelect' + obj.uid][0].focus();
      });
    },
    editInfoConfirm() {
      if (this.activeObj) {
        this.activeObj.isEdit = true;
      }
      this.activeObj = null;
      this.editFlag = '';

      // 操作过后缓存
      this.setAutoSave();
    },
    editorChangeConfirm() {
      // 前面把子的值全部洗了
      const val = this.activeObj.editor;
      const flagFather = this.activeObj.father;
      const start = this.activeObj.lineNumber;
      for (let i = start; i < this.tableData.length; i++) {
        if (this.tableData[i].father !== flagFather && this.tableData[i].father) {
          this.tableData[i].editor = val;
          this.tableData[i].isEdit = true;
        } else {
          break;
        }
      }
      this.editInfoConfirm();
    },
    checkMenuAuth() {
      let editorId = this.activeObj?.editor;
      let currentId = this.userInfo.id;
      if (editorId === currentId) {
        return true;
      } else if (this.currentRole?.includes('项目经理') || this.currentRole?.includes('项目助理')) {
        return true;
      } else {
        return false;
      }
    },
    checkBtnAuth(row) {
      let editorId = row.editor;
      let currentId = this.userInfo.id;
      if (row.planStatus === '已排程') {
        if (editorId === currentId) {
          return true;
        } else if (this.currentRole?.includes('项目经理') || this.currentRole?.includes('项目助理')) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    onEditReviewer(obj) {
      this.activeObj = obj;
      this.editFlag = 'actualReviewer';
      this.$nextTick(() => {
        this.$refs['leaderSelect' + obj.uid][0].focus();
      });
    },
    onEditEditor(obj) {
      this.activeObj = obj;
      this.editFlag = 'editor';
      this.$nextTick(() => {
        this.$refs['editorSelect' + obj.uid][0].focus();
      });
    },
    updateDeliverInfo(val) {
      this.activeObj.deliverable = val;
    },
    toggleGantt() {
      this.showGantt = !this.showGantt;
      this.tableScrollLeft = 0;
      if (this.showGantt) {
        this.renderSvg();
      } else {
        this.leftFold = false;
      }
    },
    summaryDeliverables() {
      this.showSummaryDeliverables = true;
    },
    showFilter(item) {
      this.dateFilterKey = item.key;
      if (this.activeFilterKey === item.key) {
        this.activeFilterKey = '';
      } else {
        this.activeFilterKey = item.key;
        // if (key === 'start') {
        //   this.rangeVal = this.startRange;
        // } else if (key === 'deadline') {
        //   this.rangeVal = this.deadlineRange;
        // }
      }
    },
    getIconColor(data) {
      if (data.filter) {
        if (data.searchVal || (data.rangeVal && data.rangeVal.length === 2)) {
          return '#1890ff';
        } else {
          return '#333';
        }
      }
      // if (data.key === 'start') {
      //   if (this.startRange && this.startRange.length === 2) {
      //     return '#1890ff';
      //   } else {
      //     return '#333';
      //   }
      // } else if (data.key === 'deadline') {
      //   if (this.deadlineRange && this.deadlineRange.length === 2) {
      //     return '#1890ff';
      //   } else {
      //     return '#333';
      //   }
      // } else if (data.key === 'taskName') {
      //   if (this.searchVal) {
      //     return '#1890ff';
      //   } else {
      //     return '#333';
      //   }
      // }
    },
    // 表头时间过滤
    rangePickerChange(val, data) {
      // this.dateFilterKey = data.key;

      this.rangeVal = val;

      if (this.activeFilterKey === 'start') {
        this.startRange = val;
      } else if (this.activeFilterKey === 'deadline') {
        this.deadlineRange = val;
      }
      this.dataFilterObj[data.key] = val;
      // this.activeFilterKey = '';

      // let dataFilterArr = this.dataFilterObj[this.dateFilterKey];
      if (val && val.length === 2) {
        let startDate = val[0];
        let endDate = val[1];
        this.filterData = this.tableData.filter((v) => dayjs(v[this.dateFilterKey]).isSameOrAfter(startDate) && dayjs(v[this.dateFilterKey]).isSameOrBefore(endDate));
      }

      // this.tableData.forEach((item) => {
      //   if (data.key === 'leader') {
      //     if (this.getLeaderVal(item.leader).includes(val)) {
      //       this.filterData.push(item);
      //     }
      //   } else if (data.key === 'actualReviewer') {
      //     if (this.getReviewerVal(item.actualReviewer).includes(val)) {
      //       this.filterData.push(item);
      //     }
      //   } else {
      //     if (item[data.key].includes(val)) {
      //       this.filterData.push(item);
      //     }
      //   }
      // });
    },
    // 健康状态
    getHealthColor(key) {
      let healthColor = [
        {
          key: 'UNAVAILABLE',
          value: '#D9D9D9',
        },
        {
          key: 'GREEN',
          value: '#72C040 ',
        },
        {
          key: 'RED',
          value: '#E23C39',
        },
        {
          key: 'YELLOW',
          value: '#F0AE41',
        },
      ];
      const color = healthColor.find((i) => i.key === key)?.value;
      return color;
    },

    // 发布任务
    pubTask() {
      if (this.selectTaskArr.length === 0) return window.$message.warning('请选择需要发布的任务！');
      let copyArr = _.cloneDeep(this.selectTaskArr);
      let tempArr = copyArr.filter((obj) => !this.checkChild(obj));
      // 校验状态
      let checkStatus = tempArr.some((v) => v.planStatus !== '已排程');
      if (checkStatus) return window.$message.warning('请选择已排程的数据！');
      // 校验人员
      let checkUser = tempArr.some((v) => !v.actualReviewer || !v.leader);
      if (checkUser) return window.$message.warning('请输入执行人和审核人！');

      // 校验用户权限
      let checkUserPermissson = tempArr.some((v) => v?.editor !== this.userInfo.id);
      // if (checkUserPermissson) {
      //   if (!(this.currentRole?.includes('项目经理') || this.currentRole?.includes('项目助理'))) {
      //     window.$message.warning('请选择您能够发布的任务！');
      //   }
      // }
      if (checkUserPermissson && !(this.currentRole?.includes('项目经理') || this.currentRole?.includes('项目助理'))) return window.$message.warning('请选择您能够发布的任务！');

      // 发布
      let tempSave = localStorage.getItem('planAutoSave');
      if (tempSave) {
        this.$confirm('检测到有未保存信息，请保存后操作，确认保存？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // 点击确认
            this.onSave();
            this.showMenu = false;
          })
          .catch(() => {
            // 点击取消后的回调
            this.showMenu = false;
          });
      } else {
        const ids = tempArr.map((v) => v.taskOid);
        // 调接口 再刷新
        this.isLoading = true;
        releaseActivity({ oids: JSON.stringify(ids) }).then((res) => {
          this.isLoading = false;
          if (res.success) {
            this.$message.success('操作成功！');
            this.selectTaskArr = [];
            this.showMenu = false;
            this.refreshTableData();
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    },

    // 删除任务
    deleteTask() {
      window.$ElMessageBox
        .confirm('删除会一并删除子任务，确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          this.onDelete();
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  position: relative;
  height: 100%;
  background: #fff;
  padding: 16px;
  .fold-btn {
    position: absolute;
    top: 50%;
    width: 12px;
    height: 20px;
    line-height: 20px;
    font-size: var(--el-font-size-base);
    z-index: 12;
    cursor: pointer;
  }
  .to-center {
    top: 30%;
  }
  .context-menu {
    position: fixed;
    z-index: 21;
    width: 160px;
    padding: 20px 12px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
    font-size: var(--el-font-size-small);
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
}
.header-box {
  margin-bottom: 10px;
  .title {
    font-size: var(--el-font-size-large);
    display: inline-block;
    color: #333;
    font-weight: bold;
    margin-bottom: 10px;
  }
  :deep(.right_button) {
    .el-space__item {
      margin-right: 0px !important;
      margin-left: 10px;
    }
  }
}
.table-container {
  user-select: none;
  font-size: var(--el-font-size-small);
  text-align: center;
  // width: 100%;
  // display: flex;
  height: 100%;
  position: relative;
  // overflow-x: scroll;
  .table-header {
    position: relative;
    width: 100%;
    .gantt-header-left {
      height: 50px;
      line-height: 50px;
      background: #f6f6f6;
      color: #1f1f1f;
      font-weight: bold;
      z-index: 12;
      font-size: var(--el-font-size-base);
      position: relative;
      display: flex;
      transition: width ease-in 0.3s;
      .header-item {
        display: block;
        height: 100%;
        float: left;
        padding: 0 6px;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #eee;
        overflow: hidden;
        flex: auto;
        text-align: left;
        .icon-filter {
          cursor: pointer;
        }
      }
      .item-tiny {
        width: 30px;
        flex-grow: 0;
        flex-shrink: 0;
      }
      .header-item:first-child {
        border-left: 1px solid #eee;
      }
      .header-item:nth-child(2) {
        flex: none;
      }
      .header-item:nth-last-child(2) {
        // box-shadow: 3px 0 3px -1px #ccc;
      }
      .icon-btn {
        position: absolute;
        right: -14px;
        top: 0px;
        width: 24px;
        height: 26px;
        line-height: 24px;
        cursor: pointer;
        padding-top: 2px;
        border: 1px solid #ddd;
        border-radius: 3px;
        text-align: center;
        background: #f6f6f6;
        // display: none;
      }
      .icon-btn:hover {
        color: var(--el-color-primary);
        border-color: var(--el-color-primary-light-7);
      }
    }
    .table-mode {
      .icon-btn {
        right: 1px;
        border-right: none;
        width: 30px;
        height: 50px;
        line-height: 50px;
      }
    }
    .is-fold {
      .header-item:nth-last-child(2) {
        box-shadow: none;
      }
      .header-item:last-child {
        box-shadow: 3px 0 2px -1px #ccc;
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
      .header-item {
        display: inline-block;
        height: 50px;
        .header-top {
          white-space: nowrap;
          height: 25px;
          line-height: 24px;
          border-top: 1px solid #eee;
        }
        .header-top.monthEnd {
          visibility: visible;
          background: transparent;
          border-right: 1px solid #eee;
        }
        .header-top.weekend {
          visibility: visible;
          background: transparent;
          border-right: 1px solid #eee;
        }
        .header-date {
          height: 25px;
          line-height: 24px;
          width: 100%;
          border-top: 1px solid #eee;
          border-right: 1px solid #eee;
          border-bottom: 1px solid #eee;
          position: relative;
        }
        .header-date .header-line {
          height: calc(100vh - 290px);
          right: -1px;
          top: 26px;
          width: 1px;
          display: block;
          position: absolute;
          background: #eee;
          z-index: 1;
        }
        .header-date .weekend.header-line {
          background: #f9f9f9;
          border-right: 1px solid #eee;
          width: 40px;
        }
      }
      .header-item:last-child {
        border-right: none;
      }
    }
  }
  .show-container {
    position: absolute;
    display: flex;
    // width: 100%;
    padding-top: 50px;
  }
  .gannt_content {
    // overflow-x: scroll;
  }
  .gantt-left {
    flex-grow: 0;
    flex-shrink: 0;
    text-align: left;
    transition: width ease-in 0.3s;
    .text-btn {
      font-size: var(--el-font-size-extra-small);
    }
    .gantt-item {
      position: relative;
      z-index: 5;
      top: 0;
      left: 0;
      background: #fff;
      display: flex;
      transition: width ease-in 0.3s;
      .table-item {
        display: inline-block;
        height: 100%;
        width: 90px;
        // float: left;
        padding: 0 6px;
        overflow: hidden;
        border-right: 1px solid #eee;
        border-bottom: 1px solid transparent;
        position: relative;
        flex: auto;
        .table-btn {
          width: 16px;
          height: 100%;
          padding: 0 2px;
          cursor: pointer;
        }
        .space {
          width: 16px;
          height: 100%;
          display: inline-block;
        }
        .item-text {
          width: calc(100% - 18px);
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: top;
          .flag-icon {
            transform: translateY(3px);
          }
        }
        .health-wrapper {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }
      }
      .is-new::after {
        top: 0;
        left: 0;
        height: 8px;
        width: 8px;
        position: absolute;
        content: '';
        background: linear-gradient(135deg, #ccc, #ccc 50%, transparent 50%, transparent 100%);
      }
      .table-cell {
        display: inline-block;
      }
      .table-name {
        padding-left: 60px;
        .isParent {
          font-weight: bold;
          font-size: 14px;
        }
      }
      .table-item.level_0 {
        padding-left: 4px;
      }
      .table-item.level_1 {
        padding-left: 17px;
      }
      .table-item.level_2 {
        padding-left: 30px;
      }
      .table-item.level_3 {
        padding-left: 43px;
      }
      .table-item.level_4 {
        padding-left: 56px;
      }
      .table-item.level_5 {
        padding-left: 69px;
      }
      .table-item.level_6 {
        padding-left: 82px;
      }
      .table-item.level_7 {
        padding-left: 95px;
      }
      .table-item.level_8 {
        padding-left: 108px;
      }
      .table-item.level_9 {
        padding-left: 121px;
      }
      .table-item.level_10 {
        padding-left: 134px;
      }
      .table-item:first-child {
        border-left: 1px solid #eee;
      }
      .table-item:nth-child(2) {
        flex: none;
      }
      .table-item:last-child {
        box-shadow: 3px 0px 2px -1px #ccc;
      }
      .item-deliverable {
        width: 180px;
        padding-right: 4px;
        .text-left {
          display: inline-block;
          width: 148px;
          vertical-align: middle;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .text-previous {
          display: inline-block;
          width: 120px;
          vertical-align: middle;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .icon-btn {
          cursor: pointer;
          margin-left: 4px;
          display: none;
          vertical-align: middle;
        }
        .hover-hide {
          margin-left: 4px;
          vertical-align: middle;
        }
        .icon-btn:hover {
          color: var(--el-color-primary);
        }
      }
      .long-item {
        .text-left {
          width: calc(100% - 40px);
        }
        .number_count {
          display: inline-block;
          line-height: 14px;
          width: 16px;
          height: 16px;
          color: #ffffff;
          background-color: #9f9f9f;
          border-radius: 50%;
          text-align: center;
        }
      }
      .hover-item:hover {
        .icon-btn {
          display: inline-block;
        }
        .hover-hide {
          display: none;
        }
      }
      .item-tiny {
        width: 30px;
        padding: 0;
        text-align: center;
        flex-grow: 0;
        flex-shrink: 0;
      }
      .item-short {
        width: 50px;
      }
      .hover-icon {
        position: absolute;
        right: 4px;
        top: 1px;
        cursor: pointer;
        z-index: 99;
        color: #a1a1a1;
        margin-top: 11px;
      }
      ::v-deep(.el-input-number) {
        margin-left: -4px;
        .el-input__wrapper {
          padding: 0 4px;
          .el-input__inner {
            text-align: left;
            font-size: var(--el-font-size-small);
          }
        }
      }
      ::v-deep(.el-select) {
        margin-left: -4px;
        margin-top: -2px;
        .el-input__wrapper {
          padding: 1px 4px;
        }
        .el-input__inner {
          font-size: var(--el-font-size-small);
        }
        .el-input__prefix-inner {
          display: none;
        }
      }
      ::v-deep(.el-date-editor) {
        margin-left: -4px;
        margin-top: -2px;
        .el-input__wrapper {
          padding: 1px 4px;
        }
        .el-input__inner {
          font-size: var(--el-font-size-small);
        }
        .el-input__prefix-inner {
          display: none;
        }
      }
      .table-item:hover {
        .hover-icon {
          // display: block;
          // cursor: pointer;
          // float: right;
          // margin-top: 11px;
        }
        .hover-icon:hover {
          color: var(--el-color-primary);
        }
      }
    }
    .gantt-item:hover {
      background: var(--el-color-primary-light-9);
    }
    .gantt-item:last-child {
      border-bottom: 1px solid #eee;
    }
    .table-mode {
      .table-item {
        animation: borderTrans 0.6s;
        // border-right: 1px solid transparent;
        border-bottom: 1px solid #eee;
      }
    }
    .divider {
      .table-item {
        border-bottom: 1px solid #dcdcdc;
      }
    }
    .is_acive {
      background: var(--el-color-primary-light-9);
    }
  }
  .gantt-right {
    flex-grow: 1;
    display: inline-block;
    white-space: nowrap;
    .gantt-contaner {
      position: relative;
    }
    .weekend {
      background: #f9f9f9;
    }
    // .current {
    //   // background: #87cefa;
    //   position: relative;
    .current:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1px;
      height: 100%;
      background-color: #54bbfc;
    }
    // }
    .gantt-svg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      pointer-events: none;
    }
    .item-container {
      position: relative;
      height: 100%;
      top: 0;
      .divider {
        height: 100%;
        display: inline-block;
        position: absolute;
        border-right: 1px solid #eee;
      }
      .gantt-item {
        position: relative;
        flex: 1;
        .row-item {
          position: absolute;
          top: 3px;
          height: 26px;
          font-size: var(--el-font-size-extra-small);
          line-height: 26px;
          border-radius: 12px;
          border: 1px solid #ddd;
          background-color: #e1f5ff;
          z-index: 1;
          .pre-drag {
            cursor: w-resize;
          }
          .post-drag {
            cursor: e-resize;
          }
        }
        .level_0.row-item {
          background: #eceffe;
        }
        .level_1.row-item {
          background: #fcecfe;
        }
        .level_2.row-item {
          background: #fcffec;
        }
      }
      .gantt-item:last-child {
        border-bottom: 1px solid #eee;
      }
      .row-divider {
        border-bottom: 1px solid #dcdcdc;
      }
    }
  }
}
.short-height {
  height: calc(100% - 100px);
}
.bottom-container {
  border-top: 1px solid #ccc;
  margin-top: 12px;
  padding-top: 12px;
}
::v-deep(.el-drawer__body) {
  .projectSearch {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .projectList {
      font-size: var(--el-font-size-medium);
      color: #333;
    }
  }
  .form-row {
    padding-left: 12px;
    margin-bottom: 12px;
    .form-label {
      width: 140px;
      display: inline-block;
    }
  }
}
::v-deep(.el-scrollbar__bar) {
  z-index: 10;
}
::v-deep(.el-drawer__header) {
  margin-bottom: 0px;
}
::v-deep(.el-dialog__header) {
  border-bottom: 1px solid var(--el-border-color);
  margin-right: 0;
  padding: 12px 16px;
  .el-dialog__title {
    font-size: var(--el-font-size-medium);
  }
}
::v-deep(.el-dialog__footer) {
  border-top: 1px solid var(--el-border-color);
  .fl {
    margin-top: 6px;
  }
}
::v-deep(.create-dialog) {
  .input-row {
    margin-bottom: 12px;
  }
  .label-text {
    line-height: 32px;
    padding-left: 12px;
  }
}
@keyframes borderTrans {
  0% {
    border-right: 1px solid #eee;
    border-bottom: 1px solid transparent;
  }
  50% {
    border-right: 1px solid transparent;
    border-bottom: 1px solid transparent;
  }
  100% {
    border-right: 1px solid transparent;
    border-bottom: 1px solid #eee;
  }
}
</style>
<style lang="scss">
.deliverable-popper {
  .deliverable-item {
    font-size: var(--el-font-size-small);
    line-height: 24px;
  }
}
</style>
