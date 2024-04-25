/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-11-23 09:59:42
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2023-12-25 16:20:43
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\api\homePage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PLM_BASE_URL } from '@/api/url'
import { post, get, download, upload, put } from '@/utils/request'
const organizationId = 2;
const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
}
// 获取功能区列表(角色)
export function getFuncList(parameter) {
  return get(`/v1/userFunctionArea/list`, parameter, headers)
}

// 获取功能区列表(全部)
export function listDictItem(parameter) {
  return get(`/system/dict/listDictItem`, parameter)
}
export function getAll(parameter) {
  return get(`/v1/2/quick-entrys/getAll?description=&page=1&size=1000`, parameter)
}

// 设置功能区列表
export function setupFunc(parameter) {
  return post(`/v1/userFunctionArea/setup`, parameter)
}

// 获取新闻公告
export function getList(parameter) {
  return get(`/v1/0/articles/list`, parameter)
}

// 新闻公告明细
export function getNewsDetail(tenlantId, id) {
  return get(`/v1/${tenlantId}/articles/${id}`)
}

// Portal首页布局
export function personalConfigs(parameter) {
  return put(`/v1/${organizationId}/personal-configs`, parameter)
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
  return post(`${PLM_BASE_URL}/fdworkflow/getUserTasks`, parameter, headers)
}

