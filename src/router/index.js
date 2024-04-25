/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-15 18:24:24
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { intl } from '@/assets/lang/i18n';
import { createRouter, createWebHashHistory } from 'vue-router';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

import Layout from '../layout/index.vue';

import mainRouter from './mainRouter';
import projectRouter from './projectRouter';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/',
    name: 'layout',
    redirect: '/homePage',
    component: Layout,
    meta: {
      breadcrumb: [{ title: intl('home').d('门户'), name: 'homePage' }],
    },
    children: [...mainRouter, ...projectRouter],
  },
];

const addPrefix = (path) => {
  const bool = path.startsWith('/');
  const prefix = bool ? '' : '/';
  const projectName = '/app-pidim';
  // console.log(`${projectName}${prefix}${path}`);
  return `${projectName}${prefix}${path}`;
};

if (qiankunWindow.__POWERED_BY_QIANKUN__) {
  callback(routes);
  // routes.forEach((i) => {
  //   i.path = addPrefix(i.path);
  //   if (i.redirect) {
  //     i.redirect = addPrefix(i.redirect);
  //   }
  // });
}
function callback(arr) {
  arr.forEach((i) => {
    i.path = addPrefix(i.path);
    if (i.redirect) {
      i.redirect = addPrefix(i.redirect);
    }
    i.children && callback(i.children);
  });
}

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
