// 考核激励模块 接口API的集合
// import { PLM_BASE_URL } from '@/api/url';
import { post, get, download, upload } from '@/utils/request';
const headers = {
  'Content-Type': 'multipart/form-data',
};

const headers2 = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

const assessmentIncentivesApi = {
  // 查询考核激励
  queryAssessmentIncentives(parameter) {
    return post(`/project/postProxy/AssessmentIncentives/queryAssessmentIncentives`, parameter, headers);
  },
  // 创建考核激励
  createAssessmentIncentives(parameter) {
    return post(`/project/postProxy/AssessmentIncentives/createAssessmentIncentives`, parameter, headers2);
  },
  // 编辑考核激励
  editAssessmentIncentives(parameter) {
    return post(`/project/postProxy/AssessmentIncentives/editAssessmentIncentives`, parameter, headers2);
  },
  // 查询考核激励变更
  queryRecords(parameter) {
    return post(`/project/postProxy/AssessmentIncentiveRecord/queryRecords`, parameter, headers);
  },
  // 获取项目评价模板
  getUnCompletedPhaseNames(parameter) {
    return post(`/project/postProxy/AssessmentIncentives/getUnCompletedPhaseNames`, parameter, headers2);
  },
  // 获取维度
  getEvaluationPointNames(parameter) {
    return post(`/project/postProxy/AssessmentIncentives/getEvaluationPointNames`, parameter, headers2);
  },
  // 删除考核激励
  deleteAssessmentIncentives(parameter) {
    return post(`/project/postProxy/AssessmentIncentives/deleteAssessmentIncentives`, parameter, headers2);
  },
  // 获取不重复的项目团队成员，不包含用户组:
  listPureMember(parameter) {
    return get(`/project/plmTeam/listPureMember`, parameter, headers2);
  },
  // 校验考核激励操作
  checkOperateAssessmentIncentive(parameter) {
    return post(`/project/postProxy/AssessmentIncentives/checkOperateAssessmentIncentive`, parameter, headers2);
  },
  // 校验新增考核激励
  checkAddAssessmentIncentive(parameter) {
    return post(`/project/postProxy/AssessmentIncentives/checkAddAssessmentIncentive`, parameter, headers2);
  },
};

export default assessmentIncentivesApi;
