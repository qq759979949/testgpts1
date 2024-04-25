import { intl } from '@/assets/lang/i18n';
/**评价验收路由 */
// const { MODE } = import.meta.env;
const evaluationRoute = [
  {
    path: '/project/projectEvaluate',
    name: 'projectEvaluate',
    meta: {
      menuId: '3-12',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: '评价验收' }],
      tagTitle: '评价验收',
    },
    component: () => import('@/views/projectEvaluate/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/projectEvaluate/index.vue') : import('@/views/404.vue')),
  },
  {
    path: '/project/projectEvaluate/create',
    name: 'createEvaluate',
    meta: {
      menuId: '3-12',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('Evaluation and acceptance').d('评价验收'), name: 'Evaluation and acceptance' },
        { title: '创建项目评价' },
      ],
      tagTitle: '创建项目评价',
      keepAlive: true,
    },
    component: () => import('@/views/projectEvaluate/createEvaluate.vue'),
  },
  {
    path: '/project/projectEvaluate/editEvaluate',
    name: 'editEvaluate',
    meta: {
      menuId: '3-12',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('Evaluation and acceptance').d('评价验收'), name: 'Evaluation and acceptance' },
        { title: '编辑评价' },
      ],
      tagTitle: '编辑评价',
      keepAlive: true,
    },
    // component: () => import('@/views/projectEvaluate/modules/editEvaluate.vue'),
    component: () => import('@/views/projectEvaluate/createEvaluate.vue'),
  },
  {
    path: '/project/projectEvaluate/detailEvaluate',
    name: 'detailEvaluate',
    meta: {
      menuId: '3-12',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('Evaluation and acceptance').d('评价验收'), name: 'Evaluation and acceptance' },
        { title: '评价详情' },
      ],
      tagTitle: '评价详情',
    },
    component: () => import('@/views/projectEvaluate/detailEvaluate.vue'),
  },
];
export default evaluationRoute;
