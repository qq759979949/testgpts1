import { intl } from '@/assets/lang/i18n';
/**文件路由 */
const fileRoute = [
  {
    path: '/project/files',
    name: 'projectFiles',
    meta: {
      menuId: '3-6',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('projectFiles').d('项目文件') }],
      tagTitle: intl('projectFiles').d('项目文件'),
    },
    component: () => import('@/views/projectFiles/index.vue'),
  },
  {
    path: '/project/fileApprove',
    name: 'fileApprove',
    meta: {
      menuId: '3-6',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('projectFiles').d('项目文件'), name: 'projectFiles' },
        { title: intl('fileApprove').d('文件签审') },
      ],
      tagTitle: intl('fileApprove').d('文件签审'),
    },
    component: () => import('@/views/projectFiles/fileApprove.vue'),
  },
  {
    path: '/project/fileDetail',
    name: 'fileDetail',
    meta: {
      menuId: '3-6',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('projectFiles').d('项目文件'), name: 'projectFiles' },
        { title: intl('fileDetail').d('文件详情') },
      ],
      tagTitle: intl('fileDetail').d('文件详情'),
    },
    component: () => import('@/views/projectFiles/fileDetail.vue'),
  },
];
export default fileRoute;
