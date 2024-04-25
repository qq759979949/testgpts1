import { intl } from '@/assets/lang/i18n';
/**目标指标 */
// const { MODE } = import.meta.env;
const targetRoute = [
  {
    path: '/project/target',
    name: 'target',
    meta: {
      menuId: '3-3',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('Goals/Indicators').d('目标/指标') }],
      tagTitle: intl('Goals/Indicators').d('目标/指标'),
    },
    component: () => import('@/views/target/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/target/index.vue') : import('@/views/404.vue')),
  },
];
export default targetRoute;
