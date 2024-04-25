/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-04 17:26:39
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\router\mainRouter.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 主路由，项目列表平级或以上的路由位置
 */
import { intl } from '@/assets/lang/i18n';
import toDoPageRoute from './mainModule/toDoPage';
export default [
  {
    path: '/homePage',
    name: 'homePage',
    meta: {
      menuId: '0',
      breadcrumb: [{ title: intl('homePage').d('门户') }],
      tagTitle: intl('homePage').d('门户'),
    },
    component: () => import('../views/homePage/index.vue'),
  },
  // 项目列表
  {
    path: '/projectList',
    name: 'projectList',
    meta: {
      menuId: '1',
      breadcrumb: [{ title: intl('projectList').d('项目列表') }],
      tagTitle: intl('projectList').d('项目列表'),
    },
    component: () => import('../views/projectList/index.vue'),
  },
  // 创建项目
  {
    path: '/createProject',
    name: 'createProject',
    meta: {
      menuId: '1',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('createProject').d('创建项目') }],
      tagTitle: intl('createProject').d('创建项目'),
      keepAlive: true,
    },
    component: () => import('../views/projectList/create.vue'),
  },
  // 指标库
  {
    path: '/indexLibrary',
    name: 'indexLibrary',
    meta: {
      menuId: '1',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('indexLibrary').d('目标/指标库'), name: 'indexLibrary' },
      ],
      tagTitle: intl('indexLibrary').d('目标/指标库'),
      keepAlive: true,
    },
    component: () => import('../views/projectList/indexLibrary.vue'),
  },
  {
    // 编辑项目
    path: 'project/updateProject',
    name: 'updateProject',
    meta: {
      menuId: '2',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('updateProject').d('编辑项目') }],
      tagTitle: intl('updateProject').d('编辑项目'),
      // keepAlive: true,
    },
    component: () => import('../views/projectList/update.vue'),
  },
  ...toDoPageRoute,
  // 风险库
  {
    path: '/riskLibrary',
    name: 'riskLibrary',
    meta: {
      menuId: '4',
      breadcrumb: [{ title: intl('riskLibrary').d('风险库'), name: 'riskLibrary' }],
      tagTitle: intl('riskLibrary').d('风险库'),
    },
    component: () => import('../views/riskLibrary/index.vue'),
  },

  // // 问题库
  // {
  //   path: '/problemBase',
  //   name: 'problemBase',
  //   meta: {
  //     menuId: '5',
  //     breadcrumb: [{ title: intl('problemBase').d('问题库'), name: 'problemBase' }],
  //     tagTitle: intl('problemBase').d('问题库'),
  //   },
  //   component: () => import('../views/problemBase/index.vue'),
  // },

  // 待办中心
  {
    path: '/warningTask',
    name: 'warningTask',
    meta: {
      menuId: '7',
      breadcrumb: [{ title: intl('warningTask').d('任务预警中心') }],
      tagTitle: intl('warningTask').d('任务预警中心'),
    },
    component: () => import('../views/warningTask/index.vue'),
  },
  // 待办操作详情
  // {
  //   path: '/toDoDetail',
  //   name: 'toDoDetail',
  //   meta: {
  //     menuId: '7',
  //     breadcrumb: [{ title: intl('warningTask').d('任务预警中心'), name: 'warningTask' }, { title: intl('toDoDetail').d('待办详情') }],
  //     tagTitle: intl('toDoDetail').d('待办详情'),
  //   },
  //   component: () => import('../views/toDoPage/todoDetail.vue'),
  // },
  // 产品配置库
  {
    path: '/productConfig',
    name: 'productConfig',
    meta: {
      menuId: '1',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: '产品配置库' }],
      tagTitle: '产品配置库',
    },
    component: () => import('@/views/productConfig/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/productConfig/index.vue') : import('@/views/404.vue')),
  },
  {
    path: '/reportsTools',
    name: 'reportsTools',
    meta: {
      menuId: '4',
      breadcrumb: [{ title: intl('reportsTools').d('报表工具'), name: 'reportsTools' }],
      tagTitle: intl('reportsTools').d('报表工具'),
    },
    component: () => import('@/views/reportsTools/index.vue'),
    keepAlive: true,
    // component: () => (MODE === 'development' ? import('@/views/reportsTools/index.vue') : import('@/views/404.vue')),
  },
  // 创建项目
  // {
  //   path: '/createProject',
  //   name: 'createProject',
  //   meta: {
  //     menuId: '8',
  //     breadcrumb: [{ title: intl('createProject').d('创建项目') }],
  //     tagTitle: intl('createProject').d('创建项目'),
  //     keepAlive: true,
  //   },
  //   component: () => import('../views/projectList/create.vue'),
  // },
  // 指标库
  {
    path: '/indexLibrary',
    name: 'indexLibrary',
    meta: {
      menuId: '9',
      breadcrumb: [{ title: intl('indexLibrary').d('目标/指标库'), name: 'indexLibrary' }],
      tagTitle: intl('indexLibrary').d('目标/指标库'),
      keepAlive: true,
    },
    component: () => import('../views/projectList/indexLibrary.vue'),
  },
  {
    path: '/productConfig',
    name: 'productConfig',
    meta: {
      menuId: '5',
      breadcrumb: [{ title: intl('productConfig').d('产品配置库'), name: 'productConfig' }],
      tagTitle: '产品配置库',
    },
    component: () => import('@/views/productConfig/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/productConfig/index.vue') : import('@/views/404.vue')),
  },
];
