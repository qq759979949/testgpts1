import { intl } from '@/assets/lang/i18n';
/**相关进程路由 */
// const { MODE } = import.meta.env;
const relateProcessRoute = [
  {
    path: '/project/relatedProcesses',
    name: 'relatedProcesses',
    meta: {
      menuId: '3-14',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('Related processes').d('相关进程') }],
      tagTitle: intl('Related processes').d('相关进程'),
    },
    component: () => import('@/views/relatedProcesses/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/relatedProcesses/index.vue') : import('@/views/404.vue')),
  },
];
export default relateProcessRoute;
