<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-11 09:53:42
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-09 11:16:51
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router';
import { useCommonApi } from '@/stores';
const router = useRouter();
const useCommon = useCommonApi();
const Data = reactive({
  userInfo: {},
});
onMounted(() => {
  // getTaskAmount();
});
watch(
  () => router.currentRoute.value,
  () => {
    if (!router.currentRoute.value.path.includes('login') && !router.currentRoute.value.path.includes('project/')) {
      Data.userInfo = JSON.parse(window.$Cookies.get('userInfo'));
      if (Data.userInfo) {
        getTaskAmount();
      }
    }
  },
);
// 获取任务总数量
const getTaskAmount = () => {
  window.$api.toDoApi.getAllTaskAmount({ pdUser: Data.userInfo.username }).then((res) => {
    if (res.success) {
      let obj = res.data;
      obj.taskCenterData = res.data.workflowTaskAmount + res.data.assignTaskAmount + res.data.approvalTaskAmount;
      obj.warnTaskCenterData = res.data.redTaskAmount + res.data.yellowTaskAmount;
      useCommon.taskAmount = obj;
    } else {
      window.$message.error(res.message);
    }
  });
};
</script>

<style lang="scss">
.el-message {
  position: absolute;
  top: 40% !important;
  font-size: 18px !important;
  .el-message__content {
    font-size: 18px !important;
  }
}
</style>
