import { post, get, download } from '@/utils/request';
// 获取计划树
const headers = {
  'Content-Type': 'multipart/form-data',
};
export function getAllByProjectId(parameter) {
  return get(`/v1/planActivityAuth/getAllByProjectId`, parameter);
}

export function statisticWorkLoadAmount(parameter) {
  return post(`/v1/planActivityAuth/statisticWorkLoadAmount`, parameter);
}
export function getProjectDetail(parameter) {
  return get(`/v1/planActivityAuth/detail`, parameter);
}

// 保存项目
export function savePlanActivity(parameter) {
  return post(`/project/postProxy/plan/savePlanActivity`, parameter, headers);
}

// 查询项目资源
export function queryProjectResource(parameter) {
  return post(`/project/postProxy/plan/queryProjectResource`, parameter, headers);
}

// 重启任务
export function reopenTask(parameter) {
  return post(`/project/postProxy/plan/reopenTask`, parameter, headers);
}

// 撤销发布
export function unReleaseActivity(parameter) {
  return post(`/project/postProxy/plan/unReleaseActivity`, parameter, headers);
}

// 发布任务
export function releaseActivity(parameter) {
  return post(`/project/postProxy/plan/releaseActivity`, parameter, headers);
}

// 获取可选项目模板
export function getAllTemplePlans(parameter) {
  return post(`/project/postProxy/plan/getAllTemplePlans`, parameter, headers);
}
//  根据模板创建计划活动
export function createPlanByTemplate(parameter) {
  return post(`/project/postProxy/plan/createPlanByTemplate`, parameter, headers);
}
// 从其他项目复制
export function copyPlanActivityByProject(parameter) {
  return post(`/project/postProxy/plan/copyPlanActivityByProject`, parameter, headers);
}
// 导出计划
export function exportPlanActivities(parameter) {
  return download('/project/postProxy/plan/exportPlanActivities', parameter, headers);
}
// 导入计划
export function importPlanActivities(parameter) {
  return post(`/project/postProxy/plan/importPlanActivities`, parameter, headers);
}
// 邮件通知
export function emailNotice(parameter) {
  return post(`/v1/workflow/notice`, parameter, headers);
}
// 企业微信通知
export function wxNotice(parameter) {
  return post(`/v1/workflow/wxNotice`, parameter, headers);
}
// 更新项目进度
export function updateProjectProgress(parameter) {
  return post(`/project/postProxy/project/updateProjectProgress`, parameter, headers);
}
const planApi = {
  // 获取交付物内容
  getDeliverableByObject(parameter) {
    return post(`/project/postProxy/plan/getDeliverableByObject`, parameter, headers);
  },
  // 创建交付物--本地上传文件
  CreateDeliverableAndDoc(parameter) {
    return post(`/project/postProxy/deliverable/CreateDeliverableAndDoc`, parameter, headers);
  },
  // 创建交付物--关联系统文件
  CreateDeliverable(parameter) {
    return post(`/project/postProxy/deliverable/CreateDeliverable`, parameter, headers);
  },
  // 创建交付物--搜索数据
  queryWTObject(parameter) {
    return post(`/project/postProxy/deliverable/queryWTObject`, parameter, headers);
  },

  // 编辑交付物--本地上传文件
  updateDeliverableAndDoc(parameter) {
    return post(`/project/postProxy/deliverable/updateDeliverableAndDoc`, parameter, headers);
  },
  // 创建交付物--关联系统文件
  updateDeliverable(parameter) {
    return post(`/project/postProxy/deliverable/updateDeliverable`, parameter, headers);
  },
  // 批量移除交付物
  deleteDeliverable(parameter) {
    return post(`/project/postProxy/deliverable/deleteDeliverable`, parameter, headers);
  },

  /**资源负载 */
  getResourceLoadingAllInfo(parameter) {
    return post(`/project/postProxy/plan/getResourceLoadingAllInfo`, parameter, headers);
  },
  /**查询项目计划阶段时间 */
  getTargetCheckTime(parameter) {
    return post(`/project/postProxy/plan/getTargetCheckTime`, parameter, headers);
  },

  /**交付物汇总 */
  queryAllDeliverableByProject(parameter) {
    return post(`/project/postProxy/deliverable/queryAllDeliverableByProject`, parameter, headers);
  },
  /**批量创建交付物 */
  batchCreateDeliverable(parameter) {
    return post(`/project/postProxy/deliverable/BatchCreateDeliverable`, parameter, headers);
  },
  // 获取项目计划所有阶段
  getAllPlanActivityStage(parameter) {
    return post(`/project/postProxy/plan/getAllPlanActivityStage`, parameter, headers);
  },
  // 交付物获取文件地址
  getParentActivity(parameter) {
    return post(`/project/postProxy/deliverable/getParentActivity`, parameter, headers);
  },
  // 资源负载获取项目
  getResourceLoading(parameter) {
    return post(`/project/postProxy/plan/getResourceLoading`, parameter, headers);
  },
};
export default planApi;
