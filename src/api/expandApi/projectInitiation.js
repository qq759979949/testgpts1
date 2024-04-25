// 项目立项模块 接口API的集合
// import { PLM_BASE_URL } from '@/api/url';
import { post, download, upload } from '@/utils/request';
const headers = {
  'Content-Type': 'multipart/form-data',
};

const headers2 = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

const projectInitiationApi = {
  // 获取项目立项流程中评审节点财务信息布局
  getCreateFinancialLayout(parameter) {
    return post(`/project/postProxy/workflow/getCreateFinancialLayout`, parameter, headers);
  },
  // 获取该审核人是否属于质量成本评审角色
  belongToCostReview(parameter) {
    return post(`/project/postProxy/workflow/belongToCostReview`, parameter, headers);
  },
  // 下载财务模板
  downloadFinancialTemplate(parameter) {
    return download(`/project/postProxy/workflow/downloadFinancialTemplate`, parameter, headers);
  },
  // 项目立项流程完成任务且保存财务信息
  completeReviewTask(parameter) {
    return post(`/project/postProxy/workflow/completeReviewTask`, parameter, headers);
  },
  // 获取财务信息
  getFinancialInfo(parameter) {
    return post(`/project/postProxy/workflow/getFinancialInfo`, parameter, headers);
  },
  // 财务页签查询财务信息
  queryFinancialInfo(parameter) {
    return post(`/project/postProxy/project/queryFinancialInfo`, parameter, headers);
  },
  // 项目立项获取主包、配包表格数据
  queryProjectStartMemberInfoBuilderData(parameter) {
    return post(`/project/postProxy/projectRewards/queryProjectStartMemberInfoBuilderData`, parameter, headers);
  },
};

export default projectInitiationApi;
