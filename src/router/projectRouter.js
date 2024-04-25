/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-27 15:15:08
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\router\projectRouter.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { intl } from '@/assets/lang/i18n';
import teamRoute from './module/team';
import targetRoute from './module/target';
import configRoute from './module/config';
import planRoute from './module/plan';
import fileRoute from './module/file';
import baselineRoute from './module/baseline';
import reviewRoute from './module/review';
import changeRoute from './module/change';
import questionRoute from './module/question';
import riskRoute from './module/risk';
import evaluationRoute from './module/evaluation';
import payPacketRoute from './module/payPacket';
import relateProcessRoute from './module/relateProcess';
import reportFormRoute from './module/reportForm';
import checkRoute from './module/check';
import initiationRoute from './module/initiation';
import competitorConfigRoute from './module/competitorConfig';

// 单项目路由 path以  /project/  开头
export default [
  {
    path: '/project/detail',
    name: 'projectDetail',
    meta: {
      menuId: '3-1',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: intl('projectHome').d('单项目首页') }],
      tagTitle: intl('projectHome').d('单项目首页'),
    },
    component: () => import('../views/projectList/projectDetail.vue'),
  },
  {
    path: '/project/createProjectGrading',
    name: 'createProjectGrading',
    meta: {
      menuId: '3-1',
      breadcrumb: [
        { title: intl('projectList').d('项目列表'), name: 'projectList' },
        { title: intl('projectDetail').d('单项目首页'), name: 'projectDetail' },
        { title: intl('createProjectGrading').d('创建项目定级') },
      ],
      tagTitle: intl('createProjectGrading').d('创建项目定级'),
      // keepAlive: true,
    },
    component: () => import('@/views/projectGrading/create.vue'),
  },
  // 项目团队
  ...teamRoute,
  // 目标指标
  ...targetRoute,
  // 产品配置
  ...configRoute,
  // 项目计划
  ...planRoute,
  // 项目文件
  ...fileRoute,
  // 基线
  ...baselineRoute,
  // 项目评审
  ...reviewRoute,
  // 项目变更
  ...changeRoute,
  // 项目问题
  ...questionRoute,
  // 项目风险
  ...riskRoute,
  // 评价验收
  ...evaluationRoute,
  // 薪酬包
  ...payPacketRoute,
  // 相关进程
  ...relateProcessRoute,
  // 报表
  ...reportFormRoute,
  // 考核激励
  ...checkRoute,
  // 项目立项
  ...initiationRoute,
  // 产品和竞品配置参数
  ...competitorConfigRoute,
];
