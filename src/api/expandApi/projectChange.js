/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-12-19 15:57:09
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-09 09:24:50
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

const projectChangeApi = {
  // 查询项目管理变更表格
  queryChangeRequests(parameter) {
    return post(`/project/postProxy/change/queryChangeRequests`, parameter, webHeaders);
  },
  // 获取变更全部表头
  listDictItem(parameter) {
    return get(`/system/dict/listDictItem`, parameter);
  },
  // 查询可变更属性值
  getChangeAttrLayout(parameter) {
    return post(`/project/postProxy/change/getChangeAttrLayout`, parameter, webHeaders);
  },
  // 查询里程碑计划可变更属性
  getInfoLayout(parameter) {
    return post(`/project/postProxy/fdattributes/getInfoLayout`, parameter, webHeaders);
  },
  // 保存变更
  saveChangeRequest(parameter) {
    return post(`/project/postProxy/change/saveChangeRequest`, parameter, webHeaders);
  },
  // 修改变更
  editChangeRequest(parameter) {
    return post(`/project/postProxy/change/editChangeRequest`, parameter, webHeaders);
  },
  // 项目阶段导航
  getProjectMileStonePlan(parameter) {
    return post(`/project/postProxy/workflow/getProjectMileStonePlan`, parameter, headers);
  },
  // 获取变更后的数据详情
  queryChangeRequestDetails(parameter) {
    return post(`/project/postProxy/change/queryChangeRequestDetails`, parameter, headers);
  },
  // 批量删除变更
  deleteChangeRequests(parameter) {
    return post(`/project/postProxy/change/deleteChangeRequests`, parameter, headers);
  },
  // 薪酬包添加成员校验
  checkAddUserRewards(parameter) {
    return post(`/project/postProxy/change/checkAddUserRewards`, parameter, headers);
  },
  // 判断是否可以创建变更
  hasChangeProcess(parameter) {
    return post(`/project/postProxy/change/hasChangeProcess`, parameter, headers);
  },
  // 获取主包、配包表格数据
  queryChangeMemberInfoBuilder(parameter) {
    return post(`/project/postProxy/change/queryChangeMemberInfoBuilder`, parameter, headers);
  },
  // 查询变更流程薪酬包哪些阶段可以编辑
  canChangePhasePercent(parameter) {
    return post(`/project/postProxy/change/canChangePhasePercent`, parameter, headers);
  },
  // 变更校验配包成员部门信息
  checkSecondMember(parameter) {
    return post(`/project/postProxy/change/checkSecondMember`, parameter, headers);
  },
  // 变更校验配包成员部门信息
  getCurrentStage(parameter) {
    return post(`/project/postProxy/change/getCurrentStage`, parameter, headers);
  },
  // 校验是否有正在运行的评价流程
  hasEvaluationProcess(parameter) {
    return post(`/project/postProxy/change/hasEvaluationProcess`, parameter, headers);
  },
};
export default projectChangeApi;
