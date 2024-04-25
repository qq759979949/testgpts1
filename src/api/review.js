import { post } from '@/utils/request';

const headers = {
  'Content-Type': 'multipart/form-data',
};
const headers2 = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
const reviewApi = {
  /**查询评审列表 */
  getReviewObjects(parameter) {
    return post('/project/postProxy/review/getReviewObjects', parameter, headers);
  },
  /**删除评审列表 */
  deleteReviewObject(parameter) {
    return post('/project/postProxy/review/deleteReviewObject', parameter, headers2);
  },
  /**获取订货号 */
  getOrderNumberList(parameter) {
    return post('/project/postProxy/review/getOrderNumberList', parameter, headers);
  },
  /**获取流程类型 */
  getSdlgReviewConfig(parameter) {
    return post('/project/postProxy/review/getSdlgReviewConfig', parameter, headers);
  },
  /**获取技术评审点: */
  getSdlgReviewPoint(parameter) {
    return post('/project/postProxy/review/getSdlgReviewPoint', parameter, headers);
  },
  /**获取WBS */
  checkPlanAndWbsData(parameter) {
    return post('/project/postProxy/review/checkPlanAndWbsData', parameter, headers);
  },
  /**获取自检人设置 */
  getSdlgReviewElements(parameter) {
    return post('/project/postProxy/review/getSdlgReviewElements', parameter, headers);
  },
  /**获取流程设置 */
  getReviewProcessorConfig(parameter) {
    return post('/project/postProxy/review/getReviewProcessorConfig', parameter, headers);
  },
  /**评审联动属性设置 */
  getSdlgReviewByPoint(parameter) {
    return post('/project/postProxy/review/getSdlgReviewByPoint', parameter, headers);
  },
  /**产品配置 */
  findConfigItemsByProject(parameter) {
    return post('/project/postProxy/productConfig/findConfigItemsByProject', parameter, headers);
  },
  /**项目进度 */
  getProjectSchedule(parameter) {
    return post('/project/postProxy/review/getProjectSchedule', parameter, headers);
  },
  /**交付物汇总 */
  getReviewElementDeliverable(parameter) {
    return post('/project/postProxy/review/getReviewElementDeliverable', parameter, headers);
  },
  /**查询评审附件 */
  getReviewAttachments(parameter) {
    return post('/project/postProxy/review/getReviewAttachments', parameter, headers);
  },
  /**创建、编辑、提交评审 */
  sdlgSubmitReview(parameter) {
    return post('/project/postProxy/review/sdlgSubmitReview', parameter, headers);
  },
  /**编辑获取评审表单数据 */
  getSdlgReviewData(parameter) {
    return post('/project/postProxy/review/getSdlgReviewData', parameter, headers);
  },
  /**获取会议纪要文档 */
  getMeetingMinutesDoc(parameter) {
    return post('/project/postProxy/review/getMeetingMinutesDoc', parameter, headers);
  },
  /**获取评审对象的会议纪要文档 */
  getMeetingMinutesDocByReview(parameter) {
    return post('/project/postProxy/review/getMeetingMinutesDocByReview', parameter, headers);
  },
  /**获取流程中的自检表 */
  getSelfCheckInfo(parameter) {
    return post('/project/postProxy/review/getSelfCheckInfo', parameter, headers);
  },
  /**流程中自检信息提交 */
  submitSelfCheck(parameter) {
    return post('/project/postProxy/review/submitSelfCheck', parameter, headers);
  },
  /**流程中自检提交交付物 */
  uploadDeliverableFile(parameter) {
    return post('/project/postProxy/review/uploadDeliverableFile', parameter, headers);
  },
  // 更新目标指标
  updateTargetIndicator(parameter) {
    return post('/project/postProxy/review/updateTargetIndicator', parameter, headers);
  },
  // 修改完善节点校验目标指标和自检结果
  checkTargetIndicatorAndSelfCheck(parameter) {
    return post('/project/postProxy/review/checkTargetIndicatorAndSelfCheck', parameter, headers);
  },
  // 评审上传附件
  uploadReviewAttachments(parameter) {
    return post('/project/postProxy/review/uploadReviewAttachments', parameter, headers);
  },
  // 评审上传会议纪要
  updateReviewDoc(parameter) {
    return post('/project/postProxy/review/updateReviewDoc', parameter, headers);
  },
  // 查询产品配置是否有填过数据
  hasConfigItems(parameter) {
    return post('/project/postProxy/productConfig/hasConfigItems', parameter, headers);
  },
  // // 产品配置下载图片
  // updateReviewDoc(parameter) {
  //   return post('/project/postProxy/review/updateReviewDoc', parameter, headers);
  // },
};
export default reviewApi;
