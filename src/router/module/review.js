/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-05 08:23:31
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-07 16:46:09
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\router\module\review.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { intl } from '@/assets/lang/i18n';
/**评审路由 */
// const { MODE } = import.meta.env;
const reviewRoute = [
  {
    path: '/project/projectReview',
    name: 'projectReview',
    meta: {
      menuId: '3-8',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('projectReview').d('项目评审') }],
      tagTitle: intl('projectReview').d('项目评审'),
    },
    component: () => import('@/views/projectReview/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/projectReview/index.vue') : import('@/views/404.vue')),
  },
  {
    path: '/project/projectReview/createReview',
    name: 'createReview',
    meta: {
      menuId: '3-8',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('projectReview').d('项目评审') },
        { title: intl('createReview').d('创建评审') },
      ],
      tagTitle: intl('createReview').d('创建评审'),
      keepAlive: true,
    },
    component: () => import('@/views/projectReview/createReview.vue'),
  },
  {
    path: '/project/projectReview/editReview',
    name: 'editReview',
    meta: {
      menuId: '3-8',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('projectReview').d('项目评审') }, { title: intl('editReview').d('编辑评审') }],
      tagTitle: intl('editReview').d('编辑评审'),
      keepAlive: true,
    },
    component: () => import('@/views/projectReview/editReview.vue'),
  },
  {
    path: '/project/projectReview/examineReview',
    name: 'examineReview',
    meta: {
      menuId: '3-8',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('projectReview').d('项目评审') }, { title: intl('review').d('评审') }],
      tagTitle: intl('examineReview').d('评审'),
    },
    component: () => import('@/views/projectReview/examineReview.vue'),
  },
];
export default reviewRoute;
