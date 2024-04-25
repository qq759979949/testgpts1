/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-09 10:27:01
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-10 17:59:43
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\api\processApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { post, get } from '@/utils/request';
/**中台接口请求头 */
const webHeaders = {
  'Content-Type': 'multipart/form-data',
};
const webHeaders2 = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
/**流程模块接口 */
const processApi = {
  /**获取流程详细信息 */
  getProcessInfo(parameter) {
    return post(`/project/postProxy/workflow/getWorkItemData`, parameter, webHeaders);
  },
  /**获取处理记录 */
  getDisposeStatus(parameter) {
    return post(`/project/postProxy/workflow/getDisposeStatus`, parameter, webHeaders);
  },
  /**获取流程节点信息 */
  getProcessSteps(parameter) {
    return post(`/project/postProxy/workflow/queryWorkflowStepGuides`, parameter, webHeaders);
  },
  /**流程节点审批提交按钮 */
  completeTask(parameter) {
    return post(`/project/postProxy/workflow/completeTask`, parameter, webHeaders);
  },
  /**流程节点审批提交按钮 */
  getRoutingDetail(parameter) {
    return post(`/project/postProxy/workflow/getRoutingDetail`, parameter, webHeaders);
  },
  /**查询流程步骤数据 */
  queryProcessStatus(parameter) {
    return post(`/project/postProxy/process/queryProcessStatus`, parameter, webHeaders);
  },
  /**查询路由处理历史数据 */
  queryProcessHistory(parameter) {
    return post(`/project/postProxy/process/queryProcessHistory`, parameter, webHeaders);
  },
  /**查询任务历史数据 */
  queryAssignmentHistory(parameter) {
    return post(`/project/postProxy/process/queryAssignmentHistory`, parameter, webHeaders);
  },
  // 通过oid获取项目详情
  getByOid(parameter) {
    return get(`/project/plmProjectAuth/getByOid`, parameter, webHeaders2);
  },
  // 邮件通知
  emailNotice(parameter) {
    return post(`/v1/workflow/notice`, parameter);
  },
  // 微信通知
  wxNotice(parameter) {
    return post(`/v1/workflow/wxNotice`, parameter);
  },
};
export default processApi;
