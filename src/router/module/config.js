import { intl } from '@/assets/lang/i18n';
/**产品配置路由 */
// const { MODE } = import.meta.env;
const configRoute = [
  {
    path: '/project/addConfig',
    name: 'addConfig',
    meta: {
      menuId: '3-4',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: '产品配置' }],
      tagTitle: '产品配置',
      keepAlive: true,
    },
    component: () => import('@/views/productConfig/addIndex.vue'),
    // component: () => (MODE === 'development' ? import('@/views/productConfig/addIndex.vue') : import('@/views/404.vue')),
  },
];
export default configRoute;
