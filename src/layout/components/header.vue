<template>
  <div class="headerContent" :class="route.name === 'homePage' ? 'headerLogo' : ''">
    <div class="logo" v-if="route.name === 'homePage'">
      <img src="@/assets/img/sdlgWhite.png" alt="" />
    </div>
    <div class="rightHeader">
      <div>
        <div class="projectName" v-if="router.currentRoute.value.fullPath.includes('project/')">
          <el-icon class="projectIcon" @click="backProjectList"><Back /></el-icon>
          {{ Data.projectObj?.type }}--{{ useCommon.projectShortName || Data.projectObj?.projectShortName }}--{{ Data.projectObj?.projectName }}
        </div>
      </div>
      <div class="rightFunc">
        <div class="lastestSearch" @click="fullScreen">
          <img src="@/assets/img/fullscreen.png" class="imgScreen" v-if="!Data.isFullScreen" />
          <img src="@/assets/img/exitFullscreen.png" class="imgScreen" v-else />
          <!-- <el-icon class="icon"><FullScreen /></el-icon> -->
        </div>
        <div class="lastestSearch">
          <el-popover placement="bottom" :width="400" trigger="click">
            <template #reference>
              <div @click="getLastProject()">
                <el-icon class="icon"><Message /></el-icon>
                最近访问
              </div>
            </template>
            <el-table :data="Data.gridData" height="400">
              <el-table-column property="projectName" label="项目名称">
                <template #default="scope">
                  <el-link type="primary" @click="goProject(scope.row)" :underline="false">
                    {{ scope.row.projectName }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column property="projectShortName" label="项目编号" />
            </el-table>
          </el-popover>
        </div>
        <div class="lastestSearch">
          <el-popover placement="bottom" :width="200" trigger="click">
            <template #reference>
              <div @click="getQuickLink()">
                <el-icon class="icon"><Promotion /></el-icon>
                快速入口
              </div>
            </template>
            <el-table :data="Data.linkData">
              <el-table-column property="name" label="名称">
                <template #default="scope">
                  <el-link type="primary" @click="goLink(scope.row)" :underline="false">
                    {{ scope.row.name }}
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-popover>
        </div>
        <el-popover placement="bottom" :width="280" trigger="click">
          <template #reference>
            <el-icon title="个性化" class="Setting" size="20"><Setting /></el-icon>
          </template>
          <div class="customBox">
            <div class="title">个性化</div>
            <!-- <div class="row">
          <div class="name mb6">语言环境</div>
          <div class="content">
            <el-button-group>
              <el-button 
                :type="curLang === item.id ? 'primary' : null" 
                v-for="item in langList" 
                :key="item.id"
                @click="changeLang(item)">{{ item.name }}</el-button>
            </el-button-group>
          </div>
        </div> -->
            <div class="row">
              <div class="name mb6">主题色</div>
              <div class="content">
                <div
                  class="color"
                  v-for="item in Data.colorList"
                  :key="item.class"
                  :class="{ actived: Data.curTheme === item.class }"
                  :style="{ backgroundColor: item.color }"
                  @click="changeTheme(item)"
                ></div>
              </div>
            </div>
            <div class="row">
              <div class="name mb6">
                文本字号 （{{ Data.fontSize }}px）
                <el-popover placement="top-start" :width="200" trigger="hover" content="为保证最佳显示效果，建议选择12-14">
                  <template #reference>
                    <el-icon class="tips-icon"><InfoFilled /></el-icon>
                  </template>
                </el-popover>
              </div>
              <div class="content">
                <el-slider v-model="Data.fontSize" :max="18" :min="12" @change="changeFontSize" class="font-slider" />
              </div>
            </div>
          </div>
        </el-popover>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userInfo.username }}
            <el-icon class="arrowDown"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="goManage">
                <span>后台管理</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { lastProject, addHistory } from '@/api/project';
import { ElMessageBox } from 'element-plus';
import { useUserStore, useCommonApi } from '@/stores';
import { getAll } from '@/api/homePage.js';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const useCommon = useCommonApi();
const { userInfo } = userStore;
const api = window.$api;

const Data = reactive({
  curLang: 'zh',
  colorList: [
    { name: '薄暮', color: '#F5222D', class: 'baomu' },
    { name: '火山', color: '#FA541C', class: 'houshan' },
    { name: '日暮', color: '#FAAD14', class: 'rimu' },
    { name: '明青', color: '#13C2C2', class: 'mingqing' },
    { name: '极光绿', color: '#52C41A', class: 'jiguanglv' },
    { name: '拂晓蓝', color: '#386bd7', class: 'fuxiaolan' },
    { name: '酱紫', color: '#722ED1', class: 'jiangzi' },
    { name: '青绿', color: '#4FC08D', class: 'qinglv' },
  ],
  curTheme: '#386BD7',
  fontSize: 14,
  gridData: [],
  linkData: [],
  projectObj: JSON.parse(sessionStorage.getItem('currentProject')),
  isFullScreen: false,
  // projectName: JSON.parse(sessionStorage.getItem('currentProject')) ? JSON.parse(sessionStorage.getItem('currentProject')).projectAbbreviation : '',
  // projectNumber: JSON.parse(sessionStorage.getItem('currentProject')) ? JSON.parse(sessionStorage.getItem('currentProject')).projectShortName : '',
});

onBeforeMount(() => {
  Data.curTheme = localStorage.getItem('curTheme');
  const el = document.documentElement;
  el.setAttribute('class', Data.curTheme);

  Data.curLang = localStorage.getItem('curLang');
  window.$i18n.locale = Data.curLang;
});

onMounted(() => {
  const el = document.documentElement;
  el.style.fontSize = '14px';
});

watch(
  () => useCommon,
  (n) => {
    if (n.isFirst) {
      Data.projectObj = JSON.parse(sessionStorage.getItem('currentProject'));
    }
  },
  {
    deep: true,
    immediate: true,
  },
);
watch(
  () => route.path,
  () => {
    Data.projectObj = JSON.parse(sessionStorage.getItem('currentProject'));
  },
);

watch(
  () => Data.projectObj,
  (val) => {
    useCommon.projectShortName = val.projectShortName;
  },
  {
    deep: true,
  },
);

// 跳转到后台管理
// const mode = ref(import.meta.env);
const goManage = () => {
  // if (mode === 'development') {
  //   window.open('http://192.168.3.230:9100/pdc-diginn/#/index');
  // } else {
  const hostname = location.hostname;
  window.open(`http://${hostname}:9100/pdc-diginn/#/index`);
  // }

  // window.open("/pdc-diginn/#/index");

  // window.location.href = `http://${hostname}:9100/#/homePage`; //单点登录
};

const handleCommand = (key) => {
  if (key === 'logout') {
    logoutFun();
  } else if (key === 'goManage') {
    goManage();
  }
};

const logoutFun = () => {
  ElMessageBox.confirm('您确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      userStore.logout();
    })
    .catch(() => {});
};

const changeLang = (item) => {
  Data.curLang = item.id;
  localStorage.setItem('curLang', Data.curLang);
  window.$i18n.locale = Data.curLang;
};
const changeTheme = (item) => {
  Data.curTheme = item.class;
  localStorage.setItem('curTheme', Data.curTheme);
  const el = document.documentElement;
  el.setAttribute('class', Data.curTheme);
};

const changeFontSize = (val) => {
  Data.fontSize = val;
  const el = document.documentElement;
  el.style.setProperty('--el-font-size-base', val + 'px');
  el.style.setProperty('--el-font-size-medium', val + 2 + 'px');
  el.style.setProperty('--el-font-size-large', val + 4 + 'px');
  el.style.setProperty('--el-font-size-extra-large', val + 6 + 'px');
  el.style.setProperty('--el-font-size-small', val - 1 + 'px');
  el.style.setProperty('--el-font-size-extra-small', val - 2 + 'px');
  const paginationEl = document.querySelector('.el-pagination');
  if (paginationEl) {
    paginationEl.style.setProperty('--el-pagination-font-size-small', val - 1 + 'px');
  }
  el.style.fontSize = val + 'px';
  const body = document.body;
  body.style.setProperty('font-size', val + 'px');
};
// 最近访问
const getLastProject = () => {
  lastProject({}).then((res) => {
    if (res.success) {
      Data.gridData = res.data;
    } else {
      Data.$message.error(res.message);
    }
  });
};
// 快速链接
const getQuickLink = () => {
  getAll().then((res) => {
    if (res.code === 200) {
      Data.linkData = res.data.content;
    } else {
      window.$message.error(res.message);
    }
  });
};
// 跳转链接
const goLink = (item) => {
  window.open(item.link, '_blank');
};
const backProjectList = () => {
  router.push({ name: 'projectList' });
};
const goProject = async (row) => {
  router.push({ name: 'projectDetail' });
  const newData = await window.$commonApisFun.getProjectMenuList(row.oid, userInfo.username, row.type, 'isLastest');
  if (newData.length > 0) {
    sessionStorage.setItem('editOid', row.oid);
    const params = {
      businessType: 'PROJECT',
      businessId: row.id,
    };
    addHistory(params).then((res) => {
      if (!res.success) return;
    });
    sessionStorage.setItem('currentProject', JSON.stringify(row));
    let btnRole = [];
    let params2 = {
      projectOid: row.oid,
      userName: userInfo.username,
    };
    api.commonApi.getPermissionByProjectldAndUserName(params2).then((res) => {
      if (res.data && res.data.length > 0) {
        btnRole = res?.data.map((e) => {
          return e.path;
        });
        localStorage.setItem('singleProjectRole', JSON.stringify(btnRole));
      } else {
        localStorage.setItem('singleProjectRole', JSON.stringify(['a:a:a']));
      }
      let currentProjectRole = [];
      let params = {
        projectOid: row.oid,
        userName: userInfo.username,
      };
      // 获取到了用户在项目中的角色，才会让它跳转
      api.commonApi.getRoleNamesByUserName(params).then((res) => {
        if (res.success) {
          currentProjectRole = res?.data;
          localStorage.setItem('currentProjectRole', JSON.stringify(currentProjectRole));
        } else {
          localStorage.setItem('currentProjectRole', JSON.stringify(['空']));
          window.$message.error(res.message);
        }
        if (router.currentRoute._value.name === 'projectDetail') {
          router.go(0);
        } else {
          router.push({ name: 'projectDetail' });
        }
      });
    });
  } else {
    window.$message.error('暂无查看该项目的权限');
  }
};
// 全屏
const fullScreen = () => {
  if (!document.fullscreenElement && !Data.isFullScreen) {
    // 进入全屏
    document.documentElement.requestFullscreen().then(() => {
      Data.isFullScreen = true;
    });
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        Data.isFullScreen = false;
      });
    }
  }
};
document.addEventListener('fullscreenchange', () => {
  Data.isFullScreen = !!document.fullscreenElement;
});
</script>

<style scoped lang="scss">
.headerContent {
  text-align: right;
  line-height: 50px;
  .logo {
    height: 60px;
    line-height: 60px;
    text-align: center;
    > img {
      height: 40px;
      margin-top: 10px;
    }
  }
  .rightHeader {
    display: flex;
    justify-content: space-between;
    .projectName {
      color: #fff;
      font-size: 20px;
      font-weight: 500;
      .projectIcon {
        line-height: 32px;
        cursor: pointer;
      }
    }
  }
  :deep(.el-dropdown) {
    color: #fff;
    font-size: 16px;
    margin-top: 15px;
  }
  .arrowDown {
    position: relative;
    top: 2px;
  }
  .Setting {
    position: relative;
    top: 15px;
    margin-right: 8px;
    color: #fff;
    cursor: pointer;
  }
  .rightFunc {
    display: flex;
    justify-content: flex-end;
  }
  .lastestSearch {
    position: relative;
    // top: 15px;
    margin-right: 30px;
    color: #fff;
    cursor: pointer;
    .icon {
      font-size: 18px;
      margin-right: 5px;
      top: 4px;
    }
    .imgScreen {
      width: 20px;
      height: 20px;
      margin-top: 15px;
    }
  }
}
.headerLogo {
  display: flex;
  justify-content: space-between;
}
.customBox {
  .title {
    font-weight: bold;
    font-size: 16px;
    line-height: 30px;
    border-bottom: 1px solid var(--el-border-color);
    color: var(--el-text-color-primary);
  }
  .row {
    padding: 12px 0;
    border-bottom: 1px solid var(--el-border-color);
    .tips-icon {
      transform: translateY(2px);
    }
    .content {
      .color {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 8px;
        &.actived {
          box-shadow: 0 0 10px var(--el-color-primary);
        }
      }
    }
    .font-slider {
      margin-left: 10px;
      width: 90%;
    }
  }
}
</style>
