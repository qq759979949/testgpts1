import { intl } from '@/assets/lang/i18n';
/** 产品与竞品配置参数 */

const competitorConfigRoute = [
  {
    path: '/project/competitorConfig',
    name: 'competitorConfig',
    meta: {
      menuId: '3-19',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: '产品和竞品配置参数' }],
      tagTitle: '产品和竞品配置参数',
    },
    component: () => import('@/views/competitorConfig/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/payPacket/index.vue') : import('@/views/404.vue')),
  },
];
export default competitorConfigRoute;
