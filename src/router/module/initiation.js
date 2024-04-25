import { intl } from '@/assets/lang/i18n';
/**评审路由 */
// const { MODE } = import.meta.env;
const initiationRoute = [
  {
    path: '/project/initiation',
    name: 'projectInitiation',
    meta: {
      menuId: '3-18',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('projectInitiation').d('项目立项') }],
      tagTitle: intl('projectInitiation').d('项目立项'),
      keepAlive: true,
    },
    component: () => import('@/views/projectInitiation/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/projectInitiation/index.vue') : import('@/views/404.vue')),
  },
];
export default initiationRoute;
