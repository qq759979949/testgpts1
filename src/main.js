/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-04 15:56:51
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue';
// 引入pinia
import pinia from '@/stores/index';
import { useNavTagStore } from '@/stores/modules/navTag';
import App from '@/App.vue';
import router from '@/router';
import ElementPlus, { ElMessage, ElMessageBox } from 'element-plus';
import 'element-plus/dist/index.css';
// import { showTip, clickOutside, permissions } from '@/utils/directives.js';
import directive from '@/utils/directives'; //自定义指令
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import Cookies from 'js-cookie';

import i18n, { intl } from '@/assets/lang/i18n';
import './utils/dateFormat.js';

import { formatData, formatData1 } from '@/utils/utils';
import '@/assets/main.css';
import '@/assets/sass/global.scss';
import '@/assets/theme_vars.css';
import '/public/iconFont/iconfont';

/**导入自定义表格 */
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';
import '@/utils/VXETableRender';

import '@/permission';
import commonApisFun from '@/utils/commonApisFun';
import api from '@/api/exportApi';

//注册全局方法到window下
window.$api = api; //全局api
window.$message = ElMessage; //全局$message。调用：window.$message('消息');
window.$ElMessageBox = ElMessageBox; //全局$message。调用：window.$message('消息');
window.$commonApisFun = commonApisFun; // 公用方法--表头相关内容
window.$i18n = i18n;
window.$Cookies = Cookies;
window.$formatData = formatData; // 处理布局方法

const app = createApp(App);
app.use(i18n);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(ElementPlus, { zIndex: 3000, locale: zhCn });
app.use(router);
app.use(pinia);
app.use(VXETable);

/**自定义指令 */

//注册全局自定义指令
for (const [key, fn] of Object.entries(directive)) {
  app.directive(key, fn);
}
app.directive('show-tip', directive.showTip);
app.directive('click-outside', directive.clickOutside);
app.directive('permissions', directive.permissions);

const navTagStore = useNavTagStore();
app.config.globalProperties.$navTagStore = navTagStore;
app.config.globalProperties.$formatData = formatData;
app.config.globalProperties.$formatData1 = formatData1;
app.config.globalProperties.$intl = intl;
app.config.globalProperties.$commonApisFun = commonApisFun;
app.mount('#app');

/**关闭tab */
window.$navTagStore = navTagStore;
