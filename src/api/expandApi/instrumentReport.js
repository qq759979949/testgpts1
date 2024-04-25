/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-12-19 15:57:09
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-01-15 14:27:38
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\api\expandApi\commonApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { post, get, upload } from '@/utils/request';
const headers = {
  // "Content-Type": "application/x-www-form-urlencoded",
  'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
};
/**中台接口请求头 */
const webHeaders = {
  'Content-Type': 'multipart/form-data',
};

const instrumentReportApi = {
  // 甘特图
  queryPhaseGanttReport(parameter) {
    return post(`/project/postProxy/report/queryPhaseGanttReport`, parameter, webHeaders);
  },
  // 工作量统计
  getWorkloadDataByProjectOid(parameter) {
    return post(`/project/postProxy/report/getWorkloadDataByProjectOid`, parameter, webHeaders);
  },
  // 项目质量看板
  queryProjectQualityReport(parameter) {
    return post(`/project/postProxy/report/queryProjectQualityReport`, parameter, webHeaders);
  },
  // 任务状态统计
  getAllPlanActivityEndNodes(parameter) {
    return post(`/project/postProxy/report/getAllPlanActivityEndNodes`, parameter, webHeaders);
  },
};
export default instrumentReportApi;
