import { PLM_BASE_URL } from '@/api/url';
import { post, download, upload } from '@/utils/request';
/**windchill接口请求头 */
const wcHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
/**中台接口请求头 */
const webHeaders = {
  'Content-Type': 'multipart/form-data',
};

// 获取文件夹树结构
export function getFolderTree(parameter) {
  return post(`${PLM_BASE_URL}/fdfolder/getFolderTree`, parameter, wcHeaders);
}

// 获取文件夹内容
export function getFolderContents(parameter) {
  return post(`${PLM_BASE_URL}/fdfolder/getFolderContents`, parameter, wcHeaders);
}

// 创建文档
export function createObject(parameter) {
  return post(`${PLM_BASE_URL}/fdform/createObject`, parameter, webHeaders);
}

// 启动文档签审
export function startDocWfProcess(parameter) {
  return post(`${PLM_BASE_URL}/fddoc/startDocWfProcess`, parameter, wcHeaders);
}

// 获取流程选人(创建对象界面)
export function getPageSelectPrincipal(parameter) {
  return post('/project/pipdc/foundation/workflow/getPageSelectPrincipal', parameter);
}

// 创建（上传）文档
export function createDoc(parameter) {
  return upload('/project/pipdc/foundation/doc/createDoc', parameter);
}

// 下载文档
export function downloadDoc(parameter) {
  return download('/project/pipdc/foundation/doc/downloadDoc', parameter);
}

const fileApi = {
  /**获取文件树 */
  getFolderTree(parameter) {
    return post(`/project/postProxy/deliverable/getFolderTree`, parameter, webHeaders);
  },
  /**文件列表 */
  // getFolderContents(parameter) {
  //   return post(`/project/postProxy/fdfolder/getFolderContents`, parameter, webHeaders);
  // },
  getFolderContents(parameter) {
    return post(`/project/postProxy/doc/getFolderContents`, parameter, webHeaders);
  },

  /**获取文档类型 */
  getCreateType(parameter) {
    return post(`/project/postProxy/doc/getAllInstantiableSubTypes`, parameter, webHeaders);
  },
  /**新建文档 */
  saveDocument(parameter) {
    return post(`/project/postProxy/doc/saveDocument`, parameter, webHeaders);
  },
  /**编辑文档 */
  editDocument(parameter) {
    return post(`/project/postProxy/doc/editDocument`, parameter, webHeaders);
  },
  /**获取主内容和附件内容OID */
  getContentHolderContents(parameter) {
    return post(`/project/postProxy/fdcontent/getContentHolderContents`, parameter, webHeaders);
  },
  /**下载文档 */
  downloadContent(parameter) {
    // return download(`/project/postProxy/fdcontent/downloadContent`, parameter, webHeaders);
    return download(`/project/postProxy/common/downloadContent`, parameter, webHeaders);
  },
  /**删除文档 */
  deleteDocument(parameter) {
    return post(`/project/postProxy/doc/deleteDocument`, parameter, webHeaders);
  },
  /**检入文档 */
  checkinObj(parameter) {
    return post(`/project/postProxy/fdcore/checkinObj`, parameter, webHeaders);
  },
  /**检出文档 */
  // checkoutObj(parameter) {
  //   return post(`/project/postProxy/fdcore/checkoutObj`, parameter, webHeaders);
  // },
  checkoutObj(parameter) {
    return post(`/project/postProxy/doc/checkoutObj`, parameter, webHeaders);
  },
  /**撤销检出 */
  undoCheckoutObj(parameter) {
    return post(`/project/postProxy/fdcore/undoCheckoutObj`, parameter, webHeaders);
  },
  /**修订文档 */
  reviseObj(parameter) {
    return post(`/project/postProxy/fdcore/reviseObj`, parameter, webHeaders);
  },
  /**重命名 */
  renameDoc(parameter) {
    return post(`/project/postProxy/doc/renameDoc`, parameter, webHeaders);
  },
  /**获取文档生命周期 */
  queryDocStates(parameter) {
    return post(`/project/postProxy/doc/queryDocStates`, parameter, webHeaders);
  },
  /**设置状态 */
  setDocState(parameter) {
    return post(`/project/postProxy/doc/setDocState`, parameter, webHeaders);
  },
  /**获取文档详情布局 */
  getInfoLayout(parameter) {
    // return post(`/project/postProxy/fdattributes/getInfoLayout`, parameter, webHeaders);
    return post(`/project/postProxy/doc/getDocDetails`, parameter, webHeaders);
  },
  /**查询文档 */
  queryDocs(parameter) {
    return post(`/project/postProxy/doc/queryDocs`, parameter, webHeaders);
  },
  /**移动文档 */
  moveDocs(parameter) {
    return post(`/project/postProxy/doc/moveDocs`, parameter, webHeaders);
  },
  /**批量下载文档 */
  downloadDocContents(parameter) {
    return download(`/project/postProxy/doc/downloadDocContents`, parameter, webHeaders);
  },
};
export default fileApi;
