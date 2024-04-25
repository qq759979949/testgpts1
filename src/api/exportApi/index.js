/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-12-19 15:57:09
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-01 17:25:53
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\api\exportApi\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** api统一出口 */
import commonApi from '../expandApi/commonApi';
import loginApi from '../expandApi/loginApi';
import fileApi from '../files';
import toDoApi from '../todoApi';
import projectGradingApi from '../expandApi/projectGrading';
import projectApi from '../project';
import processApi from '../processApi';
import payPacketApi from '../expandApi/payPacket';
import planApi from '../plan';
import assessmentIncentivesApi from '../expandApi/assessmentIncentives';
import instrumentReportApi from '../expandApi/instrumentReport';
import baseLineApi from '../expandApi/baselineApi';
import reviewApi from '../review';
import targetApi from '../target';
import projectChangeApi from '../expandApi/projectChange';
import projectInitiationApi from '../expandApi/projectInitiation';
import reportToolsApi from '../expandApi/reportTools';
import configApi from '../expandApi/config';
import projectEvaluateApi from '../expandApi/projectEvaluate';
import projectRiskApi from '../expandApi/projectRisk';
import projectQuestionApi from '../expandApi/projectQuestion';
import competitorConfigApi from '../expandApi/competitorConfig';

// 导出接口
const api = {
  targetApi,
  reviewApi,
  commonApi,
  loginApi,
  fileApi,
  toDoApi,
  projectGradingApi,
  projectApi,
  processApi, // 流程
  payPacketApi, // 薪酬包
  planApi, // 项目计划
  assessmentIncentivesApi, // 考核激励
  instrumentReportApi,
  baseLineApi, // 基线
  projectChangeApi, // 项目变更
  projectInitiationApi, // 项目立项
  reportToolsApi, // 报表工具
  configApi, // 产品配置
  projectEvaluateApi, // 评价验收
  projectRiskApi, // 项目风险
  projectQuestionApi, // 项目问题
  competitorConfigApi, // 产品和竞品配置参数
};

export default api;
