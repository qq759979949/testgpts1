import { intl } from '@/assets/lang/i18n';
/**报表路由 */
// const { MODE } = import.meta.env;
const reportFormRoute = [
  {
    path: '/project/reportForms',
    name: 'reportForms',
    meta: {
      menuId: '3-15',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('report forms').d('报表') }],
      tagTitle: intl('report forms').d('报表'),
    },
    component: () => import('@/views/reportForms/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/reportForms/index.vue') : import('@/views/404.vue')),
  },
];
export default reportFormRoute;
