/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-05 08:23:31
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-21 17:07:44
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\router\module\change.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { intl } from '@/assets/lang/i18n';
/**变更路由 */
// const { MODE } = import.meta.env;
const changeRoute = [
  {
    path: '/project/projectChange',
    name: 'projectChange',
    meta: {
      menuId: '3-9',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('projectChange').d('项目变更') }],
      tagTitle: intl('projectChange').d('项目变更'),
    },
    component: () => import('@/views/projectChange/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/projectChange/index.vue') : import('@/views/404.vue')),
  },
  {
    path: '/project/createProjectChange',
    name: 'createProjectChange',
    meta: {
      menuId: '3-9',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('projectChange').d('项目变更'), name: 'projectChange' },
        { title: intl('createProjectChange').d('创建项目变更') },
      ],
      tagTitle: intl('createProjectChange').d('创建项目变更'),
      keepAlive: true,
    },
    component: () => import('@/views/projectChange/create.vue'),
  },
  {
    path: '/project/projectChangeDetail',
    name: 'projectChangeDetail',
    meta: {
      menuId: '3-9',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('projectChange').d('项目变更'), name: 'projectChange' },
        { title: intl('projectChangeDetail').d('项目变更详情') },
      ],
      tagTitle: intl('projectChangeDetail').d('项目变更详情'),
      // keepAlive: true,
    },
    component: () => import('@/views/projectChange/seeDetail.vue'),
  },
  {
    path: '/project/editProjectChange',
    name: 'editProjectChange',
    meta: {
      menuId: '3-9',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('projectChange').d('项目变更'), name: 'projectChange' },
        { title: intl('editProjectChange').d('编辑项目变更') },
      ],
      tagTitle: intl('editProjectChange').d('编辑项目变更'),
      keepAlive: true,
    },
    component: () => import('@/views/projectChange/rejectEdit.vue'),
  },
];
export default changeRoute;
