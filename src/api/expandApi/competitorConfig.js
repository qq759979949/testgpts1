// 产品和竞品配置参数 接口API的集合
// import { PLM_BASE_URL } from '@/api/url';
import { post, download, upload } from '@/utils/request';
const headers = {
  'Content-Type': 'multipart/form-data',
};

const headers2 = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

const competitorConfigApi = {
  // 上传项目附件
  uploadPiProjectAttachment(parameter) {
    return post(`/project/postProxy/project/uploadPiProjectAttachment`, parameter, headers);
  },
  // 获取项目附件
  queryPiProjectAttachment(parameter) {
    return post(`/project/postProxy/project/queryPiProjectAttachment`, parameter, headers);
  },
  // 删除项目附件
  deletePiProjectAttachment(parameter) {
    return post(`/project/postProxy/project/deletePiProjectAttachment`, parameter, headers);
  },
  // 导出流程详情报表
//   exportProcessDetail(parameter) {
//     return download(`/project/postProxy/report/exportProcessDetail`, parameter, headers);
//   },

};

export default competitorConfigApi;
