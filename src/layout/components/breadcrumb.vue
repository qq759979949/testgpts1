<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-15 18:31:43
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\layout\components\breadcrumb.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="breadcrumb">
    <el-breadcrumb style="line-height: 30px" separator="/">
      <el-breadcrumb-item v-for="item in breadcrumb" :key="item.title" :to="item.name ? { name: item.name } : null">
        <div v-if="!item.isProjectName">{{ item.title }}</div>
        <div v-else class="projectStyle" @click="goDetail">{{ item.title }}</div>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { useBreadcrumbStore } from '@/stores/modules/breadcrumb';
import router from '@/router';
const breadcrumbStore = useBreadcrumbStore();
const route = useRoute();
const breadcrumb = computed(() => {
  // const projectName = JSON.parse(sessionStorage.getItem('currentProject'))?.projectName;
  // let pathArr = route.path.split('/');
  // if (pathArr[1] === 'project') {
  //   let projectIndo = [{ title: projectName }];
  //   let arr = breadcrumbStore.breadcrumb.splice(1, 0, projectIndo);
  //   return arr;
  // } else {
  return breadcrumbStore.breadcrumb;
  // }
});
const goDetail = () => {
  if (route.name !== 'projectDetail') {
    router.push({ name: 'projectDetail' });
  }
};
</script>

<script>
// import { mapState } from 'pinia';
// import { useBreadcrumbStore } from '@/stores/modules/breadcrumb.js';
// export default {
//   name: 'breadcrumb',
//   computed: {
//     ...mapState(useBreadcrumbStore, ['breadcrumb']),
//   },
// };
</script>

<style scoped lang="scss">
.breadcrumb {
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  padding: 0 20px;
  .projectStyle {
    color: #386bd7;
    cursor: pointer;
  }
}
</style>
