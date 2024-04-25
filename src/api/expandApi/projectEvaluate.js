import { post } from '@/utils/request';
/**中台接口请求头 */
const webHeaders = {
  'Content-Type': 'multipart/form-data',
};

const projectEvaluateApi = {
  // 获取定级的流程设置
  getEvaluationTable(parameter) {
    return post(`/project/postProxy/evaluation/getEvaluationTable`, parameter, webHeaders);
  },
  // 获取项目评价模板
  initEvalTempList(parameter) {
    return post(`/project/postProxy/evaluation/initEvalTempList`, parameter, webHeaders);
  },
  // 根据项目以及模板id获取评价模板信息
  getEvalTempInfo(parameter) {
    return post(`/project/postProxy/evaluation/getEvalTempInfo`, parameter, webHeaders);
  },
  // 获取项目阶段评价
  getProjectPhaseEvaluation(parameter) {
    return post(`/project/postProxy/evaluation/getProjectPhaseEvaluation`, parameter, webHeaders);
  },
  // 获取关联数据
  getEvaluationRelativeListViewTable(parameter) {
    return post(`/project/postProxy/evaluation/getEvaluationRelativeListViewTable`, parameter, webHeaders);
  },
  // 创建编辑，保存或提交评价
  createEvaluationAndStartProcess(parameter) {
    return post(`/project/postProxy/evaluation/createEvaluationAndStartProcess`, parameter, webHeaders);
  },
  // 根据评价模板获取选人信息
  getEvaluationProcessUserInfoByEvalTemp(parameter) {
    return post(`/project/postProxy/evaluation/getEvaluationProcessUserInfoByEvalTemp`, parameter, webHeaders);
  },
  // 获取最新交付物数据
  queryAllDeliverableByProjectOid(parameter) {
    return post(`/project/postProxy/deliverable/queryAllDeliverableByProjectOid`, parameter, webHeaders);
  },
  // 获取当前得分
  getCurrentScore(parameter) {
    return post(`/project/postProxy/evaluation/getCurrentScore`, parameter, webHeaders);
  },
  // 根据评价维度获取已完成的打分情况
  getEvaluationGradeInfo(parameter) {
    return post(`/project/postProxy/evaluation/getEvaluationGradeInfo`, parameter, webHeaders);
  },
  // 根据评价维度获取未完成的打分组件
  getEvaluationGradeInput(parameter) {
    return post(`/project/postProxy/evaluation/getEvaluationGradeInput`, parameter, webHeaders);
  },
  // 完成打分任务
  completeEvaluationGradeTask(parameter) {
    return post(`/project/postProxy/evaluation/completeEvaluationGradeTask`, parameter, webHeaders);
  },
  // 保存分数
  saveEvaluationGrade(parameter) {
    return post(`/project/postProxy/evaluation/saveEvaluationGrade`, parameter, webHeaders);
  },
  // 获取考核激励
  queryAssessmentIncentivesByPhaseName(parameter) {
    return post(`/project/postProxy/AssessmentIncentives/queryAssessmentIncentivesByPhaseName`, parameter, webHeaders);
  },
};
export default projectEvaluateApi;
