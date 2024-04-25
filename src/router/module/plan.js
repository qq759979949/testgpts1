import { intl } from '@/assets/lang/i18n';
/**项目计划路由 */
const planRoute = [
  {
    path: '/project/projectPlan',
    name: 'projectPlan',
    meta: {
      menuId: '3-5',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('projectPlan').d('项目计划'), name: 'projectPlan' },
      ],
      tagTitle: intl('projectPlan').d('项目计划'),
    },
    component: () => import('@/views/projectPlan/planTable.vue'),
  }, // 项目交付物
  {
    path: '/project/deliverableDetail',
    name: 'deliverableDetail',
    meta: {
      menuId: '3-5',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('projectPlan').d('项目计划'), name: 'projectPlan' },
        { title: intl('deliverableDetail').d('交付物查看'), name: 'deliverableDetail' },
      ],
      tagTitle: intl('deliverableDetail').d('交付物查看'),
    },
    component: () => import('@/views/projectPlan/deliverableDetail.vue'),
  },
];
export default planRoute;
