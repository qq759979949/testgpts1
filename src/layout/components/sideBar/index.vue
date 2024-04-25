<template>
  <div class="sideBar">
    <div class="logo">
      <img src="@/assets/img/logo.png" alt="" v-if="!isCollapse" @click="goHome" />
      <img src="@/assets/img/logo_small.png" alt="" v-else @click="goHome" />
    </div>
    <div class="menuList">
      <el-scrollbar class="scroll">
        <el-menu style="min-height: calc(100vh - 100px)" unique-opened :collapse="isCollapse" :default-active="activeIndex">
          <Submenu v-for="menu in menuList" :key="menu.id" :menu="menu" :collapse="isCollapse"></Submenu>
        </el-menu>
      </el-scrollbar>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Submenu from './Submenu.vue';
import { mapState } from 'pinia';
import { useMenuStore } from '@/stores/modules/menu.js';
import { useCommonApi } from '@/stores';
export default {
  name: 'sideBar',
  components: {
    Submenu,
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mainMenu: [
        {
          title: '门户',
          id: '0',
          name: 'homePage',
          icon: 'icon-homePage',
        },
        {
          title: '项目列表',
          id: '1',
          name: 'projectList',
          icon: 'icon-prject_mange',
        },
        {
          title: '报表工具',
          id: '4',
          name: 'reportsTools',
          icon: 'icon-30tongjibaobiao',
        },
        // {
        //   title: '仪表工具',
        //   id: '5',
        //   name: 'problemBase',
        //   icon: 'icon-meter_tools',
        // },
        {
          title: '任务中心',
          id: '6',
          name: 'toDoPage',
          icon: 'icon-daiban',
          value: 0,
        },
        {
          title: '任务预警中心',
          id: '7',
          name: 'warningTask',
          icon: 'icon-daiban',
          value: 0,
        },
        // {
        //   title: '创建项目',
        //   id: '8',
        //   name: 'createProject',
        //   icon: 'icon-zhibiao',
        // },
        {
          title: '配置库',
          id: '5',
          name: 'productConfig',
          icon: 'icon-peizhi',
        },
        {
          title: '指标库',
          id: '9',
          name: 'indexLibrary',
          icon: 'icon-zhibiao',
        },
      ],
      projectMenu: JSON.parse(sessionStorage.getItem('projectMenu')),
      userInfo: JSON.parse(window.$Cookies.get('userInfo')),
      useCommon: useCommonApi(),
    };
  },
  computed: {
    ...mapState(useMenuStore, ['activeIndex']),
    menuList() {
      return this.$route.path.indexOf('/project/') === 0 ? this.projectMenu : this.mainMenu;
    },
  },
  mounted() {
    // this.getTaskAmount();
    // this.getProjectMenu();
  },
  watch: {
    '$route.path': {
      handler(n) {
        this.projectMenu = JSON.parse(sessionStorage.getItem('projectMenu'));
      },
    },
    useCommon: {
      handler(n) {
        if (n.isFirst) {
          this.projectMenu = JSON.parse(sessionStorage.getItem('projectMenu'));
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // getProjectMenu() {
    //   // 获取项目菜单
    //   this.projectMenu = [
    //     // {
    //     //   title: '单项目首页',
    //     //   icon: 'icon-homePage',
    //     //   name: 'projectDetail',
    //     //   id: '3-1',
    //     // },
    //     // {
    //     //   title: '团队',
    //     //   icon: 'icon-tuandui',
    //     //   name: 'projectTeam',
    //     //   id: '3-2',
    //     // },
    //     // {
    //     //   title: '目标/指标',
    //     //   icon: 'icon-zhibiao',
    //     //   name: 'target',
    //     //   id: '3-3',
    //     // },
    //     // {
    //     //   title: '产品配置',
    //     //   icon: 'icon-peizhi',
    //     //   // name: 'productConfig',
    //     //   name: 'addConfig',
    //     //   id: '3-4',
    //     // },
    //     // {
    //     //   title: '计划',
    //     //   icon: 'icon-jihua',
    //     //   name: 'projectPlan',
    //     //   id: '3-5',
    //     // },
    //     // {
    //     //   title: '文件',
    //     //   icon: 'icon-wenjian',
    //     //   name: 'projectFiles',
    //     //   id: '3-6',
    //     // },
    //     // {
    //     //   title: '基线',
    //     //   icon: 'icon-jixian',
    //     //   name: 'baseline',
    //     //   id: '3-7',
    //     // },
    //     // {
    //     //   title: '评审',
    //     //   icon: 'icon-pingshen',
    //     //   name: 'projectReview',
    //     //   id: '3-8',
    //     // },
    //     // {
    //     //   title: '变更',
    //     //   icon: 'icon-biangeng',
    //     //   name: 'projectChange',
    //     //   id: '3-9',
    //     // },
    //     // {
    //     //   title: '问题',
    //     //   icon: 'icon-shuoming',
    //     //   name: 'projectQuestion',
    //     //   id: '3-10',
    //     // },
    //     // {
    //     //   title: '风险',
    //     //   icon: 'icon-fengxian',
    //     //   name: 'projectRisk',
    //     //   id: '3-11',
    //     // },
    //     // {
    //     //   title: '评价验收',
    //     //   icon: 'icon-pingjia',
    //     //   name: 'projectEvaluate',
    //     //   id: '3-12',
    //     // },
    //     // {
    //     //   title: '薪酬包',
    //     //   icon: 'icon-qiandai',
    //     //   name: 'payPacket',
    //     //   id: '3-13',
    //     // },
    //     // {
    //     //   title: '相关进程',
    //     //   icon: 'icon-renwujincheng',
    //     //   name: 'relatedProcesses',
    //     //   id: '3-14',
    //     // },
    //     // {
    //     //   title: '报表',
    //     //   icon: 'icon-baobiao',
    //     //   name: 'reportForms',
    //     //   id: '3-15',
    //     // },
    //     // {
    //     //   title: '考核激励',
    //     //   icon: 'icon-yanshou-qu',
    //     //   name: 'examineIncentive',
    //     //   id: '3-16',
    //     // },
    //     // {
    //     //   title: '产品和竞品配置参数',
    //     //   icon: 'icon-peizhi',
    //     //   name: 'competitorConfig',
    //     //   id: '3-17',
    //     // },
    //   ];
    // },
    goHome() {
      this.$router.push({ name: 'homePage' });
    },
    // // 获取任务总数量
    // getTaskAmount() {
    //   window.$api.toDoApi.getAllTaskAmount({ pdUser: this.userInfo.username }).then((res) => {
    //     if (res.success) {
    //       let taskCenterData = res.data.workflowTaskAmount + res.data.assignTaskAmount + res.data.approvalTaskAmount;
    //       let warnTaskCenterData = res.data.redTaskAmount + res.data.yellowTaskAmount;
    //       this.mainMenu = this.mainMenu.map((item) => {
    //         if (item.name === 'toDoPage') {
    //           item.value = taskCenterData;
    //         }
    //         if (item.name === 'warningTask') {
    //           item.value = warnTaskCenterData;
    //         }
    //         return item;
    //       });
    //     } else {
    //       this.$message.error(res.message);
    //     }
    //   });
    // },
  },
};
</script>

<style scoped lang="scss">
.sideBar {
  // box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  // box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08);
  // box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  .logo {
    height: 60px;
    line-height: 60px;
    text-align: center;
    cursor: pointer;
    > img {
      height: 40px;
      margin-top: 10px;
    }
  }
  .menuList {
    height: calc(100vh - 60px);
    :deep(.el-menu) {
      border-right: 0;
    }
    :deep(.el-menu-item.is-active) {
      background-color: var(--el-color-primary-light-9);
      border-left: 4px solid;
    }
    :deep(.is-horizontal) {
      .el-scrollbar__thumb {
        display: none;
      }
    }
    .el-scrollbar {
      height: calc(100% - 40px);
    }
  }
}
</style>
