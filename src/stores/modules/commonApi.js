import { defineStore } from 'pinia';
import { getActionMenus } from '@/api/common';

export const useCommonApi = defineStore('commonApi', {
  state: () => ({
    btnMenu: [],
    projectShortName: '',
    taskAmount: {},
    isFirst: false,
  }),
  actions: {
    // 获取按钮菜单数据
    async getBtnMenus(parmas) {
      const { success, data } = await getActionMenus(parmas);
      if (success) {
        return data;
      }
    },
  },
});
