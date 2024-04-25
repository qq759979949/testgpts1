/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-08 16:59:11
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\api\todoApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PLM_BASE_URL } from '@/api/url';
import { get, post, download, upload } from '@/utils/request';
let organizationId = 1;
/**windchill接口请求头 */
const wcHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
/**中台接口请求头 */
const webHeaders = {
  'Content-Type': 'multipart/form-data',
};

// 获取待办tab
export function getTodoTables(parameter) {
  return get(`/api/v1/${organizationId}/todos/listByUserRole`, parameter, headers)
}

// 我的任务数据
export function getMyTaskData(parameter) {
  return post(`${PLM_BASE_URL}/fdworkflow/getUserTasks`, parameter);
}

// 我接受的任务
export function getReceivedTaskData(parameter) {
  return post(`${PLM_BASE_URL}/slnassignment/getAssignedProjectTasks`, parameter, headers)
}

// 待批准的任务
export function getApprovalTaskData(parameter) {
  return post(`${PLM_BASE_URL}/slnassignment/getApprovalProjectTasks`, parameter, headers)
}

export function getUserTaskColumns(parameter) {
  return post(`${PLM_BASE_URL}/fdworkflow/getUserTaskColumns`, parameter, headers)
}

export function getUserTasks(parameter) {
  return post(`${PLM_BASE_URL}/fdworkflow/getUserTasks`, parameter)
}

const toDoApi = {
  // 已经逾期的任务
  getExpiredApprovalProjectTasks(parameter) {
    return post(`/project/postProxy/assignment/getExpiredApprovalProjectTasks`, parameter, webHeaders);
  },
  // 即将到期的任务
  getDueAssignedProjectTasks(parameter) {
    return post(`/project/postProxy/assignment/getDueAssignedProjectTasks`, parameter, webHeaders);
  },
  // 已执行任务（待执行任务）
  getAssignProjectTasks(parameter) {
    return post(`/project/postProxy/assignment/getAssignProjectTasks`, parameter, webHeaders);
  },
  // 已审核(待审核)任务
  getApprovalProjectTasks(parameter) {
    return post(`/project/postProxy/assignment/getApprovalProjectTasks`, parameter, webHeaders);
  },
  // 即将到期，已到期任务数量
  getDueTaskAmount(parameter) {
    return post(`/project/postProxy/assignment/getDueTaskAmount`, parameter, webHeaders);
  },
  // 待执行、审核任务数量
  getApprovalAndAssignTaskAmount(parameter) {
    return post(`/project/postProxy/assignment/getApprovalAndAssignTaskAmount`, parameter, webHeaders);
  },
  // 获取待办流程数据
  getWorkflowData(parameter) {
    return post(`/v1/workflowAuth/list`, parameter);
  },
  // 获取任务的基本属性
  getTaskBaseInfo(parameter) {
    return post(`/project/postProxy/plan/getPIPlanAssignmentAttr`, parameter, webHeaders);
  },
  // 获取任务的交付物
  getDeliverableByObject(parameter) {
    // return post(`/project/postProxy/deliverable/queryDeliverable`, parameter, webHeaders);
    return post(`/project/postProxy/plan/getDeliverableByObject`, parameter, webHeaders);
  },
  // 工时汇报
  submitResourceHours(parameter) {
    return post(`/project/postProxy/plan/submitResourceHours`, parameter, webHeaders);
  },
  // 查询资源分配汇报工时
  getPlanActivityResourceHours(parameter) {
    return post(`/project/postProxy/plan/getPlanActivityResourceHours`, parameter, webHeaders);
  },
  // 审核任务资源工时
  getApproveResourceAssignmentsPage(parameter) {
    return post(`/project/postProxy/plan/getApproveResourceAssignmentsPage`, parameter, webHeaders);
  },
  // 审核任务通过时的工时
  getResourceHours(parameter) {
    return post(`/project/postProxy/plan/getResourceHours`, parameter, webHeaders);
  },
  // 审核任务
  approveResourceAssignments(parameter) {
    return post(`/project/postProxy/plan/approveResourceAssignments`, parameter, webHeaders);
  },
  // 转办
  transferTask(parameter) {
    return post(`/v1/workflowAuth/transferTask`, parameter);
  },
  // 批量添加自定义意见
  batchAddUserOpinion(parameter) {
    return post(`/v1/workflowAuth/batchAddUserOpinion`, parameter);
  },
  // 获取当前登录用户全部自定义意见
  listUserOpinion(parameter) {
    return get(`/v1/workflowAuth/listUserOpinion`, parameter);
  },
  // 获取任务数量
  getAllTaskAmount(parameter) {
    return post(`/project/postProxy/assignment/getAllTaskAmount`, parameter, webHeaders);
  },
  // 根据文档编码下载主内容
  downloadContentByNumber(parameter) {
    return download(`/project/postProxy/doc/downloadContentByNumber`, parameter, webHeaders);
  },
};
export default toDoApi;
