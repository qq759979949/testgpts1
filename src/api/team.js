import { PLM_BASE_URL } from '@/api/url';
import axios from 'axios';
import { post, get, download, upload, put, request, fileRequest } from '@/utils/request';

// 添加成员
export function addMember(parameter) {
  return post(`/project/plmTeam/addMember`, parameter);
}

// 移除成员
export function removeMember(parameter) {
  return get(`/project/plmTeam/removeMember`, parameter);
}

// 查询成员团队列表
export function listMember(parameter) {
  return get(`/project/plmTeam/listMember`, parameter);
}

// 团队角色
export function roleList(parameter) {
  return get(`/project/plmTeam/roleList`, parameter);
}

// 项目成员搜索
export function searchTeamMemberByName(parameter) {
  return get(`/project/plmTeam/searchTeamMemberByName`, parameter);
}

// 导出
export function exportExcel(parameter) {
  return fileRequest({
    method: 'get',
    url: '/project/plmTeam/exportExcel',
    responseType: 'blob',
    params: parameter,
  });
}

// 导入
export function importExcel(parameter) {
  return upload(`/project/plmTeam/importExcel`, parameter);
}

// 成员变更记录
export function memberChangeLog(parameter) {
  return get(`/project/plmTeam/memberChangeLog`, parameter);
}

// 替换
export function replaceMember(parameter, memberId) {
  return post(`/project/plmTeam/replaceMember?memberId=${memberId}`, parameter);
}

// 编辑成员
export function editMember(parameter) {
  return post(`/project/plmTeam/editMember`, parameter);
}

// 角色编辑
export function bindProjectRole(parameter, projectId) {
  return post(`/project/plmTeam/bindProjectRole?projectId=${projectId}`, parameter);
}

// 权限编辑
export function bindProjectMenuGroup(parameter, projectId) {
  return post(`/project/plmTeam/bindProjectMenuGroup?projectId=${projectId}`, parameter);
}

// 角色权限
export function menuGroupList(parameter) {
  return get(`/project/plmTeam/menuGroupList`, parameter);
}

// 获取全量角色
export function getAllRoles(parameter) {
  return get(`/project/plmTeam/roleList`, parameter);
}

// 获取全量用户组
export function getAllGroup(parameter) {
  return post(`/oauth/group/pageFind`, parameter);
}

// 获取全量用户
export function getAllUser(parameter) {
  return post(`/oauth/user/pageFind`, parameter);
}

// 获取全量部门
export function getAllDepartment(parameter) {
  return post(`/oauth/department/getAll`, parameter);
}
// 角色菜单组权限列表
export function getMenuAuthList(parameter) {
  return get(`/project/plmTeam/menuGroupList`, parameter);
}

// 查询用户组下用户
export function listGroupUser(parameter) {
  return get(`/project/plmTeam/listGroupUser`, parameter);
}

// 复制项目团队
export function copyTeam(parameter) {
  return get(`/project/plmTeam/copyTeam`, parameter);
}

// 人员负载
export function memberLoadFactor(parameter) {
  return get(`/project/plmTeam/memberLoadFactor`, parameter);
}

// 最近访问用户
export function lastUser(parameter) {
  return get(`/project/history/lastUser`, parameter);
}

// 最近访问用户组
export function lastUserGroup(parameter) {
  return get(`/project/history/lastUserGroup`, parameter);
}

// 查询项目组里面的所有用户
export function getProjectUser(parameter) {
  return get(`/project/plmTeam/userList`, parameter);
}

// 查询所有角色
export function pageFind(parameter) {
  return post(`/oauth/role/pageFind`, parameter);
}

// 查询中台用户组
export function getGroupNamesByUserName(parameter) {
  return get(`/project/plmTeam/getGroupNamesByUserName`, parameter);
}

// 通过中台账号搜索全部所属项目
export function searchAllTeamInfoByUserName(parameter) {
  return get(`/project/plmTeam/searchAllTeamInfoByUserName`, parameter);
}
