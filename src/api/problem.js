import { PLM_BASE_URL } from '@/api/url'
import { post, get, download, upload, put } from '@/utils/request'
const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
}
// 查询问题
export function getIssueListForLibrary(parameter) {
  return post(`${PLM_BASE_URL}/slnissue/getIssueListForLibrary`, parameter, headers)
}

// 查询项目问题
export function getProjectIssueList(parameter) {
  return post(`${PLM_BASE_URL}/slnissue/getProjectIssueList`, parameter, headers)
}

// 创建问题
export function createQuestion(parameter) {
  return upload(`${PLM_BASE_URL}/fdform/createObject`, parameter)
}

// 编辑问题
export function editQuestion(parameter) {
  return upload(`${PLM_BASE_URL}/fdform/editObject`, parameter)
}

// 删除问题
export function deleteProjectIssue(parameter) {
  return post(`${PLM_BASE_URL}/slnissue/deleteProjectIssue`, parameter, headers)
}

// 项目问题添加附件
export function addIssueFile(parameter) {
  return post(`${PLM_BASE_URL}/slnissue/addObjectAccessoryFile`, parameter, headers)
}

// 项目问题移除
export function deleteIssueFile(parameter) {
  return upload(`${PLM_BASE_URL}/slnissue/deleteObjectAccessoryFile`, parameter)
}
