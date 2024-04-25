/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-05 08:23:31
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-02 19:58:15
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\router\module\risk.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { intl } from '@/assets/lang/i18n';
/**风险路由 */
// const { MODE } = import.meta.env;
const riskRoute = [
  {
    path: '/project/projectQuestion',
    name: 'projectQuestion',
    meta: {
      menuId: '3-10',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('projectQuestion').d('项目问题') }],
      tagTitle: intl('projectQuestion').d('项目问题'),
    },
    component: () => import('@/views/projectQuestion/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/projectRisk/index.vue') : import('@/views/404.vue')),
  },
  {
    path: '/project/projectQuestion/createQuestion',
    name: 'createQuestion',
    meta: {
      menuId: '3-10',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('projectQuestion').d('项目问题') }],
      tagTitle: intl('createQuestion').d('创建问题'),
      keepAlive: true,
    },
    component: () => import('@/views/projectQuestion/createQuestion.vue'),
  },
  {
    path: '/project/projectQuestion/editQuestion',
    name: 'editQuestion',
    meta: {
      menuId: '3-10',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('projectQuestion').d('项目问题') }],
      tagTitle: intl('editQuestion').d('编辑问题'),
      keepAlive: true,
    },
    component: () => import('@/views/projectQuestion/editQuestion.vue'),
  },
  {
    path: '/project/projectQuestion/questionDetail',
    name: 'questionDetail',
    meta: {
      menuId: '3-10',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('projectQuestion').d('项目问题'), name: 'projectQuestion' },
        { title: intl('questionDetail').d('查看问题') },
      ],
      tagTitle: intl('questionDetail').d('查看问题'),
    },
    keepAlive: true,
    component: () => import('@/views/projectQuestion/questionDetail.vue'),
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
