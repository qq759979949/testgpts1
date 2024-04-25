import { intl } from '@/assets/lang/i18n';
/**团队路由 */
const teamRoute = [
  {
    path: '/project/team',
    name: 'projectTeam',
    meta: {
      menuId: '3-2',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('projectTeam').d('项目团队') }],
      tagTitle: intl('projectTeam').d('项目团队'),
    },
    component: () => import('@/views/projectTeam/index.vue'),
  },
];
export default teamRoute;
