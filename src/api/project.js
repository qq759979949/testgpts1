import { PLM_BASE_URL } from '@/api/url';
import { post, get, download, upload, put } from '@/utils/request';
const organizationId = 2;
const headers = {
  'Content-Type': 'multipart/form-data',
};

const headers2 = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

// export function getProjectList(parameter) {
//   return post(`${PLM_BASE_URL}/slnproject/getProjectList`, parameter, headers)
// }

export function getAssignmentColumns(parameter) {
  return post(`${PLM_BASE_URL}/slnassignment/getAssignmentColumns`, parameter, headers);
}

// 获取表头
export function getProjectListColumns(parameter) {
  return post(`${PLM_BASE_URL}/slnproject/getProjectColumns`, parameter, headers);
}

// 创建项目
export function createPorject(parameter) {
  return post(`${PLM_BASE_URL}/fdform/createObject`, parameter, headers);
}

// 编辑项目
export function editObject(parameter) {
  return post(`${PLM_BASE_URL}/fdform/editObject`, parameter, headers);
}

// 应用
export function getUserApp(parameter) {
  return get('/api/v1/2/user-apps', parameter);
}

export function setUserApp(parameter) {
  return put('/api/v1/2/user-apps', parameter);
}

// 获取问题数量
export function getIssueCount(parameter) {
  return post('/project/pipdc/pmgt/project/getIssueCount', parameter);
}

// 获取风险数量
export function getRiskCount(parameter) {
  return post('/project/pipdc/pmgt/project/getRiskCount', parameter);
}

//--------------------------项目团队--------------------------------------
// 添加项目团队成员
export function addRoleTeamMember(parameter) {
  return post('/project/pipdc/pmgt/team/addRoleTeamMember', parameter);
}

// 查找团队中的用户
export function findUser(parameter) {
  return post('/project/pipdc/foundation/user/findUser', parameter);
}

// 获取所有权限
export function getAllRoles(parameter) {
  return post('/project/pipdc/pmgt/team/getAllRoles', parameter);
}

// 获取项目权限
export function getProjectRole(parameter) {
  return post('/project/pipdc/pmgt/team/getProjectRole', parameter);
}

// 获取项目团队数据
export function getProjectTeamData(parameter) {
  return post('/project/pipdc/pmgt/team/getDataProjectTeam', parameter);
}

// 移除团队成员权限
export function removeRoleTeamMember(parameter) {
  return post('/project/pipdc/pmgt/team/removeRoleTeamMember', parameter);
}

// 保存团队权限编辑
export function saveRoleEdit(parameter) {
  return post('/project/pipdc/pmgt/team/saveRoleEdit', parameter);
}

// 获取详情属性布局
export function getAttributeGroup(parameter) {
  return post('/project/pipdc/pdm/attribute/getAttributeGroup', parameter);
}

// // 设置表头（项目列表）
// export function setupTableHead(parameter) {
//   return post('/project/tableColumn/setupTableHead', parameter)
// }

// 项目列表
export function getProjectList(parameter) {
  return post('/project/plmProjectAuth/list', parameter);
}

// // 获取创建项目类型接口
// export function getAllInstantiableSubTypes(parameter) {
//   return post(`/project/postProxy/fdcore/getAllInstantiableSubTypes`, parameter, headers);
// }

// // 获取对象创建属性接口
// export function getCreateLayout(parameter) {
//   return post(`/project/postProxy/fdattributes/getCreateLayout`, parameter, headers);
// }

// 项目创建接口
export function saveProject(parameter) {
  return post(`/project/postProxy/project/saveProject`, parameter, headers);
}

// 获取二级部门
export function getSecondaryDepartments(parameter) {
  return post(`/project/postProxy/project/getSecondaryDepartments`, parameter, headers);
}

// 查看临界值
export function getAllProjectCriticalConfig(parameter) {
  return post(`/project/getProxy/planActivity/getProjectCriticalConfigByType?projectType=${parameter}`, headers);
}

// 创建临界值
export function createProjectCriticalConfig(parameter) {
  return post(`/project/postProxy/planActivity/createProjectCriticalConfig`, parameter);
}

// 编辑临界值
export function updateProjectCriticalConfig(parameter) {
  return post(`/project/postProxy/planActivity/updateProjectCriticalConfig`, parameter);
}

// 获取对象编辑属性接口
export function getProjectEditLayout(parameter) {
  return post(`/project/postProxy/project/getProjectEditLayout`, parameter, headers);
}

// 编辑项目
export function editProject(parameter) {
  return post(`/project/postProxy/project/editProject`, parameter, headers);
}

// 关注项目
export function followProject(parameter) {
  return post(`/project/plmProjectAuth/followProject`, parameter);
}

// 移除关注项目
export function removeFollowProject(parameter) {
  return post(`/project/plmProjectAuth/removeFollowProject`, parameter);
}
// 获取关注项目列表
export function followList(parameter) {
  return post(`/project/plmProjectAuth/followList`, parameter);
}

// 导出项目
export function exportList(parameter, tabName) {
  return download(`/project/plmProjectAuth/export?pageLabelName=${tabName}`, parameter);
}

// 创建自定义tab
export function createCustomerPageLabel(parameter) {
  return post(`/project/plmProjectAuth/createCustomerPageLabel`, parameter);
}

// 获取自定义tab
export function listCustomerPageLabel(parameter) {
  return get(`/project/plmProjectAuth/listCustomerPageLabel`, parameter);
}

// 编辑自定义tab
export function updateCustomerPageLabel(parameter) {
  return post(`/project/plmProjectAuth/updateCustomerPageLabel`, parameter);
}

// 删除自定义tab
export function batchDeleteCustomerPageLabel(parameter) {
  return post(`/project/plmProjectAuth/batchDeleteCustomerPageLabel`, parameter);
}

// 获取项目详细布局信息
export function getProjectInfoLayout(parameter) {
  return post(`/project/postProxy/project/getProjectInfoLayout`, parameter, headers);
}

// // 获取产品项目的订货号
// export function getOrderValues(parameter) {
//   return post(`/project/postProxy/project/getOrderValues`, parameter, headers)
// }

// 项目阶段导航
export function getProjectMileStonePlan(parameter) {
  return post(`/project/postProxy/workflow/getProjectMileStonePlan`, parameter, headers);
}

// 添加访问记录
export function addHistory(parameter) {
  return post(`/project/history/addHistory`, parameter);
}

//最近访问
export function lastProject(parameter) {
  return get(`/project/history/lastProject`, parameter);
}

// 根据项目oid查询订货号
export function queryProductOrders(parameter) {
  return post(`/project/postProxy/productOrder/queryProductOrders`, parameter, headers);
}

// 根据编号或名称模糊查询物料
export function queryParts(parameter) {
  return post(`/project/postProxy/productOrder/queryParts`, parameter, headers);
}

// 查询订货号
export function findPartItems(parameter) {
  return post(`/project/postProxy/productOrder/findPartItems`, parameter, headers);
}

// 移除项目的订货号
export function removeProductOrders(parameter) {
  return post(`/project/postProxy/productOrder/removeProductOrders`, parameter, headers);
}

// 添加项目的订货号
export function addProductOrders(parameter) {
  return post(`/project/postProxy/productOrder/addProductOrders`, parameter, headers);
}

const projectApi = {
  editProjectState(parameter) {
    return post(`/project/postProxy/project/editProjectState`, parameter, headers2);
  },
  // 项目看板
  queryProjectKanBanInfo(parameter) {
    return post(`/project/postProxy/projectRewards/queryProjectKanBanInfo`, parameter, headers);
  },
  // 更新项目进展
  updateProjectProgress(parameter) {
    return post(`/project/postProxy/project/updateProjectProgress`, parameter, headers);
  },
  // 删除项目
  deleteProject(parameter) {
    return post(`/project/postProxy/project/deleteProject`, parameter, headers);
  },
  // 批量查询项目导航信息
  queryProjectNavInfos(parameter) {
    return post(`/project/postProxy/project/queryProjectNavInfos`, parameter, headers);
  },
  // 获取主要市场
  getMainMarket(parameter) {
    return get(`/project/sdlgArea/tree`, parameter);
  },
  // 获取吨位
  getDunTreeByCode(parameter) {
    return get(`/project/sdlgArea/getDunTreeByCode`, parameter);
  },
};

export default projectApi;
