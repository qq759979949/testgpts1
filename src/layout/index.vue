<template>
  <div class="layout_style">
    <!-- 项目页面 -->
    <el-container v-if="route.name !== 'homePage'">
      <!-- 左边导航 -->
      <el-aside :width="Data.isCollapse ? '65px' : '210px'" class="elSide">
        <SideBar :isCollapse="Data.isCollapse">
          <div class="bottomCollapse" v-if="!Data.isCollapse" @click="openCollapse">
            <el-icon class="icon"><Fold /></el-icon>
          </div>
          <div class="bottomCollapse1" v-else @click="openCollapse">
            <el-icon class="icon"><Expand /></el-icon>
          </div>
        </SideBar>
      </el-aside>
      <el-container :width="Data.isCollapse ? 'calc(100vw - 100px)' : ''">
        <el-header class="header">
          <MyHeader />
        </el-header>
        <el-main class="main">
          <NavBar @refreshRoute="refreshRoute" />
          <!-- <NavBar /> -->
          <Breadcrumb />
          <div class="scrollView">
            <el-scrollbar>
              <div class="routerView">
                <!--  v-if="Data.isShowMain" -->
                <router-view v-if="Data.isShowMain">
                  <template #default="{ Component, route }">
                    <keep-alive :include="navTagStore.keepAliveList">
                      <component :is="wrap(route.name, Component)" :key="route.fullPath" />
                    </keep-alive>
                  </template>
                </router-view>
              </div>
            </el-scrollbar>
          </div>
        </el-main>
      </el-container>
      <div class="fixedExamine" v-if="Data.isShowIcon" @click="openExamineIncentive">
        <i class="iconfont icon-yanshou-qu"></i>
      </div>
    </el-container>
    <!-- 门户页面 -->
    <el-container v-if="route.name === 'homePage'">
      <el-header class="headerHome">
        <MyHeader />
      </el-header>
      <el-main class="mainHome">
        <div class="scrollView">
          <el-scrollbar height="100%">
            <div class="routerView">
              <router-view>
                <template #default="{ Component, route }">
                  <keep-alive :include="navTagStore.keepAliveList">
                    <component :is="wrap(route.name, Component)" :key="route.fullPath" />
                  </keep-alive>
                </template>
              </router-view>
            </div>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
    <addExamineIncentive v-if="Data.isShowIcon" v-model:isShowExamin="Data.isShowExamine"></addExamineIncentive>
  </div>
</template>

<script setup>
import SideBar from './components/sideBar/index.vue';
import MyHeader from './components/header.vue';
import NavBar from './components/navBar.vue';
import Breadcrumb from './components/breadcrumb.vue';
import { useNavTagStore } from '@/stores/modules/navTag.js';
import { useMenuStore } from '@/stores/modules/menu';
import addExamineIncentive from '@/views/examineIncentive/addExamineIncentive.vue';
let permissionsList = JSON.parse(localStorage.getItem('buttonList')) || ['a:a:a']; // 获取账号在系统中的按钮权限
let singleProjectPermissionsList = JSON.parse(localStorage.getItem('singleProjectRole')) || ['a:a:a']; // 获取账号在系统中的按钮权限
const api = window.$api;
const navTagStore = useNavTagStore();
const menuStore = useMenuStore();
const route = useRoute();
const Data = reactive({
  isShowMain: true,
  isCollapse: false,
  isShowIcon: false, // 控制考核激励的图标
  isShowExamine: false, // 控制考核激励的新增弹窗
});

// 项目内的模块都能新增考核激励
watch(
  () => route,
  (val) => {
    if (val.path.includes('/project/') && (permissionsList.includes('/plmProject/EAI') || singleProjectPermissionsList.includes('/plmProject/EAI'))) {
      Data.isShowIcon = true;
    } else {
      Data.isShowIcon = false;
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

const refreshRoute = () => {
  Data.isShowMain = false;
  nextTick(() => {
    Data.isShowMain = true;
  });
};
const openCollapse = () => {
  Data.isCollapse = !Data.isCollapse;
  if (!Data.isCollapse) {
    menuStore.leftMenuWidth = '210';
  } else {
    menuStore.leftMenuWidth = '65';
  }
};

// 打开考核激励新增弹窗
const openExamineIncentive = () => {
  let paramsObj = new FormData();
  paramsObj.append('oid', JSON.parse(sessionStorage.getItem('currentProject')).oid);
  api.assessmentIncentivesApi.checkAddAssessmentIncentive(paramsObj).then((res) => {
    if (res.success) {
      Data.isShowExamine = true;
    } else {
      window.$message.error(res.message);
    }
  });
};

// 很多页面涉及到多个路由调用同一个组件，只要确保路由名称唯一就行
const cacheMap = new Map();
const wrap = (name, component) => {
  let cache;
  const cacheName = name;
  if (cacheMap.has(cacheName)) {
    cache = cacheMap.get(cacheName);
  } else {
    cache = {
      name: cacheName,
      render() {
        return h('div', { className: 'cache-page-wrapper' }, component);
      },
    };
    cacheMap.set(cacheName, cache);
  }
  return h(cache);
};
</script>

<style scoped lang="less">
.header {
  height: 40px;
  background: var(--el-color-primary);
}
.fixedExamine {
  position: fixed;
  right: 5px;
  bottom: 50%;
  width: 30px;
  height: 30px;
  line-height: 29px;
  text-align: center;
  background-color: #386bd7;
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  z-index: 999 !important;
}
.headerHome {
  // height: 70px;
  background: var(--el-color-primary);
}
.main {
  background: #f3f6f9;
  padding: 0;
  .scrollView {
    --c-height: calc(100vh - 102px);
    width: 100%;
    height: calc(100vh - 102px);
    .routerView {
      position: relative;
      min-height: calc(100vh - 102px);
      border-radius: 4px;
    }
  }
}
.microView {
  .routerView {
    position: relative;
    width: 100%;
    // min-height: calc(100vh - 60px - 36px - 30px);
    margin: 0;
    padding: 16px 16px 0;
    background: #fff;
    border-radius: 4px;
  }
}
.mainHome {
  background: #f3f6f9;
  padding: 16px 4px 16px 16px;
  .scrollView {
    --c-height: calc(100vh - 102px);
    width: 100%;
    height: calc(100vh - 92px);
    .routerView {
      position: relative;
      width: 100%;
      overflow-x: hidden;
      border-radius: 4px;
    }
  }
}
.elSide {
  z-index: 20;
  // box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08);
  transition: 0.3s ease;
}
.bottomCollapse,
.bottomCollapse1 {
  height: 40px;
  border-top: solid 1px var(--el-menu-border-color);
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 18px;
  .icon {
    cursor: pointer;
  }
}

/**调整高度 */
.layout_style {
  :deep(.el-container) {
    .mainHome {
      .scrollView {
        .el-scrollbar {
          .el-scrollbar__wrap {
            .el-scrollbar__view {
              height: 100%;
              .routerView {
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
