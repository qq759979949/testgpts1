/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-08 14:52:37
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-16 17:42:26
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\router\mainModule\toDoPage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { intl } from '@/assets/lang/i18n';
/**任务中心路由 */
const toDoPageRoute = [
  // 待办中心
  {
    path: '/toDoPage',
    name: 'toDoPage',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心') }],
      tagTitle: intl('toDoPage').d('任务中心'),
    },
    component: () => import('@/views/toDoPage/index.vue'),
  },
  // // 待办操作详情
  // {
  //   path: '/toDoDetail',
  //   name: 'toDoDetail',
  //   meta: {
  //     menuId: '6',
  //     breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('toDoDetail').d('待办详情') }],
  //     tagTitle: intl('toDoDetail').d('待办详情'),
  //   },
  //   component: () => import('../views/toDoPage/todoDetail.vue'),
  // },
  // 项目定级
  {
    path: '/editProjectGrading',
    name: 'editProjectGrading',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('editProjectGrading').d('编辑项目定级') }],
      tagTitle: intl('editProjectGrading').d('编辑项目定级'),
    },
    component: () => import('@/views/projectGrading/protectGrading.vue'),
  },
  {
    path: '/maintenanceGrading',
    name: 'maintenanceGrading',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('maintenanceGrading').d('维护项目定级') }],
      tagTitle: intl('maintenanceGrading').d('维护项目定级'),
    },
    component: () => import('@/views/projectGrading/protectGrading.vue'),
  },
  {
    path: '/gradingDetail',
    name: 'gradingDetail',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('gradingDetail').d('项目定级详情') }],
      tagTitle: intl('gradingDetail').d('项目定级详情'),
    },
    component: () => import('@/views/projectGrading/detail.vue'),
  },
  // 变更流程
  {
    path: '/changeDetail',
    name: 'changeDetail',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('changeDetail').d('项目变更详情') }],
      tagTitle: intl('changeDetail').d('项目变更详情'),
    },
    component: () => import('@/views/projectChange/seeDetail.vue'),
  },
  /** 文件流程 && 文件流程详情 */
  {
    path: '/fileProcess',
    name: 'fileProcess',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('Document approval process').d('文件签审流程') }],
      tagTitle: intl('Document approval process').d('文件签审流程'),
    },
    component: () => import('@/views/projectFiles/fileApprove.vue'),
  },
  {
    path: '/fileDetailTask',
    name: 'fileDetailTask',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('Document Detail').d('文件详情') }],
      tagTitle: intl('Document Detail').d('文件详情'),
    },
    component: () => import('@/views/projectFiles/fileDetail.vue'),
  },
  {
    path: '/fileProcessDetail',
    name: 'fileProcessDetail',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('Document process details').d('文件签审流程') }],
      tagTitle: intl('Document process details').d('fileProcessDetail'),
    },
    component: () => import('@/views/projectFiles/fileApprove.vue'),
  },
  /**评价验收流程 */
  {
    path: '/checkEvaluate',
    name: 'checkEvaluate',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('Evaluation and acceptance').d('评价验收流程') }],
      tagTitle: '评价验收流程',
      keepAlive: true,
    },
    component: () => import('@/views/projectEvaluate/checkProcess.vue'),
  },
  /**评审流程 */
  {
    path: '/examineProcess',
    name: 'examineProcess',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('examineProcess').d('评审流程') }],
      tagTitle: intl('examineProcess').d('评审流程'),
      // keepAlive: true,
    },
    component: () => import('@/views/projectReview/examineReview.vue'),
  },

  /**变更流程 */
  {
    path: '/changeProcess',
    name: 'changeProcess',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('changeProcess').d('项目变更流程') }],
      tagTitle: intl('changeProcess').d('项目变更流程'),
    },
    component: () => import('@/views/projectChange/processDetail.vue'),
  },
  {
    path: '/rejectEdit',
    name: 'rejectEdit',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('rejectEdit').d('项目变更流程') }],
      tagTitle: intl('rejectEdit').d('项目变更流程'),
    },
    component: () => import('@/views/projectChange/rejectEdit.vue'),
  },
  /**风险流程 */
  {
    path: '/riskProcess',
    name: 'riskProcess',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('riskProcess').d('项目风险流程') }],
      tagTitle: intl('riskProcess').d('项目风险流程'),
    },
    component: () => import('@/views/projectRisk/riskProcess.vue'),
  },
  {
    path: '/rejectRisk',
    name: 'rejectRisk',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('rejectRisk').d('项目风险流程') }],
      tagTitle: intl('rejectRisk').d('项目风险流程'),
    },
    component: () => import('@/views/projectRisk/rejectRisk.vue'),
  },
  {
    path: '/initiationProcess',
    name: 'initiationProcess',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('initiationProcess').d('立项流程') }],
      tagTitle: intl('initiationProcess').d('立项流程'),
    },
    component: () => import('@/views/projectInitiation/detail_initiation.vue'),
    // component: () => (MODE === 'development' ? import('@/views/projectInitiation/detail_initiation.vue') : import('@/views/404.vue')),
  },
  /**问题流程 */
  {
    path: '/questionProcess',
    name: 'questionProcess',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('questionProcess').d('项目问题流程') }],
      tagTitle: intl('questionProcess').d('项目问题流程'),
    },
    component: () => import('@/views/projectQuestion/questionProcess.vue'),
  },
  {
    path: '/rejectQuestion',
    name: 'rejectQuestion',
    meta: {
      menuId: '6',
      breadcrumb: [{ title: intl('toDoPage').d('任务中心'), name: 'toDoPage' }, { title: intl('rejectQuestion').d('项目问题流程') }],
      tagTitle: intl('rejectQuestion').d('项目问题流程'),
    },
    component: () => import('@/views/projectQuestion/rejectQuestion.vue'),
  },
];
export default toDoPageRoute;
