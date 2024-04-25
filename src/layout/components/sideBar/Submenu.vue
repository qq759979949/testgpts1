<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-03 17:00:39
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\layout\components\sideBar\Submenu.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-menu-item v-if="!menu.children" @click="goMenu" :index="menu.id">
    <!-- <el-icon size="14">
      <svg><use :xlink:href="'#' + menu.icon"></use></svg>
    </el-icon> -->
    <i class="iconfont" :class="menu.icon" v-if="menu.title !== '任务中心' && menu.title !== '任务预警中心'"></i>
    <span v-if="menu.title !== '任务中心' && menu.title !== '任务预警中心'">{{ menu.title }}</span>
    <i
      class="iconfont"
      :class="menu.icon"
      v-if="(!taskAmount.taskCenterData && menu.title === '任务中心') || (!taskAmount.warnTaskCenterData && menu.title === '任务预警中心')"
    ></i>
    <span v-if="(!taskAmount.taskCenterData && menu.title === '任务中心') || (!taskAmount.warnTaskCenterData && menu.title === '任务预警中心')">{{ menu.title }}</span>
    <i
      class="iconfont"
      :class="menu.icon"
      v-if="(taskAmount.taskCenterData > 0 && menu.title === '任务中心') || (taskAmount.warnTaskCenterData > 0 && menu.title === '任务预警中心')"
    ></i>
    <el-badge
      :value="menu.title === '任务中心' ? taskAmount.taskCenterData : taskAmount.warnTaskCenterData"
      :class="menu.title === '任务中心' ? 'badgeItem' : 'badgeItem1'"
      v-if="(taskAmount.taskCenterData > 0 && menu.title === '任务中心' && !collapse) || (taskAmount.warnTaskCenterData > 0 && menu.title === '任务预警中心' && !collapse)"
    >
      <span>{{ menu.title }}</span>
    </el-badge>
    <!-- <i
      class="iconfont"
      :class="menu.icon"
      v-if="(taskAmount.taskCenterData === 0 && menu.title === '任务中心') || (taskAmount.warnTaskCenterData === 0 && menu.title === '任务预警中心')"
    ></i>
    <span v-if="(taskAmount.taskCenterData === 0 && menu.title === '任务中心') || (taskAmount.warnTaskCenterData === 0 && menu.title === '任务预警中心')">{{ menu.title }}</span> -->
  </el-menu-item>
  <el-sub-menu v-else :index="menu.id">
    <template #title>
      <i class="iconfont" :class="menu.icon"></i>
      <!-- <el-icon size="14">
        <svg><use :xlink:href="'#' + menu.icon"></use></svg>
      </el-icon> -->
      <span>{{ menu.title }}</span>
    </template>
    <Submenu v-for="submenu in menu.children" :key="submenu.id" :is-nest="true" :menu="submenu" />
  </el-sub-menu>
</template>

<script>
import { useCommonApi } from '@/stores';
export default {
  name: 'Submenu',
  components: {},
  props: {
    menu: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    collapse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      taskAmount: {},
      useCommon: useCommonApi(),
    };
  },
  watch: {
    useCommon: {
      handler(n) {
        this.taskAmount = n.taskAmount;
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // let useCommon = useCommonApi();
    // const useCommon = useCommonApi();
    // this.taskAmount = useCommon.taskAmount;
    // console.log(this.taskAmount);
  },
  methods: {
    goMenu() {
      if (this.menu.name) {
        this.$router.push({ name: this.menu.name });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.iconfont {
  font-size: var(--el-font-size-base);
  // color: #333;
  width: 18px;
  margin-right: 6px;
  display: inline-block;
}
.badgeItem {
  :deep(.el-badge__content.is-fixed) {
    top: 28px;
    right: calc(-64px + var(--el-badge-size) / 2) !important;
  }
}
.badgeItem1 {
  :deep(.el-badge__content.is-fixed) {
    top: 28px;
    right: calc(-36px + var(--el-badge-size) / 2) !important;
  }
}
</style>
