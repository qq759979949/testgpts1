<template>
  <div class="navBar pt10">
    <el-scrollbar>
      <div class="tagBox">
        <div
          v-for="(tag, i) in tagListData"
          :key="tag.name"
          @click="goPage(tag)"
          @contextmenu.prevent="($event) => rightClick($event, tag, i)"
          class="tag"
          :class="{ actived: tag.name === navTagStore.activedTag }"
        >
          <span class="globalCircle" :class="{ globalCircle1: tag.name === navTagStore.activedTag }" v-if="isIncludes(tag.name)"></span>
          {{ tag.title }}
          <el-icon v-if="i > 0" @click.stop="removeTag(tag)" class="closeIcon" :size="14">
            <Close />
          </el-icon>
        </div>
      </div>
    </el-scrollbar>
    <div class="rightBox" :style="{ left: Data.left }" v-if="Data.isShowRight">
      <div class="menu" v-show="i !== 1 || Data.clickIndex > 0" v-for="(item, i) in Data.menuData" :key="item.id" @click="actionHandle(item)">
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNavTagStore, homeTag } from '@/stores/modules/navTag.js';
const navTagStore = useNavTagStore();
const router = useRouter();
const route = useRoute();

const Data = reactive({
  // 右键菜单
  menuData: [
    { id: 1, value: '刷新页面' },
    { id: 2, value: '关闭当前' },
    { id: 3, value: '关闭其他' },
    { id: 4, value: '关闭所有' },
  ],
  isShowRight: false,
  left: '0px',
  clickTag: null,
  clickIndex: -1,
});

/**页面切换 */
const goPage = (tag) => {
  router.push({ name: tag.name, query: tag.query ? tag.query : {} });
};
const tagListData = computed(() => {
  // let arr = navTagStore.tagList.filter((v) => v.name !== 'homePage');
  let arr = navTagStore.tagList;
  return arr;
});

/**移除页签 */
const removeTag = (data) => {
  navTagStore.removeTag(data, router);
  navTagStore.removeCacheTag(data.name);
};

// 右键点击
const rightClick = (e, tag, i) => {
  Data.isShowRight = true;
  Data.clickTag = tag;
  Data.clickIndex = i;
  Data.left = e.clientX - 210 + 'px';
  document.body.addEventListener('click', cancelClick);
};
//取消右键菜单
const cancelClick = () => {
  Data.isShowRight = false;
  document.body.removeEventListener('click', cancelClick);
};

/**右键方法 */
const actionHandle = (data) => {
  if (data.id === 1) {
    if (route.name !== Data.clickTag.name) {
      router.push({ name: Data.clickTag.name, query: Data.clickTag.query ? Data.clickTag.query : {} });
    } else {
      emit('refreshRoute');
    }
  } else if (data.id === 2) {
    navTagStore.removeTag(Data.clickTag, router);
  } else if (data.id === 3) {
    if (Data.clickTag.name === 'projectList') {
      let arr = navTagStore.tagList.filter((v) => v.name !== 'projectList');
      arr.forEach((item) => {
        navTagStore.removeTag(item, router);
      });
      navTagStore.tagList = [...homeTag];
    } else {
      let arr = navTagStore.tagList.filter((v) => v.name !== 'projectList' && v.name !== Data.clickTag.name);
      arr.forEach((item) => {
        navTagStore.removeTag(item, router);
      });
      navTagStore.tagList = [...homeTag, Data.clickTag];
    }
    if (route.name !== Data.clickTag.name) {
      router.push({ name: Data.clickTag.name, query: Data.clickTag.query ? Data.clickTag.query : {} });
    }
  } else if (data.id === 4) {
    let arr = navTagStore.tagList.filter((v) => v.name !== 'projectList');
    arr.forEach((item) => {
      navTagStore.removeTag(item, router);
    });
    navTagStore.tagList = [{ name: 'projectList', title: '项目列表' }];
    router.push({ name: navTagStore.tagList[0].name, query: navTagStore.tagList[0].query ? navTagStore.tagList[0].query : {} });
  }
};
const isIncludes = (type) => {
  const newArr = ['projectList', 'warningTask', 'toDoPage', 'reportsTools', 'createProject', 'productConfig', 'indexLibrary'];
  if (newArr.includes(type)) {
    return true;
  }
};

const emit = defineEmits(['refreshRoute']);
</script>

<style scoped lang="scss">
.navBar {
  position: relative;
  width: 100%;
  height: 30px;
  padding: 0 16px;
  background: var(--el-color-primary);
  .tagBox {
    white-space: nowrap;
    // padding-top: 3px;
    .tag {
      display: inline-block;
      margin: 0 4px;
      padding: 4px 8px;
      font-size: 14px;
      background-color: var(--el-color-primary-light-5);
      color: #fff;
      // border: 1px solid var(--el-border-color);
      border-radius: 6px 6px 0 0;
      cursor: pointer;
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        border-color: var(--el-color-primary);
      }
      &.actived {
        color: var(--el-color-primary);
        background-color: #fff;
        border-color: var(--el-color-primary);
        border-radius: 6px 6px 0 0;
      }
      .closeIcon {
        transform: translateY(2px);
        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
    .globalCircle {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #fff;
    }
    .globalCircle1 {
      background-color: #386BD7;
    }
  }
  .rightBox {
    position: absolute;
    top: 30px;
    left: 0px;
    z-index: 200;
    background: #fff;
    font-size: 12px;
    border-radius: 4px;
    border: 1px solid var(--el-border-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    .menu {
      padding: 0 12px;
      line-height: 30px;
      cursor: pointer;
      &:hover {
        color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
      }
    }
  }
}
</style>
