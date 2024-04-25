// 报表工具模块 接口API的集合
// import { PLM_BASE_URL } from '@/api/url';
import { post, download, upload } from '@/utils/request';
const headers = {
  'Content-Type': 'multipart/form-data',
};

const headers2 = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

const reportToolsApi = {
  // 获取一级部门
  searchPrimaryDepartment1(parameter) {
    return post(`/project/postProxy/EnterpriseReportController/searchPrimaryDepartment1`, parameter, headers2);
  },
  // 获取二级部门
  getSecondaryDepartments(parameter) {
    return post(`/project/postProxy/project/getSecondaryDepartments`, parameter, headers);
  },
  // 获取项目等级
  getProjectLevelConfigJson(parameter) {
    return post(`/project/postProxy/report/getProjectLevelConfigJson`, parameter, headers2);
  },
  // 获取项目等级
  searchProjectEvaluationReport(parameter) {
    return post(`/project/postProxy/report/searchProjectEvaluationReport`, parameter, headers2);
  },
  // 查询生命周期模版状态列表
  queryStatesByLifeCycleTemplate(parameter) {
    return post(`/project/postProxy/report/queryStatesByLifeCycleTemplate`, parameter, headers2);
  },
  // 批量设置发放日期
  batchSaveGivenDate(parameter) {
    return post(`/project/postProxy/report/batchSaveGivenDate`, parameter, headers2);
  },
  // 多项目质量报表
  queryMultiProjectQualityReport(parameter) {
    return post(`/project/postProxy/report/queryMultiProjectQualityReport`, parameter, headers2);
  },
  // 根据项目类型获取项目阶段
  queryKeyWBSByProjectType(parameter) {
    return post(`/project/postProxy/report/queryKeyWBSByProjectType`, parameter, headers2);
  },
  // 目标指标查询报表
  queryTargetIndicators(parameter) {
    return post(`/project/postProxy/report/queryTargetIndicators`, parameter, headers2);
  },
  // 信息技术类项目进度报表
  exportITProject(parameter) {
    return download(`/project/postProxy/report/exportITProject`, parameter, headers);
  },
  // 制造技术项目进度报表
  exportTecProject(parameter) {
    return download(`/project/postProxy/report/exportTecProject`, parameter, headers);
  },
  // 成员参与项目统计查询
  queryProjectMemberParticipationReport(parameter) {
    return post(`/project/postProxy/report/queryProjectMemberParticipationReport`, parameter, headers);
  },
  // 产品开发类项目进度报表
  exportDevProject(parameter) {
    return download(`/project/postProxy/report/exportDevProject`, parameter, headers);
  },
  // 薪酬包报表（导出）
  exportProjectRewardsReport(parameter) {
    return download(`/project/postProxy/report/exportProjectRewardsReport`, parameter, headers);
  },
  // 多项目流程报表查询
  queryMultiProjectWrokflowReport(parameter) {
    return post(`/project/postProxy/report/queryMultiProjectWrokflowReport`, parameter, headers);
  },
  // 汇报工时跟踪
  queryReportingHourTrackingReport(parameter) {
    return post(`/project/postProxy/report/queryReportingHourTrackingReport`, parameter, headers);
  },
  // 导出流程详情报表
  exportProcessDetail(parameter) {
    return download(`/project/postProxy/report/exportProcessDetail`, parameter, headers);
  },
  // 预警报表
  queryProjectWarnData(parameter) {
    return post(`/project/postProxy/report/queryProjectWarnData`, parameter, headers);
  },
  // 批量设置单人替换
  batchSetSingleUser(parameter) {
    return post(`/project/postProxy/report/batchSetSingleUser`, parameter, headers);
  },
  // 获取项目列表
  queryRewardOwnerReplaceInfo(parameter) {
    return post(`/project/postProxy/report/queryRewardOwnerReplaceInfo`, parameter, headers);
  },
};

export default reportToolsApi;
