import { post, download } from '@/utils/request';
const header = {
  'Content-Type': 'multipart/form-data',
};
const configApi = {
  /**查询产品配置库 */
  queryAllConfigLibrary(parameter) {
    return post(`/project/postProxy/productConfig/queryAllConfigLibrary`, parameter, header);
  },
  // 保存产品配置库
  saveConfigLibrary(parameter) {
    return post(`/project/postProxy/productConfig/saveConfigLibrary`, parameter, header);
  },
  // 批量删除
  deleteConfigLibraries(parameter) {
    return post(`/project/postProxy/productConfig/deleteConfigLibraries`, parameter, header);
  },
  // 修改产品配置
  updateConfigLibraries(parameter) {
    return post(`/project/postProxy/productConfig/updateConfigLibraries`, parameter, header);
  },
  // 查询项目关联的产品配置
  findConfigItemsByProject(parameter) {
    return post(`/project/postProxy/productConfig/findConfigItemsByProject`, parameter, header);
  },
  // 保存产品配置项所填内容
  saveConfigItemValues(parameter) {
    return post(`/project/postProxy/productConfig/saveConfigItemValues`, parameter, header);
  },
  // 更新产品配置
  updateConfigItem(parameter) {
    return post(`/project/postProxy/productConfig/updateConfigItem`, parameter, header);
  },
  // 重新加载
  reLoadConfigItem(parameter) {
    return post(`/project/postProxy/productConfig/reLoadConfigItem`, parameter, header);
  },
  // 导入
  importConfigLibrary(parameter) {
    return post(`/project/postProxy/productConfig/importConfigLibrary`, parameter, header);
  },
  // 导出
  exportConfigLibrary(parameter) {
    return download(`/project/postProxy/productConfig/exportConfigLibrary`, parameter, header);
  },
  // 裁剪删除配置项内容
  deleteConfigItemValues(parameter) {
    return post(`/project/postProxy/productConfig/deleteConfigItemValues`, parameter, header);
  },
};

export default configApi;
