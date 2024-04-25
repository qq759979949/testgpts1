/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-12-19 15:57:09
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-18 11:08:50
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\api\expandApi\commonApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { post, get, upload } from '@/utils/request';
const headers = {
  // "Content-Type": "application/x-www-form-urlencoded",
  'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
};
/**中台接口请求头 */
const webHeaders = {
  'Content-Type': 'multipart/form-data',
};

const projectQuestionApi = {
  // 查询项目管理问题表格
  queryProjectIssues(parameter) {
    return post(`/project/postProxy/issue/queryProjectIssues`, parameter, webHeaders);
  },
  // 获取问题可选类型
  getAllRiskTypes(parameter) {
    return post(`/project/postProxy/risk/getAllRiskTypes`, parameter, webHeaders);
  },
  // 创建问题
  saveProjectIssue(parameter) {
    return post(`/project/postProxy/issue/saveProjectIssue`, parameter, webHeaders);
  },
  // 获取问题编辑布局
  getEditLayout(parameter) {
    return post(`/project/postProxy/issue/getEditLayout`, parameter, webHeaders);
  },
  // 编辑问题
  updateProjectIssue(parameter) {
    return post(`/project/postProxy/issue/updateProjectIssue`, parameter, webHeaders);
  },
  // 问题详情
  queryIssueDetails(parameter) {
    return post(`/project/postProxy/issue/queryIssueDetails`, parameter, webHeaders);
  },
  // 批量删除问题
  deleteProjectIssues(parameter) {
    return post(`/project/postProxy/issue/deleteProjectIssues`, parameter, webHeaders);
  },
  // 问题详情布局
  getInfoLayout(parameter) {
    return post(`/project/postProxy/issue/getInfoLayout`, parameter, webHeaders);
  },
  // 上传风险处理附件
  updateContentFiles(parameter) {
    return post(`/project/postProxy/risk/updateContentFiles`, parameter, webHeaders);
  },
  // 查询风险处理附件
  queryContentFiles(parameter) {
    return post(`/project/postProxy/risk/queryContentFiles`, parameter, webHeaders);
  },
  // 删除风险处理附件
  deleteContentFiles(parameter) {
    return post(`/project/postProxy/risk/deleteContentFiles`, parameter, webHeaders);
  },
};
export default projectQuestionApi;
