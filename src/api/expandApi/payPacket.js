// 薪酬包模块 接口API的集合
// import { PLM_BASE_URL } from '@/api/url';
import { post, download, upload } from '@/utils/request';
const headers = {
  'Content-Type': 'multipart/form-data',
};

const headers2 = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

const payPacketApi = {
  // 获取项目评价与主包金额
  getProjectRewardsByOid(parameter) {
    return post(`/project/postProxy/projectRewards/getProjectRewardsByOid`, parameter, headers);
  },
  // 获取配包部门列表
  getProjectDepartments(parameter) {
    return post(`/project/postProxy/projectRewards/getProjectDepartments`, parameter, headers);
  },
  // 获取项目评级下拉值
  getProjectGradeList(parameter) {
    return post(`/project/postProxy/projectRewards/getProjectGradeList`, parameter, headers);
  },
  // 查询阶段名称
  getPhaseNames(parameter) {
    return post(`/project/postProxy/projectRewards/getPhaseNames`, parameter, headers);
  },
  // 获取变更记录
  queryRewardsChangeRecord(parameter) {
    return post(`/project/postProxy/projectRewards/queryRewardsChangeRecord`, parameter, headers);
  },
  // 同步项目团队成员
  syncProjectTeam(parameter) {
    return post(`/project/postProxy/projectRewards/syncProjectTeam`, parameter, headers);
  },
  // 修改项目评价与主包金额
  updateProjectRewards(parameter) {
    return post(`/project/postProxy/projectRewards/updateProjectRewards`, parameter);
  },
  // 查询主包-配包替换记录
  queryRewardsReplaceRecord(parameter) {
    return post(`/project/postProxy/projectRewards/queryRewardsReplaceRecord`, parameter, headers);
  },
  // 获取主包阶段占比、扣减金额与阶段得分
  queryProjectRewardsMainInfo(parameter) {
    return post(`/project/postProxy/projectRewards/queryProjectRewardsMainInfo`, parameter, headers);
  },
  // 获取主包、配包表格数据
  queryMemberInfoBuilderData(parameter) {
    return post(`/project/postProxy/projectRewards/queryMemberInfoBuilderData`, parameter, headers);
  },
  // 获取配包各部门权重与金额
  getSecondPackageWeightAndAmount(parameter) {
    return post(`/project/postProxy/projectRewards/getSecondPackageWeightAndAmount`, parameter, headers);
  },
  // 批量添加成员
  batchAddUserRewards(parameter) {
    return post(`/project/postProxy/projectRewards/batchAddUserRewards`, parameter, headers);
  },
  // 移除成员
  removeUserRewards(parameter) {
    return post(`/project/postProxy/projectRewards/removeUserRewards`, parameter);
  },
  // 导出部门信息
  exportDeptInfo(parameter) {
    return download(`/project/postProxy/projectRewards/exportDeptInfo`, parameter, headers);
  },
  // 导出主包-配包成员
  exportUserRewardsInfo(parameter) {
    return download(`/project/postProxy/projectRewards/exportUserRewardsInfo`, parameter, headers);
  },
  // 导入主包-配包成员
  importUserRewardsInfo(parameter) {
    return post(`/project/postProxy/projectRewards/importUserRewardsInfo`, parameter, headers);
  },
  // 导入部门信息
  importDeptInfo(parameter) {
    return post(`/project/postProxy/projectRewards/importDeptInfo`, parameter, headers);
  },

  //保存
  // 主包阶段占比、扣减金额与阶段得分--保存
  updateProjectRewardMainInfo(parameter) {
    return post(`/project/postProxy/projectRewards/updateProjectRewardMainInfo`, parameter, headers2);
  },
  // 成员表格信息--保存
  saveMemberUserRewards(parameter) {
    return post(`/project/postProxy/projectRewards/saveMemberUserRewards`, parameter);
  },
  // 配包各部门权重与金额-保存
  saveSecondaryPacInfo(parameter) {
    return post(`/project/postProxy/projectRewards/saveSecondaryPacInfo`, parameter);
  },
  // 获取自检人
  getSelfCheckManConfig(parameter) {
    return post(`/project/postProxy/review/getSelfCheckManConfig`, parameter, headers);
  },
  // 获取验收阶段（评审）
  queryReviewPhaseByProjectType(parameter) {
    return post(`/project/postProxy/targetIndicator/queryReviewPhaseByProjectType`, parameter, headers);
  },
  // 查询台数明细信息
  queryQuantityDetails(parameter) {
    return post(`/project/postProxy/targetIndicator/queryQuantityDetails`, parameter, headers);
  },
  // 查询薪酬包用户
  queryRewardsUsers(parameter) {
    return post(`/project/postProxy/AssessmentIncentives/queryRewardsUsers`, parameter, headers);
  },
};

export default payPacketApi;
