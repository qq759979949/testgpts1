const PLM_BASE_URL = "/plmPortal/Windchill/servlet/gwc/solution";
import { post, get, download, upload, put } from "@/utils/request";
const headers = {
  // "Content-Type": "application/x-www-form-urlencoded",
  'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
}

// 获取自定义表头
export function getCustomizeHeaders(parameter) {
  return get(`/api/v1/2/customize-headers/getList`, parameter, headers);
}
// 保存自定义表头
// export function putCustomizeHeaders(parameter) {
//   return post(`/api/v1/2/customize-headers/saveOrUpdate`, parameter);
// }
export function setupTableHead(parameter) {
  return post('/project/tableColumn/setupTableHead', parameter)
}

// 获取表头全部数据
export function getAllColumns(parameter) {
  return get('/project/tableColumn/listColumn', parameter)
}


// 获取用户设置的表的列的集合
export function getSelectedColumn(parameter) {
  return get('/project/tableColumn/getSelectedColumn', parameter)
}

// 获取用户展示的列
export function listSetupColumn(parameter) {
  return get('/project/tableColumn/listSetupColumn', parameter)
}



// // 恢复默认表头
// export function resetCustomizeHeaders(parameter) {
//   return get(`/api/v1/2/customize-headers/reset`, parameter, headers);
// }

// 表头接口
export function getTableViewColumns(parameter) {
  return post(`${PLM_BASE_URL}/fdtable/getTableViewColumns`, parameter, headers)
}

// // 获取创建项目类型接口
export function getAllInstantiableSubTypes(parameter) {
  return post(`/project/postProxy/project/getSubTypes`, parameter, headers);
}

// 获取对象创建属性接口
export function getCreateLayout(parameter) {
  return post(`/project/postProxy/project/getProjectCreateLayout`, parameter, headers);
}

// 获取对象编辑属性接口
export function getEditLayout(parameter) {
  return post(`${PLM_BASE_URL}/fdattributes/getEditLayout`, parameter, headers);
}

// 获取对象详情布局属性
export function getInfoLayout(parameter) {
  return post(`${PLM_BASE_URL}/fdattributes/getInfoLayout`, parameter, headers);
}

// 获取全量表头
export function getAllHeaders(parameter) {
  return post(`${PLM_BASE_URL}/fdtable/getTableViewColumns`, parameter, headers);
}

// 获取按钮通用接口
export function getActionMenus(parameter) {
  return post(`${PLM_BASE_URL}/fdaction/getActionMenus`, parameter, headers)
}

// 通用查人接口
export function pagingSearchUser(parameter) {
  return post(`${PLM_BASE_URL}/fdprincipal/pagingSearchUser`, parameter, headers)
}

// 查询活动
export function findActivity(parameter) {
  return post(`${PLM_BASE_URL}/slnplan/findActivity`, parameter, headers)
}

// 获取通用附件接口
export function getFileServer(parameter) {
  return post(`${PLM_BASE_URL}/fdcontent/getContentHolderContents`, parameter, headers)
}

// 上传对象主内容或者附件
export function updateContentFiles(parameter) {
  return upload(`${PLM_BASE_URL}/fdcontent/updateContentFiles`, parameter, headers)
}
