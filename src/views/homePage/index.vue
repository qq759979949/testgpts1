<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-11-07 15:19:27
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-08 11:35:44
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\homePage\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="homePage">
    <el-scrollbar>
      <el-row :gutter="12" style="width: 100%">
        <el-col :span="18">
          <div class="funcArea">
            <FuncArea></FuncArea>
          </div>
          <div class="taskCenter">
            <TaskCenter></TaskCenter>
          </div>
          <div class="warnTaskCenter">
            <WarnTaskCenter></WarnTaskCenter>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="sysInlet">
            <sysInlet></sysInlet>
          </div>
          <div class="newsNotice">
            <newsNotice></newsNotice>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>
<script>
import { defineComponent, onMounted } from 'vue';
import FuncArea from './components/funcArea.vue';
import TaskCenter from './components/taskCenter.vue';
import WarnTaskCenter from './components/warnTaskCenter.vue';
import sysInlet from './components/sysInlet.vue';
import newsNotice from './components/newsNotice.vue';
export default defineComponent({
  components: { FuncArea, TaskCenter, WarnTaskCenter, sysInlet, newsNotice },
  setup() {
    const api = window.$api;
    const username = JSON.parse(window.$Cookies.get('userInfo')).username;
    onMounted(() => {
      _findMenuByUser(username);
    });
    // 获取菜单权限
    const _findMenuByUser = async (params) => {
      // 获取按钮权限
      await api.loginApi.findButtonByUser({ userName: params }).then((res) => {
        if (res.data.length) {
          let arr = [];
          arr = res.data.map((item) => {
            return item.path;
          });
          localStorage.setItem('buttonList', JSON.stringify(arr));
        } else {
          localStorage.setItem('buttonList', JSON.stringify(['a:a:a']));
        }
      });
    };
  },
});
</script>

<style lang="scss" scoped>
.homePage {
  height: 100%;
  .funcArea {
    height: 120px;
    background: #fff;
    margin-bottom: 12px;
    overflow-y: auto;
  }
  .taskCenter {
    // height: 40vh;
    height: 38vh;
    background: #fff;
    margin-bottom: 12px;
  }
  .warnTaskCenter {
    height: calc(62vh - 236px);
    background: #fff;
  }
  .sysInlet {
    background: #fff;
    margin-bottom: 12px;
    overflow-y: auto;
  }
  .newsNotice {
    background: #fff;
  }
}
</style>
