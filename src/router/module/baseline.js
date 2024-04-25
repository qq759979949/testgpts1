import { intl } from '@/assets/lang/i18n';
/**基线路由 */
// const { MODE } = import.meta.env;
const baselineRoute = [
  {
    path: '/project/baseline',
    name: 'baseline',
    meta: {
      menuId: '3-7',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('baseline').d('基线') }],
      tagTitle: intl('baseline').d('基线'),
    },
    component: () => import('@/views/baseline/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/baseline/index.vue') : import('@/views/404.vue')),
  },
  {
    path: '/project/baselineDetail',
    name: 'baselineDetail',
    meta: {
      menuId: '3-7',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('baseline').d('基线'), name: 'baseline' },
        { title: intl('Baseline details').d('基线详情') },
      ],
      tagTitle: intl('Baseline details').d('基线详情'),
    },
    component: () => import('@/views/baseline/baselineDetail.vue'),
  },
];
export default baselineRoute;
