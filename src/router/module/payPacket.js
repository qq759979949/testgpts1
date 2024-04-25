import { intl } from '@/assets/lang/i18n';
/**薪酬包路由 */
// const { MODE } = import.meta.env;
const payPacketRoute = [
  {
    path: '/project/payPacket',
    name: 'payPacket',
    meta: {
      menuId: '3-13',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: '薪酬包' }],
      tagTitle: '薪酬包',
      // keepAlive: true,
    },
    component: () => import('@/views/payPacket/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/payPacket/index.vue') : import('@/views/404.vue')),
  },
];
export default payPacketRoute;
