import { post } from '@//utils/request';

const headers = {
  'Content-Type': 'multipart/form-data',
};
const baseLineApi = {
  /**查询基线列表 */
  queryBaselines(parameter) {
    return post('/project/postProxy/baseline/queryBaselines', parameter, headers);
  },
  /**创建基线 */
  createBaseline(parameter) {
    return post('/project/postProxy/baseline/createBaseline', parameter, headers);
  },
  /**删除基线 */
  deleteBaselines(parameter) {
    return post('/project/postProxy/baseline/deleteBaselines', parameter, headers);
  },
};
export default baseLineApi;
