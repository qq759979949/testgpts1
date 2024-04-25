const PLM_BASE_URL = '/plmPortal/Windchill/servlet/gwc/solution';
import { post } from '@/utils/request';
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
const headers2 = {
  'Content-Type': 'multipart/form-data',
};

// 流程任务属性
export function getInfoPageAttrs(parameter) {
  return post(`${PLM_BASE_URL}/fdworkflow/getInfoPageAttrs`, parameter, headers);
}

// 流程指引（流程图）
export function getProcessSteps(parameter) {
  return post(`${PLM_BASE_URL}/fdworkflow/getProcessSteps`, parameter, headers);
}

// 获取流程选人(流程任务界面)
export function getWFSelectPrincipal(parameter) {
  return post(`${PLM_BASE_URL}/fdworkflow/getWFSelectPrincipal`, parameter, headers);
}

// 获取流程路由选项
export function getRoutingRemarks(parameter) {
  return post(`${PLM_BASE_URL}/fdworkflow/getRoutingRemarks`, parameter, headers);
}

// 流程完成任务
export function completeTask(parameter) {
  return post(`${PLM_BASE_URL}/fdworkflow/completeTask`, parameter, headers2);
}

// 流程处理记录
export function getDisposeStatus(parameter) {
  return post(`${PLM_BASE_URL}/fdworkflow/getDisposeStatus`, parameter, headers);
}

// 查询用户
export function getSearchUsers(parameter) {
  return post(`${PLM_BASE_URL}/fdprincipal/searchUser`, parameter, headers);
}

// 流程转办
export function delegateTasks(parameter) {
  return post(`${PLM_BASE_URL}/fdworkflow/delegateTasks`, parameter, headers);
}

// 获取路由选项
export function getRouting(parameter) {
  return post('/project/pipdc/foundation/workflow/getRouting', parameter);
}

// 查询用户
export function searchUsers(parameter) {
  return post('/project/pipdc/foundation/workflow/searchUsers', parameter);
}

// 完成任务
export function completeWorkItem(parameter) {
  return post('/project/pipdc/foundation/workflow/completeWorkItem', parameter);
}

// 重新分配任务
export function reassignWorkItem(parameter) {
  return post('/project/pipdc/foundation/workflow/reassignWorkItem', parameter);
}

// 获取对象的版本历史记录
export function getVersionHistory(parameter) {
  return post('/project/pipdc/pdm/core/getVersionHistory', parameter);
}
