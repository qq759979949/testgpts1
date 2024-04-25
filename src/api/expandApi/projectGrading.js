/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-12-19 15:57:09
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-01-17 15:31:08
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

const projectGradingApi = {
  // 获取定级的流程设置
  getReviewInfo(parameter) {
    return post(`/project/postProxy/workflow/getReviewInfo`, parameter, webHeaders);
  },
  // 获取定级材料
  getGradedMaterialsInfo(parameter) {
    return post(`/project/postProxy/workflow/getGradedMaterialsInfo`, parameter, webHeaders);
  },
  // 获取定级列表
  getProjectGradeList(parameter) {
    return post(`/project/postProxy/projectRewards/getProjectGradeList`, parameter, webHeaders);
  },
  // 获取薪酬包主包金额
  getProjectRewardsByOid(parameter) {
    return post(`/project/postProxy/projectRewards/getProjectRewardsByOid`, parameter, webHeaders);
  },
  // 维护项目等级
  completeMaintainProjectLevelTask(parameter) {
    return post(`/project/postProxy/workflow/completeMaintainProjectLevelTask`, parameter, webHeaders);
  },
  // // 校验是否可以启动定级流程
  // checkStarProcess(parameter) {
  //   return post(`/project/postProxy/workflow/checkStarProcess`, parameter, webHeaders);
  // },
};
export default projectGradingApi;
