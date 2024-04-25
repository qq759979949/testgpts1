const PLM_BASE_URL = '/plmPortal/Windchill/servlet/gwc/solution';
import { post, get, upload, download } from '@/utils/request';
const headers = {
  // "Content-Type": "application/x-www-form-urlencoded",
  'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
};
/**中台接口请求头 */
const webHeaders = {
  'Content-Type': 'multipart/form-data',
};

const commonApi = {
  // 获取自定义表头
  getCustomizeHeaders(parameter) {
    return get(`/api/v1/2/customize-headers/getList`, parameter, headers);
  },
  // 保存自定义表头
  // export function putCustomizeHeaders(parameter) {
  //   return post(`/api/v1/2/customize-headers/saveOrUpdate`, parameter);
  // }
  setupTableHead(parameter) {
    return post('/project/tableColumn/setupTableHead', parameter);
  },

  // 获取表头全部数据
  getAllColumns(parameter) {
    return get('/project/tableColumn/listColumn', parameter);
  },

  // 获取用户设置的表的列的集合
  getSelectedColumn(parameter) {
    return get('/project/tableColumn/getSelectedColumn', parameter);
  },

  // 获取用户展示的列
  listSetupColumn(parameter) {
    return get('/project/tableColumn/listSetupColumn', parameter);
  },

  // 通过项目OID和账号名称获取该账号所属全部角色名称集合
  getRoleNamesByUserName(parameter) {
    return get('/project/plmTeam/getRoleNamesByUserName', parameter);
  },

  // 通过项目OID和账号名称获取该账号所属全部用户组名称集合
  getGroupNamesByUserName(parameter) {
    return get('/project/plmTeam/getGroupNamesByUserName', parameter);
  },

  // 通过项目ID和账号名称获取该项目下账号所属角色的全部权限组的权限集合
  getPermissionByProjectldAndUserName(parameter) {
    return get('/project/plmTeam/getPermissionByProjectIdAndUserName', parameter);
  },

  // // 恢复默认表头
  // export function resetCustomizeHeaders(parameter) {
  //   return get(`/api/v1/2/customize-headers/reset`, parameter, headers);
  // }

  // 表头接口
  getTableViewColumns(parameter) {
    return post(`${PLM_BASE_URL}/fdtable/getTableViewColumns`, parameter, headers);
  },

  // // 获取创建项目类型接口
  getAllInstantiableSubTypes(parameter) {
    return post(`/project/postProxy/project/getSubTypes`, parameter, headers);
  },

  // // 获取所有项目类型接口
  getAllSubTypes(parameter) {
    return post(`/project/postProxy/project/getAllSubTypes`, parameter, headers);
  },

  // 获取对象创建属性接口
  getCreateLayout(parameter) {
    return post(`/project/postProxy/project/getProjectCreateLayout`, parameter, headers);
  },

  // 获取对象编辑属性接口
  getEditLayout(parameter) {
    return post(`${PLM_BASE_URL}/fdattributes/getEditLayout`, parameter, headers);
  },

  // 获取对象详情布局属性
  getInfoLayout(parameter) {
    return post(`${PLM_BASE_URL}/fdattributes/getInfoLayout`, parameter, headers);
  },

  // 获取全量表头
  getAllHeaders(parameter) {
    return post(`${PLM_BASE_URL}/fdtable/getTableViewColumns`, parameter, headers);
  },

  // 获取按钮通用接口
  getActionMenus(parameter) {
    return post(`${PLM_BASE_URL}/fdaction/getActionMenus`, parameter, headers);
  },

  // 通用查人接口
  pagingSearchUser(parameter) {
    return post(`${PLM_BASE_URL}/fdprincipal/pagingSearchUser`, parameter, headers);
  },

  // 查询活动
  findActivity(parameter) {
    return post(`${PLM_BASE_URL}/slnplan/findActivity`, parameter, headers);
  },

  // 获取通用附件接口
  getFileServer(parameter) {
    return post(`${PLM_BASE_URL}/fdcontent/getContentHolderContents`, parameter, headers);
  },

  // 上传对象主内容或者附件
  updateContentFiles(parameter) {
    return upload(`${PLM_BASE_URL}/fdcontent/updateContentFiles`, parameter, headers);
  },

  // 获取除去创建项目之外通用布局接口
  getOtherCreateLayout(parameter) {
    return post(`/project/postProxy/fdattributes/getCreateLayout`, parameter, headers);
  },
  /**获取文档编辑布局 */
  getFileEditLayout(parameter) {
    return post(`/project/postProxy/fdattributes/getEditLayout`, parameter, headers);
  },

  // 获取容器OID
  getContainerOid(parameter) {
    return post(`/project/postProxy/project/getContainerOid`, parameter, headers);
  },

  // 获取流程节点接口--通用
  getReviewInfo(parameter) {
    return post(`/project/postProxy/workflow/getReviewInfo`, parameter, webHeaders);
  },
  // 根据类型获取签审配置信息
  getReviewInfoByType(parameter) {
    return post(`/project/postProxy/risk/getReviewInfoByType`, parameter, webHeaders);
  },
  // 获取选人接口
  getUserData(parameter) {
    return post(`/project/plmTeam/getUserByRoleAndGroup`, parameter);
  },
  // 启动工作流
  startWfProcess(parameter) {
    return post(`/project/postProxy/workflow/startWfProcessor`, parameter, webHeaders);
  },

  // 历时记录
  getObjVersionHistory(parameter) {
    return post(`/project/postProxy/common/getObjVersionHistory`, parameter, webHeaders);
  },
  // 下载主内容或附件
  downloadContent(parameter) {
    return download(`/project/postProxy/common/downloadContent`, parameter, webHeaders);
  },
  // 获取全局枚举
  getEnumeratedSetByName(parameter) {
    return post(`/project/postProxy/report/getEnumeratedSetByName`, parameter, webHeaders);
  },
  // 查看缩略图
  viewDocJpg(parameter) {
    return post(`/project/postProxy/doc/viewDocJpg`, parameter, webHeaders);
  },
  // 判断当前用户是否是管理员
  getGroupNamesByUserName(parameter) {
    return get(`/project/plmTeam/getGroupNamesByUserName`, parameter, webHeaders);
  },
  // 重新提交节点--获取用户
  getProcessorUser(parameter) {
    return get(`/v1/workflowAuth/getProcessorUser`, parameter, webHeaders);
  },
  // 所属wbs阶段
  getProjectCurrentWBSPhases(parameter) {
    return post(`/project/postProxy/risk/getProjectCurrentWBSPhases`, parameter, webHeaders);
  },
  // 获取类型
  getAllConditionByTableName(parameter) {
    return get(`/project/tableOptionalColumn/getAllConditionByTableName`, parameter, headers);
  },
  // 校验是否可以启动流程
  checkStarProcess(parameter) {
    return post(`/project/postProxy/workflow/checkStarProcess`, parameter, webHeaders);
  },

  // 预览文档
  previewDoc(parameter) {
    return download(`/project/postProxy/doc/viewDocPdf`, parameter, webHeaders);
  },
  // 项目信息
  queryProjectInfo(parameter) {
    return post(`/project/postProxy/project/queryProjectInfo`, parameter, webHeaders);
  },
  // 临时保存流程处理人信息
  saveOrUpdateProcessorWorkflow(parameter) {
    return post(`/v1/workflow/saveOrUpdateProcessorWorkflow`, parameter);
  },
  // 获取临时流程处理人信息
  getProcessorWorkflow(parameter) {
    return get(`/v1/workflow/getProcessorWorkflow`, parameter, headers);
  },
  // 获取菜单
  getProjectPermission(parameter) {
    return get(`/project/plmTeam/getProjectPermission`, parameter);
  },
  // 根据配置文件获取流程描述
  getProcessDescription(parameter) {
    return post(`/project/postProxy/workflow/getProcessDescription`, parameter, webHeaders);
  },
};
export default commonApi;
