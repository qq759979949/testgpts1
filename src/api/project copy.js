import { PLM_BASE_URL } from '@/api/url'
import { post, get, download, upload, put } from '@/utils/request'

export function getProjectList(parameter) {
  return post(`${PLM_BASE_URL}/slnproject/getProjectList`, parameter)
}

export function getAssignmentColumns(parameter) {
  return post(`${PLM_BASE_URL}/slnassignment/getAssignmentColumns`, parameter)
}

// 获取表头
export function getProjectListColumns(parameter) {
  return post(`${PLM_BASE_URL}/slnproject/getProjectColumns`, parameter)
}

// 创建项目
export function createPorject(parameter) {
  return post(`${PLM_BASE_URL}/fdform/createObject`, parameter)
}

// 编辑项目
export function editObject(parameter) {
  return post(`${PLM_BASE_URL}/fdform/editObject`, parameter)
}



export function getProjectsUserGroup(parameter) {
  return post('/project/pipdc/pmgt/project/getPIProjectsUserGroup', parameter)
}

export function getSummarizeProject(parameter) {
  return post('/project/pipdc/pmgt/project/summarizeProject', parameter)
}

export function getRiskCount(parameter) {
  return post('/project/pipdc/pmgt/project/getRiskCount', parameter)
}

export function getRelatedProducts(parameter) {
  return post('/project/pipdc/pmgt/project/getRelatedProducts', parameter)
}

export function saveProject(parameter) {
  return post('/project/pipdc/pmgt/project/saveProject', parameter)
}

export function findUser(parameter) {
  return post('/project/pipdc/foundation/user/findUser', parameter)
}

export function exportProjects(parameter) {
  return download('/project/pipdc/pmgt/project/exportProjects', parameter)
}

export function getProjectInfo(parameter) {
  return post('/project/pipdc/pmgt/project/getProjectInfo', parameter)
}

export function getIssueCount(parameter) {
  return post('/project/pipdc/pmgt/project/getIssueCount', parameter)
}

// 应用
export function getUserApp(parameter) {
  return get('/api/v1/2/user-apps', parameter)
}

export function setUserApp(parameter) {
  return put('/api/v1/2/user-apps', parameter)
}

// 团队

export function getProjectTeamData(parameter) {
  return post('/project/pipdc/pmgt/team/getDataProjectTeam', parameter)
}

export function getProjectRole(parameter) {
  return post('/project/pipdc/pmgt/team/getProjectRole', parameter)
}

export function getAllRoles(parameter) {
  return post('/project/pipdc/pmgt/team/getAllRoles', parameter)
}

export function addRoleTeamMember(parameter) {
  return post('/project/pipdc/pmgt/team/addRoleTeamMember', parameter)
}

export function removeRoleTeamMember(parameter) {
  return post('/project/pipdc/pmgt/team/removeRoleTeamMember', parameter)
}

export function saveRoleEdit(parameter) {
  return post('/project/pipdc/pmgt/team/saveRoleEdit', parameter)
}

//  项目问题   

// 获取项目对象的属性布局
export function getPanleForPipmgt(parameter) {
  return post('/project/pipdc/pdm/attribute/getPanleForPipmgt', parameter)
}

// 获取项目关联的问题
export function getProjectIssueList(parameter) {
  return post('/project/pipdc/pmgt/issues/getProjectIssueList', parameter)
}

// 删除问题
export function deleteProjectIssue(parameter) {
  return post('/project/pipdc/pmgt/issues/deleteProjectIssue', parameter)
}

// 创建-编辑问题
export function saveProjectIssue(parameter) {
  return post('/project/pipdc/pmgt/issues/saveProjectIssue', parameter,
  {'Content-Type':'multipart/form-data'}
  )
}

// 设置流程团队(更新流程审批人)
export function updateTeamPrincipal(parameter) {
  return post('/project/pipdc/foundation/workflow/updateTeamPrincipal', parameter)
}

// 为对象设置附件
export function addObjectAccessoryFile(parameter) {
  return post('/project/pipdc/pmgt/issues/addObjectAccessoryFile', parameter,
  {'Content-Type':'multipart/form-data'})
}

// 下载问题模板
export function downloadProjectIssue(parameter) {
  return download('/project/pipdc/pmgt/issues/downloadProjectIssue', parameter)
}

// 项目问题导入
export function importIssues(parameter) {
  return post('/project/pipdc/pmgt/issues/importIssues', parameter,
  {'Content-Type':'multipart/form-data'})
}



// *****文件*****

// 获取文件夹树结构
export function getFolderTree(parameter) {
  return post('/project/pipdc/pdm/folder/getFolderTree', parameter)
}

// 获取文件夹内容
export function getFolderContents(parameter) {
  return post('/project/pipdc/pdm/folder/getFolderContents', parameter)
}

// 获取流程选人(创建对象界面)
export function getPageSelectPrincipal(parameter) {
  return post('/project/pipdc/foundation/workflow/getPageSelectPrincipal', parameter)
}

// 获取流程选人(流程任务界面)
export function getWFSelectPrincipal(parameter) {
  return post('/project/pipdc/foundation/workflow/getWFSelectPrincipal', parameter)
}

// 启动文档流程
export function startDocWfProcess(parameter) {
  return post('/project/pipdc/foundation/workflow/startDocWfProcess', parameter)
}

// 下载文档
export function downloadDoc(parameter) {
  return download('/project/pipdc/foundation/doc/downloadDoc', parameter)
}

// 创建（上传）文档
export function createDoc(parameter) {
  return upload('/project/pipdc/foundation/doc/createDoc', parameter)
}

// 获取对象的版本历史记录
export function getVersionHistory(parameter) {
  return post('/project/pipdc/pdm/core/getVersionHistory', parameter)
}


// *****待办中心*****

// 获取流程任务列表
export function getWorkItemList(parameter) {
  return post('/project/pipdc/foundation/workflow/getWorkItemList', parameter)
}

// 获取详情属性布局
export function getAttributeGroup(parameter) {
  return post('/project/pipdc/pdm/attribute/getAttributeGroup', parameter)
}

// 获取流程指引
export function getProcessSteps(parameter) {
  return post('/project/pipdc/foundation/workflow/getProcessSteps', parameter)
}

// 获取处理状况
export function getDisposeStatus(parameter) {
  return post('/project/pipdc/foundation/workflow/getDisposeStatus', parameter)
}

// 获取路由选项
export function getRouting(parameter) {
  return post('/project/pipdc/foundation/workflow/getRouting', parameter)
}

// 查询用户
export function searchUsers(parameter) {
  return post('/project/pipdc/foundation/workflow/searchUsers', parameter)
}

// 完成任务
export function completeWorkItem(parameter) {
  return post('/project/pipdc/foundation/workflow/completeWorkItem', parameter)
}

// 重新分配任务
export function reassignWorkItem(parameter) {
  return post('/project/pipdc/foundation/workflow/reassignWorkItem', parameter)
}


// *****风险*****





// *****变更*****
export function getChangeRequests(parameter) {
  return post('/project/pipdc/pmgt/changerequest/getChangeRequests', parameter)
}
