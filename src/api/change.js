import { PLM_BASE_URL } from '@/api/url'
import { post, get, download, upload, put } from '@/utils/request'
const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
}

// 获取项目变更列表
export function getProjectChangeRequestList(parameter) {
  return post(`${PLM_BASE_URL}/slnchangerequest/getProjectChangeRequestList`, parameter, headers)
}

// 创建变更
export function createObject(parameter) {
  return post(`${PLM_BASE_URL}/fdform/createObject`, parameter, headers)
}

// 删除变更
export function deleteChangeRequest(parameter) {
  return post(`${PLM_BASE_URL}/slnchangerequest/deleteChangeRequest`, parameter, headers)
}

// 编辑变更
export function editObject(parameter) {
  return post(`${PLM_BASE_URL}/fdform/editObject`, parameter, headers)
}