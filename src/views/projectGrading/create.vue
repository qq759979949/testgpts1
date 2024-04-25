<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-05 08:23:31
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-07 19:31:02
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectGrading\create.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="create_grading" v-loading="Data.isLoading">
    <common-comp ref="commonProcess" targrtGrading=".create_grading" @submitSuccess="submitSuccess"></common-comp>
    <el-affix position="bottom" :offset="0">
      <div class="bottomConfirm">
        <el-button class="bottomBtn bottomBtn1" @click="cancel">取消</el-button>
        <el-button type="primary" class="bottomBtn" @click="submit">提交</el-button>
      </div>
    </el-affix>
  </div>
</template>

<script setup>
import commonComp from './module/commonComp.vue';
const { proxy: that } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const Data = reactive({
  isLoading: false,
});
const submit = () => {
  Data.isLoading = true;
  that.$refs.commonProcess.onSubmit();
};
const cancel = () => {
  window.$navTagStore.removeTag(route, router);
  window.$navTagStore.removeCacheTag(route.name);
  router.push({ name: 'projectDetail' });
};
const submitSuccess = () => {
  Data.isLoading = false;
};
</script>

<style lang="less" scoped>
.create_grading {
  // height: 100%;
  // padding: 16px;
  // background: #fff;
  .bottomConfirm {
    width: 100%;
    height: 56px;
    background: #fff;
    box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.2);
    border-radius: 1px;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    bottom: 0px;
    .bottomBtn {
      margin-top: 12px;
      margin-right: 30px;
    }
    .bottomBtn1 {
      margin-right: 0px;
    }
  }
}
.main .scrollView {
  min-height: calc(100vh - 60px - 36px - 4px) !important;
  .routerView {
    min-height: calc(100vh - 60px - 36px - 4px) !important;
  }
}
</style>
