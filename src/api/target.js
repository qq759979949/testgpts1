import { post, get, download, upload, put } from '@/utils/request';
const headers = {
  'Content-Type': 'multipart/form-data',
};
const headers2 = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
const targetApi = {
  /**查询目标指标模板列表 */
  queryTargetTemplatess(parameter) {
    return post('/project/postProxy/targetIndicator/queryTargetTemplates', parameter, headers);
  },
  /**删除目标指标模板列表 */
  deleteTargetObjs(parameter) {
    return post('/project/postProxy/targetIndicator/deleteTargetObjs', parameter, headers);
  },
  /**创建目标指标模板 */
  saveTargetTemplate(parameter) {
    return post('/project/postProxy/targetIndicator/saveTargetTemplate', parameter, headers);
  },
  /**查询目标指标 */
  queryTargetIndicators(parameter) {
    return post('/project/postProxy/targetIndicator/queryTargetIndicators', parameter, headers);
  },
  /**获取产品类别 */
  getProductTypes(parameter) {
    return post('/project/postProxy/targetIndicator/getProductTypes', parameter, headers);
  },
  /**获取指标类型 */
  getIndicatorTypes(parameter) {
    return post('/project/postProxy/targetIndicator/getIndicatorTypes', parameter, headers);
  },
  /**获取验收阶段 */
  getPhaseByProjectType(parameter) {
    return post('/project/postProxy/targetIndicator/getPhaseByProjectType', parameter, headers);
  },
  /**查询目标指标模板 */
  searchTargetTemplates(parameter) {
    return post('/project/postProxy/targetIndicator/searchTargetTemplates', parameter, headers);
  },
  /**创建&编辑目标指标 */
  saveTargetIndicators(parameter) {
    return post('/project/postProxy/targetIndicator/saveTargetIndicators', parameter, headers);
  },
  /**下载主内容或附件内容 */
  downloadContent(parameter) {
    return download('/project/postProxy/common/downloadContent', parameter, headers);
  },
  /**指标模板导出 */
  exportTargetTemplate(parameter) {
    return download(`/project/postProxy/targetIndicator/exportTargetTemplate`, parameter, headers);
  },
  /**指标模板导入 */
  importTargetTemplate(parameter) {
    return post(`/project/postProxy/targetIndicator/importTargetTemplate`, parameter, headers);
  },
  /**删除持久化对象 */
  deleteObject(parameter) {
    return post(`/project/postProxy/review/deleteObject`, parameter, headers);
  },
  /**查询内部问题列表 */
  queryProblemDetailsByItemID(parameter) {
    return post(`/project/postProxy/targetIndicator/queryProblemDetailsByItemID`, parameter, headers);
  },
  /**查询外部问题列表 */
  queryIssueDetailsByItems(parameter) {
    return post(`/project/postProxy/targetIndicator/queryIssueDetailsByItems`, parameter, headers);
  },
  /**一年内故障率 */
  queryFailureDetailsByItems(parameter) {
    return post(`/project/postProxy/targetIndicator/queryFailureDetailsByItems`, parameter, headers);
  },
  /**上传指标证明文件 */
  uploadTargetIndicatorFile(parameter) {
    return post(`/project/postProxy/targetIndicator/uploadTargetIndicatorFile`, parameter, headers);
  },
  /**删除指标证明文件 */
  deleteTargetIndicatorFile(parameter) {
    return post(`/project/postProxy/targetIndicator/deleteTargetIndicatorFile`, parameter, headers);
  },
  /**各个阶段台数明细 */
  queryQuantityDetailsByPhase(parameter) {
    return post(`/project/postProxy/targetIndicator/queryQuantityDetailsByPhase`, parameter, headers);
  },
};
export default targetApi;
