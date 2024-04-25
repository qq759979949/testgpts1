/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-05 08:23:31
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-02-29 14:54:56
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\router\module\risk.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { intl } from '@/assets/lang/i18n';
/**风险路由 */
// const { MODE } = import.meta.env;
const riskRoute = [
  {
    path: '/project/projectRisk',
    name: 'projectRisk',
    meta: {
      menuId: '3-11',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('projectRisk').d('项目风险') }],
      tagTitle: intl('projectRisk').d('项目风险'),
    },
    component: () => import('@/views/projectRisk/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/projectRisk/index.vue') : import('@/views/404.vue')),
  },
  {
    path: '/project/projectRisk/createRisk',
    name: 'createRisk',
    meta: {
      menuId: '3-11',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('projectRisk').d('项目风险') }],
      tagTitle: intl('createRisk').d('创建风险'),
      keepAlive: true,
    },
    component: () => import('@/views/projectRisk/createRisk.vue'),
  },
  {
    path: '/project/projectRisk/editRisk',
    name: 'editRisk',
    meta: {
      menuId: '3-11',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('projectRisk').d('项目风险') }],
      tagTitle: intl('editRisk').d('编辑风险'),
      keepAlive: true,
    },
    component: () => import('@/views/projectRisk/editRisk.vue'),
  },
  {
    path: '/project/projectRisk/riskDetail',
    name: 'riskDetail',
    meta: {
      menuId: '3-11',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('projectRisk').d('项目风险'), name: 'projectRisk' },
        { title: intl('riskDetail').d('查看风险') },
      ],
      tagTitle: intl('riskDetail').d('查看风险'),
    },
    keepAlive: true,
    component: () => import('@/views/projectRisk/riskDetail.vue'),
  },
  // {
  //   path: '/project/projectRisk/riskProcess',
  //   name: 'riskProcess',
  //   meta: {
  //     menuId: '3-11',
  //     breadcrumb: [
  //       { title: intl('projectList').d('项目列表'), name: 'projectList' },
  //       { title: intl('projectRisk').d('项目风险'), name: 'projectRisk' },
  //       { title: intl('riskProcess').d('风险流程') },
  //     ],
  //     tagTitle: intl('riskProcess').d('风险流程'),
  //   },
  //   component: () => import('@/views/projectRisk/riskProcess.vue'),
  // },
];
export default riskRoute;
